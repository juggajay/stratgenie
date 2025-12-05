"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { FileText, Loader2, Check, X, AlertCircle, ExternalLink } from "lucide-react";

interface InvoiceReviewDialogProps {
  invoiceId: Id<"invoices"> | null;
  transactionId: Id<"transactions"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApproved?: () => void;
}

const CATEGORIES = [
  { value: "repairs", label: "Repairs & Maintenance" },
  { value: "repairs_maintenance", label: "Repairs (Capital)" },
  { value: "insurance", label: "Insurance" },
  { value: "utilities", label: "Utilities" },
  { value: "admin", label: "Administration" },
  { value: "cleaning", label: "Cleaning" },
  { value: "gardening", label: "Gardening" },
  { value: "legal", label: "Legal" },
  { value: "management_fees", label: "Management Fees" },
  { value: "major_works", label: "Major Works (Capital)" },
  { value: "other", label: "Other" },
] as const;

const FUNDS = [
  { value: "admin", label: "Administrative Fund" },
  { value: "capital_works", label: "Capital Works Fund" },
] as const;

// Helper functions for cent/dollar conversion
function centsToDollars(cents: bigint | number | undefined): string {
  if (cents === undefined) return "";
  const num = typeof cents === "bigint" ? Number(cents) : cents;
  return (num / 100).toFixed(2);
}

function dollarsToCents(dollars: string): bigint {
  const num = parseFloat(dollars) || 0;
  return BigInt(Math.round(num * 100));
}

export function InvoiceReviewDialog({
  invoiceId,
  transactionId,
  open,
  onOpenChange,
  onApproved,
}: InvoiceReviewDialogProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [vendorName, setVendorName] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [amount, setAmount] = useState("");
  const [gst, setGst] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [fund, setFund] = useState<string>("");

  const invoice = useQuery(
    api.finance.getInvoice,
    invoiceId ? { invoiceId } : "skip"
  );

  const transaction = useQuery(
    api.finance.getTransaction,
    transactionId ? { transactionId } : "skip"
  );

  const updateTransaction = useMutation(api.finance.updateTransaction);
  const approveTransaction = useMutation(api.finance.approveTransaction);
  const deleteTransaction = useMutation(api.finance.deleteTransaction);
  const markPaid = useMutation(api.finance.markTransactionPaid);

  // Populate form when transaction loads
  useEffect(() => {
    if (transaction) {
      setVendorName(transaction.vendorName || "");
      setInvoiceDate(transaction.invoiceDate || "");
      setAmount(centsToDollars(transaction.amount));
      setGst(centsToDollars(transaction.gst));
      setDescription(transaction.description || "");
      setCategory(transaction.category || "");
      setFund(transaction.fund || "");
    }
  }, [transaction]);

  const handleUpdate = async () => {
    if (!transactionId) return;

    setIsUpdating(true);
    setError(null);

    try {
      await updateTransaction({
        transactionId,
        vendorName: vendorName || undefined,
        invoiceDate: invoiceDate || undefined,
        amount: dollarsToCents(amount),
        gst: dollarsToCents(gst),
        description: description || "Invoice expense",
        category: category ? (category as typeof CATEGORIES[number]["value"]) : undefined,
        fund: fund ? (fund as typeof FUNDS[number]["value"]) : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleApprove = async () => {
    if (!transactionId) return;

    setIsApproving(true);
    setError(null);

    try {
      // First update with any changes
      await updateTransaction({
        transactionId,
        vendorName: vendorName || undefined,
        invoiceDate: invoiceDate || undefined,
        amount: dollarsToCents(amount),
        gst: dollarsToCents(gst),
        description: description || "Invoice expense",
        category: category ? (category as typeof CATEGORIES[number]["value"]) : undefined,
        fund: fund ? (fund as typeof FUNDS[number]["value"]) : undefined,
      });

      // Then approve
      await approveTransaction({ transactionId });
      onApproved?.();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!transactionId) return;

    setError(null);

    try {
      await deleteTransaction({ transactionId });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleMarkPaid = async () => {
    if (!transactionId) return;

    setIsMarkingPaid(true);
    setError(null);

    try {
      await markPaid({ transactionId });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as paid");
    } finally {
      setIsMarkingPaid(false);
    }
  };

  const isLoading = !invoice || !transaction;
  const isDraft = transaction?.status === "draft";
  const isApproved = transaction?.status === "approved";
  const isPdf = invoice?.fileName?.toLowerCase().endsWith(".pdf");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-card border border-border">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0 bg-gradient-to-r from-treasurer/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-foreground font-display">
                <div className="p-1.5 bg-treasurer/10 rounded-lg border border-treasurer/30">
                  <FileText className="h-4 w-4 text-treasurer" />
                </div>
                Review Invoice
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                {isDraft
                  ? "Verify the extracted data and approve or make corrections"
                  : "Viewing approved transaction"}
              </DialogDescription>
            </div>
            {transaction && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  transaction.status === "draft"
                    ? "status-warning"
                    : transaction.status === "approved"
                    ? "status-success"
                    : "status-info"
                }`}
              >
                {transaction.status === "draft" && "Pending Review"}
                {transaction.status === "approved" && (
                  <>
                    <Check className="h-3 w-3" />
                    Approved
                  </>
                )}
                {transaction.status === "paid" && "Paid"}
              </span>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-treasurer" />
          </div>
        ) : (
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[2fr_1fr] overflow-hidden">
            {/* Left: Invoice Preview */}
            <div className="border-b lg:border-b-0 lg:border-r border-border bg-secondary/30 flex flex-col min-h-0">
              <div className="px-4 py-2 bg-secondary border-b border-border flex-shrink-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {invoice?.fileName}
                </p>
              </div>
              <div className="flex-1 min-h-0 overflow-auto">
                {invoice?.fileUrl ? (
                  isPdf ? (
                    <iframe
                      src={invoice.fileUrl}
                      className="w-full h-full min-h-[300px] lg:min-h-[500px] bg-white"
                      title="Invoice Preview"
                    />
                  ) : (
                    <div className="relative w-full min-h-[300px] lg:min-h-[500px] bg-white">
                      <Image
                        src={invoice.fileUrl}
                        alt="Invoice"
                        fill
                        className="object-contain p-4"
                        unoptimized
                      />
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[300px] lg:min-h-[500px] text-muted-foreground">
                    Unable to load preview
                  </div>
                )}
              </div>
            </div>

            {/* Right: Form */}
            <div className="flex flex-col min-h-0 bg-card">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-5">
                  {/* Vendor Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="vendorName">
                      Vendor Name
                    </Label>
                    <Input
                      id="vendorName"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      placeholder="e.g. ABC Plumbing"
                      disabled={!isDraft}
                    />
                  </div>

                  {/* Invoice Date */}
                  <div className="space-y-1.5">
                    <Label htmlFor="invoiceDate">
                      Invoice Date
                    </Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      disabled={!isDraft}
                    />
                  </div>

                  {/* Amount & GST */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="amount">
                        Total Amount (inc GST)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          min="0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="pl-7"
                          disabled={!isDraft}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="gst">
                        GST Amount
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="gst"
                          type="number"
                          step="0.01"
                          min="0"
                          value={gst}
                          onChange={(e) => setGst(e.target.value)}
                          placeholder="0.00"
                          className="pl-7"
                          disabled={!isDraft}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <Label htmlFor="category">
                      Category
                    </Label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      disabled={!isDraft}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fund */}
                  <div className="space-y-1.5">
                    <Label htmlFor="fund">
                      Fund
                    </Label>
                    <Select
                      value={fund}
                      onValueChange={setFund}
                      disabled={!isDraft}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fund" />
                      </SelectTrigger>
                      <SelectContent>
                        {FUNDS.map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="description">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of the expense"
                      disabled={!isDraft}
                    />
                  </div>

                  {/* Original AI Extraction */}
                  {transaction?.originalExtraction && (
                    <div className="mt-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
                        Original AI Extraction
                      </p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          Amount: ${centsToDollars(transaction.originalExtraction.totalAmount)}
                        </p>
                        <p>GST: ${centsToDollars(transaction.originalExtraction.taxAmount)}</p>
                        {transaction.originalExtraction.vendorName && (
                          <p>Vendor: {transaction.originalExtraction.vendorName}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 bg-secondary/30 flex-shrink-0">
          <div className="flex gap-3 w-full sm:w-auto">
            {invoice?.fileUrl && (
              <Button
                variant="outline"
                onClick={() => window.open(invoice.fileUrl!, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Invoice
              </Button>
            )}
            {isDraft && (
              <Button
                variant="destructive"
                onClick={handleReject}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            )}
          </div>

          <div className="flex gap-3 w-full sm:w-auto justify-end">
            {!isDraft && (
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            )}

            {isDraft && (
              <Button
                variant="success"
                onClick={handleApprove}
                disabled={isApproving || !amount}
                className="min-w-[140px]"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Approve Invoice
                  </>
                )}
              </Button>
            )}

            {isApproved && (
              <Button
                variant="success"
                onClick={handleMarkPaid}
                disabled={isMarkingPaid}
              >
                {isMarkingPaid ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Marking Paid...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
