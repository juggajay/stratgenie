"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Clock, X, Sparkles } from "lucide-react";
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
    <div className="relative px-4 py-2.5 text-sm bg-slate-800/50 border-b border-white/10">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">
            {isUrgent ? (
              <>
                <strong className="text-white">Only {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left</strong> in your trial
              </>
            ) : (
              <>
                <strong className="text-white">{daysRemaining} days</strong> remaining in your free trial
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/billing">
            <Button
              size="sm"
              className="h-7 text-xs rounded-full px-3"
            >
              Upgrade Now
            </Button>
          </Link>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-full transition-colors hover:bg-white/10 text-slate-400 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
