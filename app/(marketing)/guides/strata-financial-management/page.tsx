import { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  Wallet,
  PiggyBank,
  FileSpreadsheet,
  TrendingUp,
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
  title: "Strata Financial Management Guide | Levies, Budgets & Fund Management",
  description:
    "Master strata financial management in NSW. Learn about levy calculations, admin vs capital works funds, budgeting, Section 93 reporting, and financial best practices.",
  path: "/guides/strata-financial-management",
});

const faqs = [
  {
    question: "What is the difference between the admin fund and capital works fund?",
    answer:
      "The administrative fund covers day-to-day operating expenses like insurance, cleaning, utilities, and minor repairs. The capital works fund is for major repairs and long-term maintenance like painting, roof replacement, and structural works. NSW law requires both funds to be maintained in separate bank accounts.",
  },
  {
    question: "How are strata levies calculated?",
    answer:
      "Levies are calculated based on each lot's unit entitlement as a proportion of total scheme entitlements. The formula is: Your Levy = (Your Unit Entitlement / Total Entitlements) x Total Budget. Unit entitlements are set in the strata plan and typically reflect lot size and value.",
  },
  {
    question: "What is a Section 93 financial statement?",
    answer:
      "Section 93 of the Strata Schemes Management Act requires owners corporations to prepare financial statements in a prescribed format. These include income and expenditure statements for both funds, balance sheets showing assets and liabilities, and notes to the accounts. They must be presented at the AGM.",
  },
  {
    question: "Do all strata schemes need a capital works fund?",
    answer:
      "Most schemes require a capital works fund with a 10-year plan. Two-lot schemes may be exempt if there is no common property requiring maintenance, but this is rare. Even exempt schemes should consider maintaining reserves for unexpected expenses.",
  },
  {
    question: "What happens if an owner doesn't pay their levies?",
    answer:
      "The owners corporation can charge interest on overdue levies (at a rate set at the AGM or the prescribed rate). After 30 days, debt recovery action can begin. Outstanding levies can be registered on the lot's title, affecting the owner's ability to sell or refinance.",
  },
];

export default async function StrataFinancialManagementPage() {
  const relatedPosts = await getPostsByPillar("strata-financial-management");

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: "Financial Management", path: "/guides/strata-financial-management" },
          ]),
          generateWebPageSchema({
            title: "Strata Financial Management Guide",
            description: "Complete guide to managing strata finances in NSW.",
            path: "/guides/strata-financial-management",
          }),
          generateFAQSchema(faqs),
        ]}
      />

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 mb-4">
            Financial Guide
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6">
            Strata Financial Management Guide
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Master the financial side of strata management. From levy calculations to
            fund management and compliant reporting.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tools/levy-calculator">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-6 py-3">
                Try Levy Calculator
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline" className="rounded-lg px-6 py-3">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Fund Types */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            Understanding Strata Funds
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Administrative Fund
              </h3>
              <p className="text-slate-600 mb-4">
                For day-to-day operating expenses that keep your building running
                smoothly throughout the year.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                  Building insurance premiums
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                  Cleaning and garden maintenance
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                  Utilities (common area electricity, water)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                  Minor repairs and maintenance
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                  Strata management fees and audit costs
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <PiggyBank className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Capital Works Fund
              </h3>
              <p className="text-slate-600 mb-4">
                For major repairs and long-term maintenance. This fund should grow
                steadily to meet future needs.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
                  Building repainting (every 10-15 years)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
                  Roof replacement or major repairs
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
                  Lift upgrades or replacement
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
                  Waterproofing and structural repairs
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
                  Fire safety system upgrades
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Levy Calculation */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            How Levies Are Calculated
          </h2>
          <div className="bg-white p-8 rounded-xl border border-slate-200">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">The Formula</h3>
                <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm">
                  <p>Your Levy =</p>
                  <p className="pl-4">(Your Unit Entitlement / Total Entitlements)</p>
                  <p className="pl-4">x Total Budget</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">Example</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>Total scheme budget: $50,000/year</p>
                  <p>Your unit entitlement: 15</p>
                  <p>Total scheme entitlements: 200</p>
                  <p className="pt-2 font-medium text-slate-900">
                    Your annual levy: $50,000 x (15/200) = $3,750
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center pt-6 border-t border-slate-100">
              <Link href="/tools/levy-calculator">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Your Levies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Financial Responsibilities */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            Treasurer Responsibilities
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Budget Preparation
              </h3>
              <p className="text-slate-600 text-sm">
                Prepare annual budgets for both funds based on expected expenses and
                the 10-year capital works plan.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Levy Collection
              </h3>
              <p className="text-slate-600 text-sm">
                Issue levy notices, track payments, follow up on arrears, and maintain
                accurate records of all transactions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="w-5 h-5 text-cyan-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Financial Reporting
              </h3>
              <p className="text-slate-600 text-sm">
                Prepare Section 93 compliant financial statements for the AGM and
                provide regular reports to the committee.
              </p>
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
                Financial Management Articles
              </h2>
              <Link
                href="/blog/category/financial"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
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
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Simplify Strata Finances with StrataGenie
          </h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
            Automatic levy calculations, budget tracking, financial reporting, and
            more. Let StrataGenie handle the numbers while you focus on your building.
          </p>
          <Link href="/sign-up">
            <Button className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-lg px-8 py-3 text-lg font-medium">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
