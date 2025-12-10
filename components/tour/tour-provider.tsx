"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// Tour IDs for each page/feature
export type TourId =
  | "dashboard"
  | "finance"
  | "strata-hub"
  | "settings"
  | "strata-roll"
  | "guardian";

interface TourContextType {
  // Check if a tour has been completed
  hasCompletedTour: (tourId: TourId) => boolean;
  // Mark a tour as completed
  completeTour: (tourId: TourId) => void;
  // Reset a specific tour (for testing)
  resetTour: (tourId: TourId) => void;
  // Reset all tours
  resetAllTours: () => void;
  // Current active tour
  activeTour: TourId | null;
  // Current step in active tour
  currentStep: number;
  // Start a tour
  startTour: (tourId: TourId) => void;
  // Go to next step
  nextStep: () => void;
  // Go to previous step
  prevStep: () => void;
  // End current tour
  endTour: (markComplete?: boolean) => void;
  // Skip current tour
  skipTour: () => void;
  // Total steps for current tour
  totalSteps: number;
  // Set total steps (called by tour component)
  setTotalSteps: (steps: number) => void;
}

const TourContext = createContext<TourContextType | null>(null);

const STORAGE_KEY = "stratagenie-completed-tours";

export function TourProvider({ children }: { children: ReactNode }) {
  const [completedTours, setCompletedTours] = useState<Set<TourId>>(new Set());
  const [activeTour, setActiveTour] = useState<TourId | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load completed tours from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TourId[];
        setCompletedTours(new Set(parsed));
      }
    } catch {
      // Ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when completed tours change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedTours]));
    }
  }, [completedTours, isLoaded]);

  const hasCompletedTour = useCallback((tourId: TourId) => {
    return completedTours.has(tourId);
  }, [completedTours]);

  const completeTour = useCallback((tourId: TourId) => {
    setCompletedTours(prev => new Set([...prev, tourId]));
  }, []);

  const resetTour = useCallback((tourId: TourId) => {
    setCompletedTours(prev => {
      const next = new Set(prev);
      next.delete(tourId);
      return next;
    });
  }, []);

  const resetAllTours = useCallback(() => {
    setCompletedTours(new Set());
  }, []);

  const startTour = useCallback((tourId: TourId) => {
    setActiveTour(tourId);
    setCurrentStep(0);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Tour complete
      if (activeTour) {
        completeTour(activeTour);
      }
      setActiveTour(null);
      setCurrentStep(0);
    }
  }, [currentStep, totalSteps, activeTour, completeTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const endTour = useCallback((markComplete = true) => {
    if (markComplete && activeTour) {
      completeTour(activeTour);
    }
    setActiveTour(null);
    setCurrentStep(0);
  }, [activeTour, completeTour]);

  const skipTour = useCallback(() => {
    if (activeTour) {
      completeTour(activeTour);
    }
    setActiveTour(null);
    setCurrentStep(0);
  }, [activeTour, completeTour]);

  return (
    <TourContext.Provider value={{
      hasCompletedTour,
      completeTour,
      resetTour,
      resetAllTours,
      activeTour,
      currentStep,
      startTour,
      nextStep,
      prevStep,
      endTour,
      skipTour,
      totalSteps,
      setTotalSteps,
    }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
