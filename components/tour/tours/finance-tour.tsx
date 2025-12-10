"use client";

import { useEffect } from "react";
import { useTour } from "../tour-provider";
import { TourTooltip } from "../tour-tooltip";

export function FinanceTour() {
  const { activeTour, hasCompletedTour, startTour, setTotalSteps } = useTour();

  const tourId = "finance";
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
        title="Welcome to Finance"
        description={
          <>
            This is where you manage your scheme&apos;s money. Track{" "}
            <strong>expenses</strong> from invoices, create{" "}
            <strong>levy runs</strong> for lot owners, and generate{" "}
            <strong>statutory reports</strong>.
          </>
        }
        position="bottom"
      />

      <TourTooltip
        step={1}
        targetSelector="[data-tour='expenses-tab']"
        title="Track Expenses"
        description={
          <>
            Upload invoices and receipts here. Our AI reads each document and
            extracts the vendor, amount, GST, and category automatically. You
            just review and approve.
          </>
        }
        position="bottom"
      />

      <TourTooltip
        step={2}
        targetSelector="[data-tour='invoice-upload']"
        title="Upload Invoices"
        description={
          <>
            Drag and drop PDFs or photos of invoices. Works great with phone
            photos! The AI will process them in seconds.
          </>
        }
        position="bottom"
      />

      <TourTooltip
        step={3}
        targetSelector="[data-tour='income-tab']"
        title="Manage Income & Levies"
        description={
          <>
            Switch to the Income tab to create levy runs. This is how you bill
            lot owners their quarterly or annual contributions.
          </>
        }
        position="bottom"
      />

      <TourTooltip
        step={4}
        targetSelector="[data-tour='strata-roll-button']"
        title="Set Up Your Strata Roll"
        description={
          <>
            <strong>Important!</strong> Before creating levies, add your lots and
            their unit entitlements. This determines how much each owner pays.
            Click &quot;Strata Roll&quot; to get started.
          </>
        }
        position="left"
      />

      <TourTooltip
        step={5}
        targetSelector="[data-tour='reports-tab']"
        title="Generate Financial Reports"
        description={
          <>
            At financial year end, generate your statutory financial report here.
            It includes opening/closing balances, income, and expenses in the
            format required by NSW regulations.
          </>
        }
        position="bottom"
      />
    </>
  );
}
