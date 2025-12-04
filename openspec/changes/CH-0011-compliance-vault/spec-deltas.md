# Spec Deltas for CH-0011

## Affected Capabilities
- `documents`
- `compliance`

---

## Documents Capability

### Staging Logic (Auto-Filing)
Any document created by an Agent MUST be tagged for the Vault:
- **Secretary Agent** creates AGM Agenda -> Tags as `governance`.
- **Postman Agent** creates Levy Notice -> Tags as `revenue`.
- **Reporting Engine** creates Financial Statement -> Tags as `financials`.

### Submission Assist Workflow
When a user initiates "Submit" on a Vault Container:
1. **Download:** The browser auto-downloads the file (e.g., `SP12345_Fire_Safety_2025.pdf`).
2. **Redirect:** The browser opens a new tab to the **Mapped Government URL**.
3. **Verify:** A modal asks: "Did you complete the submission?"
4. **Audit:** If confirmed, status becomes `submitted` with a timestamp.

---

## Compliance Capability

### Vault Structure (The Containers)
The Vault is organized by **Submission Destination**:

1. **Fire Safety Portal**
   - Requires: `Annual Fire Safety Statement`
   - URL: `https://www.service.nsw.gov.au/transaction/submit-annual-fire-safety-statement`

2. **Strata Hub Portal** (Multiple attachments)
   - Requires: `Insurance Certificate`, `Financial Statement`, `Capital Works Plan`
   - URL: `https://www.service.nsw.gov.au/transaction/submit-strata-scheme-annual-report`

### Container States
Each container has a status:
- `missing` - Required document not yet uploaded/generated
- `ready` - Document available, awaiting submission
- `submitted` - User confirmed submission to portal
