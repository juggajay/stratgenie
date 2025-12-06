"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSelectedScheme } from "@/hooks/use-selected-scheme";
import { SchemeSelector } from "@/components/dashboard/scheme-selector";
import { BylawUpload } from "@/components/guardian/bylaw-upload";
import { ChatInterface } from "@/components/guardian/chat-interface";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, FileText, RefreshCw } from "lucide-react";

function BylawStatus({ schemeId }: { schemeId: Id<"schemes"> }) {
  const bylaw = useQuery(api.guardian.getActiveBylaw, { schemeId });
  const [showReplace, setShowReplace] = useState(false);

  if (bylaw === undefined) {
    // Loading state
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 border-t-transparent animate-spin" />
          Loading bylaws...
        </div>
      </div>
    );
  }

  // No bylaws uploaded yet - show upload
  if (!bylaw) {
    return <BylawUpload schemeId={schemeId} />;
  }

  // Bylaws are processing
  if (bylaw.status === "processing") {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-900/20 p-8 text-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <FileText className="h-10 w-10 text-emerald-400" />
          <p className="font-medium text-emerald-300">Processing bylaws...</p>
          <p className="text-sm text-emerald-400/70">
            Extracting text and building search index
          </p>
        </div>
      </div>
    );
  }

  // Bylaws ready - show chat with replace option
  return (
    <div className="space-y-4">
      {/* Bylaw info header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span className="font-medium">{bylaw.fileName}</span>
          {bylaw.totalChunks && (
            <span className="text-muted-foreground/70">
              ({bylaw.totalChunks} sections indexed)
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReplace(!showReplace)}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Replace Bylaws
        </Button>
      </div>

      {/* Replace bylaws section */}
      {showReplace && (
        <div className="mb-4">
          <BylawUpload
            schemeId={schemeId}
            onUploadComplete={() => setShowReplace(false)}
          />
        </div>
      )}

      {/* Chat interface */}
      {!showReplace && <ChatInterface schemeId={schemeId} />}
    </div>
  );
}

export default function GuardianPage() {
  const { selectedSchemeId, setSelectedSchemeId } = useSelectedScheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Editorial Light Theme */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-[#E8E4DE] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <span className="text-2xl font-display font-medium tracking-tight">
                  <span className="text-foreground">Strata</span>
                  <span className="text-[#FF6B35]">Genie</span>
                </span>
              </div>
              <div className="h-6 w-px bg-[#E8E4DE]" />
              <div>
                <div className="flex items-center gap-2">
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
                    <Shield className="h-5 w-5 text-[#FF6B35]" />
                    Guardian
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI-powered bylaw Q&A - ask questions about your scheme&apos;s rules
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Left column: Scheme selector */}
          <div>
            <SchemeSelector
              selectedSchemeId={selectedSchemeId}
              onSchemeSelect={setSelectedSchemeId}
            />
          </div>

          {/* Right column: Guardian content */}
          <div>
            {selectedSchemeId ? (
              <BylawStatus schemeId={selectedSchemeId} />
            ) : (
              <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                  Select a scheme to access the Guardian
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <footer className="mt-12 pt-6 border-t border-[#E8E4DE]">
          <p className="text-xs text-muted-foreground text-center">
            The Guardian provides informational answers based on your uploaded bylaws.
            This is not legal advice. Consult a qualified lawyer for legal matters.
          </p>
        </footer>
      </main>
    </div>
  );
}
