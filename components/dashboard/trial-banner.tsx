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
    <div
      className={`
        relative px-4 py-2.5 text-sm
        ${isUrgent
          ? "bg-persimmon/10 border-b border-persimmon/30 text-persimmon"
          : "bg-primary/5 border-b border-primary/20 text-primary"
        }
      `}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {isUrgent ? (
            <Clock className="w-4 h-4 text-persimmon" />
          ) : (
            <Sparkles className="w-4 h-4 text-primary" />
          )}
          <span className="text-foreground">
            {isUrgent ? (
              <strong className="text-persimmon">Only {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left in your trial!</strong>
            ) : (
              <>
                <strong className="text-primary">{daysRemaining} days</strong> remaining in your free trial
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/billing">
            <Button
              size="sm"
              variant={isUrgent ? "warning" : "default"}
              className="h-7 text-xs rounded-full px-3"
            >
              Upgrade Now
            </Button>
          </Link>
          <button
            onClick={() => setIsDismissed(true)}
            className={`
              p-1 rounded-full transition-colors
              ${isUrgent
                ? "hover:bg-persimmon/20 text-persimmon"
                : "hover:bg-primary/20 text-primary"
              }
            `}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
