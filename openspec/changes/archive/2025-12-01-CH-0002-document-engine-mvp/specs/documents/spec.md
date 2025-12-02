## ADDED Requirements

### Requirement: Document Entity

The system SHALL support Document records to store generated statutory documents.

Fields:
- `id`: Unique identifier
- `schemeId`: Reference to the scheme (required)
- `type`: Document type (e.g., `agm_notice`, `agm_minutes`, `levy_notice`)
- `status`: One of `draft`, `final`
- `content`: Document content as HTML/text
- `createdAt`: Timestamp of creation
- `finalizedAt`: Timestamp when marked final (optional)

#### Scenario: Document belongs to one scheme

- **GIVEN** a Document is created for scheme A
- **WHEN** a user from scheme B queries their documents
- **THEN** they SHALL NOT see documents from scheme A

#### Scenario: Document status transitions

- **GIVEN** a Document with status `draft`
- **WHEN** the user approves the document
- **THEN** status SHALL transition to `final`
- **AND** `finalizedAt` timestamp SHALL be recorded

---

### Requirement: AGM Notice Template

The system SHALL provide an AGM Notice template compliant with NSW SSMA 2015.

The template MUST include these sections:
1. **Header**: Scheme Name (SP Number), Address
2. **Meeting Details**: Date, Time, Location
3. **Proxy Statement**: Statement that owners can vote via proxy (with deadline)
4. **Agenda Items** (Mandatory Statutory Motions):
   - Motion 1: Confirm minutes of the last meeting
   - Motion 2: Adoption of Financial Statements
   - Motion 3: Consider Capital Works Fund Plan (10-year plan)
   - Motion 4: Election of Strata Committee

#### Scenario: Generate AGM Notice with valid scheme data

- **GIVEN** a scheme with name, strata number, and AGM date set
- **WHEN** the `generateAgmNotice` action is called
- **THEN** a new Document record SHALL be created with status `draft`
- **AND** the content SHALL include all mandatory statutory motions
- **AND** the content SHALL inject the scheme's specific details

#### Scenario: Generate AGM Notice with missing required fields

- **GIVEN** a scheme missing required fields (e.g., no meeting location)
- **WHEN** the `generateAgmNotice` action is called
- **THEN** the system SHALL return an error indicating missing fields
- **AND** no Document record SHALL be created

---

### Requirement: Document Preview Workflow

The system SHALL provide a preview workflow before finalizing documents.

#### Scenario: User previews generated document

- **GIVEN** a draft Document has been generated
- **WHEN** the user opens the document preview
- **THEN** the system SHALL display a clean, printable view of the document
- **AND** show "Approve & Download" action

#### Scenario: User approves document

- **GIVEN** a user is previewing a draft Document
- **WHEN** they click "Approve & Download"
- **THEN** the Document status SHALL change to `final`
- **AND** the system SHALL provide the document for download
