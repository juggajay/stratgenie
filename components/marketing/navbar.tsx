"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/marketing/logo";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              Login
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-sm">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
