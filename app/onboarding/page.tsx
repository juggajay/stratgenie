"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Building2, Users, Loader2, SkipForward } from "lucide-react";

type Step = 1 | 2;

interface FormData {
  strataNumber: string;
  address: string;
  lotCount: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill lot count from URL params (from landing page pricing calculator)
  const lotsFromUrl = searchParams.get("lots");

  const [formData, setFormData] = useState<FormData>({
    strataNumber: "",
    address: "",
    lotCount: lotsFromUrl || "",
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
      } catch {
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

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setError(null);
    if (step === 2) setStep(1);
  };

  const handleSubmit = async (skipLotCount: boolean = false) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Generate a name from the strata number if no address provided
      const schemeName = formData.address.trim() || `Scheme ${formData.strataNumber}`;
      const lotCount = skipLotCount ? 0 : parseInt(formData.lotCount) || 0;

      await createFirstScheme({
        name: schemeName,
        strataNumber: formData.strataNumber.trim().toUpperCase(),
        address: formData.address.trim() || undefined,
        lotCount: lotCount,
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35] mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[#E8E4DE] bg-white">
        <div className="max-w-xl mx-auto">
          <span className="text-2xl font-display font-medium tracking-tight">
            <span className="text-[#1a1a2e]">Strata</span>
            <span className="text-[#FF6B35]">Genie</span>
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-colors ${
                  s === step
                    ? "bg-[#FF6B35]"
                    : s < step
                    ? "bg-[#FFCDB8]"
                    : "bg-[#E8E4DE]"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Strata Plan Number */}
          {step === 1 && (
            <Card className="border-[#E8E4DE] shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-14 h-14 rounded-xl bg-[#FFF0EB] flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-7 h-7 text-[#FF6B35]" />
                </div>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Welcome to StrataGenie
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Let&apos;s set up your first strata scheme
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="strataNumber" className="text-sm font-medium text-foreground">
                    What is your Strata Plan Number? <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="strataNumber"
                    placeholder="e.g., SP12345"
                    value={formData.strataNumber}
                    onChange={handleInputChange("strataNumber")}
                    className="text-lg py-5 rounded-lg"
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    You can find this on your strata levy notice or title documents
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-foreground">
                    Scheme Address <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="e.g., 123 Example Street, Sydney"
                    value={formData.address}
                    onChange={handleInputChange("address")}
                    className="rounded-lg"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <Button
                  onClick={handleNext}
                  className="w-full py-5 rounded-lg"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Lot Count (optional) */}
          {step === 2 && (
            <Card className="border-[#E8E4DE] shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  About Your Scheme
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  This helps us calculate levies correctly (you can add this later)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="lotCount" className="text-sm font-medium text-foreground">
                    How many lots are in your scheme? <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="lotCount"
                    type="number"
                    min="1"
                    placeholder="e.g., 6"
                    value={formData.lotCount}
                    onChange={handleInputChange("lotCount")}
                    className="text-lg py-5 rounded-lg"
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Include all lots in the strata plan (apartments, units, townhouses)
                  </p>
                </div>

                {/* Trial notice */}
                <div className="bg-[#FFF0EB] rounded-xl p-4 border border-[#FFCDB8]">
                  <p className="text-sm text-[#3d3d5c]">
                    <strong className="text-[#1a1a2e]">Your 14-day free trial starts now.</strong>
                    <br />
                    <span className="text-[#6b6b8a]">
                      Full access to all features. No credit card required.
                    </span>
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting || !formData.lotCount}
                    className="w-full py-5 rounded-lg"
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

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="flex-1 py-5 rounded-lg"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleSubmit(true)}
                      disabled={isSubmitting}
                      className="flex-1 py-5 rounded-lg"
                    >
                      <SkipForward className="w-4 h-4 mr-2" />
                      Skip for now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#E8E4DE] bg-white">
        <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </footer>
    </div>
  );
}
