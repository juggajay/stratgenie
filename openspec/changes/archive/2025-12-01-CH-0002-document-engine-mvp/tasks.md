# Implementation Tasks

## 1. Backend Schema

- [x] 1.1 Update `convex/schema.ts`: Add `documents` table
  - Fields: `schemeId`, `type`, `status`, `content`, `createdAt`, `finalizedAt`
  - Index by `schemeId`

## 2. Backend Templates

- [x] 2.1 Create `convex/templates/agm_notice.ts`
  - Export function that takes scheme data and returns HTML string
  - Include mandatory statutory motions (Minutes, Financials, Capital Works, Committee)
  - Template must inject: Scheme Name, SP Number, AGM Date, Time, Location
- [x] 2.2 Add proxy statement section with deadline calculation (AGM Date - 24 hours)

## 3. Backend Actions

- [x] 3.1 Create `convex/documents.ts` with queries and mutations
- [x] 3.2 Implement `generateAgmNotice` mutation
  - Fetch scheme details
  - Validate required fields (name, strataNumber, nextAgmDueDate) - throw if missing
  - Call template function to generate content
  - Save draft Document record
  - Return document ID
- [x] 3.3 Implement `getDocument` query
  - Fetch document by ID with scheme membership check
- [x] 3.4 Implement `listDocumentsForScheme` query
  - Return all documents for a scheme, sorted by createdAt
- [x] 3.5 Implement `finalizeDocument` mutation
  - Change status from `draft` to `final`
  - Set `finalizedAt` timestamp

## 4. Frontend Components

- [x] 4.1 Create `components/documents/document-preview-dialog.tsx`
  - Use shadcn Dialog component
  - Display clean, printable preview of document content
  - Actions: "Close", "Approve & Download"
  - Follow CLAUDE.md design system (slate colors, rounded-xl cards)
- [x] 4.2 Create `components/scheme/scheme-settings-form.tsx`
  - Form to update scheme meeting details
  - Fields: secretaryName, secretaryEmail, address, defaultMeetingLocation, defaultMeetingTime

## 5. Frontend Integration

- [x] 5.1 Update `components/dashboard/task-list.tsx`
  - For `send_agm_notice` tasks: change action button behavior
  - Instead of just "Start", show "Generate Notice" button
  - Button opens DocumentPreviewDialog
- [x] 5.2 Add state management for dialog open/close
- [x] 5.3 Handle "Approve & Download" flow
  - Call `finalizeDocument` mutation
  - Trigger browser download of document content

## 6. Scheme Details (Prerequisite)

- [x] 6.1 Add scheme fields for AGM meeting details
  - `defaultMeetingLocation`: string (optional)
  - `defaultMeetingTime`: string (optional, e.g., "7:00 PM")
- [x] 6.2 Update `convex/schema.ts` with new Scheme fields
- [x] 6.3 Add mutation to update AGM meeting details

## 7. Testing

- [x] 7.1 Test `generateAgmNotice` with valid scheme data
- [x] 7.2 Test `generateAgmNotice` with missing required fields (expect error)
- [x] 7.3 Test document status transitions (draft → final)
- [x] 7.4 Test scheme isolation (documents only visible to their scheme)

## 8. Validation

- [x] 8.1 Run `openspec validate CH-0002-document-engine-mvp --strict`
- [x] 8.2 Run ESLint and fix any issues
- [x] 8.3 Run TypeScript compiler and fix any type errors
