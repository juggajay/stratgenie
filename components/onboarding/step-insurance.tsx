"use client";

import { useState, useCallback } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowLeft,
  Shield,
  SkipForward,
  Loader2,
  Upload,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

interface ExtractedInsuranceData {
  insurerName: string | null;
  policyNumber: string | null;
  replacementValue: number | null;
  expiryDate: string | null;
  inceptionDate: string | null;
  strataPlanNumber: string | null;
}

interface StepInsuranceProps {
  schemeId: Id<"schemes">;
  onComplete: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function StepInsurance({ schemeId, onComplete, onBack, onSkip }: StepInsuranceProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedStorageId, setUploadedStorageId] = useState<Id<"_storage"> | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [insuranceData, setInsuranceData] = useState<ExtractedInsuranceData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Convex hooks
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const analyzeInsurance = useAction(api.actions.strataHub.analyzeInsuranceCertificate);
  const updateInsurance = useMutation(api.strataHubCompliance.updateInsuranceDetails);
  const createExtractedDocument = useMutation(api.documents.createExtractedDocument);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF document");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setIsUploading(true);

      try {
        const uploadUrl = await generateUploadUrl();

        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const { storageId } = await response.json();
        setUploadedStorageId(storageId);
        setUploadedFileName(file.name);
        setIsUploading(false);
        setIsProcessing(true);

        // Process the document
        const result = await analyzeInsurance({ schemeId, storageId });

        if (result.success && result.data) {
          setInsuranceData(result.data);
          setShowReview(true);
        } else {
          toast.error(result.error || "Failed to extract insurance data");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload document");
      } finally {
        setIsUploading(false);
        setIsProcessing(false);
      }
    },
    [generateUploadUrl, analyzeInsurance, schemeId]
  );

  const handleSave = async () => {
    if (!insuranceData || !uploadedStorageId) return;

    setIsSaving(true);

    try {
      const expiryTimestamp = insuranceData.expiryDate
        ? new Date(insuranceData.expiryDate).getTime()
        : undefined;

      await updateInsurance({
        schemeId,
        insurerName: insuranceData.insurerName || undefined,
        policyNumber: insuranceData.policyNumber || undefined,
        replacementValue: insuranceData.replacementValue
          ? BigInt(insuranceData.replacementValue)
          : undefined,
        expiryDate: expiryTimestamp,
      });

      await createExtractedDocument({
        schemeId,
        storageId: uploadedStorageId,
        fileName: uploadedFileName,
        vaultCategory: "insurance",
        extractedData: insuranceData,
        title: `Insurance Certificate - ${insuranceData.insurerName || "Unknown Insurer"}`,
      });

      toast.success("Insurance details saved");
      setShowReview(false);
      onComplete();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save insurance details");
    } finally {
      setIsSaving(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: isUploading || isProcessing,
  });

  const formatCurrency = (cents: number | null): string => {
    if (!cents) return "Not found";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(cents / 100);
  };

  return (
    <>
      <Card className="border-[#E8E4DE] shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 rounded-xl bg-[#FFF0EB] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-[#FF6B35]" />
          </div>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Upload Insurance Certificate
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            We&apos;ll automatically extract the key details using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-all duration-200
              ${isDragActive ? "border-[#FF6B35] bg-[#FFF0EB]" : "border-[#E8E4DE] hover:border-[#FF6B35]/50"}
              ${isUploading || isProcessing ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input {...getInputProps()} />

            {isUploading || isProcessing ? (
              <div className="space-y-3">
                <Loader2 className="h-10 w-10 mx-auto text-[#FF6B35] animate-spin" />
                <p className="text-sm text-muted-foreground">
                  {isUploading ? "Uploading..." : "Extracting details with AI..."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {isDragActive
                      ? "Drop your certificate here"
                      : "Drag and drop your insurance certificate"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF only, max 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isUploading || isProcessing}
              className="flex-1 py-5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              variant="ghost"
              onClick={onSkip}
              disabled={isUploading || isProcessing}
              className="flex-1 py-5 rounded-lg"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip for now
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            You can always upload this later from your dashboard
          </p>
        </CardContent>
      </Card>

      {/* Insurance Review Dialog */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              <Shield className="h-5 w-5 text-[#FF6B35]" />
              Review Extracted Data
            </DialogTitle>
            <DialogDescription>
              We extracted the following details. Review and confirm to save.
            </DialogDescription>
          </DialogHeader>

          {insuranceData && (
            <div className="space-y-4 py-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Insurer</Label>
                  <span className="text-sm font-medium">
                    {insuranceData.insurerName || (
                      <span className="text-amber-600">Not found</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Policy Number</Label>
                  <span className="text-sm font-medium">
                    {insuranceData.policyNumber || (
                      <span className="text-amber-600">Not found</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Replacement Value</Label>
                  <span className="text-sm font-medium">
                    {insuranceData.replacementValue ? (
                      formatCurrency(insuranceData.replacementValue)
                    ) : (
                      <span className="text-amber-600">Not found</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Expiry Date</Label>
                  <span className="text-sm font-medium">
                    {insuranceData.expiryDate || (
                      <span className="text-amber-600">Not found</span>
                    )}
                  </span>
                </div>
              </div>

              {(!insuranceData.insurerName ||
                !insuranceData.replacementValue ||
                !insuranceData.expiryDate) && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    Some fields could not be extracted. You can add these manually later.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReview(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save & Continue
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
