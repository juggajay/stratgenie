## ADDED Requirements

### Requirement: Lot Entity

The system SHALL support Lot records to track individual units/apartments within a strata scheme.

Fields:
- `id`: Unique identifier
- `schemeId`: Reference to the scheme (required)
- `lotNumber`: String identifier (e.g., "1", "2A", "G01")
- `unitEntitlement`: Integer representing the lot's share of scheme costs
- `ownerName`: Current owner's name
- `ownerEmail`: Owner's email address for notices
- `ownerAddress`: Mailing address (optional)
- `createdAt`: Timestamp of creation

#### Scenario: Lot belongs to one scheme

- **GIVEN** a Lot is created for scheme A
- **WHEN** a user from scheme B queries their lots
- **THEN** they SHALL NOT see lots from scheme A

#### Scenario: Lot number uniqueness within scheme

- **GIVEN** a scheme with Lot "1" already registered
- **WHEN** a user attempts to create another Lot "1" in the same scheme
- **THEN** the system SHALL reject the duplicate
- **AND** display an error message

#### Scenario: Unit entitlement is positive integer

- **GIVEN** a user creates a Lot
- **WHEN** the unit entitlement is set
- **THEN** it SHALL be a positive integer greater than zero

---

### Requirement: Strata Roll Management

The system SHALL provide a user interface for managing the strata roll (lot registry).

#### Scenario: View strata roll

- **GIVEN** a scheme with 10 registered lots
- **WHEN** the user navigates to the strata roll page
- **THEN** all 10 lots SHALL be displayed in a table
- **AND** the table SHALL show lot number, owner name, unit entitlement

#### Scenario: Add new lot

- **GIVEN** a user on the strata roll page
- **WHEN** they click "Add Lot" and fill in the required fields
- **THEN** a new Lot record SHALL be created
- **AND** the strata roll SHALL update to show the new lot

#### Scenario: Edit existing lot

- **GIVEN** a lot with outdated owner information
- **WHEN** the user edits the lot and saves
- **THEN** the Lot record SHALL be updated
- **AND** the changes SHALL be reflected in the strata roll

#### Scenario: Delete lot

- **GIVEN** a lot that no longer exists (e.g., lot consolidation)
- **WHEN** the user deletes the lot
- **THEN** the Lot record SHALL be removed
- **AND** the user SHALL be warned if levy invoices exist for this lot

---

### Requirement: Total Unit Entitlement Calculation

The system SHALL calculate and display the total unit entitlement for a scheme.

#### Scenario: Sum of all lot entitlements

- **GIVEN** a scheme with 3 lots having entitlements 10, 15, and 25
- **WHEN** the total unit entitlement is calculated
- **THEN** it SHALL equal 50

#### Scenario: Display percentage share

- **GIVEN** a lot with 10 entitlements in a scheme with 50 total
- **WHEN** the lot details are displayed
- **THEN** the percentage share SHALL be shown as 20%
