# Implementation Tasks for CH-0012

## Phase 1: Data Model Updates

- [x] 1.1 Add `fund` field to `transactions` table in `convex/schema.ts`
  - Type: `v.optional(v.union(v.literal("admin"), v.literal("capital_works")))`
  - Optional to maintain backwards compatibility with existing transactions
- [x] 1.2 Add opening balance fields to `schemes` table
  - `openingBalanceAdmin: v.optional(v.int64())` - cents (AUD)
  - `openingBalanceCapital: v.optional(v.int64())` - cents (AUD)
  - `financialYearEnd: v.optional(v.string())` - e.g., "06-30" for June 30
- [x] 1.3 Create migration helper to backfill `fund` field on existing transactions using category mapping

## Phase 2: Aggregation Engine

- [x] 2.1 Create `convex/lib/financialReporting.ts` with helper functions
  - `inferFundFromCategory(category)` - returns `admin` or `capital_works`
  - `getStatutoryExpenseCategory(category, fund)` - maps to NSW statutory buckets
- [x] 2.2 Create `getFinancialStats` query in `convex/finance.ts`
  - Input: `schemeId`, `startDate`, `endDate`
  - Output: Structured object with income/expense totals per fund and category
- [x] 2.3 Implement statutory bucket mapping
  - Admin Fund Income: Levies, Interest, Other
  - Admin Fund Expense: Administration, Insurance, Maintenance, Utilities
  - Capital Works Income: Levies, Interest
  - Capital Works Expense: Major Works (Roof, Lifts, Painting, etc.)

## Phase 3: PDF Generation

- [x] 3.1 Install `@react-pdf/renderer` dependency
- [x] 3.2 Create `components/finance/financial-statement-pdf.tsx`
  - Page 1: Statement of Key Financial Information (statutory table)
  - Page 2: Administrative Fund Detail
  - Page 3: Capital Works Fund Detail
- [x] 3.3 Style PDF with professional formatting
  - Scheme header with SP number and address
  - Financial year period
  - Balance calculations with totals

## Phase 4: Report Action

- [x] 4.1 Create `convex/actions/reporting.ts`
  - `generateStatutoryReportData` action
  - `validateReportRequirements` action
  - `saveReportToVault` action
- [x] 4.2 Implement closing balance calculation
  - `Closing Balance = Opening Balance + Total Income - Total Expenditure`
- [x] 4.3 Add validation for required data
  - Warn if opening balances not set for first year
  - Warn if no transactions in selected period

## Phase 5: Preview & Auto-Filing

- [x] 5.1 Create `components/finance/financial-report-dialog.tsx`
  - Financial year selector dropdown
  - PDF preview using `@react-pdf/renderer` PDFViewer
  - "Generate & Save" button
- [x] 5.2 Integrate with Finance tab
  - Add new "Reports" tab to Finance page
  - "Generate Statutory Report" button
- [x] 5.3 Auto-file to Compliance Vault
  - Save PDF to Convex file storage
  - Create document record with `vaultCategory: 'financials'`
  - Set `submissionStatus: 'ready'`

## Phase 6: Opening Balance UI

- [x] 6.1 Add opening balance fields to scheme settings
  - Admin Fund opening balance input
  - Capital Works Fund opening balance input
  - Financial year end selector
- [x] 6.2 Add "Set Opening Balances" prompt for new schemes
  - Show warnings in report dialog when balances are missing
  - Financial Settings section in Scheme Settings form
