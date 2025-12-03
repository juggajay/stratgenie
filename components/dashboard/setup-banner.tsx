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
    <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-900">
            Complete your scheme setup
          </p>
          <p className="text-sm text-amber-700 mt-0.5">
            Add your {missingText} to enable compliance tracking and accurate calculations.
          </p>
        </div>
        {onOpenSettings && (
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenSettings}
            className="flex-shrink-0 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
          >
            <Settings className="w-4 h-4 mr-1.5" />
            Complete Setup
          </Button>
        )}
      </div>
    </div>
  );
}
