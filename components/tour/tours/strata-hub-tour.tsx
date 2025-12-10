"use client";

import { useEffect } from "react";
import { useTour } from "../tour-provider";
import { TourTooltip } from "../tour-tooltip";

export function StrataHubTour() {
  const { activeTour, hasCompletedTour, startTour, setTotalSteps } = useTour();

  const tourId = "strata-hub";
  const steps = 6;

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
        title="Strata Hub Compliance"
        description={
          <>
            NSW requires every strata scheme to submit an annual report to Strata
            Hub. This page helps you collect all required information and submit
            on time.
          </>
        }
        position="bottom"
      />

      <TourTooltip
        step={1}
        targetSelector="[data-tour='readiness-score']"
        title="Your Readiness Score"
        description={
          <>
            This shows how complete your submission data is. Fill in the missing
            fields below to reach 100%. You can&apos;t submit until all required
            fields are complete.
          </>
        }
        position="bottom"
      />

      <TourTooltip
        step={2}
        targetSelector="[data-tour='scheme-info']"
        title="Scheme Information"
        description={
          <>
            Basic details about your building: address, lot count, building class.
            Most of this is filled from your settings, but you can update it here.
          </>
        }
        position="bottom"
      />

      <TourTooltip
        step={3}
        targetSelector="[data-tour='emergency-contacts']"
        title="Emergency Contacts"
        description={
          <>
            NSW requires <strong>4 emergency contacts</strong> in priority order.
            Include the building manager, secretary, and at least 2 committee
            members with phone numbers.
          </>
        }
        position="bottom"
      />

      <TourTooltip
        step={4}
        targetSelector="[data-tour='document-upload']"
        title="Upload Documents"
        description={
          <>
            Upload your <strong>insurance certificate</strong> and{" "}
            <strong>fire safety statement (AFSS)</strong>. Our AI extracts key
            dates and values automatically.
          </>
        }
        position="bottom"
      />

      <TourTooltip
        step={5}
        targetSelector="[data-tour='copy-submit']"
        title="Copy & Submit"
        description={
          <>
            When ready, click <strong>&quot;Copy All&quot;</strong> to copy your
            data, then <strong>&quot;Open Portal&quot;</strong> to go to NSW
            Strata Hub. Paste the info and submit. Come back and mark as
            submitted!
          </>
        }
        position="top"
      />
    </>
  );
}
