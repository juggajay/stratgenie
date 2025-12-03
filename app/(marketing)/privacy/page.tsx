import { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, generateWebPageSchema } from "@/lib/seo/schemas";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "Learn how StrataGenie collects, uses, and protects your personal information. We are committed to safeguarding your privacy and data security.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy" },
          ]),
          generateWebPageSchema({
            title: "Privacy Policy",
            description: "StrataGenie Privacy Policy",
            path: "/privacy",
          }),
        ]}
      />

      <div className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-500 mb-12">Last updated: December 2024</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                StrataGenie (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our strata management software
                platform.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We comply with the Australian Privacy Principles (APPs) contained in the
                Privacy Act 1988 (Cth) and applicable state privacy legislation in New
                South Wales.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-lg font-medium text-slate-800 mb-3">
                2.1 Information You Provide
              </h3>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
                <li>Account information (name, email address, password)</li>
                <li>Strata scheme details (scheme name, strata plan number, lot information)</li>
                <li>Financial data (levy amounts, invoices, transaction records)</li>
                <li>Documents you upload (bylaws, meeting minutes, notices)</li>
                <li>Communication data (support requests, feedback)</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-800 mb-3">
                2.2 Information Collected Automatically
              </h3>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Device information (browser type, operating system)</li>
                <li>Usage data (features accessed, time spent, actions taken)</li>
                <li>Log data (IP address, access times, pages viewed)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Provide and maintain our strata management services</li>
                <li>Process transactions and send related information</li>
                <li>Generate compliance reports and reminders</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Send you technical notices, updates, and security alerts</li>
                <li>Improve and optimize our platform</li>
                <li>Comply with legal obligations under NSW strata legislation</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                4. Data Storage and Security
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Your data is stored securely using industry-standard encryption and
                security measures:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>All data is encrypted in transit using TLS 1.3</li>
                <li>Data at rest is encrypted using AES-256 encryption</li>
                <li>We use secure, SOC 2 compliant cloud infrastructure</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and authentication mechanisms</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                <strong>Data Residency:</strong> Your data is stored on servers located
                in Australia to ensure compliance with local data sovereignty
                requirements.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                5. Information Sharing
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We do not sell your personal information. We may share your information
                in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>
                  <strong>Service Providers:</strong> With third-party vendors who assist
                  in operating our platform (hosting, payment processing, email delivery)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to respond
                  to valid legal process
                </li>
                <li>
                  <strong>Strata Hub:</strong> To submit required reports to the NSW
                  Government Strata Hub on your behalf
                </li>
                <li>
                  <strong>With Your Consent:</strong> When you direct us to share
                  information with third parties
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                6. Your Rights
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Under Australian privacy law, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your data (subject to legal retention requirements)</li>
                <li>Opt-out of marketing communications</li>
                <li>Lodge a complaint with the Office of the Australian Information Commissioner</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                7. Data Retention
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We retain your personal information for as long as your account is
                active or as needed to provide you services. We will retain and use your
                information as necessary to comply with our legal obligations (including
                strata record-keeping requirements under the Strata Schemes Management
                Act 2015), resolve disputes, and enforce our agreements.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                8. Cookies
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We use cookies and similar technologies to enhance your experience,
                analyze usage patterns, and deliver personalized content. You can control
                cookie preferences through your browser settings. Essential cookies
                required for the platform to function cannot be disabled.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you
                of any changes by posting the new Privacy Policy on this page and
                updating the &quot;Last updated&quot; date. You are advised to review this Privacy
                Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                10. Contact Us
              </h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-slate-100 rounded-lg">
                <p className="text-slate-700">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:privacy@stratagenie.app"
                    className="text-blue-600 hover:underline"
                  >
                    privacy@stratagenie.app
                  </a>
                </p>
                <p className="text-slate-700 mt-2">
                  <strong>General Inquiries:</strong>{" "}
                  <a
                    href="mailto:hello@stratagenie.app"
                    className="text-blue-600 hover:underline"
                  >
                    hello@stratagenie.app
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
