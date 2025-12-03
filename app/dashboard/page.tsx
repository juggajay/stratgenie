"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useSelectedScheme } from "@/hooks/use-selected-scheme";
import { SchemeSelector } from "@/components/dashboard/scheme-selector";
import { ComplianceCard } from "@/components/dashboard/compliance-card";
import { TaskList } from "@/components/dashboard/task-list";
import { SchemeSettingsForm } from "@/components/scheme/scheme-settings-form";
import { SetupBanner } from "@/components/dashboard/setup-banner";
import { StrataRollList } from "@/components/levies/strata-roll-list";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Receipt, Shield, Building } from "lucide-react";

export default function DashboardPage() {
  const { selectedSchemeId, setSelectedSchemeId } = useSelectedScheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [strataRollOpen, setStrataRollOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background bg-grain">
      {/* Header */}
      <header className="bg-header border-b border-header/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight text-header-foreground font-display">
                StrataGenie
              </span>
            </div>
            <div className="h-6 w-px bg-header-foreground/20" />
            <div>
              <h1 className="text-lg font-medium tracking-tight text-header-foreground">
                Dashboard
              </h1>
              <p className="text-sm text-header-foreground/70">
                Your strata compliance overview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/guardian">
              <Button
                variant="outline"
                className="rounded-lg border-border text-foreground hover:bg-accent transition-smooth"
              >
                <Shield className="h-4 w-4 mr-2" />
                Guardian
              </Button>
            </Link>
            <Link href="/dashboard/finance">
              <Button
                variant="outline"
                className="rounded-lg border-border text-foreground hover:bg-accent transition-smooth"
              >
                <Receipt className="h-4 w-4 mr-2" />
                Finance
              </Button>
            </Link>
            {selectedSchemeId && (
              <Sheet open={strataRollOpen} onOpenChange={setStrataRollOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-lg border-border text-foreground hover:bg-accent transition-smooth"
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Strata Roll
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Strata Roll
                    </SheetTitle>
                    <SheetDescription>
                      Manage lots, owners, and unit entitlements for levy calculations.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <StrataRollList schemeId={selectedSchemeId} />
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {selectedSchemeId && (
              <SchemeSettingsForm
                schemeId={selectedSchemeId}
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
              />
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Setup incomplete banner */}
        {selectedSchemeId && (
          <SetupBanner
            schemeId={selectedSchemeId}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Left column: Scheme selector */}
          <div>
            <SchemeSelector
              selectedSchemeId={selectedSchemeId}
              onSchemeSelect={setSelectedSchemeId}
            />
          </div>

          {/* Right column: Compliance cards + tasks */}
          <div className="space-y-6">
            {selectedSchemeId ? (
              <>
                <ComplianceCard
                  schemeId={selectedSchemeId}
                  onOpenSettings={() => setSettingsOpen(true)}
                />
                <TaskList schemeId={selectedSchemeId} />
              </>
            ) : (
              <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
                <p className="text-muted-foreground">
                  Select a scheme to view compliance status
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <footer className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground/70 text-center">
            This tool provides administrative guidance only, not legal advice.
            Always verify compliance requirements with NSW Fair Trading.
          </p>
        </footer>
      </main>
    </div>
  );
}
