"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Users, SkipForward, Loader2 } from "lucide-react";

interface StepSecretaryProps {
  schemeId: Id<"schemes">;
  onComplete: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function StepSecretary({ schemeId, onComplete, onBack, onSkip }: StepSecretaryProps) {
  const [secretaryName, setSecretaryName] = useState("");
  const [secretaryEmail, setSecretaryEmail] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSchemeMeetingDetails = useMutation(api.documents.updateSchemeMeetingDetails);

  const handleSubmit = async () => {
    // At least one field should be filled
    if (!secretaryName.trim() && !secretaryEmail.trim() && !meetingLocation.trim()) {
      onSkip();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updateSchemeMeetingDetails({
        schemeId,
        secretaryName: secretaryName.trim() || undefined,
        secretaryEmail: secretaryEmail.trim() || undefined,
        defaultMeetingLocation: meetingLocation.trim() || undefined,
      });

      onComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save details");
      setIsSubmitting(false);
    }
  };

  const hasAnyInput = secretaryName.trim() || secretaryEmail.trim() || meetingLocation.trim();

  return (
    <Card className="border-[#E8E4DE] shadow-sm">
      <CardHeader className="text-center pb-2">
        <div className="w-14 h-14 rounded-xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
          <Users className="w-7 h-7 text-violet-600" />
        </div>
        <CardTitle className="text-2xl font-semibold text-foreground">
          Committee Details
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          This helps us generate AGM notices and documents for you
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="secretaryName" className="text-sm font-medium text-foreground">
            Secretary Name <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="secretaryName"
            placeholder="e.g., Jane Smith"
            value={secretaryName}
            onChange={(e) => {
              setSecretaryName(e.target.value);
              setError(null);
            }}
            className="rounded-lg"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secretaryEmail" className="text-sm font-medium text-foreground">
            Secretary Email <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="secretaryEmail"
            type="email"
            placeholder="e.g., secretary@example.com"
            value={secretaryEmail}
            onChange={(e) => {
              setSecretaryEmail(e.target.value);
              setError(null);
            }}
            className="rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meetingLocation" className="text-sm font-medium text-foreground">
            Default Meeting Location <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="meetingLocation"
            placeholder="e.g., Building Common Room, Level 1"
            value={meetingLocation}
            onChange={(e) => {
              setMeetingLocation(e.target.value);
              setError(null);
            }}
            className="rounded-lg"
          />
          <p className="text-xs text-muted-foreground">
            Used as the default venue for AGM notices
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-5 rounded-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : hasAnyInput ? (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="flex-1 py-5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              variant="ghost"
              onClick={onSkip}
              disabled={isSubmitting}
              className="flex-1 py-5 rounded-lg"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip for now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
