import { Metadata } from "next";
import { createToolMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  generateFreeToolSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schemas";

export const metadata: Metadata = createToolMetadata({
  title: "Free Strata Hub Reporter Tool NSW",
  description:
    "Generate Strata Hub compliant reports for your NSW strata scheme. Free tool to help meet your annual reporting obligations.",
  slug: "strata-hub-reporter",
});

export default function StrataHubReporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={[
          generateFreeToolSchema({
            name: "Strata Hub Reporter",
            description:
              "Free tool to generate Strata Hub compliant reports for NSW strata schemes.",
            path: "/tools/strata-hub-reporter",
          }),
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Strata Hub Reporter", path: "/tools/strata-hub-reporter" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
