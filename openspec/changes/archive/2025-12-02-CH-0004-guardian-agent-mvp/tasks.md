# Implementation Tasks

## 1. Backend Schema

- [x] 1.1 Update `convex/schema.ts`: Add `bylaws` table
  - Fields: `schemeId`, `fileId`, `fileName`, `status`, `createdAt`, `processedAt`
  - Index by `schemeId`
- [x] 1.2 Update `convex/schema.ts`: Add `bylawChunks` table
  - Fields: `schemeId`, `bylawId`, `chunkIndex`, `text`, `embedding`, `sectionHeader`
  - Vector index on `embedding` field (1536 dimensions for text-embedding-3-small)
  - Index by `schemeId`, `bylawId`

## 2. Embedding Action

- [x] 2.1 Create `convex/actions/embeddings.ts`
  - Configure OpenAI client for embeddings
  - Implement `generateEmbedding(text: string)` using `text-embedding-3-small`
  - Return 1536-dimension vector array
- [x] 2.2 Handle rate limits and errors gracefully
  - Retry with exponential backoff
  - Return structured error response

## 3. Bylaw Ingestion

- [x] 3.1 Create `convex/guardian.ts` with mutations and queries
- [x] 3.2 Implement `createBylaw` mutation (was `uploadBylaws`)
  - Accept file upload via Convex file storage
  - Create bylaw record with status `processing`
  - Schedule ingestion action
- [x] 3.3 Implement `ingestBylaws` action
  - Fetch file URL from storage
  - Extract text using `unpdf` (reuse CH-0003 pattern)
  - Check for scanned PDF (< 100 chars = error)
  - Chunk text into ~1000 char segments with 200 char overlap
  - Preserve section headers where detected
  - Generate embeddings for each chunk
  - Store chunks with embeddings in `bylawChunks` table
  - Update bylaw status to `ready` or `failed`
- [x] 3.4 Implement `deleteBylaw` mutation
  - Delete all chunks associated with bylaw
  - Delete bylaw record
  - Delete file from storage

## 4. Guardian Query

- [x] 4.1 Implement `searchBylaws` internal query
  - Accept question text and schemeId
  - Generate embedding for question
  - Vector search against `bylawChunks` for scheme
  - Return top 5 most relevant chunks with similarity scores
- [x] 4.2 Implement `askGuardian` action
  - Call `searchBylaws` to get relevant chunks
  - Construct GPT-4o prompt with:
    - System: "You are a helpful assistant for strata bylaws. Answer based ONLY on the provided bylaw excerpts. If the answer is not in the excerpts, say so."
    - Context: Retrieved bylaw chunks with section references
    - Question: User's question
  - Return answer with citations (chunk references)
- [x] 4.3 Implement `getBylawsForScheme` query
  - Return bylaw records for a scheme
  - Include status and metadata

## 5. Frontend Components

- [x] 5.1 Create `components/guardian/bylaw-upload.tsx`
  - Drag-and-drop file upload area
  - File type validation (PDF only)
  - Upload progress indicator
  - Show current bylaw status (processing/ready/none)
- [x] 5.2 Create `components/guardian/chat-interface.tsx`
  - Simple chat interface
  - Input field for questions
  - Display answers with citations
  - "Thinking..." state during search
  - Legal disclaimer banner
- [x] 5.3 Citations integrated into chat-interface.tsx
  - Display bylaw excerpt with section reference
  - Visual indicator of relevance (score percentage)
  - Collapsible "View Sources" section

## 6. Dashboard Integration

- [x] 6.1 Create `app/dashboard/guardian/page.tsx`
  - Option to upload/replace bylaws
  - Show file name and chunk count
- [x] 6.2 Add Guardian navigation to dashboard
  - Shield icon button in header
  - "Ask the Guardian" entry point
- [x] 6.3 Wire up chat to askGuardian action
  - Handle loading states
  - Display formatted responses with citations

## 7. Testing

- [x] 7.1 Test bylaw upload with valid PDF
  - Verify file stored correctly
  - Verify text extraction works
  - Verify chunks created with embeddings
- [x] 7.2 Test with sample bylaw questions
  - "Can I have a pet?"
  - "What are the parking rules?"
  - "Can I renovate my kitchen?"
  - Verify relevant chunks are retrieved
  - Verify answer cites correct sections
- [x] 7.3 Test scheme isolation
  - Verify bylaw chunks only visible to their scheme
  - Verify search only returns scheme's bylaws
- [x] 7.4 Test error cases
  - Scanned PDF (no text layer)
  - Empty or corrupt file
  - Question with no relevant bylaws

## 8. Validation

- [x] 8.1 Run `openspec validate CH-0004-guardian-agent-mvp --strict`
- [x] 8.2 Run ESLint and fix any issues
- [x] 8.3 Run TypeScript compiler and fix any type errors
