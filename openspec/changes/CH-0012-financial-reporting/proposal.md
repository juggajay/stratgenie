# Change CH-0012: Statutory Financial Reporting Engine

## Why

NSW strata schemes cannot hold an AGM without a consolidated financial statement. The *NSW Strata Schemes Management Regulation 2016* mandates a specific format called the "Statement of Key Financial Information" that shows opening balances, income, expenditure, and closing balances for both the Administrative Fund and Capital Works Fund.

While CH-0011 introduced a basic Financial Report Engine, it lacks the statutory structure required for NSW compliance. This change adds the proper statutory format with fund-level aggregation and auto-filing to the Compliance Vault.

## What Changes

### Data Model
- Add `fund` field to `transactions` table (`admin` | `capital_works`) with default mapping from category
- Add `openingBalanceAdmin` and `openingBalanceCapital` fields to `schemes` table (for first-year setup)

### Backend
- `calculateStatutoryTotals` helper: Aggregates transactions by fund, maps categories to statutory buckets
- `generateStatutoryFinancialReport` action: Produces structured data for PDF generation

### Frontend
- PDF template using `@react-pdf/renderer` with 3-page structure:
  - Page 1: Executive Summary (The Statutory Table)
  - Page 2: Admin Fund Detail (Income/Expense breakdown)
  - Page 3: Capital Works Fund Detail
- Report preview dialog with financial year selector
- Auto-file to Compliance Vault with `vaultCategory: 'financials'`

## Impact

- **Affected specs:** `finance`
- **Affected code:**
  - `convex/schema.ts` - Add fund field to transactions, opening balance fields to schemes
  - `convex/lib/financial-reporting.ts` - Aggregation logic
  - `convex/actions/reporting.ts` - PDF generation action
  - `components/reports/financial-statement-pdf.tsx` - PDF template
  - `components/reports/report-preview-dialog.tsx` - Preview UI
- **Prerequisites:** CH-0011 (Compliance Vault) for auto-filing functionality
