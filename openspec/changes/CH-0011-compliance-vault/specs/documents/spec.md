# Spec Deltas: Documents Capability

## ADDED Requirements

### Requirement: Document Categorization
The system SHALL assign a `category` to every document created by the system.

Category mappings:
- Secretary Agent outputs → `governance` (Vault Slot: "AGM Records")
- Postman Agent outputs → `revenue` (Vault Slot: "Levy Records")
- Treasurer Reports → `financials` (Vault Slot: "Annual Statements")
- Fire Safety documents → `fire_safety`
- Insurance documents → `insurance`

#### Scenario: Auto-categorize AGM notice
- **WHEN** the Secretary Agent generates an AGM notice
- **THEN** the document is saved with `category: 'governance'`
- **AND** it appears in the "AGM Records" vault slot

#### Scenario: Auto-categorize levy notice
- **WHEN** the Postman Agent generates a levy notice
- **THEN** the document is saved with `category: 'revenue'`
- **AND** it appears in the "Levy Records" vault slot

### Requirement: Financial Report Generation
The system SHALL provide the ability to generate a consolidated Financial Statement PDF from transaction data.

#### Scenario: Generate annual financial statement
- **WHEN** the user requests a financial report for a date range
- **THEN** the system queries all approved transactions in that range
- **AND** groups them by category (Repairs, Insurance, etc.)
- **AND** calculates totals (Income vs Expense)
- **AND** generates a "Statement of Financial Performance" PDF
- **AND** saves it to documents with `category: 'financial_report'`

### Requirement: Vault Slot Assignment
The system SHALL assign documents to appropriate vault slots based on their category and year.

#### Scenario: Document assigned to vault slot
- **WHEN** a document is created with a category
- **THEN** it is assigned to the corresponding vault slot
- **AND** the vault slot reflects the document's financial year
