"use client";

import { useEffect } from "react";
import { useTour } from "../tour-provider";
import { TourTooltip } from "../tour-tooltip";

export function DashboardTour() {
  const { activeTour, hasCompletedTour, startTour, setTotalSteps } = useTour();

  const tourId = "dashboard";
  const steps = 5;

  // Auto-start tour on first visit
  useEffect(() => {
    if (!hasCompletedTour(tourId) && activeTour === null) {
      // Small delay to let the page render
      const timer = setTimeout(() => {
        startTour(tourId);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedTour, activeTour, startTour]);

  // Set total steps when tour is active
  useEffect(() => {
    if (activeTour === tourId) {
      setTotalSteps(steps);
    }
  }, [activeTour, setTotalSteps]);

  if (activeTour !== tourId) return null;

  return (
    <>
      <TourTooltip
        step={0}
        title="Welcome to your Dashboard!"
        description={
          <>
            This is your compliance command center. Here you can see your{" "}
            <strong>compliance score</strong>, upcoming tasks, and quickly access
            all features.
          </>
        }
        position="bottom"
      />

      <TourTooltip
        step={1}
        targetSelector="[data-tour='compliance-score']"
        title="Your Compliance Score"
        description={
          <>
            This shows how ready you are for your annual Strata Hub submission.
            Complete the missing items to reach 100% and stay compliant with NSW
            regulations.
          </>
        }
        position="left"
      />

      <TourTooltip
        step={2}
        targetSelector="[data-tour='quick-upload']"
        title="Quick Document Upload"
        description={
          <>
            Drop insurance certificates, fire safety statements, or invoices here.
            Our AI will automatically extract the important details and file them
            correctly.
          </>
        }
        position="right"
      />

      <TourTooltip
        step={3}
        targetSelector="[data-tour='task-list']"
        title="Your Compliance Tasks"
        description={
          <>
            These tasks keep you on track. You&apos;ll see reminders for{" "}
            <strong>AGM notices</strong>, <strong>meeting dates</strong>, and{" "}
            <strong>Strata Hub filings</strong>. Click any task to take action.
          </>
        }
        position="left"
      />

      <TourTooltip
        step={4}
        targetSelector="[data-tour='strata-hub-link']"
        title="Prepare Your Annual Report"
        description={
          <>
            When it&apos;s time to submit your annual report to NSW Strata Hub,
            click here. We&apos;ll help you collect all required information and
            generate a summary you can copy-paste into the portal.
          </>
        }
        position="right"
      />
    </>
  );
}
