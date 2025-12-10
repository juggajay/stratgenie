"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding";
import { Loader2 } from "lucide-react";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const lotsFromUrl = searchParams.get("lots") || undefined;

  return <OnboardingWizard initialLotCount={lotsFromUrl} />;
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35] mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
