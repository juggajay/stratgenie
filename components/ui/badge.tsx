import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Default - Ocean Blue
        default:
          "border-transparent bg-primary text-primary-foreground",
        // Secondary - Sandstone
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        // Destructive
        destructive:
          "border-transparent bg-destructive text-white",
        // Outline
        outline: "border-border text-foreground",
        // Success - Mint green
        success:
          "status-success",
        // Warning - Persimmon
        warning:
          "status-warning",
        // Danger - Red
        danger:
          "status-danger",
        // Info - Ocean Blue
        info:
          "status-info",
        // Neutral - Warm grey
        neutral:
          "status-neutral",
        // Agent badges
        secretary:
          "badge-secretary",
        treasurer:
          "badge-treasurer",
        guardian:
          "badge-guardian",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
