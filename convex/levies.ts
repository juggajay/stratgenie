import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { internal } from "./_generated/api";
import {
  distributeBudget,
  calculatePercentageShare,
  LotEntitlement,
} from "./lib/financialMath";
import { isValidEmail } from "../lib/email-utils";
import { checkAccess, requireRole } from "./lib/permissions";

// ============================================================================
// Queries
// ============================================================================

/**
 * List all levy runs for a scheme, sorted by creation date (newest first).
 */
export const listLevyRunsForScheme = query({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    // Verify user has access to this scheme
    await checkAccess(ctx, args.schemeId);

    const levyRuns = await ctx.db
      .query("levyRuns")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .collect();

    // Get invoice counts for each run
    const runsWithCounts = await Promise.all(
      levyRuns.map(async (run) => {
        const invoices = await ctx.db
          .query("levyInvoices")
          .withIndex("by_levy_run", (q) => q.eq("levyRunId", run._id))
          .collect();

        const paidCount = invoices.filter((i) => i.status === "paid").length;
        const sentCount = invoices.filter((i) => i.status === "sent").length;
        const pendingCount = invoices.filter(
          (i) => i.status === "pending"
        ).length;

        return {
          ...run,
          invoiceCount: invoices.length,
          paidCount,
          sentCount,
          pendingCount,
        };
      })
    );

    // Sort by creation date descending
    return runsWithCounts.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get a single levy run with all its invoices and lot details.
 */
export const getLevyRunWithInvoices = query({
  args: {
    levyRunId: v.id("levyRuns"),
  },
  handler: async (ctx, args) => {
    const levyRun = await ctx.db.get(args.levyRunId);
    if (!levyRun) return null;

    // Verify user has access to this scheme
    await checkAccess(ctx, levyRun.schemeId);

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

    // Sort by lot number
    const sortedInvoices = invoicesWithLots.sort((a, b) => {
      if (!a.lot || !b.lot) return 0;
      return a.lot.lotNumber.localeCompare(b.lot.lotNumber, undefined, {
        numeric: true,
      });
    });

    // Get scheme name for display
    const scheme = await ctx.db.get(levyRun.schemeId);

    return {
      ...levyRun,
      invoices: sortedInvoices,
      totalEntitlement,
      schemeName: scheme?.name || "Strata Scheme",
    };
  },
});

/**
 * Get a preview of what will happen when issuing a levy run.
 * Returns counts of invoices with and without valid emails.
 */
export const getIssuePreview = query({
  args: {
    levyRunId: v.id("levyRuns"),
  },
  handler: async (ctx, args) => {
    const levyRun = await ctx.db.get(args.levyRunId);
    if (!levyRun) {
      return null;
    }

    // Verify user has access to this scheme
    await checkAccess(ctx, levyRun.schemeId);

    // Return null for non-draft runs (already issued)
    if (levyRun.status !== "draft") {
      return null;
    }

    // Get all invoices for this run
    const invoices = await ctx.db
      .query("levyInvoices")
      .withIndex("by_levy_run", (q) => q.eq("levyRunId", args.levyRunId))
      .collect();

    // Get lot details for each invoice
    const invoicesWithLots = await Promise.all(
      invoices.map(async (invoice) => {
        const lot = await ctx.db.get(invoice.lotId);
        return {
          invoiceId: invoice._id,
          lotId: invoice.lotId,
          email: lot?.ownerEmail ?? null,
          ownerName: lot?.ownerName ?? "Unknown",
        };
      })
    );

    // Count valid vs invalid emails
    const withEmail = invoicesWithLots.filter((inv) => isValidEmail(inv.email));
    const withoutEmail = invoicesWithLots.filter(
      (inv) => !isValidEmail(inv.email)
    );

    return {
      totalInvoices: invoices.length,
      withEmail: withEmail.length,
      withoutEmail: withoutEmail.length,
      emailAddresses: withEmail.map((inv) => inv.email as string),
      skippedOwners: withoutEmail.map((inv) => inv.ownerName),
    };
  },
});

/**
 * Preview levy calculations without creating records.
 * Returns what each lot would pay for a given budget.
 */
export const previewLevyRun = query({
  args: {
    schemeId: v.id("schemes"),
    totalAmountCents: v.int64(),
  },
  handler: async (ctx, args) => {
    // Verify user has access to this scheme
    await checkAccess(ctx, args.schemeId);

    // Debug logging
    console.log("[previewLevyRun] Called with:", {
      schemeId: args.schemeId,
      totalAmountCents: args.totalAmountCents,
      totalAmountCentsType: typeof args.totalAmountCents,
    });

    // Get all lots for the scheme
    const lots = await ctx.db
      .query("lots")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .collect();

    if (lots.length === 0) {
      return {
        success: false,
        error: "no_lots",
        message: "No lots registered. Please add lots to the strata roll first.",
        preview: [],
      };
    }

    if (args.totalAmountCents <= 0n) {
      return {
        success: false,
        error: "invalid_amount",
        message: "Budget must be greater than zero.",
        preview: [],
      };
    }

    // Calculate total entitlement
    const totalEntitlement = lots.reduce(
      (sum, lot) => sum + lot.unitEntitlement,
      0
    );

    // Prepare lot entitlements for distribution
    const lotEntitlements: LotEntitlement[] = lots.map((lot) => ({
      lotId: lot._id,
      unitEntitlement: lot.unitEntitlement,
    }));

    // Calculate distribution
    const allocations = distributeBudget(args.totalAmountCents, lotEntitlements);

    // Build preview with lot details
    const preview = lots
      .map((lot) => {
        const allocation = allocations.find((a) => a.lotId === lot._id);
        return {
          lotId: lot._id,
          lotNumber: lot.lotNumber,
          ownerName: lot.ownerName,
          ownerEmail: lot.ownerEmail,
          unitEntitlement: lot.unitEntitlement,
          percentageShare: calculatePercentageShare(
            lot.unitEntitlement,
            totalEntitlement
          ),
          amount: allocation?.amount ?? 0n,
        };
      })
      .sort((a, b) =>
        a.lotNumber.localeCompare(b.lotNumber, undefined, { numeric: true })
      );

    // Verify the sum equals the budget
    const sum = preview.reduce((s, p) => s + p.amount, 0n);

    return {
      success: true,
      totalEntitlement,
      lotCount: lots.length,
      budgetCents: args.totalAmountCents,
      sumCents: sum,
      balanced: sum === args.totalAmountCents,
      preview,
    };
  },
});

// ============================================================================
// Mutations
// ============================================================================

/**
 * Create a new levy run and generate invoices for all lots.
 */
export const createLevyRun = mutation({
  args: {
    schemeId: v.id("schemes"),
    fundType: v.union(v.literal("admin"), v.literal("capital_works")),
    totalAmountCents: v.int64(),
    periodLabel: v.string(),
    periodStart: v.number(),
    periodEnd: v.number(),
    dueDate: v.number(),
  },
  handler: async (ctx, args) => {
    // Verify user has member role for this scheme
    await requireRole(ctx, args.schemeId, "member");

    // Validate scheme exists
    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    // Validate amount
    if (args.totalAmountCents <= 0n) {
      throw new Error("Budget must be greater than zero");
    }

    // Get all lots for the scheme
    const lots = await ctx.db
      .query("lots")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .collect();

    if (lots.length === 0) {
      throw new Error(
        "No lots registered. Please add lots to the strata roll first."
      );
    }

    // Prepare lot entitlements for distribution
    const lotEntitlements: LotEntitlement[] = lots.map((lot) => ({
      lotId: lot._id,
      unitEntitlement: lot.unitEntitlement,
    }));

    // Calculate distribution using Largest Remainder Method
    const allocations = distributeBudget(args.totalAmountCents, lotEntitlements);

    // Create the levy run
    const levyRunId = await ctx.db.insert("levyRuns", {
      schemeId: args.schemeId,
      fundType: args.fundType,
      totalAmount: args.totalAmountCents,
      periodLabel: args.periodLabel.trim(),
      periodStart: args.periodStart,
      periodEnd: args.periodEnd,
      dueDate: args.dueDate,
      status: "draft",
      createdAt: Date.now(),
    });

    // Create levy invoices for each lot
    for (const allocation of allocations) {
      await ctx.db.insert("levyInvoices", {
        schemeId: args.schemeId,
        levyRunId,
        lotId: allocation.lotId as any, // Type cast since we know it's a valid ID
        amount: allocation.amount,
        status: "pending",
        createdAt: Date.now(),
      });
    }

    return levyRunId;
  },
});

/**
 * Issue a levy run (change status from draft to issued).
 */
export const issueLevyRun = mutation({
  args: {
    levyRunId: v.id("levyRuns"),
  },
  handler: async (ctx, args) => {
    const levyRun = await ctx.db.get(args.levyRunId);
    if (!levyRun) {
      throw new Error("Levy run not found");
    }

    // Verify user has member role for this scheme
    await requireRole(ctx, levyRun.schemeId, "member");

    if (levyRun.status !== "draft") {
      throw new Error("Only draft levy runs can be issued");
    }

    await ctx.db.patch(args.levyRunId, {
      status: "issued",
    });

    return { success: true };
  },
});

/**
 * Delete a draft levy run and all its invoices.
 */
export const deleteLevyRun = mutation({
  args: {
    levyRunId: v.id("levyRuns"),
  },
  handler: async (ctx, args) => {
    const levyRun = await ctx.db.get(args.levyRunId);
    if (!levyRun) {
      throw new Error("Levy run not found");
    }

    // Verify user has member role for this scheme
    await requireRole(ctx, levyRun.schemeId, "member");

    if (levyRun.status !== "draft") {
      throw new Error("Only draft levy runs can be deleted");
    }

    // Delete all invoices for this run
    const invoices = await ctx.db
      .query("levyInvoices")
      .withIndex("by_levy_run", (q) => q.eq("levyRunId", args.levyRunId))
      .collect();

    for (const invoice of invoices) {
      await ctx.db.delete(invoice._id);
    }

    // Delete the levy run
    await ctx.db.delete(args.levyRunId);

    return { success: true, deletedInvoices: invoices.length };
  },
});

/**
 * Mark a levy invoice as sent.
 */
export const markInvoiceSent = mutation({
  args: {
    invoiceId: v.id("levyInvoices"),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Verify user has member role for this scheme
    await requireRole(ctx, invoice.schemeId, "member");

    await ctx.db.patch(args.invoiceId, {
      status: "sent",
      sentAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Mark a levy invoice as paid.
 */
export const markInvoicePaid = mutation({
  args: {
    invoiceId: v.id("levyInvoices"),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Verify user has member role for this scheme
    await requireRole(ctx, invoice.schemeId, "member");

    await ctx.db.patch(args.invoiceId, {
      status: "paid",
      paidAt: Date.now(),
    });

    return { success: true };
  },
});

// ============================================================================
// Email Dispatch Action
// ============================================================================

/**
 * Confirm issuing a levy run with email dispatch.
 * Sends emails to all owners with valid email addresses.
 */
export const confirmIssueLevyRun = action({
  args: {
    levyRunId: v.id("levyRuns"),
  },
  handler: async (ctx, args) => {
    // Get levy run with invoices
    const levyRunData = await ctx.runQuery(
      internal.leviesInternal.getLevyRunWithInvoicesInternal,
      { levyRunId: args.levyRunId }
    );

    if (!levyRunData) {
      throw new Error("Levy run not found");
    }

    if (levyRunData.status !== "draft") {
      throw new Error("Only draft levy runs can be issued");
    }

    // Get scheme name
    const scheme = await ctx.runQuery(internal.leviesInternal.getSchemeInternal, {
      schemeId: levyRunData.schemeId,
    });

    const schemeName = scheme?.name || "Strata Scheme";

    // Track results
    let sent = 0;
    let skipped = 0;
    let failed = 0;

    // Process each invoice
    for (const invoice of levyRunData.invoices) {
      const lot = invoice.lot;

      // Skip if no lot data or no valid email
      if (!lot || !isValidEmail(lot.ownerEmail)) {
        skipped++;
        continue;
      }

      try {
        // Send email using internal action
        const result = await ctx.runAction(
          internal.actions.levyEmail.sendLevyNoticeEmail,
          {
            to: lot.ownerEmail,
            schemeName,
            invoice: {
              amount: invoice.amount,
              lotNumber: lot.lotNumber,
              ownerName: lot.ownerName,
              ownerEmail: lot.ownerEmail,
              ownerAddress: lot.ownerAddress,
              unitEntitlement: lot.unitEntitlement,
              percentageShare: lot.percentageShare,
            },
            levyRun: {
              fundType: levyRunData.fundType,
              periodLabel: levyRunData.periodLabel,
              dueDate: levyRunData.dueDate,
              totalAmount: levyRunData.totalAmount,
            },
          }
        );

        if (result.success) {
          // Mark invoice as sent
          await ctx.runMutation(internal.leviesInternal.markInvoiceSentInternal, {
            invoiceId: invoice._id,
          });
          sent++;
        } else {
          console.error(
            `[confirmIssueLevyRun] Failed to send to ${lot.ownerEmail}:`,
            result.error
          );
          failed++;
        }
      } catch (err) {
        console.error(
          `[confirmIssueLevyRun] Exception sending to ${lot.ownerEmail}:`,
          err
        );
        failed++;
      }
    }

    // Update levy run status to issued
    await ctx.runMutation(internal.leviesInternal.updateLevyRunStatusInternal, {
      levyRunId: args.levyRunId,
      status: "issued",
    });

    return {
      success: true,
      sent,
      skipped,
      failed,
    };
  },
});
