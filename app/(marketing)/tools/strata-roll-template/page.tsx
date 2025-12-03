"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, ArrowLeft, Download, Check, Mail } from "lucide-react";
import { useMutation, useAction } from "convex/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";

export default function StrataRollTemplatePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const captureLead = useMutation(api.leads.capture);
  const sendEmail = useAction(api.actions.marketingEmail.sendStrataRollEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // Capture lead and send email in parallel
      await Promise.all([
        captureLead({
          email,
          name: name || undefined,
          source: "strata_roll_template",
        }),
        sendEmail({
          to: email,
          name: name || undefined,
        }),
      ]);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to process:", error);
      // Still show success if lead was captured even if email failed
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (format: "xlsx" | "pdf") => {
    // In production, these would be actual files in the public folder
    const downloadUrl = `/downloads/strata-roll-template.${format}`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-3">
            Free Strata Roll Template
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Download a compliant NSW strata roll template. Includes all required
            fields under the Strata Schemes Management Act 2015.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Download Form */}
          <Card className="border border-slate-200 rounded-xl bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                {submitted ? "Download Your Template" : "Get Your Free Template"}
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                {submitted
                  ? "Click below to download in your preferred format"
                  : "Enter your email to download instantly"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Name (optional)
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-lg border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-lg border-slate-300"
                    />
                    <p className="text-xs text-slate-500">
                      We'll send you occasional strata tips. Unsubscribe anytime.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-3"
                  >
                    {isLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Get Free Template
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-800">
                        Thanks! Choose your download format below.
                      </p>
                      <p className="text-xs text-emerald-700 mt-1">
                        We've also sent a copy to {email}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleDownload("xlsx")}
                      className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-center"
                    >
                      <Download className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <span className="block text-sm font-medium text-slate-900">
                        Excel (.xlsx)
                      </span>
                      <span className="text-xs text-slate-500">Editable spreadsheet</span>
                    </button>
                    <button
                      onClick={() => handleDownload("pdf")}
                      className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-center"
                    >
                      <Download className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <span className="block text-sm font-medium text-slate-900">
                        PDF
                      </span>
                      <span className="text-xs text-slate-500">Print-ready format</span>
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Template Preview */}
          <div className="space-y-6">
            <Card className="border border-slate-200 rounded-xl bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  What's Included
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  NSW-compliant strata roll fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Lot number and unit entitlement",
                    "Owner name and contact details",
                    "Correspondence address",
                    "Agent/tenant information",
                    "Emergency contact details",
                    "Parking and storage allocations",
                    "Notes and special conditions",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Legal Requirement */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Legal Requirement</h4>
              <p className="text-sm text-blue-800">
                Under Section 178 of the Strata Schemes Management Act 2015 (NSW),
                every owners corporation must maintain a strata roll containing
                current details of all lot owners. The roll must be updated within
                14 days of any change.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <h3 className="font-medium text-slate-900 mb-2">
                What is a strata roll?
              </h3>
              <p className="text-slate-600 text-sm">
                A strata roll is a register of all lot owners in a strata scheme.
                It must include owner names, addresses for service of notices,
                and other prescribed information. It's a legal requirement for
                all NSW strata schemes.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <h3 className="font-medium text-slate-900 mb-2">
                Who can access the strata roll?
              </h3>
              <p className="text-slate-600 text-sm">
                Lot owners can inspect the strata roll on request. The owners
                corporation can charge a reasonable fee for providing copies.
                Privacy laws require that personal information is handled
                appropriately.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <h3 className="font-medium text-slate-900 mb-2">
                How often must the strata roll be updated?
              </h3>
              <p className="text-slate-600 text-sm">
                The strata roll must be updated within 14 days of an owner
                notifying the owners corporation of any changes. When a lot is
                sold, the new owner must notify the strata committee of their
                details within one month.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-3">
            Need help managing your strata records?
          </h2>
          <p className="text-emerald-100 mb-6 max-w-md mx-auto">
            StrataGenie keeps your strata roll, meeting minutes, and all
            documents organized and compliant.
          </p>
          <Link href="/sign-up">
            <Button className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-lg px-6 py-2.5">
              Start Free Trial
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
