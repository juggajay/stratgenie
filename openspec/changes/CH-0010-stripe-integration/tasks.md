# Tasks: Stripe Integration for Billing

## Phase 1: Foundation & Schema

### Task 1.1: Install Dependencies
```bash
npm install stripe
```
- **File:** `package.json`
- **Acceptance:** Stripe SDK available for import

### Task 1.2: Add Environment Variables
- **File:** `.env.local` (add to `.env.example` too)
- **Variables:**
  ```
  STRIPE_SECRET_KEY=sk_test_...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  STRIPE_PRICE_PER_LOT_MONTHLY=price_...
  ```
- **Acceptance:** Variables accessible in Convex actions and API routes

### Task 1.3: Update Convex Schema
- **File:** `convex/schema.ts`
- **Changes:**
  1. Add `subscriptions` table (with `lotCount` field for billing)
  2. Add `webhookEvents` table
  3. Add `stripeCustomerId` to `schemes` table
- **Acceptance:** `npx convex dev` runs without schema errors

### Task 1.4: Create Stripe Product with Volume Pricing
- **Location:** Stripe Dashboard → Products
- **Create:** "StrataGenie Per-Lot Subscription"
- **Pricing Mode:** Tiered pricing → Volume
- **Tiers (AUD):**
  - 1-10 lots: $14.99/lot/month
  - 11-50 lots: $11.99/lot/month
  - 51+ lots: $8.99/lot/month
- **Acceptance:** Single price ID with volume tiers configured

---

## Phase 2: Convex Backend

### Task 2.1: Create Billing Constants
- **File:** `convex/billing/constants.ts`
- **Contents:**
  ```typescript
  export const PRICING_TIERS = [
    { maxLots: 10, pricePerLot: 14.99, name: "Standard" },
    { maxLots: 50, pricePerLot: 11.99, name: "Growth" },
    { maxLots: Infinity, pricePerLot: 8.99, name: "Scale" },
  ];

  export function calculateMonthlyPrice(lotCount: number): number {
    const tier = PRICING_TIERS.find(t => lotCount <= t.maxLots)!;
    return lotCount * tier.pricePerLot;
  }

  export function getTierName(lotCount: number): string {
    const tier = PRICING_TIERS.find(t => lotCount <= t.maxLots)!;
    return tier.name;
  }
  ```
- **Acceptance:** Pricing calculation functions work correctly

### Task 2.2: Create Stripe Client Helper
- **File:** `convex/billing/stripe.ts`
- **Contents:**
  - Initialize Stripe client with secret key
  - Helper functions for common operations
- **Acceptance:** Can import and use Stripe client in actions

### Task 2.3: Implement createCheckoutSession Action
- **File:** `convex/billing/actions.ts`
- **Logic:**
  1. Verify caller is scheme admin
  2. Get or create Stripe customer for scheme
  3. Create Stripe Checkout Session
  4. Return checkout URL
- **Acceptance:** Returns valid Stripe checkout URL

### Task 2.4: Implement createPortalSession Action
- **File:** `convex/billing/actions.ts`
- **Logic:**
  1. Verify caller is scheme admin
  2. Get Stripe customer ID from scheme
  3. Create Stripe Customer Portal session
  4. Return portal URL
- **Acceptance:** Returns valid portal URL

### Task 2.5: Implement getSubscription Query
- **File:** `convex/billing/queries.ts`
- **Logic:**
  1. Query subscriptions table by schemeId
  2. Return subscription or null
- **Acceptance:** Returns correct subscription data

### Task 2.6: Implement getBillingStatus Query
- **File:** `convex/billing/queries.ts`
- **Logic:**
  1. Get subscription (if any)
  2. Get trial status from scheme
  3. Combine into unified billing status
  4. Return: `{ canAccess, status, planName, daysRemaining, ... }`
- **Acceptance:** Correctly identifies trial, active, expired states

### Task 2.7: Implement Subscription Mutations
- **File:** `convex/billing/mutations.ts`
- **Functions:**
  - `createSubscription` - Create from webhook data
  - `updateSubscription` - Update from webhook data
  - `recordWebhookEvent` - Log received events
- **Acceptance:** Webhook processing can update database

---

## Phase 3: Webhook Handler

### Task 3.1: Create Webhook API Route
- **File:** `app/api/webhooks/stripe/route.ts`
- **Logic:**
  1. Get raw body from request
  2. Get `stripe-signature` header
  3. Verify webhook signature with Stripe SDK
  4. Call Convex action to process event
  5. Return 200 OK immediately
- **Acceptance:** Webhook receives and verifies Stripe events

### Task 3.2: Implement processWebhookEvent Action
- **File:** `convex/billing/actions.ts`
- **Logic:**
  1. Check idempotency (skip if event ID already processed)
  2. Switch on event type:
     - `checkout.session.completed` → create subscription
     - `customer.subscription.updated` → update subscription
     - `customer.subscription.deleted` → mark canceled
     - `invoice.payment_failed` → update status to past_due
  3. Mark event as processed
- **Acceptance:** All major event types handled correctly

### Task 3.3: Update Middleware for Webhook Route
- **File:** `middleware.ts`
- **Change:** Add `/api/webhooks/stripe` to public routes
- **Acceptance:** Webhook route accessible without auth

### Task 3.4: Test Webhooks Locally
- **Commands:**
  ```bash
  stripe login
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  stripe trigger checkout.session.completed
  ```
- **Acceptance:** Events received and processed, database updated

---

## Phase 4: Billing UI

### Task 4.1: Create PricingCard Component
- **File:** `components/billing/pricing-card.tsx`
- **Props:** `plan`, `price`, `features`, `isCurrentPlan`, `onSelect`
- **UI:**
  - Card with plan name, price, feature list
  - "Current Plan" badge if active
  - "Select" or "Upgrade" button
- **Acceptance:** Matches design system (Card, Button, status pills)

### Task 4.2: Create SubscriptionStatus Component
- **File:** `components/billing/subscription-status.tsx`
- **Props:** `subscription`, `trialStatus`
- **UI:**
  - Shows current plan name and status
  - Shows renewal date or trial end date
  - "Manage Billing" button (opens portal)
- **Acceptance:** Displays all subscription states correctly

### Task 4.3: Create Billing Page
- **File:** `app/dashboard/billing/page.tsx`
- **Layout:**
  - Page title: "Billing & Subscription"
  - Current plan section (SubscriptionStatus)
  - Available plans section (PricingCards grid)
  - FAQ or help text
- **Logic:**
  - Fetch subscription and billing status
  - Handle plan selection → createCheckoutSession → redirect
  - Handle "Manage Billing" → createPortalSession → redirect
- **Acceptance:** Full checkout flow works end-to-end

### Task 4.4: Create Checkout Success Page
- **File:** `app/dashboard/billing/success/page.tsx`
- **UI:**
  - Success message with checkmark
  - "Your subscription is now active"
  - "Return to Dashboard" button
- **Logic:**
  - Verify subscription created (may need short polling)
  - Show loading while subscription syncs
- **Acceptance:** User sees confirmation after checkout

### Task 4.5: Enhance Trial Banner
- **File:** `components/dashboard/trial-banner.tsx`
- **Changes:**
  - Link "Upgrade Now" button to `/dashboard/billing`
  - Show different messaging based on days remaining
  - Add urgency styling for < 3 days
- **Acceptance:** Banner correctly links to billing page

### Task 4.6: Create Upgrade Banner Component
- **File:** `components/billing/upgrade-banner.tsx`
- **Props:** `daysRemaining`, `onUpgrade`
- **UI:**
  - Warning banner for expiring trial
  - Different styles for warning (7 days) vs urgent (3 days)
- **Acceptance:** Displays in dashboard when trial < 7 days

---

## Phase 5: Trial Enforcement

### Task 5.1: Create Billing Status Hook
- **File:** `hooks/use-billing-status.ts`
- **Logic:**
  - Call `getBillingStatus` query
  - Return `{ canAccess, isLoading, status, ... }`
- **Acceptance:** Reusable hook for checking access

### Task 5.2: Create Paywall Component
- **File:** `components/billing/paywall.tsx`
- **Props:** `schemeName`
- **UI:**
  - Full-page overlay or redirect
  - Message: "Your free trial has ended"
  - Link to billing page
  - Contact support link
- **Acceptance:** Clear messaging, easy path to subscribe

### Task 5.3: Add Access Check to Dashboard Layout
- **File:** `app/dashboard/layout.tsx`
- **Logic:**
  1. Get billing status for selected scheme
  2. If `!canAccess` → show Paywall or redirect to `/dashboard/billing`
  3. Allow access to billing page even if trial expired
- **Acceptance:** Expired trials cannot access features

### Task 5.4: Test Trial Expiration Flow
- **Test Cases:**
  1. Active trial → full access
  2. Trial < 3 days → urgent banner shown
  3. Trial expired, no subscription → paywall shown
  4. Active subscription → full access
  5. Canceled subscription → access until period end
- **Acceptance:** All states handled correctly

---

## Phase 6: Polish & Edge Cases

### Task 6.1: Handle Failed Payments
- **File:** `components/billing/payment-failed-banner.tsx`
- **Logic:**
  - Check for `status: past_due`
  - Show banner with "Update payment method" link
  - Link to Stripe Portal
- **Acceptance:** Users can recover from failed payments

### Task 6.2: Handle Subscription Cancellation
- **Logic:**
  - `cancelAtPeriodEnd: true` → show "Cancels on [date]"
  - Allow re-subscription before period ends
- **Acceptance:** Cancellation flow is clear to users

### Task 6.3: Add Loading States
- **Files:** All billing components
- **Changes:**
  - Skeleton loaders for subscription status
  - Button loading states during checkout
  - Disable buttons while processing
- **Acceptance:** No janky loading experience

### Task 6.4: Add Error Handling
- **Changes:**
  - Toast notifications for errors
  - Retry logic for failed webhook processing
  - Graceful fallback if Stripe unavailable
- **Acceptance:** Errors don't crash the app

### Task 6.5: Add Analytics Events
- **Events to track:**
  - `billing_page_viewed`
  - `checkout_started`
  - `subscription_created`
  - `subscription_canceled`
  - `portal_opened`
- **Acceptance:** Key billing events tracked

### Task 6.6: End-to-End Testing
- **Test Flow:**
  1. Sign up → Create scheme → Trial starts
  2. View billing page → Select plan
  3. Complete Stripe checkout (test card)
  4. Return to app → Subscription active
  5. Open portal → Cancel subscription
  6. Verify cancelAtPeriodEnd set
- **Acceptance:** Full flow works in staging environment

---

## Phase 7: Production Deployment

### Task 7.1: Switch to Live Stripe Keys
- **Changes:**
  - Update env vars with live keys
  - Create products/prices in live mode
  - Configure live webhook endpoint
- **Acceptance:** Production uses real Stripe

### Task 7.2: Configure Stripe Tax (GST)
- **Location:** Stripe Dashboard → Tax Settings
- **Setup:**
  - Enable automatic tax collection
  - Configure for Australia (10% GST)
- **Acceptance:** Invoices include GST

### Task 7.3: Test Production Webhook
- **Steps:**
  1. Deploy webhook route
  2. Add URL to Stripe live webhook endpoints
  3. Trigger test event from Stripe dashboard
  4. Verify event received and processed
- **Acceptance:** Live webhooks working

### Task 7.4: Monitor & Alert Setup
- **Setup:**
  - Convex logs for webhook processing
  - Stripe webhook failure notifications
  - Alert on `invoice.payment_failed` events
- **Acceptance:** Team notified of billing issues

---

## Summary

| Phase | Tasks | Estimated Effort |
|-------|-------|------------------|
| 1. Foundation | 4 tasks | Quick setup |
| 2. Backend | 7 tasks | Core implementation |
| 3. Webhook | 4 tasks | Critical path |
| 4. UI | 6 tasks | User-facing |
| 5. Enforcement | 4 tasks | Business logic |
| 6. Polish | 6 tasks | Production-ready |
| 7. Deploy | 4 tasks | Go-live |

**Total: 35 tasks across 7 phases**
