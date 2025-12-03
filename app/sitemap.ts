import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo/constants";
import { getAllPosts } from "@/lib/content";
import { getAllSuburbs } from "@/lib/suburbs";

/**
 * Generate dynamic sitemap.xml for search engines
 * This helps search engines discover and index all public pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_CONFIG.siteUrl;

  // Static pages - always included
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/levy-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/strata-roll-template`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/compliance-health-check`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/strata-hub-reporter`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9, // High value lead gen tool
    },
  ];

  // Guide/Pillar pages
  const guidePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/guides/nsw-strata-compliance`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides/strata-financial-management`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides/maintenance-asset-management`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides/transition-to-self-managed`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides/2025-nsw-strata-reforms`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0, // High priority - new laws, timely content
    },
  ];

  // Blog posts
  const blogPosts = await getAllPosts();
  const blogUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.frontmatter.updatedAt || post.frontmatter.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  // Category pages
  const categories = [...new Set(blogPosts.map((p) => p.frontmatter.category))];
  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // Suburb pages
  const suburbs = getAllSuburbs();
  const suburbUrls: MetadataRoute.Sitemap = suburbs.map((suburb) => ({
    url: `${baseUrl}/strata-management/${suburb.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...toolPages,
    ...guidePages,
    ...blogUrls,
    ...categoryUrls,
    ...suburbUrls,
  ];
}
