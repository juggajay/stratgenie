# Design: Levy Calculation Algorithm

## Context

NSW strata schemes divide costs among lot owners based on **Unit Entitlements** - a legal measure defined in the strata plan that represents each lot's share of the building.

For example:
- A 10-lot building might have 100 total unit entitlements
- Lot 1 (penthouse): 15 entitlements (15%)
- Lot 2 (studio): 5 entitlements (5%)
- Lots 3-10 (standard 2BR): 10 entitlements each (10% each)

When a levy of $10,000 is issued:
- Lot 1 pays: $10,000 × 15/100 = $1,500
- Lot 2 pays: $10,000 × 5/100 = $500
- Lots 3-10 pay: $10,000 × 10/100 = $1,000 each

## Goals / Non-Goals

### Goals
- Accurate calculation of levy amounts per lot
- Handle rounding to ensure total collected = budget (no cents lost/gained)
- Support both Admin Fund and Capital Works Fund levies
- Generate PDF notices for distribution

### Non-Goals
- Payment tracking (out of scope for MVP - just generate invoices)
- Automatic email sending (manual download for MVP)
- Multiple levy frequencies (assume quarterly for MVP)
- Arrears tracking

## Decisions

### Decision 1: Store Amounts in Cents

**Choice:** All monetary amounts stored as integers (cents in AUD).

**Rationale:**
- Avoids floating-point precision issues
- Consistent with existing `transactions` table pattern
- $1,234.56 stored as 123456 cents

### Decision 2: Rounding Strategy - "Largest Remainder Method"

**Choice:** Use the Largest Remainder Method for distributing cents.

**Algorithm:**
1. Calculate each lot's exact share: `lotShare = totalBudget × (lotEntitlement / totalEntitlement)`
2. Round each share DOWN to whole cents (floor)
3. Calculate remainder: `remainder = totalBudget - sum(flooredShares)`
4. Distribute remainder cents to lots with the largest fractional parts (one cent each)

**Example:**
- Budget: $100.00 (10,000 cents)
- 3 lots with entitlements: 33, 33, 34 (total: 100)
- Lot 1: 10,000 × 33/100 = 3,300.00 cents → 3,300 cents
- Lot 2: 10,000 × 33/100 = 3,300.00 cents → 3,300 cents
- Lot 3: 10,000 × 34/100 = 3,400.00 cents → 3,400 cents
- Total: 10,000 cents ✓

**Edge case (with remainders):**
- Budget: $100.00 (10,000 cents)
- 3 lots with equal entitlements: 1, 1, 1 (total: 3)
- Lot 1: 10,000 × 1/3 = 3,333.33... → floor = 3,333 cents (remainder 0.33)
- Lot 2: 10,000 × 1/3 = 3,333.33... → floor = 3,333 cents (remainder 0.33)
- Lot 3: 10,000 × 1/3 = 3,333.33... → floor = 3,333 cents (remainder 0.33)
- Sum of floors: 9,999 cents
- Remainder to distribute: 1 cent
- Distribute to lot with largest fractional part (all equal, so Lot 1 gets it)
- Final: 3,334 + 3,333 + 3,333 = 10,000 cents ✓

**Rationale:** This is the mathematically fair approach used in electoral systems (apportionment) and financial calculations. It ensures the sum always equals the budget exactly.

### Decision 3: Fund Types

**Choice:** Support two fund types: `admin` and `capital_works`

**Rationale:** NSW strata law requires separate Admin Fund (operating expenses) and Capital Works Fund (long-term maintenance). Most schemes issue levies for both funds simultaneously but as separate line items.

### Decision 4: Levy Invoice Status

**Choice:** Levy invoices have status: `pending`, `sent`, `paid`

- `pending`: Generated but not distributed
- `sent`: Notice has been downloaded/sent to owner
- `paid`: Payment received (manual update for MVP)

**Rationale:** Simple status tracking without complex payment integration.

## Data Model

```
lots
├── schemeId: Id<"schemes">
├── lotNumber: string         # e.g., "1", "2A", "G01"
├── unitEntitlement: number   # integer, e.g., 15
├── ownerName: string         # e.g., "John Smith"
├── ownerEmail: string        # e.g., "john@example.com"
├── ownerAddress: string?     # mailing address (optional)
└── createdAt: number

levyRuns
├── schemeId: Id<"schemes">
├── fundType: "admin" | "capital_works"
├── totalAmount: bigint       # budget in cents
├── periodLabel: string       # e.g., "Q1 2026"
├── periodStart: number       # timestamp
├── periodEnd: number         # timestamp
├── dueDate: number           # payment due date
├── status: "draft" | "issued"
└── createdAt: number

levyInvoices
├── schemeId: Id<"schemes">
├── levyRunId: Id<"levyRuns">
├── lotId: Id<"lots">
├── amount: bigint            # calculated amount in cents
├── status: "pending" | "sent" | "paid"
├── sentAt: number?           # when notice was downloaded/sent
├── paidAt: number?           # when payment received
└── createdAt: number
```

## Query Flow

```
User: "Generate Q1 levies for $10,000 Admin Fund"
       ↓
1. Fetch all lots for scheme with unit entitlements
       ↓
2. Calculate total entitlements: sum(lot.unitEntitlement)
       ↓
3. For each lot, calculate share using Largest Remainder Method
       ↓
4. Create LevyRun record (status: draft)
       ↓
5. Create LevyInvoice for each lot (status: pending)
       ↓
6. Return preview to user
       ↓
User: "Confirm and Issue"
       ↓
7. Update LevyRun status to "issued"
       ↓
8. Generate PDF notices for download
```

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Incorrect entitlements entered | Wrong levy amounts | Show preview before confirming; allow edits |
| Rounding disputes | Owner complaints | Use standard Largest Remainder Method; show calculation breakdown |
| Missing lots in strata roll | Incomplete billing | Validation: compare lot count to scheme info |
| No email integration | Manual distribution | MVP accepts this; future: add email sending |

## Open Questions

- [ ] Should we support partial payments? (Likely defer to future)
- [ ] Should we integrate with bank feeds for auto-reconciliation? (Definitely defer)
- [ ] Should PDF notices include QR code for payment? (Nice to have, defer)
