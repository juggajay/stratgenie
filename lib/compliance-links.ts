/**
 * Government portal URLs for document submission
 * CH-0011: Compliance Vault - Submission Assist
 */

export const SUBMISSION_LINKS = {
  fire_safety: "https://www.service.nsw.gov.au/transaction/submit-annual-fire-safety-statement",
  strata_hub: "https://www.service.nsw.gov.au/transaction/submit-strata-scheme-annual-report",
  // Insurance and Finance are attachments to the Strata Hub report
  insurance: "https://www.service.nsw.gov.au/transaction/submit-strata-scheme-annual-report",
  financials: "https://www.service.nsw.gov.au/transaction/submit-strata-scheme-annual-report",
} as const;

export type VaultCategory =
  | "fire_safety"
  | "insurance"
  | "financials"
  | "governance"
  | "revenue";

export type SubmissionStatus = "missing" | "ready" | "submitted";

/**
 * Vault container configuration
 * Each container maps to a government submission destination
 */
export const VAULT_CONTAINERS = [
  {
    id: "fire_safety",
    name: "Fire Safety Portal",
    description: "Annual Fire Safety Statement",
    categories: ["fire_safety"] as VaultCategory[],
    submissionUrl: SUBMISSION_LINKS.fire_safety,
    requiredDocs: ["Annual Fire Safety Statement"],
  },
  {
    id: "strata_hub",
    name: "Strata Hub Portal",
    description: "Insurance, Financial Statement, Capital Works Plan",
    categories: ["insurance", "financials"] as VaultCategory[],
    submissionUrl: SUBMISSION_LINKS.strata_hub,
    requiredDocs: ["Insurance Certificate", "Financial Statement", "Capital Works Plan"],
  },
] as const;

export type VaultContainerId = typeof VAULT_CONTAINERS[number]["id"];
