"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowLeft, Info } from "lucide-react";

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
            className="inline-flex items-center gap-2 text-sm text-[#3d3d5c] hover:text-[#FF6B35] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#FFF0EB] rounded-[20px] flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-[#FF6B35]" />
            </div>
            <h1 className="text-3xl font-semibold font-display tracking-tight text-[#1a1a2e] mb-3">
              Strata Levy Calculator
            </h1>
            <p className="text-lg text-[#3d3d5c] max-w-xl mx-auto">
              Calculate individual lot levies based on unit entitlements and total
              budget. Perfect for NSW strata committees.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <Card className="border border-[#E8E4DE] rounded-[20px] bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium font-display">
                  Enter Your Details
                </CardTitle>
                <CardDescription className="text-sm text-[#6b6b8a]">
                  Input your scheme&apos;s budget and entitlement information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fund Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#3d3d5c]">
                    Fund Type
                  </Label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFundType("admin")}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                        fundType === "admin"
                          ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                          : "bg-white text-[#3d3d5c] border-[#E8E4DE] hover:border-[#E8E4DE]"
                      }`}
                    >
                      Admin Fund
                    </button>
                    <button
                      onClick={() => setFundType("capital")}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                        fundType === "capital"
                          ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                          : "bg-white text-[#3d3d5c] border-[#E8E4DE] hover:border-[#E8E4DE]"
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
                    className="text-sm font-medium text-[#3d3d5c]"
                  >
                    Total Annual Budget ($)
                  </Label>
                  <Input
                    id="totalBudget"
                    type="number"
                    placeholder="e.g., 50000"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    className="rounded-lg border-[#E8E4DE]"
                  />
                  <p className="text-xs text-[#6b6b8a]">
                    The total {fundType === "admin" ? "administrative" : "capital works"}{" "}
                    budget for the year
                  </p>
                </div>

                {/* My Unit Entitlement */}
                <div className="space-y-2">
                  <Label
                    htmlFor="unitEntitlement"
                    className="text-sm font-medium text-[#3d3d5c]"
                  >
                    Your Unit Entitlement
                  </Label>
                  <Input
                    id="unitEntitlement"
                    type="number"
                    placeholder="e.g., 15"
                    value={unitEntitlement}
                    onChange={(e) => setUnitEntitlement(e.target.value)}
                    className="rounded-lg border-[#E8E4DE]"
                  />
                  <p className="text-xs text-[#6b6b8a]">
                    Found on your strata plan or levy notice
                  </p>
                </div>

                {/* Total Entitlements */}
                <div className="space-y-2">
                  <Label
                    htmlFor="totalEntitlements"
                    className="text-sm font-medium text-[#3d3d5c]"
                  >
                    Total Scheme Entitlements
                  </Label>
                  <Input
                    id="totalEntitlements"
                    type="number"
                    placeholder="e.g., 200"
                    value={totalEntitlements}
                    onChange={(e) => setTotalEntitlements(e.target.value)}
                    className="rounded-lg border-[#E8E4DE]"
                  />
                  <p className="text-xs text-[#6b6b8a]">
                    Sum of all unit entitlements in the scheme
                  </p>
                </div>

                <Button
                  onClick={handleCalculate}
                  disabled={!budget || !myEntitlement || !allEntitlements}
                  className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-lg py-3"
                >
                  Calculate Levy
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              <Card className="border border-[#E8E4DE] rounded-[20px] bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium font-display">
                    Your Levy Calculation
                  </CardTitle>
                  <CardDescription className="text-sm text-[#6b6b8a]">
                    Based on the information provided
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {calculated ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-[#FFF0EB] rounded-lg">
                        <p className="text-sm text-[#FF6B35] font-medium mb-1">
                          Quarterly Levy
                        </p>
                        <p className="text-3xl font-semibold font-display text-[#FF6B35]">
                          {formatCurrency(quarterlyLevy)}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[#F8F5F0] rounded-lg">
                          <p className="text-xs text-[#6b6b8a] font-medium mb-1">
                            Annual Levy
                          </p>
                          <p className="text-xl font-semibold font-display text-[#1a1a2e]">
                            {formatCurrency(annualLevy)}
                          </p>
                        </div>
                        <div className="p-4 bg-[#F8F5F0] rounded-lg">
                          <p className="text-xs text-[#6b6b8a] font-medium mb-1">
                            Your Share
                          </p>
                          <p className="text-xl font-semibold font-display text-[#1a1a2e]">
                            {percentageShare.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-[#F8F5F0]">
                        <h4 className="text-sm font-medium text-[#3d3d5c] mb-2">
                          Calculation Breakdown
                        </h4>
                        <div className="space-y-1 text-sm text-[#3d3d5c]">
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
                    <div className="text-center py-8 text-[#9595ad]">
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
            <h2 className="text-xl font-semibold font-display text-[#1a1a2e] mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="p-6 bg-white rounded-[20px] border border-[#E8E4DE]">
                <h3 className="font-medium font-display text-[#1a1a2e] mb-2">
                  What is the difference between admin and capital works levies?
                </h3>
                <p className="text-[#3d3d5c] text-sm">
                  Admin levies cover day-to-day expenses like insurance, cleaning,
                  and utilities. Capital works levies fund major repairs and long-term
                  maintenance like painting, roof replacement, and structural work.
                </p>
              </div>
              <div className="p-6 bg-white rounded-[20px] border border-[#E8E4DE]">
                <h3 className="font-medium font-display text-[#1a1a2e] mb-2">
                  How do I find my unit entitlement?
                </h3>
                <p className="text-[#3d3d5c] text-sm">
                  Your unit entitlement is shown on your strata plan (available from
                  NSW Land Registry Services), on your levy notices, or you can ask
                  your strata secretary. It&apos;s a number that represents your share of
                  scheme costs.
                </p>
              </div>
              <div className="p-6 bg-white rounded-[20px] border border-[#E8E4DE]">
                <h3 className="font-medium font-display text-[#1a1a2e] mb-2">
                  Can I change my unit entitlement?
                </h3>
                <p className="text-[#3d3d5c] text-sm">
                  Unit entitlements are set when the strata plan is registered and
                  very rarely change. Reallocation requires a special resolution and
                  registration of an amended strata plan with NSW Land Registry.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-12 bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] rounded-[20px] p-8 text-center">
            <h2 className="text-xl font-semibold font-display text-white mb-3">
              Want to automate levy management?
            </h2>
            <p className="text-white/90 mb-6 max-w-md mx-auto">
              StrataGenie calculates levies, generates notices, and tracks payments
              automatically.
            </p>
            <Link href="/sign-up">
              <Button className="bg-white text-[#FF6B35] hover:bg-[#FFF0EB] rounded-lg px-6 py-2.5">
                Start Free Trial
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
