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
import { toast } from "sonner";
import {
  Upload,
  Shield,
  Flame,
  Receipt,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

type DocumentType = "insurance" | "afss" | "invoice" | "unknown";

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

interface DashboardUploadZoneProps {
  schemeId: Id<"schemes">;
  onSuccess?: () => void;
}

export function DashboardUploadZone({ schemeId, onSuccess }: DashboardUploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [uploadedStorageId, setUploadedStorageId] = useState<Id<"_storage"> | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Insurance review
  const [showInsuranceReview, setShowInsuranceReview] = useState(false);
  const [insuranceData, setInsuranceData] = useState<ExtractedInsuranceData | null>(null);

  // AFSS review
  const [showAfssReview, setShowAfssReview] = useState(false);
  const [afssData, setAfssData] = useState<ExtractedAfssData | null>(null);

  // Convex hooks
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const analyzeInsurance = useAction(api.actions.strataHub.analyzeInsuranceCertificate);
  const analyzeAfss = useAction(api.actions.strataHub.analyzeAfssCertificate);
  const updateInsurance = useMutation(api.strataHubCompliance.updateInsuranceDetails);
  const updateAfss = useMutation(api.strataHubCompliance.updateAfssDetails);
  const createExtractedDocument = useMutation(api.documents.createExtractedDocument);
  const createInvoice = useMutation(api.finance.createInvoice);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const isPdf = file.type === "application/pdf";
      const isImage = file.type.startsWith("image/");

      if (!isPdf && !isImage) {
        toast.error("Please upload a PDF or image file");
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

        if (!response.ok) throw new Error("Upload failed");

        const { storageId } = await response.json();
        setUploadedStorageId(storageId);
        setUploadedFileName(file.name);

        // Auto-detect document type
        const fileName = file.name.toLowerCase();
        let detectedType: DocumentType = "unknown";

        if (fileName.includes("insurance") || fileName.includes("policy") || fileName.includes("certificate of currency")) {
          detectedType = "insurance";
        } else if (fileName.includes("afss") || fileName.includes("fire safety") || fileName.includes("fire statement")) {
          detectedType = "afss";
        } else if (fileName.includes("invoice") || fileName.includes("receipt") || fileName.includes("tax")) {
          detectedType = "invoice";
        }

        if (detectedType === "unknown") {
          setSelectedType(null);
          toast.info("Select the document type to continue");
          setIsUploading(false);
          return;
        }

        setSelectedType(detectedType);
        await processDocument(storageId, detectedType, file.name);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload document");
        setIsUploading(false);
      }
    },
    [generateUploadUrl]
  );

  const processDocument = async (storageId: Id<"_storage">, type: DocumentType, fileName: string) => {
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
      } else if (type === "invoice") {
        // Create invoice for processing
        await createInvoice({ schemeId, fileId: storageId, fileName });
        toast.success("Invoice uploaded! Processing in background...");
        resetState();
        onSuccess?.();
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
    await processDocument(uploadedStorageId, type, uploadedFileName);
  };

  const handleSaveInsurance = async () => {
    if (!insuranceData || !uploadedStorageId) return;

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

      toast.success("Insurance details saved!");
      resetState();
      onSuccess?.();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save insurance details");
    }
  };

  const handleSaveAfss = async () => {
    if (!afssData || !uploadedStorageId) return;

    try {
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

      await createExtractedDocument({
        schemeId,
        storageId: uploadedStorageId,
        fileName: uploadedFileName,
        vaultCategory: "fire_safety",
        extractedData: afssData,
        title: `AFSS - ${afssData.afssDate || "Unknown Date"}`,
      });

      toast.success("Fire safety details saved!");
      resetState();
      onSuccess?.();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save fire safety details");
    }
  };

  const resetState = () => {
    setShowInsuranceReview(false);
    setShowAfssReview(false);
    setInsuranceData(null);
    setAfssData(null);
    setUploadedStorageId(null);
    setUploadedFileName("");
    setSelectedType(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
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
      <Card className="bg-white border border-[#E8E4DE] rounded-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FF6B35]" />
            <CardTitle className="text-sm font-medium">Quick Upload</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
              transition-all duration-200
              ${isDragActive ? "border-[#FF6B35] bg-[#FFF0EB]" : "border-[#E8E4DE] hover:border-[#FF6B35]/50"}
              ${isUploading || isProcessing ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input {...getInputProps()} />

            {isUploading || isProcessing ? (
              <div className="space-y-2 py-2">
                <Loader2 className="h-6 w-6 mx-auto text-[#FF6B35] animate-spin" />
                <p className="text-xs text-muted-foreground">
                  {isUploading ? "Uploading..." : "Processing with AI..."}
                </p>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Drop insurance, AFSS, or invoices
                </p>
              </div>
            )}
          </div>

          {/* Type selector */}
          {uploadedStorageId && !selectedType && !isProcessing && (
            <div className="mt-3 p-3 bg-[#F8F5F0] rounded-lg">
              <p className="text-xs font-medium mb-2">Select document type:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTypeSelect("insurance")}
                  className="text-xs"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Insurance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTypeSelect("afss")}
                  className="text-xs"
                >
                  <Flame className="h-3 w-3 mr-1" />
                  AFSS
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTypeSelect("invoice")}
                  className="text-xs"
                >
                  <Receipt className="h-3 w-3 mr-1" />
                  Invoice
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
              Review Extracted Data
            </DialogTitle>
            <DialogDescription>
              Confirm the extracted insurance details.
            </DialogDescription>
          </DialogHeader>

          {insuranceData && (
            <div className="space-y-4 py-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Insurer</Label>
                  <span className="text-sm font-medium">
                    {insuranceData.insurerName || <span className="text-amber-600">Not found</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Replacement Value</Label>
                  <span className="text-sm font-medium">
                    {insuranceData.replacementValue ? formatCurrency(insuranceData.replacementValue) : <span className="text-amber-600">Not found</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Expiry Date</Label>
                  <span className="text-sm font-medium">
                    {insuranceData.expiryDate || <span className="text-amber-600">Not found</span>}
                  </span>
                </div>
              </div>

              {(!insuranceData.insurerName || !insuranceData.replacementValue) && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    Some fields could not be extracted.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInsuranceReview(false)}>Cancel</Button>
            <Button onClick={handleSaveInsurance}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save
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
              Review Fire Safety Data
            </DialogTitle>
            <DialogDescription>
              Confirm the extracted AFSS details.
            </DialogDescription>
          </DialogHeader>

          {afssData && (
            <div className="space-y-4 py-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">AFSS Date</Label>
                  <span className="text-sm font-medium">
                    {afssData.afssDate || <span className="text-amber-600">Not found</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Next Due</Label>
                  <span className="text-sm font-medium">
                    {afssData.nextDueDate || <span className="text-amber-600">Not found</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Certifier</Label>
                  <span className="text-sm font-medium">
                    {afssData.certifierName || <span className="text-amber-600">Not found</span>}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAfssReview(false)}>Cancel</Button>
            <Button onClick={handleSaveAfss} disabled={!afssData?.afssDate}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
