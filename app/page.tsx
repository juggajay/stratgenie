import { JsonLd } from "@/components/seo/JsonLd";
import {
  generateOrganizationSchema,
  generateSoftwareApplicationSchema,
  generateFAQSchema,
} from "@/lib/seo/schemas";
import LandingPageClient from "./landing-page-client";

// Homepage FAQs for structured data
const homepageFaqs = [
  {
    question: "How does per-lot pricing work?",
    answer:
      "You pay based on the number of lots in your scheme. As you grow, you automatically move into better pricing tiers with volume discounts. All lots are charged at your tier's rate.",
  },
  {
    question: "What happens after my free trial?",
    answer:
      "After 14 days, you can choose to subscribe to continue using StrataGenie. If you don't subscribe, your account will be limited but your data will be preserved.",
  },
  {
    question: "Can I change my lot count later?",
    answer:
      "Yes! If adding lots moves you to a new tier, you'll get the better rate on ALL lots immediately. We'll prorate the difference on your next invoice.",
  },
  {
    question: "Is there a setup fee?",
    answer:
      "No setup fees, no hidden costs. The price you see is the price you pay. Start your free trial and only pay when you're ready.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          generateOrganizationSchema(),
          generateSoftwareApplicationSchema(),
          generateFAQSchema(homepageFaqs),
        ]}
      />
      <LandingPageClient />
    </>
  );
}
