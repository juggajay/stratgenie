"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertTriangle, XCircle, Settings } from "lucide-react";

type ComplianceStatus = "on_track" | "upcoming" | "due_soon" | "overdue" | null;

const statusConfig: Record<
  NonNullable<ComplianceStatus>,
  {
    label: string;
    pillClass: string;
    icon: typeof CheckCircle2;
    message: string;
    tone: "reassuring" | "informative" | "warning" | "urgent";
  }
> = {
  on_track: {
    label: "On track",
    pillClass: "bg-emerald-900/20 text-emerald-400 border border-emerald-500/50",
    icon: CheckCircle2,
    message: "You are compliant. No immediate action required.",
    tone: "reassuring",
  },
  upcoming: {
    label: "Upcoming",
    pillClass: "bg-cyan-900/20 text-cyan-400 border border-cyan-500/50",
    icon: Clock,
    message: "Time to start preparing. Draft your agenda and gather documents.",
    tone: "informative",
  },
  due_soon: {
    label: "Due soon",
    pillClass: "bg-amber-900/20 text-amber-400 border border-amber-500/50",
    icon: AlertTriangle,
    message: "Action required. Ensure you meet statutory notice periods.",
    tone: "warning",
  },
  overdue: {
    label: "Overdue",
    pillClass: "bg-red-900/20 text-red-400 border border-red-500/50",
    icon: XCircle,
    message: "Immediate action required. Your compliance deadline has passed.",
    tone: "urgent",
  },
};

function formatDate(timestamp: number | null): string {
  if (!timestamp) return "Not set";
  return new Date(timestamp).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDaysUntil(timestamp: number | null): string {
  if (!timestamp) return "";
  const days = Math.ceil((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

function StatusPill({ status }: { status: ComplianceStatus }) {
  if (!status) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-400 border border-white/10">
        Setup required
      </span>
    );
  }

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.pillClass}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function ComplianceSection({
  title,
  status,
  nextDueDate,
  needsSetup,
  onGenerateChecklist,
  isGenerating,
  hasExistingTasks,
  onViewChecklist,
  onOpenSettings,
}: {
  title: string;
  status: ComplianceStatus;
  nextDueDate: number | null;
  needsSetup: boolean;
  onGenerateChecklist?: () => void;
  isGenerating?: boolean;
  hasExistingTasks?: boolean;
  onViewChecklist?: () => void;
  onOpenSettings?: () => void;
}) {
  const config = status ? statusConfig[status] : null;

  return (
    <Card className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-white">{title}</CardTitle>
            <CardDescription className="text-slate-400">
              {needsSetup
                ? "Set your last AGM date to enable tracking"
                : `Next due: ${formatDate(nextDueDate)}`}
            </CardDescription>
          </div>
          <StatusPill status={status} />
        </div>
      </CardHeader>
      <CardContent className="pt-2 space-y-3">
        {needsSetup ? (
          <>
            <p className="text-sm text-slate-400">
              To track your compliance status, please configure your last AGM date
              in scheme settings.
            </p>
            {onOpenSettings && (
              <Button
                onClick={onOpenSettings}
                variant="outline"
                className="rounded-lg border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all"
              >
                <Settings className="h-4 w-4 mr-2" />
                Set up AGM tracking
              </Button>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-slate-400">
              {nextDueDate && (
                <span className="font-medium text-white">{getDaysUntil(nextDueDate)}. </span>
              )}
              {config?.message}
            </p>
            {onGenerateChecklist && (
              <div className="flex flex-wrap items-center gap-3">
                {hasExistingTasks ? (
                  <Button
                    variant="outline"
                    onClick={onViewChecklist}
                    className="rounded-lg border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                  >
                    View checklist
                  </Button>
                ) : (
                  <Button
                    onClick={onGenerateChecklist}
                    disabled={isGenerating}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-lg shadow-cyan-600/20 transition-all"
                  >
                    {isGenerating ? "Generating..." : "Generate AGM checklist"}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function ComplianceCard({
  schemeId,
  onViewChecklist,
  onOpenSettings,
}: {
  schemeId: Id<"schemes">;
  onViewChecklist?: () => void;
  onOpenSettings?: () => void;
}) {
  const complianceStatus = useQuery(api.compliance.getSchemeComplianceStatus, {
    schemeId,
  });
  const tasks = useQuery(api.compliance.listComplianceTasksForScheme, {
    schemeId,
  });
  const generateChecklist = useMutation(api.compliance.generateAgmChecklist);

  const hasExistingTasks = tasks && tasks.length > 0;

  const handleGenerateChecklist = async () => {
    try {
      await generateChecklist({ schemeId });
    } catch (error) {
      console.error("Failed to generate checklist:", error);
    }
  };

  const handleViewChecklist = () => {
    // Scroll to task list
    const taskList = document.getElementById("task-list");
    if (taskList) {
      taskList.scrollIntoView({ behavior: "smooth" });
    }
    onViewChecklist?.();
  };

  if (!complianceStatus) {
    return (
      <div className="space-y-4">
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg">
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-5 bg-slate-700/50 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ComplianceSection
        title="Annual General Meeting"
        status={complianceStatus.agm.status}
        nextDueDate={complianceStatus.agm.nextDueDate}
        needsSetup={complianceStatus.agm.needsSetup}
        onGenerateChecklist={
          !complianceStatus.agm.needsSetup ? handleGenerateChecklist : undefined
        }
        hasExistingTasks={hasExistingTasks}
        onViewChecklist={handleViewChecklist}
        onOpenSettings={onOpenSettings}
      />
      <ComplianceSection
        title="Strata Hub Report"
        status={complianceStatus.strataHub.status}
        nextDueDate={complianceStatus.strataHub.nextDueDate}
        needsSetup={complianceStatus.strataHub.needsSetup}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
}
