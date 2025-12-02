"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  ArrowRight,
  Shield,
  Users,
  Zap,
  FileText,
  Bell,
  Headphones,
} from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Zap, text: "All AI Agents included" },
  { icon: FileText, text: "Strata Hub Export" },
  { icon: Shield, text: "Unlimited document storage" },
  { icon: Bell, text: "Email notifications" },
  { icon: Users, text: "Unlimited committee users" },
  { icon: Headphones, text: "Priority support" },
];

export function PricingCalculator() {
  const [lots, setLots] = useState(6);
  const PRICE_PER_LOT = 14.99;

  const monthlyTotal = lots * PRICE_PER_LOT;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-white shadow-2xl shadow-blue-600/10">
      {/* Popular badge */}
      <div className="absolute top-0 right-0">
        <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-bl-xl">
          Most Popular
        </div>
      </div>

      <div className="p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-blue-600 mb-2">Simple Pricing</p>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl font-bold text-slate-900">$14.99</span>
            <span className="text-xl text-slate-500">/lot/month</span>
          </div>
          <p className="text-slate-600">Billed annually. All features included.</p>
        </div>

        {/* Lot calculator */}
        <div className="bg-slate-50 rounded-xl p-6 mb-8">
          <Label htmlFor="pricing-lots" className="text-sm font-medium text-slate-700 mb-3 block">
            How many lots in your scheme?
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="pricing-lots"
              type="number"
              min={1}
              max={100}
              value={lots}
              onChange={(e) => setLots(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-xl font-semibold text-center h-12 border-slate-300 rounded-lg flex-1"
            />
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">
                ${monthlyTotal.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">per month</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-slate-700">{feature.text}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link href="/signup" className="block">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:shadow-blue-600/30">
            Start 14-Day Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>

        {/* Trust note */}
        <p className="text-center text-sm text-slate-500 mt-4">
          No credit card required • Cancel anytime
        </p>
      </div>

      {/* Bottom savings note */}
      <div className="bg-emerald-50 border-t border-emerald-100 px-8 py-4">
        <p className="text-center text-sm text-emerald-700">
          <span className="font-semibold">Most schemes save $2,000–$8,000 per year</span>
          {" "}by staying self-managed with StrataGenie
        </p>
      </div>
    </div>
  );
}
