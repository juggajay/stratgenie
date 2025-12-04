"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, ArrowLeft, Menu, Receipt, Shield, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  showBackButton?: boolean;
  backHref?: string;
  actions?: React.ReactNode;
  onMobileMenuToggle?: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/finance", label: "Finance", icon: Receipt },
  { href: "/dashboard/guardian", label: "Guardian", icon: Shield },
];

export function AppHeader({
  title,
  description,
  icon: Icon,
  showBackButton = false,
  backHref = "/dashboard",
  actions,
  onMobileMenuToggle,
}: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Mobile menu button */}
            {onMobileMenuToggle && (
              <button
                onClick={onMobileMenuToggle}
                className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            {/* Branding */}
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <span className="text-xl font-semibold tracking-tight font-display bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
                StrataGenie
              </span>
            </Link>

            {/* Divider - hide on mobile */}
            <div className="hidden sm:block h-6 w-px bg-white/20" />

            {/* Page title section */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                {showBackButton && (
                  <Link href={backHref}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg text-slate-400 hover:text-white hover:bg-white/5 -ml-2"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                  </Link>
                )}
                {showBackButton && (
                  <span className="text-white/40">/</span>
                )}
                <h1 className="text-lg font-medium tracking-tight text-white flex items-center gap-2">
                  {Icon && <Icon className="h-5 w-5 text-white/70" />}
                  {title}
                </h1>
              </div>
              {description && (
                <p className="text-sm text-slate-400">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Navigation and actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const NavIcon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "rounded-lg transition-all",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <NavIcon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Custom actions */}
            {actions}
          </div>
        </div>

        {/* Mobile page title - shown below header on small screens */}
        <div className="sm:hidden mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <Link href={backHref}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg text-slate-400 hover:text-white hover:bg-white/5 -ml-2 p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <div>
              <h1 className="text-base font-medium tracking-tight text-white flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-white/70" />}
                {title}
              </h1>
              {description && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
