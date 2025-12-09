import { Metadata } from "next";
import { createToolMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  generateFreeToolSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schemas";

export const metadata: Metadata = createToolMetadata({
  title: "Free Strata Compliance Health Check NSW",
  description:
    "Check your NSW strata scheme's compliance status. Free tool to identify AGM, Strata Hub, insurance, and record-keeping obligations.",
  slug: "compliance-health-check",
});

export default function ComplianceHealthCheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={[
          generateFreeToolSchema({
            name: "Strata Compliance Health Check",
            description:
              "Free tool to check your NSW strata scheme's compliance status and identify obligations.",
            path: "/tools/compliance-health-check",
          }),
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Compliance Health Check", path: "/tools/compliance-health-check" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
