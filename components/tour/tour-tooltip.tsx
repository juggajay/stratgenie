"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { useTour } from "./tour-provider";

interface TourTooltipProps {
  // Target element selector or ref
  targetSelector?: string;
  // Position relative to target
  position?: "top" | "bottom" | "left" | "right";
  // Which step this tooltip appears on (0-indexed)
  step: number;
  // Title of the tooltip
  title: string;
  // Description/content
  description: string | ReactNode;
  // Optional action button
  action?: {
    label: string;
    onClick: () => void;
  };
  // Spotlight the target element
  spotlight?: boolean;
}

export function TourTooltip({
  targetSelector,
  position = "bottom",
  step,
  title,
  description,
  action,
  spotlight = true,
}: TourTooltipProps) {
  const { activeTour, currentStep, nextStep, prevStep, skipTour, totalSteps } = useTour();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Only show if this is the current step
  const isVisible = currentStep === step;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Find and track target element
  useEffect(() => {
    if (!isVisible || !targetSelector) return;

    const updatePosition = () => {
      const target = document.querySelector(targetSelector);
      if (target) {
        setTargetRect(target.getBoundingClientRect());
        // Scroll target into view if needed
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    updatePosition();

    // Update on scroll/resize
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isVisible, targetSelector]);

  if (!mounted || !isVisible || !activeTour) return null;

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) {
      // Center of screen if no target
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const padding = 16;
    const arrowSize = 8;

    switch (position) {
      case "top":
        return {
          position: "fixed",
          bottom: window.innerHeight - targetRect.top + padding + arrowSize,
          left: targetRect.left + targetRect.width / 2,
          transform: "translateX(-50%)",
        };
      case "bottom":
        return {
          position: "fixed",
          top: targetRect.bottom + padding + arrowSize,
          left: targetRect.left + targetRect.width / 2,
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          position: "fixed",
          top: targetRect.top + targetRect.height / 2,
          right: window.innerWidth - targetRect.left + padding + arrowSize,
          transform: "translateY(-50%)",
        };
      case "right":
        return {
          position: "fixed",
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + padding + arrowSize,
          transform: "translateY(-50%)",
        };
    }
  };

  // Get arrow styles
  const getArrowStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      width: 0,
      height: 0,
      borderStyle: "solid",
    };

    switch (position) {
      case "top":
        return {
          ...base,
          bottom: -8,
          left: "50%",
          transform: "translateX(-50%)",
          borderWidth: "8px 8px 0 8px",
          borderColor: "white transparent transparent transparent",
        };
      case "bottom":
        return {
          ...base,
          top: -8,
          left: "50%",
          transform: "translateX(-50%)",
          borderWidth: "0 8px 8px 8px",
          borderColor: "transparent transparent white transparent",
        };
      case "left":
        return {
          ...base,
          right: -8,
          top: "50%",
          transform: "translateY(-50%)",
          borderWidth: "8px 0 8px 8px",
          borderColor: "transparent transparent transparent white",
        };
      case "right":
        return {
          ...base,
          left: -8,
          top: "50%",
          transform: "translateY(-50%)",
          borderWidth: "8px 8px 8px 0",
          borderColor: "transparent white transparent transparent",
        };
    }
  };

  const isLastStep = step === totalSteps - 1;
  const isFirstStep = step === 0;

  const content = (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
        onClick={skipTour}
      />

      {/* Spotlight cutout */}
      {spotlight && targetRect && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
            borderRadius: 12,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="z-[10000] w-80 bg-white rounded-xl shadow-2xl border border-[#E8E4DE] animate-in fade-in slide-in-from-bottom-2 duration-300"
        style={getTooltipStyle()}
      >
        {/* Arrow */}
        {targetRect && <div style={getArrowStyle()} />}

        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#FFF0EB] rounded-lg">
              <Lightbulb className="h-4 w-4 text-[#FF6B35]" />
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">
                Step {step + 1} of {totalSteps}
              </p>
            </div>
          </div>
          <button
            onClick={skipTour}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          <div className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </div>
        </div>

        {/* Action button if provided */}
        {action && (
          <div className="px-4 pb-3">
            <Button
              size="sm"
              variant="outline"
              onClick={action.onClick}
              className="w-full"
            >
              {action.label}
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8E4DE] bg-[#F8F5F0] rounded-b-xl">
          <button
            onClick={skipTour}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button
                size="sm"
                variant="ghost"
                onClick={prevStep}
                className="h-8 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              onClick={nextStep}
              className="h-8"
            >
              {isLastStep ? "Got it!" : "Next"}
              {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}
