## ADDED Requirements

### Requirement: Levy Run Entity

The system SHALL support LevyRun records to track bulk billing events.

Fields:
- `id`: Unique identifier
- `schemeId`: Reference to the scheme (required)
- `fundType`: One of `admin` (Admin Fund) or `capital_works` (Capital Works Fund)
- `totalAmount`: Budget amount in cents (AUD)
- `periodLabel`: Human-readable period (e.g., "Q1 2026")
- `periodStart`: Start of billing period (timestamp)
- `periodEnd`: End of billing period (timestamp)
- `dueDate`: Payment due date (timestamp)
- `status`: One of `draft` or `issued`
- `createdAt`: Timestamp of creation

#### Scenario: Levy run belongs to one scheme

- **GIVEN** a LevyRun is created for scheme A
- **WHEN** a user from scheme B queries their levy runs
- **THEN** they SHALL NOT see levy runs from scheme A

#### Scenario: Levy run status transitions

- **GIVEN** a LevyRun with status `draft`
- **WHEN** the user confirms and issues the levies
- **THEN** status SHALL transition to `issued`
- **AND** all associated LevyInvoices SHALL be generated

#### Scenario: Amount stored in cents

- **GIVEN** a levy run for $10,000.00
- **WHEN** the LevyRun is created
- **THEN** `totalAmount` SHALL be 1000000 (cents)

---

### Requirement: Levy Invoice Entity

The system SHALL support LevyInvoice records to track individual lot bills.

Fields:
- `id`: Unique identifier
- `schemeId`: Reference to the scheme (required)
- `levyRunId`: Reference to the parent LevyRun
- `lotId`: Reference to the Lot being billed
- `amount`: Calculated levy amount in cents (AUD)
- `status`: One of `pending`, `sent`, `paid`
- `sentAt`: Timestamp when notice was distributed (optional)
- `paidAt`: Timestamp when payment received (optional)
- `createdAt`: Timestamp of creation

#### Scenario: Levy invoice linked to lot and run

- **GIVEN** a LevyRun is issued for a scheme
- **WHEN** LevyInvoices are generated
- **THEN** each lot in the scheme SHALL have exactly one LevyInvoice
- **AND** each invoice SHALL reference both the LevyRun and the Lot

#### Scenario: Invoice status transitions

- **GIVEN** a LevyInvoice with status `pending`
- **WHEN** the notice is downloaded/sent
- **THEN** status SHALL transition to `sent`
- **AND** `sentAt` timestamp SHALL be recorded

---

### Requirement: Levy Calculation Algorithm

The system SHALL calculate levy amounts using unit entitlements with the Largest Remainder Method.

#### Scenario: Basic levy calculation

- **GIVEN** a budget of $10,000 (1,000,000 cents)
- **AND** Lot 1 has 10 entitlements out of 100 total (10%)
- **WHEN** the levy is calculated
- **THEN** Lot 1's amount SHALL be $1,000 (100,000 cents)

#### Scenario: Rounding with remainder distribution

- **GIVEN** a budget of $100.00 (10,000 cents)
- **AND** 3 lots with equal entitlements of 1 each (total: 3)
- **WHEN** the levy is calculated
- **THEN** each lot's base amount SHALL be floor(10,000 / 3) = 3,333 cents
- **AND** the 1 cent remainder SHALL be distributed to one lot
- **AND** the sum of all amounts SHALL equal exactly 10,000 cents

#### Scenario: Zero budget handling

- **GIVEN** a budget of $0.00
- **WHEN** levy generation is attempted
- **THEN** the system SHALL reject the request
- **AND** display an error message

#### Scenario: No lots registered

- **GIVEN** a scheme with no lots in the strata roll
- **WHEN** levy generation is attempted
- **THEN** the system SHALL reject the request
- **AND** prompt the user to add lots first

---

### Requirement: Levy Generation Interface

The system SHALL provide a user interface for generating levy runs.

#### Scenario: Input levy parameters

- **GIVEN** a user on the levy generation page
- **WHEN** they fill in the form
- **THEN** they SHALL be able to specify:
  - Fund type (Admin or Capital Works)
  - Total budget amount
  - Period label (e.g., "Q1 2026")
  - Due date

#### Scenario: Preview before generation

- **GIVEN** a user has entered levy parameters
- **WHEN** they click "Preview"
- **THEN** a table SHALL display each lot with:
  - Lot number
  - Owner name
  - Unit entitlement
  - Calculated levy amount
- **AND** the total SHALL equal the budget amount

#### Scenario: Confirm and generate

- **GIVEN** a user has previewed the levy calculation
- **WHEN** they click "Generate"
- **THEN** a LevyRun record SHALL be created
- **AND** LevyInvoice records SHALL be created for each lot
- **AND** the user SHALL receive confirmation

---

### Requirement: Levy Notice PDF Generation

The system SHALL generate downloadable PDF levy notices.

#### Scenario: Download individual notice

- **GIVEN** a LevyInvoice exists
- **WHEN** the user clicks "Download Notice"
- **THEN** a PDF SHALL be generated containing:
  - Scheme name and strata number
  - Lot number and owner name
  - Levy amount and due date
  - Fund type and period
  - Payment instructions (placeholder)

#### Scenario: Download all notices

- **GIVEN** a LevyRun with multiple invoices
- **WHEN** the user clicks "Download All Notices"
- **THEN** a ZIP file SHALL be generated
- **AND** it SHALL contain one PDF per lot
