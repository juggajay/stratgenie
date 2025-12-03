import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { calculatePercentageShare } from "./lib/financialMath";

// ============================================================================
// Queries
// ============================================================================

/**
 * List all lots for a scheme, sorted by lot number.
 * Includes calculated percentage share based on total entitlements.
 */
export const listLotsForScheme = query({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    const lots = await ctx.db
      .query("lots")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .collect();

    // Calculate total entitlement for percentage calculation
    const totalEntitlement = lots.reduce(
      (sum, lot) => sum + lot.unitEntitlement,
      0
    );

    // Sort by lot number (natural sort for mixed alphanumeric)
    const sortedLots = lots.sort((a, b) =>
      a.lotNumber.localeCompare(b.lotNumber, undefined, { numeric: true })
    );

    return sortedLots.map((lot) => ({
      ...lot,
      percentageShare: calculatePercentageShare(
        lot.unitEntitlement,
        totalEntitlement
      ),
    }));
  },
});

/**
 * Get a single lot by ID.
 */
export const getLot = query({
  args: {
    lotId: v.id("lots"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lotId);
  },
});

/**
 * Get the total unit entitlement for a scheme.
 */
export const getTotalUnitEntitlement = query({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    const lots = await ctx.db
      .query("lots")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .collect();

    const total = lots.reduce((sum, lot) => sum + lot.unitEntitlement, 0);
    const lotCount = lots.length;

    return { total, lotCount };
  },
});

/**
 * Check if a lot number already exists in a scheme.
 */
export const checkLotNumberExists = query({
  args: {
    schemeId: v.id("schemes"),
    lotNumber: v.string(),
    excludeLotId: v.optional(v.id("lots")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("lots")
      .withIndex("by_scheme_and_lot", (q) =>
        q.eq("schemeId", args.schemeId).eq("lotNumber", args.lotNumber)
      )
      .first();

    // If we're excluding a lot (for updates), check if the found lot is different
    if (existing && args.excludeLotId && existing._id === args.excludeLotId) {
      return false;
    }

    return existing !== null;
  },
});

// ============================================================================
// Mutations
// ============================================================================

/**
 * Create a new lot in a scheme.
 */
export const createLot = mutation({
  args: {
    schemeId: v.id("schemes"),
    lotNumber: v.string(),
    unitEntitlement: v.number(),
    ownerName: v.string(),
    ownerEmail: v.string(),
    ownerAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate scheme exists
    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    // Validate lot number is not empty
    if (!args.lotNumber.trim()) {
      throw new Error("Lot number is required");
    }

    // Validate unit entitlement is a positive integer
    if (
      !Number.isInteger(args.unitEntitlement) ||
      args.unitEntitlement <= 0
    ) {
      throw new Error("Unit entitlement must be a positive integer");
    }

    // Check for duplicate lot number
    const existing = await ctx.db
      .query("lots")
      .withIndex("by_scheme_and_lot", (q) =>
        q.eq("schemeId", args.schemeId).eq("lotNumber", args.lotNumber.trim())
      )
      .first();

    if (existing) {
      throw new Error(`Lot number "${args.lotNumber.trim()}" is already in use. Please choose a different lot number.`);
    }

    // Create the lot
    const lotId = await ctx.db.insert("lots", {
      schemeId: args.schemeId,
      lotNumber: args.lotNumber.trim(),
      unitEntitlement: args.unitEntitlement,
      ownerName: args.ownerName.trim(),
      ownerEmail: args.ownerEmail.trim().toLowerCase(),
      ownerAddress: args.ownerAddress?.trim() || undefined,
      createdAt: Date.now(),
    });

    return lotId;
  },
});

/**
 * Update an existing lot.
 */
export const updateLot = mutation({
  args: {
    lotId: v.id("lots"),
    lotNumber: v.optional(v.string()),
    unitEntitlement: v.optional(v.number()),
    ownerName: v.optional(v.string()),
    ownerEmail: v.optional(v.string()),
    ownerAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const lot = await ctx.db.get(args.lotId);
    if (!lot) {
      throw new Error("Lot not found");
    }

    // If changing lot number, check for duplicates
    if (args.lotNumber && args.lotNumber.trim() !== lot.lotNumber) {
      const existing = await ctx.db
        .query("lots")
        .withIndex("by_scheme_and_lot", (q) =>
          q.eq("schemeId", lot.schemeId).eq("lotNumber", args.lotNumber!.trim())
        )
        .first();

      if (existing) {
        throw new Error(
          `Lot number "${args.lotNumber!.trim()}" is already in use. Please choose a different lot number.`
        );
      }
    }

    // Validate unit entitlement if provided
    if (
      args.unitEntitlement !== undefined &&
      (!Number.isInteger(args.unitEntitlement) || args.unitEntitlement <= 0)
    ) {
      throw new Error("Unit entitlement must be a positive integer");
    }

    // Build update object with only provided fields
    const updates: Partial<{
      lotNumber: string;
      unitEntitlement: number;
      ownerName: string;
      ownerEmail: string;
      ownerAddress: string | undefined;
    }> = {};

    if (args.lotNumber) updates.lotNumber = args.lotNumber.trim();
    if (args.unitEntitlement) updates.unitEntitlement = args.unitEntitlement;
    if (args.ownerName) updates.ownerName = args.ownerName.trim();
    if (args.ownerEmail)
      updates.ownerEmail = args.ownerEmail.trim().toLowerCase();
    if (args.ownerAddress !== undefined)
      updates.ownerAddress = args.ownerAddress?.trim() || undefined;

    await ctx.db.patch(args.lotId, updates);

    return args.lotId;
  },
});

/**
 * Delete a lot.
 * Warns if there are existing levy invoices for this lot.
 */
export const deleteLot = mutation({
  args: {
    lotId: v.id("lots"),
  },
  handler: async (ctx, args) => {
    const lot = await ctx.db.get(args.lotId);
    if (!lot) {
      throw new Error("Lot not found");
    }

    // Check for existing levy invoices
    const invoices = await ctx.db
      .query("levyInvoices")
      .withIndex("by_lot", (q) => q.eq("lotId", args.lotId))
      .collect();

    if (invoices.length > 0) {
      throw new Error(
        `Cannot delete lot ${lot.lotNumber}: ${invoices.length} levy invoice(s) exist. Delete the levy runs first.`
      );
    }

    // Delete the lot
    await ctx.db.delete(args.lotId);

    return { success: true };
  },
});
