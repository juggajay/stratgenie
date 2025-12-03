"use client";

import Link from "next/link";
import {
  Scale,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  FileText,
  CreditCard,
  GraduationCap,
  Shield,
  CheckCircle2,
  ArrowRight,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const reforms = [
  {
    id: "financial-hardship",
    title: "Financial Hardship Information Statement",
    description: "New mandatory statement that must be provided with every levy notice",
    effectiveDate: "1 October 2025",
    icon: FileText,
    color: "purple",
    link: "/blog/financial-hardship-information-statement-strata",
    keyPoints: [
      "Must accompany every levy notice issued",
      "Explains owner rights to request payment plans",
      "Standard form prescribed by regulations",
      "Non-compliance may affect levy recovery",
    ],
  },
  {
    id: "payment-plans",
    title: "Mandatory Levy Payment Plans",
    description: "Owners can now request payment plans for overdue levies",
    effectiveDate: "1 October 2025",
    icon: CreditCard,
    color: "emerald",
    link: "/blog/strata-levy-payment-plans-nsw",
    keyPoints: [
      "Owners in financial hardship can request plans",
      "Owners corporations must consider requests",
      "Reasonable payment arrangements required",
      "New process before debt recovery action",
    ],
  },
  {
    id: "committee-training",
    title: "Strata Committee Training Requirements",
    description: "New accountability and training obligations for committee members",
    effectiveDate: "1 October 2025",
    icon: GraduationCap,
    color: "blue",
    link: "/blog/strata-committee-mandatory-training-nsw",
    keyPoints: [
      "Committee members encouraged to complete training",
      "Fair Trading provides free training modules",
      "Enhanced duties of care and disclosure",
      "Increased transparency requirements",
    ],
  },
  {
    id: "insurance-disclosure",
    title: "Insurance Commission Disclosure",
    description: "New transparency requirements for insurance commissions",
    effectiveDate: "1 October 2025",
    icon: Shield,
    color: "amber",
    link: "/blog/disclosure-of-insurance-commissions-strata",
    keyPoints: [
      "Brokers must disclose all commissions",
      "Strata managers must declare conflicts of interest",
      "Owners entitled to full fee transparency",
      "Applies to all insurance arrangements",
    ],
  },
];

const colorClasses = {
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    border: "border-purple-200",
    light: "bg-purple-50",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "border-emerald-200",
    light: "bg-emerald-50",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
    light: "bg-blue-50",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    border: "border-amber-200",
    light: "bg-amber-50",
  },
};

export default function StrataReforms2025Page() {
  return (
    <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Guides
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              New Laws 2025
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-4">
            The 2025 NSW Strata Reforms: What Self-Managed Committees Must Do
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Significant reforms to the Strata Schemes Management Act 2015 commenced in October 2025.
            This guide explains the key changes and what your committee needs to do to stay compliant.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Effective: 1 October 2025
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              15 min read
            </span>
          </div>
        </div>

        {/* Urgent Action Banner */}
        <Card className="border-2 border-amber-300 bg-amber-50 rounded-xl mb-10">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">
                  Immediate Action Required
                </h3>
                <p className="text-amber-800 text-sm mb-3">
                  These reforms are now in effect. If your committee hasn't updated its processes,
                  you may be non-compliant. Review each reform below and take action.
                </p>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Update levy notice templates immediately
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Review insurance broker arrangements
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Establish a payment plan policy
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Overview of the 2025 Reforms
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600">
              The NSW Government introduced significant amendments to strata legislation in 2025,
              focusing on four key areas: financial hardship support, levy payment flexibility,
              committee accountability, and insurance transparency. These changes aim to protect
              lot owners while improving governance standards across NSW strata schemes.
            </p>
            <p className="text-slate-600">
              For self-managed strata committees, these reforms mean new administrative obligations
              and updated processes. Failure to comply could result in disputes, complaints to
              NSW Fair Trading, and potential penalties.
            </p>
          </div>
        </section>

        {/* Reform Cards */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            The Four Key Reforms
          </h2>
          <div className="space-y-6">
            {reforms.map((reform) => {
              const Icon = reform.icon;
              const colors = colorClasses[reform.color as keyof typeof colorClasses];
              return (
                <Card
                  key={reform.id}
                  className={`border ${colors.border} rounded-xl bg-white shadow-sm`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-medium">
                            {reform.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-slate-500 mt-1">
                            {reform.description}
                          </CardDescription>
                        </div>
                      </div>
                      <span className={`px-2 py-1 ${colors.light} ${colors.text} text-xs font-medium rounded-full whitespace-nowrap`}>
                        {reform.effectiveDate}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className={`p-4 ${colors.light} rounded-lg mb-4`}>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Key Points:</h4>
                      <ul className="space-y-1">
                        {reform.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2 className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link href={reform.link}>
                      <Button variant="outline" className="rounded-lg">
                        Read Full Guide
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Compliance Checklist */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Compliance Checklist for Self-Managed Schemes
          </h2>
          <Card className="border border-slate-200 rounded-xl bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  {
                    task: "Update levy notice template to include Financial Hardship Information Statement",
                    priority: "High",
                    deadline: "Immediate",
                  },
                  {
                    task: "Create a payment plan request form and policy",
                    priority: "High",
                    deadline: "Within 30 days",
                  },
                  {
                    task: "Request insurance commission disclosure from your broker",
                    priority: "Medium",
                    deadline: "Before next renewal",
                  },
                  {
                    task: "Review and update conflict of interest declarations",
                    priority: "Medium",
                    deadline: "Next committee meeting",
                  },
                  {
                    task: "Committee members to review Fair Trading training materials",
                    priority: "Recommended",
                    deadline: "Within 3 months",
                  },
                  {
                    task: "Update by-law enforcement procedures for new payment plan rules",
                    priority: "Medium",
                    deadline: "Within 60 days",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="w-6 h-6 border-2 border-slate-300 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-slate-400">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{item.task}</p>
                      <div className="flex gap-3 mt-1 text-xs">
                        <span className={`${
                          item.priority === "High"
                            ? "text-red-600"
                            : item.priority === "Medium"
                            ? "text-amber-600"
                            : "text-blue-600"
                        }`}>
                          {item.priority} Priority
                        </span>
                        <span className="text-slate-500">{item.deadline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "When did these reforms come into effect?",
                a: "The 2025 strata reforms commenced on 1 October 2025. All NSW strata schemes, including self-managed schemes, must comply from this date.",
              },
              {
                q: "What happens if we don't include the Financial Hardship Statement with levy notices?",
                a: "Non-compliance may affect your ability to recover levies through NCAT. Owners may dispute recovery action if proper notices weren't provided. It's essential to update your levy notice templates immediately.",
              },
              {
                q: "Can we refuse a payment plan request?",
                a: "You must give genuine consideration to all payment plan requests. While you're not required to accept unreasonable proposals, outright refusal without proper consideration may be challenged. Document your decision-making process.",
              },
              {
                q: "Do these reforms apply to small schemes?",
                a: "Yes, the reforms apply to all strata schemes in NSW regardless of size. Two-lot schemes and large developments alike must comply with the new requirements.",
              },
              {
                q: "Where can committee members access training?",
                a: "NSW Fair Trading provides free online training modules for strata committee members. These cover governance, financial management, and the new reform requirements.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-xl border border-slate-200"
              >
                <h3 className="font-medium text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Guides */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Related Guides
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "NSW Strata Compliance Guide",
                href: "/guides/nsw-strata-compliance",
                description: "Complete overview of NSW strata requirements",
              },
              {
                title: "Financial Management Guide",
                href: "/guides/strata-financial-management",
                description: "Levy calculations, budgets, and fund management",
              },
            ].map((guide) => (
              <Link key={guide.href} href={guide.href}>
                <Card className="border border-slate-200 rounded-xl bg-white shadow-sm hover:border-blue-300 hover:shadow-md transition-all h-full">
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-slate-900 mb-1">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-slate-500">{guide.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-3">
            Stay Compliant with the 2025 Reforms
          </h2>
          <p className="text-blue-100 mb-6 max-w-md mx-auto">
            StrataGenie automatically generates compliant levy notices with the required
            Financial Hardship Statement and tracks all your reform obligations.
          </p>
          <Link href="/sign-up">
            <Button className="bg-white text-blue-700 hover:bg-blue-50 rounded-lg px-6 py-2.5">
              Start Free Trial
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
