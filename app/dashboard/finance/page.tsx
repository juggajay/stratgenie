"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSelectedScheme } from "@/hooks/use-selected-scheme";
import { SchemeSelector } from "@/components/dashboard/scheme-selector";
import { InvoiceUploadZone } from "@/components/finance/invoice-upload-zone";
import { InvoiceReviewDialog } from "@/components/finance/invoice-review-dialog";
import { TransactionList, PendingTransactionsBadge } from "@/components/finance/transaction-list";
import { FinancialReportDialog } from "@/components/finance/financial-report-dialog";
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
  FileText,
  Beaker,
  Loader2,
  Trash2,
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

function ReportsTab({
  schemeId,
  onReportSaved,
}: {
  schemeId: Id<"schemes">;
  onReportSaved?: () => void;
}) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const seedTestData = useMutation(api.finance.seedTestTransactions);
  const deleteTestData = useMutation(api.finance.deleteTestTransactions);

  const handleSeedTestData = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const result = await seedTestData({ schemeId });
      setSeedResult(`Created ${result.transactionsCreated} test transactions with opening balances.`);
    } catch (error) {
      setSeedResult(`Error: ${error instanceof Error ? error.message : "Failed to seed data"}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleDeleteTestData = async () => {
    setIsDeleting(true);
    setSeedResult(null);
    try {
      const result = await deleteTestData({ schemeId });
      setSeedResult(`Deleted ${result.transactionsDeleted} test transactions.`);
    } catch (error) {
      setSeedResult(`Error: ${error instanceof Error ? error.message : "Failed to delete data"}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generate Report Card */}
      <div className="card-accent rounded-[20px] border border-[#E8E4DE] bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-start gap-4">
          <div className="rounded-[10px] bg-[#FFF0EB] p-3 border border-[#FF6B35]/20">
            <FileText className="h-6 w-6 text-[#FF6B35]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-display font-medium text-foreground">
              Statement of Key Financial Information
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Generate the statutory financial report required for your AGM under
              the NSW Strata Schemes Management Regulation 2016.
            </p>
            <div className="mt-4">
              <Button onClick={() => setReportDialogOpen(true)}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Statutory Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info about the report */}
      <div className="rounded-[20px] border border-[#E8E4DE] bg-[#F8F5F0] p-6">
        <h4 className="font-display font-medium text-foreground mb-3">What&apos;s included in this report?</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-[#FF6B35]">•</span>
            <span>Opening and closing balances for Admin and Capital Works funds</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF6B35]">•</span>
            <span>Income and expenditure breakdown by statutory category</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF6B35]">•</span>
            <span>Professional PDF format compliant with NSW regulations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF6B35]">•</span>
            <span>Automatic filing to your Compliance Vault</span>
          </li>
        </ul>
      </div>

      {/* Test Data Seeder (Development) */}
      <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-[10px] bg-amber-100 p-3 border border-amber-200">
            <Beaker className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-display font-medium text-amber-800">
              Test Data Generator
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              Create sample transactions and opening balances for FY 2024-25 to test
              the financial reporting feature.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                onClick={handleSeedTestData}
                disabled={isSeeding || isDeleting}
                variant="outline"
                className="rounded-lg border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Seeding...
                  </>
                ) : (
                  <>
                    <Beaker className="h-4 w-4 mr-2" />
                    Seed Test Data
                  </>
                )}
              </Button>
              <Button
                onClick={handleDeleteTestData}
                disabled={isSeeding || isDeleting}
                variant="outline"
                className="rounded-lg border-red-200 text-red-600 hover:bg-red-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Test Data
                  </>
                )}
              </Button>
              {seedResult && (
                <span className={`text-sm ${seedResult.startsWith("Error") ? "text-red-600" : "text-emerald-600"}`}>
                  {seedResult}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Report Dialog */}
      <FinancialReportDialog
        schemeId={schemeId}
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        onSaved={onReportSaved}
      />
    </div>
  );
}

export default function FinancePage() {
  const { selectedSchemeId, setSelectedSchemeId } = useSelectedScheme();
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
    <div className="min-h-screen bg-background">
      {/* Header - Editorial Light Theme */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-[#E8E4DE] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <span className="text-2xl font-display font-medium tracking-tight">
                  <span className="text-foreground">Strata</span>
                  <span className="text-[#FF6B35]">Genie</span>
                </span>
              </div>
              <div className="h-6 w-px bg-[#E8E4DE]" />
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg text-muted-foreground hover:text-foreground -ml-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Dashboard
                  </Button>
                </Link>
                <span className="text-muted-foreground/40">/</span>
                <h1 className="text-lg font-display font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-[#FF6B35]" />
                  Finance
                </h1>
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
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="expenses" className="gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    Expenses
                  </TabsTrigger>
                  <TabsTrigger value="income" className="gap-2">
                    <ArrowDownRight className="h-4 w-4" />
                    Income / Levies
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Reports
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

                <TabsContent value="reports">
                  <ReportsTab schemeId={selectedSchemeId} />
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
        <footer className="mt-12 pt-6 border-t border-[#E8E4DE]">
          <p className="text-xs text-muted-foreground text-center">
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
