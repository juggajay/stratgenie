"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  Shield,
  Users,
  Flame,
  Sparkles,
  Mail,
  ArrowRight,
  XCircle,
} from "lucide-react";
import { useMutation, useAction, useQuery } from "convex/react";

// Agent story carousel data - tells the journey of managing a strata scheme
const agentStory = [
  {
    name: "Secretary Agent",
    step: "Step 1",
    headline: "Never miss an AGM deadline again",
    story: "Your Secretary Agent watches the calendar 24/7. It auto-calculates when your AGM is due, drafts compliant notices, and keeps your compliance dashboard green.",
    image: "/images/agents/hero-secretary.png",
    color: "cyan",
    bgGradient: "from-cyan-500/20 to-sky-500/10",
    borderColor: "border-cyan-500/30",
    textColor: "text-cyan-600",
  },
  {
    name: "Treasurer Agent",
    step: "Step 2",
    headline: "Invoices processed in seconds",
    story: "Drop in any invoice. Your Treasurer Agent extracts the vendor, amount, and GST automatically. It validates ABNs and keeps your admin and capital works funds separate.",
    image: "/images/agents/hero-treasurer.png",
    color: "emerald",
    bgGradient: "from-emerald-500/20 to-green-500/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-600",
  },
  {
    name: "Postman Agent",
    step: "Step 3",
    headline: "Levy notices sent with one click",
    story: "Enter your budget. Your Postman Agent calculates each lot's share based on unit entitlements, generates professional PDF notices, and emails them to all owners instantly.",
    image: "/images/agents/hero-postman.png",
    color: "amber",
    bgGradient: "from-amber-500/20 to-yellow-500/10",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-600",
  },
  {
    name: "Guardian Agent",
    step: "Step 4",
    headline: "Bylaw disputes settled instantly",
    story: "\"Can I install an AC unit?\" Ask your Guardian Agent any bylaw question in plain English. Get instant answers citing the exact clause from your building's rules.",
    image: "/images/agents/hero-guardian.png",
    color: "purple",
    bgGradient: "from-purple-500/20 to-violet-500/10",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-600",
  },
];

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
import { MagicDropzone } from "@/components/ui/magic-dropzone";
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

type Step = "email" | "upload" | "processing" | "results" | "already_used";

export default function StrataHubReporterPage() {
  const [step, setStep] = useState<Step>("email");
  const [sessionId, setSessionId] = useState("");
  const [reportId, setReportId] = useState<Id<"strataHubReports"> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [fileName, setFileName] = useState("");
  const [agentIndex, setAgentIndex] = useState(0);
  const [storyComplete, setStoryComplete] = useState(false);
  const [analysisReady, setAnalysisReady] = useState(false);

  // Convex hooks
  const generateUploadUrl = useMutation(api.strataHub.generateUploadUrl);
  const createReport = useMutation(api.strataHub.createReport);
  const analyzeDocument = useAction(api.actions.strataHub.analyzeDocument);
  const captureLead = useMutation(api.leads.capture);
  const report = useQuery(
    api.strataHub.getReportById,
    reportId ? { reportId } : "skip"
  );

  // Initialize session ID on mount
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  // Track when analysis is ready (but don't show results yet)
  useEffect(() => {
    if (report?.status === "completed" || report?.status === "failed") {
      setAnalysisReady(true);
    }
  }, [report?.status]);

  // Don't auto-transition - user must click to proceed
  // Results only show when user explicitly dismisses the carousel

  // Cycle through agent story during processing - must watch all 4
  useEffect(() => {
    if (step !== "processing") return;

    // Reset state when entering processing
    setAgentIndex(0);
    setStoryComplete(false);
    setAnalysisReady(false);

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex >= agentStory.length) {
        // Story complete - user has seen all agents
        setStoryComplete(true);
        clearInterval(interval);
      } else {
        setAgentIndex(currentIndex);
      }
    }, 5000); // 5 seconds per agent = 20 seconds total

    return () => clearInterval(interval);
  }, [step]);

  // Handle email submission - gate BEFORE upload
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsCheckingAccess(true);
    try {
      // Check if email has already used the tool
      const response = await fetch(`/api/check-strata-hub-access?email=${encodeURIComponent(email)}`);
      const { hasUsed } = await response.json();

      if (hasUsed) {
        setStep("already_used");
      } else {
        // Capture lead immediately
        await captureLead({
          email,
          name: name || undefined,
          source: "strata_hub_reporter",
        });
        setStep("upload");
      }
    } catch (error) {
      console.error("Access check failed:", error);
      // On error, allow access (fail open for better UX)
      await captureLead({
        email,
        name: name || undefined,
        source: "strata_hub_reporter",
      });
      setStep("upload");
    } finally {
      setIsCheckingAccess(false);
    }
  };

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
        setStep("upload");
        setIsUploading(false);
      }
    },
    [sessionId, generateUploadUrl, createReport, analyzeDocument]
  );

  return (
    <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-[#3d3d5c] hover:text-[#FF6B35] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#FFF0EB] rounded-[20px] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[#FF6B35]" />
          </div>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-[#1a1a2e] mb-3">
            Strata Hub Report Generator
          </h1>
          <p className="text-lg text-[#3d3d5c] max-w-xl mx-auto">
            Upload your AGM Minutes or Financial Statement and we&apos;ll extract the
            key data points required for NSW Strata Hub reporting.
          </p>
        </div>

        {/* Email Step - Gate BEFORE upload */}
        {step === "email" && (
          <Card className="border border-[#E8E4DE] rounded-[20px] bg-white shadow-sm max-w-xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-lg font-medium flex items-center justify-center gap-2">
                <Mail className="w-5 h-5 text-[#FF6B35]" />
                Get Your Free Report
              </CardTitle>
              <CardDescription className="text-sm text-[#6b6b8a]">
                Enter your email and we&apos;ll analyze your document in ~30 seconds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-[#3d3d5c]">
                    Name (optional)
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-[#3d3d5c]">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 rounded-lg"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isCheckingAccess}
                  className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-lg"
                >
                  {isCheckingAccess ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-[#6b6b8a] text-center">
                  One free report per email. We&apos;ll send occasional compliance tips.
                </p>
              </form>

              <div className="mt-6 p-4 bg-gradient-to-r from-[#FFF0EB] to-[#FFF0EB] rounded-lg border border-[#E8E4DE]">
                <h4 className="text-sm font-medium text-[#1a1a2e] mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  What we extract from your document:
                </h4>
                <ul className="text-sm text-[#3d3d5c] space-y-1.5">
                  <li className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#FF6B35]" />
                    Strata Plan Number
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#FF6B35]" />
                    Last AGM Date
                  </li>
                  <li className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-[#FF6B35]" />
                    Admin & Capital Works Fund Balances
                  </li>
                  <li className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-[#FF6B35]" />
                    AFSS (Fire Safety) Date
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#FF6B35]" />
                    Insurance Replacement Value
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Already Used Step */}
        {step === "already_used" && (
          <Card className="border-2 border-amber-200 bg-amber-50 rounded-xl max-w-xl mx-auto">
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-amber-900 mb-2">
                You&apos;ve Already Used Your Free Report
              </h3>
              <p className="text-sm text-amber-800 mb-6">
                Each email address can only use the Strata Hub Reporter once.
                Want unlimited reports and full compliance automation?
              </p>
              <div className="space-y-3">
                <Link href="/sign-up">
                  <Button className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-lg">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full rounded-lg"
                  onClick={() => {
                    setEmail("");
                    setStep("email");
                  }}
                >
                  Use Different Email
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Step */}
        {step === "upload" && (
          <Card className="border border-[#E8E4DE] rounded-[20px] bg-white shadow-sm max-w-xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-lg font-medium flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF6B35]" />
                Upload Your Document
              </CardTitle>
              <CardDescription className="text-sm text-[#6b6b8a]">
                Supports AGM Minutes, Financial Statements, or Annual Reports (PDF)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MagicDropzone
                onFileAccepted={handleFileUpload}
                isUploading={isUploading}
                accept="application/pdf"
                maxSizeMB={10}
                title="Drag & drop your document"
                description="or tap to scan with camera"
              />

              <p className="text-xs text-[#6b6b8a] text-center mt-4">
                Analyzing for: <span className="font-medium text-[#3d3d5c]">{email}</span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Processing Step - Premium Agent Story Carousel */}
        {step === "processing" && (
          <div className="max-w-2xl mx-auto">
            {/* Dark premium container */}
            <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] rounded-3xl p-8 shadow-2xl border border-white/10">

              {/* Header with status */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-[#FF6B35] animate-spin" />
                    </div>
                    {analysisReady && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {analysisReady ? "Analysis complete!" : "Analyzing document..."}
                    </p>
                    <p className="text-xs text-[#F8F5F0]/60">{fileName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6b6b8a] uppercase tracking-wide">Agent {agentIndex + 1} of 4</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-8">
                <div className="h-1 bg-[#3d3d5c] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6B35] via-emerald-500 to-violet-500 transition-all duration-500 ease-out"
                    style={{ width: `${((agentIndex + 1) / agentStory.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Intro text */}
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                  Meet Your Team
                </h2>
                <p className="text-[#F8F5F0]/70 text-sm">
                  Four specialized agents, working 24/7 for your scheme
                </p>
              </div>

              {/* Agent Card - Light background for contrast */}
              <div className={`relative rounded-[20px] border-2 ${agentStory[agentIndex].borderColor} bg-white shadow-xl overflow-hidden transition-all duration-700 ease-out`}>
                {/* Subtle colored accent bar at top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${agentStory[agentIndex].bgGradient}`} />

                <div className="relative flex flex-col md:flex-row items-center">
                  {/* Agent Image - with subtle colored background */}
                  <div className={`relative w-full md:w-56 h-56 flex-shrink-0 bg-gradient-to-br ${agentStory[agentIndex].bgGradient}`}>
                    <Image
                      src={agentStory[agentIndex].image}
                      alt={agentStory[agentIndex].name}
                      fill
                      className="object-contain p-4 drop-shadow-lg transition-transform duration-700 ease-out"
                      priority
                    />
                  </div>

                  {/* Agent Story Content */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${agentStory[agentIndex].textColor} bg-[#F8F5F0]`}>
                        {agentStory[agentIndex].step}
                      </span>
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${agentStory[agentIndex].textColor}`}>
                      {agentStory[agentIndex].name}
                    </h3>
                    <p className="text-lg font-semibold text-[#1a1a2e] mb-3">
                      {agentStory[agentIndex].headline}
                    </p>
                    <p className="text-[#3d3d5c] leading-relaxed text-sm md:text-base">
                      {agentStory[agentIndex].story}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step indicators */}
              <div className="flex justify-center gap-3 mt-6">
                {agentStory.map((agent, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ${
                      idx === agentIndex
                        ? `bg-gradient-to-br ${agent.bgGradient} border-2 ${agent.borderColor} scale-110 shadow-lg`
                        : idx < agentIndex
                        ? "bg-[#3d3d5c] border border-[#6b6b8a]"
                        : "bg-[#1a1a2e] border border-[#3d3d5c]"
                    }`}
                  >
                    {idx < agentIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className={`text-xs font-bold ${idx === agentIndex ? agentStory[idx].textColor : "text-[#6b6b8a]"}`}>
                        {idx + 1}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Show when story is complete and analysis is ready */}
              {storyComplete && analysisReady ? (
                <div className="mt-8 pt-6 border-t border-white/10 animate-in fade-in duration-500">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">Your report is ready!</span>
                    </div>
                    <p className="text-[#F8F5F0]/80 text-sm">
                      Want all 4 agents working for your scheme?
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] text-white font-semibold rounded-full hover:from-[#E85A2A] hover:to-[#FF6B35] transition-all shadow-lg shadow-[#FF6B35]/25 hover:shadow-[#FF6B35]/40 hover:-translate-y-0.5"
                    >
                      Start 14-Day Free Trial
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setStep("results")}
                      className="inline-flex items-center gap-2 px-6 py-3 text-[#F8F5F0]/60 hover:text-white transition-colors text-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      Skip, show my report
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Progress indicator while watching */}
                  {!storyComplete && (
                    <div className="mt-6 text-center">
                      <p className="text-[#6b6b8a] text-xs">
                        {analysisReady ? (
                          <span className="text-emerald-400">Analysis complete — watch the tour to continue</span>
                        ) : (
                          <span>Analyzing your document while you explore...</span>
                        )}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
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
                          We&apos;ve extracted the Strata Hub data points from your document.
                          Copy these values directly into the Strata Hub portal.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Grid */}
                <Card className="border border-[#E8E4DE] rounded-[20px] bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Extracted Data
                    </CardTitle>
                    <CardDescription>
                      Your Strata Hub report data — ready to copy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Strata Plan Number */}
                      <div className="p-4 bg-[#F8F5F0] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-4 h-4 text-[#6b6b8a]" />
                          <span className="text-xs font-medium text-[#6b6b8a] uppercase">
                            Strata Plan
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-[#1a1a2e]">
                          {report.extractedData?.strataPlanNumber || "Not found"}
                        </p>
                      </div>

                      {/* Total Lots */}
                      <div className="p-4 bg-[#F8F5F0] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-[#6b6b8a]" />
                          <span className="text-xs font-medium text-[#6b6b8a] uppercase">
                            Total Lots
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-[#1a1a2e]">
                          {report.extractedData?.totalLots ?? "Not found"}
                        </p>
                      </div>

                      {/* Last AGM Date */}
                      <div className="p-4 bg-[#F8F5F0] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-[#6b6b8a]" />
                          <span className="text-xs font-medium text-[#6b6b8a] uppercase">
                            Last AGM Date
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-[#1a1a2e]">
                          {report.extractedData?.lastAgmDate || "Not found"}
                        </p>
                      </div>

                      {/* AFSS Date */}
                      <div className="p-4 bg-[#F8F5F0] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Flame className="w-4 h-4 text-[#6b6b8a]" />
                          <span className="text-xs font-medium text-[#6b6b8a] uppercase">
                            Last AFSS Date
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-[#1a1a2e]">
                          {report.extractedData?.lastAfssDate || "Not found"}
                        </p>
                      </div>

                      {/* Admin Fund Balance */}
                      <div className="p-4 bg-[#F8F5F0] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-[#6b6b8a]" />
                          <span className="text-xs font-medium text-[#6b6b8a] uppercase">
                            Admin Fund Balance
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-[#1a1a2e]">
                          {formatCurrency(report.extractedData?.adminFundBalance)}
                        </p>
                      </div>

                      {/* Capital Works Fund */}
                      <div className="p-4 bg-[#F8F5F0] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-[#6b6b8a]" />
                          <span className="text-xs font-medium text-[#6b6b8a] uppercase">
                            Capital Works Fund
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-[#1a1a2e]">
                          {formatCurrency(report.extractedData?.capitalWorksFundBalance)}
                        </p>
                      </div>

                      {/* Insurance Value */}
                      <div className="p-4 bg-[#F8F5F0] rounded-lg md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-[#6b6b8a]" />
                          <span className="text-xs font-medium text-[#6b6b8a] uppercase">
                            Insurance Replacement Value
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-[#1a1a2e]">
                          {formatCurrency(report.extractedData?.insuranceReplacementValue)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <div className="bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] rounded-[20px] p-8 text-center">
                  <h2 className="text-xl font-display font-semibold text-white mb-3">
                    Ready to automate your Strata Hub reporting?
                  </h2>
                  <p className="text-white/90 mb-6 max-w-md mx-auto">
                    StrataGenie tracks your AGM dates, generates compliant documents,
                    and reminds you when Strata Hub reports are due.
                  </p>
                  <Link href="/sign-up">
                    <Button className="bg-white text-[#3d3d5c] hover:bg-[#F8F5F0] rounded-lg px-6 py-2.5">
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
            <h2 className="text-xl font-display font-semibold text-[#1a1a2e] mb-6 text-center">
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
                  <div className="w-10 h-10 bg-[#FFF0EB] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#FF6B35] font-semibold">{item.step}</span>
                  </div>
                  <h3 className="font-medium text-[#1a1a2e] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#3d3d5c]">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
