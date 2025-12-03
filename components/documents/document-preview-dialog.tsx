"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Check, Loader2, Send, ArrowLeft, RefreshCw, X } from "lucide-react";

interface DocumentPreviewDialogProps {
  documentId: Id<"documents"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinalized?: () => void;
}

type ViewMode = "preview" | "confirm";

export function DocumentPreviewDialog({
  documentId,
  open,
  onOpenChange,
  onFinalized,
}: DocumentPreviewDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [selectedLotIds, setSelectedLotIds] = useState<Set<Id<"lots">>>(new Set());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const document = useQuery(
    api.documents.getDocument,
    documentId ? { documentId } : "skip"
  );

  const lots = useQuery(
    api.lots.listLotsForScheme,
    document?.schemeId ? { schemeId: document.schemeId } : "skip"
  );

  const finalizeAndSend = useAction(api.actions.documents.finalizeAndSendDocument);
  const resendDocument = useAction(api.actions.documents.resendDocument);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setViewMode("preview");
      setError(null);
      setSuccessMessage(null);
    }
  }, [open]);

  // Select all lots by default when lots load
  useEffect(() => {
    if (lots && lots.length > 0 && selectedLotIds.size === 0) {
      setSelectedLotIds(new Set(lots.map((lot) => lot._id)));
    }
  }, [lots]);

  const isFinalized = document?.status === "final";

  const handleShowConfirm = () => {
    // Reset selection to all lots when opening confirm screen
    if (lots) {
      setSelectedLotIds(new Set(lots.map((lot) => lot._id)));
    }
    setError(null);
    setSuccessMessage(null);
    setViewMode("confirm");
  };

  const handleBackToPreview = () => {
    setViewMode("preview");
  };

  const toggleLot = (lotId: Id<"lots">) => {
    const newSet = new Set(selectedLotIds);
    if (newSet.has(lotId)) {
      newSet.delete(lotId);
    } else {
      newSet.add(lotId);
    }
    setSelectedLotIds(newSet);
  };

  const toggleAll = () => {
    if (lots) {
      if (selectedLotIds.size === lots.length) {
        setSelectedLotIds(new Set());
      } else {
        setSelectedLotIds(new Set(lots.map((lot) => lot._id)));
      }
    }
  };

  const handleSend = async () => {
    if (!documentId || selectedLotIds.size === 0) return;

    setIsSending(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const lotIdsArray = Array.from(selectedLotIds);

      let result;
      if (isFinalized) {
        result = await resendDocument({ documentId, lotIds: lotIdsArray });
      } else {
        result = await finalizeAndSend({ documentId, lotIds: lotIdsArray });
      }

      setSuccessMessage(result.message);
      setViewMode("preview");
      onFinalized?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send document"
      );
    } finally {
      setIsSending(false);
    }
  };

  // Preview View
  if (viewMode === "preview") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-600" />
                  {document?.title || "Document Preview"}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                  {isFinalized
                    ? "This document has been sent to lot owners."
                    : "Review the document below. Once approved, it will be sent to lot owners."}
                </DialogDescription>
              </div>
              {isFinalized && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <Check className="h-3 w-3" />
                  Sent
                </span>
              )}
            </div>
          </DialogHeader>

          {/* Document Preview Area */}
          <div className="flex-1 min-h-0 mt-4 border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
            {document?.content ? (
              <iframe
                ref={iframeRef}
                srcDoc={document.content}
                className="w-full h-full bg-white"
                title="Document Preview"
                sandbox="allow-same-origin"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                {documentId ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading document...
                  </div>
                ) : (
                  "No document selected"
                )}
              </div>
            )}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg mt-4 flex items-center gap-2">
              <Check className="h-4 w-4" />
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-4">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-200 mt-4 flex-shrink-0">
            {isFinalized ? (
              <Button
                variant="outline"
                onClick={handleShowConfirm}
                className="rounded-lg border-slate-300 text-slate-700"
                disabled={!document?.content}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-lg border-slate-300 text-slate-700"
              >
                Close
              </Button>

              {!isFinalized && (
                <Button
                  onClick={handleShowConfirm}
                  disabled={!document || !lots || lots.length === 0}
                  className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Approve & Send
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Confirm View
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Send className="h-5 w-5 text-teal-600" />
            {isFinalized ? "Resend Document" : "Confirm & Send"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Select which lot owners should receive this document.
          </DialogDescription>
        </DialogHeader>

        {/* Lot Selection */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">
              Recipients ({selectedLotIds.size} of {lots?.length || 0} selected)
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAll}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              {selectedLotIds.size === (lots?.length || 0) ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="border border-slate-200 rounded-lg max-h-64 overflow-y-auto">
            {lots && lots.length > 0 ? (
              lots.map((lot) => (
                <label
                  key={lot._id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                >
                  <Checkbox
                    checked={selectedLotIds.has(lot._id)}
                    onCheckedChange={() => toggleLot(lot._id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-slate-900">
                        Lot {lot.lotNumber}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-sm text-slate-600 truncate">
                        {lot.ownerName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {lot.ownerEmail}
                    </div>
                  </div>
                  {selectedLotIds.has(lot._id) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLot(lot._id);
                      }}
                      className="p-1 hover:bg-slate-200 rounded"
                    >
                      <X className="h-3 w-3 text-slate-400" />
                    </button>
                  )}
                </label>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-slate-500 text-sm">
                No lots found. Add lots in the Strata Roll first.
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-4">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-200 mt-4">
          <Button
            variant="ghost"
            onClick={handleBackToPreview}
            disabled={isSending}
            className="text-slate-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSending}
              className="rounded-lg border-slate-300 text-slate-700"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSend}
              disabled={isSending || selectedLotIds.size === 0}
              className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send to {selectedLotIds.size} {selectedLotIds.size === 1 ? "Owner" : "Owners"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
