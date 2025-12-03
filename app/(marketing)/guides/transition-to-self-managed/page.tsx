import { Metadata } from "next";
import Link from "next/link";
import {
  UserCheck,
  FileText,
  Key,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Clock,
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
  title: "How to Transition to Self-Managed Strata in NSW | Complete Guide",
  description:
    "Considering self-managed strata? Learn how to transition from a strata manager, what's involved in running your own scheme, and whether self-management is right for you.",
  path: "/guides/transition-to-self-managed",
});

const faqs = [
  {
    question: "Can any strata scheme self-manage?",
    answer:
      "Yes, any strata scheme in NSW can choose to self-manage regardless of size. However, self-management works best for smaller schemes (typically under 30 lots) where owners are engaged and willing to volunteer time. Larger or complex buildings may find professional management more practical.",
  },
  {
    question: "How much can we save by self-managing?",
    answer:
      "Savings vary by scheme size and location. Typical strata management fees in Sydney range from $3,000-$15,000 per year for small-medium schemes. Self-managed schemes save this fee but must account for volunteer time and potentially paying for specific services like accounting or legal advice when needed.",
  },
  {
    question: "How do we end our contract with a strata manager?",
    answer:
      "Review your management agreement for termination clauses - most require 1-3 months notice. The owners corporation must pass a resolution at a general meeting to terminate the agreement and transition to self-management. Ensure proper handover of all records, funds, and access credentials.",
  },
  {
    question: "What records do we need from the outgoing manager?",
    answer:
      "Request all strata records including: financial statements and bank accounts, meeting minutes and resolutions, contracts and warranties, insurance policies, owner contact details (strata roll), maintenance records, key and access registers, and any pending matters or disputes.",
  },
  {
    question: "Do self-managed schemes have the same legal obligations?",
    answer:
      "Yes, self-managed schemes must meet all the same compliance requirements as professionally managed schemes. This includes Strata Hub registration, AGM within required timeframes, proper record keeping, financial reporting, insurance, and all other obligations under the Strata Schemes Management Act 2015.",
  },
];

const steps = [
  {
    number: 1,
    title: "Assess Your Scheme",
    description:
      "Evaluate if self-management is right for your scheme. Consider size, complexity, owner engagement, and available skills.",
  },
  {
    number: 2,
    title: "Build Your Team",
    description:
      "Identify owners willing to take on committee roles: Chairperson, Secretary, and Treasurer at minimum.",
  },
  {
    number: 3,
    title: "Review Current Agreement",
    description:
      "Check your strata management contract for termination clauses, notice periods, and any exit fees.",
  },
  {
    number: 4,
    title: "Pass Resolution",
    description:
      "At a general meeting, pass an ordinary resolution to terminate the management agreement and self-manage.",
  },
  {
    number: 5,
    title: "Manage Handover",
    description:
      "Ensure complete handover of all records, funds, keys, contracts, and pending matters from the outgoing manager.",
  },
  {
    number: 6,
    title: "Set Up Systems",
    description:
      "Establish bank accounts, record keeping systems, communication channels, and compliance tracking.",
  },
];

export default async function TransitionToSelfManagedPage() {
  const relatedPosts = await getPostsByPillar("transition-to-self-managed");

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: "Transition to Self-Managed", path: "/guides/transition-to-self-managed" },
          ]),
          generateWebPageSchema({
            title: "How to Transition to Self-Managed Strata",
            description:
              "Complete guide to transitioning your NSW strata scheme to self-management.",
            path: "/guides/transition-to-self-managed",
          }),
          generateFAQSchema(faqs),
        ]}
      />

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 mb-4">
            Self-Management Guide
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6">
            Transition to Self-Managed Strata
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Take control of your strata scheme. Learn how to transition from
            professional management and run your building with confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sign-up">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-3">
                Start With StrataGenie
              </Button>
            </Link>
            <Link href="/tools/compliance-health-check">
              <Button variant="outline" className="rounded-lg px-6 py-3">
                Check Your Readiness
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Is Self-Management Right for You? */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            Is Self-Management Right for Your Scheme?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">
                  Self-Management Works Well When
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></span>
                  Smaller scheme (under 30 lots)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></span>
                  Engaged owners willing to volunteer
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></span>
                  Simple building with minimal facilities
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></span>
                  Good relationship between owners
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></span>
                  Owners with relevant skills (admin, finance, building)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></span>
                  High owner-occupancy ratio
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">
                  Consider Professional Management If
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></span>
                  Large scheme (50+ lots)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></span>
                  Complex building with pools, gyms, lifts
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></span>
                  High investor/tenant ratio
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></span>
                  Ongoing disputes between owners
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></span>
                  Major works or legal issues pending
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></span>
                  No owners willing to take on roles
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transition Steps */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            Steps to Transition
          </h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="bg-white p-6 rounded-xl border border-slate-200 flex gap-6"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-700 font-semibold text-lg">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Committee Roles */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            Essential Committee Roles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Chairperson
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                Leads committee meetings, coordinates decision-making, and represents
                the owners corporation.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                ~2-4 hours/month
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Secretary
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                Handles correspondence, maintains records, organizes meetings, and
                manages Strata Hub updates.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                ~4-8 hours/month
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Key className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Treasurer
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                Manages finances, issues levies, pays bills, prepares budgets and
                financial statements.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                ~3-6 hours/month
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Handover Checklist */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">
            Handover Checklist
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-slate-600 mb-6">
              Ensure you receive all of the following from your outgoing strata manager:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Records & Documents</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    Strata roll (owner contact details)
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    Meeting minutes (all available)
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    Financial statements
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    Contracts and warranties
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    Insurance policies
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    Bylaws and strata plan
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Access & Operations</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    Bank account details and transfers
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    Keys and access codes
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    Contractor contact list
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    Pending matters and disputes
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    Maintenance schedule and records
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    10-year capital works plan
                  </li>
                </ul>
              </div>
            </div>
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
                Self-Management Articles
              </h2>
              <Link
                href="/blog/category/self-managed"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
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
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Ready to Self-Manage with Confidence?
          </h2>
          <p className="text-purple-100 mb-8 max-w-xl mx-auto">
            StrataGenie gives self-managed schemes the tools to stay compliant,
            organized, and efficient. All the guidance you need, none of the
            management fees.
          </p>
          <Link href="/sign-up">
            <Button className="bg-white text-purple-700 hover:bg-purple-50 rounded-lg px-8 py-3 text-lg font-medium">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
