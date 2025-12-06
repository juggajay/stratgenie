import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { internal } from "@/convex/_generated/api";

// Lazy initialization to avoid build-time errors
let stripe: Stripe | null = null;
let convex: ConvexHttpClient | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    stripe = new Stripe(secretKey, {
      apiVersion: "2024-11-20.acacia",
    });
  }
  return stripe;
}

function getConvex(): ConvexHttpClient {
  if (!convex) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL not configured");
    }
    convex = new ConvexHttpClient(url);
  }
  return convex;
}

/**
 * Stripe webhook handler
 * Receives events from Stripe and processes them
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("No stripe-signature header");
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`Webhook signature verification failed: ${message}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${message}` },
        { status: 400 }
      );
    }

    // Log the event for debugging
    console.log(`Received Stripe event: ${event.type} (${event.id})`);

    // Process the event via Convex action
    try {
      await getConvex().action(internal.billing.actions.processWebhookEvent, {
        eventId: event.id,
        eventType: event.type,
        payload: JSON.stringify(event),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`Error processing webhook event: ${message}`);
      // Still return 200 to acknowledge receipt
      // The event is logged and can be retried manually if needed
    }

    // Return 200 immediately to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Webhook error: ${message}`);
    return NextResponse.json(
      { error: `Webhook handler failed: ${message}` },
      { status: 500 }
    );
  }
}

// Disable body parsing for webhook (need raw body for signature verification)
export const config = {
  api: {
    bodyParser: false,
  },
};
