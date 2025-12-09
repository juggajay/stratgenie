"use client";

import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface ReadinessScoreProps {
  score: number;
  completedFields: number;
  totalFields: number;
}

export function ReadinessScore({
  score,
  completedFields,
  totalFields,
}: ReadinessScoreProps) {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBgColor = () => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200";
    if (score >= 50) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const getIcon = () => {
    if (score >= 80) return <CheckCircle2 className="h-6 w-6" />;
    if (score >= 50) return <AlertTriangle className="h-6 w-6" />;
    return <XCircle className="h-6 w-6" />;
  };

  const getMessage = () => {
    if (score >= 100) return "Ready to submit";
    if (score >= 80) return "Almost ready";
    if (score >= 50) return "Needs attention";
    return "Missing critical info";
  };

  // Calculate the stroke dasharray for the circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className={`flex items-center gap-6 p-6 rounded-xl border ${getScoreBgColor()}`}
    >
      {/* Circular Progress */}
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/50"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={getScoreColor()}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: "stroke-dashoffset 0.5s ease-in-out",
            }}
          />
        </svg>
        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getScoreColor()}`}>
            {score}%
          </span>
        </div>
      </div>

      {/* Status info */}
      <div className="flex-1">
        <div className={`flex items-center gap-2 ${getScoreColor()}`}>
          {getIcon()}
          <span className="text-lg font-semibold">{getMessage()}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {completedFields} of {totalFields} fields complete
        </p>
        {score < 100 && (
          <p className="text-sm text-muted-foreground mt-2">
            Complete all fields below to prepare your Strata Hub submission.
          </p>
        )}
      </div>
    </div>
  );
}
