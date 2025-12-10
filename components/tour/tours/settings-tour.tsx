"use client";

import { useEffect } from "react";
import { useTour } from "../tour-provider";
import { TourTooltip } from "../tour-tooltip";

export function SettingsTour() {
  const { activeTour, hasCompletedTour, startTour, setTotalSteps } = useTour();

  const tourId = "settings";
  const steps = 5;

  // Auto-start tour on first visit
  useEffect(() => {
    if (!hasCompletedTour(tourId) && activeTour === null) {
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
        title="Scheme Settings"
        description={
          <>
            Configure your scheme details here. This information is used across
            the app for documents, reports, and compliance tracking.
          </>
        }
        position="bottom"
      />

      <TourTooltip
        step={1}
        targetSelector="[data-tour='lot-count']"
        title="Number of Lots"
        description={
          <>
            This affects your pricing tier and levy calculations. Make sure it
            matches your strata plan. You can manage individual lots in the{" "}
            <strong>Strata Roll</strong> from the Finance page.
          </>
        }
        position="bottom"
      />

      <TourTooltip
        step={2}
        targetSelector="[data-tour='agm-date']"
        title="Last AGM Date"
        description={
          <>
            <strong>Critical for compliance!</strong> This date determines when
            your next AGM is due (within 15 months). We&apos;ll remind you to send
            notices and prepare.
          </>
        }
        position="bottom"
      />

      <TourTooltip
        step={3}
        targetSelector="[data-tour='financial-settings']"
        title="Financial Settings"
        description={
          <>
            Set your <strong>opening balances</strong> for Admin and Capital Works
            funds. These are used in your statutory financial report. Also set
            your financial year end date.
          </>
        }
        position="top"
      />

      <TourTooltip
        step={4}
        targetSelector="[data-tour='billing-section']"
        title="Billing & Subscription"
        description={
          <>
            Manage your subscription here. View your current plan, trial status,
            and access the Stripe billing portal to update payment methods.
          </>
        }
        position="top"
      />
    </>
  );
}
