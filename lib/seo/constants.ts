/**
 * SEO Configuration Constants
 * Central configuration for all SEO-related settings
 */

export const SEO_CONFIG = {
  // Site Identity
  siteName: "StrataGenie",
  siteUrl: "https://stratagenie.com.au",

  // Default Meta
  defaultTitle: "StrataGenie | AI-Powered Strata Compliance Copilot for NSW",
  defaultDescription:
    "Stay compliant, avoid penalties, and simplify strata admin. StrataGenie tracks every AGM, notice period, Strata Hub deadline, and bylaw — so your committee never misses a requirement.",

  // Locale
  locale: "en_AU",
  language: "en",

  // Brand Colors (for manifest/theme)
  themeColor: "#0d9488", // teal-600
  backgroundColor: "#fafaf9", // stone-50

  // Social
  twitterHandle: "@stratagenie",

  // Contact
  supportEmail: "hello@stratagenie.app",

  // Legal
  companyName: "StrataGenie Pty Ltd",
  abn: "", // Add when available

  // Keywords (for SEO)
  defaultKeywords: [
    "strata compliance NSW",
    "strata management software",
    "AGM compliance",
    "Strata Hub NSW",
    "self-managed strata",
    "strata committee software",
    "SSMA 2015 compliance",
    "strata levy calculator",
    "NSW strata regulations",
  ] as string[],
};

// Image generation model selection
export const IMAGE_CONFIG = {
  model: "gemini-3-pro-image", // Nano Banana Pro
  defaultAspectRatio: "16:9",
  defaultSize: "1200x630", // OG image size
} as const;

// Route configuration for SEO
export const ROUTE_CONFIG = {
  // Public routes (should be indexed)
  public: ["/", "/blog", "/guides", "/tools", "/privacy", "/terms"],

  // Protected routes (should NOT be indexed)
  protected: ["/dashboard", "/onboarding", "/api", "/sign-in", "/sign-up"],

  // Tool pages
  tools: [
    "/tools/levy-calculator",
    "/tools/strata-roll-template",
    "/tools/compliance-health-check",
  ],
} as const;
