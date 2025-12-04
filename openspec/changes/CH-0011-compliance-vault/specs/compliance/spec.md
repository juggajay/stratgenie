# Spec Deltas: Compliance Capability

## ADDED Requirements

### Requirement: Compliance Vault Smart Slots
The Vault page SHALL organize files by "Statutory Duty" using predefined smart slots.

Smart Slot Categories:
- **Fire Safety**: Fire safety statements, certificates
- **Insurance**: Building insurance policies, certificates of currency
- **AGM Records**: Meeting notices, minutes, agendas
- **Levy Records**: Levy notices, payment schedules
- **Annual Statements**: Financial reports, auditor statements
- **Strata Roll**: Owner contact information records

#### Scenario: View vault with smart slots
- **WHEN** the user navigates to the Documents/Vault page
- **THEN** they see files organized by statutory duty category
- **AND** each category shows its required documents and current status

#### Scenario: Empty vault slot prompts upload
- **WHEN** a required vault slot is empty (e.g., "2025 Fire Safety Statement")
- **THEN** an upload button is displayed
- **AND** the slot is marked as "Missing"

#### Scenario: Filled vault slot shows actions
- **WHEN** a vault slot contains a document
- **THEN** Download and Submit actions are available
- **AND** the slot shows the document date and status

### Requirement: Submission Assist
The system SHALL provide guidance for submitting documents to external government portals.

#### Scenario: Download for external submission
- **WHEN** the user clicks "Submit" on a vault document
- **THEN** the document is downloaded in the required format
- **AND** portal-specific instructions are displayed (e.g., NSW Fair Trading steps)
