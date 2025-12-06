import { v } from "convex/values";
import { mutation, internalMutation } from "../_generated/server";

/**
 * Create or update subscription from webhook data
 */
export const upsertSubscription = internalMutation({
  args: {
    schemeId: v.id("schemes"),
    stripeSubscriptionId: v.string(),
    stripeCustomerId: v.string(),
    stripePriceId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("past_due"),
      v.literal("canceled"),
      v.literal("unpaid"),
      v.literal("trialing"),
      v.literal("incomplete"),
      v.literal("incomplete_expired")
    ),
    lotCount: v.number(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
    canceledAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if subscription already exists
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_stripe_subscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
      )
      .first();

    if (existing) {
      // Update existing subscription
      await ctx.db.patch(existing._id, {
        status: args.status,
        stripePriceId: args.stripePriceId,
        lotCount: args.lotCount,
        currentPeriodStart: args.currentPeriodStart,
        currentPeriodEnd: args.currentPeriodEnd,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd,
        canceledAt: args.canceledAt,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new subscription
      const subscriptionId = await ctx.db.insert("subscriptions", {
        schemeId: args.schemeId,
        stripeSubscriptionId: args.stripeSubscriptionId,
        stripeCustomerId: args.stripeCustomerId,
        stripePriceId: args.stripePriceId,
        status: args.status,
        lotCount: args.lotCount,
        currentPeriodStart: args.currentPeriodStart,
        currentPeriodEnd: args.currentPeriodEnd,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd,
        canceledAt: args.canceledAt,
        createdAt: now,
        updatedAt: now,
      });
      return subscriptionId;
    }
  },
});

/**
 * Update subscription status
 */
export const updateSubscriptionStatus = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("past_due"),
      v.literal("canceled"),
      v.literal("unpaid"),
      v.literal("trialing"),
      v.literal("incomplete"),
      v.literal("incomplete_expired")
    ),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    canceledAt: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_stripe_subscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
      )
      .first();

    if (!subscription) {
      console.error(
        `Subscription not found: ${args.stripeSubscriptionId}`
      );
      return null;
    }

    const updates: Record<string, unknown> = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.cancelAtPeriodEnd !== undefined) {
      updates.cancelAtPeriodEnd = args.cancelAtPeriodEnd;
    }
    if (args.canceledAt !== undefined) {
      updates.canceledAt = args.canceledAt;
    }
    if (args.currentPeriodEnd !== undefined) {
      updates.currentPeriodEnd = args.currentPeriodEnd;
    }

    await ctx.db.patch(subscription._id, updates);
    return subscription._id;
  },
});

/**
 * Record webhook event for idempotency
 */
export const recordWebhookEvent = internalMutation({
  args: {
    stripeEventId: v.string(),
    eventType: v.string(),
    payload: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if event already processed
    const existing = await ctx.db
      .query("webhookEvents")
      .withIndex("by_stripe_event", (q) =>
        q.eq("stripeEventId", args.stripeEventId)
      )
      .first();

    if (existing) {
      return { alreadyProcessed: true, eventId: existing._id };
    }

    // Create new event record
    const eventId = await ctx.db.insert("webhookEvents", {
      stripeEventId: args.stripeEventId,
      eventType: args.eventType,
      processed: false,
      payload: args.payload,
      createdAt: Date.now(),
    });

    return { alreadyProcessed: false, eventId };
  },
});

/**
 * Mark webhook event as processed
 */
export const markWebhookProcessed = internalMutation({
  args: {
    eventId: v.id("webhookEvents"),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.eventId, {
      processed: true,
      processedAt: Date.now(),
      errorMessage: args.errorMessage,
    });
  },
});

/**
 * Update scheme's Stripe customer ID
 */
export const updateSchemeStripeCustomer = internalMutation({
  args: {
    schemeId: v.id("schemes"),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.schemeId, {
      stripeCustomerId: args.stripeCustomerId,
    });
  },
});

/**
 * Clear trial (called when subscription becomes active)
 */
export const clearTrial = internalMutation({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.schemeId, {
      trialEndsAt: undefined,
    });
  },
});
