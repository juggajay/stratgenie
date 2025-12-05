"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { Receipt, Shield, Building, Archive } from "lucide-react";

export default function DashboardPage() {
  // All existing state and logic preserved exactly
  const { selectedSchemeId, setSelectedSchemeId } = useSelectedScheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [strataRollOpen, setStrataRollOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Light editorial theme */}
      <header className="bg-white border-b border-[#E8E4DE] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo/logo-seablue-transparent-v3.png"
                alt="StrataGenie"
                width={320}
                height={80}
                className="h-20 w-auto"
                priority
              />
            </div>
            <div className="h-6 w-px bg-[#E8E4DE]" />
            <div>
              <h1 className="text-lg font-display font-bold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Your strata compliance overview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/guardian">
              <Button
                variant="outline"
              >
                <Shield className="h-4 w-4 mr-2" />
                Guardian
              </Button>
            </Link>
            <Link href="/dashboard/finance">
              <Button
                variant="outline"
              >
                <Receipt className="h-4 w-4 mr-2" />
                Finance
              </Button>
            </Link>
            <Link href="/dashboard/vault">
              <Button
                variant="outline"
              >
                <Archive className="h-4 w-4 mr-2" />
                Vault
              </Button>
            </Link>
            {selectedSchemeId && (
              <Sheet open={strataRollOpen} onOpenChange={setStrataRollOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Strata Roll
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 font-display">
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
        {/* Setup incomplete banner - logic preserved */}
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
              <div className="rounded-xl border border-[#E8E4DE] bg-white p-8 text-center">
                <p className="text-muted-foreground">
                  Select a scheme to view compliance status
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <footer className="mt-12 pt-6 border-t border-[#E8E4DE]">
          <p className="text-xs text-muted-foreground text-center">
            This tool provides administrative guidance only, not legal advice.
            Always verify compliance requirements with NSW Fair Trading.
          </p>
        </footer>
      </main>
    </div>
  );
}
