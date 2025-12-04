"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { VaultCategory } from "@/lib/compliance-links";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Flame,
  Building2,
  FileText,
  Download,
  ExternalLink,
  Check,
  Clock,
  AlertCircle,
  Upload,
} from "lucide-react";
import { SUBMISSION_LINKS } from "@/lib/compliance-links";

interface VaultDocument {
  _id: Id<"documents">;
  title: string;
  type: string;
  vaultCategory?: string;
  submissionStatus?: "missing" | "ready" | "submitted";
  submittedAt?: number;
  createdAt: number;
  content: string;
}

interface VaultContainerProps {
  id: string;
  name: string;
  description: string;
  submissionUrl: string;
  documents: VaultDocument[];
  requiredDocs: readonly string[];
  schemeId: Id<"schemes">;
  categories: readonly VaultCategory[];
}

const containerIcons: Record<string, React.ReactNode> = {
  fire_safety: <Flame className="h-5 w-5 text-orange-500" />,
  strata_hub: <Building2 className="h-5 w-5 text-primary" />,
};

export function VaultContainer({
  id,
  name,
  description,
  submissionUrl,
  documents,
  requiredDocs,
  schemeId,
  categories,
}: VaultContainerProps) {
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [currentDocId, setCurrentDocId] = useState<Id<"documents"> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const markSubmitted = useMutation(api.documents.markDocumentSubmitted);
  const generateUploadUrl = useMutation(api.documents.generateVaultUploadUrl);
  const createVaultDocument = useMutation(api.documents.createVaultDocument);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Get signed upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();

      // Use the first category for this container
      const vaultCategory = categories[0];

      // Create vault document record
      await createVaultDocument({
        schemeId,
        fileId: storageId,
        fileName: file.name,
        vaultCategory,
      });

      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "submitted":
        return (
          <Badge variant="default" className="bg-success text-success-foreground">
            <Check className="h-3 w-3 mr-1" />
            Submitted
          </Badge>
        );
      case "ready":
        return (
          <Badge variant="secondary" className="bg-warning/20 text-warning border-warning/50">
            <Clock className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        );
      default:
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Missing
          </Badge>
        );
    }
  };

  const handleSubmit = (doc: VaultDocument) => {
    // Download the document
    const blob = new Blob([doc.content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);

    // Open the government portal
    window.open(submissionUrl, "_blank");

    // Show verification modal
    setCurrentDocId(doc._id);
    setVerifyModalOpen(true);
  };

  const handleConfirmSubmission = async () => {
    if (currentDocId) {
      await markSubmitted({ documentId: currentDocId });
      setVerifyModalOpen(false);
      setCurrentDocId(null);
    }
  };

  const containerStatus = documents.length === 0
    ? "missing"
    : documents.every(d => d.submissionStatus === "submitted")
      ? "submitted"
      : "ready";

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {containerIcons[id] || <FileText className="h-5 w-5 text-muted-foreground" />}
              <div>
                <CardTitle className="text-lg font-display">{name}</CardTitle>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            {getStatusBadge(containerStatus)}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {documents.length === 0 ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span>No documents uploaded. Required: {requiredDocs.join(", ")}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc._id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString("en-AU")}
                      {doc.submittedAt && (
                        <span className="ml-2 text-success">
                          Submitted {new Date(doc.submittedAt).toLocaleDateString("en-AU")}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(doc.submissionStatus)}
                  {doc.submissionStatus !== "submitted" && (
                    <Button
                      size="sm"
                      onClick={() => handleSubmit(doc)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Submit
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Portal link */}
          <div className="pt-2 border-t border-border">
            <a
              href={submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              {submissionUrl.replace("https://www.", "")}
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Verification Modal */}
      <Dialog open={verifyModalOpen} onOpenChange={setVerifyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Confirm Submission</DialogTitle>
            <DialogDescription>
              Did you complete the submission on the government portal?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              The document has been downloaded and the portal has been opened in a new tab.
              Once you&apos;ve successfully submitted on the government portal, click &quot;Yes, I submitted&quot; to mark it as complete.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyModalOpen(false)}>
              Not yet
            </Button>
            <Button onClick={handleConfirmSubmission}>
              <Check className="h-4 w-4 mr-2" />
              Yes, I submitted
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
