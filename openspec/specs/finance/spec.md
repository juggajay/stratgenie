# finance Specification

## Purpose
TBD - created by archiving change CH-0003-treasurer-agent-mvp. Update Purpose after archive.
## Requirements
### Requirement: Invoice Entity

The system SHALL support Invoice records to track uploaded financial documents.

Fields:
- `id`: Unique identifier
- `schemeId`: Reference to the scheme (required)
- `fileId`: Reference to stored file (Convex file storage)
- `fileName`: Original file name
- `status`: One of `pending`, `extracted`, `failed`
- `extractedData`: JSON object with extraction results (optional)
- `createdAt`: Timestamp of upload
- `extractedAt`: Timestamp when extraction completed (optional)

#### Scenario: Invoice belongs to one scheme

- **GIVEN** an Invoice is uploaded for scheme A
- **WHEN** a user from scheme B queries their invoices
- **THEN** they SHALL NOT see invoices from scheme A

#### Scenario: Invoice status transitions

- **GIVEN** an Invoice is uploaded
- **WHEN** the file is saved
- **THEN** status SHALL be `pending`
- **AND** extraction SHALL be triggered automatically

---

### Requirement: Financial Transaction Entity

The system SHALL support FinancialTransaction records to track financial ledger entries.

Fields:
- `id`: Unique identifier
- `schemeId`: Reference to the scheme (required)
- `invoiceId`: Reference to source invoice (optional)
- `type`: One of `expense`, `income`
- `amount`: Total amount in cents (Australian dollars)
- `gst`: GST component in cents (Australian dollars)
- `description`: Human-readable description
- `vendorName`: Name of vendor/payee (optional)
- `invoiceDate`: Date on the invoice (optional)
- `category`: Expense category (optional, e.g., "repairs", "insurance", "utilities", "admin")
- `status`: One of `draft`, `approved`, `paid`
- `createdAt`: Timestamp of creation
- `approvedAt`: Timestamp when approved (optional)
- `approvedBy`: User who approved (optional)

#### Scenario: Transaction belongs to one scheme

- **GIVEN** a FinancialTransaction is created for scheme A
- **WHEN** a user from scheme B queries their transactions
- **THEN** they SHALL NOT see transactions from scheme A

#### Scenario: Transaction status transitions

- **GIVEN** a FinancialTransaction with status `draft`
- **WHEN** the user approves the transaction
- **THEN** status SHALL transition to `approved`
- **AND** `approvedAt` timestamp SHALL be recorded
- **AND** `approvedBy` SHALL record the approving user

#### Scenario: Amounts stored in cents

- **GIVEN** an invoice for $440.00 (including $40.00 GST)
- **WHEN** a FinancialTransaction is created
- **THEN** `amount` SHALL be 44000 (cents)
- **AND** `gst` SHALL be 4000 (cents)

---

### Requirement: Invoice Extraction Workflow

The system SHALL provide AI-powered extraction of structured data from uploaded invoices.

The Treasurer Agent MUST perform the following steps upon file upload:
1. **Ingest:** Save file to Convex file storage
2. **Extract:** Use AI (OpenAI GPT-4o) to identify vendor, date, amounts
3. **Parse:** Extract `Total Amount` (inclusive of GST) and `Tax Amount` separately
4. **Classify:** Attempt to categorize the expense (e.g., "Repairs", "Insurance", "Utilities")
5. **Draft:** Create a FinancialTransaction with status `draft`

#### Scenario: User uploads plumber invoice

- **GIVEN** a user uploads a PDF invoice for $440.00 (including $40.00 GST)
- **WHEN** the `extractInvoiceData` action runs
- **THEN** a new FinancialTransaction SHALL be created
- **AND** `amount` SHALL be 44000
- **AND** `gst` SHALL be 4000
- **AND** `status` SHALL be `draft`
- **AND** the invoice status SHALL be `extracted`

#### Scenario: Extraction fails gracefully

- **GIVEN** a user uploads an unreadable or corrupt file
- **WHEN** the extraction fails
- **THEN** the invoice status SHALL be `failed`
- **AND** no FinancialTransaction SHALL be created
- **AND** the user SHALL be notified of the failure

#### Scenario: Human review required before approval

- **GIVEN** an extracted FinancialTransaction exists with status `draft`
- **WHEN** a user reviews the extracted data
- **THEN** the system SHALL display the original invoice alongside extracted values
- **AND** the user SHALL be able to correct any errors
- **AND** explicit approval SHALL be required before status becomes `approved`

---

### Requirement: Invoice Upload Interface

The system SHALL provide a user-friendly interface for uploading invoices.

#### Scenario: Drag-and-drop upload

- **GIVEN** a user is on the dashboard
- **WHEN** they drag a PDF file onto the upload zone
- **THEN** the file SHALL be uploaded
- **AND** extraction SHALL begin automatically
- **AND** a loading indicator SHALL be displayed

#### Scenario: File type validation

- **GIVEN** a user attempts to upload a file
- **WHEN** the file is not a supported format (PDF, PNG, JPG, JPEG)
- **THEN** the upload SHALL be rejected
- **AND** an error message SHALL be displayed

---

### Requirement: Invoice Review Interface

The system SHALL provide a side-by-side review interface for verifying extracted data.

#### Scenario: Review dialog layout

- **GIVEN** an invoice has been extracted
- **WHEN** the user opens the review dialog
- **THEN** the original invoice SHALL be displayed on the left (PDF viewer)
- **AND** the extracted data SHALL be displayed on the right (editable form)
- **AND** "Approve" and "Reject" actions SHALL be available

#### Scenario: User corrects extraction errors

- **GIVEN** the AI extracted an incorrect amount
- **WHEN** the user edits the amount field
- **THEN** the corrected value SHALL be saved
- **AND** the original AI extraction SHALL be preserved for audit purposes

