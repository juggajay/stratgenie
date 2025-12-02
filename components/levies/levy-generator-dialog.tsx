"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Loader2, ArrowRight, ArrowLeft, Check, Calculator, AlertCircle } from "lucide-react";

interface LevyGeneratorDialogProps {
  schemeId: Id<"schemes">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type Step = "input" | "preview" | "success";

function formatCurrency(cents: bigint | number): string {
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(dollars);
}

export function LevyGeneratorDialog({
  schemeId,
  open,
  onOpenChange,
  onSuccess,
}: LevyGeneratorDialogProps) {
  const [step, setStep] = useState<Step>("input");
  const [fundType, setFundType] = useState<"admin" | "capital_works">("admin");
  const [totalAmountDollars, setTotalAmountDollars] = useState("");
  const [periodLabel, setPeriodLabel] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preview data - no longer used as LevyPreviewTable fetches directly
  // Keeping minimal state for backward compatibility
  const [previewData, setPreviewData] = useState<{
    success: boolean;
    preview: Array<{
      lotId: string;
      lotNumber: string;
      ownerName: string;
      unitEntitlement: number;
      percentageShare: number;
      amount: bigint;
    }>;
    totalEntitlement: number;
    budgetCents: bigint;
    sumCents: bigint;
    balanced: boolean;
  } | null>(null);

  const totalEntitlement = useQuery(api.lots.getTotalUnitEntitlement, { schemeId });
  const createLevyRun = useMutation(api.levies.createLevyRun);

  const resetForm = () => {
    setStep("input");
    setFundType("admin");
    setTotalAmountDollars("");
    setPeriodLabel("");
    setDueDate("");
    setPeriodStart("");
    setPeriodEnd("");
    setPreviewData(null);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handlePreview = () => {
    setError(null);

    // Validate inputs
    const dollars = parseFloat(totalAmountDollars);
    if (isNaN(dollars) || dollars <= 0) {
      setError("Please enter a valid budget amount");
      return;
    }

    if (!periodLabel.trim()) {
      setError("Please enter a period label");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date");
      return;
    }

    if (!periodStart || !periodEnd) {
      setError("Please select period start and end dates");
      return;
    }

    if (!totalEntitlement || totalEntitlement.lotCount === 0) {
      setError("No lots registered. Please add lots to the strata roll first.");
      return;
    }

    // All validation passed - proceed to preview step
    // The LevyPreviewTable component will fetch the preview via Convex query
    setStep("preview");
  };

  const handleGenerate = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const dollars = parseFloat(totalAmountDollars);
      const cents = BigInt(Math.round(dollars * 100));

      if (!dueDate || !periodStart || !periodEnd || !periodLabel.trim()) {
        throw new Error("Please fill in all required fields");
      }

      await createLevyRun({
        schemeId,
        fundType,
        totalAmountCents: cents,
        periodLabel: periodLabel.trim(),
        periodStart: new Date(periodStart).getTime(),
        periodEnd: new Date(periodEnd).getTime(),
        dueDate: new Date(dueDate).getTime(),
      });

      setStep("success");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate levy run");
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedToPreview =
    totalAmountDollars &&
    parseFloat(totalAmountDollars) > 0 &&
    periodLabel.trim() &&
    dueDate &&
    periodStart &&
    periodEnd &&
    totalEntitlement &&
    totalEntitlement.lotCount > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        {step === "input" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Generate Levy Run
              </DialogTitle>
              <DialogDescription>
                Configure the levy parameters. The system will calculate each lot&apos;s share
                based on unit entitlements.
              </DialogDescription>
            </DialogHeader>

            {totalEntitlement?.lotCount === 0 && (
              <div className="flex items-center gap-2 p-3 text-amber-700 bg-amber-50 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">
                  No lots registered. Please add lots to the strata roll first.
                </span>
              </div>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fundType" className="text-right">
                  Fund Type
                </Label>
                <Select value={fundType} onValueChange={(v) => setFundType(v as "admin" | "capital_works")}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin Fund</SelectItem>
                    <SelectItem value="capital_works">Capital Works Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalAmount" className="text-right">
                  Total Budget
                </Label>
                <div className="col-span-3 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={totalAmountDollars}
                    onChange={(e) => setTotalAmountDollars(e.target.value)}
                    placeholder="10000.00"
                    className="pl-7"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="periodLabel" className="text-right">
                  Period Label
                </Label>
                <Input
                  id="periodLabel"
                  value={periodLabel}
                  onChange={(e) => setPeriodLabel(e.target.value)}
                  placeholder="Q1 2026"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Period</Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="flex-1"
                  />
                  <span className="flex items-center text-slate-400">to</span>
                  <Input
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>

            {totalEntitlement && totalEntitlement.lotCount > 0 && (
              <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-md">
                <span className="font-medium">{totalEntitlement.lotCount}</span> lots with{" "}
                <span className="font-medium">{totalEntitlement.total}</span> total unit entitlements
              </div>
            )}

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handlePreview} disabled={!canProceedToPreview || isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Preview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "preview" && (
          <>
            <DialogHeader>
              <DialogTitle>Preview Levy Distribution</DialogTitle>
              <DialogDescription>
                Review the calculated amounts before generating invoices.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {/* Summary */}
              <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-indigo-600">Fund Type:</span>{" "}
                    <span className="font-medium">
                      {fundType === "admin" ? "Admin Fund" : "Capital Works Fund"}
                    </span>
                  </div>
                  <div>
                    <span className="text-indigo-600">Period:</span>{" "}
                    <span className="font-medium">{periodLabel}</span>
                  </div>
                  <div>
                    <span className="text-indigo-600">Total Budget:</span>{" "}
                    <span className="font-bold text-lg">
                      {formatCurrency(parseFloat(totalAmountDollars) * 100)}
                    </span>
                  </div>
                  <div>
                    <span className="text-indigo-600">Due Date:</span>{" "}
                    <span className="font-medium">
                      {new Date(dueDate).toLocaleDateString("en-AU")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview Table */}
              <LevyPreviewTable
                schemeId={schemeId}
                totalAmountCents={BigInt(Math.round(parseFloat(totalAmountDollars) * 100))}
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("input")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleGenerate} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate & Issue
                <Check className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                Levy Run Created
              </DialogTitle>
              <DialogDescription>
                The levy run has been generated successfully. Invoices have been created for all lots.
              </DialogDescription>
            </DialogHeader>

            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-medium text-slate-900">
                {formatCurrency(parseFloat(totalAmountDollars) * 100)} {periodLabel}
              </p>
              <p className="text-sm text-slate-500">
                {fundType === "admin" ? "Admin Fund" : "Capital Works Fund"} levies generated
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Separate component for the preview table that uses Convex query
function LevyPreviewTable({
  schemeId,
  totalAmountCents,
}: {
  schemeId: Id<"schemes">;
  totalAmountCents: bigint;
}) {
  const preview = useQuery(api.levies.previewLevyRun, {
    schemeId,
    totalAmountCents,
  });

  if (!preview) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!preview.success) {
    return (
      <div className="p-3 text-sm text-amber-600 bg-amber-50 rounded-md">
        {preview.message || "Unable to generate preview"}
      </div>
    );
  }

  const sumCents = preview.preview.reduce((sum, p) => sum + BigInt(p.amount), 0n);

  return (
    <>
      <div className="rounded-md border max-h-[300px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Lot</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right w-[80px]">UE</TableHead>
              <TableHead className="text-right w-[80px]">Share</TableHead>
              <TableHead className="text-right w-[120px]">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {preview.preview.map((item) => (
              <TableRow key={item.lotId}>
                <TableCell className="font-medium">{item.lotNumber}</TableCell>
                <TableCell className="text-slate-600">{item.ownerName}</TableCell>
                <TableCell className="text-right font-mono">{item.unitEntitlement}</TableCell>
                <TableCell className="text-right font-mono text-slate-500">
                  {item.percentageShare.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {formatCurrency(item.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="font-medium">
                Total
              </TableCell>
              <TableCell className="text-right font-mono">100%</TableCell>
              <TableCell className="text-right font-mono font-bold text-lg">
                {formatCurrency(sumCents)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Balance verification */}
      <div className={`mt-3 p-3 rounded-md text-sm ${
        preview.balanced ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}>
        {preview.balanced ? (
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Sum of allocations matches budget exactly
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Warning: Sum does not match budget (difference: {formatCurrency(Number(sumCents) - Number(totalAmountCents))})
          </span>
        )}
      </div>
    </>
  );
}
