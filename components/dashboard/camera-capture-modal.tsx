"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, Camera, RotateCcw, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CameraCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture?: (file: File) => void;
}

type CaptureStatus = "idle" | "streaming" | "captured" | "error";

export function CameraCaptureModal({
  open,
  onOpenChange,
  onCapture,
}: CameraCaptureModalProps) {
  const [status, setStatus] = useState<CaptureStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera when modal opens
  const startCamera = useCallback(async () => {
    setError(null);
    setStatus("idle");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus("streaming");
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not access camera. Please check permissions."
      );
      setStatus("error");
    }
  }, []);

  // Stop camera when modal closes
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCapturedImage(null);
    setStatus("idle");
  }, []);

  // Handle modal open/close
  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open, startCamera, stopCamera]);

  // Capture photo from video stream
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);
    setStatus("captured");

    // Stop the camera stream after capture to save battery
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  }, []);

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  // Use captured photo
  const usePhoto = useCallback(async () => {
    if (!capturedImage) return;

    // Convert data URL to File
    const response = await fetch(capturedImage);
    const blob = await response.blob();
    const file = new File([blob], `capture-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    onCapture?.(file);
    onOpenChange(false);
  }, [capturedImage, onCapture, onOpenChange]);

  // Handle file selection (fallback for browsers without camera)
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onCapture?.(file);
        onOpenChange(false);
      }
      e.target.value = "";
    },
    [onCapture, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg p-0 gap-0 overflow-hidden bg-charcoal">
        <DialogHeader className="px-4 py-3 border-b border-white/10 flex-row items-center justify-between">
          <DialogTitle className="text-white font-display">
            Capture Document
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 -mr-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <div className="relative aspect-[3/4] bg-black">
          {/* Camera viewfinder */}
          {status === "streaming" && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Document guide overlay */}
              <div className="absolute inset-4 border-2 border-dashed border-white/50 rounded-lg pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
              </div>
              <p className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm">
                Align document within frame
              </p>
            </>
          )}

          {/* Captured image preview */}
          {status === "captured" && capturedImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={capturedImage}
              alt="Captured document"
              className="w-full h-full object-cover"
            />
          )}

          {/* Loading state */}
          {status === "idle" && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-white/90 font-medium mb-2">
                Camera unavailable
              </p>
              <p className="text-white/60 text-sm mb-4">{error}</p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                  <Upload className="h-4 w-4" />
                  Upload from gallery
                </span>
              </label>
            </div>
          )}

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action buttons */}
        <div className="px-4 py-4 bg-charcoal border-t border-white/10">
          {status === "streaming" && (
            <div className="flex items-center justify-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
                  <Upload className="h-5 w-5" />
                </span>
              </label>

              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
                aria-label="Take photo"
              >
                <div className="w-14 h-14 rounded-full border-4 border-charcoal" />
              </button>

              <div className="w-12 h-12" /> {/* Spacer for alignment */}
            </div>
          )}

          {status === "captured" && (
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={retakePhoto}
                className="flex-1 border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
              <Button
                onClick={usePhoto}
                className="flex-1 bg-mint hover:bg-mint/90 text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                Use Photo
              </Button>
            </div>
          )}

          {status === "error" && (
            <Button
              onClick={startCamera}
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
