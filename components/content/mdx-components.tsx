import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Lightbulb, AlertTriangle, Info } from "lucide-react";

// Custom components for MDX content
export const mdxComponents = {
  // Typography
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-3xl font-semibold tracking-tight text-slate-900 mt-10 mb-4 scroll-mt-20"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-2xl font-semibold tracking-tight text-slate-900 mt-8 mb-3 scroll-mt-20"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="text-xl font-semibold tracking-tight text-slate-900 mt-6 mb-2 scroll-mt-20"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="text-lg font-medium text-slate-800 mt-4 mb-2"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-slate-600 leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),

  // Links
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href || "#"}
        className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
        {...props}
      >
        {children}
      </Link>
    );
  },

  // Lists
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-outside ml-6 space-y-2 mb-4 text-slate-600" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-outside ml-6 space-y-2 mb-4 text-slate-600" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),

  // Code
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-slate-100 rounded px-1.5 py-0.5 text-sm font-mono text-slate-800"
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto mb-4 text-sm"
      {...props}
    >
      {children}
    </pre>
  ),

  // Blockquote
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-blue-500 pl-4 italic text-slate-600 my-4"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Table
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full divide-y divide-slate-200" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="px-4 py-2 text-left text-sm font-semibold text-slate-900 bg-slate-50"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-2 text-sm text-slate-600 border-b border-slate-100" {...props}>
      {children}
    </td>
  ),

  // Horizontal rule
  hr: () => <hr className="my-8 border-slate-200" />,

  // Custom components for enhanced content
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Alert,
  AlertDescription,
  AlertTitle,
  Image,

  // Special callout components
  Tip: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r-lg">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">{children}</div>
      </div>
    </div>
  ),

  Warning: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6 rounded-r-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">{children}</div>
      </div>
    </div>
  ),

  Danger: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6 rounded-r-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-red-800">{children}</div>
      </div>
    </div>
  ),

  Info: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-slate-100 border-l-4 border-slate-400 p-4 my-6 rounded-r-lg">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-700">{children}</div>
      </div>
    </div>
  ),

  LegalNote: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-slate-50 border border-slate-200 p-4 my-6 rounded-lg">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
        Legal Disclaimer
      </p>
      <div className="text-xs text-slate-500 italic">{children}</div>
    </div>
  ),

  // CTA components
  TrialCTA: () => (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 my-8 text-center">
      <h3 className="text-xl font-semibold text-white mb-2">
        Ready to simplify your strata compliance?
      </h3>
      <p className="text-blue-100 mb-4">
        Start your free trial today. No credit card required.
      </p>
      <Link href="/sign-up">
        <Button className="bg-white text-blue-700 hover:bg-blue-50">
          Start Free Trial
        </Button>
      </Link>
    </div>
  ),
};
