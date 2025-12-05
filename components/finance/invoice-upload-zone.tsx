"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2, CheckCircle2, XCircle } from "lucide-react";

const ACCEPTED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface InvoiceUploadZoneProps {
  schemeId: Id<"schemes">;
  onUploadComplete?: (invoiceId: Id<"invoices">) => void;
}

type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

export function InvoiceUploadZone({ schemeId, onUploadComplete }: InvoiceUploadZoneProps) {
  // ALL LOGIC PRESERVED - only styling changes
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.finance.generateUploadUrl);
  const createInvoice = useMutation(api.finance.createInvoice);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return "Please upload a PDF or image file (PNG, JPG, JPEG)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB";
    }
    return null;
  };

  const handleUpload = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    setFileName(file.name);
    setError(null);
    setStatus("uploading");

    try {
      // Step 1: Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file to Convex storage
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const { storageId } = await response.json();

      // Step 3: Create invoice record (triggers AI extraction)
      setStatus("processing");
      const invoiceId = await createInvoice({
        schemeId,
        fileId: storageId,
        fileName: file.name,
      });

      setStatus("success");
      if (invoiceId) {
        onUploadComplete?.(invoiceId);
      }

      // Reset after a short delay
      setTimeout(() => {
        setStatus("idle");
        setFileName(null);
      }, 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload invoice");
      setStatus("error");
    }
  }, [schemeId, generateUploadUrl, createInvoice, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  }, [handleUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  }, [handleUpload]);

  const renderContent = () => {
    switch (status) {
      case "uploading":
        return (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Uploading...</p>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          </div>
        );
      case "processing":
        return (
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <Loader2 className="h-4 w-4 animate-spin text-primary absolute -bottom-1 -right-1" />
            </div>
            <div className="text-center">
              <p className="font-medium text-primary">Processing with AI...</p>
              <p className="text-sm text-muted-foreground">Extracting invoice details</p>
            </div>
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-mint" />
            </div>
            <div className="text-center">
              <p className="font-medium text-mint">Upload complete!</p>
              <p className="text-sm text-muted-foreground">Invoice ready for review</p>
            </div>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="text-center">
              <p className="font-medium text-red-600">Upload failed</p>
              <p className="text-sm text-red-500">{error}</p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setError(null);
                }}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragging ? "bg-primary/10" : "bg-secondary"}`}>
              <Upload className={`h-6 w-6 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">
                {isDragging ? "Drop your invoice here" : "Drag & drop an invoice"}
              </p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG up to 10MB</p>
            </div>
          </div>
        );
    }
  };

  const isInteractive = status === "idle" || status === "error";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Upload Invoice</CardTitle>
        <CardDescription>
          Drop an invoice and AI will extract the details automatically
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          onDrop={isInteractive ? handleDrop : undefined}
          onDragOver={isInteractive ? handleDragOver : undefined}
          onDragLeave={isInteractive ? handleDragLeave : undefined}
          className={`
            relative border-2 border-dashed rounded-lg p-8
            transition-all duration-200
            ${isDragging ? "dropzone-active" : "dropzone-idle"}
            ${isInteractive ? "cursor-pointer hover:border-primary" : "cursor-default"}
          `}
        >
          {renderContent()}
          {isInteractive && (
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload invoice file"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
