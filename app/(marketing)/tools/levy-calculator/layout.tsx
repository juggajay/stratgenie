import { Metadata } from "next";
import { createToolMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  generateFreeToolSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/seo/schemas";

export const metadata: Metadata = createToolMetadata({
  title: "Free Strata Levy Calculator NSW",
  description:
    "Calculate individual lot levies based on unit entitlements and total budget. Free tool for NSW strata committees to determine fair levy contributions.",
  slug: "levy-calculator",
});

const levyCalculatorFaqs = [
  {
    question: "What is the difference between admin and capital works levies?",
    answer:
      "Admin levies cover day-to-day expenses like insurance, cleaning, and utilities. Capital works levies fund major repairs and long-term maintenance like painting, roof replacement, and structural work.",
  },
  {
    question: "How do I find my unit entitlement?",
    answer:
      "Your unit entitlement is shown on your strata plan (available from NSW Land Registry Services), on your levy notices, or you can ask your strata secretary. It's a number that represents your share of scheme costs.",
  },
  {
    question: "Can I change my unit entitlement?",
    answer:
      "Unit entitlements are set when the strata plan is registered and very rarely change. Reallocation requires a special resolution and registration of an amended strata plan with NSW Land Registry.",
  },
];

export default function LevyCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={[
          generateFreeToolSchema({
            name: "Strata Levy Calculator",
            description:
              "Calculate individual lot levies based on unit entitlements and total budget for NSW strata schemes.",
            path: "/tools/levy-calculator",
          }),
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Levy Calculator", path: "/tools/levy-calculator" },
          ]),
          generateFAQSchema(levyCalculatorFaqs),
        ]}
      />
      {children}
    </>
  );
}
