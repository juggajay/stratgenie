import { Metadata } from "next";
import { createToolMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  generateFreeToolSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schemas";

export const metadata: Metadata = createToolMetadata({
  title: "Free Strata Roll Template NSW",
  description:
    "Download a free, compliant strata roll template for NSW schemes. Includes all required fields under the Strata Schemes Management Act 2015.",
  slug: "strata-roll-template",
});

export default function StrataRollTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={[
          generateFreeToolSchema({
            name: "Strata Roll Template",
            description:
              "Free, compliant strata roll template for NSW schemes with all required fields under SSMA 2015.",
            path: "/tools/strata-roll-template",
          }),
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Strata Roll Template", path: "/tools/strata-roll-template" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
