"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/marketing/logo";
import { ArrowRight, ArrowLeft, Building2, Users, Check, Loader2 } from "lucide-react";

type Step = 1 | 2 | 3;

interface FormData {
  strataNumber: string;
  address: string;
  lotCount: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    strataNumber: "",
    address: "",
    lotCount: "",
  });

  // Get current user to check if they have schemes
  const currentUser = useQuery(api.users.currentUser);
  const storeUser = useMutation(api.users.store);
  const createFirstScheme = useMutation(api.schemes.createFirstScheme);

  // Sync user on mount
  useEffect(() => {
    const syncUser = async () => {
      try {
        await storeUser();
      } catch (e) {
        // User might not be authenticated yet
        console.log("User sync pending auth");
      }
    };
    syncUser();
  }, [storeUser]);

  // If user already has schemes, redirect to dashboard
  useEffect(() => {
    if (currentUser && currentUser.schemes && currentUser.schemes.length > 0) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const validateStep1 = () => {
    if (!formData.strataNumber.trim()) {
      setError("Please enter your Strata Plan Number");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const lotCount = parseInt(formData.lotCount);
    if (!formData.lotCount || isNaN(lotCount) || lotCount < 1) {
      setError("Please enter a valid number of lots (minimum 1)");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setError(null);
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Generate a name from the strata number if no address provided
      const schemeName = formData.address.trim() || `Scheme ${formData.strataNumber}`;

      await createFirstScheme({
        name: schemeName,
        strataNumber: formData.strataNumber.trim().toUpperCase(),
        address: formData.address.trim() || undefined,
        lotCount: parseInt(formData.lotCount),
      });

      // Success - redirect to dashboard
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create scheme. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Loading state while checking user
  if (currentUser === undefined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="max-w-xl mx-auto">
          <Logo className="h-8 w-auto" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-colors ${
                  s === step
                    ? "bg-blue-600"
                    : s < step
                    ? "bg-blue-400"
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Strata Plan Number */}
          {step === 1 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-7 h-7 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  Welcome to StrataGenie
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Let&apos;s set up your first strata scheme
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="strataNumber" className="text-sm font-medium text-slate-700">
                    What is your Strata Plan Number?
                  </Label>
                  <Input
                    id="strataNumber"
                    placeholder="e.g., SP12345"
                    value={formData.strataNumber}
                    onChange={handleInputChange("strataNumber")}
                    className="text-lg py-5 rounded-lg border-slate-300"
                    autoFocus
                  />
                  <p className="text-xs text-slate-500">
                    You can find this on your strata levy notice or title documents
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                    Scheme Address (optional)
                  </Label>
                  <Input
                    id="address"
                    placeholder="e.g., 123 Example Street, Sydney"
                    value={formData.address}
                    onChange={handleInputChange("address")}
                    className="rounded-lg border-slate-300"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <Button
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-lg"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Lot Count */}
          {step === 2 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  About Your Scheme
                </CardTitle>
                <CardDescription className="text-slate-600">
                  This helps us calculate levies correctly
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="lotCount" className="text-sm font-medium text-slate-700">
                    How many lots are in your scheme?
                  </Label>
                  <Input
                    id="lotCount"
                    type="number"
                    min="1"
                    placeholder="e.g., 6"
                    value={formData.lotCount}
                    onChange={handleInputChange("lotCount")}
                    className="text-lg py-5 rounded-lg border-slate-300"
                    autoFocus
                  />
                  <p className="text-xs text-slate-500">
                    Include all lots in the strata plan (apartments, units, townhouses)
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 py-5 rounded-lg border-slate-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-lg"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  Ready to Go!
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Confirm your scheme details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                {/* Summary */}
                <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Strata Plan Number</span>
                    <span className="text-sm font-medium text-slate-900">
                      {formData.strataNumber.toUpperCase()}
                    </span>
                  </div>
                  {formData.address && (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Address</span>
                      <span className="text-sm font-medium text-slate-900 text-right max-w-[200px]">
                        {formData.address}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Number of Lots</span>
                    <span className="text-sm font-medium text-slate-900">
                      {formData.lotCount}
                    </span>
                  </div>
                </div>

                {/* Trial notice */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <strong>Your 14-day free trial starts now.</strong>
                    <br />
                    <span className="text-blue-700">
                      Full access to all features. No credit card required.
                    </span>
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="flex-1 py-5 rounded-lg border-slate-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Scheme
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-200 bg-white">
        <p className="text-xs text-slate-500 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </footer>
    </div>
  );
}
