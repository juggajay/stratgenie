# Compliance Capability

## Purpose

Ensures all strata scheme operations comply with NSW regulatory requirements under the Strata Schemes Management Act 2015 (SSMA 2015) and NSW Strata Hub reporting standards.

## Legislative Basis

All workflows must comply with:
- **Strata Schemes Management Act 2015 (SSMA 2015)**
- **NSW Strata Hub** reporting standards

---
## Requirements
### Requirement: AGM Notice Period

The system SHALL enforce the statutory notice period for Annual General Meetings.

The Notice of Meeting (Agenda) must be distributed to owners at least **7 days** prior to the meeting when using email distribution.

#### Scenario: Valid AGM notice timing
- **GIVEN** an AGM is scheduled for a specific date
- **WHEN** the Secretary attempts to send the notice
- **THEN** the system SHALL allow sending only if at least 7 days remain before the meeting date

#### Scenario: Insufficient notice period warning
- **GIVEN** an AGM is scheduled for a specific date
- **WHEN** fewer than 7 days remain before the meeting
- **THEN** the system SHALL warn that the notice period is insufficient
- **AND** require explicit acknowledgment before proceeding

---

### Requirement: Strata Hub Annual Report Deadline

The system SHALL track and enforce the Strata Hub annual report submission deadline.

The Annual Report must be submitted within **3 months** of the AGM date.

#### Scenario: Annual report deadline calculation
- **GIVEN** an AGM occurred on a specific date
- **WHEN** the system calculates the reporting deadline
- **THEN** it SHALL set the deadline to exactly 3 months after the AGM date

#### Scenario: Overdue annual report detection
- **GIVEN** an AGM occurred more than 3 months ago
- **WHEN** the annual report has not been submitted
- **THEN** the system SHALL flag the scheme as non-compliant
- **AND** display an urgent warning in the compliance dashboard

---

### Requirement: Strata Hub Update Deadline

The system SHALL track the 28-day deadline for reporting scheme changes to Strata Hub.

Scheme details must be updated within **28 days** of any change (e.g., new Secretary elected, contact details changed).

#### Scenario: Change triggers update reminder
- **GIVEN** a reportable change occurs (e.g., new office bearer elected)
- **WHEN** the change is recorded in the system
- **THEN** a Strata Hub update task SHALL be created with a 28-day deadline

#### Scenario: Overdue Strata Hub update
- **GIVEN** a reportable change occurred more than 28 days ago
- **WHEN** the Strata Hub update has not been completed
- **THEN** the system SHALL flag the pending update as overdue

---

### Requirement: Capital Works Fund Standard Form (2026+)

From April 2026, the system SHALL support the new Capital Works Fund standard form requirements.

All capital works plans must adhere to the new "Standard Form" JSON schema for funding sources and asset lifecycle.

#### Scenario: Standard form compliance after April 2026
- **GIVEN** the current date is April 2026 or later
- **WHEN** a Capital Works Fund plan is created or updated
- **THEN** the system SHALL validate against the standard form JSON schema

#### Scenario: Pre-2026 capital works plans
- **GIVEN** the current date is before April 2026
- **WHEN** a Capital Works Fund plan is created
- **THEN** the system MAY use the legacy format
- **AND** SHALL display a migration notice about upcoming requirements

---

### Requirement: Fund Separation

The system SHALL enforce strict separation between the Administrative Fund and Capital Works Fund.

Levies must be kept in separate funds. Logic must never mix these pools.

#### Scenario: Levy allocation to correct fund
- **GIVEN** a levy contribution is recorded
- **WHEN** the contribution is allocated
- **THEN** it SHALL be assigned to exactly one fund (Admin OR Capital Works)
- **AND** the system SHALL NOT allow splitting a single levy entry across funds

#### Scenario: Prevent fund mixing in payments
- **GIVEN** an invoice is approved for payment
- **WHEN** the payment source is selected
- **THEN** the system SHALL only allow payment from the appropriate fund
- **AND** SHALL prevent using Capital Works funds for administrative expenses (and vice versa)

#### Scenario: Fund balance reporting
- **GIVEN** a user requests financial reports
- **WHEN** the report is generated
- **THEN** Administrative Fund and Capital Works Fund balances SHALL be displayed separately
- **AND** clearly labeled to prevent confusion

---

### Requirement: Invoice ABN/GST Validation

The system SHALL validate invoices against the Australian Business Register (ABR).

Invoices must be validated for valid ABN and GST registration status.

#### Scenario: Valid ABN verification
- **GIVEN** an invoice is submitted with an ABN
- **WHEN** the invoice is processed
- **THEN** the system SHALL verify the ABN against the ABR
- **AND** display the registered business name for confirmation

#### Scenario: Invalid ABN detection
- **GIVEN** an invoice is submitted with an invalid or inactive ABN
- **WHEN** ABR validation is performed
- **THEN** the system SHALL flag the invoice for review
- **AND** warn that the ABN could not be verified

#### Scenario: GST status verification
- **GIVEN** an invoice includes GST charges
- **WHEN** the supplier's ABN is validated
- **THEN** the system SHALL verify the supplier is GST registered
- **AND** warn if GST is claimed but the supplier is not registered

---

### Requirement: Draft-Review-Final Workflow

The system SHALL enforce a draft-review-final pattern for all legal and financial outputs.

Every legal/financial output (AGM minutes, levy notices, Strata Hub payloads) must pass through human review before finalization.

#### Scenario: Document starts as draft
- **GIVEN** the system generates a legal or financial document
- **WHEN** the document is created
- **THEN** it SHALL be marked with status "draft"
- **AND** clearly displayed as such in the UI

#### Scenario: Human approval required
- **GIVEN** a draft document exists
- **WHEN** a user attempts to finalize or submit it
- **THEN** the system SHALL require explicit human approval
- **AND** record who approved and when

#### Scenario: Prevent automatic submission
- **GIVEN** an AI agent generates a Strata Hub report payload
- **WHEN** the payload is ready
- **THEN** the system SHALL NOT automatically submit to Strata Hub
- **AND** SHALL require a human to review and explicitly approve submission

### Requirement: Compliance Status Calculation

The system SHALL derive a compliance status for each obligation type per scheme.

Status values:
- `on_track`: More than 60 days remaining until deadline
- `upcoming`: 60 to 30 days remaining (the "Secretary Trigger")
- `due_soon`: Less than 30 days remaining - ACTION REQUIRED
- `overdue`: Past the deadline

The system SHALL calculate separate statuses for:
- `agmStatus`: Based on `nextAgmDueDate`
- `strataHubStatus`: Based on `nextStrataHubReportDueDate`

#### Scenario: AGM on track

- **GIVEN** a scheme with `nextAgmDueDate` 90 days from today
- **WHEN** the system evaluates AGM compliance
- **THEN** `agmStatus` SHALL be `on_track`
- **AND** the dashboard SHALL display a neutral/green state

#### Scenario: AGM upcoming (the Secretary Trigger)

- **GIVEN** a scheme with `nextAgmDueDate` 60 days from today
- **WHEN** the system evaluates AGM compliance
- **THEN** `agmStatus` SHALL be `upcoming`
- **AND** the dashboard SHALL suggest "Draft Agenda"
- **AND** this allows ample time before the 7-day statutory notice period

#### Scenario: AGM due soon

- **GIVEN** a scheme with `nextAgmDueDate` 20 days from today
- **WHEN** the system evaluates AGM compliance
- **THEN** `agmStatus` SHALL be `due_soon`
- **AND** the dashboard SHALL display a warning/amber state with ACTION REQUIRED

#### Scenario: AGM overdue

- **GIVEN** a scheme with `nextAgmDueDate` 1 day in the past
- **WHEN** the system evaluates AGM compliance
- **THEN** `agmStatus` SHALL be `overdue`
- **AND** the dashboard SHALL display an error/red state

#### Scenario: Strata Hub status follows same thresholds

- **GIVEN** a scheme with `nextStrataHubReportDueDate` 45 days from today
- **WHEN** the system evaluates Strata Hub compliance
- **THEN** `strataHubStatus` SHALL be `upcoming`

---

### Requirement: Compliance Task Entity

The system SHALL support ComplianceTask records to track preparation steps for compliance obligations.

Fields:
- `id`: Unique identifier
- `schemeId`: Reference to the scheme (required)
- `type`: Task type (e.g., `send_agm_notice`, `hold_agm`, `file_strata_hub_report`)
- `title`: Human-readable task title
- `status`: One of `draft`, `in_progress`, `done`
- `dueDate`: Calculated due date for the task (required)

#### Scenario: Task belongs to one scheme only

- **GIVEN** a ComplianceTask is created for scheme A
- **WHEN** a user from scheme B queries their tasks
- **THEN** they SHALL NOT see tasks from scheme A

#### Scenario: Task status transitions

- **GIVEN** a ComplianceTask with status `draft`
- **WHEN** the task is updated
- **THEN** status MAY transition to `in_progress` or `done`
- **AND** transitions SHALL be recorded with timestamp

---

### Requirement: AGM Checklist Generation

The system SHALL provide an action to generate a standard AGM preparation checklist with calculated due dates.

The action creates draft ComplianceTask records for the scheme:
- `send_agm_notice`: "Send AGM notice to all owners" (Due: AGM Date - 8 days)
- `hold_agm`: "Hold the Annual General Meeting" (Due: AGM Date)
- `file_strata_hub_report`: "File Strata Hub annual report" (Due: AGM Date + 3 months)

The 8-day buffer for `send_agm_notice` ensures the 7-day statutory notice period is met.

**NEW**: The `send_agm_notice` task SHALL integrate with the Document Engine to generate the AGM Notice.

#### Scenario: Generating AGM checklist with calculated dates

- **GIVEN** a scheme with `nextAgmDueDate` = 2026-03-10
- **AND** a user with `secretary` role
- **WHEN** they invoke "Generate AGM checklist"
- **THEN** the system SHALL create draft ComplianceTask records:
  - `send_agm_notice` with `dueDate` = 2026-03-02 (AGM - 8 days)
  - `hold_agm` with `dueDate` = 2026-03-10 (AGM date)
  - `file_strata_hub_report` with `dueDate` = 2026-06-10 (AGM + 3 months)
- **AND** no tasks SHALL be created for other schemes

#### Scenario: Task action triggers document generation

- **GIVEN** a `send_agm_notice` task exists
- **WHEN** the user clicks the action button for that task
- **THEN** the system SHALL open the Document Preview dialog
- **AND** generate an AGM Notice document if one does not exist

