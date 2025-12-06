import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

import { createMetadata } from "@/lib/seo/metadata";
import {
  generateBreadcrumbSchema,
  generateWebPageSchema,
} from "@/lib/seo/schemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllSuburbs, getSuburbBySlug } from "@/lib/suburbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SuburbPageProps {
  params: Promise<{ suburb: string }>;
}

export async function generateStaticParams() {
  const suburbs = getAllSuburbs();
  return suburbs.map((suburb) => ({
    suburb: suburb.slug,
  }));
}

export async function generateMetadata({
  params,
}: SuburbPageProps): Promise<Metadata> {
  const { suburb: suburbSlug } = await params;
  const suburb = getSuburbBySlug(suburbSlug);

  if (!suburb) {
    return createMetadata({
      title: "Suburb Not Found",
      description: "The requested suburb page could not be found.",
      path: `/strata-management/${suburbSlug}`,
    });
  }

  return createMetadata({
    title: `${suburb.name} Strata Management | Self-Managed Strata Software`,
    description: `Simplify strata management in ${suburb.name}. StrataGenie helps ${suburb.region} strata committees stay compliant with NSW requirements. Start your free trial.`,
    path: `/strata-management/${suburbSlug}`,
  });
}

const features = [
  {
    title: "Compliance Tracking",
    description: "Never miss an AGM deadline or Strata Hub update again",
  },
  {
    title: "Document Generation",
    description: "Create compliant notices, minutes, and levy statements instantly",
  },
  {
    title: "Financial Management",
    description: "Track levies, expenses, and generate Section 93 reports",
  },
  {
    title: "AI-Powered Guidance",
    description: "Get instant answers about NSW strata law and your bylaws",
  },
];

export default async function SuburbPage({ params }: SuburbPageProps) {
  const { suburb: suburbSlug } = await params;
  const suburb = getSuburbBySlug(suburbSlug);

  if (!suburb) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Strata Management", path: "/strata-management" },
            { name: suburb.name, path: `/strata-management/${suburbSlug}` },
          ]),
          generateWebPageSchema({
            title: `${suburb.name} Strata Management`,
            description: `Strata management software for ${suburb.name} buildings.`,
            path: `/strata-management/${suburbSlug}`,
          }),
        ]}
      />

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-[#F8F5F0] to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-[#6b6b8a] mb-4">
            <MapPin className="w-4 h-4" />
            <span>{suburb.region}</span>
            <span>•</span>
            <span>{suburb.postcode}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1a1a2e] mb-6">
            Strata Management in {suburb.name}
          </h1>
          <p className="text-xl text-[#3d3d5c] max-w-2xl mx-auto mb-8">
            {suburb.description} StrataGenie helps self-managed strata committees
            in {suburb.name} stay compliant with NSW requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sign-up">
              <Button className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-lg px-8 py-3 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/tools/compliance-health-check">
              <Button variant="outline" className="rounded-lg px-8 py-3 text-lg">
                Free Compliance Check
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Local Info */}
      <section className="py-12 px-6 bg-[#F8F5F0]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-[#E8E4DE]">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#FFF0EB] rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#FF6B35]" />
                  </div>
                  <h3 className="font-medium text-[#1a1a2e]">Local Council</h3>
                </div>
                <p className="text-[#3d3d5c] text-sm">{suburb.councilArea}</p>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DE]">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#ECFDF5] rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#059669]" />
                  </div>
                  <h3 className="font-medium text-[#1a1a2e]">Region</h3>
                </div>
                <p className="text-[#3d3d5c] text-sm">{suburb.region}</p>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DE]">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#F3E8FF] rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#9333EA]" />
                  </div>
                  <h3 className="font-medium text-[#1a1a2e]">Support</h3>
                </div>
                <p className="text-[#3d3d5c] text-sm">NSW Fair Trading assistance</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-8 text-center">
            How StrataGenie Helps {suburb.name} Strata Schemes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 p-6 bg-white rounded-xl border border-[#E8E4DE]"
              >
                <div className="w-8 h-8 bg-[#FFF0EB] rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1a1a2e] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-[#3d3d5c] text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Self-Manage */}
      <section className="py-16 px-6 bg-[#F8F5F0]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-6 text-center">
            Why {suburb.name} Schemes Choose Self-Management
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-[#3d3d5c] mb-4">
              Many strata schemes in {suburb.name} are discovering that
              self-management offers significant advantages over professional strata
              management, including:
            </p>
            <ul className="space-y-2 text-[#3d3d5c]">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full mt-2"></span>
                <span>
                  <strong>Cost savings</strong> - Save thousands per year on
                  management fees
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full mt-2"></span>
                <span>
                  <strong>Direct control</strong> - Make decisions faster without
                  going through a third party
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full mt-2"></span>
                <span>
                  <strong>Better communication</strong> - Direct contact between
                  committee and owners
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full mt-2"></span>
                <span>
                  <strong>Local knowledge</strong> - You know your building better
                  than anyone
                </span>
              </li>
            </ul>
            <p className="text-[#3d3d5c] mt-4">
              With StrataGenie, self-managed schemes in the {suburb.region} area get
              all the tools they need to stay compliant without the complexity of
              traditional strata software.
            </p>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-8 text-center">
            Helpful Resources for {suburb.name} Strata Schemes
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/guides/nsw-strata-compliance"
              className="p-6 bg-white rounded-xl border border-[#E8E4DE] hover:border-[#FF6B35] hover:shadow-md transition-all group"
            >
              <h3 className="font-medium text-[#1a1a2e] mb-2 group-hover:text-[#FF6B35]">
                NSW Compliance Guide
              </h3>
              <p className="text-[#3d3d5c] text-sm mb-3">
                Everything you need to know about strata compliance in NSW.
              </p>
              <span className="text-[#FF6B35] text-sm font-medium flex items-center gap-1">
                Read guide <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              href="/guides/transition-to-self-managed"
              className="p-6 bg-white rounded-xl border border-[#E8E4DE] hover:border-[#FF6B35] hover:shadow-md transition-all group"
            >
              <h3 className="font-medium text-[#1a1a2e] mb-2 group-hover:text-[#FF6B35]">
                Self-Management Guide
              </h3>
              <p className="text-[#3d3d5c] text-sm mb-3">
                How to transition from professional to self-managed strata.
              </p>
              <span className="text-[#FF6B35] text-sm font-medium flex items-center gap-1">
                Read guide <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              href="/tools"
              className="p-6 bg-white rounded-xl border border-[#E8E4DE] hover:border-[#FF6B35] hover:shadow-md transition-all group"
            >
              <h3 className="font-medium text-[#1a1a2e] mb-2 group-hover:text-[#FF6B35]">
                Free Tools
              </h3>
              <p className="text-[#3d3d5c] text-sm mb-3">
                Levy calculator, templates, and compliance health check.
              </p>
              <span className="text-[#FF6B35] text-sm font-medium flex items-center gap-1">
                View tools <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] rounded-[20px] p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Ready to simplify strata management in {suburb.name}?
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Join strata committees across {suburb.region} who trust StrataGenie to
            keep their schemes compliant and organized.
          </p>
          <Link href="/sign-up">
            <Button className="bg-white text-[#FF6B35] hover:bg-[#FFF0EB] rounded-lg px-8 py-3 text-lg font-medium">
              Start Your Free Trial
            </Button>
          </Link>
          <p className="text-white/70 text-sm mt-4">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>
    </>
  );
}
