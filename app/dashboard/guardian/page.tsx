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
import { ArrowLeft, Shield, FileText, RefreshCw, Menu } from "lucide-react";
import { useMobileNav } from "../layout";

function BylawStatus({ schemeId }: { schemeId: Id<"schemes"> }) {
  const bylaw = useQuery(api.guardian.getActiveBylaw, { schemeId });
  const [showReplace, setShowReplace] = useState(false);

  if (bylaw === undefined) {
    // Loading state
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-muted-foreground">
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
  const { setIsOpen: setMobileNavOpen } = useMobileNav();

  return (
    <div className="min-h-screen bg-warmth-pulse">
      {/* Header - Editorial Light Theme */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-[#E8E4DE] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Mobile hamburger menu */}
              <button
                onClick={() => setMobileNavOpen(true)}
                className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center">
                <span className="text-xl sm:text-2xl font-display font-medium tracking-tight">
                  <span className="text-foreground">Strata</span>
                  <span className="text-[#FF6B35]">Genie</span>
                </span>
              </div>
              {/* Desktop breadcrumb - hidden on mobile */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="h-6 w-px bg-[#E8E4DE]" />
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
            </div>
          </div>
        </div>

        {/* Mobile page title - shown below header on small screens */}
        <div className="sm:hidden px-4 pb-3 border-t border-[#E8E4DE] pt-2 bg-white/50">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-2 -ml-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-base font-display font-bold tracking-tight text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#FF6B35]" />
              Guardian
            </h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[280px_1fr]">
          {/* Left column: Scheme selector */}
          <div className="animate-slide-in-left">
            <SchemeSelector
              selectedSchemeId={selectedSchemeId}
              onSchemeSelect={setSelectedSchemeId}
            />
          </div>

          {/* Right column: Guardian content */}
          <div className="animate-fade-slide-in animate-delay-1">
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
