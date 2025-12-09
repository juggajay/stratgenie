"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface FieldCardProps {
  label: string;
  value: string | number | null;
  isComplete: boolean;
  onEdit?: () => void;
  formatValue?: (value: string | number | null) => string;
}

export function FieldCard({
  label,
  value,
  isComplete,
  onEdit,
  formatValue,
}: FieldCardProps) {
  const [copied, setCopied] = useState(false);

  const displayValue = formatValue
    ? formatValue(value)
    : value?.toString() || "Not set";

  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(displayValue);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Card
      className={`bg-white border rounded-xl transition-all ${
        isComplete
          ? "border-[#E8E4DE] hover:border-emerald-300 hover:shadow-sm"
          : "border-amber-200 bg-amber-50/30"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {label}
            </p>
            <p
              className={`text-base font-medium truncate ${
                isComplete ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {displayValue}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Status indicator */}
            {isComplete ? (
              <div className="p-1 rounded-full bg-emerald-50">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
            ) : (
              <div className="p-1 rounded-full bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
            )}

            {/* Copy button (only if complete) */}
            {isComplete && value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 w-8 p-0 hover:bg-[#F8F5F0]"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            )}

            {/* Edit button (if handler provided and not complete) */}
            {onEdit && !isComplete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="h-8 px-3 text-xs"
              >
                Add
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
