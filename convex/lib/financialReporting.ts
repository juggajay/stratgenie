/**
 * Financial reporting utilities for NSW statutory compliance.
 * Implements the "Statement of Key Financial Information" format
 * required under the Strata Schemes Management Regulation 2016.
 */

// ============================================================================
// Types
// ============================================================================

export type TransactionCategory =
  | "repairs"
  | "insurance"
  | "utilities"
  | "admin"
  | "cleaning"
  | "gardening"
  | "legal"
  | "other";

export type FundType = "admin" | "capital_works";

/**
 * NSW Statutory categories for Admin Fund expenses.
 */
export type AdminExpenseCategory =
  | "insurance"
  | "administration"
  | "repairs_maintenance"
  | "utilities"
  | "cleaning"
  | "gardening"
  | "legal_professional"
  | "other";

/**
 * NSW Statutory categories for Capital Works Fund expenses.
 */
export type CapitalWorksExpenseCategory = "major_works";

/**
 * Income categories (same for both funds).
 */
export type IncomeCategory = "levies" | "interest" | "other";

/**
 * Aggregated totals for a single fund.
 */
export interface FundTotals {
  income: {
    levies: bigint;
    interest: bigint;
    other: bigint;
    total: bigint;
  };
  expense: Record<string, bigint> & { total: bigint };
}

/**
 * Complete financial statistics for statutory reporting.
 */
export interface FinancialStats {
  adminFund: FundTotals;
  capitalWorksFund: FundTotals;
  periodStart: number;
  periodEnd: number;
  transactionCount: number;
}

/**
 * Input for closing balance calculation.
 */
export interface ClosingBalanceInput {
  openingBalance: bigint;
  totalIncome: bigint;
  totalExpenditure: bigint;
}

// ============================================================================
// Fund Inference
// ============================================================================

/**
 * Infer the fund type from a transaction category.
 * Default mapping per NSW strata conventions:
 * - Capital Works: repairs (major works)
 * - Admin Fund: everything else (insurance, utilities, admin, cleaning, gardening, legal, other)
 *
 * Note: Users can override this by explicitly setting the `fund` field.
 */
export function inferFundFromCategory(
  category: TransactionCategory | undefined
): FundType {
  // Major repairs typically come from Capital Works Fund
  if (category === "repairs") {
    return "capital_works";
  }

  // Everything else defaults to Admin Fund
  return "admin";
}

// ============================================================================
// Statutory Category Mapping
// ============================================================================

/**
 * Map a transaction category to the NSW statutory expense category.
 * This is used for the detailed breakdown in financial reports.
 */
export function getStatutoryExpenseCategory(
  category: TransactionCategory | undefined,
  fund: FundType
): string {
  if (fund === "capital_works") {
    // All Capital Works expenses are "Major Works"
    return "Major Works";
  }

  // Admin Fund expense categories
  switch (category) {
    case "insurance":
      return "Building Insurance";
    case "admin":
      return "Administration";
    case "repairs":
      return "Repairs & Maintenance";
    case "utilities":
      return "Utilities";
    case "cleaning":
      return "Cleaning";
    case "gardening":
      return "Gardening";
    case "legal":
      return "Legal & Professional";
    case "other":
    default:
      return "Other Expenses";
  }
}

/**
 * Get the display name for an income category.
 */
export function getStatutoryIncomeCategory(
  category: IncomeCategory
): string {
  switch (category) {
    case "levies":
      return "Levy Contributions";
    case "interest":
      return "Interest Received";
    case "other":
    default:
      return "Miscellaneous Income";
  }
}

// ============================================================================
// Balance Calculations
// ============================================================================

/**
 * Calculate closing balance using the statutory formula:
 * Closing Balance = Opening Balance + Total Income - Total Expenditure
 */
export function calculateClosingBalance(input: ClosingBalanceInput): bigint {
  return input.openingBalance + input.totalIncome - input.totalExpenditure;
}

// ============================================================================
// Financial Year Utilities
// ============================================================================

/**
 * Get the start and end timestamps for a financial year.
 * Australian financial year runs July 1 to June 30.
 *
 * @param year - The ending year of the financial year (e.g., 2025 for FY 2024-25)
 * @param yearEnd - Optional custom year end in "MM-DD" format (default: "06-30")
 * @returns Object with startDate and endDate as timestamps
 */
export function getFinancialYearDates(
  year: number,
  yearEnd: string = "06-30"
): { startDate: number; endDate: number; label: string } {
  const [endMonth, endDay] = yearEnd.split("-").map(Number);

  // Financial year ends on the given date
  const endDate = new Date(year, endMonth - 1, endDay, 23, 59, 59, 999);

  // Financial year starts the day after the previous year's end
  const startDate = new Date(year - 1, endMonth - 1, endDay + 1, 0, 0, 0, 0);

  // Handle month overflow (e.g., June 31 -> July 1)
  if (startDate.getDate() !== endDay + 1) {
    startDate.setDate(1);
  }

  return {
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
    label: `FY ${year - 1}-${String(year).slice(-2)}`,
  };
}

/**
 * Get a list of available financial years for selection.
 * Returns the current year and the previous 5 years.
 */
export function getAvailableFinancialYears(
  yearEnd: string = "06-30"
): Array<{ year: number; label: string }> {
  const now = new Date();
  const [endMonth, endDay] = yearEnd.split("-").map(Number);
  const fyEndThisYear = new Date(now.getFullYear(), endMonth - 1, endDay);

  // Determine current financial year
  const currentFY =
    now > fyEndThisYear ? now.getFullYear() + 1 : now.getFullYear();

  // Return current year and previous 5 years
  return Array.from({ length: 6 }, (_, i) => {
    const year = currentFY - i;
    return {
      year,
      label: `FY ${year - 1}-${String(year).slice(-2)}`,
    };
  });
}

// ============================================================================
// Aggregation Helpers
// ============================================================================

/**
 * Create empty fund totals structure.
 */
export function createEmptyFundTotals(): FundTotals {
  return {
    income: {
      levies: 0n,
      interest: 0n,
      other: 0n,
      total: 0n,
    },
    expense: {
      total: 0n,
    },
  };
}

/**
 * Create empty financial stats structure.
 */
export function createEmptyFinancialStats(
  periodStart: number,
  periodEnd: number
): FinancialStats {
  return {
    adminFund: createEmptyFundTotals(),
    capitalWorksFund: createEmptyFundTotals(),
    periodStart,
    periodEnd,
    transactionCount: 0,
  };
}

// ============================================================================
// Formatting Helpers
// ============================================================================

/**
 * Format cents as Australian Dollar currency string.
 */
export function formatAUD(cents: bigint): string {
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(dollars);
}

/**
 * Format a date for display in reports.
 */
export function formatReportDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
