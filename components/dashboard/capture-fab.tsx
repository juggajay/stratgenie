"use client";

import { useState } from "react";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CameraCaptureModal } from "./camera-capture-modal";

interface CaptureFabProps {
  onCapture?: (file: File) => void;
  className?: string;
}

export function CaptureFab({ onCapture, className }: CaptureFabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCapture = (file: File) => {
    setIsModalOpen(false);
    onCapture?.(file);
  };

  return (
    <>
      {/* FAB Button - Only visible on mobile */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 lg:hidden",
          "w-14 h-14 rounded-full",
          "bg-primary text-primary-foreground",
          "shadow-lg shadow-primary/30",
          "flex items-center justify-center",
          "transition-all duration-200",
          "hover:scale-105 hover:shadow-xl hover:shadow-primary/40",
          "active:scale-95",
          "animate-pulse-slow",
          className
        )}
        aria-label="Capture document"
      >
        {isModalOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Camera className="h-6 w-6" />
        )}
      </button>

      {/* Camera Modal */}
      <CameraCaptureModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCapture={handleCapture}
      />
    </>
  );
}
