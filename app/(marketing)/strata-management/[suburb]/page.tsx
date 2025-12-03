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
      <section className="py-16 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{suburb.region}</span>
            <span>•</span>
            <span>{suburb.postcode}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6">
            Strata Management in {suburb.name}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            {suburb.description} StrataGenie helps self-managed strata committees
            in {suburb.name} stay compliant with NSW requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sign-up">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8 py-3 text-lg">
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
      <section className="py-12 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Local Council</h3>
                </div>
                <p className="text-slate-600 text-sm">{suburb.councilArea}</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Region</h3>
                </div>
                <p className="text-slate-600 text-sm">{suburb.region}</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Support</h3>
                </div>
                <p className="text-slate-600 text-sm">NSW Fair Trading assistance</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            How StrataGenie Helps {suburb.name} Strata Schemes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 p-6 bg-white rounded-xl border border-slate-200"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Self-Manage */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
            Why {suburb.name} Schemes Choose Self-Management
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-4">
              Many strata schemes in {suburb.name} are discovering that
              self-management offers significant advantages over professional strata
              management, including:
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                <span>
                  <strong>Cost savings</strong> - Save thousands per year on
                  management fees
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                <span>
                  <strong>Direct control</strong> - Make decisions faster without
                  going through a third party
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                <span>
                  <strong>Better communication</strong> - Direct contact between
                  committee and owners
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                <span>
                  <strong>Local knowledge</strong> - You know your building better
                  than anyone
                </span>
              </li>
            </ul>
            <p className="text-slate-600 mt-4">
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
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            Helpful Resources for {suburb.name} Strata Schemes
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/guides/nsw-strata-compliance"
              className="p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-medium text-slate-900 mb-2 group-hover:text-blue-600">
                NSW Compliance Guide
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                Everything you need to know about strata compliance in NSW.
              </p>
              <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
                Read guide <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              href="/guides/transition-to-self-managed"
              className="p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-medium text-slate-900 mb-2 group-hover:text-blue-600">
                Self-Management Guide
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                How to transition from professional to self-managed strata.
              </p>
              <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
                Read guide <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              href="/tools"
              className="p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <h3 className="font-medium text-slate-900 mb-2 group-hover:text-blue-600">
                Free Tools
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                Levy calculator, templates, and compliance health check.
              </p>
              <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
                View tools <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Ready to simplify strata management in {suburb.name}?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join strata committees across {suburb.region} who trust StrataGenie to
            keep their schemes compliant and organized.
          </p>
          <Link href="/sign-up">
            <Button className="bg-white text-blue-700 hover:bg-blue-50 rounded-lg px-8 py-3 text-lg font-medium">
              Start Your Free Trial
            </Button>
          </Link>
          <p className="text-blue-200 text-sm mt-4">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>
    </>
  );
}
