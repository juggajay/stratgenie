"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSelectedScheme } from "@/hooks/use-selected-scheme";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  ArrowLeft,
  CreditCard,
  Check,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  Building2,
  Calculator,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  PRICING_TIERS,
  calculateMonthlyPrice,
  getTierInfo,
} from "@/convex/billing/constants";

export default function BillingPage() {
  const { selectedSchemeId, scheme } = useSelectedScheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle success/canceled states from Stripe checkout
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      // Clear the URL params after showing the message
      router.replace("/dashboard/billing", { scroll: false });
    }
    if (searchParams.get("canceled") === "true") {
      setShowCanceled(true);
      router.replace("/dashboard/billing", { scroll: false });
    }
  }, [searchParams, router]);

  // Get billing status for the selected scheme
  const billingStatus = useQuery(
    api.billing.queries.getBillingStatus,
    selectedSchemeId ? { schemeId: selectedSchemeId } : "skip"
  );

  // Stripe actions
  const createCheckoutSession = useAction(api.billing.actions.createCheckoutSession);
  const createPortalSession = useAction(api.billing.actions.createPortalSession);

  const lotCount = scheme?.lotCount ?? 1;
  const tierInfo = getTierInfo(lotCount);
  const monthlyPrice = calculateMonthlyPrice(lotCount);

  const handleSubscribe = async () => {
    if (!selectedSchemeId) return;

    setIsProcessing(true);
    try {
      const { url } = await createCheckoutSession({
        schemeId: selectedSchemeId,
        successUrl: `${window.location.origin}/dashboard/billing?success=true`,
        cancelUrl: `${window.location.origin}/dashboard/billing?canceled=true`,
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageBilling = async () => {
    if (!selectedSchemeId) return;

    setIsProcessing(true);
    try {
      const { url } = await createPortalSession({
        schemeId: selectedSchemeId,
        returnUrl: `${window.location.origin}/dashboard/billing`,
      });

      window.location.href = url;
    } catch (error) {
      console.error("Failed to create portal session:", error);
      alert("Failed to open billing portal. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine what to show based on billing status
  const hasActiveSubscription =
    billingStatus?.status === "active" && billingStatus?.subscription;
  const isInTrial = billingStatus?.status === "trial";
  const isExpired = billingStatus?.status === "expired";
  const isPastDue = billingStatus?.status === "past_due";

  return (
    <div className="min-h-screen bg-warmth-pulse">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-[#E8E4DE] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <span className="text-2xl font-display font-medium tracking-tight">
                  <span className="text-foreground">Strata</span>
                  <span className="text-[#FF6B35]">Genie</span>
                </span>
              </div>
              <div className="h-6 w-px bg-[#E8E4DE]" />
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg text-muted-foreground hover:text-foreground -ml-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Dashboard
                  </Button>
                </Link>
                <span className="text-muted-foreground/40">/</span>
                <h1 className="text-lg font-display font-bold tracking-tight text-foreground flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#FF6B35]" />
                  Billing & Subscription
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-emerald-900">Subscription activated!</p>
                <p className="text-sm text-emerald-700">
                  Thank you for subscribing. Your scheme is now fully activated.
                </p>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="p-1 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-emerald-600" />
              </button>
            </div>
          </div>
        )}

        {/* Canceled Message */}
        {showCanceled && (
          <div className="mb-6 p-4 bg-[#FFF0EB] border border-[#FFCDB8] rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-[#FF6B35] flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Checkout canceled</p>
                <p className="text-sm text-muted-foreground">
                  No worries! You can subscribe whenever you&apos;re ready.
                </p>
              </div>
              <button
                onClick={() => setShowCanceled(false)}
                className="p-1 hover:bg-[#FFE4DB] rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-[#FF6B35]" />
              </button>
            </div>
          </div>
        )}

        {/* Past Due Warning */}
        {isPastDue && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-amber-900">Payment Failed</p>
                <p className="text-sm text-amber-700">
                  Please update your payment method to avoid service interruption.
                </p>
              </div>
              <Button
                onClick={handleManageBilling}
                disabled={isProcessing}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Update Payment
              </Button>
            </div>
          </div>
        )}

        {/* Current Plan Status */}
        <GlassCard glow="coral" className="mb-8 overflow-hidden">
          <div className="p-6 border-b border-[#E8E4DE]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#FFF0EB] rounded-xl border border-[#FFCDB8]">
                  {hasActiveSubscription ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <Sparkles className="h-6 w-6 text-[#FF6B35]" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {billingStatus?.planName ?? "Loading..."}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {scheme?.name ?? "Loading..."} · {lotCount} lot{lotCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {/* Status Badge */}
              {hasActiveSubscription && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active
                </span>
              )}
              {isInTrial && billingStatus?.trialDaysRemaining !== null && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    billingStatus.trialDaysRemaining <= 3
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : billingStatus.trialDaysRemaining <= 7
                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                      : "bg-[#FFF0EB] text-[#FF6B35] border border-[#FFCDB8]"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {billingStatus.trialDaysRemaining} days left
                </span>
              )}
              {isExpired && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Expired
                </span>
              )}
            </div>
          </div>
          <div className="p-6 bg-[#F8F5F0]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                {hasActiveSubscription ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-foreground">
                        ${billingStatus.monthlyPrice?.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {lotCount} lots × ${billingStatus.pricePerLot}/lot ({billingStatus.tierName} tier)
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-foreground">
                        ${monthlyPrice.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {lotCount} lots × ${tierInfo.pricePerLot}/lot ({tierInfo.name} tier)
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                {hasActiveSubscription ? (
                  <Button
                    onClick={handleManageBilling}
                    disabled={isProcessing}
                    variant="outline"
                    className="rounded-lg"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Manage Billing
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubscribe}
                    disabled={isProcessing}
                    className="rounded-lg"
                  >
                    {isProcessing ? "Processing..." : "Subscribe Now"}
                  </Button>
                )}
              </div>
            </div>
            {hasActiveSubscription && billingStatus.subscription?.currentPeriodEnd && (
              <div className="mt-4 pt-4 border-t border-[#E8E4DE] text-sm text-muted-foreground">
                {billingStatus.subscription.cancelAtPeriodEnd ? (
                  <span className="text-amber-600">
                    Cancels on{" "}
                    {new Date(billingStatus.subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                ) : (
                  <span>
                    Next billing:{" "}
                    {new Date(billingStatus.subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Pricing Tiers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">Per-Lot Pricing</h2>
          <p className="text-muted-foreground mb-6">
            Volume discounts automatically applied as your scheme grows
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
                    isCurrentTier ? "border-[#FF6B35]/50" : ""
                  }`}
                >
                  {isCurrentTier && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 text-xs font-medium bg-[#FF6B35] text-white rounded-full">
                        Your Tier
                      </span>
                    </div>
                  )}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F8F5F0] text-muted-foreground border border-[#E8E4DE]">
                      {tierLotRange}
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-semibold text-foreground">
                      ${tier.pricePerLot.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">/lot/mo</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium text-foreground">{tier.name}</h3>
                    {tier.discount > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-600">
                        Save {tier.discount}%
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span className="text-muted-foreground">All 4 AI Agents</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span className="text-muted-foreground">Strata Hub Export</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span className="text-muted-foreground">Unlimited Documents</span>
                    </li>
                  </ul>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Pricing Calculator */}
        <GlassCard className="mb-8 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="h-5 w-5 text-[#FF6B35]" />
            <h3 className="text-lg font-medium text-foreground">Price Calculator</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your lots
              </label>
              <div className="flex items-center gap-2 p-3 bg-[#F8F5F0] rounded-lg border border-[#E8E4DE]">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-semibold text-foreground">{lotCount}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your tier
              </label>
              <div className="p-3 bg-[#FFF0EB] rounded-lg border border-[#FFCDB8]">
                <span className="text-lg font-semibold text-[#FF6B35]">{tierInfo.name}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Monthly
              </label>
              <div className="p-3 bg-white rounded-lg border border-[#E8E4DE]">
                <span className="text-lg font-semibold text-foreground">
                  ${monthlyPrice.toFixed(2)}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Annual
              </label>
              <div className="p-3 bg-white rounded-lg border border-[#E8E4DE]">
                <span className="text-lg font-semibold text-foreground">
                  ${(monthlyPrice * 12).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Update your lot count in scheme settings to see updated pricing.
          </p>
        </GlassCard>

        {/* FAQ */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div className="border-b border-[#E8E4DE] pb-4">
              <h4 className="font-medium text-foreground mb-2">
                How does per-lot pricing work?
              </h4>
              <p className="text-sm text-muted-foreground">
                You pay based on the number of lots in your scheme. As you grow, you
                automatically move into better pricing tiers. All lots are charged at your
                tier&apos;s rate.
              </p>
            </div>
            <div className="border-b border-[#E8E4DE] pb-4">
              <h4 className="font-medium text-foreground mb-2">
                What happens if I add more lots?
              </h4>
              <p className="text-sm text-muted-foreground">
                If adding lots moves you to a new tier, you&apos;ll get the better rate on ALL
                lots immediately. We&apos;ll prorate the difference on your next invoice.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Can I cancel anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! No contracts, no lock-ins. Cancel anytime and you&apos;ll retain access
                until the end of your billing period.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-[#E8E4DE]">
          <p className="text-xs text-muted-foreground text-center">
            Questions about billing? Contact us at{" "}
            <a
              href="mailto:support@stratagenie.com.au"
              className="text-[#FF6B35] hover:underline"
            >
              support@stratagenie.com.au
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
