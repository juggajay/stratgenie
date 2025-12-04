# Change CH-0011: Compliance Vault (The Shoebox Staging Area)

## Summary
Create a centralized "Compliance Vault" that acts as the single staging area for all external reporting.
1. **The Shoebox:** All system-generated compliance documents (AGM Notices, Financial Reports) are automatically moved here.
2. **Smart Staging:** Files are sorted into containers based on statutory requirements (Fire, Insurance, Strata Hub).
3. **Submission Assist:** A specific workflow for "Getting files out." User clicks Submit -> System downloads file -> System opens the exact Government Portal URL.

## Motivation
Currently, documents are scattered (AGM notices in Secretary tab, Financials in Finance tab).
Users need a single "Outbox" where they can see exactly what is ready to be lodged with the government and what is missing.

## Scope
- **Backend:**
  - `documents` table update: Add `vaultCategory` and `submissionStatus`.
  - **Auto-Filing:** Update existing agents (Secretary, Treasurer) to tag their outputs for the Vault.
- **Frontend:**
  - New Vault page with containers organized by submission destination.
  - Submission Assist workflow (download + redirect + verify).

## Impact
- Affected specs: `documents`, `compliance`
- Affected code:
  - `convex/schema.ts` - Add vaultCategory, submissionStatus to documents
  - `lib/compliance-links.ts` - Government portal URL mappings
  - `app/dashboard/documents/page.tsx` - Vault UI
  - Agent outputs - Auto-tagging logic
