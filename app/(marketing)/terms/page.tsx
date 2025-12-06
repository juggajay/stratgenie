import { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, generateWebPageSchema } from "@/lib/seo/schemas";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description:
    "Read the Terms of Service for StrataGenie, the AI-powered strata compliance platform for NSW. Understand your rights and obligations when using our service.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Terms of Service", path: "/terms" },
          ]),
          generateWebPageSchema({
            title: "Terms of Service",
            description: "StrataGenie Terms of Service",
            path: "/terms",
          }),
        ]}
      />

      <div className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-semibold tracking-tight text-[#1a1a2e] mb-4">
            Terms of Service
          </h1>
          <p className="text-[#6b6b8a] mb-12">Last updated: December 2024</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
                1. Agreement to Terms
              </h2>
              <p className="text-[#3d3d5c] leading-relaxed mb-4">
                By accessing or using StrataGenie (&quot;the Service&quot;), you agree to be
                bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any
                part of these terms, you do not have permission to access the Service.
              </p>
              <p className="text-[#3d3d5c] leading-relaxed">
                These Terms apply to all visitors, users, and others who access or use
                the Service. By using the Service on behalf of an owners corporation or
                strata committee, you represent that you have the authority to bind that
                entity to these Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
                2. Description of Service
              </h2>
              <p className="text-[#3d3d5c] leading-relaxed mb-4">
                StrataGenie is a software-as-a-service (SaaS) platform designed to assist
                self-managed strata schemes in New South Wales with:
              </p>
              <ul className="list-disc pl-6 text-[#3d3d5c] space-y-2">
                <li>Compliance tracking and deadline management</li>
                <li>AGM and meeting administration</li>
                <li>Financial record keeping and levy management</li>
                <li>Document storage and generation</li>
                <li>Strata Hub reporting assistance</li>
                <li>Bylaw reference and AI-powered guidance</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
                3. Account Registration
              </h2>
              <p className="text-[#3d3d5c] leading-relaxed mb-4">
                To use the Service, you must create an account and provide accurate,
                complete information. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-[#3d3d5c] space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring your strata scheme details are accurate</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
                4. Subscription and Payment
              </h2>
              <h3 className="text-lg font-medium text-[#1a1a2e] mb-3">4.1 Pricing</h3>
              <p className="text-[#3d3d5c] leading-relaxed mb-4">
                StrataGenie is offered on a subscription basis at the pricing published
                on our website. Prices are in Australian Dollars (AUD) and may be subject
                to change with 30 days notice.
              </p>

              <h3 className="text-lg font-medium text-[#1a1a2e] mb-3">4.2 Free Trial</h3>
              <p className="text-[#3d3d5c] leading-relaxed mb-4">
                We offer a free trial period. At the end of the trial, your subscription
                will begin unless you cancel. You will be notified before any charges
                apply.
              </p>

              <h3 className="text-lg font-medium text-[#1a1a2e] mb-3">4.3 Refunds</h3>
              <p className="text-[#3d3d5c] leading-relaxed">
                Subscription fees are non-refundable except as required by Australian
                Consumer Law. If you are dissatisfied with the Service, please contact us
                to discuss your concerns.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
                5. Acceptable Use
              </h2>
              <p className="text-[#3d3d5c] leading-relaxed mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-[#3d3d5c] space-y-2">
                <li>Use the Service for any unlawful purpose</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Resell or redistribute the Service without authorization</li>
                <li>Use automated systems to access the Service without permission</li>
                <li>Infringe on the intellectual property rights of others</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-[#3d3d5c] leading-relaxed mb-4">
                The Service and its original content, features, and functionality are
                owned by StrataGenie and are protected by international copyright,
                trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-[#3d3d5c] leading-relaxed">
                You retain ownership of any content you upload to the Service. By
                uploading content, you grant us a license to use, store, and process that
                content to provide the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
                7. Disclaimer of Warranties
              </h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-amber-800 font-medium">Important Notice</p>
              </div>
              <p className="text-[#3d3d5c] leading-relaxed mb-4">
                The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties
                of any kind, either express or implied.
              </p>
              <p className="text-[#3d3d5c] leading-relaxed mb-4">
                <strong>
                  StrataGenie provides administrative tools and guidance, NOT legal,
                  financial, or professional advice.
                </strong>{" "}
                The information and features provided should not be relied upon as a
                substitute for professional advice from qualified lawyers, accountants,
                or strata managers.
              </p>
              <p className="text-[#3d3d5c] leading-relaxed">
                You are responsible for verifying all compliance requirements with NSW
                Fair Trading and ensuring your strata scheme meets its legal obligations.
                We do not guarantee the accuracy, completeness, or timeliness of any
                information provided through the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-[#3d3d5c] leading-relaxed mb-4">
                To the maximum extent permitted by applicable law, StrataGenie shall not
                be liable for any indirect, incidental, special, consequential, or
                punitive damages, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-[#3d3d5c] space-y-2">
                <li>Loss of profits, data, or business opportunities</li>
                <li>Penalties or fines from regulatory non-compliance</li>
                <li>Costs of procuring substitute services</li>
                <li>Any damages arising from unauthorized access to your data</li>
              </ul>
              <p className="text-[#3d3d5c] leading-relaxed mt-4">
                Our total liability for any claims arising from the Service shall not
                exceed the amount paid by you for the Service in the twelve (12) months
                prior to the claim.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
                9. Data and Privacy
              </h2>
              <p className="text-[#3d3d5c] leading-relaxed">
                Your use of the Service is also governed by our{" "}
                <a href="/privacy" className="text-[#FF6B35] hover:underline">
                  Privacy Policy
                </a>
                , which describes how we collect, use, and protect your information. By
                using the Service, you consent to the collection and use of information
                as described in the Privacy Policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
                10. Termination
              </h2>
              <p className="text-[#3d3d5c] leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Service
                immediately, without prior notice, for conduct that we believe:
              </p>
              <ul className="list-disc pl-6 text-[#3d3d5c] space-y-2">
                <li>Violates these Terms</li>
                <li>Is harmful to other users or the Service</li>
                <li>Is fraudulent or illegal</li>
              </ul>
              <p className="text-[#3d3d5c] leading-relaxed mt-4">
                You may cancel your subscription at any time. Upon termination, your
                right to use the Service will cease immediately. We will provide an
                opportunity to export your data before account deletion.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
                11. Changes to Terms
              </h2>
              <p className="text-[#3d3d5c] leading-relaxed">
                We reserve the right to modify these Terms at any time. We will provide
                notice of significant changes by email or through the Service. Your
                continued use of the Service after such modifications constitutes
                acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
                12. Governing Law
              </h2>
              <p className="text-[#3d3d5c] leading-relaxed">
                These Terms are governed by the laws of New South Wales, Australia. Any
                disputes arising from these Terms or the Service shall be subject to the
                exclusive jurisdiction of the courts of New South Wales.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">
                13. Contact Us
              </h2>
              <p className="text-[#3d3d5c] leading-relaxed">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="mt-4 p-4 bg-[#F8F5F0] rounded-lg">
                <p className="text-[#3d3d5c]">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:legal@stratagenie.app"
                    className="text-[#FF6B35] hover:underline"
                  >
                    legal@stratagenie.app
                  </a>
                </p>
                <p className="text-[#3d3d5c] mt-2">
                  <strong>General Inquiries:</strong>{" "}
                  <a
                    href="mailto:hello@stratagenie.app"
                    className="text-[#FF6B35] hover:underline"
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
