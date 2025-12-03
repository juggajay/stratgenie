"use client";

import { useState } from "react";
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
import { CheckCircle2, Circle, Clock, FileText, Loader2 } from "lucide-react";
import { DocumentPreviewDialog } from "@/components/documents/document-preview-dialog";

type TaskStatus = "draft" | "in_progress" | "done";
type TaskType = "send_agm_notice" | "hold_agm" | "file_strata_hub_report";

const statusConfig: Record<
  TaskStatus,
  { label: string; icon: typeof Circle; iconClass: string }
> = {
  draft: {
    label: "To do",
    icon: Circle,
    iconClass: "text-slate-400",
  },
  in_progress: {
    label: "In progress",
    icon: Clock,
    iconClass: "text-blue-500",
  },
  done: {
    label: "Done",
    icon: CheckCircle2,
    iconClass: "text-green-500",
  },
};

function formatRelativeDate(timestamp: number): string {
  const now = Date.now();
  const diffMs = timestamp - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays === -1) return "1 day overdue";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays <= 7) return `Due in ${diffDays} days`;
  if (diffDays <= 30) return `Due in ${Math.ceil(diffDays / 7)} weeks`;
  return `Due in ${Math.ceil(diffDays / 30)} months`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TaskList({ schemeId }: { schemeId: Id<"schemes"> }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] =
    useState<Id<"documents"> | null>(null);
  const [generatingForTask, setGeneratingForTask] =
    useState<Id<"complianceTasks"> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tasks = useQuery(api.compliance.listComplianceTasksForScheme, {
    schemeId,
  });
  const documents = useQuery(api.documents.getDocumentsByType, {
    schemeId,
    type: "agm_notice",
  });
  const updateStatus = useMutation(api.compliance.updateComplianceTaskStatus);
  const generateAgmNotice = useMutation(api.documents.generateAgmNotice);

  const handleStatusChange = async (
    taskId: Id<"complianceTasks">,
    newStatus: TaskStatus
  ) => {
    try {
      await updateStatus({ taskId, status: newStatus });
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  const handleGenerateNotice = async (taskId: Id<"complianceTasks">) => {
    setGeneratingForTask(taskId);
    setError(null);

    try {
      // Check if there's already a draft AGM notice
      const existingDraft = documents?.find((d) => d.status === "draft");

      if (existingDraft) {
        // Open existing draft
        setCurrentDocumentId(existingDraft._id);
        setPreviewOpen(true);
      } else {
        // Generate new notice
        const documentId = await generateAgmNotice({ schemeId });
        setCurrentDocumentId(documentId);
        setPreviewOpen(true);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate notice";
      setError(message);
      console.error("Failed to generate AGM notice:", err);
    } finally {
      setGeneratingForTask(null);
    }
  };

  const handleDocumentFinalized = () => {
    // Optionally update the task status when document is finalized
    // The user can still manually mark it as complete
  };

  const handleViewDocument = (documentId: Id<"documents">) => {
    setCurrentDocumentId(documentId);
    setPreviewOpen(true);
  };

  // Get the latest AGM notice (draft or final)
  const latestAgmNotice = documents?.[0];

  if (!tasks) {
    return (
      <div id="task-list">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Tasks</CardTitle>
            <CardDescription>
              Your upcoming deadlines and to-dos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-3">
              <div className="h-12 bg-slate-100 rounded"></div>
              <div className="h-12 bg-slate-100 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div id="task-list">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Tasks</CardTitle>
            <CardDescription>
              Your upcoming deadlines and to-dos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              No tasks yet. Generate an AGM checklist to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingTasks = tasks.filter((t) => t.status !== "done");
  const completedTasks = tasks.filter((t) => t.status === "done");

  const renderTaskAction = (task: {
    _id: Id<"complianceTasks">;
    type: TaskType;
    status: TaskStatus;
  }) => {
    const isGenerating = generatingForTask === task._id;

    // Special handling for send_agm_notice task
    if (task.type === "send_agm_notice") {
      if (task.status === "done") {
        return <span className="text-xs text-slate-400">Completed</span>;
      }

      // Check if there's an existing document
      if (latestAgmNotice) {
        return (
          <Button
            size="sm"
            onClick={() => handleViewDocument(latestAgmNotice._id)}
            className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg min-w-[90px]"
          >
            {latestAgmNotice.status === "draft" ? "View Draft" : "View Notice"}
          </Button>
        );
      }

      return (
        <Button
          size="sm"
          onClick={() => handleGenerateNotice(task._id)}
          disabled={isGenerating}
          className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg min-w-[90px]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Generating
            </>
          ) : (
            "Generate"
          )}
        </Button>
      );
    }

    // Default actions for other task types
    if (task.status === "draft") {
      return (
        <Button
          size="sm"
          onClick={() => handleStatusChange(task._id, "in_progress")}
          className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg min-w-[90px]"
        >
          Start
        </Button>
      );
    }

    if (task.status === "in_progress") {
      return (
        <Button
          size="sm"
          onClick={() => handleStatusChange(task._id, "done")}
          className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg min-w-[90px]"
        >
          Complete
        </Button>
      );
    }

    return <span className="text-xs text-slate-400 min-w-[90px] inline-block text-center">Completed</span>;
  };

  return (
    <div id="task-list">
      <Card>
        <CardHeader>
          <CardTitle>Compliance Tasks</CardTitle>
          <CardDescription>
            {pendingTasks.length} pending · {completedTasks.length} completed
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Error message */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
              <p className="text-xs mt-1 text-red-500">
                Make sure scheme settings are configured (Secretary, Location,
                Time).
              </p>
            </div>
          )}

          <div className="overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-3 py-2 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Task
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide text-right">
                Due
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide w-28 text-right">
                Action
              </span>
            </div>

            {/* Task rows */}
            <div className="divide-y divide-slate-100">
              {tasks.map((task) => {
                const config = statusConfig[task.status];
                const Icon = config.icon;
                const isOverdue =
                  task.dueDate < Date.now() && task.status !== "done";

                return (
                  <div
                    key={task._id}
                    className="grid grid-cols-[1fr_auto_auto] gap-4 px-3 py-3 hover:bg-slate-50 transition-colors items-center"
                  >
                    {/* Task name + status icon */}
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`h-4 w-4 flex-shrink-0 ${config.iconClass}`}
                      />
                      <span
                        className={`text-sm truncate ${
                          task.status === "done"
                            ? "text-slate-400 line-through"
                            : "text-slate-900"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {/* Due date */}
                    <div className="text-right">
                      <span
                        className={`text-sm ${
                          isOverdue
                            ? "text-red-600 font-medium"
                            : "text-slate-600"
                        }`}
                      >
                        {formatRelativeDate(task.dueDate)}
                      </span>
                      <span className="block text-xs text-slate-400">
                        {formatDate(task.dueDate)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="w-28 text-right">
                      {renderTaskAction(task)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Preview Dialog */}
      <DocumentPreviewDialog
        documentId={currentDocumentId}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onFinalized={handleDocumentFinalized}
      />
    </div>
  );
}
