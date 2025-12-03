"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  ArrowLeft,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  Building2,
  Calendar,
  DollarSign,
  Shield,
  Users,
  Flame,
} from "lucide-react";
import { useMutation, useAction, useQuery } from "convex/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

// Generate a session ID for anonymous tracking
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = sessionStorage.getItem("strata-hub-session");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("strata-hub-session", sessionId);
  }
  return sessionId;
}

// Format cents to dollars (with cents precision)
function formatCurrency(cents: bigint | number | undefined): string {
  if (cents === undefined || cents === null) return "—";
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
}

type Step = "upload" | "processing" | "results";

export default function StrataHubReporterPage() {
  const [step, setStep] = useState<Step>("upload");
  const [sessionId, setSessionId] = useState("");
  const [reportId, setReportId] = useState<Id<"strataHubReports"> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [fileName, setFileName] = useState("");

  // Convex hooks
  const generateUploadUrl = useMutation(api.strataHub.generateUploadUrl);
  const createReport = useMutation(api.strataHub.createReport);
  const analyzeDocument = useAction(api.actions.strataHub.analyzeDocument);
  const unlockReport = useMutation(api.strataHub.unlockReport);
  const captureLead = useMutation(api.leads.capture);
  const report = useQuery(
    api.strataHub.getReportById,
    reportId ? { reportId } : "skip"
  );

  // Initialize session ID on mount
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  // Poll for report updates when processing
  useEffect(() => {
    if (report?.status === "completed" || report?.status === "failed") {
      setStep("results");
    }
  }, [report?.status]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!sessionId) return;

      setIsUploading(true);
      setFileName(file.name);

      try {
        // 1. Get upload URL
        const uploadUrl = await generateUploadUrl();

        // 2. Upload the file
        const uploadResult = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadResult.ok) {
          throw new Error("Upload failed");
        }

        const { storageId } = await uploadResult.json();

        // 3. Create report record
        const newReportId = await createReport({
          sessionId,
          fileId: storageId,
          fileName: file.name,
        });

        setReportId(newReportId);
        setStep("processing");

        // 4. Trigger AI analysis
        await analyzeDocument({
          reportId: newReportId,
          storageId,
        });
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [sessionId, generateUploadUrl, createReport, analyzeDocument]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        handleFileUpload(file);
      } else {
        alert("Please upload a PDF file");
      }
    },
    [handleFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !reportId) return;

    setIsUnlocking(true);
    try {
      // Capture lead and unlock report
      await Promise.all([
        captureLead({
          email,
          name: name || undefined,
          source: "strata_hub_reporter",
        }),
        unlockReport({ reportId }),
      ]);
    } catch (error) {
      console.error("Failed to unlock:", error);
    } finally {
      setIsUnlocking(false);
    }
  };

  const isUnlocked = report?.unlocked === true;

  return (
    <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-3">
            Strata Hub Report Generator
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Upload your AGM Minutes or Financial Statement and we'll extract the
            key data points required for NSW Strata Hub reporting.
          </p>
        </div>

        {/* Upload Step */}
        {step === "upload" && (
          <Card className="border border-slate-200 rounded-xl bg-white shadow-sm max-w-xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-lg font-medium">
                Upload Your Document
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Supports AGM Minutes, Financial Statements, or Annual Reports (PDF)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-10 h-10 text-blue-600 mx-auto mb-3 animate-spin" />
                      <p className="text-sm text-slate-600">Uploading {fileName}...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm text-slate-600 mb-1">
                        Drag and drop your PDF here, or{" "}
                        <span className="text-blue-600 font-medium">browse</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        Maximum file size: 10MB
                      </p>
                    </>
                  )}
                </label>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  What we extract:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Strata Plan Number</li>
                  <li>• Last AGM Date</li>
                  <li>• Admin & Capital Works Fund Balances</li>
                  <li>• AFSS (Fire Safety) Date</li>
                  <li>• Insurance Replacement Value</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Processing Step */}
        {step === "processing" && (
          <Card className="border border-slate-200 rounded-xl bg-white shadow-sm max-w-xl mx-auto">
            <CardContent className="pt-8 text-center">
              <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Analyzing Your Document
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Our AI is extracting the key data points from your document.
                This usually takes 10-30 seconds.
              </p>
              <div className="text-xs text-slate-500">
                File: {fileName}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Step */}
        {step === "results" && report && (
          <div className="space-y-6">
            {/* Status Banner */}
            {report.status === "failed" ? (
              <Card className="border-2 border-red-200 bg-red-50 rounded-xl">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-red-900 mb-1">
                        Analysis Failed
                      </h3>
                      <p className="text-sm text-red-800">
                        {report.errorMessage || "An error occurred while processing your document."}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setStep("upload");
                          setReportId(null);
                        }}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Success Banner */}
                <Card className="border-2 border-green-200 bg-green-50 rounded-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-green-900 mb-1">
                          Analysis Complete
                        </h3>
                        <p className="text-sm text-green-800">
                          We've extracted the Strata Hub data points from your document.
                          {!isUnlocked && " Enter your email below to unlock the full results."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Grid */}
                <Card className="border border-slate-200 rounded-xl bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      {isUnlocked ? (
                        <Unlock className="w-5 h-5 text-green-600" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                      Extracted Data
                    </CardTitle>
                    <CardDescription>
                      {isUnlocked
                        ? "Your full Strata Hub report data"
                        : "Enter your email to unlock the full results"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`grid md:grid-cols-2 gap-4 ${!isUnlocked ? "blur-sm select-none" : ""}`}>
                      {/* Strata Plan Number */}
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-4 h-4 text-slate-500" />
                          <span className="text-xs font-medium text-slate-500 uppercase">
                            Strata Plan
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">
                          {report.extractedData?.strataPlanNumber || "Not found"}
                        </p>
                      </div>

                      {/* Total Lots */}
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-slate-500" />
                          <span className="text-xs font-medium text-slate-500 uppercase">
                            Total Lots
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">
                          {report.extractedData?.totalLots ?? "Not found"}
                        </p>
                      </div>

                      {/* Last AGM Date */}
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className="text-xs font-medium text-slate-500 uppercase">
                            Last AGM Date
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">
                          {report.extractedData?.lastAgmDate || "Not found"}
                        </p>
                      </div>

                      {/* AFSS Date */}
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Flame className="w-4 h-4 text-slate-500" />
                          <span className="text-xs font-medium text-slate-500 uppercase">
                            Last AFSS Date
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">
                          {report.extractedData?.lastAfssDate || "Not found"}
                        </p>
                      </div>

                      {/* Admin Fund Balance */}
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-slate-500" />
                          <span className="text-xs font-medium text-slate-500 uppercase">
                            Admin Fund Balance
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatCurrency(report.extractedData?.adminFundBalance)}
                        </p>
                      </div>

                      {/* Capital Works Fund */}
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-slate-500" />
                          <span className="text-xs font-medium text-slate-500 uppercase">
                            Capital Works Fund
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatCurrency(report.extractedData?.capitalWorksFundBalance)}
                        </p>
                      </div>

                      {/* Insurance Value */}
                      <div className="p-4 bg-slate-50 rounded-lg md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-slate-500" />
                          <span className="text-xs font-medium text-slate-500 uppercase">
                            Insurance Replacement Value
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatCurrency(report.extractedData?.insuranceReplacementValue)}
                        </p>
                      </div>
                    </div>

                    {/* Email Gate */}
                    {!isUnlocked && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Unlock Your Full Report
                        </h4>
                        <p className="text-sm text-blue-800 mb-4">
                          Enter your email to see all the extracted data points.
                        </p>
                        <form onSubmit={handleUnlock} className="space-y-3">
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="name" className="sr-only">Name</Label>
                              <Input
                                id="name"
                                type="text"
                                placeholder="Your name (optional)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="rounded-lg border-blue-300 bg-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email" className="sr-only">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="rounded-lg border-blue-300 bg-white"
                              />
                            </div>
                          </div>
                          <Button
                            type="submit"
                            disabled={isUnlocking}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                          >
                            {isUnlocking ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Unlocking...
                              </>
                            ) : (
                              <>
                                <Unlock className="w-4 h-4 mr-2" />
                                Unlock Results
                              </>
                            )}
                          </Button>
                          <p className="text-xs text-blue-700 text-center">
                            We'll send you helpful strata tips. Unsubscribe anytime.
                          </p>
                        </form>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center">
                  <h2 className="text-xl font-semibold text-white mb-3">
                    Ready to automate your Strata Hub reporting?
                  </h2>
                  <p className="text-blue-100 mb-6 max-w-md mx-auto">
                    StrataGenie tracks your AGM dates, generates compliant documents,
                    and reminds you when Strata Hub reports are due.
                  </p>
                  <Link href="/sign-up">
                    <Button className="bg-white text-blue-700 hover:bg-blue-50 rounded-lg px-6 py-2.5">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {/* How It Works */}
        {step === "upload" && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Upload Document",
                  description: "Upload your AGM Minutes or Financial Statement PDF",
                },
                {
                  step: "2",
                  title: "AI Analysis",
                  description: "Our AI extracts the key Strata Hub data points",
                },
                {
                  step: "3",
                  title: "Get Report",
                  description: "Review your data and copy it into the Strata Hub portal",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-700 font-semibold">{item.step}</span>
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
