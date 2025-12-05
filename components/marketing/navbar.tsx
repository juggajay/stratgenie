"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/marketing/logo";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E8E4DE]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-[#3d3d5c] hover:text-[#1a1a2e]">
              Login
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-lg px-6 shadow-sm">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
