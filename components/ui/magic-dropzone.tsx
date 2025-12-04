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
  "Summoning the Genie...",
  "Analyzing your document...",
  "Extracting the magic...",
  "Almost there...",
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
  // Merge legacy and new APIs
  const handleFile = onFileDrop ?? onFileAccepted;
  const fileSizeLimit = maxSize ?? (maxSizeMB ? maxSizeMB * 1024 * 1024 : 10 * 1024 * 1024);
  const displayTitle = idleTitle ?? title ?? "Feed the Genie";
  const displayDescription = idleDescription ?? description ?? "Drop your file here or click to browse";

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
        "bg-slate-900/80 backdrop-blur-xl",
        status === "idle" && "border-white/20 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
        status === "dragging" && "border-cyan-500 bg-cyan-900/20 shadow-[0_0_40px_rgba(6,182,212,0.4)]",
        status === "processing" && "border-violet-500/50 bg-violet-900/10",
        status === "success" && "border-emerald-500 bg-emerald-900/20",
        status === "error" && "border-red-500/50 bg-red-900/10",
        isInteractive && "cursor-pointer",
        className
      )}
    >
      <div className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
        {status === "idle" && (
          <>
            <div className="relative mb-4">
              <Upload className="h-12 w-12 text-slate-500 transition-colors group-hover:text-cyan-400" />
              <Sparkles className="h-4 w-4 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p className="text-lg font-medium text-white mb-1">{displayTitle}</p>
            <p className="text-sm text-slate-400">{displayDescription}</p>
            {children}
          </>
        )}

        {status === "dragging" && (
          <>
            <div className="relative mb-4">
              <Upload className="h-12 w-12 text-cyan-400 animate-bounce" />
              <Sparkles className="h-4 w-4 text-amber-400 absolute -top-1 -right-1 animate-spin" />
            </div>
            <p className="text-lg font-medium text-cyan-400">Drop it here!</p>
            <p className="text-sm text-cyan-400/70">Release to upload</p>
          </>
        )}

        {status === "processing" && (
          <>
            <div className="relative mb-4">
              <Loader2 className="h-12 w-12 text-violet-400 animate-spin" />
              <div className="absolute inset-0 h-12 w-12 rounded-full bg-violet-400/20 animate-ping" />
            </div>
            <p className="text-lg font-medium text-violet-400 mb-1">
              {processingText[processingIndex]}
            </p>
            <p className="text-sm text-slate-400">This may take a moment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="relative mb-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-400" />
              <div className="absolute inset-0 h-12 w-12 rounded-full bg-emerald-400/30 animate-ping" />
            </div>
            <p className="text-lg font-medium text-emerald-400">{successText}</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-red-400 mb-4" />
            <p className="text-lg font-medium text-red-400 mb-1">{errorText}</p>
            {error && <p className="text-sm text-red-400/70">{error}</p>}
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
