# Proposal: Stripe Integration for Billing

## Summary

Implement Stripe payment processing to monetize StrataGenie after the 14-day free trial. This enables schemes to subscribe to paid plans, manage billing, and access premium features.

## Problem Statement

Currently, StrataGenie has:
- ✅ A 14-day free trial system (`trialEndsAt` on schemes table)
- ✅ A trial banner showing days remaining
- ✅ A planned redirect to `/billing` when trial expires
- ❌ No actual payment processing
- ❌ No subscription management
- ❌ No billing page

Without billing, the business cannot generate revenue after users complete their free trial.

## Proposed Solution

Integrate Stripe Subscriptions with:
1. **Subscription plans** - Monthly/yearly pricing tiers
2. **Checkout flow** - Stripe-hosted checkout for conversion
3. **Customer portal** - Self-service billing management
4. **Webhook processing** - Real-time subscription status updates
5. **Billing UI** - Dashboard pages for plan selection and management

## Architecture Decision: Why Stripe?

| Option | Pros | Cons |
|--------|------|------|
| Stripe | Industry standard, excellent docs, hosted checkout, customer portal, Australian support | Transaction fees (2.9% + 30¢) |
| Paddle | Handles GST automatically | Higher fees, less control |
| LemonSqueezy | Modern DX | Newer, less mature |
| Direct bank | No fees | Complex, no card support |

**Decision: Stripe** - Best balance of features, reliability, and developer experience.

## Billing Model

### Entity: Scheme (not User)

Each **scheme** is the billing entity, not the user. This means:
- A user owning 3 schemes pays for 3 subscriptions
- Scheme members share the subscription status
- Only scheme admins can manage billing

### Pricing Model: Per-Lot with Volume Discounts

**Pricing Type:** Volume-based (all lots charged at the tier rate, not graduated)

| Tier | Lots | Price/Lot/Month | Discount |
|------|------|-----------------|----------|
| **Standard** | 1-10 | $14.99 | - |
| **Growth** | 11-50 | $11.99 | 20% off |
| **Scale** | 51+ | $8.99 | 40% off |

### Pricing Examples

| Scheme Size | Calculation | Monthly Total | Yearly Total (no discount) |
|-------------|-------------|---------------|---------------------------|
| 6 lots | 6 × $14.99 | **$89.94** | $1,079.28 |
| 12 lots | 12 × $11.99 | **$143.88** | $1,726.56 |
| 30 lots | 30 × $11.99 | **$359.70** | $4,316.40 |
| 60 lots | 60 × $8.99 | **$539.40** | $6,472.80 |
| 100 lots | 100 × $8.99 | **$899.00** | $10,788.00 |

### Why Volume (not Graduated) Pricing?

- **Simpler:** Customer understands "I pay $X per lot"
- **Growth-friendly:** Adding lot 11 *reduces* per-lot cost from $14.99 to $11.99
- **Stripe support:** Native volume pricing in Stripe Billing

### Yearly Discount (Optional - Future)

Consider 15-20% discount for annual billing:
- Standard: $14.99 → $12.74/lot/mo (billed annually)
- Growth: $11.99 → $10.19/lot/mo (billed annually)
- Scale: $8.99 → $7.64/lot/mo (billed annually)

## Technical Scope

### In Scope
- Stripe Checkout integration (hosted payment page)
- Stripe Customer Portal (manage subscription, payment methods)
- Webhook handling for subscription events
- Convex schema for subscriptions
- Billing dashboard pages
- Trial-to-paid conversion flow

### Out of Scope (Future)
- Usage-based metering
- Multiple payment methods per scheme
- Invoice customization
- Refund automation
- Dunning (failed payment recovery) customization

## Success Criteria

1. User can subscribe to a paid plan from `/dashboard/billing`
2. Subscription status persists and displays correctly
3. Expired trials show upgrade prompt
4. Users can cancel/upgrade via Stripe Customer Portal
5. Webhook updates subscription status in real-time

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Webhook failures | Stale subscription data | Idempotent processing, event logging, manual sync option |
| Stripe outage | Users can't subscribe | Show graceful error, extend trial temporarily |
| Double charging | User frustration | Stripe handles this; we verify events are unique |
| GST compliance | Legal issues | Configure Stripe Tax for Australian customers |

## Timeline Estimate

- Phase 1 (Schema + Backend): 1 day
- Phase 2 (Webhook Route): 0.5 day
- Phase 3 (Billing UI): 1 day
- Phase 4 (Trial Enforcement): 0.5 day
- Phase 5 (Testing): 1 day

**Total: ~4 days of implementation**

## Dependencies

- Stripe account (test + live keys)
- Stripe products/prices created in dashboard
- Environment variables configured

## Stakeholder Sign-off Required

- [ ] Pricing tiers confirmed
- [ ] Stripe account created
- [ ] Business tax requirements clarified (GST, invoicing)
