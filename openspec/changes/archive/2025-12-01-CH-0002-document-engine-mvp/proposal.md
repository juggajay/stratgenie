# Change: Document Engine & Secretary Agent MVP

## Why

Currently, the dashboard tells users *when* to act but not *how*.

The #1 risk for volunteers is drafting a non-compliant Agenda (e.g., forgetting the motion to consider the Capital Works Fund).

This change automates the drafting process, reducing liability and hours of work.

## What Changes

- **DocumentTemplate system**: Backend infrastructure for statutory forms
- **AGM Notice Generator**: First template implementing Notice of Meeting
- **Document Preview flow**: Modal to review generated documents before finalizing
- **Task integration**: Connect dashboard action buttons to generation workflow

**Backend:**
- `documents` table to store generated files
- `generateDocument` action (inputs: `schemeId`, `templateType`)
- Template Engine: Logic to inject Scheme Name, Dates, and Statutory Motions

**Frontend:**
- `DocumentPreviewDialog`: Modal to review generated document before finalizing
- "Approve & Download" workflow

**Specific Template (AGM Notice):**
- NSW SSMA 2015 compliant notice format
- Mandatory statutory motions included automatically

## Impact

- Affected specs: `compliance`, `documents` (new)
- Affected code:
  - `convex/schema.ts` (new documents table)
  - `convex/documents.ts` (new)
  - `convex/templates/` (new directory)
  - `components/documents/` (new directory)
  - `components/dashboard/task-list.tsx` (integration)

## Risks & Considerations

- Template content must be legally accurate for NSW – disclaimer that this is guidance, not legal advice
- Document storage: Initially store as HTML/text; PDF generation could be a future enhancement
- Users must still review before sending – never auto-send statutory documents
