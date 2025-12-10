"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Vault page redirect (CH-0013)
 *
 * The Vault feature has been consolidated into Strata Hub.
 * This page redirects users to the new unified compliance page.
 */
export default function VaultPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/strata-hub");
  }, [router]);

  return (
    <div className="min-h-screen bg-warmth-pulse flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to Strata Hub...</p>
      </div>
    </div>
  );
}
