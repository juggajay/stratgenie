import { SEO_CONFIG } from "./constants";

/**
 * JSON-LD Schema Generators for SEO
 * These generate structured data for rich search results
 */

/**
 * Organization schema - used site-wide
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    logo: `${SEO_CONFIG.siteUrl}/logo.svg`,
    description: SEO_CONFIG.defaultDescription,
    address: {
      "@type": "PostalAddress",
      addressCountry: "AU",
      addressRegion: "NSW",
      addressLocality: "Sydney",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: SEO_CONFIG.supportEmail,
      contactType: "customer support",
    },
    sameAs: [
      "https://twitter.com/stratagenie",
      // "https://linkedin.com/company/stratagenie", // Uncomment when LinkedIn page is active
    ],
  };
}

/**
 * SoftwareApplication schema - for homepage and product pages
 */
export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SEO_CONFIG.siteName,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Property Management Software",
    operatingSystem: "Web Browser",
    description: SEO_CONFIG.defaultDescription,
    url: SEO_CONFIG.siteUrl,
    offers: {
      "@type": "Offer",
      price: "14.99",
      priceCurrency: "AUD",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability: "https://schema.org/InStock",
      description: "Per lot per month, billed annually",
    },
    featureList: [
      "AGM Compliance Tracking",
      "Strata Hub Integration",
      "AI-Powered Document Generation",
      "Levy Calculation & Management",
      "Bylaw Q&A Assistant",
      "Invoice Processing",
    ],
    screenshot: `${SEO_CONFIG.siteUrl}/og-image.png`,
  };
}

/**
 * FAQPage schema - for FAQ sections
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Article schema - for blog posts
 */
export function generateArticleSchema(options: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    image: options.image
      ? `${SEO_CONFIG.siteUrl}${options.image}`
      : `${SEO_CONFIG.siteUrl}/og-image.png`,
    datePublished: options.publishedAt,
    dateModified: options.updatedAt || options.publishedAt,
    author: {
      "@type": "Organization",
      name: options.author || SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${SEO_CONFIG.siteUrl}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SEO_CONFIG.siteUrl}/blog/${options.slug}`,
    },
  };
}

/**
 * BreadcrumbList schema - for navigation breadcrumbs
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SEO_CONFIG.siteUrl}${item.path}`,
    })),
  };
}

/**
 * WebPage schema - generic page schema
 */
export function generateWebPageSchema(options: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.title,
    description: options.description,
    url: `${SEO_CONFIG.siteUrl}${options.path}`,
    isPartOf: {
      "@type": "WebSite",
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
    },
    ...(options.datePublished && { datePublished: options.datePublished }),
    ...(options.dateModified && { dateModified: options.dateModified }),
  };
}

/**
 * HowTo schema - for guide/tutorial content
 */
export function generateHowToSchema(options: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
  totalTime?: string; // ISO 8601 duration, e.g., "PT30M"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: options.name,
    description: options.description,
    ...(options.totalTime && { totalTime: options.totalTime }),
    step: options.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/**
 * LocalBusiness schema - for suburb landing pages
 */
export function generateLocalBusinessSchema(options: {
  suburb: string;
  region: string;
  postcode: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${SEO_CONFIG.siteName} - ${options.suburb}`,
    description: `Strata management software for ${options.suburb}, ${options.region}`,
    areaServed: {
      "@type": "Place",
      name: options.suburb,
      address: {
        "@type": "PostalAddress",
        addressLocality: options.suburb,
        addressRegion: "NSW",
        postalCode: options.postcode,
        addressCountry: "AU",
      },
    },
    provider: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
    },
  };
}

/**
 * Free tool schema - for calculator/tool pages
 */
export function generateFreeToolSchema(options: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: options.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SEO_CONFIG.siteUrl}${options.path}`,
    description: options.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AUD",
    },
    provider: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
    },
  };
}
