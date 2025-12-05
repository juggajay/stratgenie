"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AlertTriangle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SetupBannerProps {
  schemeId: Id<"schemes">;
  onOpenSettings?: () => void;
}

export function SetupBanner({ schemeId, onOpenSettings }: SetupBannerProps) {
  const scheme = useQuery(api.schemes.get, { id: schemeId });

  // Don't show if still loading
  if (scheme === undefined) {
    return null;
  }

  // Don't show if scheme not found
  if (scheme === null) {
    return null;
  }

  // Check for missing setup items
  const missingItems: string[] = [];
  if (!scheme.lotCount || scheme.lotCount === 0) {
    missingItems.push("lot count");
  }
  if (!scheme.lastAgmDate) {
    missingItems.push("last AGM date");
  }

  // Don't show if setup is complete
  if (missingItems.length === 0) {
    return null;
  }

  const missingText = missingItems.join(" and ");

  return (
    <div className="mb-6 px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-amber-500/10 rounded-lg flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            Complete your scheme setup
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Add your {missingText} to enable compliance tracking and accurate calculations.
          </p>
        </div>
        {onOpenSettings && (
          <Button
            size="sm"
            onClick={onOpenSettings}
            className="flex-shrink-0"
          >
            <Settings className="w-4 h-4 mr-1.5" />
            Complete Setup
          </Button>
        )}
      </div>
    </div>
  );
}
