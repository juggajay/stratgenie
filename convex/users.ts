import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Store or update a user from Clerk authentication.
 * Called on each authenticated page load to sync user data.
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update lastLoginAt for returning user
      await ctx.db.patch(existingUser._id, {
        lastLoginAt: now,
        // Also update email/name in case they changed in Clerk
        email: identity.email ?? existingUser.email,
        name: identity.name ?? existingUser.name,
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email ?? "",
      name: identity.name,
      createdAt: now,
      lastLoginAt: now,
    });

    return userId;
  },
});

/**
 * Get the current authenticated user with their schemes.
 * Returns null if not authenticated.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      return null;
    }

    // Get user's scheme memberships
    const userSchemes = await ctx.db
      .query("userSchemes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Fetch the actual scheme data
    const schemes = await Promise.all(
      userSchemes.map(async (us) => {
        const scheme = await ctx.db.get(us.schemeId);
        return scheme ? { ...scheme, role: us.role } : null;
      })
    );

    return {
      ...user,
      schemes: schemes.filter(Boolean),
    };
  },
});

/**
 * Get all schemes the current user has access to.
 */
export const getUserSchemes = query({
  args: {},
  handler: async (ctx) => {
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

    const userSchemes = await ctx.db
      .query("userSchemes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const schemes = await Promise.all(
      userSchemes.map(async (us) => {
        const scheme = await ctx.db.get(us.schemeId);
        return scheme
          ? {
              ...scheme,
              role: us.role,
              joinedAt: us.joinedAt,
            }
          : null;
      })
    );

    return schemes.filter(Boolean);
  },
});

/**
 * Check if the current user exists in the database.
 * Useful for determining if we need to call store().
 */
export const exists = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    return !!user;
  },
});
