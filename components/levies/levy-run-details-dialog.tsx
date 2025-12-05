"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  FileText,
  CheckCircle,
  Clock,
  Send,
  DollarSign,
  Calendar,
} from "lucide-react";

interface LevyRunDetailsDialogProps {
  levyRunId: Id<"levyRuns"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatCurrency(cents: bigint | number): string {
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(dollars);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return (
        <Badge variant="default" className="gap-1 bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Paid
        </Badge>
      );
    case "sent":
      return (
        <Badge variant="default" className="gap-1 bg-blue-600">
          <Send className="h-3 w-3" />
          Sent
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
  }
}

function generateLevyNoticeHTML(
  invoice: {
    _id: Id<"levyInvoices">;
    amount: bigint;
    status: string;
    lot: {
      lotNumber: string;
      ownerName: string;
      ownerEmail: string;
      ownerAddress?: string;
      unitEntitlement: number;
      percentageShare: number;
    } | null;
  },
  levyRun: {
    fundType: string;
    periodLabel: string;
    dueDate: number;
    totalAmount: bigint;
  },
  schemeName: string
): string {
  const lot = invoice.lot;
  if (!lot) return "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Levy Notice - ${lot.lotNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      color: #1e293b;
    }
    .header {
      border-bottom: 3px solid #4f46e5;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 24px;
      color: #4f46e5;
      margin-bottom: 5px;
    }
    .header p {
      color: #64748b;
      font-size: 14px;
    }
    .notice-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 12px;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .owner-details {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    .owner-details p {
      margin-bottom: 5px;
    }
    .owner-name {
      font-size: 18px;
      font-weight: 600;
    }
    .amount-box {
      background: #4f46e5;
      color: white;
      padding: 25px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 25px;
    }
    .amount-label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 5px;
    }
    .amount {
      font-size: 36px;
      font-weight: 700;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 25px;
    }
    .detail-item {
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
    }
    .detail-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 5px;
    }
    .detail-value {
      font-size: 16px;
      font-weight: 600;
    }
    .due-date {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 25px;
    }
    .due-date-label {
      font-size: 12px;
      color: #92400e;
      margin-bottom: 5px;
    }
    .due-date-value {
      font-size: 18px;
      font-weight: 700;
      color: #92400e;
    }
    .calculation {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    .calculation-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .calculation-row:last-child {
      border-bottom: none;
      font-weight: 600;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #64748b;
      text-align: center;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${schemeName}</h1>
    <p>Strata Scheme Levy Notice</p>
  </div>

  <div class="notice-title">
    ${levyRun.fundType === "admin" ? "Administrative Fund" : "Capital Works Fund"} Levy Notice
  </div>

  <div class="section">
    <div class="section-title">Issued To</div>
    <div class="owner-details">
      <p class="owner-name">${lot.ownerName}</p>
      <p>Lot ${lot.lotNumber}</p>
      <p>${lot.ownerEmail}</p>
      ${lot.ownerAddress ? `<p>${lot.ownerAddress}</p>` : ""}
    </div>
  </div>

  <div class="amount-box">
    <div class="amount-label">Amount Due</div>
    <div class="amount">${formatCurrency(invoice.amount)}</div>
  </div>

  <div class="due-date">
    <div class="due-date-label">Payment Due By</div>
    <div class="due-date-value">${formatDate(levyRun.dueDate)}</div>
  </div>

  <div class="details-grid">
    <div class="detail-item">
      <div class="detail-label">Levy Period</div>
      <div class="detail-value">${levyRun.periodLabel}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">Fund Type</div>
      <div class="detail-value">${levyRun.fundType === "admin" ? "Admin Fund" : "Capital Works"}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Calculation Details</div>
    <div class="calculation">
      <div class="calculation-row">
        <span>Total Budget</span>
        <span>${formatCurrency(levyRun.totalAmount)}</span>
      </div>
      <div class="calculation-row">
        <span>Your Unit Entitlement</span>
        <span>${lot.unitEntitlement} UE</span>
      </div>
      <div class="calculation-row">
        <span>Your Share</span>
        <span>${lot.percentageShare.toFixed(2)}%</span>
      </div>
      <div class="calculation-row">
        <span>Your Contribution</span>
        <span>${formatCurrency(invoice.amount)}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>This notice was generated by Strata Manager on ${new Date().toLocaleDateString("en-AU")}</p>
    <p>Please retain this notice for your records.</p>
  </div>

  <div class="no-print" style="margin-top: 30px; text-align: center;">
    <button onclick="window.print()" style="
      background: #4f46e5;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
    ">Print / Save as PDF</button>
  </div>
</body>
</html>
`;
}

export function LevyRunDetailsDialog({
  levyRunId,
  open,
  onOpenChange,
}: LevyRunDetailsDialogProps) {
  const levyRunData = useQuery(
    api.levies.getLevyRunWithInvoices,
    levyRunId ? { levyRunId } : "skip"
  );
  const markPaid = useMutation(api.levies.markInvoicePaid);
  const markSent = useMutation(api.levies.markInvoiceSent);

  const handleDownloadPdf = (invoiceId: Id<"levyInvoices">) => {
    if (!levyRunData) return;

    const invoice = levyRunData.invoices.find((inv) => inv._id === invoiceId);
    if (!invoice || !invoice.lot) return;

    // Generate HTML and open in new window
    const html = generateLevyNoticeHTML(
      invoice as Parameters<typeof generateLevyNoticeHTML>[0],
      levyRunData,
      "Strata Scheme" // TODO: Get actual scheme name
    );

    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    }
  };

  const handleMarkPaid = async (invoiceId: Id<"levyInvoices">) => {
    try {
      await markPaid({ invoiceId });
    } catch (error) {
      console.error("Failed to mark as paid:", error);
    }
  };

  const handleMarkSent = async (invoiceId: Id<"levyInvoices">) => {
    try {
      await markSent({ invoiceId });
    } catch (error) {
      console.error("Failed to mark as sent:", error);
    }
  };

  const isLoading = levyRunId && !levyRunData;

  // Calculate totals
  const totalAmount = levyRunData?.invoices.reduce(
    (sum, inv) => sum + BigInt(inv.amount),
    0n
  ) ?? 0n;
  const paidAmount = levyRunData?.invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + BigInt(inv.amount), 0n) ?? 0n;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Levy Run Details
          </DialogTitle>
          {levyRunData && (
            <DialogDescription>
              {levyRunData.fundType === "admin" ? "Admin Fund" : "Capital Works Fund"} -{" "}
              {levyRunData.periodLabel}
            </DialogDescription>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : levyRunData ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-500 mb-1">Total Budget</div>
                <div className="text-xl font-bold">
                  {formatCurrency(levyRunData.totalAmount)}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 mb-1">Collected</div>
                <div className="text-xl font-bold text-green-700">
                  {formatCurrency(paidAmount)}
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="text-sm text-amber-600 mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Due Date
                </div>
                <div className="text-lg font-bold text-amber-700">
                  {formatDate(levyRunData.dueDate)}
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="flex-1 overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[70px]">Lot</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right w-[100px]">Amount</TableHead>
                    <TableHead className="text-center w-[100px]">Status</TableHead>
                    <TableHead className="w-[180px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {levyRunData.invoices.map((invoice) => (
                    <TableRow key={invoice._id}>
                      <TableCell className="font-medium">
                        {invoice.lot?.lotNumber ?? "—"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.lot?.ownerName ?? "Unknown"}</div>
                          <div className="text-sm text-slate-500">
                            {invoice.lot?.ownerEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {formatCurrency(invoice.amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(invoice.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPdf(invoice._id)}
                            className="h-8 text-xs"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Notice
                          </Button>
                          {invoice.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkSent(invoice._id)}
                              className="h-8 text-xs"
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Sent
                            </Button>
                          )}
                          {invoice.status !== "paid" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkPaid(invoice._id)}
                              className="h-8 text-xs text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Paid
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-medium">
                      Total ({levyRunData.invoices.length} invoices)
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      {formatCurrency(totalAmount)}
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            No levy run selected
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
