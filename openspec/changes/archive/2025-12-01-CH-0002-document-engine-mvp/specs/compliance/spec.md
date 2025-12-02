## MODIFIED Requirements

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
