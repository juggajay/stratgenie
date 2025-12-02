# schemes Specification (Delta)

## MODIFIED Requirements

### Requirement: Scheme Trial Status Tracking

The Scheme entity SHALL track subscription/trial status for billing enforcement.

New field:
- `trialEndsAt`: Timestamp when free trial expires (nullable)
  - If set and in the future: scheme is on active trial
  - If set and in the past: trial expired, requires subscription
  - If null: scheme is paid or grandfathered (no trial restriction)

#### Scenario: Querying trial status for active trial

- **GIVEN** a scheme with `trialEndsAt` = 14 days from now
- **WHEN** the trial status is queried
- **THEN** the system SHALL return `isOnTrial: true`
- **AND** `daysRemaining: 14`
- **AND** `isExpired: false`

#### Scenario: Querying trial status for expired trial

- **GIVEN** a scheme with `trialEndsAt` = 3 days ago
- **WHEN** the trial status is queried
- **THEN** the system SHALL return `isOnTrial: false`
- **AND** `daysRemaining: 0`
- **AND** `isExpired: true`

#### Scenario: Querying trial status for paid scheme

- **GIVEN** a scheme with `trialEndsAt` = null
- **WHEN** the trial status is queried
- **THEN** the system SHALL return `isOnTrial: false`
- **AND** `isExpired: false`
- **AND** `isPaid: true`
