"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, PartyPopper, Clock, FileCheck } from "lucide-react";

interface StepSuccessProps {
  schemeId: Id<"schemes">;
  onComplete: () => void;
}

export function StepSuccess({ schemeId, onComplete }: StepSuccessProps) {
  // Fetch readiness score
  const readiness = useQuery(api.strataHubCompliance.getStrataHubReadiness, { schemeId });
  const scheme = useQuery(api.schemes.get, { id: schemeId });

  const score = readiness?.score ?? 0;

  // Determine score status
  const getScoreStatus = (score: number) => {
    if (score >= 80) return { color: "text-emerald-600", bg: "bg-emerald-50", label: "Great start!" };
    if (score >= 50) return { color: "text-amber-600", bg: "bg-amber-50", label: "Good progress" };
    return { color: "text-[#FF6B35]", bg: "bg-[#FFF0EB]", label: "Getting started" };
  };

  const status = getScoreStatus(score);

  // Upcoming tasks preview
  const upcomingTasks = [
    scheme?.lastAgmDate ? null : { icon: Clock, label: "Set your AGM date" },
    readiness?.insuranceComplete ? null : { icon: FileCheck, label: "Upload insurance certificate" },
    (readiness?.emergencyContactsCount ?? 0) < 4 ? { icon: FileCheck, label: "Add emergency contacts" } : null,
  ].filter(Boolean).slice(0, 3);

  return (
    <Card className="border-[#E8E4DE] shadow-sm">
      <CardHeader className="text-center pb-2">
        <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <PartyPopper className="w-7 h-7 text-emerald-600" />
        </div>
        <CardTitle className="text-2xl font-semibold text-foreground">
          You&apos;re all set!
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Your scheme is ready. Let&apos;s see how you&apos;re doing.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        {/* Compliance Score Preview */}
        <div className={`${status.bg} rounded-xl p-6 text-center`}>
          <div className="relative w-24 h-24 mx-auto mb-4">
            {/* Circular progress */}
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E8E4DE"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${score * 2.83} 283`}
                className={status.color}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${status.color}`}>{score}%</span>
            </div>
          </div>
          <p className={`text-lg font-medium ${status.color}`}>{status.label}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Strata Hub Readiness Score
          </p>
        </div>

        {/* Upcoming tasks */}
        {upcomingTasks.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Complete these to boost your score:
            </p>
            <div className="space-y-2">
              {upcomingTasks.map((task, index) => {
                if (!task) return null;
                const Icon = task.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-[#F8F5F0] rounded-lg"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{task.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* What's next */}
        <div className="bg-white border border-[#E8E4DE] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Your 14-day free trial is active
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Full access to all features. We&apos;ll remind you before it ends.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={onComplete}
          className="w-full py-5 rounded-lg"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
