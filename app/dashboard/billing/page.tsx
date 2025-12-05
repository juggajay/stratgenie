"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSelectedScheme } from "@/hooks/use-selected-scheme";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  ArrowLeft,
  CreditCard,
  Check,
  Sparkles,
  Zap,
  Shield,
  Crown,
  ExternalLink,
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free Trial",
    price: "$0",
    period: "14 days",
    description: "Try StrataGenie with full features",
    features: [
      "1 scheme",
      "Guardian AI Q&A",
      "Invoice processing",
      "Basic compliance tracking",
    ],
    cta: "Current Plan",
    disabled: true,
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Perfect for self-managed schemes",
    features: [
      "Up to 3 schemes",
      "Unlimited Guardian queries",
      "AI invoice extraction",
      "Advanced compliance alerts",
      "Document generation",
      "Email notifications",
    ],
    cta: "Upgrade to Pro",
    disabled: false,
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For strata managers & large portfolios",
    features: [
      "Unlimited schemes",
      "Priority support",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "White-label options",
    ],
    cta: "Contact Sales",
    disabled: false,
    highlight: false,
  },
];

export default function BillingPage() {
  useSelectedScheme(); // Hook required for context
  const [isProcessing, setIsProcessing] = useState(false);

  const currentUser = useQuery(api.users.currentUser);

  const handleUpgrade = async (planId: string) => {
    if (planId === "enterprise") {
      window.open("mailto:sales@stratagenie.com.au?subject=Enterprise%20Inquiry", "_blank");
      return;
    }

    setIsProcessing(true);
    // TODO: Implement Stripe checkout
    // const response = await fetch('/api/stripe/create-checkout', {
    //   method: 'POST',
    //   body: JSON.stringify({ planId }),
    // });
    // const { url } = await response.json();
    // window.location.href = url;
    setTimeout(() => {
      setIsProcessing(false);
      alert("Stripe integration coming soon!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E4DE] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="text-[26px] font-medium tracking-tight font-display" style={{ letterSpacing: '-0.5px' }}>
                  <span className="text-[#1a1a2e]">Strata</span>
                  <span className="text-[#FF6B35]">Genie</span>
                </span>
              </Link>
              <div className="h-6 w-px bg-[#E8E4DE]" />
              <div>
                <div className="flex items-center gap-2">
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg -ml-2"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Dashboard
                    </Button>
                  </Link>
                  <span className="text-muted-foreground">/</span>
                  <h1 className="text-lg font-medium tracking-tight text-foreground flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    Billing
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage your subscription and usage
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Current Plan Status */}
        <GlassCard glow="coral" className="mb-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FFF0EB] rounded-xl border border-[#FFCDB8]">
                <Sparkles className="h-6 w-6 text-[#FF6B35]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Free Trial</h2>
                <p className="text-sm text-muted-foreground">
                  {currentUser?.schemes?.length || 0} scheme(s) active
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Trial ends in</p>
              <p className="text-2xl font-bold text-[#FF6B35]">12 days</p>
            </div>
          </div>
        </GlassCard>

        {/* Plans */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Choose Your Plan</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <GlassCard
                key={plan.id}
                glow={plan.highlight ? "coral" : "none"}
                className={`p-6 relative ${
                  plan.highlight ? "border-[#FF6B35]/50" : ""
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-medium bg-[#FF6B35] text-white rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.id === "free" && <Zap className="h-5 w-5 text-amber-500" />}
                    {plan.id === "pro" && <Shield className="h-5 w-5 text-[#FF6B35]" />}
                    {plan.id === "enterprise" && <Crown className="h-5 w-5 text-violet-500" />}
                    <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={plan.disabled || isProcessing}
                  className={`w-full rounded-lg ${
                    plan.highlight
                      ? ""
                      : plan.disabled
                      ? "bg-[#F8F5F0] text-muted-foreground cursor-not-allowed"
                      : ""
                  }`}
                  variant={plan.highlight ? "default" : plan.disabled ? "secondary" : "outline"}
                >
                  {plan.id === "enterprise" && <ExternalLink className="h-4 w-4 mr-2" />}
                  {plan.cta}
                </Button>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Current Usage</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <GlassCard className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Guardian Queries</p>
              <p className="text-2xl font-bold text-foreground">24 / 50</p>
              <div className="mt-2 h-2 bg-[#F8F5F0] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "48%" }} />
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Invoices Processed</p>
              <p className="text-2xl font-bold text-foreground">8 / 20</p>
              <div className="mt-2 h-2 bg-[#F8F5F0] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "40%" }} />
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Documents Generated</p>
              <p className="text-2xl font-bold text-foreground">3 / 10</p>
              <div className="mt-2 h-2 bg-[#F8F5F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#FF6B35] rounded-full" style={{ width: "30%" }} />
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Billing History */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Billing History</h2>
          <GlassCard className="p-6">
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground">No billing history yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your invoices will appear here after you upgrade
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-[#E8E4DE]">
          <p className="text-xs text-muted-foreground text-center">
            Questions about billing? Contact us at{" "}
            <a href="mailto:support@stratagenie.com.au" className="text-[#FF6B35] hover:underline">
              support@stratagenie.com.au
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
