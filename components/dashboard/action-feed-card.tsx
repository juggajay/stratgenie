"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  Shield,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Wallet,
  Building,
} from "lucide-react";

type ActionType = "invoice" | "compliance" | "levy" | "task" | "document";
type UrgencyLevel = "normal" | "attention" | "urgent";
type AgentType = "secretary" | "treasurer" | "guardian";

const agentConfig: Record<
  AgentType,
  { label: string; icon: typeof Shield; badgeVariant: "secretary" | "treasurer" | "guardian" }
> = {
  secretary: {
    label: "Secretary",
    icon: FileText,
    badgeVariant: "secretary",
  },
  treasurer: {
    label: "Treasurer",
    icon: Wallet,
    badgeVariant: "treasurer",
  },
  guardian: {
    label: "Guardian",
    icon: Shield,
    badgeVariant: "guardian",
  },
};

const actionTypeIcons: Record<ActionType, typeof Receipt> = {
  invoice: Receipt,
  compliance: Calendar,
  levy: Building,
  task: CheckCircle2,
  document: FileText,
};

export interface ActionFeedCardProps {
  type: ActionType;
  title: string;
  description: string;
  urgency?: UrgencyLevel;
  agent?: AgentType;
  dueDate?: string;
  amount?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  dismissed?: boolean;
  className?: string;
}

export function ActionFeedCard({
  type,
  title,
  description,
  urgency = "normal",
  agent,
  dueDate,
  amount,
  primaryAction,
  secondaryAction,
  onDismiss,
  dismissed,
  className,
}: ActionFeedCardProps) {
  const TypeIcon = actionTypeIcons[type];
  const agentInfo = agent ? agentConfig[agent] : null;

  const urgencyClasses = {
    normal: "urgency-normal",
    attention: "urgency-attention",
    urgent: "urgency-urgent",
  };

  return (
    <div
      className={cn(
        "paper-interactive p-5",
        urgencyClasses[urgency],
        dismissed && "animate-card-dismiss",
        className
      )}
    >
      {/* Header row: Icon + Title + Agent badge */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
              urgency === "urgent"
                ? "bg-red-500/10 text-red-400"
                : urgency === "attention"
                ? "bg-amber-500/10 text-amber-400"
                : "bg-slate-700/50 text-slate-400"
            )}
          >
            <TypeIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-foreground text-base leading-tight">
              {title}
            </h3>
            {amount && (
              <p className="text-lg font-semibold text-primary mt-0.5">
                {amount}
              </p>
            )}
          </div>
        </div>

        {agentInfo && (
          <Badge variant={agentInfo.badgeVariant} className="flex-shrink-0">
            <agentInfo.icon className="h-3 w-3 mr-1" />
            {agentInfo.label}
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {description}
      </p>

      {/* Due date indicator */}
      {dueDate && (
        <div className="flex items-center gap-2 mb-4">
          {urgency === "urgent" ? (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          ) : urgency === "attention" ? (
            <Clock className="h-4 w-4 text-amber-500" />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
          <span
            className={cn(
              "text-sm font-medium",
              urgency === "urgent"
                ? "text-red-600"
                : urgency === "attention"
                ? "text-amber-600"
                : "text-muted-foreground"
            )}
          >
            {dueDate}
          </span>
        </div>
      )}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center gap-3">
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              disabled={primaryAction.loading}
              className="shadow-ocean"
            >
              {primaryAction.loading ? "Processing..." : primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Empty state component
export function ActionFeedEmpty() {
  return (
    <div className="empty-state">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
      </div>
      <h3 className="font-display text-xl font-bold text-foreground mb-2">
        All caught up!
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        Your building is compliant. No actions need your attention right now.
      </p>
    </div>
  );
}
