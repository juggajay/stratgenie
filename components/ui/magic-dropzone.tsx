"use client";

import { useState, useCallback, useEffect, ReactNode } from "react";
import { Upload, Loader2, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type DropzoneStatus = "idle" | "dragging" | "processing" | "success" | "error";

interface MagicDropzoneProps {
  // New API
  onFileDrop?: (file: File) => Promise<void>;
  maxSize?: number;
  idleTitle?: string;
  idleDescription?: string;
  // Legacy API (backwards compatibility)
  onFileAccepted?: (file: File) => Promise<void>;
  maxSizeMB?: number;
  title?: string;
  description?: string;
  isUploading?: boolean;
  // Common props
  accept?: string;
  processingText?: string[];
  successText?: string;
  errorText?: string;
  children?: ReactNode;
  className?: string;
}

const defaultProcessingTexts = [
  "Scanning document...",
  "Identifying vendor...",
  "Checking against budget...",
  "Extracting GST...",
  "Verifying ABN...",
];

export function MagicDropzone({
  // New API props
  onFileDrop,
  maxSize,
  idleTitle,
  idleDescription,
  // Legacy API props
  onFileAccepted,
  maxSizeMB,
  title,
  description,
  isUploading,
  // Common props
  accept = ".pdf,.png,.jpg,.jpeg",
  processingText = defaultProcessingTexts,
  successText = "Successfully processed!",
  errorText = "Something went wrong",
  children,
  className,
}: MagicDropzoneProps) {
  // Merge legacy and new APIs - ALL LOGIC PRESERVED
  const handleFile = onFileDrop ?? onFileAccepted;
  const fileSizeLimit = maxSize ?? (maxSizeMB ? maxSizeMB * 1024 * 1024 : 10 * 1024 * 1024);
  const displayTitle = idleTitle ?? title ?? "Drop your documents here";
  const displayDescription = idleDescription ?? description ?? "Invoices, minutes, or compliance docs";

  const [status, setStatus] = useState<DropzoneStatus>(isUploading ? "processing" : "idle");
  const [error, setError] = useState<string | null>(null);
  const [processingIndex, setProcessingIndex] = useState(0);

  // Sync with external isUploading prop
  useEffect(() => {
    if (isUploading !== undefined) {
      setStatus(isUploading ? "processing" : "idle");
    }
  }, [isUploading]);

  const startProcessingAnimation = useCallback(() => {
    const interval = setInterval(() => {
      setProcessingIndex((prev) => (prev + 1) % processingText.length);
    }, 2000);
    return interval;
  }, [processingText.length]);

  const validateFile = useCallback((file: File): string | null => {
    if (fileSizeLimit && file.size > fileSizeLimit) {
      return `File too large. Maximum size is ${Math.round(fileSizeLimit / 1024 / 1024)}MB`;
    }
    const acceptedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
    const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const isAccepted = acceptedTypes.some(
      (type) => type === fileExt || type === file.type
    );
    if (!isAccepted) {
      return `File type not accepted. Please upload: ${accept}`;
    }
    return null;
  }, [accept, fileSizeLimit]);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setStatus("idle");

      const file = e.dataTransfer.files[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setStatus("error");
        setTimeout(() => {
          setStatus("idle");
          setError(null);
        }, 3000);
        return;
      }

      setStatus("processing");
      setError(null);
      const interval = startProcessingAnimation();

      try {
        if (handleFile) {
          await handleFile(file);
        }
        setStatus("success");
        setTimeout(() => setStatus("idle"), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : errorText);
        setStatus("error");
        setTimeout(() => {
          setStatus("idle");
          setError(null);
        }, 3000);
      } finally {
        clearInterval(interval);
        setProcessingIndex(0);
      }
    },
    [handleFile, startProcessingAnimation, errorText, validateFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("dragging");
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("idle");
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setStatus("error");
        setTimeout(() => {
          setStatus("idle");
          setError(null);
        }, 3000);
        return;
      }

      setStatus("processing");
      setError(null);
      const interval = startProcessingAnimation();

      try {
        if (handleFile) {
          await handleFile(file);
        }
        setStatus("success");
        setTimeout(() => setStatus("idle"), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : errorText);
        setStatus("error");
        setTimeout(() => {
          setStatus("idle");
          setError(null);
        }, 3000);
      } finally {
        clearInterval(interval);
        setProcessingIndex(0);
      }

      e.target.value = "";
    },
    [handleFile, startProcessingAnimation, errorText, validateFile]
  );

  const isInteractive = status === "idle" || status === "dragging";

  return (
    <div
      onDrop={isInteractive ? handleDrop : undefined}
      onDragOver={isInteractive ? handleDragOver : undefined}
      onDragLeave={isInteractive ? handleDragLeave : undefined}
      className={cn(
        "relative rounded-xl border-2 border-dashed transition-all duration-300",
        // Sydney Sunday dropzone states
        status === "idle" && "dropzone-idle hover:border-primary hover:shadow-ocean",
        status === "dragging" && "dropzone-active scale-[1.02]",
        status === "processing" && "border-primary/50 bg-primary/5",
        status === "success" && "dropzone-success",
        status === "error" && "dropzone-error",
        isInteractive && "cursor-pointer",
        className
      )}
    >
      <div className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
        {status === "idle" && (
          <>
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground transition-colors" />
              </div>
              <Sparkles className="h-5 w-5 text-persimmon absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p className="font-display text-lg font-bold text-foreground mb-1">{displayTitle}</p>
            <p className="text-sm text-muted-foreground">{displayDescription}</p>
            <p className="text-xs text-muted-foreground mt-2">or click to browse</p>
            {children}
          </>
        )}

        {status === "dragging" && (
          <>
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary animate-bounce" />
              </div>
              <Sparkles className="h-5 w-5 text-persimmon absolute -top-1 -right-1 animate-spin" />
            </div>
            <p className="font-display text-lg font-bold text-primary">Drop it here!</p>
            <p className="text-sm text-primary/70">Release to upload</p>
          </>
        )}

        {status === "processing" && (
          <>
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-primary/20 animate-ping" />
            </div>
            <p className="font-display text-lg font-bold text-primary mb-1">
              {processingText[processingIndex]}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              {processingText.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    idx === processingIndex ? "bg-primary" : "bg-border"
                  )}
                />
              ))}
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full bg-mint/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-mint" />
              </div>
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-mint/30 animate-ping" />
            </div>
            <p className="font-display text-lg font-bold text-mint">{successText}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <p className="font-display text-lg font-bold text-red-600 mb-1">{errorText}</p>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </>
        )}
      </div>

      {isInteractive && (
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload file"
        />
      )}
    </div>
  );
}
