import { Metadata } from "next";
import { SEO_CONFIG } from "./constants";

/**
 * Options for creating page metadata
 */
interface MetadataOptions {
  /** Page title (will be appended with site name) */
  title?: string;
  /** Page description */
  description?: string;
  /** Page path (e.g., "/blog/my-post") */
  path?: string;
  /** Custom OG image URL */
  image?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Should this page be indexed? */
  noIndex?: boolean;
  /** Page type for OpenGraph */
  type?: "website" | "article";
  /** Published date for articles */
  publishedTime?: string;
  /** Modified date for articles */
  modifiedTime?: string;
  /** Article author */
  author?: string;
  /** Article tags */
  tags?: string[];
}

/**
 * Create consistent metadata for any page
 */
export function createMetadata(options: MetadataOptions = {}): Metadata {
  const {
    title,
    description = SEO_CONFIG.defaultDescription,
    path = "",
    image = "/og-image.png",
    imageAlt,
    noIndex = false,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    tags,
  } = options;

  // Build full title
  const fullTitle = title
    ? `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.defaultTitle;

  // Build canonical URL
  const canonicalUrl = `${SEO_CONFIG.siteUrl}${path}`;

  // Build image URL (ensure absolute)
  const imageUrl = image.startsWith("http")
    ? image
    : `${SEO_CONFIG.siteUrl}${image}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SEO_CONFIG.siteName,
      locale: SEO_CONFIG.locale,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt || fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: SEO_CONFIG.twitterHandle,
    },
  };

  // Add robots directive if noIndex
  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    };
  }

  // Add article-specific OpenGraph data
  if (type === "article" && metadata.openGraph) {
    const articleOG = metadata.openGraph as {
      type: "article";
      publishedTime?: string;
      modifiedTime?: string;
      authors?: string[];
      tags?: string[];
    };
    articleOG.type = "article";
    if (publishedTime) articleOG.publishedTime = publishedTime;
    if (modifiedTime) articleOG.modifiedTime = modifiedTime;
    if (author) articleOG.authors = [author];
    if (tags) articleOG.tags = tags;
  }

  return metadata;
}

/**
 * Create metadata for a blog post
 */
export function createArticleMetadata(options: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  category?: string;
  tags?: string[];
}): Metadata {
  return createMetadata({
    title: options.title,
    description: options.description,
    path: `/blog/${options.slug}`,
    image: options.image,
    type: "article",
    publishedTime: options.publishedAt,
    modifiedTime: options.updatedAt,
    author: options.author || SEO_CONFIG.siteName,
    tags: options.tags,
  });
}

/**
 * Create metadata for a tool page
 */
export function createToolMetadata(options: {
  title: string;
  description: string;
  slug: string;
  image?: string;
}): Metadata {
  return createMetadata({
    title: options.title,
    description: options.description,
    path: `/tools/${options.slug}`,
    image: options.image || "/og-tools.png",
  });
}

/**
 * Create metadata for a suburb landing page
 */
export function createSuburbMetadata(options: {
  suburbName: string;
  region: string;
  slug: string;
}): Metadata {
  return createMetadata({
    title: `Strata Management in ${options.suburbName}`,
    description: `Self-manage your ${options.suburbName} strata scheme with AI-powered compliance tools. Designed for NSW strata committees in ${options.region}.`,
    path: `/strata-management/${options.slug}`,
  });
}
