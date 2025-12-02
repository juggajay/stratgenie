"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SavingsCalculator() {
  const [lots, setLots] = useState(6);
  const PRICE_PER_LOT = 14.99;
  const MIN_MANAGER_COST = 2500;
  const MAX_MANAGER_COST = 10000;

  const monthlyTotal = lots * PRICE_PER_LOT;
  const annualTotal = monthlyTotal * 12;
  const minSavings = Math.max(0, MIN_MANAGER_COST - annualTotal);
  const maxSavings = Math.max(0, MAX_MANAGER_COST - annualTotal);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      {/* Header gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Savings Calculator</h3>
        </div>
        <p className="text-blue-100 text-sm">
          See how much your scheme could save with StrataGenie
        </p>
      </div>

      {/* Calculator body */}
      <div className="p-8">
        <div className="mb-6">
          <Label htmlFor="lots" className="text-sm font-medium text-slate-700 mb-2 block">
            Number of lots in your scheme
          </Label>
          <Input
            id="lots"
            type="number"
            min={1}
            max={100}
            value={lots}
            onChange={(e) => setLots(Math.max(1, parseInt(e.target.value) || 1))}
            className="text-2xl font-semibold text-center h-14 border-slate-300 rounded-xl"
          />
        </div>

        {/* Results */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <span className="text-slate-600">Monthly cost</span>
            <span className="text-xl font-semibold text-slate-900">
              ${monthlyTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <span className="text-slate-600">Annual cost</span>
            <span className="text-xl font-semibold text-slate-900">
              ${annualTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 bg-emerald-50 -mx-4 px-4 rounded-xl">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-emerald-700">Estimated savings</span>
            </div>
            <span className="text-xl font-bold text-emerald-600">
              ${minSavings.toLocaleString()} – ${maxSavings.toLocaleString()}/yr
            </span>
          </div>
        </div>

        {/* Comparison note */}
        <p className="text-xs text-slate-500 mb-6 text-center">
          vs. traditional strata management ($2,500–$10,000/year for small schemes)
        </p>

        {/* CTA */}
        <Link href="/signup" className="block">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base rounded-xl shadow-lg shadow-blue-600/25">
            Start Free Trial
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-500" />
            14-day free trial
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-500" />
            No credit card
          </span>
        </div>
      </div>
    </div>
  );
}
