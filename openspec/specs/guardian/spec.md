# guardian Specification

## Purpose
TBD - created by archiving change CH-0004-guardian-agent-mvp. Update Purpose after archive.
## Requirements
### Requirement: Bylaw Entity

The system SHALL support Bylaw records to store uploaded bylaw PDF files per scheme.

Fields:
- `id`: Unique identifier
- `schemeId`: Reference to the scheme (required)
- `fileId`: Reference to stored file (Convex file storage)
- `fileName`: Original file name
- `status`: One of `processing`, `ready`, `failed`
- `errorMessage`: Error description if processing failed (optional)
- `createdAt`: Timestamp of upload
- `processedAt`: Timestamp when processing completed (optional)

#### Scenario: Bylaw belongs to one scheme

- **GIVEN** a Bylaw is uploaded for scheme A
- **WHEN** a user from scheme B queries their bylaws
- **THEN** they SHALL NOT see bylaws from scheme A

#### Scenario: Bylaw status transitions

- **GIVEN** a Bylaw PDF is uploaded
- **WHEN** the file is saved
- **THEN** status SHALL be `processing`
- **AND** ingestion SHALL be triggered automatically

#### Scenario: Only one active bylaw per scheme

- **GIVEN** a scheme already has a bylaw with status `ready`
- **WHEN** a new bylaw PDF is uploaded
- **THEN** the previous bylaw and its chunks SHALL be deleted
- **AND** the new bylaw SHALL replace it

---

### Requirement: Bylaw Chunk Entity

The system SHALL support BylawChunk records to store vectorized segments of bylaw documents.

Fields:
- `id`: Unique identifier
- `schemeId`: Reference to the scheme (denormalized for query efficiency)
- `bylawId`: Reference to the parent bylaw
- `chunkIndex`: Order of chunk in original document (0-based)
- `text`: Text content of the chunk (~1000 characters)
- `embedding`: Vector embedding (1536 dimensions)
- `sectionHeader`: Detected section header if available (optional)

The system SHALL maintain a vector index on the `embedding` field filtered by `schemeId`.

#### Scenario: Chunks are deleted with bylaw

- **GIVEN** a Bylaw has associated chunks
- **WHEN** the Bylaw is deleted
- **THEN** all associated BylawChunk records SHALL be deleted

#### Scenario: Chunks isolated by scheme

- **GIVEN** chunks exist for scheme A and scheme B
- **WHEN** a vector search is performed for scheme A
- **THEN** only chunks from scheme A SHALL be searched
- **AND** chunks from scheme B SHALL NOT appear in results

---

### Requirement: Bylaw Ingestion Workflow

The system SHALL provide automatic ingestion of uploaded bylaw PDFs into searchable vector chunks.

The Guardian Agent MUST perform the following steps upon file upload:
1. **Extract:** Use PDF text extraction (unpdf library) to get raw text
2. **Validate:** Verify PDF has text layer (minimum 100 characters)
3. **Chunk:** Split text into ~1000 character segments with 200 character overlap
4. **Detect Headers:** Identify section headers (e.g., "Bylaw 14", "## Pets")
5. **Embed:** Generate vector embeddings using OpenAI text-embedding-3-small
6. **Store:** Save chunks with embeddings to `bylawChunks` table

#### Scenario: User uploads valid bylaw PDF

- **GIVEN** a user uploads a PDF bylaw document with text layer
- **WHEN** the `ingestBylaws` action runs
- **THEN** the PDF text SHALL be extracted
- **AND** text SHALL be split into chunks
- **AND** each chunk SHALL receive an embedding
- **AND** chunks SHALL be stored in `bylawChunks`
- **AND** bylaw status SHALL be `ready`

#### Scenario: Scanned PDF fails gracefully

- **GIVEN** a user uploads a scanned PDF without text layer
- **WHEN** text extraction returns fewer than 100 characters
- **THEN** bylaw status SHALL be `failed`
- **AND** `errorMessage` SHALL indicate the PDF appears to be a scanned image
- **AND** no chunks SHALL be created

#### Scenario: Corrupt or invalid file

- **GIVEN** a user uploads a corrupt or non-PDF file
- **WHEN** the extraction fails
- **THEN** bylaw status SHALL be `failed`
- **AND** `errorMessage` SHALL describe the error
- **AND** no chunks SHALL be created

---

### Requirement: Guardian Query Workflow

The system SHALL provide AI-powered answers to bylaw questions using RAG (Retrieval Augmented Generation).

The query workflow MUST:
1. **Embed Question:** Generate vector embedding for the user's question
2. **Search:** Find top 5 most similar bylaw chunks by cosine similarity
3. **Filter:** Exclude chunks below 0.7 similarity threshold
4. **Synthesize:** Use GPT-4o to generate an answer grounded in retrieved chunks
5. **Cite:** Include references to relevant bylaw sections in the response

#### Scenario: User asks question with relevant bylaws

- **GIVEN** a scheme has bylaws uploaded and processed
- **AND** the bylaws contain information about pet ownership
- **WHEN** a user asks "Can I have a dog?"
- **THEN** the system SHALL retrieve relevant bylaw chunks
- **AND** generate an answer citing specific bylaw sections
- **AND** include a disclaimer that this is not legal advice

#### Scenario: Question has no relevant bylaws

- **GIVEN** a scheme has bylaws uploaded
- **AND** the bylaws do not mention parking rules
- **WHEN** a user asks "Where can I park my car?"
- **THEN** the system SHALL indicate the bylaws do not contain relevant information
- **AND** SHALL NOT hallucinate an answer

#### Scenario: No bylaws uploaded for scheme

- **GIVEN** a scheme has no bylaws uploaded
- **WHEN** a user asks a bylaw question
- **THEN** the system SHALL indicate no bylaws are available
- **AND** prompt the user to upload their scheme's bylaws

---

### Requirement: Bylaw Upload Interface

The system SHALL provide a user-friendly interface for uploading bylaw PDF documents.

#### Scenario: Drag-and-drop upload

- **GIVEN** a user is on the scheme settings or Guardian page
- **WHEN** they drag a PDF file onto the upload zone
- **THEN** the file SHALL be uploaded
- **AND** ingestion SHALL begin automatically
- **AND** a loading indicator SHALL be displayed

#### Scenario: File type validation

- **GIVEN** a user attempts to upload a file
- **WHEN** the file is not a PDF
- **THEN** the upload SHALL be rejected
- **AND** an error message SHALL indicate only PDF files are accepted

#### Scenario: Show processing status

- **GIVEN** a bylaw upload is in progress
- **WHEN** the user views the upload area
- **THEN** current status SHALL be displayed (processing/ready/failed)
- **AND** for `ready` status, the file name and upload date SHALL be shown

---

### Requirement: Guardian Chat Interface

The system SHALL provide a chat interface for asking bylaw questions.

#### Scenario: Submit question

- **GIVEN** a user has access to the Guardian chat
- **WHEN** they type a question and submit
- **THEN** the question SHALL be sent to the Guardian Agent
- **AND** a "Thinking..." indicator SHALL be displayed

#### Scenario: Display answer with citations

- **GIVEN** the Guardian Agent returns an answer
- **WHEN** the response is displayed
- **THEN** the answer text SHALL be shown
- **AND** cited bylaw sections SHALL be displayed as expandable cards
- **AND** users SHALL be able to see the original bylaw text for each citation

#### Scenario: Legal disclaimer displayed

- **GIVEN** a user views the Guardian chat
- **WHEN** the interface loads
- **THEN** a disclaimer SHALL be prominently displayed
- **AND** the disclaimer SHALL state this is not legal advice
- **AND** users should consult a lawyer for legal matters

---

### Requirement: Guardian Agent Grounding

The Guardian Agent SHALL be strictly grounded in the scheme's uploaded bylaws to prevent hallucination.

#### Scenario: Answer must cite sources

- **GIVEN** the Guardian Agent generates an answer
- **WHEN** the answer references specific rules
- **THEN** each rule SHALL be traceable to a retrieved bylaw chunk
- **AND** the chunk text SHALL be available for verification

#### Scenario: Refuse to speculate

- **GIVEN** a user asks about something not covered in bylaws
- **WHEN** the Guardian Agent cannot find relevant chunks
- **THEN** it SHALL clearly state the information was not found
- **AND** SHALL NOT invent or assume bylaw content

#### Scenario: Handle ambiguous questions

- **GIVEN** a user asks a vague question
- **WHEN** multiple interpretations are possible
- **THEN** the Guardian Agent MAY ask for clarification
- **OR** provide answers for likely interpretations with appropriate caveats

