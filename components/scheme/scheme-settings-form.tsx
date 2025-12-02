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
}

export function SchemeSettingsForm({
  schemeId,
  trigger,
}: SchemeSettingsFormProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const scheme = useQuery(api.documents.getScheme, { schemeId });
  const updateScheme = useMutation(api.documents.updateSchemeMeetingDetails);

  // Form state
  const [secretaryName, setSecretaryName] = useState("");
  const [secretaryEmail, setSecretaryEmail] = useState("");
  const [address, setAddress] = useState("");
  const [defaultMeetingLocation, setDefaultMeetingLocation] = useState("");
  const [defaultMeetingTime, setDefaultMeetingTime] = useState("");

  // Sync form state when scheme data loads
  useEffect(() => {
    if (scheme) {
      setSecretaryName(scheme.secretaryName || "");
      setSecretaryEmail(scheme.secretaryEmail || "");
      setAddress(scheme.address || "");
      setDefaultMeetingLocation(scheme.defaultMeetingLocation || "");
      setDefaultMeetingTime(scheme.defaultMeetingTime || "");
    }
  }, [scheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateScheme({
        schemeId,
        secretaryName: secretaryName || undefined,
        secretaryEmail: secretaryEmail || undefined,
        address: address || undefined,
        defaultMeetingLocation: defaultMeetingLocation || undefined,
        defaultMeetingTime: defaultMeetingTime || undefined,
      });
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
