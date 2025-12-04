# Implementation Tasks for CH-0011

## Phase A: Intelligence & Routing

- [x] **A.1 Config:** Create `lib/compliance-links.ts` with the exact targets:
  ```typescript
  export const SUBMISSION_LINKS = {
    fire_safety: "https://www.service.nsw.gov.au/transaction/submit-annual-fire-safety-statement",
    strata_hub: "https://www.service.nsw.gov.au/transaction/submit-strata-scheme-annual-report",
    // Insurance and Finance are attachments to the Strata Hub report
    insurance: "https://www.service.nsw.gov.au/transaction/submit-strata-scheme-annual-report",
    financials: "https://www.service.nsw.gov.au/transaction/submit-strata-scheme-annual-report"
  };
  ```
- [x] **A.2 Schema:** Update `convex/schema.ts`:
  - Add `vaultCategory: v.optional(v.string())` to documents
  - Add `submissionStatus: v.optional(v.union(v.literal("missing"), v.literal("ready"), v.literal("submitted")))`
  - Add `submittedAt: v.optional(v.number())` for audit timestamp

## Phase B: Auto-Filing (Tag & Route)

- [x] **B.1 Secretary Agent:** Update AGM notice generation to set `vaultCategory: "governance"`
- [ ] **B.2 Postman Agent:** Update levy notice generation to set `vaultCategory: "revenue"`
- [ ] **B.3 Financial Reports:** Tag generated reports with `vaultCategory: "financials"`

## Phase C: Vault UI (The Shoebox)

- [x] **C.1 Page:** Create `app/dashboard/vault/page.tsx`:
  - Display containers organized by submission destination
  - Fire Safety container (single document)
  - Strata Hub container (multiple documents: Insurance, Finance, Capital Works)
- [x] **C.2 Component:** Create `VaultContainer.tsx`:
  - Shows container name and target portal
  - Lists documents with status badges (missing/ready/submitted)
  - Upload button for missing documents
  - Submit button for ready documents
- [x] **C.3 Container States:**
  - `missing` (red) - Show upload prompt
  - `ready` (amber) - Show Submit button
  - `submitted` (green) - Show timestamp and checkmark

## Phase D: Submission Assist Workflow

- [x] **D.1 Submit Action:** When user clicks "Submit":
  - Trigger file download
  - Open government portal URL in new tab
- [x] **D.2 Verify Modal:** After redirect, show modal:
  - "Did you complete the submission on the government portal?"
  - [Yes, I submitted] [Not yet]
- [x] **D.3 Audit Trail:** If confirmed:
  - Set `submissionStatus: "submitted"`
  - Set `submittedAt: Date.now()`
  - Log action for audit
