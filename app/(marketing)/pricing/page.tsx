"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Check,
  Sparkles,
  Building2,
  Calculator,
  ArrowRight,
  Shield,
  Clock,
  Zap,
} from "lucide-react";
import {
  PRICING_TIERS,
  calculateMonthlyPrice,
  getTierInfo,
} from "@/convex/billing/constants";

export default function PricingPage() {
  const [lotCount, setLotCount] = useState(10);
  const tierInfo = getTierInfo(lotCount);
  const monthlyPrice = calculateMonthlyPrice(lotCount);

  const features = [
    "All 4 AI Agents (Secretary, Treasurer, Guardian, Compliance)",
    "Strata Hub Export & Reporting",
    "Unlimited Document Generation",
    "Compliance Tracking & Alerts",
    "Financial Management Tools",
    "Bylaw Management",
    "Lot Owner Communications",
    "Compliance Vault Storage",
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF0EB] border border-[#FFCDB8] text-[#FF6B35] text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            14-Day Free Trial · No Credit Card Required
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#1a1a2e] mb-6 tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-[#3d3d5c] max-w-2xl mx-auto mb-8">
            Pay per lot with volume discounts. No hidden fees, no long-term contracts.
            Cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard glow="coral" className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#FFF0EB] rounded-lg border border-[#FFCDB8]">
                <Calculator className="h-5 w-5 text-[#FF6B35]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1a1a2e]">
                Calculate Your Price
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <div>
                <label className="block text-sm font-medium text-[#1a1a2e] mb-3">
                  How many lots in your scheme?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={lotCount}
                    onChange={(e) => setLotCount(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[#E8E4DE] rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
                  />
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#F8F5F0] rounded-lg border border-[#E8E4DE] min-w-[100px]">
                    <Building2 className="h-4 w-4 text-[#6b6b8a]" />
                    <span className="text-lg font-semibold text-[#1a1a2e]">
                      {lotCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                <div className="w-full p-4 bg-[#FFF0EB] rounded-xl border border-[#FFCDB8]">
                  <div className="text-sm text-[#FF6B35] font-medium mb-1">
                    Your monthly price
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#1a1a2e]">
                      ${monthlyPrice.toFixed(2)}
                    </span>
                    <span className="text-[#6b6b8a]">/month</span>
                  </div>
                  <div className="text-sm text-[#3d3d5c] mt-1">
                    {tierInfo.name} tier · ${tierInfo.pricePerLot}/lot
                    {tierInfo.discount > 0 && (
                      <span className="ml-2 text-emerald-600 font-medium">
                        (Save {tierInfo.discount}%)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto rounded-xl px-8">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#1a1a2e] text-center mb-2">
            Volume Discounts
          </h2>
          <p className="text-[#6b6b8a] text-center mb-8">
            Automatically applied as your scheme grows
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {PRICING_TIERS.map((tier, index) => {
              const isCurrentTier = tier.name === tierInfo.name;
              const tierLotRange =
                index === 0
                  ? "1-10 lots"
                  : index === 1
                  ? "11-50 lots"
                  : "51+ lots";

              return (
                <GlassCard
                  key={tier.name}
                  glow={isCurrentTier ? "coral" : "none"}
                  className={`p-6 relative ${
                    isCurrentTier ? "border-[#FF6B35]/50 scale-105" : ""
                  } transition-transform`}
                >
                  {isCurrentTier && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 text-xs font-medium bg-[#FF6B35] text-white rounded-full whitespace-nowrap">
                        Your Tier
                      </span>
                    </div>
                  )}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F8F5F0] text-[#6b6b8a] border border-[#E8E4DE]">
                      {tierLotRange}
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-[#1a1a2e]">
                      ${tier.pricePerLot.toFixed(2)}
                    </span>
                    <span className="text-[#6b6b8a]">/lot/mo</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-medium text-[#1a1a2e]">
                      {tier.name}
                    </h3>
                    {tier.discount > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Save {tier.discount}%
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-[#3d3d5c]">All 4 AI Agents</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-[#3d3d5c]">Strata Hub Export</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-[#3d3d5c]">Unlimited Documents</span>
                    </li>
                  </ul>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Features */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8">
            <h2 className="text-xl font-semibold text-[#1a1a2e] mb-6 text-center">
              Everything Included in Every Plan
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="p-1 bg-emerald-50 rounded-full">
                    <Check className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-[#3d3d5c]">{feature}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-[#E8E4DE]">
              <div className="p-2 bg-[#FFF0EB] rounded-lg">
                <Clock className="h-5 w-5 text-[#FF6B35]" />
              </div>
              <div>
                <h3 className="font-medium text-[#1a1a2e] mb-1">
                  14-Day Free Trial
                </h3>
                <p className="text-sm text-[#6b6b8a]">
                  Full access to all features. No credit card required.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-[#E8E4DE]">
              <div className="p-2 bg-[#FFF0EB] rounded-lg">
                <Zap className="h-5 w-5 text-[#FF6B35]" />
              </div>
              <div>
                <h3 className="font-medium text-[#1a1a2e] mb-1">
                  Cancel Anytime
                </h3>
                <p className="text-sm text-[#6b6b8a]">
                  No long-term contracts. Cancel with one click.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-[#E8E4DE]">
              <div className="p-2 bg-[#FFF0EB] rounded-lg">
                <Shield className="h-5 w-5 text-[#FF6B35]" />
              </div>
              <div>
                <h3 className="font-medium text-[#1a1a2e] mb-1">
                  Secure & Private
                </h3>
                <p className="text-sm text-[#6b6b8a]">
                  Bank-level encryption. Your data stays yours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#1a1a2e] text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <GlassCard className="p-6">
              <h3 className="font-medium text-[#1a1a2e] mb-2">
                How does per-lot pricing work?
              </h3>
              <p className="text-[#6b6b8a]">
                You pay based on the number of lots in your scheme. As you grow,
                you automatically move into better pricing tiers with volume
                discounts. All lots are charged at your tier&apos;s rate.
              </p>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-medium text-[#1a1a2e] mb-2">
                What happens after my free trial?
              </h3>
              <p className="text-[#6b6b8a]">
                After 14 days, you can choose to subscribe to continue using
                StrataGenie. If you don&apos;t subscribe, your account will be
                limited but your data will be preserved.
              </p>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-medium text-[#1a1a2e] mb-2">
                Can I change my lot count later?
              </h3>
              <p className="text-[#6b6b8a]">
                Yes! If adding lots moves you to a new tier, you&apos;ll get the
                better rate on ALL lots immediately. We&apos;ll prorate the
                difference on your next invoice.
              </p>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-medium text-[#1a1a2e] mb-2">
                Is there a setup fee?
              </h3>
              <p className="text-[#6b6b8a]">
                No setup fees, no hidden costs. The price you see is the price
                you pay. Start your free trial and only pay when you&apos;re
                ready.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <GlassCard glow="coral" className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
              Ready to simplify your strata management?
            </h2>
            <p className="text-[#6b6b8a] mb-6">
              Join hundreds of NSW strata committees saving time and staying
              compliant with StrataGenie.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="rounded-xl px-8">
                Start Your Free 14-Day Trial
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-[#6b6b8a] mt-4">
              No credit card required · Cancel anytime
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
