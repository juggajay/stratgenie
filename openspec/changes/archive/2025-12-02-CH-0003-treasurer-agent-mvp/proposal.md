# Change: Treasurer Agent MVP (Invoice Extraction)

## Why

Manual data entry is the primary friction for self-managed strata schemes. Volunteers hate typing numbers from PDFs into spreadsheets. Automating invoice extraction proves the "Autonomous" value proposition immediately.

Currently, secretaries and treasurers must:
1. Receive invoices via email or post
2. Manually read and transcribe amounts, dates, vendor details
3. Enter into spreadsheets or accounting software
4. Cross-check for errors

This change automates steps 2-3 by using AI to extract structured data from uploaded invoices.

## What Changes

**Backend:**
- `invoices` table to store uploaded files and extraction status
- `transactions` table for financial ledger entries (expense/income tracking)
- `extractInvoiceData` action using OpenAI GPT-4o for structured extraction
- `uploadInvoice` mutation to handle file upload and trigger extraction

**Frontend:**
- `InvoiceUploadZone` component for drag-and-drop invoice upload
- `InvoiceReviewDialog` for side-by-side PDF preview and extracted data verification
- "Approve" workflow to transition from draft to approved status

**AI Integration:**
- OpenAI GPT-4o (vision) for reading invoice PDFs/images
- Structured JSON output: vendor, date, total_amount, tax_amount, description
- Optional expense categorization (Repairs, Insurance, Utilities, etc.)

## Impact

- Affected specs: `finance` (new capability)
- Affected code:
  - `convex/schema.ts` (new tables: invoices, transactions)
  - `convex/finance.ts` (new)
  - `convex/actions/openai.ts` (new)
  - `components/finance/` (new directory)
  - Dashboard integration for invoice upload

## Risks & Considerations

- **AI Hallucinations:** AI might misread amounts or invent data. Mitigation: Always require human review before approval (Draft-Review-Final pattern).
- **PDF Quality:** Poor scans or handwritten invoices may fail extraction. Mitigation: Show confidence score, allow manual override.
- **GST Handling:** Australian invoices may show GST separately or inclusive. Extraction must handle both formats.
- **API Costs:** OpenAI vision API has costs per call. Consider caching and rate limiting.
- **File Security:** Invoices may contain sensitive information. Store securely, enforce scheme isolation.
