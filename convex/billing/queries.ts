import { v } from "convex/values";
import { query } from "../_generated/server";
import {
  calculateMonthlyPrice,
  getTierInfo,
  TRIAL_WARNING_DAYS,
} from "./constants";

/**
 * Get subscription for a scheme
 */
export const getSubscription = query({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .first();

    return subscription;
  },
});

/**
 * Get comprehensive billing status for a scheme
 * Returns unified status for trial, subscription, and access control
 */
export const getBillingStatus = query({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args) => {
    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      return null;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .first();

    const now = Date.now();
    const lotCount = scheme.lotCount ?? 1;

    // Calculate pricing info
    const tierInfo = getTierInfo(lotCount);
    const monthlyPrice = calculateMonthlyPrice(lotCount);

    // Determine trial status
    let trialDaysRemaining: number | null = null;
    let trialStatus: "active" | "expiring_soon" | "urgent" | "expired" | null =
      null;

    if (scheme.trialEndsAt) {
      const daysRemaining = Math.ceil(
        (scheme.trialEndsAt - now) / (1000 * 60 * 60 * 24)
      );
      trialDaysRemaining = Math.max(0, daysRemaining);

      if (daysRemaining <= 0) {
        trialStatus = "expired";
      } else if (daysRemaining <= TRIAL_WARNING_DAYS.CRITICAL) {
        trialStatus = "urgent";
      } else if (daysRemaining <= TRIAL_WARNING_DAYS.URGENT) {
        trialStatus = "expiring_soon";
      } else {
        trialStatus = "active";
      }
    }

    // Determine overall access and status
    let canAccess = false;
    let status:
      | "trial"
      | "active"
      | "past_due"
      | "canceled"
      | "expired"
      | "none" = "none";
    let planName: string | null = null;

    if (subscription) {
      // Has subscription
      switch (subscription.status) {
        case "active":
        case "trialing":
          canAccess = true;
          status = "active";
          planName = `${tierInfo.name} (${lotCount} lots)`;
          break;
        case "past_due":
          // Allow access but show warning
          canAccess = true;
          status = "past_due";
          planName = `${tierInfo.name} (${lotCount} lots)`;
          break;
        case "canceled":
          // Access until period end
          canAccess = subscription.currentPeriodEnd > now;
          status = "canceled";
          planName = `${tierInfo.name} (${lotCount} lots)`;
          break;
        default:
          canAccess = false;
          status = "expired";
      }
    } else if (scheme.trialEndsAt) {
      // In trial
      if (scheme.trialEndsAt > now) {
        canAccess = true;
        status = "trial";
        planName = "Free Trial";
      } else {
        canAccess = false;
        status = "expired";
      }
    } else {
      // Grandfathered / no trial set - allow access
      canAccess = true;
      status = "active";
      planName = "Grandfathered";
    }

    return {
      // Access control
      canAccess,
      status,

      // Plan info
      planName,
      lotCount,
      tierName: tierInfo.name,
      pricePerLot: tierInfo.pricePerLot,
      monthlyPrice,
      discount: tierInfo.discount,

      // Trial info
      trialStatus,
      trialDaysRemaining,
      trialEndsAt: scheme.trialEndsAt,

      // Subscription info
      subscription: subscription
        ? {
            id: subscription._id,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          }
        : null,

      // Stripe customer
      stripeCustomerId: scheme.stripeCustomerId,
    };
  },
});

/**
 * Get billing history (invoices) - placeholder for now
 * Will be populated from Stripe webhook events
 */
export const getBillingHistory = query({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args) => {
    // For now, return empty array
    // In production, this would fetch from Stripe or a local cache
    return [];
  },
});
