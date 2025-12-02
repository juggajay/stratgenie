/**
 * Internal helpers for levy email dispatch.
 * These are called by the confirmIssueLevyRun action.
 */

import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { calculatePercentageShare } from "./lib/financialMath";

/**
 * Internal query to get a levy run with all its invoices and lot details.
 * Used by the confirmIssueLevyRun action.
 */
export const getLevyRunWithInvoicesInternal = internalQuery({
  args: {
    levyRunId: v.id("levyRuns"),
  },
  handler: async (ctx, args) => {
    const levyRun = await ctx.db.get(args.levyRunId);
    if (!levyRun) return null;

    // Get all invoices for this run
    const invoices = await ctx.db
      .query("levyInvoices")
      .withIndex("by_levy_run", (q) => q.eq("levyRunId", args.levyRunId))
      .collect();

    // Get lot details and total entitlement
    const lots = await ctx.db
      .query("lots")
      .withIndex("by_scheme", (q) => q.eq("schemeId", levyRun.schemeId))
      .collect();

    const totalEntitlement = lots.reduce(
      (sum, lot) => sum + lot.unitEntitlement,
      0
    );

    // Enrich invoices with lot details
    const invoicesWithLots = await Promise.all(
      invoices.map(async (invoice) => {
        const lot = await ctx.db.get(invoice.lotId);
        return {
          ...invoice,
          lot: lot
            ? {
                ...lot,
                percentageShare: calculatePercentageShare(
                  lot.unitEntitlement,
                  totalEntitlement
                ),
              }
            : null,
        };
      })
    );

    return {
      ...levyRun,
      invoices: invoicesWithLots,
      totalEntitlement,
    };
  },
});

/**
 * Internal query to get a scheme by ID.
 * Used by the confirmIssueLevyRun action.
 */
export const getSchemeInternal = internalQuery({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.schemeId);
  },
});

/**
 * Internal mutation to mark an invoice as sent.
 * Used by the confirmIssueLevyRun action.
 */
export const markInvoiceSentInternal = internalMutation({
  args: {
    invoiceId: v.id("levyInvoices"),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    await ctx.db.patch(args.invoiceId, {
      status: "sent",
      sentAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Internal mutation to update a levy run's status.
 * Used by the confirmIssueLevyRun action.
 */
export const updateLevyRunStatusInternal = internalMutation({
  args: {
    levyRunId: v.id("levyRuns"),
    status: v.union(v.literal("draft"), v.literal("issued")),
  },
  handler: async (ctx, args) => {
    const levyRun = await ctx.db.get(args.levyRunId);
    if (!levyRun) {
      throw new Error("Levy run not found");
    }

    await ctx.db.patch(args.levyRunId, {
      status: args.status,
    });

    return { success: true };
  },
});
