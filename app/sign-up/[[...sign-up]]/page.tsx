"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const lots = searchParams.get("lots");

  // Build redirect URL with lots param if present
  const redirectUrl = lots ? `/onboarding?lots=${lots}` : "/onboarding";

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-8">
        <span className="text-3xl font-display font-medium tracking-tight">
          <span className="text-[#1a1a2e]">Strata</span>
          <span className="text-[#FF6B35]">Genie</span>
        </span>
      </div>
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg rounded-[20px] border border-[#E8E4DE]",
          },
        }}
        signInUrl="/sign-in"
        forceRedirectUrl={redirectUrl}
      />
    </div>
  );
}
