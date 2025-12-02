## ADDED Requirements

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

#### Scenario: Generating AGM checklist with calculated dates

- **GIVEN** a scheme with `nextAgmDueDate` = 2026-03-10
- **AND** a user with `secretary` role
- **WHEN** they invoke "Generate AGM checklist"
- **THEN** the system SHALL create draft ComplianceTask records:
  - `send_agm_notice` with `dueDate` = 2026-03-02 (AGM - 8 days)
  - `hold_agm` with `dueDate` = 2026-03-10 (AGM date)
  - `file_strata_hub_report` with `dueDate` = 2026-06-10 (AGM + 3 months)
- **AND** no tasks SHALL be created for other schemes

#### Scenario: Notice task ensures statutory compliance

- **GIVEN** an AGM checklist is generated
- **WHEN** the `send_agm_notice` task is created
- **THEN** its `dueDate` SHALL be set to AGM Date minus 8 days
- **AND** this ensures the 7-day statutory notice period is met even if sent on the due date

#### Scenario: Non-secretary cannot generate checklist

- **GIVEN** a user with `owner` role (not secretary or committee_member)
- **WHEN** they attempt to generate an AGM checklist
- **THEN** the system SHALL deny the request
- **AND** return an authorization error

#### Scenario: Checklist respects Draft workflow

- **GIVEN** an AGM checklist is generated
- **WHEN** the tasks are created
- **THEN** all tasks SHALL have status `draft`
- **AND** require explicit user action to mark as `in_progress` or `done`
