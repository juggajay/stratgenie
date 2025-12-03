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
  { value: "insurance", label: "Insurance" },
  { value: "utilities", label: "Utilities" },
  { value: "admin", label: "Administration" },
  { value: "cleaning", label: "Cleaning" },
  { value: "gardening", label: "Gardening" },
  { value: "legal", label: "Legal" },
  { value: "other", label: "Other" },
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
        category: category as typeof CATEGORIES[number]["value"] | undefined,
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
        category: category as typeof CATEGORIES[number]["value"] | undefined,
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
      <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-600" />
                Review Invoice
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-0.5">
                {isDraft
                  ? "Verify the extracted data and approve or make corrections"
                  : "Viewing approved transaction"}
              </DialogDescription>
            </div>
            {transaction && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  transaction.status === "draft"
                    ? "bg-amber-100 text-amber-700"
                    : transaction.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
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
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="flex-1 min-h-0 grid grid-cols-[2fr_1fr] overflow-hidden">
            {/* Left: Invoice Preview */}
            <div className="border-r border-slate-200 bg-slate-50 flex flex-col min-h-0">
              <div className="px-4 py-2 bg-white border-b border-slate-200 flex-shrink-0">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {invoice?.fileName}
                </p>
              </div>
              <div className="flex-1 min-h-0 overflow-auto">
                {invoice?.fileUrl ? (
                  isPdf ? (
                    <iframe
                      src={invoice.fileUrl}
                      className="w-full h-full min-h-[500px] bg-white"
                      title="Invoice Preview"
                    />
                  ) : (
                    <div className="relative w-full min-h-[500px] bg-white">
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
                  <div className="flex items-center justify-center h-full min-h-[500px] text-slate-500">
                    Unable to load preview
                  </div>
                )}
              </div>
            </div>

            {/* Right: Form */}
            <div className="flex flex-col min-h-0 bg-white">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-5">
                  {/* Vendor Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="vendorName" className="text-sm font-medium text-slate-700">
                      Vendor Name
                    </Label>
                    <Input
                      id="vendorName"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      placeholder="e.g. ABC Plumbing"
                      className="rounded-lg border-slate-300"
                      disabled={!isDraft}
                    />
                  </div>

                  {/* Invoice Date */}
                  <div className="space-y-1.5">
                    <Label htmlFor="invoiceDate" className="text-sm font-medium text-slate-700">
                      Invoice Date
                    </Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="rounded-lg border-slate-300"
                      disabled={!isDraft}
                    />
                  </div>

                  {/* Amount & GST */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="amount" className="text-sm font-medium text-slate-700">
                        Total Amount (inc GST)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
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
                          className="rounded-lg border-slate-300 pl-7"
                          disabled={!isDraft}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="gst" className="text-sm font-medium text-slate-700">
                        GST Amount
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
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
                          className="rounded-lg border-slate-300 pl-7"
                          disabled={!isDraft}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-sm font-medium text-slate-700">
                      Category
                    </Label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      disabled={!isDraft}
                    >
                      <SelectTrigger className="rounded-lg border-slate-300">
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

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of the expense"
                      className="rounded-lg border-slate-300"
                      disabled={!isDraft}
                    />
                  </div>

                  {/* Original AI Extraction */}
                  {transaction?.originalExtraction && (
                    <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                        Original AI Extraction
                      </p>
                      <div className="text-sm text-slate-600 space-y-1">
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
          <div className="mx-6 mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 flex-shrink-0">
          <div className="flex gap-3">
            {invoice?.fileUrl && (
              <Button
                variant="outline"
                onClick={() => window.open(invoice.fileUrl!, "_blank")}
                className="rounded-lg border-slate-300 text-slate-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Invoice
              </Button>
            )}
            {isDraft && (
              <Button
                variant="outline"
                onClick={handleReject}
                className="rounded-lg border-red-300 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border-slate-300 text-slate-700"
            >
              {isDraft ? "Cancel" : "Close"}
            </Button>

            {isDraft && (
              <>
                <Button
                  variant="outline"
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="rounded-lg border-slate-300 text-slate-700"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Save Changes
                </Button>

                <Button
                  onClick={handleApprove}
                  disabled={isApproving || !amount}
                  className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg"
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
              </>
            )}

            {isApproved && (
              <Button
                onClick={handleMarkPaid}
                disabled={isMarkingPaid}
                className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg"
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
