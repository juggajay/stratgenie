"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SchemeSelector } from "@/components/dashboard/scheme-selector";
import { InvoiceUploadZone } from "@/components/finance/invoice-upload-zone";
import { InvoiceReviewDialog } from "@/components/finance/invoice-review-dialog";
import { TransactionList, PendingTransactionsBadge } from "@/components/finance/transaction-list";
import { LevyRunsList } from "@/components/levies/levy-runs-list";
import { StrataRollList } from "@/components/levies/strata-roll-list";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ArrowLeft,
  Receipt,
  AlertCircle,
  X,
  Building,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

function FailedInvoicesSection({ schemeId }: { schemeId: Id<"schemes"> }) {
  const invoices = useQuery(api.finance.listInvoicesForScheme, { schemeId });
  const deleteInvoice = useMutation(api.finance.deleteInvoice);

  const failedInvoices = invoices?.filter((inv) => inv.status === "failed") || [];

  if (failedInvoices.length === 0) return null;

  const handleDismiss = async (invoiceId: Id<"invoices">) => {
    try {
      await deleteInvoice({ invoiceId });
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    }
  };

  return (
    <div className="space-y-3">
      {failedInvoices.map((invoice) => (
        <Alert key={invoice._id} variant="destructive" className="relative">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="pr-8">Upload Failed: {invoice.fileName}</AlertTitle>
          <AlertDescription>
            {invoice.errorMessage || "An unknown error occurred during processing."}
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDismiss(invoice._id)}
            className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-200"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </Alert>
      ))}
    </div>
  );
}

function ExpensesTab({
  schemeId,
  onReviewTransaction,
  onUploadComplete,
}: {
  schemeId: Id<"schemes">;
  onReviewTransaction: (invoiceId: Id<"invoices">, transactionId: Id<"transactions">) => void;
  onUploadComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Invoice Upload Zone */}
      <InvoiceUploadZone
        schemeId={schemeId}
        onUploadComplete={onUploadComplete}
      />

      {/* Failed Invoices - Upload Issues */}
      <FailedInvoicesSection schemeId={schemeId} />

      {/* Draft Transactions - Pending Review */}
      <TransactionList
        schemeId={schemeId}
        status="draft"
        title="Pending Review"
        description="Invoices awaiting your approval"
        onReviewTransaction={onReviewTransaction}
        emptyMessage="No invoices pending review"
      />

      {/* Approved Transactions */}
      <TransactionList
        schemeId={schemeId}
        status="approved"
        title="Approved Transactions"
        description="Ready for payment"
        onReviewTransaction={onReviewTransaction}
        emptyMessage="No approved transactions yet"
      />

      {/* Paid Transactions (collapsed by default) */}
      <details className="group">
        <summary className="list-none cursor-pointer">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            <span className="group-open:rotate-90 transition-transform">&#9654;</span>
            View Paid Transactions
          </div>
        </summary>
        <div className="mt-4">
          <TransactionList
            schemeId={schemeId}
            status="paid"
            title="Paid Transactions"
            description="Completed payments"
            onReviewTransaction={onReviewTransaction}
            emptyMessage="No paid transactions yet"
          />
        </div>
      </details>
    </div>
  );
}

function IncomeTab({ schemeId }: { schemeId: Id<"schemes"> }) {
  const [strataRollOpen, setStrataRollOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Manage Strata Roll Button */}
      <Sheet open={strataRollOpen} onOpenChange={setStrataRollOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Building className="h-4 w-4" />
            Manage Strata Roll
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Strata Roll
            </SheetTitle>
            <SheetDescription>
              Manage lots, owners, and unit entitlements for levy calculations.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <StrataRollList schemeId={schemeId} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Levy Runs List */}
      <LevyRunsList schemeId={schemeId} />
    </div>
  );
}

export default function FinancePage() {
  const [selectedSchemeId, setSelectedSchemeId] = useState<Id<"schemes"> | null>(null);
  const [activeTab, setActiveTab] = useState("expenses");

  // Review dialog state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<Id<"invoices"> | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<Id<"transactions"> | null>(null);

  const handleReviewTransaction = (invoiceId: Id<"invoices">, transactionId: Id<"transactions">) => {
    setSelectedInvoiceId(invoiceId);
    setSelectedTransactionId(transactionId);
    setReviewDialogOpen(true);
  };

  const handleUploadComplete = () => {
    // The transaction list will auto-refresh via Convex reactivity
  };

  return (
    <div className="min-h-screen bg-background bg-grain">
      {/* Header */}
      <header className="bg-header border-b border-header/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold tracking-tight text-header-foreground font-display">
                  StrataGenie
                </span>
              </div>
              <div className="h-6 w-px bg-header-foreground/20" />
              <div>
                <div className="flex items-center gap-2">
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg text-header-foreground/70 hover:text-header-foreground hover:bg-header-foreground/10 -ml-2"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Dashboard
                    </Button>
                  </Link>
                  <span className="text-header-foreground/40">/</span>
                  <h1 className="text-lg font-medium tracking-tight text-header-foreground flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-header-foreground/70" />
                    Finance
                  </h1>
                </div>
                <p className="text-sm text-header-foreground/70">
                  Manage expenses and generate levy income
                </p>
              </div>
            </div>
            {selectedSchemeId && (
              <PendingTransactionsBadge schemeId={selectedSchemeId} />
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Left column: Scheme selector */}
          <div>
            <SchemeSelector
              selectedSchemeId={selectedSchemeId}
              onSchemeSelect={setSelectedSchemeId}
            />
          </div>

          {/* Right column: Finance content */}
          <div className="space-y-6">
            {selectedSchemeId ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="expenses" className="gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    Expenses
                  </TabsTrigger>
                  <TabsTrigger value="income" className="gap-2">
                    <ArrowDownRight className="h-4 w-4" />
                    Income / Levies
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="expenses">
                  <ExpensesTab
                    schemeId={selectedSchemeId}
                    onReviewTransaction={handleReviewTransaction}
                    onUploadComplete={handleUploadComplete}
                  />
                </TabsContent>

                <TabsContent value="income">
                  <IncomeTab schemeId={selectedSchemeId} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                  Select a scheme to manage finances
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <footer className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground/70 text-center">
            Financial data is extracted using AI and should be verified before approval.
            This tool does not provide accounting advice.
          </p>
        </footer>
      </main>

      {/* Invoice Review Dialog */}
      <InvoiceReviewDialog
        invoiceId={selectedInvoiceId}
        transactionId={selectedTransactionId}
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        onApproved={() => {
          // Dialog will close automatically
        }}
      />
    </div>
  );
}
