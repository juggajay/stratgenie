"use node";

import { v } from "convex/values";
import { action, internalAction } from "../_generated/server";
import { internal, api } from "../_generated/api";
import Stripe from "stripe";

// Initialize Stripe with secret key from environment
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }
  return new Stripe(secretKey, {
    apiVersion: "2024-11-20.acacia",
  });
};

/**
 * Create a Stripe Checkout Session for subscription
 */
export const createCheckoutSession = action({
  args: {
    schemeId: v.id("schemes"),
    successUrl: v.string(),
    cancelUrl: v.string(),
  },
  handler: async (ctx, args): Promise<{ url: string | null }> => {
    const stripe = getStripe();

    // Get scheme details
    const scheme = await ctx.runQuery(api.schemes.getScheme, {
      schemeId: args.schemeId,
    });

    if (!scheme) {
      throw new Error("Scheme not found");
    }

    const lotCount = scheme.lotCount ?? 1;

    // Get or create Stripe customer
    let customerId = scheme.stripeCustomerId;

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        name: scheme.name,
        metadata: {
          schemeId: args.schemeId,
          strataNumber: scheme.strataNumber,
        },
      });
      customerId = customer.id;

      // Save customer ID to scheme
      await ctx.runMutation(internal.billing.mutations.updateSchemeStripeCustomer, {
        schemeId: args.schemeId,
        stripeCustomerId: customerId,
      });
    }

    // Get the price ID from environment
    const priceId = process.env.STRIPE_PRICE_PER_LOT_MONTHLY;
    if (!priceId) {
      throw new Error("STRIPE_PRICE_PER_LOT_MONTHLY environment variable is not set");
    }

    // Create checkout session with quantity = lot count
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: lotCount,
        },
      ],
      success_url: args.successUrl,
      cancel_url: args.cancelUrl,
      subscription_data: {
        metadata: {
          schemeId: args.schemeId,
          lotCount: lotCount.toString(),
        },
      },
      metadata: {
        schemeId: args.schemeId,
        lotCount: lotCount.toString(),
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      tax_id_collection: {
        enabled: true,
      },
    });

    return { url: session.url };
  },
});

/**
 * Create a Stripe Customer Portal session
 */
export const createPortalSession = action({
  args: {
    schemeId: v.id("schemes"),
    returnUrl: v.string(),
  },
  handler: async (ctx, args): Promise<{ url: string }> => {
    const stripe = getStripe();

    // Get scheme details
    const scheme = await ctx.runQuery(api.schemes.getScheme, {
      schemeId: args.schemeId,
    });

    if (!scheme) {
      throw new Error("Scheme not found");
    }

    if (!scheme.stripeCustomerId) {
      throw new Error("No Stripe customer found for this scheme");
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: scheme.stripeCustomerId,
      return_url: args.returnUrl,
    });

    return { url: session.url };
  },
});

/**
 * Process webhook event (called from API route)
 */
export const processWebhookEvent = internalAction({
  args: {
    eventId: v.string(),
    eventType: v.string(),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    const stripe = getStripe();

    // Record event for idempotency
    const { alreadyProcessed, eventId } = await ctx.runMutation(
      internal.billing.mutations.recordWebhookEvent,
      {
        stripeEventId: args.eventId,
        eventType: args.eventType,
        payload: args.payload,
      }
    );

    if (alreadyProcessed) {
      console.log(`Event ${args.eventId} already processed, skipping`);
      return { success: true, skipped: true };
    }

    try {
      const event = JSON.parse(args.payload);

      switch (args.eventType) {
        case "checkout.session.completed": {
          await handleCheckoutCompleted(ctx, stripe, event.data.object);
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated": {
          await handleSubscriptionUpdated(ctx, event.data.object);
          break;
        }

        case "customer.subscription.deleted": {
          await handleSubscriptionDeleted(ctx, event.data.object);
          break;
        }

        case "invoice.payment_failed": {
          await handlePaymentFailed(ctx, event.data.object);
          break;
        }

        default:
          console.log(`Unhandled event type: ${args.eventType}`);
      }

      // Mark event as processed
      await ctx.runMutation(internal.billing.mutations.markWebhookProcessed, {
        eventId,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Mark event as processed with error
      await ctx.runMutation(internal.billing.mutations.markWebhookProcessed, {
        eventId,
        errorMessage,
      });

      console.error(`Error processing webhook: ${errorMessage}`);
      throw error;
    }
  },
});

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutCompleted(
  ctx: any,
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  const schemeId = session.metadata?.schemeId;
  const lotCount = parseInt(session.metadata?.lotCount ?? "1", 10);

  if (!schemeId) {
    console.error("No schemeId in checkout session metadata");
    return;
  }

  // Get subscription details from Stripe
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await ctx.runMutation(internal.billing.mutations.upsertSubscription, {
      schemeId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0]?.price.id ?? "",
      status: subscription.status as any,
      lotCount,
      currentPeriodStart: subscription.current_period_start * 1000,
      currentPeriodEnd: subscription.current_period_end * 1000,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });

    // Clear trial since user has subscribed
    await ctx.runMutation(internal.billing.mutations.clearTrial, {
      schemeId,
    });
  }
}

/**
 * Handle subscription updated event
 */
async function handleSubscriptionUpdated(
  ctx: any,
  subscription: Stripe.Subscription
) {
  const schemeId = subscription.metadata?.schemeId;

  if (!schemeId) {
    console.error("No schemeId in subscription metadata");
    return;
  }

  await ctx.runMutation(internal.billing.mutations.updateSubscriptionStatus, {
    stripeSubscriptionId: subscription.id,
    status: subscription.status as any,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at
      ? subscription.canceled_at * 1000
      : undefined,
    currentPeriodEnd: subscription.current_period_end * 1000,
  });
}

/**
 * Handle subscription deleted event
 */
async function handleSubscriptionDeleted(
  ctx: any,
  subscription: Stripe.Subscription
) {
  await ctx.runMutation(internal.billing.mutations.updateSubscriptionStatus, {
    stripeSubscriptionId: subscription.id,
    status: "canceled",
    canceledAt: Date.now(),
  });
}

/**
 * Handle payment failed event
 */
async function handlePaymentFailed(ctx: any, invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    await ctx.runMutation(internal.billing.mutations.updateSubscriptionStatus, {
      stripeSubscriptionId: invoice.subscription as string,
      status: "past_due",
    });
  }
}
