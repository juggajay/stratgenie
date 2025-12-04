"use client";

import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2, CheckCircle2, XCircle, BookOpen } from "lucide-react";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB for bylaws (can be longer)

interface BylawUploadProps {
  schemeId: Id<"schemes">;
  onUploadComplete?: () => void;
}

type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

export function BylawUpload({ schemeId, onUploadComplete }: BylawUploadProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [bylawId, setBylawId] = useState<Id<"bylaws"> | null>(null);

  const generateUploadUrl = useMutation(api.guardian.generateUploadUrl);
  const createBylaw = useMutation(api.guardian.createBylaw);

  // Poll bylaw status while processing
  const bylaw = useQuery(
    api.guardian.getBylaw,
    bylawId ? { bylawId } : "skip"
  );

  // Watch for bylaw status changes
  useEffect(() => {
    if (!bylaw || status !== "processing") return;

    if (bylaw.status === "ready") {
      setStatus("success");
      onUploadComplete?.();
      // Reset after delay
      setTimeout(() => {
        setStatus("idle");
        setFileName(null);
        setBylawId(null);
      }, 3000);
    } else if (bylaw.status === "failed") {
      setError(bylaw.errorMessage || "Failed to process bylaws");
      setStatus("error");
      setBylawId(null);
    }
  }, [bylaw, status, onUploadComplete]);

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Please upload a PDF file";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 20MB";
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

      // Step 3: Create bylaw record (triggers ingestion)
      setStatus("processing");
      const newBylawId = await createBylaw({
        schemeId,
        fileId: storageId,
        fileName: file.name,
      });

      setBylawId(newBylawId);
      // Status will be updated by the useEffect watching bylaw.status
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload bylaws");
      setStatus("error");
    }
  }, [schemeId, generateUploadUrl, createBylaw]);

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
    e.target.value = "";
  }, [handleUpload]);

  const renderContent = () => {
    switch (status) {
      case "uploading":
        return (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-guardian/10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-guardian" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Uploading...</p>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          </div>
        );
      case "processing":
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-guardian/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-guardian" />
              </div>
              <Loader2 className="h-4 w-4 animate-spin text-guardian absolute -bottom-1 -right-1" />
            </div>
            <div className="text-center">
              <p className="font-medium text-guardian">Ingesting and indexing bylaws...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Extracting text and creating searchable index
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                This may take 10-30 seconds
              </p>
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
              <p className="font-medium text-mint">Bylaws indexed successfully!</p>
              <p className="text-sm text-muted-foreground">Ready to answer your questions</p>
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
              <p className="font-medium text-red-600">Processing failed</p>
              <p className="text-sm text-red-500 max-w-md">{error}</p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setError(null);
                  setBylawId(null);
                }}
                className="mt-3 text-sm text-guardian hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragging ? "bg-guardian/10" : "bg-secondary"}`}>
              <Upload className={`h-6 w-6 ${isDragging ? "text-guardian" : "text-muted-foreground"}`} />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">
                {isDragging ? "Drop your bylaws here" : "Upload your Consolidated Bylaws"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag & drop a PDF or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                PDF files up to 20MB
              </p>
            </div>
          </div>
        );
    }
  };

  const isInteractive = status === "idle" || status === "error";

  return (
    <Card className="agent-guardian">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="p-1.5 bg-guardian/10 rounded-lg border border-guardian/30">
            <BookOpen className="h-4 w-4 text-guardian" />
          </div>
          Upload Bylaws
        </CardTitle>
        <CardDescription>
          Upload your scheme&apos;s consolidated bylaws to enable AI-powered Q&A
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          onDrop={isInteractive ? handleDrop : undefined}
          onDragOver={isInteractive ? handleDragOver : undefined}
          onDragLeave={isInteractive ? handleDragLeave : undefined}
          className={`
            relative border-2 border-dashed rounded-lg p-12
            transition-all duration-200
            ${isDragging ? "dropzone-active" : "dropzone-idle"}
            ${isInteractive ? "cursor-pointer hover:border-guardian" : "cursor-default"}
          `}
        >
          {renderContent()}
          {isInteractive && (
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload bylaw PDF file"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
