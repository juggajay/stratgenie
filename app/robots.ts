import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo/constants";

/**
 * Generate robots.txt for search engine crawlers
 * This tells search engines which pages to index
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = SEO_CONFIG.siteUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Protected application routes
          "/dashboard",
          "/dashboard/",
          "/onboarding",
          "/onboarding/",

          // API routes
          "/api/",

          // Auth pages (no value in indexing)
          "/sign-in",
          "/sign-up",

          // Next.js internals
          "/_next/",

          // Convex internals
          "/.well-known/",
        ],
      },
      // Block specific bots if needed
      // {
      //   userAgent: "GPTBot",
      //   disallow: "/",
      // },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
