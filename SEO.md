# StrataGenie SEO Implementation

> **IMPORTANT:** This is the single source of truth for all SEO work on StrataGenie. When making SEO changes, update this file rather than creating new documentation. This ensures we have one comprehensive reference.

**Last Updated:** 3 December 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Technical SEO Foundation](#technical-seo-foundation)
3. [Content Architecture](#content-architecture)
4. [Blog Infrastructure](#blog-infrastructure)
5. [Pillar Pages (Topic Clusters)](#pillar-pages-topic-clusters)
6. [Interactive SEO Tools](#interactive-seo-tools)
7. [Suburb Landing Pages](#suburb-landing-pages)
8. [Email Capture & Lead Generation](#email-capture--lead-generation)
9. [Sitemap & Indexing](#sitemap--indexing)
10. [Middleware Configuration](#middleware-configuration)
11. [Pending Work](#pending-work)
12. [Content Inventory](#content-inventory)
13. [Target Keywords](#target-keywords)
14. [Changelog](#changelog)

---

## Overview

StrataGenie's SEO strategy targets NSW self-managed strata schemes. The approach combines:

- **Technical SEO**: Proper metadata, structured data, sitemaps
- **Content Marketing**: Blog posts, pillar pages, guides
- **Lead Generation Tools**: Interactive calculators, templates, quizzes
- **Local SEO**: Suburb-specific landing pages
- **Topical Authority**: Topic clusters with pillar/cluster architecture

### Key Metrics to Track

| Metric | Target | Current |
|--------|--------|---------|
| Organic traffic | 1,000/month | TBD |
| Tool leads/month | 100+ emails | TBD |
| Blog → Trial conversion | 2% | TBD |
| Health Check completion | 40% of starts | TBD |

---

## Technical SEO Foundation

### Core SEO Files

| File | Purpose | Status |
|------|---------|--------|
| `lib/seo/constants.ts` | Site-wide SEO configuration | ✅ Complete |
| `lib/seo/metadata.ts` | Metadata generation utilities | ✅ Complete |
| `lib/seo/schemas.ts` | JSON-LD structured data generators | ✅ Complete |
| `components/seo/JsonLd.tsx` | Schema injection component | ✅ Complete |
| `app/robots.ts` | Robots.txt generation | ✅ Complete |
| `app/sitemap.ts` | Dynamic sitemap generation | ✅ Complete |

### SEO Configuration

Located in `lib/seo/constants.ts`:

```typescript
export const SEO_CONFIG = {
  siteName: 'StrataGenie',
  siteUrl: 'https://stratagenie.com.au',
  defaultTitle: 'StrataGenie | AI-Powered Strata Compliance Copilot for NSW',
  defaultDescription: '...',
  locale: 'en_AU',
};
```

### Structured Data (JSON-LD)

We generate the following schema types:

| Schema Type | Used On | Purpose |
|-------------|---------|---------|
| `Organization` | All pages | Brand information |
| `SoftwareApplication` | Homepage, Tools | App listing in search |
| `FAQPage` | Guides, Tools | FAQ rich snippets |
| `Article` | Blog posts | Article rich snippets |
| `BreadcrumbList` | All pages | Navigation breadcrumbs |

### OpenGraph & Social

All pages include:

- OpenGraph tags for Facebook/LinkedIn
- Twitter Card tags
- Default image: `/public/og-image.png` (1200x630)

### Robots.txt Configuration

Blocked paths:
- `/dashboard/*` (authenticated app)
- `/api/*` (API routes)
- `/onboarding` (user flow)
- `/_next/*` (Next.js internals)

---

## Content Architecture

### Route Groups

Marketing content uses the `(marketing)` route group:

```
app/
├── (marketing)/
│   ├── layout.tsx          # Shared marketing layout
│   ├── blog/
│   │   ├── page.tsx        # Blog index
│   │   ├── [slug]/page.tsx # Individual posts
│   │   └── category/[category]/page.tsx
│   ├── guides/
│   │   ├── nsw-strata-compliance/page.tsx
│   │   ├── strata-financial-management/page.tsx
│   │   ├── maintenance-asset-management/page.tsx
│   │   ├── transition-to-self-managed/page.tsx
│   │   └── 2025-nsw-strata-reforms/page.tsx
│   ├── tools/
│   │   ├── page.tsx        # Tools hub
│   │   ├── levy-calculator/page.tsx
│   │   ├── strata-roll-template/page.tsx
│   │   └── compliance-health-check/page.tsx
│   ├── strata-management/
│   │   └── [suburb]/page.tsx
│   ├── privacy/page.tsx
│   └── terms/page.tsx
```

### Content Directory

MDX blog content is stored in:

```
content/
├── blog/
│   └── 2025/
│       └── 01/
│           ├── strata-hub-registration-guide.mdx
│           ├── admin-fund-vs-capital-works-fund.mdx
│           ├── how-to-transition-to-self-managed-strata.mdx
│           ├── strata-maintenance-responsibilities.mdx
│           ├── financial-hardship-information-statement-strata.mdx
│           ├── strata-levy-payment-plans-nsw.mdx
│           ├── strata-committee-mandatory-training-nsw.mdx
│           └── disclosure-of-insurance-commissions-strata.mdx
└── data/
    └── suburbs.json
```

### Content Utilities

Located in `lib/content/index.ts`:

| Function | Purpose |
|----------|---------|
| `getAllPosts()` | Fetch all blog posts |
| `getPostBySlug(slug)` | Get single post by slug |
| `getPostsByCategory(category)` | Filter by category |
| `getPostsByPillar(pillar)` | Get posts in topic cluster |
| `getFeaturedPosts(limit)` | Get featured posts |

---

## Blog Infrastructure

### MDX Setup

Dependencies installed:
- `@next/mdx`
- `@mdx-js/loader`
- `@mdx-js/react`
- `gray-matter` (frontmatter parsing)
- `reading-time`
- `next-mdx-remote` (remote MDX rendering)
- `remark-gfm` (GitHub Flavored Markdown)
- `rehype-slug` (heading IDs)
- `rehype-autolink-headings` (heading links)

### Frontmatter Schema

Every blog post requires:

```yaml
---
title: "Post Title"
description: "Meta description for SEO"
publishedAt: "2025-01-15"
updatedAt: "2025-01-15"        # Optional
category: "compliance"          # compliance | financial | self-managed | maintenance
tags: ["tag1", "tag2"]
pillar: "nsw-strata-compliance" # Links to parent pillar page
author: "StrataGenie Team"
readingTime: "5 min read"
featured: false                 # Show on homepage
---
```

### Categories

| Category | Slug | Description |
|----------|------|-------------|
| Compliance | `compliance` | NSW strata law, regulations, requirements |
| Financial | `financial` | Levies, budgets, funds, accounting |
| Self-Managed | `self-managed` | Running a scheme without a strata manager |
| Maintenance | `maintenance` | Building maintenance, capital works |

### Blog Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ArticleHeader` | `components/content/article-header.tsx` | Post title, meta, author |
| `TableOfContents` | `components/content/table-of-contents.tsx` | Auto-generated TOC |
| `RelatedPosts` | `components/content/related-posts.tsx` | Related articles grid |
| `BlogCard` | `components/content/blog-card.tsx` | Post card for listings |
| `NewsletterCTA` | `components/content/newsletter-cta.tsx` | Inline email capture |

---

## Pillar Pages (Topic Clusters)

### Topic Cluster Architecture

Each pillar page is a comprehensive guide that links to supporting blog posts:

```
Pillar Page (2,000-3,000 words)
├── Blog Post 1 (800-1,500 words)
├── Blog Post 2
├── Blog Post 3
└── Blog Post 4
```

### Current Pillar Pages

#### 1. NSW Strata Compliance Guide
- **URL:** `/guides/nsw-strata-compliance`
- **Target Keywords:** strata compliance nsw, strata hub guide
- **Child Posts:** Strata Hub Registration Guide

#### 2. Strata Financial Management
- **URL:** `/guides/strata-financial-management`
- **Target Keywords:** strata levy calculator, admin fund vs capital works
- **Child Posts:** Admin Fund vs Capital Works Fund

#### 3. Maintenance & Asset Management
- **URL:** `/guides/maintenance-asset-management`
- **Target Keywords:** capital works plan template, strata maintenance
- **Child Posts:** Strata Maintenance Responsibilities

#### 4. Transition to Self-Managed
- **URL:** `/guides/transition-to-self-managed`
- **Target Keywords:** self managed strata nsw, how to fire strata manager
- **Child Posts:** How to Transition to Self-Managed Strata

#### 5. 2025 NSW Strata Reforms (NEW - High Priority)
- **URL:** `/guides/2025-nsw-strata-reforms`
- **Target Keywords:** 2025 strata reforms nsw, strata law changes 2025
- **Priority:** 1.0 (highest) - timely, low competition
- **Child Posts:**
  - Financial Hardship Information Statement (`financial hardship information statement strata`)
  - Strata Levy Payment Plans NSW (`strata levy payment plans nsw`)
  - Strata Committee Training NSW (`strata committee mandatory training nsw`)
  - Insurance Commission Disclosure (`disclosure of insurance commissions strata`)

---

## Interactive SEO Tools

### Tool Hub

**URL:** `/tools`

Central page listing all free tools with descriptions and CTAs.

### 1. Levy Calculator

| Property | Value |
|----------|-------|
| URL | `/tools/levy-calculator` |
| Target Keywords | strata levy calculator, nsw levy calculator |
| Lead Capture | No (free use, CTA to signup) |
| Schema | `SoftwareApplication` |

**Features:**
- Calculate quarterly/annual levies based on unit entitlement
- Show percentage share of total levies
- Reuses `distributeBudget` logic from `convex/lib/financialMath.ts`

### 2. Strata Roll Template

| Property | Value |
|----------|-------|
| URL | `/tools/strata-roll-template` |
| Target Keywords | strata roll template free, nsw strata roll |
| Lead Capture | Yes (email required for download) |
| Downloads | Excel (.xlsx), PDF |

**Features:**
- Email capture before download
- Sends confirmation email via Resend
- Professional templates with all NSW-required fields
- Two sheets: Strata Roll + Instructions

**Download Files:**
- `/public/downloads/strata-roll-template.xlsx` (29KB)
- `/public/downloads/strata-roll-template.pdf` (5KB)

**Generation Script:** `scripts/generate-strata-roll-templates.js`

### 3. Compliance Health Check

| Property | Value |
|----------|-------|
| URL | `/tools/compliance-health-check` |
| Target Keywords | strata compliance checklist, is my strata compliant |
| Lead Capture | Yes (email required for results) |
| Questions | 10 |

**Features:**
- 10-question quiz covering: AGM, Strata Hub, records, finances, insurance
- Scoring algorithm (0-100%)
- Color-coded results by rating
- Personalized recommendations based on weak areas
- Email with full results sent via Resend

**Score Ratings:**
| Rating | Range | Color |
|--------|-------|-------|
| Excellent | 80-100% | Green |
| Good | 60-79% | Blue |
| Needs Attention | 40-59% | Amber |
| At Risk | 0-39% | Red |

**Quiz Data:** `lib/quiz-data.ts`

---

## Suburb Landing Pages

### Strategy

Programmatic generation for top 20 Sydney suburbs with high strata density.

### URL Pattern

`/strata-management/[suburb]`

Example: `/strata-management/parramatta`

### Suburbs Included

Data stored in `content/data/suburbs.json`:

| Suburb | Slug | Region | Postcode |
|--------|------|--------|----------|
| Parramatta | parramatta | Greater Western Sydney | 2150 |
| Bondi | bondi | Eastern Suburbs | 2026 |
| Mosman | mosman | Lower North Shore | 2088 |
| Chatswood | chatswood | Lower North Shore | 2067 |
| Strathfield | strathfield | Inner West | 2135 |
| North Sydney | north-sydney | Lower North Shore | 2060 |
| Cronulla | cronulla | Sutherland Shire | 2230 |
| Manly | manly | Northern Beaches | 2095 |
| Surry Hills | surry-hills | Inner Sydney | 2010 |
| Pyrmont | pyrmont | Inner Sydney | 2009 |
| Ryde | ryde | Northern Sydney | 2112 |
| Burwood | burwood | Inner West | 2134 |
| Hurstville | hurstville | St George | 2220 |
| Bankstown | bankstown | South Western Sydney | 2200 |
| Liverpool | liverpool | South Western Sydney | 2170 |
| Penrith | penrith | Greater Western Sydney | 2750 |
| Blacktown | blacktown | Greater Western Sydney | 2148 |
| Hornsby | hornsby | Upper North Shore | 2077 |
| Dee Why | dee-why | Northern Beaches | 2099 |
| Coogee | coogee | Eastern Suburbs | 2034 |

### Suburb Utilities

Located in `lib/suburbs.ts`:

| Function | Purpose |
|----------|---------|
| `getAllSuburbs()` | Get all suburb data |
| `getSuburbBySlug(slug)` | Get single suburb |

### Page Template

Each suburb page includes:
- Hero with suburb name
- Local strata statistics (placeholder for now)
- Council/Fair Trading office info
- CTA: "Start managing your [Suburb] strata today"

---

## Email Capture & Lead Generation

### Database Schema

Leads are stored in Convex:

```typescript
// convex/schema.ts
leads: defineTable({
  email: v.string(),
  name: v.optional(v.string()),
  source: v.union(
    v.literal("strata_roll_template"),
    v.literal("compliance_health_check"),
    v.literal("newsletter")
  ),
  metadata: v.optional(v.object({
    score: v.optional(v.number()),
    answers: v.optional(v.array(v.string())),
  })),
  createdAt: v.number(),
})
  .index("by_email", ["email"])
  .index("by_source", ["source"]),
```

### Lead Capture Mutations

Located in `convex/leads.ts`:

| Mutation | Purpose |
|----------|---------|
| `capture` | Store new lead |
| `getByEmail` | Check if email exists |
| `getBySource` | Get leads by source |

### Marketing Emails

Located in `convex/actions/marketingEmail.ts`:

| Action | Purpose | Subject Line |
|--------|---------|--------------|
| `sendStrataRollEmail` | Template download confirmation | "Your Free Strata Roll Template" |
| `sendHealthCheckEmail` | Quiz results with score | "Your Compliance Score: X% - [Rating]" |

**Email Provider:** Resend

**From Address:** `StrataGenie <hello@stratagenie.com.au>`

**Note:** Domain `stratagenie.com.au` must be verified in Resend for emails to send. Currently shows error if not verified.

### Email Templates

Both emails include:
- Professional HTML layout
- Personalized greeting (if name provided)
- Relevant content/results
- CTA buttons (Download/Retake + Start Free Trial)
- Footer with privacy/terms links
- StrataGenie branding

---

## Sitemap & Indexing

### Sitemap Generation

Located in `app/sitemap.ts`:

The sitemap is dynamically generated and includes:

| Section | Priority | Change Frequency |
|---------|----------|------------------|
| Homepage | 1.0 | weekly |
| 2025 Reforms Guide | 1.0 | weekly |
| Other Pillar Pages | 0.9 | weekly |
| Tools | 0.7-0.8 | monthly |
| Blog Index | 0.8 | weekly |
| Blog Posts | 0.6 | monthly |
| Category Pages | 0.5 | weekly |
| Suburb Pages | 0.7 | monthly |
| Privacy/Terms | 0.3 | monthly |

### Sitemap URL

`https://stratagenie.com.au/sitemap.xml`

---

## Middleware Configuration

### Public Routes

Located in `middleware.ts`:

The following routes are public (no authentication required):

```typescript
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  // Marketing/SEO pages
  "/blog(.*)",
  "/privacy",
  "/terms",
  "/tools(.*)",
  "/guides(.*)",
  "/strata-management(.*)",
]);
```

### Static File Exclusions

The middleware matcher excludes these file types from processing:

```
html, css, js, jpg, jpeg, webp, png, gif, svg,
ttf, woff, woff2, ico, csv, doc, docx, xlsx, pdf, zip, webmanifest
```

**Note:** `pdf` was added to fix 404 errors on PDF downloads.

---

## Pending Work

### High Priority

- [ ] **Verify Resend domain** - `stratagenie.com.au` must be verified for marketing emails to send
- [ ] **Google Search Console** - Submit sitemap, verify ownership
- [ ] **Google Business Profile** - Claim and optimize

### Medium Priority

- [ ] **More blog content** - Aim for 1 post/week
- [ ] **Newsletter signup** - Add to blog sidebar/footer
- [ ] **Exit intent popup** - Newsletter capture on exit
- [ ] **Internal linking audit** - Ensure all posts link to pillars

### Low Priority

- [ ] **Directory listings** - LookUpStrata, TrueLocal, Yellow Pages
- [ ] **Backlink outreach** - Guest posts, expert contributions
- [ ] **Schema testing** - Validate all JSON-LD with Google Rich Results Test
- [ ] **Core Web Vitals** - Monitor and optimize LCP, CLS, INP

---

## Content Inventory

### Blog Posts (8 total)

| Title | Slug | Category | Pillar | Published |
|-------|------|----------|--------|-----------|
| Complete Guide to NSW Strata Hub Registration | strata-hub-registration-guide | compliance | nsw-strata-compliance | 2025-01-15 |
| Admin Fund vs Capital Works Fund | admin-fund-vs-capital-works-fund | financial | strata-financial-management | 2025-01-16 |
| How to Transition to Self-Managed Strata | how-to-transition-to-self-managed-strata | self-managed | transition-to-self-managed | 2025-01-17 |
| Strata Maintenance Responsibilities | strata-maintenance-responsibilities | maintenance | maintenance-asset-management | 2025-01-18 |
| Financial Hardship Information Statement | financial-hardship-information-statement-strata | compliance | 2025-nsw-strata-reforms | 2025-01-15 |
| Strata Levy Payment Plans NSW | strata-levy-payment-plans-nsw | financial | 2025-nsw-strata-reforms | 2025-01-16 |
| Strata Committee Training NSW | strata-committee-mandatory-training-nsw | compliance | 2025-nsw-strata-reforms | 2025-01-17 |
| Insurance Commission Disclosure | disclosure-of-insurance-commissions-strata | compliance | 2025-nsw-strata-reforms | 2025-01-18 |

### Pillar Pages (5 total)

| Title | URL | Priority |
|-------|-----|----------|
| NSW Strata Compliance Guide | /guides/nsw-strata-compliance | 0.9 |
| Strata Financial Management | /guides/strata-financial-management | 0.9 |
| Maintenance & Asset Management | /guides/maintenance-asset-management | 0.9 |
| Transition to Self-Managed | /guides/transition-to-self-managed | 0.9 |
| 2025 NSW Strata Reforms | /guides/2025-nsw-strata-reforms | 1.0 |

### Tools (3 total)

| Tool | URL | Lead Capture |
|------|-----|--------------|
| Levy Calculator | /tools/levy-calculator | No |
| Strata Roll Template | /tools/strata-roll-template | Yes |
| Compliance Health Check | /tools/compliance-health-check | Yes |

### Suburb Pages (20 total)

All 20 suburbs listed in the Suburb Landing Pages section above.

---

## Target Keywords

### Primary Keywords (Head Terms)

| Keyword | Target Page | Competition |
|---------|-------------|-------------|
| strata compliance nsw | /guides/nsw-strata-compliance | Medium |
| strata levy calculator | /tools/levy-calculator | Low |
| self managed strata nsw | /guides/transition-to-self-managed | Medium |
| strata hub registration | /blog/strata-hub-registration-guide | Low |

### 2025 Reforms Keywords (NEW - Low Competition)

| Keyword | Target Page |
|---------|-------------|
| financial hardship information statement strata | /blog/financial-hardship-information-statement-strata |
| strata levy payment plans nsw | /blog/strata-levy-payment-plans-nsw |
| strata committee mandatory training nsw | /blog/strata-committee-mandatory-training-nsw |
| disclosure of insurance commissions strata | /blog/disclosure-of-insurance-commissions-strata |
| 2025 strata reforms nsw | /guides/2025-nsw-strata-reforms |

### Long-Tail Keywords

| Keyword | Target Page |
|---------|-------------|
| strata roll template free | /tools/strata-roll-template |
| admin fund vs capital works fund nsw | /blog/admin-fund-vs-capital-works-fund |
| how to fire strata manager | /guides/transition-to-self-managed |
| strata compliance checklist | /tools/compliance-health-check |

### Local Keywords

| Keyword Pattern | Target Page |
|-----------------|-------------|
| strata management [suburb] | /strata-management/[suburb] |
| self managed strata [suburb] | /strata-management/[suburb] |

---

## Changelog

### 3 December 2025

- Created SEO.md documentation file
- Added 2025 NSW Strata Reforms content cluster:
  - Pillar page: /guides/2025-nsw-strata-reforms
  - 4 supporting blog posts for new reform keywords
- Fixed PDF download 404 (added pdf to middleware exclusions)
- Generated strata roll template files (xlsx + pdf)
- Completed email integration for tools (Strata Roll Template, Compliance Health Check)
- Updated sitemap with 2025 reforms guide (priority 1.0)

### Previous Work

- Technical SEO foundation (metadata, schemas, robots, sitemap)
- Blog infrastructure with MDX
- 4 original pillar pages
- 4 original blog posts
- 3 interactive tools
- 20 suburb landing pages
- Lead capture system with Convex
- Marketing email templates with Resend

---

> **Remember:** Update this file whenever you make SEO changes. Keep one source of truth!
