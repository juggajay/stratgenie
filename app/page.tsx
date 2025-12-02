"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/marketing/logo";
import { SavingsCalculator } from "@/components/marketing/savings-calculator";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { FAQItem } from "@/components/marketing/faq-item";
import {
  ArrowRight,
  Calendar,
  Shield,
  Users,
  Receipt,
  Check,
  Mail,
  Scale,
  Play,
  Sparkles,
} from "lucide-react";

// ============================================================================
// NAVBAR
// ============================================================================
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              Login
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-sm">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ============================================================================
// HERO SECTION - Centered with floating video window
// ============================================================================
function HeroSection() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 text-sm font-medium mb-8">
          <Shield className="w-4 h-4 text-blue-600" />
          Built for NSW SSMA 2015 compliance
        </div>

        {/* Headline - Large centered typography */}
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-slate-900 mb-6 leading-[1.1]">
          Your Strata Scheme,
          <br />
          <span className="text-blue-600">On Autopilot.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The autonomous strata manager for NSW volunteers.
          Stop worrying about compliance, data entry, and bylaws.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <span className="text-slate-500 text-base font-medium">
            $14.99/lot/month
          </span>
        </div>

        {/* Value pills */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 mb-16">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            Built for Volunteers
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            NSW Compliance Ready
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            70% Cheaper Than Agencies
          </span>
        </div>

        {/* Floating Video Window */}
        <div className="relative max-w-4xl mx-auto">
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl overflow-hidden border border-slate-700/50">
            {/* Browser chrome mockup */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-slate-700/50 text-slate-400 text-xs">
                  app.stratagenie.com.au
                </div>
              </div>
            </div>
            {/* App preview content */}
            <div className="p-6 md:p-8 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-blue-600/20 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-10 h-10 text-blue-400" />
                </div>
                <p className="text-slate-400 text-lg">Watch how it works</p>
                <p className="text-slate-500 text-sm mt-1">2 minute demo</p>
              </div>
            </div>
          </div>
          {/* Floating decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// BENTO GRID - 4 AI Agents
// ============================================================================
function BentoGridSection() {
  const agents = [
    {
      icon: Calendar,
      title: "Secretary Agent",
      tagline: "Watches the calendar so you don't have to.",
      description:
        "Auto-drafts legally compliant AGM agendas. Alerts months in advance. Green/Red compliance dashboard.",
      color: "blue",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Receipt,
      title: "Treasurer Agent",
      tagline: "Throw away your spreadsheets.",
      description:
        "Drag & drop invoices. AI extracts GST and categories automatically. Full audit trail on every transaction.",
      color: "emerald",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      icon: Scale,
      title: "Guardian Agent",
      tagline: "Resolve disputes instantly.",
      description:
        "Ask bylaw questions in plain English. Get instant answers citing the exact clause. Learns your building's rules.",
      color: "purple",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Mail,
      title: "Postman Agent",
      tagline: "Calculate, generate, email — one click.",
      description:
        "Enter your budget. System calculates each lot's share. Emails professional PDF notices to all owners.",
      color: "amber",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Meet Your AI Committee
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
            Four agents. Zero missed deadlines.
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Each agent is purpose-built for a specific strata responsibility, working 24/7 to keep your scheme compliant.
          </p>
        </div>

        {/* Bento Grid 2x2 */}
        <div className="grid md:grid-cols-2 gap-6">
          {agents.map((agent, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl ${agent.iconBg} flex items-center justify-center mb-5`}>
                <agent.icon className={`w-7 h-7 ${agent.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{agent.title}</h3>
              <p className={`text-sm font-medium ${agent.iconColor} mb-3`}>{agent.tagline}</p>
              <p className="text-slate-600 leading-relaxed">{agent.description}</p>

              {/* Hover arrow */}
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ZIG-ZAG DEEP DIVE SECTION
// ============================================================================
function ZigZagSection() {
  const features = [
    {
      title: "AGM Intelligence",
      subtitle: "Never miss your 12-month cycle again",
      description:
        "StrataGenie automatically calculates due dates, generates compliant notices with proper lead times, drafts agendas based on your scheme's needs, and produces minutes ready for signing.",
      bullets: [
        "Auto-calculate AGM due dates",
        "Generate notices, agendas & minutes",
        "Track notice period requirements",
      ],
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Strata Hub Companion",
      subtitle: "Stay ahead of your 3-month reporting window",
      description:
        "We track what's due, validate all required information, warn you about missing or contradictory data, and prepare structured exports for seamless lodgement.",
      bullets: [
        "Track 3-month reporting windows",
        "Validate all required fields",
        "Prepare JSON exports for lodgement",
      ],
      icon: Shield,
      color: "emerald",
    },
    {
      title: "Smart Invoice Processing",
      subtitle: "Upload invoices and let AI do the rest",
      description:
        "Drag and drop your bills. Our AI instantly reads the document, extracts key data, validates ABN/GST, prevents fund mixing, and maintains a clear audit trail.",
      bullets: [
        "AI-powered data extraction",
        "ABN & GST validation",
        "Admin/CWF fund separation",
      ],
      icon: Receipt,
      color: "purple",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
            Built for real strata compliance
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Every feature designed around the actual requirements of the NSW Strata Schemes Management Act 2015.
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => {
            const isReversed = index % 2 === 1;
            const colorClasses = {
              blue: { bg: "bg-blue-100", text: "text-blue-600", light: "bg-blue-50" },
              emerald: { bg: "bg-emerald-100", text: "text-emerald-600", light: "bg-emerald-50" },
              purple: { bg: "bg-purple-100", text: "text-purple-600", light: "bg-purple-50" },
            }[feature.color];

            return (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className={isReversed ? "lg:order-2" : ""}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colorClasses.light} ${colorClasses.text} text-sm font-medium mb-4`}>
                    <feature.icon className="w-4 h-4" />
                    {feature.title}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-4">
                    {feature.subtitle}
                  </h3>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full ${colorClasses.bg} flex items-center justify-center flex-shrink-0`}>
                          <Check className={`w-3.5 h-3.5 ${colorClasses.text}`} />
                        </div>
                        <span className="text-slate-700">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Screenshot placeholder */}
                <div className={isReversed ? "lg:order-1" : ""}>
                  <div className="relative">
                    <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 shadow-lg overflow-hidden">
                      {/* Fake app UI */}
                      <div className="h-full flex flex-col">
                        <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-slate-200">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                          </div>
                        </div>
                        <div className="flex-1 p-6 flex items-center justify-center">
                          <div className="text-center">
                            <div className={`w-16 h-16 rounded-xl ${colorClasses.bg} flex items-center justify-center mx-auto mb-3`}>
                              <feature.icon className={`w-8 h-8 ${colorClasses.text}`} />
                            </div>
                            <p className="text-slate-400 text-sm">Screenshot placeholder</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Decorative shadow */}
                    <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-2xl bg-slate-200/50"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SAVINGS SECTION
// ============================================================================
function SavingsSection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-6">
              Save thousands by staying self-managed
            </h2>

            <div className="space-y-5 text-lg text-slate-600 mb-8">
              <p>
                Traditional strata management for small schemes costs{" "}
                <strong className="text-slate-900">$2,500–$10,000 per year</strong>.
              </p>
              <p>
                <strong className="text-slate-900">67% of Australian strata schemes</strong>{" "}
                have 1–5 lots. Many want to self-manage but worry about compliance.
              </p>
              <p>
                StrataGenie costs a fraction of a full manager while giving you
                the compliance &ldquo;brain&rdquo; you need.
              </p>
            </div>

            {/* Example calculation */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <p className="text-sm font-semibold text-slate-900 mb-4">
                Example: 6-lot building
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly cost</span>
                  <span className="font-medium text-slate-900">$14.99 × 6 = $89.94</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Annual cost</span>
                  <span className="font-medium text-slate-900">$1,079</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200">
                  <span className="font-semibold text-emerald-700">Estimated savings</span>
                  <span className="font-bold text-emerald-600">$1,500–$8,900/year</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Calculator */}
          <div>
            <SavingsCalculator />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// DARK PRICING SECTION
// ============================================================================
function PricingSection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        {/* Dark pricing card */}
        <div className="bg-slate-900 rounded-3xl p-10 md:p-14 text-center">
          <p className="text-blue-400 font-medium mb-4">Simple, transparent pricing</p>

          {/* Large price */}
          <div className="mb-6">
            <span className="text-6xl md:text-7xl font-semibold text-white tracking-tight">$14.99</span>
            <span className="text-slate-400 text-xl ml-2">/lot/month</span>
          </div>

          <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
            All features included. No setup fees. No contracts. Cancel anytime.
          </p>

          {/* Features list */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-300 mb-10">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              All 4 AI Agents
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Strata Hub Export
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Unlimited Documents
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Email Notifications
            </span>
          </div>

          {/* CTA */}
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white hover:bg-slate-100 text-slate-900 text-lg px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all"
            >
              Start 14-Day Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="mt-4 text-slate-500 text-sm">
            No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "We finally stopped worrying about missing deadlines. StrataGenie sends us reminders and even drafts the documents we need.",
      author: "Sarah M.",
      role: "Secretary",
      scheme: "Bondi 8-lot scheme",
    },
    {
      quote:
        "StrataGenie handles all the admin so our committee can focus on real issues like maintenance and improvements.",
      author: "David K.",
      role: "Chair",
      scheme: "Parramatta townhouses",
    },
    {
      quote:
        "For small buildings like ours, hiring a strata manager never made sense. This is the perfect middle ground.",
      author: "Jenny L.",
      role: "Treasurer",
      scheme: "4-lot duplex",
    },
    {
      quote:
        "The Strata Hub export feature alone saves us hours every year. Everything is pre-validated and ready to lodge.",
      author: "Michael T.",
      role: "Secretary",
      scheme: "Surry Hills complex",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Trusted by NSW committees
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
            What our users say
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              scheme={testimonial.scheme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FAQ SECTION
// ============================================================================
function FAQSection() {
  const faqs = [
    {
      question: "Is StrataGenie compatible with Strata Hub?",
      answer:
        "Yes! StrataGenie is specifically designed to work with the NSW Strata Hub. We track your reporting windows, validate all required fields according to the latest specifications, and generate JSON exports that are ready for lodgement.",
    },
    {
      question: "Do we still need a strata manager?",
      answer:
        "That depends on your scheme. Many small schemes (2-20 lots) successfully self-manage with StrataGenie as their compliance assistant. For larger or more complex schemes, StrataGenie can complement a professional manager by handling routine compliance tasks.",
    },
    {
      question: "What if our committee is tiny (2 lots)?",
      answer:
        "Two-lot schemes are perfect for StrataGenie! You still have the same compliance obligations as larger schemes but likely don't want to pay thousands for a strata manager. At $14.99 per lot per month, that's under $30/month for complete compliance coverage.",
    },
    {
      question: "Who owns our data?",
      answer:
        "You do. Your scheme data belongs to your owners corporation. You can export all your data at any time, and if you cancel your subscription, we provide a complete data export. We never sell or share your data with third parties.",
    },
    {
      question: "How secure is the platform?",
      answer:
        "Security is paramount. All data is encrypted in transit and at rest. We use Australian-based cloud infrastructure, implement strict access controls, and maintain regular security audits.",
    },
    {
      question: "How does billing work?",
      answer:
        "Billing is simple: $14.99 per lot per month, billed annually. You get a 14-day free trial to test everything with no credit card required. After the trial, you'll be invoiced for the annual amount.",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about StrataGenie
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FINAL CTA SECTION
// ============================================================================
function FinalCTASection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-slate-100 border-t border-slate-200">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6">
          Ready to simplify your strata compliance?
        </h2>
        <p className="text-slate-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Join hundreds of NSW committees who&apos;ve automated their compliance with StrataGenie.
        </p>
        <Link href="/sign-up">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-6 rounded-full shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Start Your 14-Day Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        <p className="mt-5 text-slate-500 text-sm">
          No credit card required • Free for 14 days • Cancel anytime
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================
function Footer() {
  return (
    <footer className="py-16 px-6 bg-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Logo & description */}
          <div className="md:col-span-2">
            <div className="mb-5">
              <Logo className="h-10 w-auto" inverted />
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              The AI-powered compliance copilot for self-managed strata schemes in NSW.
              Built specifically for the Strata Schemes Management Act 2015.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Free Trial
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@stratagenie.app"
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} StrataGenie. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs text-center md:text-right max-w-xl">
              This tool provides administrative guidance only, not legal advice.
              Always verify compliance requirements with NSW Fair Trading.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <HeroSection />
        <BentoGridSection />
        <ZigZagSection />
        <SavingsSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
