"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Calendar, SkipForward, Loader2, CheckCircle2 } from "lucide-react";

interface StepAgmDateProps {
  schemeId: Id<"schemes">;
  onComplete: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function StepAgmDate({ schemeId, onComplete, onBack, onSkip }: StepAgmDateProps) {
  const [lastAgmDate, setLastAgmDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setSchemeComplianceDates = useMutation(api.compliance.setSchemeComplianceDates);

  // Calculate next AGM due date (1 year from last AGM)
  const calculateNextAgmDue = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSubmit = async () => {
    if (!lastAgmDate) {
      setError("Please select your last AGM date");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const timestamp = new Date(lastAgmDate).getTime();

      await setSchemeComplianceDates({
        schemeId,
        lastAgmDate: timestamp,
      });

      onComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save AGM date");
      setIsSubmitting(false);
    }
  };

  const nextAgmDue = calculateNextAgmDue(lastAgmDate);

  return (
    <Card className="border-[#E8E4DE] shadow-sm">
      <CardHeader className="text-center pb-2">
        <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-7 h-7 text-emerald-600" />
        </div>
        <CardTitle className="text-2xl font-semibold text-foreground">
          When was your last AGM?
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          This enables compliance tracking and deadline reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="lastAgmDate" className="text-sm font-medium text-foreground">
            Last AGM Date
          </Label>
          <input
            type="date"
            id="lastAgmDate"
            value={lastAgmDate}
            onChange={(e) => {
              setLastAgmDate(e.target.value);
              setError(null);
            }}
            className="w-full px-3 py-3 text-base rounded-lg border border-[#E8E4DE] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
            max={new Date().toISOString().split("T")[0]}
          />
          <p className="text-xs text-muted-foreground">
            Find this in your last AGM minutes or scheme records
          </p>
        </div>

        {/* Dynamic next AGM preview */}
        {nextAgmDue && (
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-800">
                  Next AGM Due: {nextAgmDue}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  We&apos;ll remind you when it&apos;s time to prepare
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !lastAgmDate}
            className="w-full py-5 rounded-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
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

        <p className="text-xs text-muted-foreground text-center">
          Don&apos;t know your last AGM date? Check your scheme&apos;s meeting minutes or ask your committee.
        </p>
      </CardContent>
    </Card>
  );
}
