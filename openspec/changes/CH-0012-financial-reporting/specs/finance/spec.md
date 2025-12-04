# Spec Deltas: Finance Capability

## ADDED Requirements

### Requirement: Transaction Fund Assignment

The system SHALL support a `fund` field on Financial Transactions to categorize transactions by statutory fund type.

Fields:
- `fund`: One of `admin` (Administrative Fund) or `capital_works` (Capital Works Fund), optional

The system SHALL provide default fund inference based on transaction category:
- Capital Works Fund: `repairs` (major), `other` (when explicitly tagged)
- Administrative Fund: `insurance`, `utilities`, `admin`, `cleaning`, `gardening`, `legal`

#### Scenario: Transaction created with explicit fund

- **GIVEN** a user creates a FinancialTransaction
- **WHEN** they specify `fund: 'capital_works'`
- **THEN** the transaction SHALL be assigned to the Capital Works Fund
- **AND** the explicit value SHALL override any category-based inference

#### Scenario: Transaction created without fund defaults to Admin

- **GIVEN** a user creates a FinancialTransaction with category `insurance`
- **WHEN** no explicit fund is specified
- **THEN** the transaction SHALL default to the Administrative Fund

---

### Requirement: Scheme Opening Balances

The system SHALL support opening balance fields on the Scheme entity for statutory financial reporting.

Fields:
- `openingBalanceAdmin`: Opening balance for Administrative Fund in cents (AUD)
- `openingBalanceCapital`: Opening balance for Capital Works Fund in cents (AUD)
- `financialYearEnd`: Month-day string (e.g., "06-30") indicating the scheme's financial year end

#### Scenario: Opening balances set for first year

- **GIVEN** a scheme is using the system for the first time
- **WHEN** the user sets opening balances via scheme settings
- **THEN** these values SHALL be stored on the scheme record
- **AND** used as the starting point for statutory report calculations

#### Scenario: Subsequent year opening balances

- **GIVEN** a statutory report was generated for a previous financial year
- **WHEN** the user generates a report for the next financial year
- **THEN** the previous year's closing balances SHALL be used as opening balances
- **AND** the system SHALL warn if manually-set values differ from calculated values

---

### Requirement: Statutory Financial Report Generation

The system SHALL provide a `generateStatutoryFinancialReport` action that produces a "Statement of Key Financial Information" compliant with NSW Strata Schemes Management Regulation 2016.

The report MUST include:
1. **Header**: Scheme name, SP number, address, financial year period
2. **Summary Table**: Opening Balance, Total Income, Total Expenditure, Closing Balance (per fund)
3. **Admin Fund Detail**: Income breakdown (Levies, Interest, Other), Expense breakdown by statutory category
4. **Capital Works Fund Detail**: Income breakdown, Expense breakdown for major works

Calculation Rules:
- `Closing Balance = Opening Balance + Total Income - Total Expenditure`
- All amounts in Australian Dollars (displayed) with underlying storage in cents

#### Scenario: Generate statutory report with complete data

- **WHEN** the user clicks "Generate Statutory Report" for FY 2024-25
- **AND** opening balances are set
- **AND** approved transactions exist for the period
- **THEN** the system SHALL aggregate transactions by fund and category
- **AND** generate a PDF with the statutory table format
- **AND** save the PDF to the Compliance Vault with `vaultCategory: 'financials'`

#### Scenario: Generate report with missing opening balances

- **WHEN** the user attempts to generate a statutory report
- **AND** opening balances have not been set
- **THEN** the system SHALL display a warning
- **AND** prompt the user to enter opening balances before proceeding
- **AND** NOT generate an incomplete report

#### Scenario: Report shows correct closing balance calculation

- **GIVEN** Admin Fund opening balance is $10,000.00
- **AND** total Admin Fund income is $25,000.00
- **AND** total Admin Fund expenditure is $18,000.00
- **WHEN** the statutory report is generated
- **THEN** the closing balance SHALL show $17,000.00
- **AND** match the formula: Opening + Income - Expenditure

---

### Requirement: Statutory Category Mapping

The system SHALL map transaction categories to NSW statutory reporting categories.

Administrative Fund Categories:
- **Income**: Levies, Interest Received, Miscellaneous Income
- **Expense**: Building Insurance, Public Liability, Administration, Repairs & Maintenance, Utilities, Cleaning, Gardening, Legal & Professional

Capital Works Fund Categories:
- **Income**: Levies, Interest Received
- **Expense**: Major Works (aggregated by project type: Roofing, Lifts, Painting, Plumbing, Electrical)

#### Scenario: Transaction categorized for statutory report

- **GIVEN** a transaction with category `insurance` and type `expense`
- **WHEN** the statutory report is generated
- **THEN** the transaction SHALL appear under Admin Fund / Building Insurance

#### Scenario: Capital works expense categorization

- **GIVEN** a transaction with `fund: 'capital_works'` and category `repairs`
- **WHEN** the statutory report is generated
- **THEN** the transaction SHALL appear under Capital Works Fund / Major Works

---

### Requirement: Financial Report Preview

The system SHALL provide a preview dialog before generating and saving the statutory financial report.

#### Scenario: User previews report before saving

- **WHEN** the user clicks "Generate Statutory Report"
- **THEN** a dialog SHALL appear with a financial year selector
- **AND** show a preview of the PDF document
- **AND** display "Generate & Save to Vault" and "Cancel" buttons

#### Scenario: User generates and saves report

- **GIVEN** the user is viewing the report preview
- **WHEN** they click "Generate & Save to Vault"
- **THEN** the PDF SHALL be saved to Convex file storage
- **AND** a document record SHALL be created with `type: 'financial_report'`
- **AND** `vaultCategory: 'financials'` and `submissionStatus: 'ready'`
- **AND** a success notification SHALL be displayed
