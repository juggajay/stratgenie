import { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle,
  FileText,
  AlertCircle,
  Calendar,
  Building2,
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
  title: "NSW Strata Compliance Guide 2025 | Complete Requirements & Deadlines",
  description:
    "The definitive guide to NSW strata compliance. Understand Strata Hub reporting, AGM requirements, record keeping, insurance obligations, and avoid penalties.",
  path: "/guides/nsw-strata-compliance",
});

const faqs = [
  {
    question: "What are the main compliance requirements for NSW strata schemes?",
    answer:
      "NSW strata schemes must comply with the Strata Schemes Management Act 2015, including: holding an AGM within 3 months of financial year end, registering and updating information on the Strata Hub, maintaining proper records for 7 years, having adequate building insurance, and keeping accurate financial statements.",
  },
  {
    question: "What is the NSW Strata Hub and why is it important?",
    answer:
      "The Strata Hub is an online government portal where all NSW strata schemes must register and report information. It increases transparency in the sector. Failure to register or keep information current can result in penalties up to $2,200.",
  },
  {
    question: "How often must a strata scheme hold an AGM?",
    answer:
      "Every NSW strata scheme must hold an Annual General Meeting (AGM) within 3 months of the end of each financial year. For most schemes with a June 30 year-end, this means by September 30 each year.",
  },
  {
    question: "What penalties apply for strata non-compliance in NSW?",
    answer:
      "Penalties vary by offense: failure to register on Strata Hub ($2,200), failing to hold AGM ($1,100), inadequate record keeping ($550 per offense), providing false information ($5,500). Multiple offenses can accumulate significant fines.",
  },
  {
    question: "Do two-lot schemes have the same compliance requirements?",
    answer:
      "Two-lot schemes have most of the same requirements but some exemptions. They must register on the Strata Hub and maintain records, but may be exempt from having a capital works fund if no common property requires maintenance. They still need building insurance and should hold regular meetings.",
  },
];

export default async function NSWStrataCompliancePage() {
  const relatedPosts = await getPostsByPillar("nsw-strata-compliance");

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: "NSW Strata Compliance", path: "/guides/nsw-strata-compliance" },
          ]),
          generateWebPageSchema({
            title: "NSW Strata Compliance Guide 2025",
            description:
              "Complete guide to NSW strata scheme compliance requirements.",
            path: "/guides/nsw-strata-compliance",
          }),
          generateFAQSchema(faqs),
        ]}
      />

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mb-4">
            Compliance Guide
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6">
            NSW Strata Compliance Guide 2025
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Everything your strata committee needs to know about meeting compliance
            requirements under NSW law. Avoid penalties and protect your scheme.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sign-up">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3">
                Start Free Compliance Check
              </Button>
            </Link>
            <Link href="/tools/compliance-health-check">
              <Button variant="outline" className="rounded-lg px-6 py-3">
                Take Compliance Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Requirements Overview */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            Key Compliance Requirements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Strata Hub Registration
              </h3>
              <p className="text-slate-600 text-sm">
                All NSW strata schemes must register on the Strata Hub and keep
                information current including committee details, insurance, and AGM dates.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Annual General Meeting
              </h3>
              <p className="text-slate-600 text-sm">
                Hold an AGM within 3 months of your financial year end. Elect committee,
                approve budget, set levies, and review insurance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Record Keeping
              </h3>
              <p className="text-slate-600 text-sm">
                Maintain strata records for 7 years including meeting minutes, financial
                statements, contracts, and correspondence.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Financial Statements
              </h3>
              <p className="text-slate-600 text-sm">
                Prepare Section 93 financial statements showing income, expenditure, and
                fund balances. Present at AGM for approval.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Building Insurance
              </h3>
              <p className="text-slate-600 text-sm">
                Maintain building insurance for full replacement value. Review annually
                and update Strata Hub with current policy details.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-cyan-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                10-Year Capital Works Plan
              </h3>
              <p className="text-slate-600 text-sm">
                Prepare and maintain a 10-year capital works plan projecting major
                maintenance and repairs. Review annually.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Calendar */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            Annual Compliance Calendar
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Timeframe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Requirement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">July - September</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Hold AGM</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Within 3 months of FY end</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">After AGM</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Update Strata Hub</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Within 14 days</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Annual</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Insurance renewal</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Before policy expiry</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Annual</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Fire safety certificate (AFSS)</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Before certificate expiry</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-900">Ongoing</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Financial records</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Keep for 7 years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-6">
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
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-slate-900">
                Compliance Articles
              </h2>
              <Link
                href="/blog/category/compliance"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
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
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Stay Compliant with StrataGenie
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Never miss a deadline again. StrataGenie tracks your compliance
            requirements and sends automatic reminders so you can focus on running
            your scheme.
          </p>
          <Link href="/sign-up">
            <Button className="bg-white text-blue-700 hover:bg-blue-50 rounded-lg px-8 py-3 text-lg font-medium">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
