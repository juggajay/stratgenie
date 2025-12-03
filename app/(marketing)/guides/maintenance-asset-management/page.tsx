import { Metadata } from "next";
import Link from "next/link";
import {
  Wrench,
  ClipboardCheck,
  Calendar,
  HardHat,
  Shield,
  ArrowRight,
} from "lucide-react";

import { createMetadata } from "@/lib/seo/metadata";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateWebPageSchema,
} from "@/lib/seo/schemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPostsByPillar } from "@/lib/content";
import { BlogCard } from "@/components/content/blog-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = createMetadata({
  title: "Strata Maintenance & Asset Management Guide | Capital Works Planning",
  description:
    "Master strata maintenance and asset management. Learn about 10-year capital works plans, maintenance responsibilities, contractor management, and building preservation.",
  path: "/guides/maintenance-asset-management",
});

const faqs = [
  {
    question: "What is a 10-year capital works plan?",
    answer:
      "A 10-year capital works plan is a mandatory document that identifies all major building components, estimates their remaining useful life, projects replacement or repair costs, and sets out a funding schedule. It helps schemes avoid special levies by planning ahead for major expenses.",
  },
  {
    question: "Who is responsible for maintenance in a strata scheme?",
    answer:
      "The owners corporation is responsible for common property maintenance (structure, roof, shared areas, major systems). Individual lot owners are responsible for items within their lot (fixtures, internal walls, appliances). Some items like balcony tiles may vary by scheme - check your bylaws.",
  },
  {
    question: "How often should the capital works plan be reviewed?",
    answer:
      "The capital works plan should be reviewed at least annually to check progress against projections and adjust for any changes. A full update with new condition assessments is recommended every 5 years or after major works are completed.",
  },
  {
    question: "What is an Annual Fire Safety Statement (AFSS)?",
    answer:
      "An AFSS is a certificate confirming that a building's fire safety measures have been inspected and are operating correctly. Most strata buildings with fire safety systems must submit an AFSS annually to the local council and NSW Fire & Rescue.",
  },
  {
    question: "How do we handle emergency repairs?",
    answer:
      "Emergency repairs affecting safety or preventing major damage can be authorized by the secretary or any committee member without a meeting. They should be actioned immediately and reported to the committee as soon as practical. Costs come from the administrative or capital works fund depending on the nature of the work.",
  },
];

export default async function MaintenanceAssetManagementPage() {
  const relatedPosts = await getPostsByPillar("maintenance-asset-management");

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: "Maintenance & Assets", path: "/guides/maintenance-asset-management" },
          ]),
          generateWebPageSchema({
            title: "Strata Maintenance & Asset Management Guide",
            description:
              "Complete guide to strata maintenance and asset management in NSW.",
            path: "/guides/maintenance-asset-management",
          }),
          generateFAQSchema(faqs),
        ]}
      />

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 mb-4">
            Maintenance Guide
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6">
            Strata Maintenance & Asset Management Guide
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Protect your building's value with proper maintenance planning. From
            10-year capital works plans to day-to-day repairs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sign-up">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-6 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/blog/category/maintenance">
              <Button variant="outline" className="rounded-lg px-6 py-3">
                Read Maintenance Tips
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Capital Works Planning */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            10-Year Capital Works Planning
          </h2>
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm mb-8">
            <p className="text-slate-600 mb-6">
              NSW law requires most strata schemes to prepare and maintain a 10-year
              capital works plan. This document is essential for:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-700 text-xs font-semibold">1</span>
                  </div>
                  <span className="text-slate-600">
                    Identifying major building components and their condition
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-700 text-xs font-semibold">2</span>
                  </div>
                  <span className="text-slate-600">
                    Estimating remaining useful life of each component
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-700 text-xs font-semibold">3</span>
                  </div>
                  <span className="text-slate-600">
                    Projecting replacement and repair costs
                  </span>
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-700 text-xs font-semibold">4</span>
                  </div>
                  <span className="text-slate-600">
                    Setting a funding schedule for capital works levies
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-700 text-xs font-semibold">5</span>
                  </div>
                  <span className="text-slate-600">
                    Avoiding unexpected special levies
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-700 text-xs font-semibold">6</span>
                  </div>
                  <span className="text-slate-600">
                    Maintaining property values
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Common Components */}
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Common Capital Works Items
          </h3>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Component
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Typical Life
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Cost Indication
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Exterior painting</td>
                  <td className="px-6 py-4 text-sm text-slate-600">10-15 years</td>
                  <td className="px-6 py-4 text-sm text-slate-600">$20-50k (small building)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Roof replacement</td>
                  <td className="px-6 py-4 text-sm text-slate-600">25-40 years</td>
                  <td className="px-6 py-4 text-sm text-slate-600">$50-200k</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Lift modernization</td>
                  <td className="px-6 py-4 text-sm text-slate-600">20-25 years</td>
                  <td className="px-6 py-4 text-sm text-slate-600">$100-300k per lift</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Waterproofing</td>
                  <td className="px-6 py-4 text-sm text-slate-600">15-20 years</td>
                  <td className="px-6 py-4 text-sm text-slate-600">$30-100k</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Fire system upgrade</td>
                  <td className="px-6 py-4 text-sm text-slate-600">15-20 years</td>
                  <td className="px-6 py-4 text-sm text-slate-600">$20-80k</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Maintenance Responsibilities */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            Who is Responsible for What?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <HardHat className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                Owners Corporation
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                  Building structure and roof
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                  External walls and common areas
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                  Windows and doors (frame and glass)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                  Main plumbing and pipes in walls
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                  Lifts, fire systems, intercoms
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                  Gardens and landscaping
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Wrench className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                Lot Owner
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
                  Internal walls and fixtures
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
                  Kitchen and bathroom fittings
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
                  Floor coverings
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
                  Appliances and air conditioning
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
                  Internal drains within lot
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
                  Window treatments and fly screens
                </li>
              </ul>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500 mt-6">
            Note: Some items may vary by scheme. Always check your strata plan and bylaws.
          </p>
        </div>
      </section>

      {/* Key Maintenance Tasks */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            Essential Maintenance Tasks
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Fire Safety (AFSS)
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                Annual inspection and certification of all fire safety measures.
              </p>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                Due Annually
              </span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ClipboardCheck className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Lift Inspections
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                Regular servicing and annual safety inspections for all lifts.
              </p>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Monthly + Annual
              </span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Gutter & Drain Cleaning
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                Clear gutters and stormwater drains to prevent water damage.
              </p>
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                Twice Yearly
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-slate-200"
              >
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-slate-900">
                Maintenance Articles
              </h2>
              <Link
                href="/blog/category/maintenance"
                className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 6).map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Never Miss a Maintenance Deadline
          </h2>
          <p className="text-amber-100 mb-8 max-w-xl mx-auto">
            StrataGenie tracks your maintenance schedule, sends automatic reminders,
            and helps you plan for the future. Keep your building in top condition.
          </p>
          <Link href="/sign-up">
            <Button className="bg-white text-amber-700 hover:bg-amber-50 rounded-lg px-8 py-3 text-lg font-medium">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
