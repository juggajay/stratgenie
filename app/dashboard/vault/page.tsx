"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSelectedScheme } from "@/hooks/use-selected-scheme";
import { VaultContainer } from "@/components/vault/vault-container";
import { VAULT_CONTAINERS, type VaultCategory } from "@/lib/compliance-links";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Archive,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function VaultPage() {
  const { selectedSchemeId } = useSelectedScheme();

  const vaultDocuments = useQuery(
    api.documents.getVaultDocuments,
    selectedSchemeId ? { schemeId: selectedSchemeId } : "skip"
  );

  if (!selectedSchemeId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <Archive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-lg font-display font-semibold mb-2">
                Select a Scheme
              </h2>
              <p className="text-muted-foreground mb-4">
                Please select a scheme from the dashboard to view the Compliance Vault.
              </p>
              <Link href="/dashboard">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Define document type from query result
  type VaultDoc = NonNullable<typeof vaultDocuments>[number];

  // Group documents by vault category
  const documentsByCategory = (vaultDocuments || []).reduce<Record<VaultCategory, VaultDoc[]>>((acc, doc) => {
    const category = doc.vaultCategory as VaultCategory;
    if (category) {
      if (!acc[category]) acc[category] = [];
      acc[category].push(doc);
    }
    return acc;
  }, {} as Record<VaultCategory, VaultDoc[]>);

  // Calculate overall status
  const totalContainers = VAULT_CONTAINERS.length;
  const submittedContainers = VAULT_CONTAINERS.filter((container) =>
    container.categories.every((cat) =>
      (documentsByCategory[cat] || []).every(
        (doc: VaultDoc) => doc.submissionStatus === "submitted"
      )
    )
  ).length;

  const hasIssues = VAULT_CONTAINERS.some((container) =>
    container.categories.some((cat) => !documentsByCategory[cat]?.length)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-lg font-display font-bold tracking-tight text-foreground flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Compliance Vault
              </h1>
              <p className="text-sm text-muted-foreground">
                Your document staging area for government submissions
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Status Summary */}
        <Card className="bg-card border-border">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${
                    hasIssues
                      ? "bg-warning/20 text-warning"
                      : "bg-success/20 text-success"
                  }`}
                >
                  {hasIssues ? (
                    <AlertTriangle className="h-6 w-6" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-display font-semibold">
                    {hasIssues
                      ? "Action Required"
                      : "All Documents Ready"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {submittedContainers} of {totalContainers} portals submitted
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Documents auto-filed by StrataGenie
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vault Containers */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Submission Destinations
          </h3>

          {VAULT_CONTAINERS.map((container) => {
            // Get documents for this container's categories
            const containerDocs = container.categories.flatMap(
              (cat) => documentsByCategory[cat] || []
            );

            return (
              <VaultContainer
                key={container.id}
                id={container.id}
                name={container.name}
                description={container.description}
                submissionUrl={container.submissionUrl}
                documents={containerDocs}
                requiredDocs={container.requiredDocs}
                schemeId={selectedSchemeId}
                categories={container.categories}
              />
            );
          })}
        </div>

        {/* Help Text */}
        <Card className="bg-muted/30 border-border">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  How the Vault works
                </p>
                <p>
                  Documents generated by StrataGenie (AGM notices, financial reports) are
                  automatically filed here. When ready, click &quot;Submit&quot; to download the
                  document and open the government portal. After submitting, confirm to
                  track your compliance status.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
