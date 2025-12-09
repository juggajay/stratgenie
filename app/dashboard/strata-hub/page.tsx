"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSelectedScheme } from "@/hooks/use-selected-scheme";
import { ReadinessScore } from "@/components/strata-hub/readiness-score";
import { FieldCard } from "@/components/strata-hub/field-card";
import { EmergencyContactsForm } from "@/components/strata-hub/emergency-contacts-form";
import { SmartDocumentUpload } from "@/components/strata-hub/smart-document-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileCheck,
  ExternalLink,
  Copy,
  CheckCircle2,
  Building2,
  Wallet,
  Shield,
  Users,
  Calendar,
  Flame,
  AlertTriangle,
} from "lucide-react";

const STRATA_HUB_URL =
  "https://www.service.nsw.gov.au/transaction/submit-strata-scheme-annual-report";

export default function StrataHubPage() {
  const { selectedSchemeId } = useSelectedScheme();

  const readiness = useQuery(
    api.strataHubCompliance.getStrataHubReadiness,
    selectedSchemeId ? { schemeId: selectedSchemeId } : "skip"
  );

  const preview = useQuery(
    api.strataHubCompliance.getSubmissionPreview,
    selectedSchemeId ? { schemeId: selectedSchemeId } : "skip"
  );

  const alerts = useQuery(
    api.strataHubCompliance.get28DayAlerts,
    selectedSchemeId ? { schemeId: selectedSchemeId } : "skip"
  );

  const scheme = useQuery(
    api.schemes.get,
    selectedSchemeId ? { schemeId: selectedSchemeId } : "skip"
  );

  const markSubmitted = useMutation(
    api.strataHubCompliance.markStrataHubSubmitted
  );

  const handleMarkSubmitted = async () => {
    if (!selectedSchemeId) return;

    try {
      await markSubmitted({ schemeId: selectedSchemeId });
      toast.success("Strata Hub submission recorded");
    } catch (error) {
      toast.error("Failed to record submission");
      console.error(error);
    }
  };

  const handleCopyAll = async () => {
    if (!preview) return;

    const summaryText = `
Strata Hub Report Summary
=========================
Strata Plan Number: ${preview.strataPlanNumber}
Address: ${preview.schemeAddress || "Not set"}
Total Lots: ${preview.totalLots || "Not set"}
Building Class: ${preview.buildingClass || "Not set"}

Financial Information
---------------------
Admin Fund Balance: ${preview.adminFundBalance}
Capital Works Fund Balance: ${preview.capitalWorksFundBalance}
Insurance Replacement Value: ${preview.insuranceReplacementValue || "Not set"}

Compliance Dates
----------------
Last AGM Date: ${preview.lastAgmDate || "Not set"}
AFSS Date: ${preview.afssDate || "Not set"}

Emergency Contacts
------------------
${preview.emergencyContacts.map((c) => `${c.priority}. ${c.name} (${c.type}) - ${c.phone}`).join("\n") || "No contacts set"}

Committee
---------
Secretary: ${preview.secretaryName || "Not set"} ${preview.secretaryPhone ? `- ${preview.secretaryPhone}` : ""}
Treasurer: ${preview.treasurerName || "Not set"} ${preview.treasurerPhone ? `- ${preview.treasurerPhone}` : ""}
Chairperson: ${preview.chairpersonName || "Not set"} ${preview.chairpersonPhone ? `- ${preview.chairpersonPhone}` : ""}
    `.trim();

    try {
      await navigator.clipboard.writeText(summaryText);
      toast.success("Summary copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const openStrataHub = () => {
    window.open(STRATA_HUB_URL, "_blank");
  };

  // Format currency for display
  const formatCurrency = (cents: number | null): string => {
    if (cents === null) return "Not set";
    const dollars = cents / 100;
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(dollars);
  };

  // Format date for display
  const formatDate = (timestamp: number | null): string => {
    if (!timestamp) return "Not set";
    return new Date(timestamp).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format building class for display
  const formatBuildingClass = (value: string | null): string => {
    if (!value) return "Not set";
    return value.replace("class_", "Class ").replace("_", " ");
  };

  if (!selectedSchemeId) {
    return (
      <div className="min-h-screen bg-warmth-pulse">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-lg font-display font-semibold mb-2">
                Select a Scheme
              </h2>
              <p className="text-muted-foreground mb-4">
                Please select a scheme from the dashboard to prepare your Strata
                Hub report.
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

  const isLoading = !readiness || !preview;

  return (
    <div className="min-h-screen bg-warmth-pulse">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-[#E8E4DE] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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
                <FileCheck className="h-5 w-5 text-[#FF6B35]" />
                Strata Hub
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleCopyAll}>
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
            <Button onClick={openStrataHub}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* 28-Day Update Alerts */}
        {alerts && alerts.length > 0 && (
          <Card className="bg-amber-50 border-amber-200 animate-fade-slide-in">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">
                    Strata Hub Update Required
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    You have contact changes that must be reported to Strata Hub
                    within 28 days:
                  </p>
                  <ul className="mt-2 space-y-1">
                    {alerts.map((alert, i) => (
                      <li key={i} className="text-sm text-amber-700">
                        {alert.field} -{" "}
                        <span className="font-medium">
                          {alert.daysRemaining} days remaining
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Readiness Score */}
        {readiness && (
          <div className="animate-fade-slide-in animate-delay-1">
            <ReadinessScore
              score={readiness.score}
              completedFields={readiness.completedFields}
              totalFields={readiness.totalFields}
            />
          </div>
        )}

        {/* Basic Information */}
        <Card className="bg-card border-border animate-fade-slide-in animate-delay-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#FF6B35]" />
              <CardTitle className="text-base font-medium">
                Scheme Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {readiness?.allFields
                .filter((f) => f.category === "basic")
                .map((field) => (
                  <FieldCard
                    key={field.id}
                    label={field.label}
                    value={field.value}
                    isComplete={field.isComplete}
                    formatValue={(v) =>
                      field.id === "buildingClass"
                        ? formatBuildingClass(v as string)
                        : v?.toString() || "Not set"
                    }
                  />
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <div className="animate-fade-slide-in animate-delay-3">
          <EmergencyContactsForm
            schemeId={selectedSchemeId}
            existingContacts={scheme?.emergencyContacts}
          />
        </div>

        {/* Smart Document Upload */}
        <div className="animate-fade-slide-in animate-delay-4">
          <SmartDocumentUpload
            schemeId={selectedSchemeId}
            onSuccess={() => {
              // Refresh data after successful extraction
              toast.success("Document processed successfully");
            }}
          />
        </div>

        {/* Financial Information */}
        <Card className="bg-card border-border animate-fade-slide-in animate-delay-5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#FF6B35]" />
              <CardTitle className="text-base font-medium">
                Financial Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-3">
              {readiness?.allFields
                .filter((f) => f.category === "financial")
                .map((field) => (
                  <FieldCard
                    key={field.id}
                    label={field.label}
                    value={field.value}
                    isComplete={field.isComplete}
                    formatValue={(v) => formatCurrency(v as number)}
                  />
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Dates */}
        <Card className="bg-card border-border animate-fade-slide-in animate-delay-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#FF6B35]" />
              <CardTitle className="text-base font-medium">
                Compliance Dates
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-2">
              {readiness?.allFields
                .filter((f) => f.category === "compliance")
                .map((field) => (
                  <FieldCard
                    key={field.id}
                    label={field.label}
                    value={field.value}
                    isComplete={field.isComplete}
                    formatValue={(v) => formatDate(v as number)}
                  />
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Submission Actions */}
        <Card className="bg-card border-border animate-fade-slide-in animate-delay-7">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold text-foreground">
                  Ready to Submit?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {readiness && readiness.score >= 100
                    ? "All fields are complete. Open the portal, enter your details, and mark as submitted when done."
                    : "Complete all missing fields above before submitting to Strata Hub."}
                </p>
                {preview?.lastSubmittedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last submitted: {preview.lastSubmittedAt}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={openStrataHub}
                  disabled={readiness && readiness.score < 100}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Strata Hub
                </Button>
                <Button
                  onClick={handleMarkSubmitted}
                  disabled={readiness && readiness.score < 100}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Submitted
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card className="bg-muted/30 border-border">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  How Strata Hub Submission Works
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Complete all required fields on this page</li>
                  <li>
                    Click &quot;Open Strata Hub&quot; to access the NSW portal
                  </li>
                  <li>
                    Use the copy buttons to transfer each field to the portal
                  </li>
                  <li>Pay the $3 per lot fee on the portal</li>
                  <li>
                    Return here and click &quot;Mark as Submitted&quot; to track
                    your compliance
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
