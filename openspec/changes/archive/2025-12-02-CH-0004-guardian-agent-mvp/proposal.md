# Change: Guardian Agent MVP (Bylaw Vector Search)

## Why

Disputes over rules (pets, parking, noise, renovations) are the #1 cause of conflict in strata schemes. Committee members hate reading 60-page legal bylaw documents to answer simple questions. An AI-powered "Guardian Agent" that acts as a **neutral umpire** citing specific bylaw clauses reduces emotion and saves time.

Currently, when owners ask "Can I have a dog?", committee members must:
1. Locate the scheme's bylaws PDF
2. Search manually through dozens of pages
3. Interpret legal language
4. Risk misquoting or missing relevant clauses

This change implements a RAG (Retrieval Augmented Generation) system that:
- Ingests bylaw PDFs and chunks them into searchable segments
- Generates vector embeddings for semantic search
- Retrieves relevant clauses and answers questions with citations

## What Changes

**Backend:**
- `bylaws` table to store uploaded bylaw PDF files per scheme
- `bylawChunks` table with Convex vector search for embedding storage
- `ingestBylaws` action: Reuse PDF text extraction, chunk text, generate OpenAI embeddings
- `askGuardian` action: Vector search + GPT-4o response with citations

**Frontend:**
- `BylawUpload` component: Drag-and-drop upload in scheme settings
- `GuardianChat` component: Chat interface for asking bylaw questions
- Integration in sidebar or dedicated page

**AI Integration:**
- OpenAI `text-embedding-3-small` for vector embeddings
- Convex native vector search for retrieval
- GPT-4o for answer generation with grounding in retrieved chunks

## Impact

- Affected specs: `guardian` (new capability)
- Affected code:
  - `convex/schema.ts` (new tables: bylaws, bylawChunks with vector index)
  - `convex/guardian.ts` (new)
  - `convex/actions/embeddings.ts` (new)
  - `components/guardian/` (new directory)
  - Scheme settings page integration

## Risks & Considerations

- **Hallucination Risk:** AI might invent clauses or misinterpret bylaws. Mitigation: Always show source citations, include disclaimer that this is not legal advice.
- **Chunk Quality:** Poor chunking may split important clauses. Mitigation: Use overlapping chunks (200 char overlap), preserve section headers.
- **Embedding Costs:** OpenAI embedding API has per-token costs. Mitigation: One-time cost at upload, cache embeddings.
- **Scanned PDFs:** Some bylaws may be scanned images without text layer. Mitigation: Detect and warn user (reuse CH-0003 pattern).
- **Outdated Bylaws:** Bylaws may be amended. Mitigation: Allow re-upload to replace vectors, show "last updated" timestamp.
- **Legal Disclaimer:** Must clearly state this is not legal advice. Mitigation: Add prominent disclaimer in UI.
