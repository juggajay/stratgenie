# Spec Deltas: Finance Capability

## ADDED Requirements

### Requirement: Financial Report Engine
The system SHALL provide an action to generate consolidated financial reports from transaction data.

Report Generation Process:
1. Query all `transactions` in the specified date range
2. Group by `category` (Repairs, Insurance, Administration, etc.)
3. Calculate totals (Income vs Expense)
4. Generate PDF: "Statement of Financial Performance"
5. Save to `documents` with `category: 'financial_report'`

#### Scenario: Generate end-of-year financial report
- **WHEN** the user clicks "Generate End of Year Report" in the Finance tab
- **THEN** the system compiles all approved transactions for the financial year
- **AND** generates a PDF summary with income/expense breakdown
- **AND** saves it to the Vault under "Annual Statements"
- **AND** notifies the user of successful generation

#### Scenario: Financial report shows transaction breakdown
- **WHEN** a financial report is generated
- **THEN** it includes a summary table with:
  - Total income by category
  - Total expenses by category
  - Net position (surplus/deficit)
  - Transaction count per category

### Requirement: Generate Report Button
The Finance tab SHALL include a button to trigger financial report generation.

#### Scenario: User generates report from Finance tab
- **WHEN** the user is on the Finance tab
- **THEN** they see a "Generate End of Year Report" button
- **AND** clicking it shows a date range selector
- **AND** confirming triggers report generation
