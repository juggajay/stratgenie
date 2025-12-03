"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowLeft, Download, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LevyCalculatorPage() {
  const [totalBudget, setTotalBudget] = useState("");
  const [unitEntitlement, setUnitEntitlement] = useState("");
  const [totalEntitlements, setTotalEntitlements] = useState("");
  const [fundType, setFundType] = useState<"admin" | "capital">("admin");
  const [calculated, setCalculated] = useState(false);

  const budget = parseFloat(totalBudget) || 0;
  const myEntitlement = parseFloat(unitEntitlement) || 0;
  const allEntitlements = parseFloat(totalEntitlements) || 1;

  const annualLevy = (myEntitlement / allEntitlements) * budget;
  const quarterlyLevy = annualLevy / 4;
  const percentageShare = (myEntitlement / allEntitlements) * 100;

  const handleCalculate = () => {
    if (budget > 0 && myEntitlement > 0 && allEntitlements > 0) {
      setCalculated(true);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  return (
    <>
      {/* SEO metadata is in head via metadata export from a parent layout */}
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-3">
              Strata Levy Calculator
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Calculate individual lot levies based on unit entitlements and total
              budget. Perfect for NSW strata committees.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <Card className="border border-slate-200 rounded-xl bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Enter Your Details
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Input your scheme's budget and entitlement information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fund Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Fund Type
                  </Label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFundType("admin")}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                        fundType === "admin"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      Admin Fund
                    </button>
                    <button
                      onClick={() => setFundType("capital")}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                        fundType === "capital"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      Capital Works
                    </button>
                  </div>
                </div>

                {/* Total Budget */}
                <div className="space-y-2">
                  <Label
                    htmlFor="totalBudget"
                    className="text-sm font-medium text-slate-700"
                  >
                    Total Annual Budget ($)
                  </Label>
                  <Input
                    id="totalBudget"
                    type="number"
                    placeholder="e.g., 50000"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    className="rounded-lg border-slate-300"
                  />
                  <p className="text-xs text-slate-500">
                    The total {fundType === "admin" ? "administrative" : "capital works"}{" "}
                    budget for the year
                  </p>
                </div>

                {/* My Unit Entitlement */}
                <div className="space-y-2">
                  <Label
                    htmlFor="unitEntitlement"
                    className="text-sm font-medium text-slate-700"
                  >
                    Your Unit Entitlement
                  </Label>
                  <Input
                    id="unitEntitlement"
                    type="number"
                    placeholder="e.g., 15"
                    value={unitEntitlement}
                    onChange={(e) => setUnitEntitlement(e.target.value)}
                    className="rounded-lg border-slate-300"
                  />
                  <p className="text-xs text-slate-500">
                    Found on your strata plan or levy notice
                  </p>
                </div>

                {/* Total Entitlements */}
                <div className="space-y-2">
                  <Label
                    htmlFor="totalEntitlements"
                    className="text-sm font-medium text-slate-700"
                  >
                    Total Scheme Entitlements
                  </Label>
                  <Input
                    id="totalEntitlements"
                    type="number"
                    placeholder="e.g., 200"
                    value={totalEntitlements}
                    onChange={(e) => setTotalEntitlements(e.target.value)}
                    className="rounded-lg border-slate-300"
                  />
                  <p className="text-xs text-slate-500">
                    Sum of all unit entitlements in the scheme
                  </p>
                </div>

                <Button
                  onClick={handleCalculate}
                  disabled={!budget || !myEntitlement || !allEntitlements}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3"
                >
                  Calculate Levy
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              <Card className="border border-slate-200 rounded-xl bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Your Levy Calculation
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    Based on the information provided
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {calculated ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600 font-medium mb-1">
                          Quarterly Levy
                        </p>
                        <p className="text-3xl font-semibold text-blue-700">
                          {formatCurrency(quarterlyLevy)}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-500 font-medium mb-1">
                            Annual Levy
                          </p>
                          <p className="text-xl font-semibold text-slate-900">
                            {formatCurrency(annualLevy)}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-500 font-medium mb-1">
                            Your Share
                          </p>
                          <p className="text-xl font-semibold text-slate-900">
                            {percentageShare.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                        <h4 className="text-sm font-medium text-slate-700 mb-2">
                          Calculation Breakdown
                        </h4>
                        <div className="space-y-1 text-sm text-slate-600">
                          <p>Total Budget: {formatCurrency(budget)}</p>
                          <p>
                            Your Entitlement: {myEntitlement} / {allEntitlements}
                          </p>
                          <p>
                            Calculation: {formatCurrency(budget)} x ({myEntitlement} /{" "}
                            {allEntitlements})
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Enter your details to calculate your levy</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Box */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">About Unit Entitlements</p>
                    <p>
                      Unit entitlements are set when your strata plan is registered
                      and typically reflect lot size and value. You can find your
                      entitlement on your strata plan, levy notice, or by contacting
                      your strata committee.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mt-16">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="p-6 bg-white rounded-xl border border-slate-200">
                <h3 className="font-medium text-slate-900 mb-2">
                  What is the difference between admin and capital works levies?
                </h3>
                <p className="text-slate-600 text-sm">
                  Admin levies cover day-to-day expenses like insurance, cleaning,
                  and utilities. Capital works levies fund major repairs and long-term
                  maintenance like painting, roof replacement, and structural work.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200">
                <h3 className="font-medium text-slate-900 mb-2">
                  How do I find my unit entitlement?
                </h3>
                <p className="text-slate-600 text-sm">
                  Your unit entitlement is shown on your strata plan (available from
                  NSW Land Registry Services), on your levy notices, or you can ask
                  your strata secretary. It's a number that represents your share of
                  scheme costs.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200">
                <h3 className="font-medium text-slate-900 mb-2">
                  Can I change my unit entitlement?
                </h3>
                <p className="text-slate-600 text-sm">
                  Unit entitlements are set when the strata plan is registered and
                  very rarely change. Reallocation requires a special resolution and
                  registration of an amended strata plan with NSW Land Registry.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-3">
              Want to automate levy management?
            </h2>
            <p className="text-blue-100 mb-6 max-w-md mx-auto">
              StrataGenie calculates levies, generates notices, and tracks payments
              automatically.
            </p>
            <Link href="/sign-up">
              <Button className="bg-white text-blue-700 hover:bg-blue-50 rounded-lg px-6 py-2.5">
                Start Free Trial
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
