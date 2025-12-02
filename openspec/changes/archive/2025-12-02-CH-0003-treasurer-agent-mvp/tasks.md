# Implementation Tasks

## 1. Backend Schema

- [x] 1.1 Update `convex/schema.ts`: Add `invoices` table
  - Fields: `schemeId`, `fileId`, `fileName`, `status`, `extractedData`, `createdAt`, `extractedAt`
  - Index by `schemeId`
- [x] 1.2 Update `convex/schema.ts`: Add `transactions` table
  - Fields: `schemeId`, `invoiceId`, `type`, `amount`, `gst`, `description`, `vendorName`, `invoiceDate`, `category`, `status`, `createdAt`, `approvedAt`, `approvedBy`
  - Index by `schemeId`, `schemeId` + `status`

## 2. OpenAI Integration

- [x] 2.1 Install OpenAI SDK: `npm install openai`
- [x] 2.2 Create `convex/actions/openai.ts`
  - Configure OpenAI client with API key from environment
  - Implement `extractInvoiceData(fileUrl)` using GPT-4o vision
  - Prompt: Extract vendor, date, total_amount (cents), tax_amount (cents), description
  - Return structured JSON with extraction results
- [x] 2.3 Handle extraction errors gracefully
  - Return structured error response
  - Log failures for debugging

## 3. Backend Mutations/Queries

- [x] 3.1 Create `convex/finance.ts` with queries and mutations
- [x] 3.2 Implement `createInvoice` mutation (renamed from uploadInvoice)
  - Accept file upload via Convex file storage
  - Create invoice record with status `processing`
  - Schedule extraction action
- [x] 3.3 Implement `processInvoiceExtraction` action
  - Fetch file URL from storage
  - Call OpenAI extraction
  - Update invoice with extracted data
  - Create draft transaction if successful
- [x] 3.4 Implement `listInvoicesForScheme` query
  - Return all invoices for a scheme, sorted by createdAt
- [x] 3.5 Implement `listTransactionsForScheme` query
  - Return all transactions for a scheme, optionally filtered by status
- [x] 3.6 Implement `approveTransaction` mutation
  - Change status from `draft` to `approved`
  - Set `approvedAt` and `approvedBy`
- [x] 3.7 Implement `updateTransaction` mutation
  - Allow editing draft transactions (amount, gst, description, etc.)
  - Preserve original extracted values for audit

## 4. Frontend Components

- [x] 4.1 Create `components/finance/invoice-upload-zone.tsx`
  - Drag-and-drop file upload area
  - File type validation (PDF, PNG, JPG, JPEG)
  - Upload progress indicator
  - Follow CLAUDE.md design system
- [x] 4.2 Create `components/finance/invoice-review-dialog.tsx`
  - Shadcn Dialog component
  - Left side: PDF/image viewer (iframe or img tag)
  - Right side: Editable form with extracted data
  - Actions: "Approve", "Edit", "Reject"
- [x] 4.3 Create `components/finance/transaction-list.tsx`
  - Display transactions with status badges
  - Show amount, vendor, date, category
  - Quick actions: View, Approve, Edit

## 5. Dashboard Integration

- [x] 5.1 Add invoice upload zone to dashboard
  - Created dedicated `/dashboard/finance` page with upload zone
- [x] 5.2 Add pending transactions indicator
  - Show count of draft transactions awaiting approval
- [x] 5.3 Wire up invoice review dialog
  - Open on upload completion or from transaction list

## 6. Testing

- [x] 6.1 Test invoice upload with valid PDF
  - Verify file stored correctly
  - Verify extraction triggered
- [x] 6.2 Test extraction with sample invoice
  - Verify extracted amount matches PDF
  - Verify GST calculated correctly
- [x] 6.3 Test transaction approval workflow
  - Verify status transitions correctly
  - Verify timestamps recorded
- [x] 6.4 Test scheme isolation
  - Verify invoices/transactions only visible to their scheme

## 7. Validation

- [x] 7.1 Run `openspec validate CH-0003-treasurer-agent-mvp --strict`
- [x] 7.2 Run ESLint and fix any issues
- [x] 7.3 Run TypeScript compiler and fix any type errors
