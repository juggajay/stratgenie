"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Shield,
  Settings,
  CreditCard,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Compliance overview",
  },
  {
    href: "/dashboard/finance",
    label: "Finance",
    icon: Receipt,
    description: "Invoices & expenses",
  },
  {
    href: "/dashboard/guardian",
    label: "Guardian",
    icon: Shield,
    description: "Bylaw Q&A",
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: CreditCard,
    description: "Subscription & usage",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    description: "Account preferences",
  },
];

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[280px] p-0 bg-card border-r border-border"
      >
        <SheetHeader className="px-4 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold tracking-tight font-display text-primary">
              StrataGenie
            </SheetTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </SheetHeader>

        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const ItemIcon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        isActive ? "bg-primary/10" : "bg-secondary"
                      )}
                    >
                      <ItemIcon
                        className={cn(
                          "h-5 w-5",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <div>
                      <span className="block text-sm font-medium">
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "block text-xs",
                          isActive ? "text-primary/70" : "text-muted-foreground"
                        )}
                      >
                        {item.description}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground text-center">
            Administrative guidance only.
            <br />
            Not legal advice.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
