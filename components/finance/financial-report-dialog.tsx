"use client";

import { useState, useEffect } from "react";
import { useAction } from "convex/react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Loader2,
  Download,
  AlertTriangle,
  CheckCircle2,
  Save,
} from "lucide-react";
import dynamic from "next/dynamic";
import {
  FinancialStatementPDF,
  type FinancialStatementData,
} from "./financial-statement-pdf";
import { getAvailableFinancialYears } from "@/convex/lib/financialReporting";

// Dynamic import for PDF components (client-side only)
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div> }
);

const BlobProvider = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.BlobProvider),
  { ssr: false }
);

// ============================================================================
// Types
// ============================================================================

interface FinancialReportDialogProps {
  schemeId: Id<"schemes">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

interface ValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

// ============================================================================
// Component
// ============================================================================

export function FinancialReportDialog({
  schemeId,
  open,
  onOpenChange,
  onSaved,
}: FinancialReportDialogProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [reportData, setReportData] = useState<FinancialStatementData | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const generateReportData = useAction(api.actions.reporting.generateStatutoryReportData);
  const validateReport = useAction(api.actions.reporting.validateReportRequirements);
  const saveToVault = useAction(api.actions.reporting.saveReportToVault);

  // Get available financial years
  const availableYears = getAvailableFinancialYears();

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      // Default to current financial year
      if (!selectedYear && availableYears.length > 0) {
        setSelectedYear(availableYears[0].year);
      }
      setReportData(null);
      setValidation(null);
      setError(null);
      setSuccessMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Generate report when year changes
  useEffect(() => {
    if (selectedYear && open) {
      handleGenerateReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const handleGenerateReport = async () => {
    if (!selectedYear) return;

    setIsGenerating(true);
    setError(null);
    setValidation(null);
    setReportData(null);

    try {
      // Validate first
      const validationResult = await validateReport({
        schemeId,
        financialYear: selectedYear,
      });
      setValidation(validationResult);

      if (!validationResult.valid) {
        setError("Cannot generate report due to validation errors.");
        return;
      }

      // Generate report data
      const data = await generateReportData({
        schemeId,
        financialYear: selectedYear,
      });
      setReportData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToVault = async () => {
    if (!reportData) return;

    setIsSaving(true);
    setError(null);

    try {
      // Create a simple HTML representation for document storage
      const htmlContent = `
<!DOCTYPE html>
<html>
<head><title>${reportData.schemeName} - Financial Report ${reportData.financialYear}</title></head>
<body>
  <h1>Statement of Key Financial Information</h1>
  <h2>${reportData.schemeName} (${reportData.strataNumber})</h2>
  <p>Financial Year: ${reportData.financialYear}</p>
  <p>Period: ${reportData.periodStart} to ${reportData.periodEnd}</p>
  <hr/>
  <h3>Administrative Fund</h3>
  <p>Opening Balance: $${(reportData.adminFund.openingBalance / 100).toFixed(2)}</p>
  <p>Total Income: $${(reportData.adminFund.totalIncome / 100).toFixed(2)}</p>
  <p>Total Expenditure: $${(reportData.adminFund.totalExpenditure / 100).toFixed(2)}</p>
  <p><strong>Closing Balance: $${(reportData.adminFund.closingBalance / 100).toFixed(2)}</strong></p>
  <hr/>
  <h3>Capital Works Fund</h3>
  <p>Opening Balance: $${(reportData.capitalWorksFund.openingBalance / 100).toFixed(2)}</p>
  <p>Total Income: $${(reportData.capitalWorksFund.totalIncome / 100).toFixed(2)}</p>
  <p>Total Expenditure: $${(reportData.capitalWorksFund.totalExpenditure / 100).toFixed(2)}</p>
  <p><strong>Closing Balance: $${(reportData.capitalWorksFund.closingBalance / 100).toFixed(2)}</strong></p>
  <hr/>
  <p><em>Generated: ${reportData.generatedDate}</em></p>
</body>
</html>`;

      await saveToVault({
        schemeId,
        financialYear: reportData.financialYear,
        htmlContent,
      });

      setSuccessMessage("Report saved to Compliance Vault!");
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save report");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col bg-slate-900 border-white/10">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-cyan-400" />
                Generate Financial Report
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-400">
                Generate a Statement of Key Financial Information for your AGM.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Financial Year Selector */}
        <div className="flex items-center gap-4 py-4 border-b border-white/10">
          <label className="text-sm font-medium text-slate-300">
            Financial Year:
          </label>
          <Select
            value={selectedYear?.toString() || ""}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[180px] bg-slate-800/80 border-white/10 text-white">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/10">
              {availableYears.map((fy) => (
                <SelectItem
                  key={fy.year}
                  value={fy.year.toString()}
                  className="text-slate-200 focus:bg-slate-700 focus:text-white"
                >
                  {fy.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating report...
            </div>
          )}
        </div>

        {/* Validation Warnings */}
        {validation && validation.warnings.length > 0 && (
          <div className="bg-amber-900/20 border border-amber-500/50 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-400">Warnings</p>
                <ul className="mt-1 text-sm text-amber-300/80 list-disc list-inside">
                  {validation.warnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <p className="text-sm text-emerald-400">{successMessage}</p>
            </div>
          </div>
        )}

        {/* PDF Preview Area */}
        <div className="flex-1 min-h-0 mt-4 border border-white/10 rounded-lg overflow-hidden bg-slate-800/50">
          {reportData ? (
            <PDFViewer
              style={{ width: "100%", height: "100%", border: "none" }}
              showToolbar={false}
            >
              <FinancialStatementPDF data={reportData} />
            </PDFViewer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating report...
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-slate-600" />
                  <p>Select a financial year to generate report</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center gap-3 pt-4 border-t border-white/10 mt-4 flex-shrink-0">
          <div className="text-sm text-slate-400">
            {reportData && (
              <span>
                {reportData.transactionCount} transactions included
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
            >
              Close
            </Button>

            {reportData && (
              <BlobProvider document={<FinancialStatementPDF data={reportData} />}>
                {({ url, loading }) => (
                  <Button
                    variant="outline"
                    disabled={loading || !url}
                    className="rounded-lg border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                    onClick={() => {
                      if (url) {
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `Financial_Report_${reportData.financialYear.replace(/\s/g, "_")}_${reportData.strataNumber}.pdf`;
                        link.click();
                      }
                    }}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download PDF
                  </Button>
                )}
              </BlobProvider>
            )}

            <Button
              onClick={handleSaveToVault}
              disabled={!reportData || isSaving}
              className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-lg shadow-cyan-600/20"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save to Vault
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
