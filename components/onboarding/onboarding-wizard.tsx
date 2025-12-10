"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import { StepBasicInfo } from "./step-basic-info";
import { StepAgmDate } from "./step-agm-date";
import { StepInsurance } from "./step-insurance";
import { StepSecretary } from "./step-secretary";
import { StepSuccess } from "./step-success";

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

interface OnboardingWizardProps {
  initialLotCount?: string;
}

export function OnboardingWizard({ initialLotCount }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [schemeId, setSchemeId] = useState<Id<"schemes"> | null>(null);
  const [userSynced, setUserSynced] = useState(false);

  // User sync and queries
  const currentUser = useQuery(api.users.currentUser);
  const storeUser = useMutation(api.users.store);

  // Sync user on mount
  useEffect(() => {
    const syncUser = async () => {
      try {
        await storeUser();
        setUserSynced(true);
      } catch {
        console.log("User sync pending auth");
        setUserSynced(true);
      }
    };
    syncUser();
  }, [storeUser]);

  // If user already has schemes, redirect to dashboard
  useEffect(() => {
    if (!userSynced) return;

    if (currentUser === null) {
      router.push("/sign-in");
      return;
    }

    if (currentUser && currentUser.schemes && currentUser.schemes.length > 0) {
      router.push("/dashboard");
    }
  }, [currentUser, router, userSynced]);

  // Loading state
  if (!userSynced || currentUser === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35] mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSchemeCreated = (newSchemeId: Id<"schemes">) => {
    setSchemeId(newSchemeId);
    setStep(2);
  };

  const handleStepComplete = () => {
    if (step < 5) {
      setStep((step + 1) as OnboardingStep);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as OnboardingStep);
    }
  };

  const handleSkip = () => {
    if (step < 5) {
      setStep((step + 1) as OnboardingStep);
    }
  };

  const handleComplete = () => {
    router.push("/dashboard");
  };

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
            {[1, 2, 3, 4, 5].map((s) => (
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

          {/* Steps */}
          {step === 1 && (
            <StepBasicInfo
              initialLotCount={initialLotCount}
              onSchemeCreated={handleSchemeCreated}
            />
          )}

          {step === 2 && schemeId && (
            <StepAgmDate
              schemeId={schemeId}
              onComplete={handleStepComplete}
              onBack={handleBack}
              onSkip={handleSkip}
            />
          )}

          {step === 3 && schemeId && (
            <StepInsurance
              schemeId={schemeId}
              onComplete={handleStepComplete}
              onBack={handleBack}
              onSkip={handleSkip}
            />
          )}

          {step === 4 && schemeId && (
            <StepSecretary
              schemeId={schemeId}
              onComplete={handleStepComplete}
              onBack={handleBack}
              onSkip={handleSkip}
            />
          )}

          {step === 5 && schemeId && (
            <StepSuccess
              schemeId={schemeId}
              onComplete={handleComplete}
            />
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
