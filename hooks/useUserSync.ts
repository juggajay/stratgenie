"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Hook to sync the current authenticated user with Convex.
 * Should be called in authenticated pages/layouts.
 *
 * Returns:
 * - user: The current user data (null if not authenticated, undefined if loading)
 * - isLoading: True while initial sync is in progress
 * - isSynced: True once user has been synced at least once this session
 */
export function useUserSync() {
  const [isSynced, setIsSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const storeUser = useMutation(api.users.store);
  const currentUser = useQuery(api.users.currentUser);

  // Sync user on mount (once per session)
  useEffect(() => {
    const syncUser = async () => {
      // Check if already synced this session
      const sessionKey = "stratagenie_user_synced";
      const alreadySynced = sessionStorage.getItem(sessionKey);

      if (alreadySynced) {
        setIsSynced(true);
        setIsLoading(false);
        return;
      }

      try {
        await storeUser();
        sessionStorage.setItem(sessionKey, "true");
        setIsSynced(true);
      } catch (e) {
        // User might not be authenticated
        console.log("User sync failed:", e);
      } finally {
        setIsLoading(false);
      }
    };

    syncUser();
  }, [storeUser]);

  return {
    user: currentUser,
    isLoading: isLoading || currentUser === undefined,
    isSynced,
  };
}

/**
 * Hook to check if the current user has any schemes.
 * Useful for route protection logic.
 */
export function useRequireScheme() {
  const { user, isLoading } = useUserSync();

  const hasSchemes = user?.schemes && user.schemes.length > 0;

  return {
    user,
    hasSchemes,
    isLoading,
    schemes: user?.schemes ?? [],
  };
}
