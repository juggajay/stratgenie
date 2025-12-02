# schemes Specification

## Purpose
TBD - created by archiving change CH-0001-agm-compliance-mvp. Update Purpose after archive.
## Requirements
### Requirement: Scheme Compliance Date Tracking

The Scheme entity SHALL track key compliance dates for AGM and Strata Hub reporting.

Fields:
- `lastAgmDate`: Date of the most recent AGM (nullable)
- `nextAgmDueDate`: Derived/cached date when next AGM must occur (nullable)
- `lastStrataHubReportDate`: Date of last Strata Hub annual report submission (nullable)
- `nextStrataHubReportDueDate`: Derived/cached deadline for next report (nullable)

#### Scenario: Calculating AGM due date from last AGM

- **GIVEN** a scheme with `lastAgmDate` = 2025-03-10
- **WHEN** the system calculates `nextAgmDueDate`
- **THEN** `nextAgmDueDate` SHALL be set to 2026-03-10 (strict 1-year cycle)
- **AND** this date is used as the basis for compliance rules

#### Scenario: Calculating Strata Hub report due date

- **GIVEN** a scheme with `lastAgmDate` = 2025-03-10
- **WHEN** the system calculates `nextStrataHubReportDueDate`
- **THEN** `nextStrataHubReportDueDate` SHALL be set to 2025-06-10 (3 months after AGM)

#### Scenario: Missing last AGM date

- **GIVEN** a scheme with `lastAgmDate` = null
- **WHEN** the compliance status is requested
- **THEN** the system SHALL indicate that AGM date setup is required
- **AND** SHALL NOT calculate a due date

