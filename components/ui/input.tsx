import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - warm light theme
        "h-10 w-full min-w-0 rounded-lg border bg-card px-3 py-2 text-base text-foreground shadow-sm transition-smooth",
        // Placeholder
        "placeholder:text-muted-foreground",
        // Border
        "border-border",
        // Focus state - Ocean Blue ring
        "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Selection
        "selection:bg-primary/20 selection:text-foreground",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        // Error state
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        // Responsive text size
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
