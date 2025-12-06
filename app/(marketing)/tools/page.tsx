import { Metadata } from "next";
import Link from "next/link";
import { Calculator, FileText, ClipboardCheck, ArrowRight, Upload } from "lucide-react";

import { createMetadata } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, generateWebPageSchema } from "@/lib/seo/schemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = createMetadata({
  title: "Free Strata Tools | Levy Calculator, Templates & Compliance Check",
  description:
    "Free tools for NSW strata committees. Calculate levies, download strata roll templates, and check your compliance status. No sign-up required.",
  path: "/tools",
});

const tools = [
  {
    icon: Calculator,
    title: "Levy Calculator",
    description:
      "Calculate individual lot levies based on unit entitlements and total budget. Supports quarterly and annual calculations.",
    href: "/tools/levy-calculator",
    color: "blue",
    features: ["Admin & capital works funds", "Quarterly breakdown", "PDF export"],
  },
  {
    icon: FileText,
    title: "Strata Roll Template",
    description:
      "Download a compliant strata roll template in Excel or PDF format. Includes all required fields under NSW legislation.",
    href: "/tools/strata-roll-template",
    color: "emerald",
    features: ["NSW compliant format", "Excel & PDF options", "Instant download"],
  },
  {
    icon: ClipboardCheck,
    title: "Compliance Health Check",
    description:
      "Take a quick 10-question quiz to assess your strata scheme's compliance status and get personalized recommendations.",
    href: "/tools/compliance-health-check",
    color: "purple",
    features: ["10 quick questions", "Instant results", "Custom recommendations"],
  },
  {
    icon: Upload,
    title: "Strata Hub Reporter",
    description:
      "Upload your AGM Minutes or Financial Statement and our AI will extract the key data points required for NSW Strata Hub reporting.",
    href: "/tools/strata-hub-reporter",
    color: "indigo",
    features: ["AI-powered extraction", "NSW Strata Hub format", "Instant results"],
  },
];

const colorClasses = {
  blue: {
    bg: "bg-[#FFF0EB]",
    icon: "text-[#FF6B35]",
    button: "bg-[#FF6B35] hover:bg-[#E85A2A]",
  },
  emerald: {
    bg: "bg-[#ECFDF5]",
    icon: "text-[#059669]",
    button: "bg-[#FF6B35] hover:bg-[#E85A2A]",
  },
  purple: {
    bg: "bg-[#F3E8FF]",
    icon: "text-[#9333EA]",
    button: "bg-[#FF6B35] hover:bg-[#E85A2A]",
  },
  indigo: {
    bg: "bg-[#E0E7FF]",
    icon: "text-[#6366F1]",
    button: "bg-[#FF6B35] hover:bg-[#E85A2A]",
  },
};

export default function ToolsPage() {
  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Free Tools", path: "/tools" },
          ]),
          generateWebPageSchema({
            title: "Free Strata Tools",
            description: "Free tools for NSW strata committees.",
            path: "/tools",
          }),
        ]}
      />

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-[#F8F5F0] to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1a1a2e] mb-6 font-display">
            Free Strata Tools
          </h1>
          <p className="text-xl text-[#3d3d5c] max-w-2xl mx-auto">
            Practical tools to help NSW strata committees manage their schemes
            effectively. No sign-up required.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {tools.map((tool) => {
              const colors = colorClasses[tool.color as keyof typeof colorClasses];
              return (
                <div
                  key={tool.href}
                  className="bg-white rounded-[20px] border border-[#E8E4DE] shadow-[0_4px_6px_rgba(0,0,0,0.02),0_10px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.02),0_15px_30px_rgba(0,0,0,0.06)] transition-all overflow-hidden"
                >
                  <div className="p-6">
                    <div
                      className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}
                    >
                      <tool.icon className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                    <h2 className="text-xl font-semibold text-[#1a1a2e] mb-2 font-display">
                      {tool.title}
                    </h2>
                    <p className="text-[#3d3d5c] text-sm mb-4">{tool.description}</p>
                    <ul className="space-y-2 mb-6">
                      {tool.features.map((feature) => (
                        <li
                          key={feature}
                          className="text-xs text-[#6b6b8a] flex items-center gap-2"
                        >
                          <span className="w-1 h-1 bg-[#9595ad] rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href={tool.href}>
                      <Button
                        className={`w-full ${colors.button} text-white rounded-lg`}
                      >
                        Use Tool
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 px-6 bg-[#F8F5F0]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-[#6b6b8a]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No Sign-up Required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>NSW Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Australian Made</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] rounded-[20px] p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 font-display">
            Need More Than Free Tools?
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            StrataGenie provides complete strata management with compliance tracking,
            document generation, financial management, and AI-powered guidance.
          </p>
          <Link href="/sign-up">
            <Button className="bg-white text-[#FF6B35] hover:bg-[#FFF0EB] rounded-lg px-8 py-3 text-lg font-medium">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
