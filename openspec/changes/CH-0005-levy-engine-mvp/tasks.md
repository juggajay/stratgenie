# Implementation Tasks

## 1. Backend Schema

- [x] 1.1 Update `convex/schema.ts`: Add `lots` table
  - Fields: `schemeId`, `lotNumber`, `unitEntitlement`, `ownerName`, `ownerEmail`, `ownerAddress`, `createdAt`
  - Index by `schemeId`
  - Index by `schemeId` + `lotNumber` (for uniqueness check)
- [x] 1.2 Update `convex/schema.ts`: Add `levyRuns` table
  - Fields: `schemeId`, `fundType`, `totalAmount`, `periodLabel`, `periodStart`, `periodEnd`, `dueDate`, `status`, `createdAt`
  - Index by `schemeId`
  - Index by `schemeId` + `status`
- [x] 1.3 Update `convex/schema.ts`: Add `levyInvoices` table
  - Fields: `schemeId`, `levyRunId`, `lotId`, `amount`, `status`, `sentAt`, `paidAt`, `createdAt`
  - Index by `schemeId`
  - Index by `levyRunId`
  - Index by `lotId`

## 2. Lot Management (Strata Roll)

- [x] 2.1 Create `convex/lots.ts` with queries and mutations
- [x] 2.2 Implement `listLotsForScheme` query
  - Return all lots for a scheme, sorted by lotNumber
  - Include calculated percentage share
- [x] 2.3 Implement `createLot` mutation
  - Validate lotNumber uniqueness within scheme
  - Validate unitEntitlement is positive integer
- [x] 2.4 Implement `updateLot` mutation
  - Allow editing owner details and entitlement
- [x] 2.5 Implement `deleteLot` mutation
  - Check for existing levy invoices (warn or prevent)
- [x] 2.6 Implement `getTotalUnitEntitlement` query
  - Sum all entitlements for a scheme

## 3. Levy Calculation Engine

- [x] 3.1 Create `convex/levies.ts` with the calculation logic
- [x] 3.2 Implement `calculateLevyAmounts` helper function
  - Input: totalBudget (cents), lots array with entitlements
  - Output: array of { lotId, amount } with rounding handled
  - Use Largest Remainder Method for cent distribution
- [x] 3.3 Implement `previewLevyRun` action
  - Calculate amounts without persisting
  - Return preview data for UI
- [x] 3.4 Implement `createLevyRun` mutation
  - Create LevyRun record with status `draft`
  - Create LevyInvoice for each lot
  - Transactional: all or nothing
- [x] 3.5 Implement `issueLevyRun` mutation
  - Update status from `draft` to `issued`
- [x] 3.6 Implement `listLevyRunsForScheme` query
  - Return all levy runs with invoice counts
- [x] 3.7 Implement `getLevyRunWithInvoices` query
  - Return levy run with all associated invoices and lot details

## 4. Levy Notice PDF Generation

- [ ] 4.1 Create `convex/templates/levy-notice.ts`
  - HTML template for levy notice
  - Include: scheme info, lot details, amount, due date, payment instructions
- [ ] 4.2 Implement `generateLevyNoticePdf` action
  - Reuse PDF generation pattern from CH-0002 (documents)
  - Accept levyInvoiceId, return PDF blob
- [ ] 4.3 Implement `markInvoiceSent` mutation
  - Update status to `sent`, set `sentAt`

## 5. Frontend - Strata Roll

- [x] 5.1 Create `components/levies/strata-roll-list.tsx`
  - Table displaying lots with owner info and entitlements
  - Show percentage share column
  - Actions: Edit, Delete
- [x] 5.2 Create `components/levies/lot-form-dialog.tsx`
  - Modal form for adding/editing lots
  - Fields: Lot Number, Owner Name, Email, Address, Unit Entitlement
  - Validation for required fields
- [x] 5.3 Integrated Strata Roll into Finance page via Sheet drawer
  - Display total unit entitlement
  - "Add Lot" button

## 6. Frontend - Levy Generator

- [x] 6.1 Create `components/levies/levy-generator-dialog.tsx`
  - Wizard-style dialog with Input, Preview, and Success steps
  - Form with: Fund Type, Total Amount, Period Label, Due Date
  - "Preview" button shows calculation in embedded table
- [x] 6.2 Levy preview table embedded in generator dialog
  - Display calculated amounts per lot
  - Show: Lot Number, Owner, Entitlement, Amount, Percentage
  - Footer showing total with balance verification
- [x] 6.3 Create `components/levies/levy-runs-list.tsx`
  - List of levy runs with status
  - "New Levy Run" button opening dialog
  - Actions: Issue (for drafts), Delete (for drafts)

## 7. Frontend - Finance Page Tabs

- [x] 7.1 Update `app/dashboard/finance/page.tsx` with Tabs
  - Tab 1: Expenses (existing invoice/transaction UI)
  - Tab 2: Income / Levies (new levy UI)
- [x] 7.2 Added Sheet component for Strata Roll management
  - Opens as side drawer from Income tab
- [x] 7.3 Created required UI components
  - `components/ui/tabs.tsx`
  - `components/ui/table.tsx`
  - `components/ui/sheet.tsx`
  - `components/ui/alert-dialog.tsx`
  - `components/ui/badge.tsx`

## 8. Dashboard Integration

- [x] 8.1 Strata Roll accessible via "Manage Strata Roll" button in Income tab
- [x] 8.2 Levies accessible via Income/Levies tab in Finance page
- [ ] 8.3 Show pending levy count on dashboard (optional)

## 9. Testing

- [ ] 9.1 Test lot CRUD operations
  - Create, edit, delete lots
  - Verify uniqueness constraint
- [ ] 9.2 Test levy calculation accuracy
  - Test with even division (no remainder)
  - Test with remainder distribution
  - Verify sum equals budget exactly
- [ ] 9.3 Test levy generation workflow
  - Preview → Generate → View invoices
- [ ] 9.4 Test scheme isolation
  - Verify lots/levies only visible to their scheme

## 10. Validation

- [ ] 10.1 Run `openspec validate CH-0005-levy-engine-mvp --strict`
- [ ] 10.2 Run ESLint and fix any issues
- [ ] 10.3 Run TypeScript compiler and fix any type errors
