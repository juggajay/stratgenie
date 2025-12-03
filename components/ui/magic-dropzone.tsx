"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MagicDropzone - A trust-building file upload component with visual feedback
 *
 * Design decisions:
 * - Uses native HTML5 drag-drop (consistent with InvoiceUploadZone, BylawUpload)
 * - CSS animations instead of framer-motion (keeps bundle small, follows CLAUDE.md)
 * - Simulated "scanning" phase builds confidence before upload
 * - Mobile camera support via capture="environment"
 *
 * States: idle → active (dragging) → scanning (simulated) → uploading → complete/error
 */

export interface MagicDropzoneProps {
  /** Called when a valid file is accepted, after the scanning animation */
  onFileAccepted: (file: File) => void | Promise<void>;
  /** Called on validation errors */
  onError?: (error: string) => void;
  /** Accepted file types (default: application/pdf) */
  accept?: string;
  /** Max file size in MB (default: 10) */
  maxSizeMB?: number;
  /** Disable the dropzone */
  disabled?: boolean;
  /** Whether upload is in progress (externally controlled) */
  isUploading?: boolean;
  /** Additional className */
  className?: string;
  /** Idle state title */
  title?: string;
  /** Idle state description */
  description?: string;
}

type DropzoneState = "idle" | "active" | "scanning" | "uploading" | "error";

const SCANNING_DURATION = 2000; // 2 seconds simulated scanning

export function MagicDropzone({
  onFileAccepted,
  onError,
  accept = "application/pdf",
  maxSizeMB = 10,
  disabled = false,
  isUploading = false,
  className,
  title = "Drag & drop your document",
  description = "or click to browse",
}: MagicDropzoneProps) {
  const [state, setState] = useState<DropzoneState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scanTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external uploading state
  useEffect(() => {
    if (isUploading && state !== "uploading") {
      setState("uploading");
    } else if (!isUploading && state === "uploading") {
      setState("idle");
      setFileName(null);
    }
  }, [isUploading, state]);

  // Cleanup scan timer on unmount
  useEffect(() => {
    return () => {
      if (scanTimerRef.current) {
        clearTimeout(scanTimerRef.current);
      }
    };
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    const maxBytes = maxSizeMB * 1024 * 1024;

    // Check file type
    const acceptedTypes = accept.split(",").map(t => t.trim());
    const isAccepted = acceptedTypes.some(type => {
      if (type.startsWith(".")) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      if (type.includes("*")) {
        const [mainType] = type.split("/");
        return file.type.startsWith(mainType);
      }
      return file.type === type;
    });

    if (!isAccepted) {
      return "Please upload a PDF document";
    }

    if (file.size > maxBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  }, [accept, maxSizeMB]);

  const simulateScanning = useCallback((file: File) => {
    setState("scanning");
    setScanProgress(0);
    setFileName(file.name);

    // Animate progress bar with realistic feel
    const steps = [
      { progress: 15, delay: 200 },
      { progress: 35, delay: 400 },
      { progress: 55, delay: 600 },
      { progress: 70, delay: 800 },
      { progress: 85, delay: 1200 },
      { progress: 95, delay: 1600 },
      { progress: 100, delay: SCANNING_DURATION },
    ];

    steps.forEach(({ progress, delay }) => {
      setTimeout(() => setScanProgress(progress), delay);
    });

    // After scanning completes, trigger the actual upload
    scanTimerRef.current = setTimeout(() => {
      setState("uploading");
      onFileAccepted(file);
    }, SCANNING_DURATION);
  }, [onFileAccepted]);

  const handleFile = useCallback((file: File) => {
    if (disabled || state === "scanning" || state === "uploading") return;

    setErrorMessage(null);

    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      setState("error");
      onError?.(error);
      // Reset after showing error
      setTimeout(() => {
        setState("idle");
        setErrorMessage(null);
      }, 3000);
      return;
    }

    // Start the magic: simulate document scanning
    simulateScanning(file);
  }, [disabled, state, validateFile, simulateScanning, onError]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState("idle");

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && state === "idle") {
      setState("active");
    }
  }, [disabled, state]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (state === "active") {
      setState("idle");
    }
  }, [state]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  }, [handleFile]);

  const handleClick = useCallback(() => {
    if (!disabled && (state === "idle" || state === "error")) {
      inputRef.current?.click();
    }
  }, [disabled, state]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled && (state === "idle" || state === "error")) {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, [disabled, state]);

  const isInteractive = !disabled && (state === "idle" || state === "error" || state === "active");

  const renderContent = () => {
    switch (state) {
      case "active":
        return (
          <div className="flex flex-col items-center gap-3 text-green-600">
            <div className="relative">
              <Upload className="h-12 w-12 animate-bounce" />
              <Sparkles className="h-5 w-5 absolute -top-1 -right-1 text-green-500" />
            </div>
            <div className="text-center">
              <p className="font-medium text-lg">Drop to analyze...</p>
              <p className="text-sm text-green-500">Release to start scanning</p>
            </div>
          </div>
        );

      case "scanning":
        return (
          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            <div className="relative">
              <FileText className="h-12 w-12 text-blue-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-medium text-blue-600">Scanning document...</p>
              <p className="text-sm text-slate-500 mt-1 truncate max-w-full">{fileName}</p>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">Detecting document structure...</p>
          </div>
        );

      case "uploading":
        return (
          <div className="flex flex-col items-center gap-3 text-slate-600">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <div className="text-center">
              <p className="font-medium text-blue-600">Uploading...</p>
              <p className="text-sm text-slate-500">{fileName}</p>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center gap-3 text-red-600">
            <AlertCircle className="h-12 w-12" />
            <div className="text-center">
              <p className="font-medium">Upload failed</p>
              <p className="text-sm text-red-500">{errorMessage}</p>
              <p className="text-xs text-slate-500 mt-2">Click to try again</p>
            </div>
          </div>
        );

      default: // idle
        return (
          <div className="flex flex-col items-center gap-3 text-slate-600">
            <div className="relative">
              <Upload className="h-12 w-12 text-slate-400 transition-transform group-hover:scale-110 group-hover:text-blue-500" />
            </div>
            <div className="text-center">
              <p className="font-medium text-lg text-slate-700">{title}</p>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2 py-1 bg-slate-100 rounded">PDF</span>
              <span>up to {maxSizeMB}MB</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      role="button"
      tabIndex={isInteractive ? 0 : -1}
      aria-label="Upload document"
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDrop={isInteractive ? handleDrop : undefined}
      onDragOver={isInteractive ? handleDragOver : undefined}
      onDragLeave={isInteractive ? handleDragLeave : undefined}
      className={cn(
        "group relative border-2 border-dashed rounded-xl p-8 transition-all duration-200",
        // Base styles
        "flex flex-col items-center justify-center min-h-[200px]",
        // State-specific styles
        state === "idle" && "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50",
        state === "active" && "border-green-500 bg-green-50 scale-[1.02]",
        state === "scanning" && "border-blue-500 bg-blue-50",
        state === "uploading" && "border-blue-400 bg-blue-50/50",
        state === "error" && "border-red-300 bg-red-50",
        // Interactive styles
        isInteractive && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        !isInteractive && "cursor-default",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {renderContent()}

      {/* Hidden file input with mobile camera support */}
      <input
        ref={inputRef}
        type="file"
        accept={`${accept},image/*`}
        capture="environment"
        onChange={handleFileSelect}
        disabled={disabled || state === "scanning" || state === "uploading"}
        className="sr-only"
        aria-hidden="true"
      />
    </div>
  );
}
