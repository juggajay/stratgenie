"use client";

import { useState, useEffect } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";

interface SchemeSettingsFormProps {
  schemeId: Id<"schemes">;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SchemeSettingsForm({
  schemeId,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: SchemeSettingsFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Support both controlled and uncontrolled modes
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (value: boolean) => {
    setInternalOpen(value);
    onOpenChange?.(value);
  };
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const scheme = useQuery(api.documents.getScheme, { schemeId });
  const financialSettings = useQuery(api.finance.getSchemeFinancialSettings, { schemeId });
  const updateScheme = useMutation(api.documents.updateSchemeMeetingDetails);
  const setComplianceDates = useMutation(api.compliance.setSchemeComplianceDates);
  const updateFinancialSettings = useMutation(api.finance.updateSchemeFinancialSettings);

  // Form state
  const [secretaryName, setSecretaryName] = useState("");
  const [secretaryEmail, setSecretaryEmail] = useState("");
  const [address, setAddress] = useState("");
  const [defaultMeetingLocation, setDefaultMeetingLocation] = useState("");
  const [defaultMeetingTime, setDefaultMeetingTime] = useState("");
  const [lotCount, setLotCount] = useState("");
  const [lastAgmDate, setLastAgmDate] = useState("");
  // Financial settings (CH-0012)
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
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Update scheme details
      await updateScheme({
        schemeId,
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
          schemeId,
          lastAgmDate: timestamp,
        });
      }

      // Update financial settings (CH-0012)
      const adminCents = stringToCents(openingBalanceAdmin);
      const capitalCents = stringToCents(openingBalanceCapital);
      if (adminCents !== undefined || capitalCents !== undefined || financialYearEnd !== "06-30") {
        await updateFinancialSettings({
          schemeId,
          openingBalanceAdmin: adminCents,
          openingBalanceCapital: capitalCents,
          financialYearEnd,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      className="rounded-lg border-slate-300 text-slate-700"
    >
      <Settings className="h-4 w-4 mr-2" />
      Scheme Settings
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Scheme Settings
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Update your scheme details. These are used when generating documents
            like AGM notices.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Secretary Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900">
              Secretary Details
            </h3>

            <div className="space-y-1.5">
              <Label
                htmlFor="secretaryName"
                className="text-sm font-medium text-slate-700"
              >
                Secretary Name
              </Label>
              <Input
                id="secretaryName"
                value={secretaryName}
                onChange={(e) => setSecretaryName(e.target.value)}
                placeholder="e.g. John Smith"
                className="rounded-lg border-slate-300"
              />
              <p className="text-xs text-slate-500">
                Name that appears on official documents.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="secretaryEmail"
                className="text-sm font-medium text-slate-700"
              >
                Secretary Email
              </Label>
              <Input
                id="secretaryEmail"
                type="email"
                value={secretaryEmail}
                onChange={(e) => setSecretaryEmail(e.target.value)}
                placeholder="e.g. secretary@example.com"
                className="rounded-lg border-slate-300"
              />
            </div>
          </div>

          {/* Scheme Address Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900">
              Scheme Address
            </h3>

            <div className="space-y-1.5">
              <Label
                htmlFor="address"
                className="text-sm font-medium text-slate-700"
              >
                Street Address
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 123 Beach Road, Bondi NSW 2026"
                className="rounded-lg border-slate-300"
              />
              <p className="text-xs text-slate-500">
                Full street address of the strata scheme.
              </p>
            </div>
          </div>

          {/* Scheme Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900">
              Scheme Details
            </h3>

            <div className="space-y-1.5">
              <Label
                htmlFor="lotCount"
                className="text-sm font-medium text-slate-700"
              >
                Number of Lots
              </Label>
              <Input
                id="lotCount"
                type="number"
                min="1"
                value={lotCount}
                onChange={(e) => setLotCount(e.target.value)}
                placeholder="e.g. 12"
                className="rounded-lg border-slate-300"
              />
              <p className="text-xs text-slate-500">
                Total lots in the strata scheme (for levy calculations).
              </p>
            </div>
          </div>

          {/* Compliance Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900">
              Compliance Tracking
            </h3>

            <div className="space-y-1.5">
              <Label
                htmlFor="lastAgmDate"
                className="text-sm font-medium text-slate-700"
              >
                Last AGM Date
              </Label>
              <Input
                id="lastAgmDate"
                type="date"
                value={lastAgmDate}
                onChange={(e) => setLastAgmDate(e.target.value)}
                className="rounded-lg border-slate-300"
              />
              <p className="text-xs text-slate-500">
                When was your last AGM held? This calculates your next AGM due date.
              </p>
            </div>
          </div>

          {/* Financial Settings Section (CH-0012) */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900">
              Financial Settings
            </h3>
            <p className="text-xs text-slate-500 -mt-2">
              Set opening fund balances for statutory financial reporting.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="openingBalanceAdmin"
                  className="text-sm font-medium text-slate-700"
                >
                  Admin Fund Opening Balance
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    $
                  </span>
                  <Input
                    id="openingBalanceAdmin"
                    type="number"
                    step="0.01"
                    min="0"
                    value={openingBalanceAdmin}
                    onChange={(e) => setOpeningBalanceAdmin(e.target.value)}
                    placeholder="0.00"
                    className="pl-7 rounded-lg border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="openingBalanceCapital"
                  className="text-sm font-medium text-slate-700"
                >
                  Capital Works Opening Balance
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    $
                  </span>
                  <Input
                    id="openingBalanceCapital"
                    type="number"
                    step="0.01"
                    min="0"
                    value={openingBalanceCapital}
                    onChange={(e) => setOpeningBalanceCapital(e.target.value)}
                    placeholder="0.00"
                    className="pl-7 rounded-lg border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="financialYearEnd"
                className="text-sm font-medium text-slate-700"
              >
                Financial Year End
              </Label>
              <select
                id="financialYearEnd"
                value={financialYearEnd}
                onChange={(e) => setFinancialYearEnd(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="06-30">June 30 (Standard)</option>
                <option value="12-31">December 31</option>
                <option value="03-31">March 31</option>
              </select>
              <p className="text-xs text-slate-500">
                Most NSW strata schemes use June 30 as their financial year end.
              </p>
            </div>
          </div>

          {/* Meeting Defaults Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900">
              Default Meeting Details
            </h3>

            <div className="space-y-1.5">
              <Label
                htmlFor="defaultMeetingLocation"
                className="text-sm font-medium text-slate-700"
              >
                Meeting Location
              </Label>
              <Input
                id="defaultMeetingLocation"
                value={defaultMeetingLocation}
                onChange={(e) => setDefaultMeetingLocation(e.target.value)}
                placeholder="e.g. Building Common Room"
                className="rounded-lg border-slate-300"
              />
              <p className="text-xs text-slate-500">
                Where meetings are typically held.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="defaultMeetingTime"
                className="text-sm font-medium text-slate-700"
              >
                Meeting Time
              </Label>
              <Input
                id="defaultMeetingTime"
                value={defaultMeetingTime}
                onChange={(e) => setDefaultMeetingTime(e.target.value)}
                placeholder="e.g. 7:00 PM"
                className="rounded-lg border-slate-300"
              />
              <p className="text-xs text-slate-500">
                Default time for meetings.
              </p>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              Settings saved successfully!
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-lg border-slate-300 text-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
