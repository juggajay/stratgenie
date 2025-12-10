"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSelectedScheme } from "@/hooks/use-selected-scheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMobileNav } from "../layout";
import {
  ArrowLeft,
  Settings,
  Building2,
  User,
  CreditCard,
  Calendar,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Menu,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  calculateMonthlyPrice,
  getTierInfo,
} from "@/convex/billing/constants";
import { SettingsTour } from "@/components/tour";

export default function SettingsPage() {
  const { selectedSchemeId, scheme } = useSelectedScheme();
  const { setIsOpen: setMobileNavOpen } = useMobileNav();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Queries
  const financialSettings = useQuery(
    api.finance.getSchemeFinancialSettings,
    selectedSchemeId ? { schemeId: selectedSchemeId } : "skip"
  );
  const billingStatus = useQuery(
    api.billing.queries.getBillingStatus,
    selectedSchemeId ? { schemeId: selectedSchemeId } : "skip"
  );

  // Mutations
  const updateScheme = useMutation(api.documents.updateSchemeMeetingDetails);
  const setComplianceDates = useMutation(api.compliance.setSchemeComplianceDates);
  const updateFinancialSettings = useMutation(api.finance.updateSchemeFinancialSettings);
  const createPortalSession = useAction(api.billing.actions.createPortalSession);

  // Form state
  const [secretaryName, setSecretaryName] = useState("");
  const [secretaryEmail, setSecretaryEmail] = useState("");
  const [address, setAddress] = useState("");
  const [defaultMeetingLocation, setDefaultMeetingLocation] = useState("");
  const [defaultMeetingTime, setDefaultMeetingTime] = useState("");
  const [lotCount, setLotCount] = useState("");
  const [lastAgmDate, setLastAgmDate] = useState("");
  const [openingBalanceAdmin, setOpeningBalanceAdmin] = useState("");
  const [openingBalanceCapital, setOpeningBalanceCapital] = useState("");
  const [financialYearEnd, setFinancialYearEnd] = useState("06-30");

  // Helper to convert timestamp to date input value
  const timestampToDateValue = (timestamp: number | undefined): string => {
    if (!timestamp) return "";
    return new Date(timestamp).toISOString().split("T")[0];
  };

  // Helper to convert cents to dollars string
  const centsToString = (cents: bigint | undefined | null): string => {
    if (cents === undefined || cents === null) return "";
    return (Number(cents) / 100).toFixed(2);
  };

  // Helper to convert dollars string to cents
  const stringToCents = (value: string): bigint | undefined => {
    if (!value) return undefined;
    const dollars = parseFloat(value);
    if (isNaN(dollars)) return undefined;
    return BigInt(Math.round(dollars * 100));
  };

  // Sync form state when scheme data loads
  useEffect(() => {
    if (scheme) {
      setSecretaryName(scheme.secretaryName || "");
      setSecretaryEmail(scheme.secretaryEmail || "");
      setAddress(scheme.address || "");
      setDefaultMeetingLocation(scheme.defaultMeetingLocation || "");
      setDefaultMeetingTime(scheme.defaultMeetingTime || "");
      setLotCount(scheme.lotCount ? String(scheme.lotCount) : "");
      setLastAgmDate(timestampToDateValue(scheme.lastAgmDate));
    }
  }, [scheme]);

  // Sync financial settings when they load
  useEffect(() => {
    if (financialSettings) {
      setOpeningBalanceAdmin(centsToString(financialSettings.openingBalanceAdmin));
      setOpeningBalanceCapital(centsToString(financialSettings.openingBalanceCapital));
      setFinancialYearEnd(financialSettings.financialYearEnd || "06-30");
    }
  }, [financialSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchemeId) return;

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Update scheme details
      await updateScheme({
        schemeId: selectedSchemeId,
        secretaryName: secretaryName || undefined,
        secretaryEmail: secretaryEmail || undefined,
        address: address || undefined,
        defaultMeetingLocation: defaultMeetingLocation || undefined,
        defaultMeetingTime: defaultMeetingTime || undefined,
        lotCount: lotCount ? parseInt(lotCount, 10) : undefined,
      });

      // Update compliance dates if lastAgmDate is set
      if (lastAgmDate) {
        const timestamp = new Date(lastAgmDate).getTime();
        await setComplianceDates({
          schemeId: selectedSchemeId,
          lastAgmDate: timestamp,
        });
      }

      // Update financial settings
      const adminCents = stringToCents(openingBalanceAdmin);
      const capitalCents = stringToCents(openingBalanceCapital);
      if (adminCents !== undefined || capitalCents !== undefined || financialYearEnd !== "06-30") {
        await updateFinancialSettings({
          schemeId: selectedSchemeId,
          openingBalanceAdmin: adminCents,
          openingBalanceCapital: capitalCents,
          financialYearEnd,
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleManageBilling = async () => {
    if (!selectedSchemeId) return;

    try {
      const { url } = await createPortalSession({
        schemeId: selectedSchemeId,
        returnUrl: `${window.location.origin}/dashboard/settings`,
      });
      window.location.href = url;
    } catch (error) {
      console.error("Failed to create portal session:", error);
    }
  };

  const currentLotCount = scheme?.lotCount ?? 1;
  const tierInfo = getTierInfo(currentLotCount);
  const monthlyPrice = calculateMonthlyPrice(currentLotCount);
  const hasActiveSubscription = billingStatus?.status === "active";
  const isInTrial = billingStatus?.status === "trial";

  return (
    <div className="min-h-screen bg-warmth-pulse">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-[#E8E4DE] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Mobile hamburger menu */}
              <button
                onClick={() => setMobileNavOpen(true)}
                className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center">
                <span className="text-xl sm:text-2xl font-display font-medium tracking-tight">
                  <span className="text-foreground">Strata</span>
                  <span className="text-[#FF6B35]">Genie</span>
                </span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-[#E8E4DE]" />
              <div className="hidden sm:flex items-center gap-2">
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
                  <Settings className="h-5 w-5 text-[#FF6B35]" />
                  Settings
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile page title */}
        <div className="sm:hidden px-4 pb-3 border-t border-[#E8E4DE] pt-2 bg-white/50">
          <h1 className="text-base font-display font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-4 w-4 text-[#FF6B35]" />
            Settings
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {!selectedSchemeId ? (
          <Card className="bg-white border border-[#E8E4DE] rounded-xl">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                Select a scheme from the dashboard to manage settings.
              </p>
              <Link href="/dashboard">
                <Button className="mt-4">Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Success/Error Messages */}
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <p className="text-sm font-medium text-emerald-900">Settings saved successfully!</p>
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-sm font-medium text-red-900">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Scheme Details */}
              <Card className="bg-white border border-[#E8E4DE] rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-medium">
                    <Building2 className="h-5 w-5 text-[#FF6B35]" />
                    Scheme Details
                  </CardTitle>
                  <CardDescription>
                    Basic information about your strata scheme.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="schemeName" className="text-sm font-medium text-foreground">
                        Scheme Name
                      </Label>
                      <Input
                        id="schemeName"
                        value={scheme?.name || ""}
                        disabled
                        className="bg-[#F8F5F0] border-[#E8E4DE]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Strata Plan Number (cannot be changed)
                      </p>
                    </div>

                    <div className="space-y-1.5" data-tour="lot-count">
                      <Label htmlFor="lotCount" className="text-sm font-medium text-foreground">
                        Number of Lots
                      </Label>
                      <Input
                        id="lotCount"
                        type="number"
                        min="1"
                        value={lotCount}
                        onChange={(e) => setLotCount(e.target.value)}
                        placeholder="e.g. 12"
                        className="border-[#E8E4DE]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Affects pricing tier and levy calculations.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 123 Beach Road, Bondi NSW 2026"
                      className="border-[#E8E4DE]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Secretary Details */}
              <Card className="bg-white border border-[#E8E4DE] rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-medium">
                    <User className="h-5 w-5 text-[#FF6B35]" />
                    Secretary Details
                  </CardTitle>
                  <CardDescription>
                    Contact information for official documents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="secretaryName" className="text-sm font-medium text-foreground">
                        Secretary Name
                      </Label>
                      <Input
                        id="secretaryName"
                        value={secretaryName}
                        onChange={(e) => setSecretaryName(e.target.value)}
                        placeholder="e.g. John Smith"
                        className="border-[#E8E4DE]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="secretaryEmail" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        Secretary Email
                      </Label>
                      <Input
                        id="secretaryEmail"
                        type="email"
                        value={secretaryEmail}
                        onChange={(e) => setSecretaryEmail(e.target.value)}
                        placeholder="e.g. secretary@example.com"
                        className="border-[#E8E4DE]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Tracking */}
              <Card className="bg-white border border-[#E8E4DE] rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-medium">
                    <Calendar className="h-5 w-5 text-[#FF6B35]" />
                    Compliance Tracking
                  </CardTitle>
                  <CardDescription>
                    Important dates for compliance calculations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5" data-tour="agm-date">
                    <Label htmlFor="lastAgmDate" className="text-sm font-medium text-foreground">
                      Last AGM Date
                    </Label>
                    <Input
                      id="lastAgmDate"
                      type="date"
                      value={lastAgmDate}
                      onChange={(e) => setLastAgmDate(e.target.value)}
                      className="border-[#E8E4DE] max-w-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      This calculates your next AGM due date (15 months from last AGM).
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Meeting Defaults */}
              <Card className="bg-white border border-[#E8E4DE] rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-medium">
                    <Clock className="h-5 w-5 text-[#FF6B35]" />
                    Default Meeting Details
                  </CardTitle>
                  <CardDescription>
                    Pre-fill these when generating meeting notices.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="defaultMeetingLocation" className="text-sm font-medium text-foreground">
                        Meeting Location
                      </Label>
                      <Input
                        id="defaultMeetingLocation"
                        value={defaultMeetingLocation}
                        onChange={(e) => setDefaultMeetingLocation(e.target.value)}
                        placeholder="e.g. Building Common Room"
                        className="border-[#E8E4DE]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="defaultMeetingTime" className="text-sm font-medium text-foreground">
                        Meeting Time
                      </Label>
                      <Input
                        id="defaultMeetingTime"
                        value={defaultMeetingTime}
                        onChange={(e) => setDefaultMeetingTime(e.target.value)}
                        placeholder="e.g. 7:00 PM"
                        className="border-[#E8E4DE]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Settings */}
              <Card className="bg-white border border-[#E8E4DE] rounded-xl" data-tour="financial-settings">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-medium">
                    <DollarSign className="h-5 w-5 text-[#FF6B35]" />
                    Financial Settings
                  </CardTitle>
                  <CardDescription>
                    Opening balances for statutory financial reporting.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="openingBalanceAdmin" className="text-sm font-medium text-foreground">
                        Admin Fund Opening Balance
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="openingBalanceAdmin"
                          type="number"
                          step="0.01"
                          min="0"
                          value={openingBalanceAdmin}
                          onChange={(e) => setOpeningBalanceAdmin(e.target.value)}
                          placeholder="0.00"
                          className="pl-7 border-[#E8E4DE]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="openingBalanceCapital" className="text-sm font-medium text-foreground">
                        Capital Works Opening Balance
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="openingBalanceCapital"
                          type="number"
                          step="0.01"
                          min="0"
                          value={openingBalanceCapital}
                          onChange={(e) => setOpeningBalanceCapital(e.target.value)}
                          placeholder="0.00"
                          className="pl-7 border-[#E8E4DE]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="financialYearEnd" className="text-sm font-medium text-foreground">
                      Financial Year End
                    </Label>
                    <select
                      id="financialYearEnd"
                      value={financialYearEnd}
                      onChange={(e) => setFinancialYearEnd(e.target.value)}
                      className="w-full max-w-xs rounded-lg border border-[#E8E4DE] px-3 py-2 text-sm bg-white"
                    >
                      <option value="06-30">June 30 (Standard)</option>
                      <option value="12-31">December 31</option>
                      <option value="03-31">March 31</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Most NSW strata schemes use June 30.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving} className="min-w-[120px]">
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>

            {/* Billing Section */}
            <Card className="bg-white border border-[#E8E4DE] rounded-xl" data-tour="billing-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-medium">
                  <CreditCard className="h-5 w-5 text-[#FF6B35]" />
                  Billing & Subscription
                </CardTitle>
                <CardDescription>
                  Manage your subscription and payment details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#F8F5F0] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#FFF0EB] rounded-lg">
                      {hasActiveSubscription ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Sparkles className="h-5 w-5 text-[#FF6B35]" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {billingStatus?.planName ?? "Loading..."}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentLotCount} lots · ${monthlyPrice.toFixed(2)}/month ({tierInfo.name} tier)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {hasActiveSubscription ? (
                      <Button onClick={handleManageBilling} variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Manage Billing
                      </Button>
                    ) : (
                      <Link href="/dashboard/billing">
                        <Button>
                          {isInTrial ? "Subscribe Now" : "View Plans"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                {isInTrial && billingStatus?.trialDaysRemaining !== null && (
                  <p className="text-sm text-muted-foreground mt-3">
                    <span className="font-medium text-[#FF6B35]">{billingStatus.trialDaysRemaining} days</span> remaining in your free trial.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-[#E8E4DE]">
          <p className="text-xs text-muted-foreground text-center">
            Questions? Contact us at{" "}
            <a
              href="mailto:support@stratagenie.com.au"
              className="text-[#FF6B35] hover:underline"
            >
              support@stratagenie.com.au
            </a>
          </p>
        </footer>
      </main>

      {/* Guided Tour */}
      <SettingsTour />
    </div>
  );
}
