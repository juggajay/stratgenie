"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import "./landing-styles.css";
import {
  ArrowRight,
  Calendar,
  Shield,
  Check,
  Mail,
  Scale,
  ClipboardList,
  Clock,
  Zap,
  Sparkles,
  Users,
  ChevronDown,
  Building2,
  Lock,
  Globe,
  Star,
  FileText,
  X,
  Play,
} from "lucide-react";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between relative">
        <Link href="/" className="flex items-center -ml-2">
          <Image
            src="/images/logo/logo-seablue-final.png"
            alt="StrataGenie"
            width={400}
            height={100}
            className="h-20 md:h-24 w-auto object-contain object-left"
          />
        </Link>
        <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <a href="#features" className="text-slate-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all font-medium text-sm">Features</a>
          <a href="#pricing" className="text-slate-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all font-medium text-sm">Pricing</a>
          <a href="#faq" className="text-slate-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all font-medium text-sm">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="hidden sm:block text-slate-300 hover:text-cyan-400 font-medium transition-colors">Login</Link>
          <Link href="/sign-up">
            <Button className="btn-glow bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-full font-medium shadow-lg shadow-cyan-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 gradient-bg overflow-hidden min-h-screen flex items-center">
      {/* Particles - more of them */}
      <div className="particles">
        <div className="particle animate-float" style={{ top: "10%", left: "10%", animationDelay: "0s", width: "6px", height: "6px" }} />
        <div className="particle animate-float" style={{ top: "20%", left: "80%", animationDelay: "1s" }} />
        <div className="particle animate-float" style={{ top: "60%", left: "20%", animationDelay: "2s", width: "8px", height: "8px" }} />
        <div className="particle animate-float" style={{ top: "80%", left: "70%", animationDelay: "3s" }} />
        <div className="particle animate-float" style={{ top: "40%", left: "90%", animationDelay: "4s" }} />
        <div className="particle animate-float" style={{ top: "15%", left: "50%", animationDelay: "0.5s", width: "5px", height: "5px" }} />
        <div className="particle animate-float" style={{ top: "70%", left: "15%", animationDelay: "1.5s" }} />
        <div className="particle animate-float" style={{ top: "30%", left: "70%", animationDelay: "2.5s", width: "7px", height: "7px" }} />
        <div className="particle animate-float" style={{ top: "85%", left: "40%", animationDelay: "3.5s" }} />
        <div className="particle animate-float" style={{ top: "50%", left: "5%", animationDelay: "4.5s", width: "6px", height: "6px" }} />
      </div>

      {/* Enhanced gradient orbs - more vibrant */}
      <div className="absolute top-10 left-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-sky-600/25 rounded-full blur-[150px] animate-float-delay" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-400/20 rounded-full blur-[100px] animate-float-slow" />

      {/* Central spotlight effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/20 via-cyan-500/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-slate-300 text-sm font-medium mb-8 animate-slide-up">
          <Shield className="w-4 h-4 text-cyan-400" />
          Built for NSW SSMA 2015 compliance
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.05] animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Your Strata Scheme,<br />
          <span className="gradient-text-landing">On Autopilot.</span>
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
          The AI-powered compliance copilot for self-managed NSW strata schemes. Stop worrying about deadlines, paperwork, and bylaws.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link href="/sign-up">
            <Button size="lg" className="group btn-glow bg-cyan-600 hover:bg-cyan-500 text-white text-lg px-8 py-6 rounded-full font-medium shadow-xl shadow-cyan-600/30 hover:shadow-2xl hover:-translate-y-1 transition-all animate-pulse-glow">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="#demo" className="group flex items-center gap-2 text-slate-300 hover:text-white text-lg px-8 py-4 rounded-full font-medium glass border border-white/20 hover:border-white/40 transition-all">
            <Play className="w-5 h-5 text-cyan-400" />
            Watch Demo
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-400 mb-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <span className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-400" />14-day free trial</span>
          <span className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-400" />No credit card required</span>
          <span className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-400" />70% cheaper than agencies</span>
        </div>

        {/* Hero Dashboard Preview */}
        <div className="relative max-w-4xl mx-auto animate-scale-in" style={{ animationDelay: "0.5s" }}>
          {/* Glow behind dashboard */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/40 via-transparent to-cyan-500/40 rounded-2xl opacity-50" />
          <div className="relative rounded-2xl glass border border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-500/30">
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-cyan-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-white/10 text-slate-400 text-xs border border-white/10">
                  app.stratagenie.com.au/dashboard
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-slate-900/50">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="glass rounded-xl p-5 border border-white/10 glow-cyan">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-300">AGM Status</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">On Track</span>
                  </div>
                  <p className="text-2xl font-semibold text-white">127 days</p>
                  <p className="text-xs text-slate-500 mt-1">until next AGM due</p>
                </div>

                <div className="glass rounded-xl p-5 border border-white/10 glow-purple">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-300">Strata Hub</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Lodged</span>
                  </div>
                  <p className="text-2xl font-semibold text-white">Up to date</p>
                  <p className="text-xs text-slate-500 mt-1">Last lodged: 12 Nov 2025</p>
                </div>

                <div className="glass rounded-xl p-5 border border-white/10 glow-amber">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-300">Pending Tasks</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">3 items</span>
                  </div>
                  <p className="text-2xl font-semibold text-white">3 tasks</p>
                  <p className="text-xs text-slate-500 mt-1">2 invoices, 1 notice</p>
                </div>
              </div>

              <div className="glass rounded-xl border border-white/10">
                <div className="px-5 py-4 border-b border-white/10">
                  <h3 className="font-medium text-white">Recent Activity</h3>
                </div>
                <div className="divide-y divide-white/5">
                  <div className="px-5 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">AGM Notice generated</p>
                      <p className="text-xs text-slate-500">Secretary Agent • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="px-5 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <ClipboardList className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Invoice processed: Sydney Water $342.50</p>
                      <p className="text-xs text-slate-500">Treasurer Agent • 5 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-6 -right-6 hidden md:block animate-float">
            <div className="glass rounded-xl p-4 shadow-xl border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">100% Compliant</p>
                  <p className="text-xs text-slate-400">All requirements met</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 hidden md:block animate-float-delay">
            <div className="glass rounded-xl p-4 shadow-xl border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">4 hrs saved</p>
                  <p className="text-xs text-slate-400">This week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 px-6 bg-slate-950 border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm font-medium text-slate-500 mb-8">Trusted by NSW strata committees</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="glass rounded-xl p-6 border border-white/10 hover:border-cyan-500/50 transition-colors">
            <p className="text-3xl md:text-4xl font-bold gradient-text-landing">500+</p>
            <p className="text-sm text-slate-400 mt-1">Schemes managed</p>
          </div>
          <div className="glass rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-colors">
            <p className="text-3xl md:text-4xl font-bold gradient-text-landing">15,000+</p>
            <p className="text-sm text-slate-400 mt-1">Documents processed</p>
          </div>
          <div className="glass rounded-xl p-6 border border-white/10 hover:border-emerald-500/50 transition-colors">
            <p className="text-3xl md:text-4xl font-bold gradient-text-landing">98%</p>
            <p className="text-sm text-slate-400 mt-1">Compliance rate</p>
          </div>
          <div className="glass rounded-xl p-6 border border-white/10 hover:border-cyan-500/50 transition-colors">
            <p className="text-3xl md:text-4xl font-bold gradient-text-gold">$2.4M</p>
            <p className="text-sm text-slate-400 mt-1">Saved by users</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Simple Setup
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Up and running in minutes
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            No complex onboarding. No IT department required. Just three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative group">
            <div className="glass rounded-2xl p-8 border border-white/10 h-full hover:border-cyan-500/50 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xl font-semibold mb-6 glow-cyan">1</div>
              <h3 className="text-xl font-semibold text-white mb-3">Sign up your scheme</h3>
              <p className="text-slate-400 leading-relaxed">
                Enter your scheme details — name, strata plan number, number of lots. Invite your committee members with one click.
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" />
          </div>

          <div className="relative group">
            <div className="glass rounded-2xl p-8 border border-white/10 h-full hover:border-purple-500/50 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-semibold mb-6 glow-purple">2</div>
              <h3 className="text-xl font-semibold text-white mb-3">Upload your documents</h3>
              <p className="text-slate-400 leading-relaxed">
                Drop in your bylaws, past AGM minutes, and any invoices. Our AI reads and organizes everything automatically.
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent" />
          </div>

          <div className="relative group">
            <div className="glass rounded-2xl p-8 border border-white/10 h-full hover:border-emerald-500/50 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-semibold mb-6 glow-emerald">3</div>
              <h3 className="text-xl font-semibold text-white mb-3">Let AI handle compliance</h3>
              <p className="text-slate-400 leading-relaxed">
                Receive alerts, generate documents, track deadlines. Your AI agents work 24/7 to keep you compliant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AgentsSection() {
  const agents = [
    {
      name: "Secretary Agent",
      tagline: "Watches the calendar so you don't have to.",
      description: "Auto-drafts legally compliant AGM notices, generates agendas, tracks all statutory deadlines, and produces minutes ready for signing.",
      features: ["Auto-calculate AGM due dates", "Generate compliant notices", "Green/Red compliance dashboard"],
      image: "/images/agents/hero-secretary.png",
      borderColor: "hover:border-cyan-500",
      hoverGlow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]",
      textColor: "text-cyan-400",
      checkColor: "text-cyan-400",
      bgGlow: "bg-cyan-500",
    },
    {
      name: "Treasurer Agent",
      tagline: "Throw away your spreadsheets.",
      description: "Drag & drop invoices. AI extracts vendor, amount, GST automatically. Validates ABN, separates funds, maintains full audit trail.",
      features: ["AI-powered data extraction", "ABN & GST validation", "Admin/CWF fund separation"],
      image: "/images/agents/hero-treasurer.png",
      borderColor: "hover:border-emerald-500",
      hoverGlow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]",
      textColor: "text-emerald-400",
      checkColor: "text-emerald-400",
      bgGlow: "bg-emerald-500",
    },
    {
      name: "Guardian Agent",
      tagline: "Resolve disputes instantly.",
      description: "Ask bylaw questions in plain English. Get instant answers citing the exact clause. Learns your building's specific rules.",
      features: ["Plain English answers", "Exact clause citations", "Custom bylaw support"],
      image: "/images/agents/hero-guardian.png",
      borderColor: "hover:border-purple-500",
      hoverGlow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]",
      textColor: "text-purple-400",
      checkColor: "text-purple-400",
      bgGlow: "bg-purple-500",
    },
    {
      name: "Postman Agent",
      tagline: "Calculate, generate, email — one click.",
      description: "Enter your budget. System calculates each lot's share based on unit entitlements. Emails professional PDF notices to all owners.",
      features: ["Auto levy calculation", "Professional PDF notices", "One-click email to all owners"],
      image: "/images/agents/hero-postman.png",
      borderColor: "hover:border-cyan-500",
      hoverGlow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]",
      textColor: "text-cyan-400",
      checkColor: "text-cyan-400",
      bgGlow: "bg-cyan-500",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 text-purple-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Meet Your AI Committee
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Four agents. Zero missed deadlines.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Each agent is purpose-built for a specific strata responsibility, working 24/7 to keep your scheme compliant.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className={`group relative glass rounded-2xl border border-white/10 ${agent.borderColor} hover:-translate-y-3 transition-all duration-300 overflow-hidden ${agent.hoverGlow}`}
            >
              {/* Background glow */}
              <div className={`absolute top-0 right-0 w-72 h-72 ${agent.bgGlow} rounded-full blur-3xl opacity-[0.08] -translate-y-1/2 translate-x-1/2 group-hover:opacity-30 transition-opacity duration-300`} />
              <div className={`absolute bottom-0 left-0 w-48 h-48 ${agent.bgGlow} rounded-full blur-3xl opacity-0 translate-y-1/2 -translate-x-1/2 group-hover:opacity-20 transition-opacity duration-300`} />

              <div className="relative flex flex-col md:flex-row">
                {/* Hero Image - no box */}
                <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                  <Image
                    src={agent.image}
                    alt={agent.name}
                    fill
                    className="object-contain object-center group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="relative p-6 flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-white">{agent.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
                      <span className="text-xs text-emerald-400 font-medium">Online</span>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${agent.textColor} mb-3`}>{agent.tagline}</p>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {agent.description}
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {agent.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className={`w-4 h-4 ${agent.checkColor}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StrataHubSection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Strata Hub Companion
            </div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Stay ahead of your 3-month reporting window
            </h3>
            <p className="text-lg text-slate-400 mb-6 leading-relaxed">
              Never scramble before a Strata Hub deadline again. We track what&apos;s due, validate all required information, warn you about missing data, and prepare structured exports for seamless lodgement.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-slate-300">Track 3-month reporting windows automatically</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-slate-300">Validate all required fields before submission</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-slate-300">Generate JSON exports ready for lodgement</span>
              </li>
            </ul>
          </div>

          <div className="relative">
            <div className="rounded-2xl glass border border-emerald-500/30 p-8 shadow-xl glow-emerald">
              <div className="glass rounded-xl border border-white/10 overflow-hidden">
                <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Strata Hub Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Ready to Lodge</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-slate-300">Scheme Details</span>
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-slate-300">Committee Members</span>
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-slate-300">Financial Summary</span>
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-300">Insurance Details</span>
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="px-4 py-3 bg-white/5 border-t border-white/10">
                  <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-600/30">
                    Export for Strata Hub
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            StrataGenie vs Traditional Management
          </h2>
          <p className="text-lg text-slate-400">
            See why hundreds of NSW schemes are making the switch.
          </p>
        </div>

        <div className="glass rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-sm font-semibold text-white">Feature</th>
                <th className="text-center py-4 px-6 bg-cyan-500/10">
                  <div className="text-sm font-semibold text-cyan-400">StrataGenie</div>
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-slate-400">Traditional Manager</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-4 px-6 text-sm text-slate-300">Annual Cost (6 lots)</td>
                <td className="text-center py-4 px-6 bg-cyan-500/10">
                  <span className="text-lg font-semibold text-cyan-400">$1,079</span>
                </td>
                <td className="text-center py-4 px-6 text-slate-400">$2,500 – $10,000</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-4 px-6 text-sm text-slate-300">Setup Time</td>
                <td className="text-center py-4 px-6 bg-cyan-500/10">
                  <span className="font-medium text-cyan-400">Minutes</span>
                </td>
                <td className="text-center py-4 px-6 text-slate-400">Weeks</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-4 px-6 text-sm text-slate-300">24/7 Availability</td>
                <td className="text-center py-4 px-6 bg-cyan-500/10">
                  <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                </td>
                <td className="text-center py-4 px-6">
                  <X className="w-6 h-6 text-slate-600 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-4 px-6 text-sm text-slate-300">Automated Compliance Tracking</td>
                <td className="text-center py-4 px-6 bg-cyan-500/10">
                  <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                </td>
                <td className="text-center py-4 px-6">
                  <span className="text-sm text-slate-500">Manual</span>
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-4 px-6 text-sm text-slate-300">Strata Hub Export</td>
                <td className="text-center py-4 px-6 bg-cyan-500/10">
                  <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                </td>
                <td className="text-center py-4 px-6">
                  <span className="text-sm text-slate-500">Varies</span>
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-4 px-6 text-sm text-slate-300">AI Document Generation</td>
                <td className="text-center py-4 px-6 bg-cyan-500/10">
                  <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                </td>
                <td className="text-center py-4 px-6">
                  <X className="w-6 h-6 text-slate-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-sm text-slate-300">You Stay in Control</td>
                <td className="text-center py-4 px-6 bg-cyan-500/10">
                  <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                </td>
                <td className="text-center py-4 px-6">
                  <X className="w-6 h-6 text-slate-600 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function SavingsCalculatorSection() {
  const [lots, setLots] = useState(6);
  const PRICE_PER_LOT = 14.99;
  const MIN_MANAGER_COST = 2500;

  const monthlyTotal = lots * PRICE_PER_LOT;
  const annualTotal = monthlyTotal * 12;
  const minSavings = Math.max(0, MIN_MANAGER_COST - annualTotal);

  return (
    <section className="py-20 md:py-28 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
              Save thousands by staying self-managed
            </h2>
            <div className="space-y-5 text-lg text-slate-400 mb-8">
              <p>
                Traditional strata management for small schemes costs <strong className="text-white">$2,500–$10,000 per year</strong>.
              </p>
              <p>
                <strong className="text-white">67% of Australian strata schemes</strong> have 1–5 lots. Many want to self-manage but worry about compliance.
              </p>
              <p>
                StrataGenie costs a fraction of a full manager while giving you the compliance &quot;brain&quot; you need.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/10">
              <p className="text-sm font-semibold text-white mb-4">Example: 6-lot building</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly cost</span>
                  <span className="font-medium text-white">$14.99 × 6 = $89.94</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Annual cost</span>
                  <span className="font-medium text-white">$1,079</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10">
                  <span className="font-semibold text-emerald-400">Estimated savings</span>
                  <span className="font-bold text-emerald-400">$1,500–$8,900/year</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="glass rounded-2xl border border-white/10 shadow-xl p-8 glow-cyan">
              <h3 className="text-xl font-semibold text-white mb-6">Calculate your savings</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Number of lots</label>
                <input
                  type="range"
                  min="2"
                  max="50"
                  value={lots}
                  onChange={(e) => setLots(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>2</span>
                  <span className="text-lg font-semibold text-white">{lots}</span>
                  <span>50</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-slate-400">Monthly with StrataGenie</span>
                  <span className="text-xl font-semibold text-white">${monthlyTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-slate-400">Annual with StrataGenie</span>
                  <span className="text-xl font-semibold text-white">${Math.round(annualTotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-emerald-500/10 rounded-lg px-4 -mx-4 border border-emerald-500/30">
                  <span className="font-medium text-emerald-400">Your estimated savings</span>
                  <span className="text-2xl font-bold text-emerald-400">${Math.round(minSavings).toLocaleString()}+</span>
                </div>
              </div>

              <Link href="/sign-up" className="block w-full bg-cyan-600 hover:bg-cyan-500 text-white text-center py-3 px-6 rounded-full font-medium shadow-lg shadow-cyan-600/30 hover:shadow-xl transition-all">
                Start Saving Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const features = ["All 4 AI Agents", "Strata Hub Export", "Unlimited Documents", "Email Notifications", "Priority Support"];

  return (
    <section id="pricing" className="py-20 md:py-28 px-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-cyan-400 font-medium mb-4">Simple, transparent pricing</p>

        <div className="mb-6">
          <span className="text-7xl md:text-8xl font-bold gradient-text-landing tracking-tight">$14.99</span>
          <span className="text-slate-400 text-2xl ml-2">/lot/month</span>
        </div>

        <p className="text-slate-400 text-xl mb-10 max-w-md mx-auto">
          All features included. No setup fees. No contracts. Cancel anytime.
        </p>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-slate-300 mb-12">
          {features.map((f) => (
            <span key={f} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              {f}
            </span>
          ))}
        </div>

        <Link href="/sign-up" className="inline-flex items-center gap-2 btn-glow bg-white hover:bg-slate-100 text-slate-900 text-lg px-10 py-4 rounded-full font-medium shadow-2xl hover:-translate-y-1 transition-all">
          Start 14-Day Free Trial
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="mt-4 text-slate-500 text-sm">No credit card required</p>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "We finally stopped worrying about missing deadlines. StrataGenie sends us reminders months in advance and even drafts the documents we need. Game changer for our small scheme.",
      name: "Sarah Mitchell",
      role: "Secretary • Bondi 8-lot scheme",
      initials: "SM",
      color: "blue",
    },
    {
      quote: "For small buildings like ours, hiring a strata manager never made sense — the cost was insane. StrataGenie is the perfect middle ground. Professional compliance at a fraction of the price.",
      name: "Jennifer Lee",
      role: "Treasurer • 4-lot duplex, Manly",
      initials: "JL",
      color: "emerald",
    },
    {
      quote: "The Strata Hub export feature alone saves us hours every year. Everything is pre-validated and ready to lodge. No more scrambling before deadlines or worrying we missed something.",
      name: "Michael Torres",
      role: "Secretary • Surry Hills complex",
      initials: "MT",
      color: "purple",
    },
    {
      quote: "StrataGenie handles all the admin so our committee can focus on real issues like maintenance and improvements. The Guardian Agent has settled so many bylaw disputes for us instantly.",
      name: "David Kim",
      role: "Chair • Parramatta townhouses",
      initials: "DK",
      color: "amber",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-cyan-500/20 text-cyan-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
    purple: "bg-purple-500/20 text-purple-400",
    amber: "bg-cyan-500/20 text-cyan-400",
  };

  return (
    <section className="py-20 md:py-28 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-slate-300 text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Trusted by NSW committees
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            What our users say
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl border border-white/10 p-8 hover:border-white/20 hover:-translate-y-1 transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-cyan-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${colorMap[t.color]} flex items-center justify-center font-semibold`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-medium text-white">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: "Is StrataGenie compatible with Strata Hub?",
      answer: "Yes! StrataGenie is specifically designed to work with the NSW Strata Hub. We track your reporting windows, validate all required fields according to the latest specifications, and generate JSON exports that are ready for lodgement.",
    },
    {
      question: "Do we still need a strata manager?",
      answer: "That depends on your scheme. Many small schemes (2-20 lots) successfully self-manage with StrataGenie as their compliance assistant. For larger or more complex schemes, StrataGenie can complement a professional manager by handling routine compliance tasks.",
    },
    {
      question: "What if our committee is tiny (2 lots)?",
      answer: "Two-lot schemes are perfect for StrataGenie! You still have the same compliance obligations as larger schemes but likely don't want to pay thousands for a strata manager. At $14.99 per lot per month, that's under $30/month for complete compliance coverage.",
    },
    {
      question: "Who owns our data?",
      answer: "You do. Your scheme data belongs to your owners corporation. You can export all your data at any time, and if you cancel your subscription, we provide a complete data export. We never sell or share your data with third parties.",
    },
    {
      question: "How secure is the platform?",
      answer: "Security is paramount. All data is encrypted in transit and at rest. We use Australian-based cloud infrastructure, implement strict access controls, and maintain regular security audits.",
    },
    {
      question: "How does billing work?",
      answer: "Billing is simple: $14.99 per lot per month, billed annually. You get a 14-day free trial to test everything with no credit card required. After the trial, you'll be invoiced for the annual amount.",
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-28 px-6 bg-slate-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-400">
            Everything you need to know about StrataGenie
          </p>
        </div>

        <div className="glass rounded-2xl border border-white/10 shadow-sm divide-y divide-white/10">
          {faqs.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex items-center justify-between cursor-pointer py-5 px-6">
                <span className="font-medium text-white pr-6">{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-6 pb-5 text-slate-400 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="py-20 md:py-28 px-6 relative overflow-hidden">
      {/* Gradient background - Teal + Gold */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-cyan-700 to-sky-500" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Ready to simplify your strata compliance?
        </h2>
        <p className="text-cyan-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Join hundreds of NSW committees who&apos;ve automated their compliance with StrataGenie. Start your free trial today.
        </p>
        <Link href="/sign-up" className="inline-flex items-center gap-2 btn-glow bg-white hover:bg-slate-50 text-cyan-700 text-lg px-10 py-4 rounded-full font-semibold shadow-2xl hover:-translate-y-1 transition-all">
          Start Your 14-Day Free Trial
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="mt-5 text-cyan-100 text-sm">
          No credit card required • Free for 14 days • Cancel anytime
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16 px-6 bg-slate-950 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="mb-5">
              <Image
                src="/images/logo/logo-seablue-final.png"
                alt="StrataGenie"
                width={400}
                height={100}
                className="h-20 md:h-24 w-auto object-contain"
              />
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              The AI-powered compliance copilot for self-managed strata schemes in NSW. Built specifically for the Strata Schemes Management Act 2015.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
              <li><Link href="/sign-up" className="text-slate-400 hover:text-white transition-colors">Free Trial</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><a href="mailto:hello@stratagenie.app" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2025 StrataGenie. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-slate-500 text-xs">
                <Globe className="w-4 h-4" />
                Australian Owned
              </span>
              <span className="flex items-center gap-2 text-slate-500 text-xs">
                <Lock className="w-4 h-4" />
                Secure & Encrypted
              </span>
            </div>
          </div>
          <p className="text-slate-600 text-xs text-center md:text-left mt-4 max-w-2xl">
            This tool provides administrative guidance only, not legal advice. Always verify compliance requirements with NSW Fair Trading.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="font-sans antialiased bg-slate-950 text-white landing-page">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <AgentsSection />
      <StrataHubSection />
      <ComparisonSection />
      <SavingsCalculatorSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
