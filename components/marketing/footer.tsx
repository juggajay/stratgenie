import Link from "next/link";
import { Logo } from "@/components/marketing/logo";

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <Logo className="h-10 w-auto mb-4" inverted />
            <p className="text-[#9595ad] text-sm max-w-md">
              The autonomous strata manager for NSW volunteers. Simplify compliance,
              automate admin, and save thousands on management fees.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-[#9595ad] hover:text-[#FF6B35] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-[#9595ad] hover:text-[#FF6B35] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-[#9595ad] hover:text-[#FF6B35] transition-colors">
                  Free Tools
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#9595ad] hover:text-[#FF6B35] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-[#9595ad] hover:text-[#FF6B35] transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-[#9595ad] hover:text-[#FF6B35] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#9595ad] hover:text-[#FF6B35] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@stratagenie.app"
                  className="text-[#9595ad] hover:text-[#FF6B35] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-[#3d3d5c]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#6b6b8a] text-sm">
              &copy; {new Date().getFullYear()} StrataGenie. All rights reserved.
            </p>
            <p className="text-[#6b6b8a] text-xs text-center md:text-right max-w-xl">
              This tool provides administrative guidance only, not legal advice.
              Always verify compliance requirements with NSW Fair Trading.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
