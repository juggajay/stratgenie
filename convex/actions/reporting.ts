"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import {
  calculateClosingBalance,
  formatReportDate,
  getFinancialYearDates,
  type FinancialStats,
} from "../lib/financialReporting";

// ============================================================================
// Types
// ============================================================================

export interface FundReportData {
  openingBalance: number;
  totalIncome: number;
  totalExpenditure: number;
  closingBalance: number;
  incomeBreakdown: { category: string; amount: number }[];
  expenseBreakdown: { category: string; amount: number }[];
}

export interface StatutoryReportData {
  schemeName: string;
  strataNumber: string;
  address?: string;
  financialYear: string;
  periodStart: string;
  periodEnd: string;
  adminFund: FundReportData;
  capitalWorksFund: FundReportData;
  generatedDate: string;
  transactionCount: number;
}

export interface ReportValidation {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

// ============================================================================
// Helpers
// ============================================================================

function bigintToNumber(value: bigint | undefined | null): number {
  if (value === undefined || value === null) return 0;
  return Number(value);
}

function processFundStats(
  fundStats: FinancialStats["adminFund"],
  openingBalance: bigint | undefined
): FundReportData {
  const openingBalanceNum = bigintToNumber(openingBalance);
  const totalIncome = bigintToNumber(fundStats.income.total);
  const totalExpenditure = bigintToNumber(fundStats.expense.total);

  // Calculate closing balance
  const closingBalance = calculateClosingBalance({
    openingBalance: BigInt(openingBalanceNum),
    totalIncome: BigInt(totalIncome),
    totalExpenditure: BigInt(totalExpenditure),
  });

  // Build income breakdown
  const incomeBreakdown: { category: string; amount: number }[] = [];
  if (fundStats.income.levies > 0n) {
    incomeBreakdown.push({
      category: "Levy Contributions",
      amount: bigintToNumber(fundStats.income.levies),
    });
  }
  if (fundStats.income.interest > 0n) {
    incomeBreakdown.push({
      category: "Interest Received",
      amount: bigintToNumber(fundStats.income.interest),
    });
  }
  if (fundStats.income.other > 0n) {
    incomeBreakdown.push({
      category: "Miscellaneous Income",
      amount: bigintToNumber(fundStats.income.other),
    });
  }

  // Build expense breakdown (skip 'total' key)
  const expenseBreakdown: { category: string; amount: number }[] = [];
  for (const [category, amount] of Object.entries(fundStats.expense)) {
    if (category !== "total" && amount > 0n) {
      expenseBreakdown.push({
        category,
        amount: bigintToNumber(amount as bigint),
      });
    }
  }

  // Sort by amount descending
  expenseBreakdown.sort((a, b) => b.amount - a.amount);

  return {
    openingBalance: openingBalanceNum,
    totalIncome,
    totalExpenditure,
    closingBalance: Number(closingBalance),
    incomeBreakdown,
    expenseBreakdown,
  };
}

// ============================================================================
// Actions
// ============================================================================

/**
 * Generate statutory financial report data.
 * This prepares all the data needed for PDF generation.
 */
export const generateStatutoryReportData = action({
  args: {
    schemeId: v.id("schemes"),
    financialYear: v.number(), // e.g., 2025 for FY 2024-25
  },
  handler: async (ctx, args): Promise<StatutoryReportData> => {
    // Get scheme
    const scheme: Doc<"schemes"> | null = await ctx.runQuery(api.schemes.get, {
      id: args.schemeId,
    });

    if (!scheme) {
      throw new Error("Scheme not found");
    }

    // Get financial settings
    const settings = await ctx.runQuery(api.finance.getSchemeFinancialSettings, {
      schemeId: args.schemeId,
    });

    if (!settings) {
      throw new Error("Could not retrieve financial settings for scheme");
    }

    // Calculate date range for the financial year
    const yearEnd = settings.financialYearEnd || "06-30";
    const { startDate, endDate, label } = getFinancialYearDates(
      args.financialYear,
      yearEnd
    );

    // Get financial stats
    const stats: FinancialStats = await ctx.runQuery(api.finance.getFinancialStats, {
      schemeId: args.schemeId,
      startDate,
      endDate,
    });

    // Process admin fund
    const adminFund = processFundStats(
      stats.adminFund,
      settings.openingBalanceAdmin
    );

    // Process capital works fund
    const capitalWorksFund = processFundStats(
      stats.capitalWorksFund,
      settings.openingBalanceCapital
    );

    return {
      schemeName: scheme.name,
      strataNumber: scheme.strataNumber,
      address: scheme.address,
      financialYear: label,
      periodStart: formatReportDate(startDate),
      periodEnd: formatReportDate(endDate),
      adminFund,
      capitalWorksFund,
      generatedDate: formatReportDate(Date.now()),
      transactionCount: stats.transactionCount,
    };
  },
});

/**
 * Validate if a statutory report can be generated.
 * Checks for required data like opening balances.
 */
export const validateReportRequirements = action({
  args: {
    schemeId: v.id("schemes"),
    financialYear: v.number(),
  },
  handler: async (ctx, args): Promise<ReportValidation> => {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Get scheme
    const scheme: Doc<"schemes"> | null = await ctx.runQuery(api.schemes.get, {
      id: args.schemeId,
    });

    if (!scheme) {
      errors.push("Scheme not found");
      return { valid: false, warnings, errors };
    }

    // Get financial settings
    const settings = await ctx.runQuery(api.finance.getSchemeFinancialSettings, {
      schemeId: args.schemeId,
    });

    if (!settings) {
      errors.push("Could not retrieve financial settings");
      return { valid: false, warnings, errors };
    }

    // Check opening balances
    if (
      settings.openingBalanceAdmin === undefined ||
      settings.openingBalanceAdmin === null
    ) {
      warnings.push(
        "Administrative Fund opening balance not set. Using $0.00 as default."
      );
    }

    if (
      settings.openingBalanceCapital === undefined ||
      settings.openingBalanceCapital === null
    ) {
      warnings.push(
        "Capital Works Fund opening balance not set. Using $0.00 as default."
      );
    }

    // Calculate date range
    const yearEnd = settings.financialYearEnd || "06-30";
    const { startDate, endDate } = getFinancialYearDates(
      args.financialYear,
      yearEnd
    );

    // Check for transactions
    const stats: FinancialStats = await ctx.runQuery(api.finance.getFinancialStats, {
      schemeId: args.schemeId,
      startDate,
      endDate,
    });

    if (stats.transactionCount === 0) {
      warnings.push(
        "No approved transactions found for the selected financial year."
      );
    }

    return {
      valid: errors.length === 0,
      warnings,
      errors,
    };
  },
});

/**
 * Save a generated report to the Compliance Vault.
 * This creates a document record that appears in the vault.
 */
export const saveReportToVault = action({
  args: {
    schemeId: v.id("schemes"),
    financialYear: v.string(), // e.g., "FY 2024-25"
    htmlContent: v.string(), // HTML representation for document storage
  },
  handler: async (ctx, args): Promise<{ success: boolean; documentId: Id<"documents">; message: string }> => {
    // Create document record
    const documentId: Id<"documents"> = await ctx.runMutation(api.documents.createDocument, {
      schemeId: args.schemeId,
      type: "financial_report",
      title: `Statement of Key Financial Information - ${args.financialYear}`,
      content: args.htmlContent,
      vaultCategory: "financials",
      submissionStatus: "ready",
    });

    return {
      success: true,
      documentId,
      message: `Financial report saved to Compliance Vault`,
    };
  },
});
