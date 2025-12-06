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
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertTriangle, XCircle, Settings, Calendar, FileText } from "lucide-react";

type ComplianceStatus = "on_track" | "upcoming" | "due_soon" | "overdue" | null;

const statusConfig: Record<
  NonNullable<ComplianceStatus>,
  {
    label: string;
    badgeVariant: "success" | "info" | "warning" | "danger";
    icon: typeof CheckCircle2;
    message: string;
    tone: "reassuring" | "informative" | "warning" | "urgent";
  }
> = {
  on_track: {
    label: "On track",
    badgeVariant: "success",
    icon: CheckCircle2,
    message: "You are compliant. No immediate action required.",
    tone: "reassuring",
  },
  upcoming: {
    label: "Upcoming",
    badgeVariant: "info",
    icon: Clock,
    message: "Time to start preparing. Draft your agenda and gather documents.",
    tone: "informative",
  },
  due_soon: {
    label: "Due soon",
    badgeVariant: "warning",
    icon: AlertTriangle,
    message: "Action required. Ensure you meet statutory notice periods.",
    tone: "warning",
  },
  overdue: {
    label: "Overdue",
    badgeVariant: "danger",
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
      <Badge variant="neutral">
        Setup required
      </Badge>
    );
  }

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.badgeVariant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function ComplianceItem({
  title,
  status,
  nextDueDate,
  needsSetup,
  onGenerateChecklist,
  isGenerating,
  hasExistingTasks,
  onViewChecklist,
  onOpenSettings,
  icon: IconComponent,
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
  icon: typeof Calendar;
}) {
  const config = status ? statusConfig[status] : null;
  const StatusIcon = config?.icon;

  // Icon color based on status
  const iconColorClass = status === "on_track"
    ? "text-emerald-600"
    : status === "due_soon" || status === "upcoming"
    ? "text-[#FF6B35]"
    : status === "overdue"
    ? "text-red-600"
    : "text-[#6b6b8a]";

  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl bg-[#F8F5F0] hover:bg-[#FFF0EB] transition-all cursor-pointer">
      {/* Icon box with hover effect */}
      <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border bg-white border-[#E8E4DE] group-hover:bg-[#FFF0EB] group-hover:border-[#FF6B35]/30 transition-all flex-shrink-0">
        {StatusIcon ? (
          <StatusIcon className={`h-5 w-5 transition-colors ${iconColorClass} group-hover:text-[#FF6B35]`} />
        ) : (
          <IconComponent className="h-5 w-5 text-[#6b6b8a] group-hover:text-[#FF6B35] transition-colors" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">
          {needsSetup
            ? "Set your last AGM date to enable tracking"
            : `Next due: ${formatDate(nextDueDate)} (${getDaysUntil(nextDueDate)})`}
        </p>
      </div>

      {/* Status badge */}
      <StatusPill status={status} />
    </div>
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

  // Determine urgency for card styling
  const urgencyClass = status === "overdue"
    ? "urgency-urgent"
    : status === "due_soon"
    ? "urgency-attention"
    : "";

  return (
    <Card className={urgencyClass}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
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
            <p className="text-sm text-muted-foreground">
              To track your compliance status, please configure your last AGM date
              in scheme settings.
            </p>
            {onOpenSettings && (
              <Button
                onClick={onOpenSettings}
                variant="outline"
              >
                <Settings className="h-4 w-4 mr-2" />
                Set up AGM tracking
              </Button>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {nextDueDate && (
                <span className="font-semibold text-foreground">{getDaysUntil(nextDueDate)}. </span>
              )}
              {config?.message}
            </p>
            {onGenerateChecklist && (
              <div className="flex flex-wrap items-center gap-3">
                {hasExistingTasks ? (
                  <Button
                    variant="outline"
                    onClick={onViewChecklist}
                  >
                    View checklist
                  </Button>
                ) : (
                  <Button
                    onClick={onGenerateChecklist}
                    disabled={isGenerating}
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
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-5 bg-secondary rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-secondary rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-secondary rounded"></div>
            <div className="h-16 bg-secondary rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Status</CardTitle>
        <CardDescription>Your current compliance overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ComplianceItem
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
          icon={Calendar}
        />
        <ComplianceItem
          title="Strata Hub Reporting"
          status={complianceStatus.strataHub.status}
          nextDueDate={complianceStatus.strataHub.nextDueDate}
          needsSetup={complianceStatus.strataHub.needsSetup}
          onOpenSettings={onOpenSettings}
          icon={FileText}
        />
      </CardContent>
    </Card>
  );
}
