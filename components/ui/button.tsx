import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary - Ocean Blue with subtle shadow
        default: "bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm hover:shadow-ocean",
        // Destructive
        destructive: "bg-destructive hover:bg-destructive/90 text-white rounded-lg",
        // Outline - Sandstone border
        outline:
          "border border-border bg-card hover:bg-secondary hover:border-primary text-foreground rounded-lg",
        // Secondary - Cream background
        secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg",
        // Ghost - No background
        ghost: "hover:bg-secondary text-foreground rounded-lg",
        // Link - Ocean Blue text
        link: "text-primary underline-offset-4 hover:underline",
        // Success - Mint accent
        success: "bg-mint hover:bg-mint/90 text-white rounded-lg",
        // Warning - Persimmon accent
        warning: "bg-persimmon hover:bg-persimmon/90 text-white rounded-lg",
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
