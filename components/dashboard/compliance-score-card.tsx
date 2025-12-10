"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

interface ComplianceScoreCardProps {
  schemeId: Id<"schemes">;
}

export function ComplianceScoreCard({ schemeId }: ComplianceScoreCardProps) {
  const readiness = useQuery(api.strataHubCompliance.getStrataHubReadiness, { schemeId });
  const scheme = useQuery(api.schemes.get, { id: schemeId });

  if (!readiness || !scheme) {
    return (
      <Card className="bg-white border border-[#E8E4DE] rounded-xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-24 w-24 mx-auto rounded-full bg-secondary" />
            <div className="h-4 bg-secondary rounded w-32 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const score = readiness.score;

  // Determine score status
  const getScoreStatus = (score: number) => {
    if (score >= 80) {
      return {
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        label: "On track",
        icon: CheckCircle2,
      };
    }
    if (score >= 50) {
      return {
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        label: "Needs attention",
        icon: Clock,
      };
    }
    return {
      color: "text-[#FF6B35]",
      bg: "bg-[#FFF0EB]",
      border: "border-[#FFCDB8]",
      label: "Setup required",
      icon: AlertTriangle,
    };
  };

  const status = getScoreStatus(score);
  const StatusIcon = status.icon;

  // Calculate what's missing
  const missingItems: string[] = [];
  if (!scheme.lastAgmDate) missingItems.push("AGM date");
  if (!readiness.insuranceComplete) missingItems.push("Insurance");
  if ((readiness.emergencyContactsCount ?? 0) < 4) missingItems.push("Emergency contacts");
  if (!readiness.financialComplete) missingItems.push("Financial info");

  return (
    <Card className={`${status.bg} border ${status.border} rounded-xl`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          {/* Circular progress */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#E8E4DE"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={`${score * 2.64} 264`}
                className={status.color}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold ${status.color}`}>{score}%</span>
            </div>
          </div>

          {/* Status info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusIcon className={`h-4 w-4 ${status.color}`} />
              <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">
              Strata Hub Readiness
            </p>
            {missingItems.length > 0 ? (
              <p className="text-sm text-muted-foreground">
                Missing: {missingItems.slice(0, 2).join(", ")}
                {missingItems.length > 2 && ` +${missingItems.length - 2} more`}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                All required fields complete
              </p>
            )}
          </div>

          {/* Action */}
          <Link href="/dashboard/strata-hub" className="flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-1">
              View
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
