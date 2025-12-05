import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary - Coral (brand color)
        default: "bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-lg shadow-sm hover:shadow-md",
        // Destructive - Red for dangerous actions
        destructive: "bg-red-600 hover:bg-red-500 text-white rounded-lg",
        // Outline - Warm border
        outline:
          "border border-[#E8E4DE] bg-white hover:bg-[#F8F5F0] text-[#3d3d5c] hover:text-[#1a1a2e] rounded-lg",
        // Secondary - Muted background
        secondary: "bg-[#F8F5F0] hover:bg-[#E8E4DE] text-[#3d3d5c] rounded-lg",
        // Ghost - No background, minimal
        ghost: "hover:bg-[#F8F5F0] text-[#6b6b8a] hover:text-[#1a1a2e] rounded-lg",
        // Link - Coral text
        link: "text-[#FF6B35] underline-offset-4 hover:underline hover:text-[#E85A2A]",
        // Success - Green for positive actions
        success: "bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm",
        // Warning - Amber for caution
        warning: "bg-amber-500 hover:bg-amber-400 text-white rounded-lg shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
