"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { TrialBanner } from "@/components/dashboard/trial-banner";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { CaptureFab } from "@/components/dashboard/capture-fab";

// Mobile nav context for sharing state
const MobileNavContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({ isOpen: false, setIsOpen: () => {} });

export const useMobileNav = () => useContext(MobileNavContext);

// FAB capture context for handling mobile camera captures
type CaptureHandler = (file: File) => void;
const CaptureContext = createContext<{
  onCapture: CaptureHandler | null;
  setOnCapture: (handler: CaptureHandler | null) => void;
}>({ onCapture: null, setOnCapture: () => {} });

export const useCapture = () => useContext(CaptureContext);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [captureHandler, setCaptureHandler] = useState<CaptureHandler | null>(null);

  // Wrapper to update capture handler from children
  const setOnCapture = useCallback((handler: CaptureHandler | null) => {
    setCaptureHandler(() => handler);
  }, []);

  // Default capture handler - navigates to finance page with file
  const handleCapture = useCallback((file: File) => {
    if (captureHandler) {
      captureHandler(file);
    } else {
      // Default: navigate to finance page
      // Store file in session storage for the finance page to pick up
      const reader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem('pendingCapture', JSON.stringify({
          name: file.name,
          type: file.type,
          data: reader.result,
        }));
        router.push('/dashboard/finance');
      };
      reader.readAsDataURL(file);
    }
  }, [captureHandler, router]);

  // Sync user and get current user data
  const storeUser = useMutation(api.users.store);
  const currentUser = useQuery(api.users.currentUser);

  // Sync user on mount
  useEffect(() => {
    const syncUser = async () => {
      try {
        await storeUser();
      } catch {
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
      <div className="min-h-screen bg-warmth-pulse flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Get the first scheme's trial status for the banner
  const firstScheme = currentUser?.schemes?.[0];

  return (
    <MobileNavContext.Provider value={{ isOpen: mobileNavOpen, setIsOpen: setMobileNavOpen }}>
      <CaptureContext.Provider value={{ onCapture: captureHandler, setOnCapture }}>
        {/* Mobile navigation sheet */}
        <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

        {/* Trial banner - shown if user is on trial */}
        {firstScheme && <TrialBanner schemeId={firstScheme._id} />}
        {children}

        {/* Mobile capture FAB - always visible on mobile */}
        <CaptureFab onCapture={handleCapture} />
      </CaptureContext.Provider>
    </MobileNavContext.Provider>
  );
}
