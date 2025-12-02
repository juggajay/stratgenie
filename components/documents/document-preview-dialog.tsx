"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
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
import { FileText, Printer, Check, Loader2 } from "lucide-react";

interface DocumentPreviewDialogProps {
  documentId: Id<"documents"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinalized?: () => void;
}

export function DocumentPreviewDialog({
  documentId,
  open,
  onOpenChange,
  onFinalized,
}: DocumentPreviewDialogProps) {
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const document = useQuery(
    api.documents.getDocument,
    documentId ? { documentId } : "skip"
  );
  const finalizeDocument = useMutation(api.documents.finalizeDocument);

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  const handleFinalize = async () => {
    if (!documentId) return;

    setIsFinalizing(true);
    setError(null);

    try {
      await finalizeDocument({ documentId });
      onFinalized?.();
      // Trigger download after finalizing
      handleDownload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to finalize document"
      );
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleDownload = () => {
    if (!document?.content) return;

    // Create blob and download
    const blob = new Blob([document.content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${document.title || "document"}.html`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isFinalized = document?.status === "final";

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
                  ? "This document has been finalized and is ready to send."
                  : "Review the document below. Once approved, it will be marked as final."}
              </DialogDescription>
            </div>
            {isFinalized && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <Check className="h-3 w-3" />
                Finalized
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

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-4">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-200 mt-4 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="rounded-lg border-slate-300 text-slate-700"
            disabled={!document?.content}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print / Download
          </Button>

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
                onClick={handleFinalize}
                disabled={isFinalizing || !document}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {isFinalizing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Finalizing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Approve & Finalize
                  </>
                )}
              </Button>
            )}

            {isFinalized && (
              <Button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <FileText className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
