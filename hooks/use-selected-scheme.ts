"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const STORAGE_KEY = "stratagenie-selected-scheme";

export function useSelectedScheme() {
  const [selectedSchemeId, setSelectedSchemeId] = useState<Id<"schemes"> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch the scheme data when we have a selectedSchemeId
  const scheme = useQuery(
    api.schemes.getScheme,
    selectedSchemeId ? { schemeId: selectedSchemeId } : "skip"
  );

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSelectedSchemeId(stored as Id<"schemes">);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when changed
  const setScheme = (schemeId: Id<"schemes"> | null) => {
    setSelectedSchemeId(schemeId);
    if (schemeId) {
      localStorage.setItem(STORAGE_KEY, schemeId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    selectedSchemeId,
    setSelectedSchemeId: setScheme,
    isLoaded,
    scheme: scheme ?? null,
  };
}
