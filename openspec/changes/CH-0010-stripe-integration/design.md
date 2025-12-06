# Design: Stripe Integration for Billing

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           STRIPE INTEGRATION FLOW                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐ │
│  │   Frontend   │───▶│   Convex     │───▶│   Stripe     │───▶│  Webhook  │ │
│  │  (Next.js)   │    │  (Backend)   │    │    API       │    │  Handler  │ │
│  └──────────────┘    └──────────────┘    └──────────────┘    └───────────┘ │
│         │                   │                   │                   │       │
│         │                   │                   │                   │       │
│         ▼                   ▼                   ▼                   ▼       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         DATA FLOW                                     │  │
│  │                                                                       │  │
│  │  1. User clicks "Subscribe" on /dashboard/billing                    │  │
│  │  2. Frontend calls Convex action: createCheckoutSession(schemeId)    │  │
│  │  3. Convex creates Stripe Customer (if needed) + Checkout Session    │  │
│  │  4. Frontend redirects to Stripe Checkout URL                        │  │
│  │  5. User completes payment on Stripe's hosted page                   │  │
│  │  6. Stripe sends webhook to /api/webhooks/stripe                     │  │
│  │  7. Webhook verifies signature, calls Convex mutation                │  │
│  │  8. Convex updates subscription status in database                   │  │
│  │  9. User redirected to /dashboard/billing?success=true               │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Per-Lot Volume Pricing

**Pricing Model:**

| Tier | Lots | Price/Lot/Month | Discount |
|------|------|-----------------|----------|
| **Standard** | 1-10 | $14.99 | - |
| **Growth** | 11-50 | $11.99 | 20% off |
| **Scale** | 51+ | $8.99 | 40% off |

**Volume-based (not graduated):** All lots charged at the qualifying tier rate.

**Example:** 30-lot scheme = 30 × $11.99 = **$359.70/mo**

**Stripe Implementation:** Use Stripe's "volume" pricing mode on a single product:
```typescript
// Stripe Price with volume tiers
{
  currency: "aud",
  recurring: { interval: "month" },
  billing_scheme: "tiered",
  tiers_mode: "volume", // All units at qualifying tier
  tiers: [
    { up_to: 10, unit_amount: 1499 },   // $14.99
    { up_to: 50, unit_amount: 1199 },   // $11.99
    { up_to: "inf", unit_amount: 899 }, // $8.99
  ]
}
```

### 2. Billing Entity: Scheme (not User)

**Why scheme-level billing?**

```
User (Jason)
├── Scheme A (SP12345, 6 lots)  → 6 × $14.99 = $89.94/mo
├── Scheme B (SP67890, 30 lots) → 30 × $11.99 = $359.70/mo
└── Scheme C (SP11111, 8 lots)  → Trial (no subscription yet)
```

- Each scheme operates independently
- Committee members share the scheme's subscription
- Only admins can manage billing
- Price scales with scheme size (lot count)
- Aligns with real-world strata: each building has its own budget

### 3. Stripe Customer Strategy

**One Stripe Customer per Scheme:**

```typescript
// Customer metadata links to our scheme
{
  stripeCustomerId: "cus_xxxxx",
  metadata: {
    schemeId: "j57abc123...",      // Convex scheme ID
    strataNumber: "SP12345"
  }
}
```

**Why not per user?**
- Scheme admins may change over time
- Billing history belongs to the scheme, not the person
- Simplifies multi-user access to same subscription

### 3. Checkout Flow: Stripe Hosted

**Options considered:**

| Approach | Pros | Cons |
|----------|------|------|
| Stripe Elements (embedded) | More control, custom UI | PCI compliance burden, more code |
| Stripe Checkout (hosted) | Secure, maintained by Stripe, mobile-optimized | Redirect away from app |
| Stripe Payment Links | Zero code | No customization |

**Decision: Stripe Hosted Checkout**
- Best security (Stripe handles PCI)
- Built-in Apple Pay, Google Pay
- Automatic localization
- Less code to maintain

### 4. Subscription Management: Customer Portal

**Self-service via Stripe Customer Portal:**
- Update payment method
- View invoice history
- Cancel subscription
- Switch plans (upgrade/downgrade)

```typescript
// Create portal session → redirect user
const portalSession = await stripe.billingPortal.sessions.create({
  customer: stripeCustomerId,
  return_url: `${baseUrl}/dashboard/billing`,
});
```

### 5. Webhook Processing Strategy

**Synchronous HTTP + Async Processing:**

```
Stripe → POST /api/webhooks/stripe → 200 OK (immediate)
                    │
                    ▼
         Convex Action (async processing)
                    │
                    ▼
         Update subscription in database
```

**Why this approach?**
- Stripe expects fast HTTP response (< 20 seconds)
- Complex processing can happen asynchronously in Convex
- Webhook route only validates signature and queues work

**Idempotency:**
- Store processed event IDs
- Skip already-processed events
- Prevents duplicate charges/status updates

---

## Data Model

### New Tables in Convex Schema

```typescript
// convex/schema.ts additions

// Track Stripe subscriptions per scheme
subscriptions: defineTable({
  schemeId: v.id("schemes"),

  // Stripe identifiers
  stripeCustomerId: v.string(),
  stripeSubscriptionId: v.string(),
  stripePriceId: v.string(),

  // Subscription state
  status: v.union(
    v.literal("trialing"),
    v.literal("active"),
    v.literal("past_due"),
    v.literal("canceled"),
    v.literal("unpaid"),
    v.literal("incomplete"),
    v.literal("incomplete_expired"),
    v.literal("paused")
  ),

  // Billing period
  currentPeriodStart: v.number(),  // Unix timestamp
  currentPeriodEnd: v.number(),    // Unix timestamp
  cancelAtPeriodEnd: v.boolean(),

  // Plan details (denormalized for fast queries)
  planName: v.string(),            // "Starter", "Professional", "Enterprise"
  planInterval: v.union(v.literal("month"), v.literal("year")),

  // Timestamps
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_scheme", ["schemeId"])
  .index("by_stripe_subscription", ["stripeSubscriptionId"])
  .index("by_stripe_customer", ["stripeCustomerId"]),

// Webhook event log for debugging and idempotency
webhookEvents: defineTable({
  stripeEventId: v.string(),       // Stripe's event ID (evt_xxxxx)
  type: v.string(),                // e.g., "customer.subscription.updated"
  status: v.union(
    v.literal("received"),
    v.literal("processing"),
    v.literal("processed"),
    v.literal("failed")
  ),
  errorMessage: v.optional(v.string()),
  processedAt: v.optional(v.number()),
  createdAt: v.number(),
})
  .index("by_stripe_event_id", ["stripeEventId"])
  .index("by_status", ["status"]),
```

### Modified: schemes table

```typescript
// Add optional field for quick subscription lookup
schemes: defineTable({
  // ... existing fields ...

  // Quick reference (denormalized)
  stripeCustomerId: v.optional(v.string()),
})
```

---

## API Design

### Convex Actions (Server-side, uses Stripe SDK)

```typescript
// convex/billing/actions.ts

// Creates Stripe checkout session for subscription
export const createCheckoutSession = action({
  args: {
    schemeId: v.id("schemes"),
    priceId: v.string(),         // Stripe price ID
    successUrl: v.string(),
    cancelUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Verify user is admin of scheme
    // 2. Get or create Stripe customer
    // 3. Create checkout session
    // 4. Return checkout URL
  },
});

// Creates Stripe customer portal session
export const createPortalSession = action({
  args: {
    schemeId: v.id("schemes"),
    returnUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Verify user is admin of scheme
    // 2. Get Stripe customer ID
    // 3. Create portal session
    // 4. Return portal URL
  },
});

// Process webhook event (called from Next.js API route)
export const processWebhookEvent = action({
  args: {
    eventId: v.string(),
    eventType: v.string(),
    eventData: v.any(),
  },
  handler: async (ctx, args) => {
    // 1. Check if event already processed (idempotency)
    // 2. Handle event based on type
    // 3. Update subscription status
    // 4. Mark event as processed
  },
});
```

### Convex Queries

```typescript
// convex/billing/queries.ts

// Get subscription for a scheme
export const getSubscription = query({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args) => {
    // Returns subscription or null
  },
});

// Get billing status (combines trial + subscription)
export const getBillingStatus = query({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args) => {
    // Returns: { status, planName, daysRemaining, canAccessFeatures, ... }
  },
});
```

### Next.js API Route (Webhook Only)

```typescript
// app/api/webhooks/stripe/route.ts

export async function POST(request: Request) {
  // 1. Get raw body and Stripe signature header
  // 2. Verify webhook signature
  // 3. Call Convex action to process
  // 4. Return 200 immediately
}
```

---

## File Structure

```
stratgenie/
├── convex/
│   ├── schema.ts                    # Add subscriptions, webhookEvents
│   ├── billing/
│   │   ├── actions.ts              # Stripe API calls (checkout, portal)
│   │   ├── queries.ts              # getSubscription, getBillingStatus
│   │   ├── mutations.ts            # updateSubscription (internal)
│   │   └── constants.ts            # Plan definitions, price IDs
│   └── schemes.ts                   # Modify: add stripeCustomerId
│
├── app/
│   ├── api/
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts        # Webhook handler
│   │
│   └── dashboard/
│       └── billing/
│           ├── page.tsx            # Main billing page
│           └── success/
│               └── page.tsx        # Post-checkout success
│
├── components/
│   └── billing/
│       ├── pricing-card.tsx        # Plan display card
│       ├── subscription-status.tsx # Current plan status
│       ├── billing-history.tsx     # Invoice list
│       └── upgrade-banner.tsx      # Trial expiring CTA
│
├── lib/
│   └── stripe.ts                   # Stripe client initialization
│
└── .env.local                      # Add Stripe keys
```

---

## UI Components (Exact Site Styling)

All components follow the StrataGenie design system using:
- **Colors:** Brand teal (`bg-brand`), oklch color palette
- **Typography:** Fraunces (display), DM Sans (body)
- **Shadows:** `shadow-card`, `shadow-soft`
- **Radius:** `rounded-xl` for cards, `rounded-lg` for buttons
- **Icons:** lucide-react only

---

### 1. Billing Page Layout (`/dashboard/billing`)

```tsx
// app/dashboard/billing/page.tsx
<div className="min-h-screen bg-background bg-grain">
  <main className="max-w-5xl mx-auto px-6 py-8">
    {/* Page Header */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Billing & Subscription
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription for {schemeName}
        </p>
      </div>
    </div>

    <div className="space-y-6">
      {/* Current Plan Card */}
      <SubscriptionStatus subscription={subscription} scheme={scheme} />

      {/* Pricing Calculator */}
      <PricingCalculator lotCount={scheme.lotCount} onSubscribe={handleSubscribe} />
    </div>
  </main>
</div>
```

---

### 2. Subscription Status Card

```tsx
// components/billing/subscription-status.tsx
<Card className="rounded-xl border border-border bg-card shadow-card">
  <CardHeader className="pb-3">
    <div className="flex items-start justify-between gap-4">
      <div>
        <CardTitle className="text-lg font-semibold tracking-tight text-card-foreground">
          Current Plan
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {subscription ? `Renews ${formatDate(subscription.currentPeriodEnd)}` : 'No active subscription'}
        </CardDescription>
      </div>
      {/* Status Pill */}
      <SubscriptionStatusPill status={subscription?.status || 'trial'} />
    </div>
  </CardHeader>
  <CardContent className="pt-2 space-y-4">
    {subscription ? (
      <>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-foreground">
            ${monthlyAmount.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {scheme.lotCount} lots × ${pricePerLot}/lot ({tierName} tier)
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            onClick={openPortal}
            className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-lg"
          >
            Manage Billing
          </Button>
          <Button
            variant="outline"
            className="rounded-lg border-border hover:bg-accent transition-smooth"
          >
            View Invoices
          </Button>
        </div>
      </>
    ) : (
      <p className="text-sm text-muted-foreground">
        Subscribe to unlock all features after your trial ends.
      </p>
    )}
  </CardContent>
</Card>
```

---

### 3. Subscription Status Pills

```tsx
// components/billing/subscription-status-pill.tsx
function SubscriptionStatusPill({ status }: { status: string }) {
  const styles = {
    active: "bg-teal-700 text-white",
    trialing: "bg-blue-100 text-blue-700",
    past_due: "bg-amber-100 text-amber-700",
    canceled: "bg-red-100 text-red-700",
    trial: "bg-muted text-muted-foreground",
  };

  const labels = {
    active: "Active",
    trialing: "Trial",
    past_due: "Past due",
    canceled: "Canceled",
    trial: "Free trial",
  };

  const icons = {
    active: CheckCircle2,
    trialing: Clock,
    past_due: AlertTriangle,
    canceled: XCircle,
    trial: Clock,
  };

  const Icon = icons[status] || Clock;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
      styles[status] || styles.trial
    )}>
      <Icon className="h-3 w-3" />
      {labels[status] || status}
    </span>
  );
}
```

---

### 4. Pricing Calculator Card

```tsx
// components/billing/pricing-calculator.tsx
<Card className="rounded-xl border border-border bg-card shadow-card">
  <CardHeader className="pb-3">
    <CardTitle className="text-lg font-semibold tracking-tight text-card-foreground">
      Your Pricing
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Per-lot pricing with volume discounts
    </CardDescription>
  </CardHeader>
  <CardContent className="pt-2 space-y-6">
    {/* Pricing Breakdown */}
    <div className="p-4 bg-secondary rounded-lg space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Lot count</span>
        <span className="text-sm font-medium text-foreground">{lotCount} lots</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Your tier</span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand/10 text-brand">
          {tierName}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Price per lot</span>
        <span className="text-sm font-medium text-foreground">${pricePerLot}/lot/mo</span>
      </div>
      <div className="border-t border-border pt-3 flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">Monthly total</span>
        <span className="text-xl font-semibold text-foreground">${monthlyTotal.toFixed(2)}</span>
      </div>
    </div>

    {/* Volume Discount Tiers */}
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Volume Discounts
      </p>
      <div className="grid gap-2">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border transition-smooth",
              lotCount <= tier.maxLots && lotCount > (prevTier?.maxLots || 0)
                ? "border-brand bg-brand/5"
                : "border-border hover:border-brand/50"
            )}
          >
            <div>
              <p className="text-sm font-medium text-foreground">{tier.name}</p>
              <p className="text-xs text-muted-foreground">
                {tier.maxLots === Infinity ? '51+ lots' : `1-${tier.maxLots} lots`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">${tier.pricePerLot}/lot</p>
              {tier.discount && (
                <p className="text-xs text-brand">{tier.discount}% off</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Subscribe Button */}
    <Button
      onClick={onSubscribe}
      className="w-full bg-brand hover:bg-brand/90 text-brand-foreground rounded-lg h-11"
    >
      Subscribe Now
    </Button>
  </CardContent>
</Card>
```

---

### 5. Trial Warning Banner

```tsx
// components/billing/trial-warning-banner.tsx
<Card className={cn(
  "rounded-xl border shadow-card",
  daysRemaining <= 3
    ? "border-amber-200 bg-amber-50"
    : "border-border bg-card"
)}>
  <CardContent className="p-4">
    <div className="flex items-start gap-4">
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg",
        daysRemaining <= 3 ? "bg-amber-100" : "bg-secondary"
      )}>
        <Clock className={cn(
          "h-5 w-5",
          daysRemaining <= 3 ? "text-amber-600" : "text-muted-foreground"
        )} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">
          Your free trial ends in {daysRemaining} days
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Subscribe now to keep access to compliance tracking, AI agents, and document generation.
        </p>
      </div>
      <Button
        asChild
        className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-lg"
      >
        <Link href="/dashboard/billing">Upgrade</Link>
      </Button>
    </div>
  </CardContent>
</Card>
```

---

### 6. Expired Trial Paywall

```tsx
// components/billing/paywall.tsx
<div className="min-h-screen bg-background bg-grain flex items-center justify-center p-6">
  <Card className="max-w-md w-full rounded-xl border border-border bg-card shadow-elevated">
    <CardContent className="p-8 text-center space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto">
        <Lock className="h-8 w-8 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Your free trial has ended
        </h1>
        <p className="text-sm text-muted-foreground">
          Subscribe to continue managing {schemeName} with StrataGenie.
        </p>
      </div>

      <Button
        asChild
        className="w-full bg-brand hover:bg-brand/90 text-brand-foreground rounded-lg h-11"
      >
        <Link href="/dashboard/billing">View Plans & Subscribe</Link>
      </Button>

      <p className="text-xs text-muted-foreground">
        Have questions?{' '}
        <a href="mailto:support@stratagenie.com.au" className="text-brand hover:underline">
          Contact support
        </a>
      </p>
    </CardContent>
  </Card>
</div>
```

---

### 7. Payment Failed Banner

```tsx
// components/billing/payment-failed-banner.tsx
<Card className="rounded-xl border border-red-200 bg-red-50 shadow-card">
  <CardContent className="p-4">
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
        <AlertTriangle className="h-5 w-5 text-red-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-red-900">
          Payment failed
        </p>
        <p className="text-sm text-red-700 mt-1">
          We couldn't process your last payment. Please update your payment method to avoid service interruption.
        </p>
      </div>
      <Button
        onClick={openPortal}
        className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
      >
        Update Payment
      </Button>
    </div>
  </CardContent>
</Card>
```

---

### 8. Checkout Success Page

```tsx
// app/dashboard/billing/success/page.tsx
<div className="min-h-screen bg-background bg-grain flex items-center justify-center p-6">
  <Card className="max-w-md w-full rounded-xl border border-border bg-card shadow-elevated">
    <CardContent className="p-8 text-center space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 mx-auto">
        <CheckCircle2 className="h-8 w-8 text-teal-700" />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Subscription activated!
        </h1>
        <p className="text-sm text-muted-foreground">
          Thank you for subscribing. You now have full access to all StrataGenie features.
        </p>
      </div>

      <Button
        asChild
        className="w-full bg-brand hover:bg-brand/90 text-brand-foreground rounded-lg h-11"
      >
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </CardContent>
  </Card>
</div>
```

---

### 9. Loading Skeleton for Billing

```tsx
// Loading state while fetching subscription
<Card className="rounded-xl border border-border bg-card shadow-card">
  <CardHeader className="pb-3">
    <div className="animate-pulse">
      <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
    </div>
  </CardHeader>
  <CardContent className="pt-2">
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="h-4 bg-muted rounded w-2/3"></div>
      <div className="flex gap-3">
        <div className="h-10 bg-muted rounded w-32"></div>
        <div className="h-10 bg-muted rounded w-28"></div>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Webhook Events to Handle

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create subscription record, clear trial |
| `customer.subscription.created` | Create/update subscription record |
| `customer.subscription.updated` | Update status, period dates |
| `customer.subscription.deleted` | Mark as canceled |
| `invoice.paid` | Log successful payment |
| `invoice.payment_failed` | Update status to `past_due`, notify admin |

---

## Environment Variables

```bash
# .env.local

# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# Webhook signing secret (from Stripe Dashboard → Webhooks)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Price ID for per-lot volume pricing (single product with tiered pricing)
STRIPE_PRICE_PER_LOT_MONTHLY=price_xxxxxxxxxxxxx
```

---

## Security Considerations

### 1. Webhook Signature Verification

```typescript
// MUST verify signature before processing
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

### 2. Authorization Checks

```typescript
// Only scheme admins can manage billing
await requireRole(ctx, args.schemeId, "admin");
```

### 3. Idempotency

```typescript
// Check if event already processed
const existing = await ctx.runQuery(api.billing.getWebhookEvent, {
  stripeEventId: event.id
});
if (existing) return; // Skip duplicate
```

### 4. Secret Key Protection

- `STRIPE_SECRET_KEY` only used server-side (Convex actions, API routes)
- Never exposed to frontend
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is safe for frontend

---

## Testing Strategy

### 1. Local Development

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login and forward webhooks
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 2. Test Cards

| Scenario | Card Number |
|----------|-------------|
| Success | 4242 4242 4242 4242 |
| Decline | 4000 0000 0000 0002 |
| Requires auth | 4000 0025 0000 3155 |
| Insufficient funds | 4000 0000 0000 9995 |

### 3. Webhook Testing

```bash
# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Add `subscriptions` and `webhookEvents` tables to schema
- [ ] Create `convex/billing/` folder structure
- [ ] Install Stripe SDK: `npm install stripe`
- [ ] Add environment variables
- [ ] Create Stripe products/prices in dashboard

### Phase 2: Backend
- [ ] Implement `createCheckoutSession` action
- [ ] Implement `createPortalSession` action
- [ ] Implement `processWebhookEvent` action
- [ ] Implement `getSubscription` query
- [ ] Implement `getBillingStatus` query

### Phase 3: Webhook Route
- [ ] Create `/api/webhooks/stripe/route.ts`
- [ ] Add webhook URL to Stripe dashboard
- [ ] Test with Stripe CLI locally

### Phase 4: UI
- [ ] Create `/dashboard/billing/page.tsx`
- [ ] Create `PricingCard` component
- [ ] Create `SubscriptionStatus` component
- [ ] Enhance trial banner with upgrade CTA
- [ ] Create success page

### Phase 5: Enforcement
- [ ] Add billing status check to protected routes
- [ ] Show paywall for expired trials
- [ ] Add "Upgrade" prompts throughout app

### Phase 6: Polish
- [ ] Handle edge cases (failed payments, cancellations)
- [ ] Add loading states and error handling
- [ ] Test full flow end-to-end
- [ ] Deploy and verify in production

---

## Migration Notes

### Existing Schemes (Grandfathering)

Schemes created before billing launch:
- `trialEndsAt: null` → Considered "paid" (grandfathered)
- No action required
- Can manually add subscriptions later if needed

### Trial Extension

For schemes in trial when billing launches:
- No change to their trial period
- They'll see upgrade prompt when trial expires
- Consider: send email notification about new billing feature
