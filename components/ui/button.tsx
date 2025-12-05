import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary - Cyan (brand color)
        default: "bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-sm",
        // Destructive - Red for dangerous actions
        destructive: "bg-red-600 hover:bg-red-500 text-white rounded-lg",
        // Outline - Subtle border, ghost-like
        outline:
          "border border-white/10 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white rounded-lg",
        // Secondary - Muted background
        secondary: "bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg",
        // Ghost - No background, minimal
        ghost: "hover:bg-white/5 text-slate-400 hover:text-white rounded-lg",
        // Link - Cyan text
        link: "text-cyan-400 underline-offset-4 hover:underline hover:text-cyan-300",
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
