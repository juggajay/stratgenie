"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building2, Loader2 } from "lucide-react";

interface StepBasicInfoProps {
  initialLotCount?: string;
  onSchemeCreated: (schemeId: Id<"schemes">) => void;
}

export function StepBasicInfo({ initialLotCount, onSchemeCreated }: StepBasicInfoProps) {
  const [strataNumber, setStrataNumber] = useState("");
  const [address, setAddress] = useState("");
  const [lotCount, setLotCount] = useState(initialLotCount || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFirstScheme = useMutation(api.schemes.createFirstScheme);

  const handleSubmit = async () => {
    if (!strataNumber.trim()) {
      setError("Please enter your Strata Plan Number");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const schemeName = address.trim() || `Scheme ${strataNumber}`;
      const parsedLotCount = parseInt(lotCount) || 0;

      const schemeId = await createFirstScheme({
        name: schemeName,
        strataNumber: strataNumber.trim().toUpperCase(),
        address: address.trim() || undefined,
        lotCount: parsedLotCount,
      });

      onSchemeCreated(schemeId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create scheme. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-[#E8E4DE] shadow-sm">
      <CardHeader className="text-center pb-2">
        <div className="w-14 h-14 rounded-xl bg-[#FFF0EB] flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-7 h-7 text-[#FF6B35]" />
        </div>
        <CardTitle className="text-2xl font-semibold text-foreground">
          Welcome to StrataGenie
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Let&apos;s set up your first strata scheme
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="strataNumber" className="text-sm font-medium text-foreground">
            What is your Strata Plan Number? <span className="text-red-500">*</span>
          </Label>
          <Input
            id="strataNumber"
            placeholder="e.g., SP12345"
            value={strataNumber}
            onChange={(e) => {
              setStrataNumber(e.target.value);
              setError(null);
            }}
            className="text-lg py-5 rounded-lg"
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            You can find this on your strata levy notice or title documents
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium text-foreground">
            Scheme Address <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="address"
            placeholder="e.g., 123 Example Street, Sydney"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lotCount" className="text-sm font-medium text-foreground">
            Number of lots <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="lotCount"
            type="number"
            min="1"
            placeholder="e.g., 6"
            value={lotCount}
            onChange={(e) => setLotCount(e.target.value)}
            className="rounded-lg"
          />
          <p className="text-xs text-muted-foreground">
            Include all lots in the strata plan (apartments, units, townhouses)
          </p>
        </div>

        {/* Trial notice */}
        <div className="bg-[#FFF0EB] rounded-xl p-4 border border-[#FFCDB8]">
          <p className="text-sm text-[#3d3d5c]">
            <strong className="text-[#1a1a2e]">Your 14-day free trial starts now.</strong>
            <br />
            <span className="text-[#6b6b8a]">
              Full access to all features. No credit card required.
            </span>
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-5 rounded-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
