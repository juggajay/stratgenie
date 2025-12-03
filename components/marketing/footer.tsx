import Link from "next/link";
import { Logo } from "@/components/marketing/logo";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <Logo className="h-10 w-auto mb-4 brightness-0 invert" />
            <p className="text-slate-400 text-sm max-w-md">
              The autonomous strata manager for NSW volunteers. Simplify compliance,
              automate admin, and save thousands on management fees.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Free Tools
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Free Trial
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@stratagenie.app"
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} StrataGenie. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs text-center md:text-right max-w-xl">
              This tool provides administrative guidance only, not legal advice.
              Always verify compliance requirements with NSW Fair Trading.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
