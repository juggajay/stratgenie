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
  const missingLotCount = !scheme.lotCount || scheme.lotCount === 0;

  // Don't show if setup is complete
  if (!missingLotCount) {
    return null;
  }

  return (
    <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-900">
            Setup Incomplete
          </p>
          <p className="text-sm text-amber-700 mt-0.5">
            Please add your lot count to enable accurate levy calculations and compliance tracking.
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
