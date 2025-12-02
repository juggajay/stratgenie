# Change: Levy Income Engine MVP

## Why

A strata scheme cannot operate without income. Calculating levies manually (e.g., "$50,000 budget divided by 23 lots with different unit entitlements") is complex and error-prone.

Currently, the system has no concept of:
- **Lots** (individual apartments/units in a scheme)
- **Unit Entitlements** (the legal basis for dividing costs)
- **Levy Runs** (bulk billing events)

The Treasurer must calculate each owner's share manually, which is:
- Time-consuming (hours per quarter)
- Error-prone (rounding issues, calculation mistakes)
- Hard to audit (no paper trail)

Automation here saves the Treasurer hours of work and ensures mathematical accuracy.

## What Changes

### New Entities

1. **Lot** (in schemes capability)
   - Represents an individual apartment/unit in the scheme
   - Tracks owner details and unit entitlement (voting/paying power)
   - Enables the "Strata Roll" - the official register of lots

2. **LevyRun** (in finance capability)
   - Represents a bulk billing event (e.g., "Q1 2026 Admin Fund")
   - Tracks total budget, due date, fund type, period

3. **LevyInvoice** (in finance capability)
   - The individual bill for a specific lot
   - Links to the LevyRun and Lot
   - Stores calculated amount

### New Features

- **Strata Roll Management**: CRUD interface for lots and owners
- **Levy Calculator**: Input budget → calculate per-lot amounts using unit entitlement
- **Levy Generation**: Create all invoices in one action
- **PDF Notices**: Generate downloadable levy notices (reuse CH-0002 pattern)

## Impact

- **Affected specs**: `schemes` (new Lot entity), `finance` (new LevyRun, LevyInvoice)
- **Affected code**:
  - `convex/schema.ts` - new tables
  - `convex/levies.ts` - new module for levy logic
  - `components/finance/` - new UI components
  - `app/dashboard/finance/` - strata roll and levy generator pages
