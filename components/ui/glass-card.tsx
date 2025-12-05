import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "coral" | "emerald" | "amber" | "purple" | "none";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = "none", ...props }, ref) => {
    const glowClasses = {
      coral: "hover:shadow-[0_4px_20px_rgba(255,107,53,0.15)] hover:border-[#FF6B35]/30",
      emerald: "hover:shadow-[0_4px_20px_rgba(34,197,94,0.15)] hover:border-emerald-500/30",
      amber: "hover:shadow-[0_4px_20px_rgba(245,158,11,0.15)] hover:border-amber-500/30",
      purple: "hover:shadow-[0_4px_20px_rgba(99,102,241,0.15)] hover:border-indigo-500/30",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl bg-white border border-[#E8E4DE] shadow-sm transition-all duration-300",
          glowClasses[glow],
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-3", className)}
    {...props}
  />
));
GlassCardHeader.displayName = "GlassCardHeader";

const GlassCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold tracking-tight text-[#1a1a2e]", className)}
    {...props}
  />
));
GlassCardTitle.displayName = "GlassCardTitle";

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[#6b6b8a]", className)}
    {...props}
  />
));
GlassCardDescription.displayName = "GlassCardDescription";

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
GlassCardContent.displayName = "GlassCardContent";

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
};
