import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Capture a new lead from marketing tools
 */
export const capture = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    source: v.union(
      v.literal("strata_roll_template"),
      v.literal("compliance_health_check"),
      v.literal("newsletter"),
      v.literal("levy_calculator"),
      v.literal("strata_hub_reporter")
    ),
    metadata: v.optional(
      v.object({
        score: v.optional(v.number()),
        answers: v.optional(v.array(v.string())),
        calculatorInputs: v.optional(
          v.object({
            totalBudget: v.optional(v.number()),
            unitEntitlement: v.optional(v.number()),
            totalEntitlements: v.optional(v.number()),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Check if lead already exists
    const existingLead = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existingLead) {
      // Update existing lead with new source/metadata if different
      await ctx.db.patch(existingLead._id, {
        name: args.name || existingLead.name,
        metadata: args.metadata || existingLead.metadata,
      });
      return existingLead._id;
    }

    // Create new lead
    const leadId = await ctx.db.insert("leads", {
      email: args.email.toLowerCase(),
      name: args.name,
      source: args.source,
      metadata: args.metadata,
      createdAt: Date.now(),
    });

    return leadId;
  },
});

/**
 * Get leads by source (for admin dashboard)
 */
export const getBySource = query({
  args: {
    source: v.union(
      v.literal("strata_roll_template"),
      v.literal("compliance_health_check"),
      v.literal("newsletter"),
      v.literal("levy_calculator"),
      v.literal("strata_hub_reporter")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_source", (q) => q.eq("source", args.source))
      .collect();
  },
});

/**
 * Get all leads (for admin dashboard)
 */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leads").collect();
  },
});

/**
 * Check if an email has already used the Strata Hub Reporter
 */
export const checkStrataHubAccess = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existingLead = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    // Check if this email has used the strata hub reporter before
    const hasUsed = existingLead?.source === "strata_hub_reporter";

    return {
      hasUsed,
      existingLead: existingLead ? { name: existingLead.name } : null,
    };
  },
});
