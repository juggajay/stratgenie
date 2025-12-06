/**
 * Billing Constants for StrataGenie
 * Per-lot pricing with volume discounts
 */

export const PRICING_TIERS = [
  { maxLots: 10, pricePerLot: 14.99, name: "Standard", discount: 0 },
  { maxLots: 50, pricePerLot: 11.99, name: "Growth", discount: 20 },
  { maxLots: Infinity, pricePerLot: 8.99, name: "Scale", discount: 40 },
] as const;

export type PricingTier = (typeof PRICING_TIERS)[number];

/**
 * Calculate monthly price based on lot count
 * Uses volume-based pricing (all lots at tier rate)
 */
export function calculateMonthlyPrice(lotCount: number): number {
  const tier = PRICING_TIERS.find((t) => lotCount <= t.maxLots);
  if (!tier) {
    // Fallback to Scale tier for very large schemes
    return lotCount * PRICING_TIERS[2].pricePerLot;
  }
  return Math.round(lotCount * tier.pricePerLot * 100) / 100;
}

/**
 * Get the tier name for a given lot count
 */
export function getTierName(lotCount: number): string {
  const tier = PRICING_TIERS.find((t) => lotCount <= t.maxLots);
  return tier?.name ?? "Scale";
}

/**
 * Get the full tier info for a given lot count
 */
export function getTierInfo(lotCount: number): PricingTier {
  const tier = PRICING_TIERS.find((t) => lotCount <= t.maxLots);
  return tier ?? PRICING_TIERS[2];
}

/**
 * Get price per lot for a given lot count
 */
export function getPricePerLot(lotCount: number): number {
  const tier = PRICING_TIERS.find((t) => lotCount <= t.maxLots);
  return tier?.pricePerLot ?? PRICING_TIERS[2].pricePerLot;
}

/**
 * Calculate annual price (no additional discount for now)
 */
export function calculateAnnualPrice(lotCount: number): number {
  return calculateMonthlyPrice(lotCount) * 12;
}

/**
 * Subscription status types
 */
export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  PAST_DUE: "past_due",
  CANCELED: "canceled",
  UNPAID: "unpaid",
  TRIALING: "trialing",
} as const;

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

/**
 * Trial duration in days
 */
export const TRIAL_DURATION_DAYS = 14;

/**
 * Days before trial end to show urgent warning
 */
export const TRIAL_WARNING_DAYS = {
  NORMAL: 7,
  URGENT: 3,
  CRITICAL: 1,
} as const;
