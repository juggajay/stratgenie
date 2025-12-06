"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, Receipt, Eye, ChevronRight } from "lucide-react";

interface TransactionListProps {
  schemeId: Id<"schemes">;
  status?: "draft" | "approved" | "paid";
  title?: string;
  description?: string;
  onReviewTransaction?: (invoiceId: Id<"invoices">, transactionId: Id<"transactions">) => void;
  emptyMessage?: string;
}

// Helper to convert cents to dollars for display
function formatCurrency(cents: bigint | number): string {
  const num = typeof cents === "bigint" ? Number(cents) : cents;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(num / 100);
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const statusConfig = {
  draft: {
    label: "Pending Review",
    pillClass: "status-warning",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    pillClass: "status-success",
    icon: CheckCircle2,
  },
  paid: {
    label: "Paid",
    pillClass: "status-info",
    icon: Receipt,
  },
};

function StatusPill({ status }: { status: "draft" | "approved" | "paid" }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${config.pillClass}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export function TransactionList({
  schemeId,
  status,
  title = "Transactions",
  description,
  onReviewTransaction,
  emptyMessage = "No transactions yet",
}: TransactionListProps) {
  const transactions = useQuery(api.finance.listTransactionsForScheme, {
    schemeId,
    status,
  });

  const isLoading = transactions === undefined;

  return (
    <Card className="card-accent">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <CardDescription>
                {description}
              </CardDescription>
            )}
          </div>
          {transactions && transactions.length > 0 && (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-secondary px-2.5 py-1 rounded">
              {transactions.length} {transactions.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse flex items-center justify-between p-3 bg-secondary rounded-lg"
              >
                <div className="space-y-2">
                  <div className="h-4 bg-border rounded w-32"></div>
                  <div className="h-3 bg-border rounded w-24"></div>
                </div>
                <div className="h-4 bg-border rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">
                      {transaction.vendorName || "Unknown Vendor"}
                    </p>
                    <StatusPill status={transaction.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{formatDate(transaction.invoiceDate)}</span>
                    {transaction.category && (
                      <>
                        <span className="text-border">•</span>
                        <span className="capitalize">{transaction.category}</span>
                      </>
                    )}
                    {transaction.description && (
                      <>
                        <span className="text-border">•</span>
                        <span className="truncate max-w-[200px]">
                          {transaction.description}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right">
                    <p className="font-semibold text-treasurer">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      GST: {formatCurrency(transaction.gst)}
                    </p>
                  </div>

                  {onReviewTransaction && transaction.invoiceId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onReviewTransaction(transaction.invoiceId!, transaction._id)
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {transaction.status === "draft" ? "Review" : "View"}
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-10 w-10 mx-auto mb-3 text-border" />
            <p>{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Compact version for dashboard indicators
export function PendingTransactionsBadge({ schemeId }: { schemeId: Id<"schemes"> }) {
  const counts = useQuery(api.finance.getTransactionCounts, { schemeId });

  if (!counts || counts.draft === 0) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 status-warning rounded">
      <Clock className="h-4 w-4" />
      <span className="text-sm font-medium">
        {counts.draft} pending {counts.draft === 1 ? "invoice" : "invoices"}
      </span>
    </div>
  );
}
