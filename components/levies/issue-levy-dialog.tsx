"use client";

import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Send,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface IssueLevyDialogProps {
  levyRunId: Id<"levyRuns"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function IssueLevyDialog({
  levyRunId,
  open,
  onOpenChange,
  onSuccess,
}: IssueLevyDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the preview data
  const preview = useQuery(
    api.levies.getIssuePreview,
    levyRunId ? { levyRunId } : "skip"
  );

  const confirmIssue = useAction(api.levies.confirmIssueLevyRun);

  const isLoading = levyRunId && !preview;

  const handleSend = async () => {
    if (!levyRunId) return;

    setIsSending(true);
    setError(null);

    try {
      const result = await confirmIssue({ levyRunId });

      // Build toast message
      const parts: string[] = [];
      if (result.sent > 0) {
        parts.push(`${result.sent} email${result.sent === 1 ? "" : "s"} sent`);
      }
      if (result.skipped > 0) {
        parts.push(`${result.skipped} skipped`);
      }
      if (result.failed > 0) {
        parts.push(`${result.failed} failed`);
      }

      const message = parts.join(", ");

      if (result.failed > 0) {
        toast.warning("Levy Run Issued", {
          description: message,
        });
      } else {
        toast.success("Levy Run Issued", {
          description: message,
        });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to issue levy run";
      setError(errorMessage);
      toast.error("Failed to Issue", {
        description: errorMessage,
      });
    } finally {
      setIsSending(false);
    }
  };

  const noEmails = preview && preview.withEmail === 0;
  const buttonText = noEmails ? "Issue Without Email" : "Send Emails & Issue";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Issue Levy Run
          </DialogTitle>
          <DialogDescription>
            Confirm to send levy notices to lot owners via email.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : preview ? (
          <div className="space-y-4">
            {/* Email Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-green-50 border-green-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Ready to Send
                  </span>
                </div>
                <div className="text-3xl font-bold text-green-700">
                  {preview.withEmail}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  owner{preview.withEmail === 1 ? "" : "s"} with email
                </div>
              </div>

              <div
                className={`rounded-lg border p-4 ${
                  preview.withoutEmail > 0
                    ? "bg-amber-50 border-amber-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <XCircle
                    className={`h-4 w-4 ${
                      preview.withoutEmail > 0
                        ? "text-amber-600"
                        : "text-slate-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      preview.withoutEmail > 0
                        ? "text-amber-700"
                        : "text-slate-500"
                    }`}
                  >
                    Skipping
                  </span>
                </div>
                <div
                  className={`text-3xl font-bold ${
                    preview.withoutEmail > 0
                      ? "text-amber-700"
                      : "text-slate-400"
                  }`}
                >
                  {preview.withoutEmail}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    preview.withoutEmail > 0
                      ? "text-amber-600"
                      : "text-slate-400"
                  }`}
                >
                  no email address
                </div>
              </div>
            </div>

            {/* Warning if some owners will be skipped */}
            {preview.withoutEmail > 0 && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Some owners will not receive email notices
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      {preview.skippedOwners.slice(0, 3).join(", ")}
                      {preview.skippedOwners.length > 3 &&
                        ` and ${preview.skippedOwners.length - 3} more`}
                    </p>
                    <p className="text-xs text-amber-600 mt-2">
                      You must print and mail notices for these owners manually.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* No emails case */}
            {noEmails && (
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      No owners have email addresses
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      The levy run will be marked as issued but no emails will
                      be sent. You must print and mail all notices manually.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            No levy run selected
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || isLoading || !preview}
            className={noEmails ? "" : "bg-indigo-600 hover:bg-indigo-700"}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {buttonText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
