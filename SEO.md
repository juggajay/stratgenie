# StrataGenie SEO Implementation

> **IMPORTANT:** This is the single source of truth for all SEO work on StrataGenie. When making SEO changes, update this file rather than creating new documentation. This ensures we have one comprehensive reference.

**Last Updated:** 4 December 2025

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
9. [Master Keyword Strategy Framework](#master-keyword-strategy-framework)
10. [Sitemap & Indexing](#sitemap--indexing)
11. [Middleware Configuration](#middleware-configuration)
12. [Pending Work](#pending-work)
13. [Content Inventory](#content-inventory)
14. [Target Keywords](#target-keywords)
15. [Changelog](#changelog)

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

## Master Keyword Strategy Framework

This section provides actionable guidelines for writers, editors, and content creators to optimize content naturally while following SEO best practices. These rules ensure consistent keyword optimization across all StrataGenie content.

### 1. Keyword Density Guidelines by Content Type

Keyword density (primary keyword as % of total words) varies by content type. These are targets, not hard rules—prioritize natural readability.

#### Blog Posts (800–1,500 words)

| Element | Target | Example |
|---------|--------|---------|
| Primary keyword density | 0.5–1.2% | For "strata levy payment plans nsw": 4–18 occurrences |
| LSI keywords (per type) | 3–5 variations | "levy payment plan", "payment options", "strata payment schedules" |
| Avoid over-optimization below | 0.3% | Less than 2–3 occurrences = likely missed opportunity |
| Avoid over-optimization above | 2.0% | More than 30 occurrences in 1,500 words = keyword stuffing |

**Writer's Rule:** Read the post aloud. If you notice the keyword awkwardly repeated, you've gone too far.

#### Pillar Pages (2,000–3,000 words)

| Element | Target | Example |
|---------|--------|---------|
| Primary keyword density | 0.4–0.9% | For "strata compliance nsw": 8–27 occurrences |
| LSI keywords (per type) | 5–8 variations | "compliance requirements", "strata regulations", "nsw strata law" |
| Internal links to cluster posts | 4–8 | Link to all child blog posts at least once |
| Avoid over-optimization above | 1.5% | Pillar pages should feel authoritative, not salesy |

**Writer's Rule:** A pillar page teaches deeply. Keywords should feel natural across many sections and subsections.

#### Guide Pages & Resource Pages (1,500–2,500 words)

| Element | Target | Example |
|---------|--------|---------|
| Primary keyword density | 0.5–1.0% | 7–25 occurrences |
| LSI keywords (per type) | 4–6 variations | Mix synonyms and related phrases |
| External authority links | 2–4 | Link to NSW Fair Trading, legislation, or industry resources |

#### Tool Pages (400–800 words marketing copy)

| Element | Target | Example |
|---------|--------|---------|
| Primary keyword density | 0.8–1.5% | For "strata levy calculator": 3–12 occurrences |
| Tool-specific keywords | 2–3 | "free calculator", "instant results", "no signup required" |
| Trust signals | 3–5 | User testimonials, "trusted by X% of schemes", certifications |

**Writer's Rule:** Tool pages are sales-focused. Keywords can appear slightly higher because each sentence serves the CTA.

#### Suburb Landing Pages (300–600 words)

| Element | Target | Example |
|---------|--------|---------|
| Primary keyword density | 1.0–2.0% | For "[suburb] strata management": 3–12 occurrences |
| Local modifiers | 5–8 | Suburb name, postcode, regional term, "North Sydney area" |
| LSI keywords | 3–4 | "strata committees", "levy rates", "compliance" |

**Writer's Rule:** Suburb pages are thin content but locally targeted. Higher keyword density is acceptable because the page is focused.

---

### 2. LSI Keyword Integration Rules

**LSI (Latent Semantic Indexing) keywords** are semantically related terms that help Google understand context and topical authority. They reduce the need for exact-match keyword repetition.

#### How to Identify LSI Keywords

1. **Google Search Suggestions:** Type your primary keyword in Google, note the autocomplete suggestions and "People also ask" section.
2. **Related Searches:** Scroll to the bottom of Google SERP for related searches.
3. **SEO Tools:** Use Ahrefs, SEMrush, Moz to see related terms that rank alongside your target keyword.
4. **Industry Terminology:** Use NSW Fair Trading, Strata Community Association, or Owners Corporations Act terminology.

#### Example LSI Clusters for "Strata Levy Payment Plans NSW"

**Primary Keyword:** strata levy payment plans nsw

**LSI Keyword Variations:**
- Synonyms: payment schedules, payment arrangements, payment options
- Related phrases: strata debt payment plans, financial hardship, levy arrears
- Problem phrases: struggling with strata levies, can't pay strata levies
- Action phrases: how to negotiate levy payments, apply for payment plan

#### LSI Integration Rules

| Rule | Example | Why |
|------|---------|-----|
| Use 3–5 LSI variations per 500 words | In a 1,500-word post, use 9–15 unique LSI terms | Signals to Google the content depth and semantic relevance |
| Vary sentence structure | Don't say "strata levy payment plans" every time | Mix: "payment arrangements", "paying strata levies", "levy schedules" |
| Place LSI in different sections | H2 headers, body paragraphs, FAQs, meta description | Google weights LSI heavily when distributed across structure |
| Never force LSI keywords | Skip a variation if it makes the sentence awkward | Natural readability > forced keyword variation |
| Use LSI in anchor text | "Learn about levy payment plans" vs "Click here" | Rich anchor text helps Google index context |

#### LSI Placement Best Practice

For a 1,500-word blog post structure:

```
H1 (primary keyword): "Strata Levy Payment Plans NSW"
↓
Intro (1 LSI variation): "If you're struggling with strata levies..."
↓
H2 #1 (1 LSI): "Understanding Strata Levy Payment Arrangements"
    Body paragraph (2 LSI): "payment schedules", "financial hardship"
↓
H2 #2 (1 LSI): "How to Negotiate Payment Options"
    Body paragraph (2 LSI): "levy arrears", "payment schedules"
↓
FAQ Section (3-4 LSI variations)
↓
Conclusion (1 LSI): "Taking action on levy payments"
```

---

### 3. Entity Optimization Checklist

**Entities** in SEO are real-world "things": people, places, organizations, concepts. Google's Knowledge Graph ranks pages that clearly define and link entities.

#### Core Entity Definitions for StrataGenie

Before writing, confirm your content defines these entities:

**NSW Strata Management Entities:**
- Owners Corporation
- Strata Manager (role)
- Strata Committee
- Strata Scheme
- Scheme Administrator
- Lot Owner
- Common Property
- Unit Entitlement
- Administrative Fund
- Capital Works Fund

**NSW Government Entities:**
- NSW Fair Trading
- Owners Corporations Act 2015
- Strata Schemes Management Act 2015
- Strata Hub (government portal)
- Local Council / Local Government Area

#### Entity Optimization Checklist

For every blog post or pillar page, fill this out:

```
✓ Primary Entity: [Define in opening sentence]
  - Definition provided in first paragraph? YES / NO
  - First mention includes official title? YES / NO

✓ Secondary Entities: [List 3-5]
  1. [Entity]: Defined at first mention? YES / NO
  2. [Entity]: Internal link to related content? YES / NO
  3. [Entity]: External link to official source? YES / NO
  4. [Entity]: Mentioned in schema markup? YES / NO
  5. [Entity]: Appears in H2 or H3 headers? YES / NO

✓ Relationship Clarity:
  - How does primary entity relate to secondary entities? [Explained]
  - Are hierarchies clear? (e.g., Owners Corp → Committee → Secretary) YES / NO

✓ Schema Markup:
  - ArticleSchema includes schema:mentions[]? YES / NO
  - Organization schema links to related entities? YES / NO
```

#### Entity Integration Examples

**Good Entity Definition:**
"An Owners Corporation is the legal entity representing all lot owners in a strata scheme. Under NSW law, the Owners Corporation automatically holds legal title to common property on behalf of members."

**Poor Entity Definition:**
"The Owners Corp is important for strata."

---

### 4. Keyword Placement Best Practices

**Strategic placement** of primary and LSI keywords in key positions signals importance to Google.

#### Title Tag Optimization

| Position | Rule | Example |
|----------|------|---------|
| **Start of title (ideal)** | Place primary keyword within first 3 words | ✓ "Strata Levy Payment Plans NSW: 2025 Guide" |
| Length | 50–60 characters | ✓ Fits in SERP preview |
| Avoid keyword stuffing | Max 1 primary keyword + 1 modifier | ✗ "Strata Levy Payment Plans NSW Payment Plans" |
| Include power words | "Guide", "How to", "2025", "Complete", "Free" | ✓ "Complete Guide to Strata Levy Payment Plans NSW" |

**Writer's Rule:** Title tags are billboards. The primary keyword should be the first idea in the reader's mind.

#### H1 Header Optimization

| Rule | Example |
|------|---------|
| One H1 per page only | ✓ One H1 at the top |
| Include primary keyword naturally | ✓ "How to Negotiate Strata Levy Payment Plans in NSW" |
| Avoid exact match title duplication | ✓ H1 slightly different from title tag |
| Use H1 for the main topic, not a feature | ✗ "Welcome to Our Levy Payment Calculator" (bad) |

**Bad H1:** "Welcome"
**Good H1:** "2025 Guide to Strata Levy Payment Plans in NSW"

#### H2 & H3 Header Optimization

| Rule | Example |
|------|---------|
| Include LSI keyword if natural | ✓ "H2: What Are Strata Levy Payment Arrangements?" |
| Create descriptive subheadings | ✓ "H3: Step 1 – Request a Payment Schedule" |
| Use questions (FAQ pattern) | ✓ "H2: Can I Negotiate My Strata Levies?" |
| Avoid keyword stuffing in headers | ✗ "Strata Levy Payment Plans Payment Arrangements Options" |
| Headers should guide reader, not just optimize | ✓ Clear structure that helps skimming |

**H2 Structure for a "How To" Post:**
```
H1: How to Negotiate Strata Levy Payment Plans NSW
  H2: Why Negotiate Levy Payments?
  H2: Step-by-Step Guide to Requesting Payment Plans
    H3: Step 1: Contact Your Strata Manager
    H3: Step 2: Provide Financial Hardship Documentation
    H3: Step 3: Propose a Payment Schedule
  H2: Common Payment Options in NSW
  H2: What If Your Request Is Denied?
```

#### Meta Description Optimization

| Rule | Example |
|------|---------|
| Length | 150–160 characters (fits on mobile + desktop) |
| Include primary keyword | ✓ "Learn about strata levy payment plans in NSW..." |
| Include LSI keyword | ✓ "...payment arrangements and financial hardship options" |
| Include CTA | ✓ "...Start your 7-day free trial" |
| Avoid duplication | ✓ Each page has unique description |

**Example Meta Description:**
"Struggling with strata levies? Learn about NSW payment plans and financial hardship options. Get answers to common questions. Start free."
(158 characters)

#### First 100 Words Optimization

| Rule | Why |
|------|-----|
| Include primary keyword in opening paragraph | Google weights early content more heavily |
| Include LSI keyword in opening paragraph | Signals topic relevance from the start |
| Define the topic clearly | Readers (and Google) understand what they're reading |
| Include call-to-action hint | "In this guide, you'll learn..." |

**Good Opening (First 100 words):**
"Strata levy payment plans are formal arrangements negotiated between lot owners and their Owners Corporation to spread payments over time. If you're facing financial hardship or struggling with levy payment schedules, NSW law allows you to request a payment arrangement. In this guide, we'll walk through the process, explore common payment options, and answer the questions we hear most often from schemes managing these situations."

#### Body Content Optimization

| Position | Rule | Example |
|----------|------|---------|
| **First mention** | Use primary keyword, bold it | "**Strata levy payment plans** are arrangements..." |
| **Each section** | Start section with LSI variation | "H2: Understanding Payment Arrangements" |
| **1 per 300 words** | Natural primary keyword repetition | 1 mention per 300-word section |
| **Anchor text** | Use descriptive text with keywords | ✓ "Learn about levy payment options" vs ✗ "Click here" |
| **Lists/bullets** | Include LSI keywords in list items | ✓ Each bullet includes related term |

#### Image Alt Text & File Names

| Element | Rule | Example |
|----------|------|---------|
| **Alt text** | Include primary + 1 LSI keyword | "Strata levy payment plan spreadsheet" (not "image1") |
| **File names** | Use keywords with hyphens | `strata-levy-payment-schedule.png` (not `image_2.jpg`) |
| **Image titles** | Descriptive, not keyword-stuffed | "A sample payment plan spreadsheet" |

---

### 5. Over-Optimization Warning Signs

**Over-optimization** (keyword stuffing) looks unnatural, harms readability, and triggers Google penalties. Watch for these red flags:

#### Red Flag Checklist

| Red Flag | What It Looks Like | Fix |
|----------|-------------------|-----|
| **Keyword in every sentence** | "Strata levy payment plans can help. Strata levy payment plans let you... Strata levy payment plans..." | Use LSI: "payment arrangements", "payment schedules", "payment options" |
| **Awkward sentence structure** | "Strata levy payment plans for strata levy payment are plans for strata." | Rewrite naturally: "Many schemes offer flexible payment arrangements." |
| **Hidden/low-contrast text** | Cramming keywords in white text on white background | Never use hidden text; it's a black-hat technique |
| **Keyword in internal anchor text excessively** | Every link says "strata levy payment plans" | Vary anchor: "payment options", "levy schedules", "financial hardship" |
| **Unrelated LSI keywords** | Adding random strata terms that don't fit context | Only use LSI keywords that genuinely relate to the topic |
| **Exact-match domain overuse** | Mentioning the domain name repeatedly | Use domain 0–1 times naturally in body content |
| **Comment spam with keywords** | Bot-generated comments with keywords and links | Moderate comments; remove obvious spam |

#### Over-Optimization Scoring

**Rate your content (0–10 scale):**

```
0–2: Severe over-optimization (keyword stuffing)
     → Rewrite major sections

3–5: Moderate over-optimization
     → Remove 30–40% of primary keyword mentions
     → Add more LSI keyword variation

6–8: Healthy optimization
     → Minor tweaks for LSI variety
     → Good balance of keywords and readability

9–10: Natural, reader-first content
     → Keywords integrated seamlessly
     → Multiple sections, varied terminology
     → CTA is clear without being pushy
```

#### Copy-and-Paste Detection

**Google's algorithms (especially after Helpful Content Update) penalize low-effort, AI-generated content.** Avoid:

- Copying large sections from competitors
- Using ChatGPT/Claude output without heavy editing
- Reusing the same sentence structure across multiple posts
- Generic intro/outro templates

**Test:** Paste a paragraph into Copyscape or use Google's site: operator to check for duplicates.

---

### 6. Natural Keyword Optimization Workflow

**Step-by-step process for writers to optimize content naturally:**

#### Step 1: Keyword Research (Before Writing)

```
1. Choose primary keyword (target page, search intent)
2. Identify 5–7 LSI keywords:
   - Google autocomplete
   - People also ask
   - Related searches
   - Ahrefs/SEMrush "related keywords"
3. Note search intent (informational vs. transactional)
4. Check top 3 competing pages for structure and keywords
```

**Output:** Keyword brief (1 page with primary + LSI keywords + structure)

#### Step 2: Outline with Keywords (Before Writing)

```
H1: [Primary keyword in conversational way]
└─ Intro paragraph: Define primary keyword + mention 1 LSI
└─ H2 #1: [Include LSI keyword #1]
│  └─ Body: Natural topic discussion
└─ H2 #2: [Include LSI keyword #2]
│  └─ Body: Natural topic discussion
└─ H2 #3: [FAQ or problem-solution, include LSI #3]
└─ Conclusion: Restate primary keyword + 1 LSI + CTA
```

#### Step 3: Write Naturally (Don't Keyword-Hunt)

```
Focus on:
- Clear, concise sentences
- Helping the reader first
- Using terminology naturally
- Answering reader questions

Don't focus on:
- Hitting exact word counts
- Forcing keywords
- Matching competitor structure word-for-word
```

#### Step 4: Edit for Keyword Optimization (After First Draft)

**Pass 1 – Readability:**
- Read aloud. Awkward? Rewrite.
- Remove passive voice where possible.
- Check: Do headers guide the reader?

**Pass 2 – Keyword Density:**
- Count primary keyword occurrences.
- Is it 0.5–1.2% for blogs? (Use word count / keyword count)
- Too high? Replace 30% with LSI keywords.
- Too low? Add 1–2 mentions in intro/H2/conclusion.

**Pass 3 – LSI Variety:**
- Highlight every primary keyword mention.
- Highlight every LSI keyword mention.
- Do sections feel repetitive? Add new LSI terms.
- Is each section distinct? Good.

**Pass 4 – Structure & Links:**
- H1: Includes primary keyword? ✓
- Meta description: Includes primary + LSI keyword + CTA? ✓
- First 100 words: Sets topic clearly? ✓
- Internal links: Relevant, natural anchor text? ✓
- External links: Credible sources (NSW Fair Trading, etc.)? ✓

**Pass 5 – Final Read:**
- Read the entire piece again.
- Does it feel natural to a human reader?
- Would you share this content?
- Would you trust advice from this page?

If yes to all three: **Publish.**

#### Step 5: Monitor Performance (After Publishing)

| Metric | Where to Check | Action |
|--------|-----------------|--------|
| Impressions for target keyword | Google Search Console | Is it showing in top 50? (good starting point) |
| Click-through rate (CTR) | GSC | Is CTR for your title above 4%? If not, A/B test titles |
| Average position | GSC | Trending up or down? |
| User engagement (time on page, bounce rate) | Google Analytics | Is it > 2 min? If < 1 min, content may be off-topic |
| Conversions (email signups, downloads, trial signups) | Analytics + Convex | Are visitors taking action? If not, strengthen CTA |

**Optimization Cadence:**
- After 2 weeks: Check GSC impressions
- After 6 weeks: Check position and CTR
- After 3 months: Major content update if underperforming
- After 6 months: Full content refresh (update stats, add new LSI, fix broken links)

---

### 7. Content Optimization Checklist

Use this pre-publish checklist for every piece of content:

#### SEO Checklist (Before Publishing)

```
KEYWORD OPTIMIZATION:
☐ Primary keyword in H1 (conversational, not forced)
☐ Primary keyword in first 100 words
☐ Primary keyword in meta description
☐ Primary keyword in title tag (first 3 words ideally)
☐ LSI keyword density: 3–5 per 500 words
☐ Keyword density check: 0.5–1.2% (count: length / keyword count)
☐ No awkward keyword repetition (read aloud test)

STRUCTURE & READABILITY:
☐ One H1 per page
☐ H2s follow logical flow
☐ H2s include LSI keywords where natural
☐ Each section is 200–400 words (scannable)
☐ Short paragraphs (2–3 sentences max)
☐ Bullet points or lists for scanability
☐ Conclusion summarizes key points
☐ CTA is clear and next steps obvious

ENTITY & SEMANTIC SEO:
☐ Primary entity defined in first paragraph
☐ Secondary entities mentioned and linked
☐ No jargon without explanation
☐ NSW law/terminology used correctly
☐ Internal links to related content (3–5)
☐ External links to authority sources (2–3)

TECHNICAL & UX:
☐ Meta description: 150–160 characters
☐ Image alt text includes keyword (not stuffed)
☐ Internal anchor text is descriptive
☐ No hidden text or cloaking
☐ Page loads fast (test in Google PageSpeed)
☐ Mobile-friendly (test in Google Mobile-Friendly Test)
☐ Frontmatter (title, description, category, tags) complete
☐ Schema markup properly added (if applicable)

CONTENT QUALITY:
☐ No copyright or plagiarism (Copyscape check)
☐ Facts are cited or linked to sources
☐ Writer's voice is consistent
☐ No spelling/grammar errors (Grammarly check)
☐ Links are working (no 404s)
☐ Content is unique (not copy-paste from other pages)
☐ Tone matches audience (volunteer committee members, not technical)

ENGAGEMENT & CONVERSION:
☐ CTA is above the fold (visible without scrolling)
☐ CTA is clear (button or compelling text)
☐ Related posts linked at bottom
☐ Newsletter signup or tool offer included
☐ Email capture form works
☐ Testimonial or social proof included (if applicable)
```

---

### 8. Keywords-Per-Page Quick Reference

**Use this table to quickly reference keyword targets by content type:**

| Content Type | Length | Primary KW Density | LSI Count | Target Positions | Expect Ranking |
|--------------|--------|-------------------|-----------|-----------------|---|
| Blog Post | 800–1,500 | 0.5–1.2% | 3–5 | 10–30 | 3–6 months |
| Pillar Page | 2,000–3,000 | 0.4–0.9% | 5–8 | 10–20 | 4–8 months |
| Guide Page | 1,500–2,500 | 0.5–1.0% | 4–6 | 10–25 | 3–6 months |
| Tool Page | 400–800 | 0.8–1.5% | 2–3 | 5–20 | 2–4 months |
| Suburb Page | 300–600 | 1.0–2.0% | 3–4 | 15–50 | 2–3 months |
| FAQ Section | 200–400 | 1.0–1.5% | 2–3 | 20–100 | 2–4 weeks |

**Note:** Rankings are estimates assuming no other ranking factors are negative (site authority, backlinks, etc.).

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

### 4 December 2025

- Added **Master Keyword Strategy Framework** section:
  - Keyword density guidelines by content type (blog, pillar, guide, tool, suburb pages)
  - LSI keyword integration rules with identification techniques
  - Entity optimization checklist for semantic SEO
  - Comprehensive keyword placement best practices (H1, H2, meta, body, images)
  - Over-optimization warning signs with red flag checklist
  - Natural keyword optimization workflow (5-step process for writers)
  - Pre-publish SEO checklist (31-point comprehensive review)
  - Quick reference table for keyword density by content type
  - Writer's rules and actionable guidelines throughout

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
