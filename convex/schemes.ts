import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { checkAccess, requireRole, requireAuth } from "./lib/permissions";

// 14 days in milliseconds
const TRIAL_DURATION_MS = 14 * 24 * 60 * 60 * 1000;

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user - return empty array if not authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      return [];
    }

    // Get user's scheme memberships
    const userSchemes = await ctx.db
      .query("userSchemes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Fetch each scheme the user has access to
    const schemes = await Promise.all(
      userSchemes.map(async (us) => {
        const scheme = await ctx.db.get(us.schemeId);
        return scheme ? { ...scheme, role: us.role } : null;
      })
    );

    return schemes.filter((s) => s !== null);
  },
});

export const get = query({
  args: { id: v.id("schemes") },
  handler: async (ctx, args) => {
    // Try to verify user has access - return null if no access instead of throwing
    try {
      await checkAccess(ctx, args.id);
    } catch {
      // User doesn't have access to this scheme - return null gracefully
      return null;
    }

    return await ctx.db.get(args.id);
  },
});

/**
 * Get scheme by ID - used by billing actions
 * This version doesn't check user access as it's called from internal actions
 */
export const getScheme = query({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.schemeId);
  },
});

export const getByStrataNumber = query({
  args: { strataNumber: v.string() },
  handler: async (ctx, args) => {
    // Return null if not authenticated (e.g., during logout)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Require authentication to prevent enumeration attacks
    const user = await requireAuth(ctx);

    // Find the scheme
    const scheme = await ctx.db
      .query("schemes")
      .withIndex("by_strata_number", (q) =>
        q.eq("strataNumber", args.strataNumber)
      )
      .first();

    if (!scheme) {
      return null;
    }

    // Verify user has access to this scheme
    const membership = await ctx.db
      .query("userSchemes")
      .withIndex("by_user_and_scheme", (q) =>
        q.eq("userId", user._id).eq("schemeId", scheme._id)
      )
      .first();

    if (!membership) {
      // User doesn't have access - return null instead of throwing
      // to prevent revealing whether the scheme exists
      return null;
    }

    return scheme;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    strataNumber: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if strata number already exists
    const existing = await ctx.db
      .query("schemes")
      .withIndex("by_strata_number", (q) =>
        q.eq("strataNumber", args.strataNumber)
      )
      .first();

    if (existing) {
      throw new Error(`Scheme with strata number ${args.strataNumber} already exists`);
    }

    const schemeId = await ctx.db.insert("schemes", {
      name: args.name,
      strataNumber: args.strataNumber,
    });

    return schemeId;
  },
});

export const update = mutation({
  args: {
    id: v.id("schemes"),
    name: v.optional(v.string()),
    strataNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Verify user has admin role for this scheme
    await requireRole(ctx, id, "admin");

    const scheme = await ctx.db.get(id);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleanUpdates).length > 0) {
      await ctx.db.patch(id, cleanUpdates);
    }

    return { success: true };
  },
});

/**
 * Create a user's first scheme during onboarding.
 * This is a single transaction that:
 * 1. Creates the scheme with a 14-day trial
 * 2. Links the current user as admin
 */
export const createFirstScheme = mutation({
  args: {
    name: v.string(),
    strataNumber: v.string(),
    address: v.optional(v.string()),
    lotCount: v.optional(v.number()), // Number of lots in the scheme
  },
  handler: async (ctx, args) => {
    // Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found. Please refresh and try again.");
    }

    // Check if strata number already exists
    const existing = await ctx.db
      .query("schemes")
      .withIndex("by_strata_number", (q) => q.eq("strataNumber", args.strataNumber))
      .first();

    if (existing) {
      throw new Error(`Scheme with strata number ${args.strataNumber} already exists`);
    }

    const now = Date.now();

    // Step 1: Create the scheme with trial period
    const schemeId = await ctx.db.insert("schemes", {
      name: args.name,
      strataNumber: args.strataNumber,
      address: args.address,
      lotCount: args.lotCount,
      trialEndsAt: now + TRIAL_DURATION_MS,
    });

    // Step 2: Create the user-scheme link with admin role
    await ctx.db.insert("userSchemes", {
      userId: user._id,
      schemeId: schemeId,
      role: "admin",
      joinedAt: now,
    });

    return schemeId;
  },
});

/**
 * Delete orphan schemes (schemes with no user links).
 * This cleans up schemes created by the old create mutation that didn't create userScheme links.
 * Internal mutation - can be called from CLI or dashboard.
 */
export const deleteOrphanSchemes = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all schemes
    const allSchemes = await ctx.db.query("schemes").collect();

    let deleted = 0;
    for (const scheme of allSchemes) {
      // Check if this scheme has any user links
      const userLink = await ctx.db
        .query("userSchemes")
        .withIndex("by_scheme", (q) => q.eq("schemeId", scheme._id))
        .first();

      if (!userLink) {
        // No user links - this is an orphan scheme, delete it
        await ctx.db.delete(scheme._id);
        deleted++;
      }
    }

    return { deleted, message: `Deleted ${deleted} orphan scheme(s)` };
  },
});

/**
 * Get trial status for a scheme.
 */
export const getTrialStatus = query({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args) => {
    // Return null if not authenticated (e.g., during logout)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Verify user has access to this scheme
    await checkAccess(ctx, args.schemeId);

    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    const now = Date.now();

    // No trial set = paid/grandfathered
    if (!scheme.trialEndsAt) {
      return {
        isOnTrial: false,
        isExpired: false,
        isPaid: true,
        daysRemaining: null,
        trialEndsAt: null,
      };
    }

    const daysRemaining = Math.max(
      0,
      Math.ceil((scheme.trialEndsAt - now) / (24 * 60 * 60 * 1000))
    );
    const isExpired = scheme.trialEndsAt < now;

    return {
      isOnTrial: !isExpired,
      isExpired,
      isPaid: false,
      daysRemaining,
      trialEndsAt: scheme.trialEndsAt,
    };
  },
});
