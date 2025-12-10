"use client";

import { useState, useCallback } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  Shield,
  Flame,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

type DocumentType = "insurance" | "afss" | "unknown";

interface ExtractedInsuranceData {
  insurerName: string | null;
  policyNumber: string | null;
  replacementValue: number | null;
  expiryDate: string | null;
  inceptionDate: string | null;
  strataPlanNumber: string | null;
}

interface ExtractedAfssData {
  afssDate: string | null;
  nextDueDate: string | null;
  buildingAddress: string | null;
  strataPlanNumber: string | null;
  certifierName: string | null;
  certifierLicenseNumber: string | null;
}

interface SmartDocumentUploadProps {
  schemeId: Id<"schemes">;
  onSuccess?: () => void;
}

export function SmartDocumentUpload({
  schemeId,
  onSuccess,
}: SmartDocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [uploadedStorageId, setUploadedStorageId] = useState<Id<"_storage"> | null>(null);

  // Insurance review dialog state
  const [showInsuranceReview, setShowInsuranceReview] = useState(false);
  const [insuranceData, setInsuranceData] = useState<ExtractedInsuranceData | null>(null);

  // AFSS review dialog state
  const [showAfssReview, setShowAfssReview] = useState(false);
  const [afssData, setAfssData] = useState<ExtractedAfssData | null>(null);

  // Track uploaded file name for document record
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  // Convex hooks
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const analyzeInsurance = useAction(api.actions.strataHub.analyzeInsuranceCertificate);
  const analyzeAfss = useAction(api.actions.strataHub.analyzeAfssCertificate);
  const updateInsurance = useMutation(api.strataHubCompliance.updateInsuranceDetails);
  const updateAfss = useMutation(api.strataHubCompliance.updateAfssDetails);
  // CH-0013: Create document record after extraction
  const createExtractedDocument = useMutation(api.documents.createExtractedDocument);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Check file type
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF document");
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setIsUploading(true);

      try {
        // 1. Get upload URL
        const uploadUrl = await generateUploadUrl();

        // 2. Upload file
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

        // 3. Auto-detect document type from filename
        const fileName = file.name.toLowerCase();
        let detectedType: DocumentType = "unknown";

        if (
          fileName.includes("insurance") ||
          fileName.includes("certificate of currency") ||
          fileName.includes("policy")
        ) {
          detectedType = "insurance";
        } else if (
          fileName.includes("afss") ||
          fileName.includes("fire safety") ||
          fileName.includes("fire statement")
        ) {
          detectedType = "afss";
        }

        if (detectedType === "unknown") {
          // Ask user to select type
          setSelectedType(null);
          toast.info("Please select the document type");
          setIsUploading(false);
          return;
        }

        setSelectedType(detectedType);
        await processDocument(storageId, detectedType);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload document");
        setIsUploading(false);
      }
    },
    [generateUploadUrl]
  );

  const processDocument = async (storageId: Id<"_storage">, type: DocumentType) => {
    setIsProcessing(true);

    try {
      if (type === "insurance") {
        const result = await analyzeInsurance({ schemeId, storageId });

        if (result.success && result.data) {
          setInsuranceData(result.data);
          setShowInsuranceReview(true);
        } else {
          toast.error(result.error || "Failed to extract insurance data");
        }
      } else if (type === "afss") {
        const result = await analyzeAfss({ schemeId, storageId });

        if (result.success && result.data) {
          setAfssData(result.data);
          setShowAfssReview(true);
        } else {
          toast.error(result.error || "Failed to extract fire safety data");
        }
      }
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Failed to process document");
    } finally {
      setIsProcessing(false);
      setIsUploading(false);
    }
  };

  const handleTypeSelect = async (type: DocumentType) => {
    if (!uploadedStorageId) return;
    setSelectedType(type);
    await processDocument(uploadedStorageId, type);
  };

  const handleSaveInsurance = async () => {
    if (!insuranceData || !uploadedStorageId) return;

    try {
      // Convert date strings to timestamps
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

      // CH-0013: Create document record with storageId and extractedData
      await createExtractedDocument({
        schemeId,
        storageId: uploadedStorageId,
        fileName: uploadedFileName,
        vaultCategory: "insurance",
        extractedData: insuranceData,
        title: `Insurance Certificate - ${insuranceData.insurerName || "Unknown Insurer"}`,
      });

      toast.success("Insurance details saved");
      setShowInsuranceReview(false);
      setInsuranceData(null);
      setUploadedStorageId(null);
      setUploadedFileName("");
      onSuccess?.();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save insurance details");
    }
  };

  const handleSaveAfss = async () => {
    if (!afssData || !uploadedStorageId) return;

    try {
      // Convert date strings to timestamps
      const afssTimestamp = afssData.afssDate
        ? new Date(afssData.afssDate).getTime()
        : undefined;
      const nextDueTimestamp = afssData.nextDueDate
        ? new Date(afssData.nextDueDate).getTime()
        : undefined;

      await updateAfss({
        schemeId,
        lastDate: afssTimestamp,
        nextDueDate: nextDueTimestamp,
        status: "current",
      });

      // CH-0013: Create document record with storageId and extractedData
      await createExtractedDocument({
        schemeId,
        storageId: uploadedStorageId,
        fileName: uploadedFileName,
        vaultCategory: "fire_safety",
        extractedData: afssData,
        title: `AFSS - ${afssData.afssDate || "Unknown Date"}`,
      });

      toast.success("Fire safety details saved");
      setShowAfssReview(false);
      setAfssData(null);
      setUploadedStorageId(null);
      setUploadedFileName("");
      onSuccess?.();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save fire safety details");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: isUploading || isProcessing,
  });

  // Format currency for display
  const formatCurrency = (cents: number | null): string => {
    if (!cents) return "Not found";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(cents / 100);
  };

  return (
    <>
      <Card className="bg-white border border-[#E8E4DE] rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FF6B35]" />
            <CardTitle className="text-base font-medium">
              Smart Document Upload
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload insurance certificates or AFSS documents to auto-extract data
          </p>
        </CardHeader>
        <CardContent className="pt-0">
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
                  {isUploading ? "Uploading..." : "Processing document with AI..."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {isDragActive
                      ? "Drop your document here"
                      : "Drag and drop a PDF, or click to browse"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Insurance certificates, AFSS documents (max 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Document type selector (shown when type is unknown) */}
          {uploadedStorageId && !selectedType && !isProcessing && (
            <div className="mt-4 p-4 bg-[#F8F5F0] rounded-lg">
              <p className="text-sm font-medium mb-3">Select document type:</p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleTypeSelect("insurance")}
                  className="flex-1"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Insurance Certificate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTypeSelect("afss")}
                  className="flex-1"
                >
                  <Flame className="h-4 w-4 mr-2" />
                  AFSS / Fire Safety
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insurance Review Dialog */}
      <Dialog open={showInsuranceReview} onOpenChange={setShowInsuranceReview}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              <Shield className="h-5 w-5 text-[#FF6B35]" />
              Review Extracted Insurance Data
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
                    Some fields could not be extracted. You may need to add these manually.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInsuranceReview(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveInsurance}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AFSS Review Dialog */}
      <Dialog open={showAfssReview} onOpenChange={setShowAfssReview}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              <Flame className="h-5 w-5 text-[#FF6B35]" />
              Review Extracted Fire Safety Data
            </DialogTitle>
            <DialogDescription>
              We extracted the following details. Review and confirm to save.
            </DialogDescription>
          </DialogHeader>

          {afssData && (
            <div className="space-y-4 py-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">AFSS Date</Label>
                  <span className="text-sm font-medium">
                    {afssData.afssDate || (
                      <span className="text-amber-600">Not found</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Next Due Date</Label>
                  <span className="text-sm font-medium">
                    {afssData.nextDueDate || (
                      <span className="text-amber-600">Not found</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Building Address</Label>
                  <span className="text-sm font-medium">
                    {afssData.buildingAddress || (
                      <span className="text-amber-600">Not found</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Certifier</Label>
                  <span className="text-sm font-medium">
                    {afssData.certifierName || (
                      <span className="text-amber-600">Not found</span>
                    )}
                  </span>
                </div>
              </div>

              {!afssData.afssDate && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    AFSS date could not be extracted. Please check the document.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAfssReview(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAfss} disabled={!afssData?.afssDate}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
