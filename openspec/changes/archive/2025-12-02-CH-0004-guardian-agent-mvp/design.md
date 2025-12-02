# Design: Guardian Agent Vector Search Architecture

## Context

The Guardian Agent needs to answer questions about scheme bylaws by finding relevant sections in uploaded PDF documents. This requires:
1. Text extraction from PDFs
2. Semantic search capability (not just keyword matching)
3. Answer generation with citations

Convex natively supports vector search, making it a natural choice for storing embeddings alongside document data.

## Goals / Non-Goals

### Goals
- Enable semantic search over bylaw documents
- Provide accurate citations to specific bylaw sections
- Reuse existing PDF extraction infrastructure from CH-0003
- Keep architecture simple (single Convex backend)

### Non-Goals
- Support for multiple document types (only bylaws for MVP)
- Real-time collaborative editing of bylaws
- OCR for scanned documents (require text-layer PDFs)
- Multi-language support

## Decisions

### Decision 1: Use Convex Native Vector Search

**Choice:** Store embeddings directly in Convex using their vector index feature.

**Alternatives considered:**
- External vector DB (Pinecone, Weaviate): Adds operational complexity, latency, and cost
- PostgreSQL with pgvector: Would require different backend stack
- In-memory search: Not persistent, doesn't scale

**Rationale:** Convex vector search is integrated, eliminates external dependencies, and maintains data co-location with scheme data for access control.

### Decision 2: Use OpenAI text-embedding-3-small

**Choice:** OpenAI `text-embedding-3-small` (1536 dimensions)

**Alternatives considered:**
- `text-embedding-3-large` (3072 dimensions): Better quality but 2x vector storage
- Local models (sentence-transformers): Requires additional infrastructure
- Cohere/Voyage embeddings: Additional vendor dependency

**Rationale:** Balance of quality, cost, and compatibility. text-embedding-3-small provides excellent results for document retrieval at lower cost than large variant.

### Decision 3: Chunking Strategy

**Choice:** Fixed-size chunks (~1000 characters) with 200-character overlap, preserving section headers.

**Parameters:**
- Chunk size: ~1000 characters (fits context window efficiently)
- Overlap: 200 characters (prevents splitting mid-sentence)
- Preserve headers: Detect markdown-style headers (##) or numbered sections

**Alternatives considered:**
- Semantic chunking (by paragraph): Inconsistent chunk sizes, harder to implement
- Sentence-level: Too granular, loses context
- Page-level: Too large, retrieval becomes imprecise

**Rationale:** Fixed-size with overlap is predictable, debuggable, and works well for legal documents with section structure.

### Decision 4: Retrieval Strategy

**Choice:** Top-5 chunks by cosine similarity, passed to GPT-4o for synthesis.

**Parameters:**
- K=5 retrieved chunks (balances context vs noise)
- No similarity threshold (let GPT-4o determine relevance)
- Context window: ~5000 tokens available for retrieved content

**Rationale:** 5 chunks provides enough context without overwhelming the model. We removed the similarity threshold because `text-embedding-3-small` produces lower absolute scores (typically 0.2-0.4 range for relevant matches). GPT-4o is better at determining actual relevance from context.

### Decision 6: Node.js Runtime for Actions

**Choice:** Actions requiring `unpdf` library are in separate file `convex/actions/guardian.ts` with `"use node";` directive.

**Rationale:** Convex only allows actions (not mutations/queries) to use Node.js runtime. The `unpdf` library requires Node.js for PDF processing. Splitting actions into a separate file with `"use node";` keeps mutations/queries in the V8 isolate while enabling Node.js for PDF extraction.

### Decision 5: Answer Generation Prompt

**Choice:** Strict grounding prompt that refuses to answer if information isn't in retrieved chunks.

```
You are a helpful assistant for NSW strata scheme bylaws.
Answer the question based ONLY on the provided bylaw excerpts.
If the answer is not clearly stated in the excerpts, say "I couldn't find information about this in your bylaws."
Always cite the relevant section numbers.
This is not legal advice.
```

**Rationale:** Prevents hallucination by constraining the model to retrieved content. Legal disclaimer is critical for liability.

## Data Model

```
bylaws (one per scheme, can be replaced)
├── schemeId
├── fileId (Convex storage)
├── fileName
├── status: processing | ready | failed
├── errorMessage?
├── createdAt
└── processedAt?

bylawChunks (many per bylaw)
├── schemeId (denormalized for efficient filtering)
├── bylawId
├── chunkIndex (order in document)
├── text (~1000 chars)
├── embedding (vector 1536)
├── sectionHeader? (e.g., "Bylaw 14 - Keeping of Animals")
└── [vector index on embedding filtered by schemeId]
```

## Query Flow

```
User Question → "Can I have a dog?"
       ↓
Generate Embedding (text-embedding-3-small)
       ↓
Vector Search (bylawChunks where schemeId = X, top 5)
       ↓
Retrieved Chunks:
  - "Bylaw 14.1: Pets are permitted subject to committee approval..."
  - "Bylaw 14.2: No dangerous animals..."
       ↓
GPT-4o Synthesis (grounded in chunks)
       ↓
Answer: "According to Bylaw 14.1, pets are permitted but require committee approval.
         Bylaw 14.2 prohibits dangerous animals. [Citations: 14.1, 14.2]"
```

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hallucination | Legal liability | Strict grounding prompt + disclaimer |
| Poor chunk retrieval | Wrong answers | Tune chunk size/overlap, add feedback mechanism |
| Embedding cost | API costs | One-time at upload, ~$0.02 per 60-page PDF |
| Scanned PDFs | Extraction fails | Detect and error gracefully (reuse CH-0003) |
| Outdated bylaws | Stale answers | Allow re-upload, show last-updated date |

## Migration Plan

This is a new feature with no existing data to migrate.

1. Deploy schema changes (additive, no breaking changes)
2. Deploy backend functions
3. Deploy frontend components
4. Enable feature for users

Rollback: Remove frontend access; data can remain inert.

## Open Questions (Resolved)

- [x] Should we support multiple bylaw documents per scheme? → **Yes**, schema supports multiple docs per scheme (chunks linked to bylawId). For MVP, uploading a new bylaw replaces the old one.
- [x] Should we implement feedback mechanism? → **Deferred** for MVP. Can be added later.
- [x] Should Guardian Agent be accessible to all owners or committee only? → **Committee only** for MVP (matches current auth pattern).
