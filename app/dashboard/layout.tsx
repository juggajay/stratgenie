"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { TrialBanner } from "@/components/dashboard/trial-banner";
import { MobileNav } from "@/components/dashboard/mobile-nav";

// Mobile nav context for sharing state
const MobileNavContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({ isOpen: false, setIsOpen: () => {} });

export const useMobileNav = () => useContext(MobileNavContext);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Sync user and get current user data
  const storeUser = useMutation(api.users.store);
  const currentUser = useQuery(api.users.currentUser);

  // Sync user on mount
  useEffect(() => {
    const syncUser = async () => {
      try {
        await storeUser();
      } catch (e) {
        // User might not be authenticated - redirect to home
        console.log("User sync failed - may not be authenticated");
      }
    };
    syncUser();
  }, [storeUser]);

  // Route protection logic
  useEffect(() => {
    // Still loading
    if (currentUser === undefined) {
      return;
    }

    // User not authenticated (null returned)
    if (currentUser === null) {
      // For now, redirect to home. When Clerk is set up, this would go to sign-in
      router.push("/");
      return;
    }

    // User authenticated but has no schemes - redirect to onboarding
    if (!currentUser.schemes || currentUser.schemes.length === 0) {
      router.push("/onboarding");
      return;
    }

    // User has schemes - allow access
    setIsReady(true);
  }, [currentUser, router]);

  // Loading state
  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Get the first scheme's trial status for the banner
  const firstScheme = currentUser?.schemes?.[0];

  return (
    <MobileNavContext.Provider value={{ isOpen: mobileNavOpen, setIsOpen: setMobileNavOpen }}>
      {/* Mobile navigation sheet */}
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      {/* Trial banner - shown if user is on trial */}
      {firstScheme && <TrialBanner schemeId={firstScheme._id} />}
      {children}
    </MobileNavContext.Provider>
  );
}
