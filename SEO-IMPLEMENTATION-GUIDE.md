# SEO Implementation Guide for Developers

**For:** Development Team
**Purpose:** Technical implementation of SEO framework
**Last Updated:** December 4, 2025

---

## 1. Code-Level Header Implementation

### TypeScript/React: Heading Components

```tsx
// ✅ CORRECT: Semantic HTML with proper hierarchy
export function BlogPost() {
  return (
    <>
      <h1 className="text-4xl font-bold">NSW Strata Compliance Training 2025</h1>

      <h2 className="text-2xl font-bold mt-8">What's Changed in 2025?</h2>
      <p>Content here...</p>

      <h3 className="text-xl font-bold mt-6">Enhanced Committee Duties</h3>
      <p>Content here...</p>

      <h3 className="text-xl font-bold mt-6">New Training Resources</h3>
      <p>Content here...</p>

      <h2 className="text-2xl font-bold mt-8">Is Training Mandatory?</h2>
      <p>Content here...</p>
    </>
  );
}

// ❌ WRONG: Non-semantic styling
export function BadBlogPost() {
  return (
    <>
      <div className="text-4xl font-bold">NSW Strata Compliance Training 2025</div>
      <div className="text-2xl font-bold mt-8">What's Changed?</div>
      {/* ^ Search engines can't parse this as structure */}
    </>
  );
}
```

### Heading Component Utility

```tsx
// Create reusable heading components that enforce hierarchy
import { ReactNode } from 'react';

interface HeadingProps {
  children: ReactNode;
  className?: string;
}

// Use these components to ensure proper HTML structure
export function H1({ children, className }: HeadingProps) {
  return <h1 className={`text-4xl font-bold tracking-tight ${className}`}>{children}</h1>;
}

export function H2({ children, className }: HeadingProps) {
  return <h2 className={`text-2xl font-bold mt-8 ${className}`}>{children}</h2>;
}

export function H3({ children, className }: HeadingProps) {
  return <h3 className={`text-xl font-bold mt-6 ${className}`}>{children}</h3>;
}

export function H4({ children, className }: HeadingProps) {
  return <h4 className={`text-lg font-semibold mt-4 ${className}`}>{children}</h4>;
}

// Usage:
export function BlogPost() {
  return (
    <>
      <H1>NSW Strata Compliance Training 2025</H1>
      <H2>What's Changed in 2025?</H2>
      <H3>Enhanced Committee Duties</H3>
      <H4>Duty of Care Requirements</H4>
    </>
  );
}
```

---

## 2. MDX Header Structure

### Blog Post Frontmatter + Content

```mdx
---
title: "Strata Committee Training NSW: New Accountability Rules for 2025"
description: "Learn about 2025 NSW strata training requirements, enhanced committee duties, and accountability mechanisms."
publishedAt: "2025-01-17"
updatedAt: "2025-01-17"
category: "compliance"
tags: ["2025-reforms", "committee", "training", "governance"]
pillar: "2025-nsw-strata-reforms"
author: "StrataGenie Team"
readingTime: "7 min read"
featured: false
image: "/images/blog/strata-training.jpg"
imageAlt: "Strata committee training session"
---

# Strata Committee Training NSW: New Accountability Rules for 2025

[Intro paragraph - 100-150 words]

## What's Changed in 2025?

[Section content about changes]

### Enhanced Duties

- Point 1
- Point 2

### Training Availability

- Point 1
- Point 2

## Is Training Mandatory?

[Section content]

### Strong Incentives to Train

[Explanation]

### Practical Expectation

[Explanation]

## NSW Fair Trading Training Modules

[Content]

### Module 1: Introduction to Strata

[Content]

## Key Takeaways

[Summary bullets]

## Frequently Asked Questions

### What is the main objective of 2025 training requirements?

[Answer]

### Can non-committee members access training?

[Answer]
```

### Validation Rules for MDX

```typescript
// lib/content/mdx-validator.ts

interface MDXFrontmatter {
  title: string; // Max 70 chars
  description: string; // Max 160 chars
  publishedAt: string; // ISO date
  updatedAt?: string; // ISO date
  category: 'compliance' | 'financial' | 'maintenance' | 'news' | '2025-reforms';
  tags: string[]; // 3-6 tags
  pillar?: string; // Link to silo
  author?: string;
  readingTime: string; // e.g., "7 min read"
  featured?: boolean;
  image?: string; // For OG image
  imageAlt?: string; // For accessibility
}

export function validateMDXFrontmatter(frontmatter: MDXFrontmatter) {
  const errors: string[] = [];

  if (frontmatter.title.length > 70) {
    errors.push('Title must be under 70 characters');
  }

  if (frontmatter.description.length > 160) {
    errors.push('Description must be under 160 characters');
  }

  if (!frontmatter.tags || frontmatter.tags.length < 3) {
    errors.push('Must include at least 3 tags');
  }

  if (frontmatter.tags.length > 6) {
    errors.push('Maximum 6 tags allowed');
  }

  if (!frontmatter.pillar && frontmatter.category !== 'news') {
    errors.push('Non-news articles must be assigned to a pillar/silo');
  }

  return errors;
}
```

---

## 3. Internal Linking Implementation

### Link Builder Utility

```typescript
// lib/seo/internal-links.ts

import { Post } from '@/lib/content';

interface InternalLink {
  href: string;
  text: string;
  context: 'pillar' | 'sibling' | 'tool' | 'cross-silo';
}

// Define silo structure
const SILOS = {
  compliance: {
    pillar: '/guides/nsw-strata-compliance',
    articles: [
      { slug: 'strata-hub-registration-guide', title: 'Strata Hub Registration Guide' },
      { slug: 'how-to-run-agm-self-managed-strata', title: 'How to Run AGM for Self-Managed Strata' },
      { slug: 'strata-committee-mandatory-training-nsw', title: 'Strata Committee Training NSW' },
    ],
    tools: [
      { slug: 'compliance-health-check', title: 'Compliance Health Check' },
    ],
  },
  financial: {
    pillar: '/guides/strata-financial-management',
    articles: [
      { slug: 'admin-fund-vs-capital-works-fund', title: 'Admin Fund vs Capital Works Fund' },
      { slug: 'strata-levy-payment-plans-nsw', title: 'Strata Levy Payment Plans NSW' },
    ],
    tools: [
      { slug: 'levy-calculator', title: 'Levy Calculator' },
    ],
  },
};

// Generate pillar link for article
export function getPillarLink(pillarSlug: keyof typeof SILOS): InternalLink {
  const silo = SILOS[pillarSlug];
  return {
    href: silo.pillar,
    text: `our comprehensive ${pillarSlug.replace('-', ' ')} guide`,
    context: 'pillar',
  };
}

// Get related articles in same silo
export function getRelatedArticles(
  currentSlug: string,
  pillarSlug: keyof typeof SILOS,
  limit: number = 3
): InternalLink[] {
  const silo = SILOS[pillarSlug];
  return silo.articles
    .filter(article => article.slug !== currentSlug)
    .slice(0, limit)
    .map(article => ({
      href: `/blog/${article.slug}`,
      text: article.title,
      context: 'sibling',
    }));
}

// Get relevant tool for silo
export function getToolLink(pillarSlug: keyof typeof SILOS): InternalLink | null {
  const silo = SILOS[pillarSlug];
  return silo.tools.length > 0
    ? {
        href: `/tools/${silo.tools[0].slug}`,
        text: `Try our ${silo.tools[0].title}`,
        context: 'tool',
      }
    : null;
}

// Get cross-silo link
export function getCrossSiloLink(
  fromSilo: keyof typeof SILOS,
  toSilo: keyof typeof SILOS
): InternalLink {
  const targetSilo = SILOS[toSilo];
  return {
    href: targetSilo.pillar,
    text: `See how ${toSilo.replace('-', ' ')} affects your scheme`,
    context: 'cross-silo',
  };
}
```

### Usage in Blog Post

```tsx
// app/(marketing)/blog/[slug]/page.tsx

import { getPillarLink, getRelatedArticles, getToolLink } from '@/lib/seo/internal-links';

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Get pillar link (REQUIRED for first relevant link)
  const pillarLink = getPillarLink(post.frontmatter.pillar);

  // Get related articles
  const relatedLinks = getRelatedArticles(slug, post.frontmatter.pillar, 2);

  // Get tool link
  const toolLink = getToolLink(post.frontmatter.pillar);

  return (
    <article>
      <h1>{post.frontmatter.title}</h1>

      {/* MDX content rendered here */}
      <MDXRemote source={post.content} components={mdxComponents} />

      {/* Inline links automatically added by MDX component */}

      {/* Related resources section */}
      <aside className="mt-12 p-6 bg-slate-50 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Related Resources</h3>
        <ul className="space-y-2">
          {relatedLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.text}</Link>
            </li>
          ))}
          {toolLink && (
            <li>
              <Link href={toolLink.href}>{toolLink.text}</Link>
            </li>
          )}
        </ul>
      </aside>
    </article>
  );
}
```

### Link Validation

```typescript
// scripts/validate-internal-links.ts

import { getAllPosts } from '@/lib/content';
import { SILOS } from '@/lib/seo/internal-links';

interface LinkIssue {
  page: string;
  issue: string;
  severity: 'error' | 'warning';
}

export async function validateInternalLinks(): Promise<LinkIssue[]> {
  const issues: LinkIssue[] = [];
  const posts = await getAllPosts();

  for (const post of posts) {
    // Check: Pillar assignment
    if (!post.frontmatter.pillar) {
      issues.push({
        page: post.slug,
        issue: 'Missing pillar assignment',
        severity: 'error',
      });
    }

    // Check: Pillar link in content
    const pillarUrl = SILOS[post.frontmatter.pillar]?.pillar;
    if (!post.content.includes(pillarUrl)) {
      issues.push({
        page: post.slug,
        issue: `Missing link to pillar page: ${pillarUrl}`,
        severity: 'warning',
      });
    }

    // Check: Sufficient internal links
    const linkCount = (post.content.match(/href="/g) || []).length;
    if (linkCount < 3) {
      issues.push({
        page: post.slug,
        issue: `Only ${linkCount} internal links found (recommended: 5-8)`,
        severity: 'warning',
      });
    }

    // Check: Anchor text quality
    const clickHereCount = (post.content.match(/click here/gi) || []).length;
    if (clickHereCount > 0) {
      issues.push({
        page: post.slug,
        issue: `"Click here" found ${clickHereCount}x (use descriptive text)`,
        severity: 'warning',
      });
    }
  }

  return issues;
}

// Run with: npx ts-node scripts/validate-internal-links.ts
```

---

## 4. Schema Markup Implementation

### Schema Generation Helpers

```typescript
// lib/seo/schema-helpers.ts

import { SEO_CONFIG } from './constants';

/**
 * Add schema to all blog posts automatically
 */
export function generatePageSchemas(page: {
  type: 'blog' | 'guide' | 'tool' | 'category';
  title: string;
  description: string;
  path: string;
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
  faq?: Array<{ q: string; a: string }>;
}) {
  const schemas = [];

  // Always add breadcrumb
  schemas.push(generateBreadcrumbSchema(page.path));

  // Type-specific schemas
  if (page.type === 'blog') {
    schemas.push(generateArticleSchema({
      title: page.title,
      description: page.description,
      path: page.path,
      image: page.image,
      publishedAt: page.publishedAt,
      updatedAt: page.updatedAt,
    }));
  }

  if (page.type === 'guide') {
    schemas.push(generateWebPageSchema({
      title: page.title,
      description: page.description,
      path: page.path,
      datePublished: page.publishedAt,
      dateModified: page.updatedAt,
    }));

    if (page.faq) {
      schemas.push(generateFAQSchema(
        page.faq.map(item => ({
          question: item.q,
          answer: item.a,
        }))
      ));
    }
  }

  if (page.type === 'tool') {
    schemas.push(generateFreeToolSchema({
      name: page.title,
      description: page.description,
      path: page.path,
    }));
  }

  return schemas;
}

/**
 * Generate breadcrumb from URL path
 */
function generateBreadcrumbSchema(path: string) {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    ...segments.map((segment, index) => ({
      name: segment.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      path: '/' + segments.slice(0, index + 1).join('/'),
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SEO_CONFIG.siteUrl}${item.path}`,
    })),
  };
}
```

### Metadata Generation Audit

```typescript
// scripts/audit-metadata.ts

import { getAllPosts } from '@/lib/content';

export async function auditMetadata() {
  const posts = await getAllPosts();
  const report = {
    total: posts.length,
    issues: [] as string[],
    warnings: [] as string[],
  };

  for (const post of posts) {
    const fm = post.frontmatter;

    // Errors
    if (!fm.title) report.issues.push(`${post.slug}: Missing title`);
    if (!fm.description) report.issues.push(`${post.slug}: Missing description`);
    if (!fm.publishedAt) report.issues.push(`${post.slug}: Missing publishedAt`);
    if (!fm.category) report.issues.push(`${post.slug}: Missing category`);
    if (!fm.pillar) report.issues.push(`${post.slug}: Missing pillar`);

    // Warnings
    if (fm.title.length > 70) report.warnings.push(`${post.slug}: Title too long (${fm.title.length} chars)`);
    if (fm.description.length > 160) report.warnings.push(`${post.slug}: Description too long (${fm.description.length} chars)`);
    if (!fm.tags || fm.tags.length < 3) report.warnings.push(`${post.slug}: Fewer than 3 tags`);
    if (!fm.image) report.warnings.push(`${post.slug}: Missing featured image`);
  }

  console.log(`\n📊 Metadata Audit Report`);
  console.log(`Total posts: ${report.total}`);
  console.log(`Critical issues: ${report.issues.length}`);
  console.log(`Warnings: ${report.warnings.length}`);

  if (report.issues.length > 0) {
    console.log(`\n❌ Critical Issues:`);
    report.issues.forEach(issue => console.log(`  - ${issue}`));
  }

  if (report.warnings.length > 0) {
    console.log(`\n⚠️ Warnings:`);
    report.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
}
```

---

## 5. Table of Contents Generation

### Automatic TOC Component

```tsx
// components/content/auto-toc.tsx

import { ReactNode } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TOCProps {
  headings: Heading[];
  maxDepth?: number;
}

export function TableOfContents({ headings, maxDepth = 3 }: TOCProps) {
  // Filter headings by depth and create nested structure
  const filtered = headings.filter(h => h.level <= maxDepth);

  return (
    <nav className="table-of-contents bg-slate-50 border-l-4 border-cyan-500 p-6 rounded-lg my-6">
      <h2 className="text-lg font-semibold mb-4 text-slate-900">Table of Contents</h2>
      <ul className="space-y-2">
        {filtered.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}>
            <a
              href={`#${heading.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm hover:underline"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### Extract Headings from Markdown

```typescript
// lib/content/extract-headings.ts

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];

  const processor = unified()
    .use(remarkParse)
    .use(() => (tree) => {
      visit(tree, 'heading', (node) => {
        const text = node.children
          .map((child) => {
            if (child.type === 'text') return child.value;
            if (child.type === 'emphasis' || child.type === 'strong') {
              return child.children.map(c => c.value).join('');
            }
            return '';
          })
          .join('');

        const id = generateHeadingId(text);

        headings.push({
          id,
          text,
          level: node.depth,
        });
      });
    });

  processor.parse(markdown);

  return headings;
}

function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[&\/\\#,+()$~%.'"]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
```

---

## 6. SEO Audit Scripts

### Automated Audit Runner

```typescript
// scripts/run-seo-audit.ts

import { validateInternalLinks } from './validate-internal-links';
import { auditMetadata } from './audit-metadata';
import { auditHeaders } from './audit-headers';

async function runFullAudit() {
  console.log('🔍 Starting Full SEO Audit...\n');

  const [linkIssues, metadataReport, headerIssues] = await Promise.all([
    validateInternalLinks(),
    auditMetadata(),
    auditHeaders(),
  ]);

  console.log('\n📋 Audit Summary:');
  console.log(`  Links: ${linkIssues.length} issues`);
  console.log(`  Metadata: ${metadataReport.issues.length} issues`);
  console.log(`  Headers: ${headerIssues.length} issues`);

  const totalIssues = linkIssues.length + metadataReport.issues.length + headerIssues.length;

  if (totalIssues === 0) {
    console.log('\n✅ No SEO issues found!');
  } else {
    console.log(`\n⚠️ ${totalIssues} total issues to fix`);
  }
}

runFullAudit();
```

### Run in package.json

```json
{
  "scripts": {
    "seo:audit": "ts-node scripts/run-seo-audit.ts",
    "seo:audit:links": "ts-node scripts/validate-internal-links.ts",
    "seo:audit:metadata": "ts-node scripts/audit-metadata.ts",
    "seo:audit:headers": "ts-node scripts/audit-headers.ts"
  }
}
```

---

## 7. Pre-Publish Checklist Automation

```typescript
// lib/seo/pre-publish-checker.ts

export interface PublishCheckResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

export function checkBlogPostReadiness(post: {
  title: string;
  description: string;
  content: string;
  frontmatter: Record<string, any>;
}): PublishCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ERRORS (blocking)
  if (!post.title) errors.push('Missing title');
  if (!post.description) errors.push('Missing meta description');
  if (!post.frontmatter.category) errors.push('Missing category');
  if (!post.frontmatter.pillar) errors.push('Missing pillar/silo assignment');
  if (post.title.length > 70) errors.push(`Title too long (${post.title.length} chars, max 70)`);
  if (post.description.length > 160) errors.push(`Description too long (${post.description.length} chars, max 160)`);

  // Check for H1
  if (!post.content.includes('# ')) errors.push('Missing H1 heading');

  // Count H1s
  const h1Count = (post.content.match(/^# /gm) || []).length;
  if (h1Count > 1) errors.push(`Multiple H1s found (${h1Count}). Only one allowed.`);

  // WARNINGS (non-blocking)
  if (post.content.split('\n').length < 20) warnings.push('Content seems short (< 20 lines)');

  const linkCount = (post.content.match(/\[.*?\]\(.*?\)/g) || []).length;
  if (linkCount < 3) warnings.push(`Few internal links (${linkCount}). Aim for 5-8.`);

  if (!post.frontmatter.tags || post.frontmatter.tags.length < 3) {
    warnings.push('Fewer than 3 tags. Aim for 3-6.');
  }

  if (!post.frontmatter.image) warnings.push('No featured image provided');

  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

// Usage in editor or CLI
export function formatCheckResult(result: PublishCheckResult): string {
  let output = '\n📋 Pre-Publish Check\n';

  if (result.errors.length > 0) {
    output += '\n❌ Blocking Issues:\n';
    result.errors.forEach(e => output += `  - ${e}\n`);
  }

  if (result.warnings.length > 0) {
    output += '\n⚠️ Warnings:\n';
    result.warnings.forEach(w => output += `  - ${w}\n`);
  }

  if (result.passed) {
    output += '\n✅ Ready to publish!\n';
  } else {
    output += '\n❌ Fix issues before publishing.\n';
  }

  return output;
}
```

---

## 8. Monitoring & Alerts

### Setup Google Search Console Alerts

```typescript
// Set up alerts in GSC manually for:
// - Average position drops (> 5 positions)
// - CTR drops (> 10%)
// - Impressions drop (> 20%)
// - Coverage changes
// - Mobile usability issues
```

### Analytics Dashboard Query

```typescript
// Track top performers monthly
const TOP_PERFORMERS_QUERY = `
  SELECT
    page_path,
    COUNT(*) as sessions,
    SUM(engagement_time_msec) / COUNT(*) as avg_engagement,
    COUNT(event_name) as conversions
  FROM analytics
  WHERE event_name = 'page_view'
  GROUP BY page_path
  ORDER BY sessions DESC
  LIMIT 10
`;
```

---

## 9. Testing Checklist

Before deploying any SEO changes:

```bash
# 1. Build and test locally
npm run build

# 2. Run SEO audits
npm run seo:audit

# 3. Test with Google tools
# - Rich Results Test: https://search.google.com/test/rich-results
# - Mobile-Friendly: https://search.google.com/mobile-friendly
# - PageSpeed Insights: https://pagespeed.web.dev

# 4. Test links
npm run test:links

# 5. Verify metadata
npm run seo:audit:metadata

# 6. Check for duplicate content
npm run test:duplicates

# 7. Lighthouse audit
npm run lighthouse:audit

# 8. Deploy with monitoring
npm run deploy
npm run monitor:seo
```

---

## 10. Deployment Checklist

Before merging SEO changes:

- [ ] All tests passing (`npm run test`)
- [ ] SEO audit passing (`npm run seo:audit`)
- [ ] No broken links (`npm run test:links`)
- [ ] Metadata validation passed (`npm run seo:audit:metadata`)
- [ ] Schema testing passed (Google Rich Results Test)
- [ ] Mobile test passed (Google Mobile-Friendly Test)
- [ ] No critical Lighthouse issues
- [ ] All internal links are contextual and descriptive
- [ ] Headers follow hierarchy (no skipped levels)
- [ ] TOC generated correctly (if applicable)
- [ ] Image alt text present
- [ ] Title under 70 chars, includes keyword
- [ ] Meta description under 160 chars, compelling
- [ ] Pillar/silo assignment confirmed

---

## Quick Reference: Common Commands

```bash
# Full audit
npm run seo:audit

# Individual audits
npm run seo:audit:links      # Check internal linking
npm run seo:audit:metadata   # Check frontmatter
npm run seo:audit:headers    # Check heading structure

# Development
npm run dev                   # Start dev server
npm run build                 # Production build
npm run test                  # Run all tests

# Validation
npm run test:links            # Validate links
npm run lighthouse:audit      # Lighthouse scores

# Monitoring
npm run monitor:seo           # Monitor SEO metrics
npm run monitor:analytics     # Monitor GA4
```

---

## File Locations & Key Files

| Purpose | Path |
|---------|------|
| SEO Constants | `lib/seo/constants.ts` |
| Schema Generators | `lib/seo/schemas.ts` |
| Metadata Helpers | `lib/seo/metadata.ts` |
| Internal Links | `lib/seo/internal-links.ts` |
| Content Validation | `lib/content/mdx-validator.ts` |
| Blog Posts | `content/blog/[year]/[month]/` |
| Guides | `app/(marketing)/guides/[slug]/` |
| Tools | `app/(marketing)/tools/[slug]/` |
| Audit Scripts | `scripts/run-seo-audit.ts` |

---

**Last Updated:** December 4, 2025
**For Questions:** Refer to `/SEO-STRUCTURE-FRAMEWORK.md` or `/SEO-QUICK-START.md`
