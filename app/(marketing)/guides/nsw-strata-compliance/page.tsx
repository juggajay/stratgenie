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
      <section className="py-16 px-6 bg-gradient-to-b from-[#F8F5F0] to-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-[#FF6B35]/10 text-[#FF6B35] mb-4">
            Compliance Guide
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight text-[#1a1a2e] mb-6">
            NSW Strata Compliance Guide 2025
          </h1>
          <p className="text-xl text-[#3d3d5c] max-w-2xl mx-auto mb-8">
            Everything your strata committee needs to know about meeting compliance
            requirements under NSW law. Avoid penalties and protect your scheme.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sign-up">
              <Button className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-lg px-6 py-3">
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
          <h2 className="text-2xl font-display font-semibold text-[#1a1a2e] mb-8 text-center">
            Key Compliance Requirements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[20px] border border-[#E8E4DE] shadow-sm">
              <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <h3 className="text-lg font-medium text-[#1a1a2e] mb-2">
                Strata Hub Registration
              </h3>
              <p className="text-[#3d3d5c] text-sm">
                All NSW strata schemes must register on the Strata Hub and keep
                information current including committee details, insurance, and AGM dates.
              </p>
            </div>
            <div className="bg-white p-6 rounded-[20px] border border-[#E8E4DE] shadow-sm">
              <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <h3 className="text-lg font-medium text-[#1a1a2e] mb-2">
                Annual General Meeting
              </h3>
              <p className="text-[#3d3d5c] text-sm">
                Hold an AGM within 3 months of your financial year end. Elect committee,
                approve budget, set levies, and review insurance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-[20px] border border-[#E8E4DE] shadow-sm">
              <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <h3 className="text-lg font-medium text-[#1a1a2e] mb-2">
                Record Keeping
              </h3>
              <p className="text-[#3d3d5c] text-sm">
                Maintain strata records for 7 years including meeting minutes, financial
                statements, contracts, and correspondence.
              </p>
            </div>
            <div className="bg-white p-6 rounded-[20px] border border-[#E8E4DE] shadow-sm">
              <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <h3 className="text-lg font-medium text-[#1a1a2e] mb-2">
                Financial Statements
              </h3>
              <p className="text-[#3d3d5c] text-sm">
                Prepare Section 93 financial statements showing income, expenditure, and
                fund balances. Present at AGM for approval.
              </p>
            </div>
            <div className="bg-white p-6 rounded-[20px] border border-[#E8E4DE] shadow-sm">
              <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <h3 className="text-lg font-medium text-[#1a1a2e] mb-2">
                Building Insurance
              </h3>
              <p className="text-[#3d3d5c] text-sm">
                Maintain building insurance for full replacement value. Review annually
                and update Strata Hub with current policy details.
              </p>
            </div>
            <div className="bg-white p-6 rounded-[20px] border border-[#E8E4DE] shadow-sm">
              <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <h3 className="text-lg font-medium text-[#1a1a2e] mb-2">
                10-Year Capital Works Plan
              </h3>
              <p className="text-[#3d3d5c] text-sm">
                Prepare and maintain a 10-year capital works plan projecting major
                maintenance and repairs. Review annually.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Calendar */}
      <section className="py-16 px-6 bg-[#F8F5F0]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-display font-semibold text-[#1a1a2e] mb-8 text-center">
            Annual Compliance Calendar
          </h2>
          <div className="bg-white rounded-[20px] border border-[#E8E4DE] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8F5F0] border-b border-[#E8E4DE]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b8a] uppercase tracking-wider">
                    Timeframe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b8a] uppercase tracking-wider">
                    Requirement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b8a] uppercase tracking-wider">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DE]">
                <tr>
                  <td className="px-6 py-4 text-sm text-[#1a1a2e]">July - September</td>
                  <td className="px-6 py-4 text-sm text-[#3d3d5c]">Hold AGM</td>
                  <td className="px-6 py-4 text-sm text-[#3d3d5c]">Within 3 months of FY end</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-[#1a1a2e]">After AGM</td>
                  <td className="px-6 py-4 text-sm text-[#3d3d5c]">Update Strata Hub</td>
                  <td className="px-6 py-4 text-sm text-[#3d3d5c]">Within 14 days</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-[#1a1a2e]">Annual</td>
                  <td className="px-6 py-4 text-sm text-[#3d3d5c]">Insurance renewal</td>
                  <td className="px-6 py-4 text-sm text-[#3d3d5c]">Before policy expiry</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-[#1a1a2e]">Annual</td>
                  <td className="px-6 py-4 text-sm text-[#3d3d5c]">Fire safety certificate (AFSS)</td>
                  <td className="px-6 py-4 text-sm text-[#3d3d5c]">Before certificate expiry</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-[#1a1a2e]">Ongoing</td>
                  <td className="px-6 py-4 text-sm text-[#3d3d5c]">Financial records</td>
                  <td className="px-6 py-4 text-sm text-[#3d3d5c]">Keep for 7 years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display font-semibold text-[#1a1a2e] mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-[20px] border border-[#E8E4DE]"
              >
                <h3 className="text-lg font-medium text-[#1a1a2e] mb-2">
                  {faq.question}
                </h3>
                <p className="text-[#3d3d5c]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-6 bg-[#F8F5F0]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-semibold text-[#1a1a2e]">
                Compliance Articles
              </h2>
              <Link
                href="/blog/category/compliance"
                className="text-[#FF6B35] hover:text-[#E85A2A] text-sm font-medium flex items-center gap-1"
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
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] rounded-[20px] p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-white mb-4">
            Stay Compliant with StrataGenie
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Never miss a deadline again. StrataGenie tracks your compliance
            requirements and sends automatic reminders so you can focus on running
            your scheme.
          </p>
          <Link href="/sign-up">
            <Button className="bg-white text-[#FF6B35] hover:bg-white/95 rounded-lg px-8 py-3 text-lg font-medium">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
