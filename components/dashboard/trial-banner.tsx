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
          ? "bg-amber-900/30 border-b border-amber-500/30 text-amber-300"
          : "bg-cyan-900/30 border-b border-cyan-500/30 text-cyan-300"
        }
      `}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {isUrgent ? (
            <Clock className="w-4 h-4 text-amber-400" />
          ) : (
            <Sparkles className="w-4 h-4 text-cyan-400" />
          )}
          <span>
            {isUrgent ? (
              <strong>Only {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left in your trial!</strong>
            ) : (
              <>
                <strong>{daysRemaining} days</strong> remaining in your free trial
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/billing">
            <Button
              size="sm"
              className={`
                h-7 text-xs rounded-full px-3
                ${isUrgent
                  ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20"
                }
              `}
            >
              Upgrade Now
            </Button>
          </Link>
          <button
            onClick={() => setIsDismissed(true)}
            className={`
              p-1 rounded-full transition-colors
              ${isUrgent
                ? "hover:bg-amber-900/50 text-amber-400"
                : "hover:bg-cyan-900/50 text-cyan-400"
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
