"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

interface TrialBannerProps {
  schemeId: Id<"schemes">;
}

export function TrialBanner({ schemeId }: TrialBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const trialStatus = useQuery(api.schemes.getTrialStatus, { schemeId });

  // Don't show if still loading, dismissed, paid, or not on trial
  if (!trialStatus || isDismissed || trialStatus.isPaid || !trialStatus.isOnTrial) {
    return null;
  }

  const daysRemaining = trialStatus.daysRemaining ?? 0;
  const isUrgent = daysRemaining <= 3;

  return (
    <div className="relative px-4 py-2.5 text-sm bg-[#FFF0EB] border-b border-[#FFCDB8]">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF6B35]" />
          <span className="text-[#3d3d5c]">
            {isUrgent ? (
              <>
                <strong className="text-[#1a1a2e]">Only {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left</strong> in your trial
              </>
            ) : (
              <>
                <strong className="text-[#1a1a2e]">{daysRemaining} days</strong> remaining in your free trial
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/billing">
            <Button
              size="sm"
              className="h-7 text-xs rounded-lg px-4 shadow-sm"
            >
              Upgrade Now
            </Button>
          </Link>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg transition-colors hover:bg-[#FF6B35]/10 text-[#6b6b8a] hover:text-[#1a1a2e]"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
