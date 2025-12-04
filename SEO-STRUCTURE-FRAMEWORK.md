# SEO Structure Framework for StrataGenie

**Created for:** StrataGenie Platform (Strata Management SaaS for NSW)
**Framework Type:** Master Content Architecture & Internal Organization
**Last Updated:** December 4, 2025

---

## Table of Contents

1. [Header Hierarchy Rules](#header-hierarchy-rules)
2. [Content Siloing Strategy](#content-siloing-strategy)
3. [Internal Linking Matrix](#internal-linking-matrix)
4. [Schema Markup Priority List](#schema-markup-priority-list)
5. [Table of Contents Best Practices](#table-of-contents-best-practices)
6. [Implementation Checklist](#implementation-checklist)
7. [Performance Metrics](#performance-metrics)

---

## Header Hierarchy Rules

### Principles

- **One H1 per page** (except in exceptional cases like multi-article collections)
- **Sequential hierarchy** (H1 → H2 → H3 → H4. Never skip levels)
- **Keyword-rich** but natural language (avoid keyword stuffing)
- **Answer user intent** at each level
- **Scannability** for both users and search engines

### Page Type: Blog Posts

```
H1: {Specific Problem/Solution + Keyword}
Example: "Strata Committee Training NSW: New Accountability Rules for 2025"

├─ H2: Context/Why This Matters
│  Example: "What's Changed in 2025?"
│
├─ H2: Main Topic Section 1
│  Example: "Is Training Mandatory?"
│  ├─ H3: Sub-topic 1.1
│  │  Example: "Strong Incentives to Train"
│  │  ├─ H4: Detail Point (list intro)
│  │  └─ H4: Detail Point
│  └─ H3: Sub-topic 1.2
│
├─ H2: Main Topic Section 2
│  Example: "NSW Fair Trading Training Modules"
│  ├─ H3: Module 1: Introduction to Strata
│  ├─ H3: Module 2: Committee Operations
│  └─ H3: Module 3: Financial Management
│
├─ H2: Action/Takeaway
│  Example: "What You Should Do Now"
│
└─ H2: FAQ Section (optional)
   Example: "Common Questions About Committee Training"
   ├─ H3: Question as Heading
   ├─ H3: Question as Heading
   └─ H3: Question as Heading
```

### Page Type: Pillar/Guide Pages

```
H1: {Comprehensive Topic + Keyword}
Example: "NSW Strata Compliance Guide 2025 | Complete Requirements & Deadlines"

├─ H2: Overview/Executive Summary
│  Example: "Key Compliance Requirements"
│  ├─ H3: Requirement 1
│  ├─ H3: Requirement 2
│  └─ H3: Requirement 3
│
├─ H2: Deep Topic 1 (Pillar Topic)
│  Example: "Strata Hub Registration & Reporting"
│  ├─ H3: Context
│  ├─ H3: Step-by-step Process
│  └─ H3: Common Issues
│
├─ H2: Deep Topic 2
│  Example: "Annual General Meeting (AGM) Requirements"
│  ├─ H3: When to Hold
│  ├─ H3: What to Include
│  └─ H3: Documentation
│
├─ H2: Compliance Calendar/Timeline
│  (Usually with H3 for each time period)
│
├─ H2: FAQ Section
│  (5-8 questions, each as H3)
│
└─ H2: Related Tools/Resources
   (Links to related content)
```

### Page Type: Tool/Calculator Pages

```
H1: {Tool Name + Primary Keyword}
Example: "Levy Calculator | NSW Strata Levy Calculation Tool"

├─ H2: What This Tool Does
│
├─ H2: How to Use This Tool
│  ├─ H3: Step 1: Gather Your Information
│  ├─ H3: Step 2: Enter Your Scheme Details
│  └─ H3: Step 3: Review Your Results
│
├─ H2: Understanding Your Results
│  ├─ H3: Component 1: Administrative Levy
│  ├─ H3: Component 2: Capital Works Levy
│  └─ H3: Component 3: Special Levies
│
├─ H2: Common Scenarios
│  (H3 for each scenario)
│
└─ H2: FAQ
```

### Page Type: Landing/Category Pages

```
H1: {Category + Keyword}
Example: "Strata Compliance Blog | NSW Strata Laws, AGM, Levies & More"

├─ H2: Overview
│  (No H3 - intro text only)
│
├─ H2: Topic Cluster 1
│  ├─ H3: Article/Post 1 Title
│  └─ H3: Article/Post 2 Title
│
├─ H2: Topic Cluster 2
│  ├─ H3: Article/Post 3 Title
│  └─ H3: Article/Post 4 Title
│
└─ H2: Getting Started
```

### Header Rules (DO's and DON'Ts)

#### DO's

- Use headers to **signal topic hierarchy** to search engines
- Include **primary and secondary keywords** naturally
- Make headers **descriptive and compelling** for users
- Use headers to **break up long content** (no more than 300-400 words between headers)
- Mirror H2 headers in **Table of Contents** (if present)
- Use **specific language** (not "FAQ" but "Frequently Asked Questions About AGM Requirements")

#### DON'Ts

- Skip heading levels (H1 → H3)
- Use multiple H1's on one page
- Use headers for **styling only** (use CSS classes instead)
- Keyword stuff headers (sounds unnatural)
- Use generic headers ("Introduction", "Details", "Section 1")
- Put entire intro content before first H2

### Example: Blog Post Header Audit

**Before (Poor):**
```html
<h1>Strata Compliance</h1>
<h2>Intro</h2>
<h3>Background</h3>
<h2>Main Points</h2>
<h3>Point 1</h3>
<h2>Summary</h2>
```

**After (Optimized):**
```html
<h1>NSW Strata Compliance Guide 2025 | Complete Requirements & Deadlines</h1>
<h2>What You Need to Know About NSW Strata Compliance</h2>
<h3>Strata Hub Registration Requirements</h3>
<h3>AGM Compliance Deadlines</h3>
<h2>Step-by-Step Compliance Checklist</h2>
<h3>Q1: Registration and Initial Setup</h3>
<h3>Q2: Mid-Year Reviews and Updates</h3>
<h2>Penalties for Non-Compliance</h2>
<h3>What Regulators Are Enforcing</h3>
<h2>Frequently Asked Questions About NSW Strata Compliance</h2>
<h3>Is My Scheme Compliant?</h3>
<h3>What Happens If We Miss a Deadline?</h3>
```

---

## Content Siloing Strategy

### Overview

Content siloing organizes your website into thematic clusters for:
- **Search engine clarity** (related content = topic authority)
- **User navigation** (logical topic progression)
- **Link equity flow** (authority flows between related pages)
- **Query coverage** (cluster covers all angles of a topic)

### StrataGenie Content Silos

#### Silo 1: Compliance & Regulatory

**Pillar Page:** `/guides/nsw-strata-compliance`
**Keywords Focus:** "NSW strata compliance", "strata compliance", "compliance requirements", "strata regulations"

**Sub-Cluster Pages:**

| Page Type | URL | Topic | Keyword Focus |
|-----------|-----|-------|----------------|
| Blog | `/blog/strata-hub-registration-guide` | Strata Hub Registration | "Strata Hub registration", "NSW Strata Hub" |
| Blog | `/blog/strata-committee-mandatory-training-nsw` | Committee Training | "strata committee training", "committee duties" |
| Blog | `/blog/how-to-run-agm-self-managed-strata` | AGM Management | "how to run AGM", "annual general meeting" |
| Blog | `/blog/strata-levy-payment-plans-nsw` | Levy Compliance | "strata levy payment plans", "levy defaults" |
| Blog | `/blog/disclosure-of-insurance-commissions-strata` | Insurance Requirements | "strata insurance", "insurance disclosure" |
| Blog | `/blog/financial-hardship-information-statement-strata` | Financial Hardship | "financial hardship", "payment assistance" |
| Tool | `/tools/compliance-health-check` | Self-Assessment | "compliance health check", "am I compliant" |

**Internal Linking Pattern:**
```
Pillar Page (Silo Hub)
├─→ Article 1 (Strata Hub)
├─→ Article 2 (Committee Training)
├─→ Article 3 (AGM Management)
├─→ Tool: Compliance Health Check
└─→ Related: 2025 Reforms Pillar

Articles Link Back To:
├─→ Pillar Page
├─→ Related Article (within silo)
├─→ Tool (Compliance Health Check)
└─→ Next Topic Pillar (cross-silo)
```

#### Silo 2: Financial Management

**Pillar Page:** `/guides/strata-financial-management`
**Keywords Focus:** "strata financial management", "strata budgeting", "levy calculation", "capital works fund"

**Sub-Cluster Pages:**

| Page Type | URL | Topic | Keyword Focus |
|-----------|-----|-------|----------------|
| Blog | `/blog/admin-fund-vs-capital-works-fund` | Fund Types | "admin fund", "capital works fund", "strata funds" |
| Blog | `/blog/strata-levy-payment-plans-nsw` | Levy Payments | "strata levies", "special levies", "levy calculation" |
| Tool | `/tools/levy-calculator` | Levy Calculation | "levy calculator", "calculate strata levies" |
| Blog | `/blog/financial-hardship-information-statement-strata` | Financial Hardship | "financial hardship", "can't pay levies" |
| Blog | `/blog/disclosure-of-insurance-commissions-strata` | Insurance Costs | "strata insurance costs" |

**Internal Linking Pattern:**
```
Pillar Page (Financial Management)
├─→ Blog: Admin Fund vs Capital Works Fund
├─→ Blog: Levy Payment Plans
├─→ Tool: Levy Calculator
├─→ Blog: Financial Hardship
└─→ Blog: Insurance Commissions

Cross-Silo Links:
└─→ Compliance Silo (AGM Coverage)
```

#### Silo 3: Maintenance & Asset Management

**Pillar Page:** `/guides/maintenance-asset-management`
**Keywords Focus:** "strata maintenance", "capital works", "building maintenance", "asset management"

**Sub-Cluster Pages:**

| Page Type | URL | Topic | Keyword Focus |
|-----------|-----|-------|----------------|
| Blog | `/blog/strata-maintenance-responsibilities` | Maintenance Duties | "strata maintenance", "common property maintenance" |
| Blog | `/blog/[upcoming]` | Capital Works Planning | "capital works plan", "10-year plan" |
| Blog | `/blog/[upcoming]` | Special Levies | "special levies", "major repairs" |

#### Silo 4: 2025 NSW Strata Reforms

**Pillar Page:** `/guides/2025-nsw-strata-reforms`
**Keywords Focus:** "2025 strata reforms", "NSW strata changes", "new strata rules"

**Sub-Cluster Pages:**

| Page Type | URL | Topic | Keyword Focus |
|-----------|-----|-------|----------------|
| Blog | `/blog/strata-committee-training-nsw` | New Training Requirements | "strata training requirements" |
| Blog | `/blog/[upcoming]` | Financial Hardship Changes | "2025 financial hardship" |
| Blog | `/blog/[upcoming]` | Transparency Changes | "strata transparency requirements" |

#### Silo 5: Suburb/Local Management

**Hub Page:** `/strata-management`
**Category Pages:** `/strata-management/[suburb]`
**Keywords Focus:** "strata management [Suburb]", "[Suburb] strata", "self-managed strata [Suburb]"

**Pattern:**
```
/strata-management
├─→ /strata-management/sydney
├─→ /strata-management/north-sydney
├─→ /strata-management/manly
├─→ /strata-management/parramatta
└─→ [100+ suburbs]

Each Suburb Page Links To:
├─→ Hub page (category up)
├─→ Adjacent suburbs (sibling)
├─→ Compliance Guide (silo cross-link)
└─→ Compliance Health Check Tool
```

### Siloing Rules

#### DO's

- **Thematic coherence**: All pages in a silo should be about one main topic
- **Link tightly within silos**: Pages in same silo link to each other heavily
- **Support the pillar**: All sub-pages should link back to the pillar
- **Cross-link strategically**: Link between silos when topics overlap naturally
- **Clear navigation**: Visitors should understand the silo structure intuitively
- **Prioritize depth**: Go deep on one topic before broadening

#### DON'Ts

- Create ambiguous silos (overlapping topics)
- Link every page to every other page (dilutes authority)
- Create pages that don't belong to any silo
- Ignore the pillar page (it should be central hub)
- Cross-link excessively between unrelated silos
- Create silos with only 1-2 pages (build clusters of 5-10+ pages)

### Silo Expansion Roadmap

**Current Silos:** 5
**Recommended Additional Silos (2026):**

1. **Self-Managed Strata** → `/guides/transition-to-self-managed`
   - Pages on transitioning, committee roles, skills needed, tools

2. **Building Insurance** (expanding from Financial)
   - Pages on insurance types, coverage, renewal, claims

3. **Dispute Resolution & Governance** (new)
   - Pages on disputes, mediation, NCAT, committee conflicts

4. **Property Owner Rights** (new)
   - Pages on owner responsibilities, rights, levy appeals

---

## Internal Linking Matrix

### Linking Philosophy

- **Contextual links** (in-content) are worth more than navigational links
- **Anchor text** should be descriptive (not "click here")
- **Link density** should feel natural (1-3 links per 300 words)
- **Link authority flow** should support pillar pages and revenue-driving pages
- **Links should help users** first, SEO second

### Internal Linking Template

#### Level 1: Pillar Page Linking

**Pillar Page:** `/guides/nsw-strata-compliance`

```markdown
## Linking Pattern for Pillar

### From Pillar Page (OUTBOUND):
- ✅ ALWAYS link to sub-cluster articles (5-8 links per pillar)
  Anchor: "Learn more about Strata Hub registration"
  Target: `/blog/strata-hub-registration-guide`

- ✅ ALWAYS link to related tools
  Anchor: "Take our Compliance Health Check"
  Target: `/tools/compliance-health-check`

- ✅ Link to adjacent pillar (max 1-2 cross-silo)
  Anchor: "Financial strategies for compliance"
  Target: `/guides/strata-financial-management`

### To Pillar Page (INBOUND):
- ✅ Every sub-cluster article links back to pillar
  Anchor: "Complete NSW Strata Compliance Guide"
  Target: `/guides/nsw-strata-compliance`

- ✅ Tools link back to relevant pillar
  Anchor: "Learn more about compliance requirements"
  Target: `/guides/nsw-strata-compliance`

- ✅ Category pages link to relevant pillars
  Anchor: "Read our comprehensive compliance guide"
  Target: `/guides/nsw-strata-compliance`
```

#### Level 2: Sub-Cluster Article Linking

**Article Example:** `/blog/strata-hub-registration-guide`

```markdown
## Linking Pattern for Sub-Cluster Articles

### From Article (OUTBOUND):

1. **Back to Pillar** (required, first relevant reference)
   Anchor: "NSW Strata Compliance Guide"
   Target: `/guides/nsw-strata-compliance`
   Position: In first 200 words

2. **To Related Articles in Same Silo** (1-2 contextual links)
   Examples:
   - "Learn about AGM requirements" → `/blog/how-to-run-agm-self-managed-strata`
   - "Understand levy payment options" → `/blog/strata-levy-payment-plans-nsw`
   Position: Where topic naturally connects

3. **To Relevant Tools** (1 link max)
   Anchor: "Use our Compliance Health Check"
   Target: `/tools/compliance-health-check`
   Position: At end of article or in context

4. **To Cross-Silo Content** (1 max, only if natural)
   Examples from Compliance Article:
   - "See financial implications" → `/guides/strata-financial-management`
   - "Factor in insurance costs" → `/blog/disclosure-of-insurance-commissions-strata`

### Linking Score: 3-5 outbound links per 1,500 word article
```

#### Level 3: Tool Page Linking

**Tool Example:** `/tools/compliance-health-check`

```markdown
## Linking Pattern for Tool Pages

### From Tool (OUTBOUND):

1. **To Relevant Pillar** (1 link)
   Anchor: "Learn more about compliance requirements"
   Target: `/guides/nsw-strata-compliance`
   Position: In intro or CTA section

2. **To Detailed Blog Articles** (2-3 links)
   Examples:
   - "Understand Strata Hub requirements"
   - "Review AGM compliance deadlines"
   - "Check your financial documentation"

3. **To Other Tools** (optional, max 1)
   Only if complementary: e.g., "levy-calculator"

### Back to Tool (INBOUND):

- Every pillar and sub-cluster article should link to relevant tool
- Category pages should mention tools
- CTAs in tools area should link to trial/signup

### Tool as Content Hub:
Tools are high-value pages that should receive 10-15+ quality inbound links
```

#### Level 4: Category & Hub Page Linking

**Page Example:** `/strata-management` (Hub) or `/strata-management/sydney` (Category)

```markdown
## Linking Pattern for Category Pages

### From Hub/Category (OUTBOUND):

1. **To Pillar Guides** (2-3 links)
   "Learn about compliance in your area"
   "Financial management for your scheme"

2. **To Relevant Tools** (1-2 links)
   "Check your compliance status"
   "Calculate your levy"

3. **To Related Suburb Pages** (optional, max 3)
   Only for major population centers

### To Hub/Category (INBOUND):

- Homepage should link to main hub
- All pillar guides should link to relevant suburb pages
- Tools should link back

### Suburb Linking Strategy:

```
/strata-management (Main Hub)
    ↓ (Primary links to)
  [5-10 Major Suburbs: Sydney, North Sydney, Manly, etc.]
    ↓ (Each suburb links to)
  1. Compliance Guide (generic: `/guides/nsw-strata-compliance`)
  2. Levy Calculator (generic tool)
  3. Related suburbs (geographically close)
  4. Main hub (up)
```

### Category Linking Rules:

- Link to all items in category (paginate if 20+)
- Prioritize featured/premium items higher on page
- Use descriptive link text
- Group links by relevance (not just chronologically)
```

#### Level 5: Cross-Silo Linking Strategy

```markdown
## Strategic Cross-Silo Links

### Compliance → Financial
- "See financial implications of penalties"
- "Budget for compliance-related costs"
- "Plan levies to cover compliance expenses"
- Link anchor to: Financial Management guide

### Financial → Compliance
- "Ensure financial compliance"
- "Meet AGM financial reporting requirements"
- Link anchor to: Compliance guide

### Maintenance → Compliance & Financial
- "Meet capital works compliance requirements"
- "Budget for compliance-required inspections"
- Link anchor to: Relevant guides

### Compliance → 2025 Reforms
- "Understand new 2025 compliance changes"
- Link anchor to: 2025 Reforms guide

### All Silos → Suburb Pages
- "See how this applies to your area"
- Include suburb context where relevant

### Cross-Silo Linking Rules:
- Max 1-2 cross-silo links per page (dilutes authority if too many)
- Links must be contextual and natural
- Prioritize within-silo links first
- Use cross-silo links to support user journey (problem → solution flow)
```

### Anchor Text Guidelines

#### Types of Anchor Text

```markdown
## Anchor Text Examples by Context

### Exact Match (Use Sparingly - Max 10% of links)
❌ Don't overuse:
- "strata compliance"
- "levy calculator"

✅ Occasional use for primary keywords:
- First mention of pillar topic
- In user-facing navigation

### Phrase Match (Use Moderately - 30-40% of links)
✅ Natural phrases:
- "Learn more about strata compliance"
- "Use our levy calculator"
- "Understand AGM requirements"
- "Complete compliance guide"

### Descriptive (Use Most - 50-60% of links)
✅ Most useful for users:
- "See how Strata Hub registration works"
- "Get step-by-step AGM guidance"
- "Check if your scheme is compliant"
- "Review your financial obligations"
- "Understand the 2025 training requirements"

### Branded (Use for Authority)
✅ StrataGenie-specific:
- "StrataGenie Compliance Health Check"
- "Try StrataGenie levy calculator"

### Avoid:
❌ "Click here"
❌ "More information"
❌ "Read this"
❌ URL as anchor text
❌ Keyword stuffing in anchor
```

### Linking Audit Template

| Page | Pillar Links | Silo Links | Cross-Silo | Tool Links | Anchor Quality | Status |
|------|--------------|-----------|------------|-----------|----------------|--------|
| Blog: Strata Hub | ✅ 1 | ✅ 2 | ✅ 1 (Financial) | ✅ 1 | ✅ Good | Ready |
| Blog: AGM Guide | ✅ 1 | ✅ 1 | ❌ 0 | ⚠️ Missing | ⚠️ Average | Needs Work |
| Tool: Compliance Check | ✅ 1 | N/A | ✅ 1 | N/A | ✅ Good | Ready |

---

## Schema Markup Priority List

### Schema Markup Strategy

Use schema markup to:
- Help search engines understand page content
- Enable rich snippets and search features
- Support voice search
- Prepare for AI content understanding
- Meet Google Search Console guidelines

### Priority Tier System

**TIER 1 (CRITICAL - Implement Now)**
- Must be on every page in category
- High impact on search visibility
- Required for search features

**TIER 2 (IMPORTANT - Implement Q1 2026)**
- Significantly helps specific page types
- Supports secondary search features
- Improves E-E-A-T signals

**TIER 3 (NICE-TO-HAVE - Implement Q2 2026)**
- Incremental SEO benefit
- Best practice but not essential
- May require custom implementation

---

### Schema Markup Implementation Matrix

#### ✅ TIER 1: CRITICAL

##### 1. Organization Schema
**Pages:** All pages (via layout or homepage)
**Priority:** CRITICAL
**Current Status:** ✅ IMPLEMENTED
**Location:** `lib/seo/schemas.ts` → `generateOrganizationSchema()`

```typescript
// Already implemented, no changes needed
// Appears on every page via JsonLd component
```

**Validation:**
- Test at: https://schema.org/validator
- Include: name, URL, logo, contact, address
- Update annually: Logo URL, contact email

---

##### 2. BreadcrumbList Schema
**Pages:** All pages with navigation hierarchy
**Priority:** CRITICAL
**Current Status:** ✅ IMPLEMENTED
**Location:** `lib/seo/schemas.ts` → `generateBreadcrumbSchema()`

```typescript
// Current implementation
generateBreadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
  { name: "Post Title", path: "/blog/slug" }
])

// Breadcrumbs appear in Google Search results
// Users can click to parent pages directly
```

**Implementation Rules:**
- Always include: Home → Current Section → Current Page
- Use actual navigation structure
- 3-5 levels typically sufficient
- Update for all: blog posts, guides, tool pages, suburb pages

---

##### 3. Article Schema
**Pages:** All blog posts
**Priority:** CRITICAL
**Current Status:** ✅ IMPLEMENTED
**Location:** `lib/seo/schemas.ts` → `generateArticleSchema()`

```typescript
// Current implementation
generateArticleSchema({
  title: "Post Title",
  description: "Meta description",
  slug: "post-slug",
  image: "/path/to/image.jpg",
  publishedAt: "2025-01-17",
  updatedAt: "2025-01-17",
  author: "StrataGenie Team"
})

// Enables:
// ✅ Rich snippet with image
// ✅ Published/Updated dates in search
// ✅ Author attribution
// ✅ Article headline in search
```

**Implementation Rules:**
- Include: headline, description, image (1200x630 minimum), date published, author
- Update: dateModified when content changes
- Image: Should be high quality, relevant to article
- Author: Consistent "StrataGenie Team" or individual name

**Enhancement for 2026:**
```typescript
// Add articleBody for better content understanding
// Add keywords array
// Add wordCount
{
  "articleBody": "Full article text (optional, but helps)",
  "keywords": ["keyword1", "keyword2"],
  "wordCount": 1500
}
```

---

##### 4. WebPage Schema
**Pages:** All guides, tools, main pages
**Priority:** CRITICAL
**Current Status:** ✅ IMPLEMENTED
**Location:** `lib/seo/schemas.ts` → `generateWebPageSchema()`

```typescript
// Current implementation
generateWebPageSchema({
  title: "Page Title",
  description: "Page description",
  path: "/guides/nsw-strata-compliance",
  datePublished: "2025-01-01",
  dateModified: "2025-01-15"
})

// Enables:
// ✅ Page indexing confirmation
// ✅ Date signals for freshness
// ✅ Breadcrumb integration
```

**Implementation Rules:**
- Use on: Guides, tools, main pages (not articles - they use Article schema)
- Include: title, description, URL, datePublished, dateModified
- dateModified: Update when content changes significantly

---

##### 5. FAQPage Schema
**Pages:** All pages with FAQ sections (content or separate FAQ pages)
**Priority:** CRITICAL
**Current Status:** ✅ IMPLEMENTED
**Location:** `lib/seo/schemas.ts` → `generateFAQSchema()`

```typescript
// Current implementation
generateFAQSchema([
  {
    question: "What's the deadline for AGM?",
    answer: "Within 3 months of financial year end..."
  },
  {
    question: "What if we miss the deadline?",
    answer: "Penalties apply of up to $1,100..."
  }
])

// Enables:
// ✅ FAQ rich snippet (questions appear in search)
// ✅ Voice search optimization
// ✅ Direct answer snippets
// ✅ Google People Also Ask integration
```

**Implementation Rules:**
- Use for any section with 3+ Q&A pairs
- Format as: "h3" with question text, followed by answer paragraph
- 5-10 FAQs typically optimal
- Keep questions concise (under 100 characters)
- Keep answers informative but scannable (100-300 words)

**Current Implementation:** In `/guides/nsw-strata-compliance` ✅

---

##### 6. SoftwareApplication Schema
**Pages:** Homepage, product pages, marketing pages
**Priority:** CRITICAL
**Current Status:** ✅ IMPLEMENTED
**Location:** `lib/seo/schemas.ts` → `generateSoftwareApplicationSchema()`

```typescript
// Current implementation shows:
{
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Property Management Software",
  "operatingSystem": "Web Browser",
  "offers": {
    "price": "14.99",
    "priceCurrency": "AUD",
    "availability": "InStock"
  },
  "featureList": [
    "AGM Compliance Tracking",
    "Strata Hub Integration",
    "AI-Powered Document Generation",
    "Levy Calculation & Management",
    "Bylaw Q&A Assistant",
    "Invoice Processing"
  ]
}

// Enables:
// ✅ Product rich snippet with features
// ✅ Pricing display in search
// ✅ Category signal (for app directories)
// ✅ E-E-A-T signals (legitimate software)
```

**Implementation Rules:**
- Include: applicationCategory, applicationSubCategory, offers, featureList
- Price: Keep current (update when pricing changes)
- Features: Use actual, verifiable features
- Logo: Must be an image URL (optimized for search)

---

#### ⚠️ TIER 2: IMPORTANT (Implement Q1 2026)

##### 7. HowTo Schema
**Pages:** How-to guides, step-by-step content
**Priority:** HIGH
**Current Status:** ✅ IMPLEMENTED
**Location:** `lib/seo/schemas.ts` → `generateHowToSchema()`

```typescript
// Example for "How to Run AGM"
generateHowToSchema({
  name: "How to Run an AGM for Self-Managed Strata",
  description: "Step-by-step guide to running a compliant AGM...",
  steps: [
    { name: "1. Send Notice", text: "Provide 21 days notice..." },
    { name: "2. Prepare Agenda", text: "Include all required items..." },
    { name: "3. Hold Meeting", text: "Follow procedural rules..." },
    { name: "4. Record Minutes", text: "Document decisions..." }
  ],
  totalTime: "PT2H"
})

// Enables:
// ✅ How-to rich snippet in Google Search
// ✅ Time estimate display
// ✅ Visual step-by-step in mobile search
// ✅ Featured snippet optimization
```

**Implementation Rules:**
- Use for content with 3+ distinct steps
- Include: name, description, steps[], totalTime (ISO 8601)
- Each step needs: position, name, text
- Format names clearly: "Step 1: Do X", "Step 2: Do Y"
- Estimate time accurately

**Pages to Add (Not Yet Implemented):**
- `/blog/how-to-run-agm-self-managed-strata` (update frontmatter)
- Create `/blog/how-to-strata-hub-registration` (if created)
- Create `/blog/how-to-prepare-agm-minutes` (if created)

---

##### 8. LocalBusiness Schema
**Pages:** Suburb landing pages `/strata-management/[suburb]`
**Priority:** MEDIUM
**Current Status:** ✅ IMPLEMENTED
**Location:** `lib/seo/schemas.ts` → `generateLocalBusinessSchema()`

```typescript
// For /strata-management/sydney
generateLocalBusinessSchema({
  suburb: "Sydney",
  region: "NSW",
  postcode: "2000"
})

// Enables:
// ✅ Local search result visibility
// ✅ "Near Me" searches
// ✅ Google Maps integration signals
// ✅ Area served signals
```

**Implementation Rules:**
- Include: suburb, region (NSW), postcode
- Postcode: Use main postcode for suburb (or all if diverse)
- One schema per suburb page
- Coordinates (lat/long) optional but helpful

**Implementation Status:** Needs to be added to all `/strata-management/[suburb]` pages

---

##### 9. ImageObject Schema
**Pages:** Blog posts with featured images, tool screenshots
**Priority:** MEDIUM
**Current Status:** ⚠️ PARTIAL
**Location:** Should be in blog post schema

```typescript
// Add to Article Schema
{
  "image": {
    "@type": "ImageObject",
    "url": "https://stratagenie.com/images/agm-guide.jpg",
    "width": 1200,
    "height": 630,
    "contentUrl": "https://stratagenie.com/images/agm-guide.jpg",
    "name": "AGM Compliance Guide Infographic",
    "description": "Step-by-step AGM process for strata schemes"
  }
}

// Enables:
// ✅ Google Images search indexing
// ✅ Image search with rich data
// ✅ Better image optimization signals
```

**Implementation:** Update `generateArticleSchema()` to include full ImageObject

---

##### 10. Offer Schema (for Tools)
**Pages:** Free/paid tool pages
**Priority:** MEDIUM
**Current Status:** ✅ IMPLEMENTED
**Location:** `lib/seo/schemas.ts` → `generateFreeToolSchema()`

```typescript
generateFreeToolSchema({
  name: "Levy Calculator",
  description: "Free tool to calculate...",
  path: "/tools/levy-calculator"
})

// Current shows price: "0" for free tools
// Enables:
// ✅ Free resource signals in search
// ✅ Tool category signals
// ✅ Organic CTR improvement
```

**Implementation Rules:**
- Price: "0" for free tools
- priceCurrency: "AUD" always
- Clearly state: "Free" tool vs "Premium" tool
- Include provider (StrataGenie)

---

#### 🎯 TIER 3: NICE-TO-HAVE (Implement Q2 2026)

##### 11. Author/Person Schema
**Pages:** Author bio pages (if created), articles with individual authors
**Priority:** LOW
**Current Status:** ❌ NOT IMPLEMENTED

```typescript
// For future team/author pages
{
  "@type": "Person",
  "name": "Sarah Chen",
  "jobTitle": "Strata Compliance Specialist",
  "url": "https://stratagenie.com/team/sarah-chen",
  "sameAs": ["https://linkedin.com/in/sarahchen"]
}

// Enables:
// ✅ Author recognition in search
// ✅ Personal brand signals
// ✅ Expertise signals
```

---

##### 12. VideoObject Schema
**Pages:** Any page with embedded videos
**Priority:** LOW
**Current Status:** ❌ NOT IMPLEMENTED

```typescript
// If/when video content added
{
  "@type": "VideoObject",
  "name": "How to Register on Strata Hub",
  "description": "5-minute tutorial...",
  "thumbnailUrl": "https://...",
  "uploadDate": "2025-01-15",
  "duration": "PT5M",
  "url": "https://youtube.com/..."
}

// Enables:
// ✅ Video search results
// ✅ YouTube integration
// ✅ Rich video snippets
```

---

##### 13. NewsArticle Schema
**Pages:** News/update articles
**Priority:** LOW
**Current Status:** ❌ NOT IMPLEMENTED

```typescript
// For breaking news or announcements
{
  "@type": "NewsArticle",
  "headline": "NSW Announces 2025 Strata Compliance Changes",
  "image": "...",
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-15",
  "author": {
    "@type": "Organization",
    "name": "StrataGenie"
  }
}

// Enables:
// ✅ News aggregator inclusion
// ✅ Breaking news signals
```

---

##### 14. Event Schema
**Pages:** If hosting webinars or events
**Priority:** LOW
**Current Status:** ❌ NOT IMPLEMENTED

```typescript
// For future webinars/events
{
  "@type": "Event",
  "name": "2025 Compliance Updates Webinar",
  "description": "...",
  "startDate": "2025-02-15T14:00:00",
  "endDate": "2025-02-15T15:00:00",
  "eventAttendanceMode": "OnlineEventAttendanceMode",
  "eventStatus": "EventScheduled",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://..."
  },
  "organizer": {
    "@type": "Organization",
    "name": "StrataGenie"
  }
}

// Enables:
// ✅ Event search integration
// ✅ Calendar/agenda inclusion
```

---

### Schema Markup Implementation Checklist

#### Immediate (This Week)
- [ ] Audit current schema implementations in `lib/seo/schemas.ts`
- [ ] Add HowTo schema to existing how-to articles
- [ ] Add ImageObject schema to Article schema generator
- [ ] Test all TIER 1 schemas with: https://schema.org/validator

#### Short-term (This Month)
- [ ] Add LocalBusiness schema to all `/strata-management/[suburb]` pages
- [ ] Update all blog post frontmatter with image dimensions
- [ ] Implement missing anchor tests for Article schema
- [ ] Monitor Rich Results Test for new rich snippets

#### Medium-term (Next Quarter)
- [ ] Add Review schema (if customer testimonials added)
- [ ] Add AggregateOffer schema (if multiple pricing tiers)
- [ ] Create structured data for all tool pages
- [ ] Add datePublished/dateModified to all pages

#### Long-term (Next 6 Months)
- [ ] Author schema for team pages
- [ ] Video schema for tutorial content
- [ ] NewsArticle schema for press releases
- [ ] Event schema for webinars

---

## Table of Contents Best Practices

### Purpose of Table of Contents

A TOC is not just for UX—it's also for SEO:
- **Search engines** understand page structure
- **Users** navigate complex content faster
- **Accessibility** is improved (keyboard navigation)
- **Featured snippets** often pull from TOC sections
- **Mobile users** have clear page navigation

### When to Use Table of Contents

#### ALWAYS Include TOC on:
- Pillar/guide pages (5,000+ words)
- How-to articles (10+ steps)
- Comparison pages (4+ categories)
- Complex technical pages

#### MAYBE Include TOC on:
- Long-form blog posts (3,000-5,000 words)
- Listicles with 10+ items
- Reference pages

#### NEVER Include TOC on:
- Short blog posts (under 1,500 words)
- Product/tool pages (unless very complex)
- Category/list pages
- Legal pages (privacy, terms)

### Table of Contents Format Rules

#### Best Practice Example

```markdown
## Table of Contents

1. [What's Changed in 2025?](#whats-changed-in-2025)
2. [Is Training Mandatory?](#is-training-mandatory)
3. [NSW Fair Trading Training Modules](#nsw-fair-trading-training-modules)
   - [Module 1: Introduction to Strata](#module-1-introduction-to-strata)
   - [Module 2: Committee Operations](#module-2-committee-operations)
   - [Module 3: Financial Management](#module-3-financial-management)
4. [Getting Started Today](#getting-started-today)
5. [Frequently Asked Questions](#frequently-asked-questions)

---

## What's Changed in 2025?

...content...

## Is Training Mandatory?

...content...

### Module 1: Introduction to Strata

...content...
```

#### Design Specifications

```css
/* TOC Container */
.table-of-contents {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(59, 130, 246, 0.05));
  border-left: 4px solid #0891b2;
  padding: 20px;
  border-radius: 8px;
  margin: 30px 0;
}

/* TOC Title */
.toc-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

/* TOC List */
.toc-list {
  list-style: none;
  padding-left: 0;
}

.toc-list > li {
  margin: 8px 0;
}

.toc-list a {
  color: #0369a1;
  text-decoration: none;
  transition: color 0.2s;
}

.toc-list a:hover {
  color: #0891b2;
}

/* Nested Lists (H3 under H2) */
.toc-list ul {
  list-style: none;
  padding-left: 16px;
  margin-top: 4px;
  border-left: 1px solid #e0e7ff;
  padding-left: 16px;
}

.toc-list ul li {
  margin: 4px 0;
  font-size: 14px;
}
```

#### HTML Implementation

```html
<nav className="table-of-contents">
  <h2 className="toc-title">Quick Navigation</h2>
  <ul className="toc-list">
    <li><a href="#section1">Main Topic 1</a></li>
    <li>
      <a href="#section2">Main Topic 2</a>
      <ul>
        <li><a href="#section2-1">Sub-topic 2.1</a></li>
        <li><a href="#section2-2">Sub-topic 2.2</a></li>
      </ul>
    </li>
    <li><a href="#section3">Main Topic 3</a></li>
  </ul>
</nav>
```

### Table of Contents Anchor Link Rules

#### Creating Proper Anchors

```markdown
# Correct Anchor Format

## Header Text Here
<!-- Auto-generates: #header-text-here -->

- Remove special characters: & → omit, @ → omit, # → omit
- Remove: commas, periods, colons, semicolons
- Convert: spaces → hyphens (-)
- Lowercase: all letters
- Remove: "the", "a", "an" (optional but common)
- Remove: "guide", "page", "section" (optional)

## Examples:

✅ "NSW Strata Compliance" → #nsw-strata-compliance
✅ "Admin Fund vs Capital Works Fund" → #admin-fund-vs-capital-works-fund
✅ "What's Changed?" → #whats-changed
✅ "Committee Q&A" → #committee-qa

❌ "NSW Strata Compliance Guide" → Too long (omit "Guide")
❌ "NSW STRATA COMPLIANCE" → Use lowercase
❌ "NSW Strata Compliance!!!" → Remove special chars
```

#### Validating Anchors

```typescript
// Function to generate consistent anchors
export function generateAnchor(text: string): string {
  return text
    .toLowerCase()
    .replace(/[&\/\\#,+()$~%.'"]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Examples:
generateAnchor("What's Changed in 2025?")
// → "whats-changed-in-2025"

generateAnchor("Admin Fund vs Capital Works Fund")
// → "admin-fund-vs-capital-works-fund"
```

### Table of Contents Hierarchy Rules

```markdown
## Correct TOC Hierarchy

Table of Contents
├─ H2 Section 1
├─ H2 Section 2
│  ├─ H3 Subsection 2.1
│  ├─ H3 Subsection 2.2
│  └─ H3 Subsection 2.3
├─ H2 Section 3
│  └─ H3 Subsection 3.1
└─ H2 Section 4

## Incorrect TOC Hierarchy

❌ H1 (never include H1 in TOC)
❌ H2 → H4 (skips H3)
❌ H3 → H2 (wrong order)
❌ Multiple nested levels (too deep, confusing)

## Rules:

- Start with H2 (H1 is page title)
- Never skip header levels
- Max 2-3 nesting levels (H2 → H3 → H4)
- Don't include H5/H6 (too granular)
- Group related H3s under H2
```

### Table of Contents Content Rules

#### DO's

- **Keep TOC concise**: 8-15 items maximum
- **Use clear language**: Match exact header text
- **Make it scannable**: Bold action words
- **Include page sections**: All major H2s and their H3s
- **Position at top**: After intro paragraph (100-200 words max)
- **Use icons**: Optional but helpful (➜, →, ▸)
- **Mobile-friendly**: Stack vertically, not horizontally

#### DON'Ts

- **Don't duplicate headers**: One link = one header
- **Don't abbreviate**: Use full header text
- **Don't add explanatory text**: Just the header title
- **Don't nest too deep**: H2 → H3 is usually enough
- **Don't use generic titles**: "Introduction" → "Why This Topic Matters"
- **Don't ignore skipped sections**: If you jump from H2 to H4, fix the structure

### Table of Contents Accessibility Rules

#### Keyboard Navigation

```html
<!-- TOC should be keyboard accessible -->
<nav aria-label="Table of Contents">
  <h2>Quick Navigation</h2>
  <ul>
    <li><a href="#section1">Section 1</a></li>
    <!-- Tab key should navigate all links -->
  </ul>
</nav>
```

#### Screen Reader Optimization

```html
<!-- Use semantic HTML -->
<nav role="navigation" aria-label="Contents">
  <h2>Table of Contents</h2>
  <ul>
    <li><a href="#compliance">Compliance Requirements</a></li>
  </ul>
</nav>

<!-- Screen reader will announce: -->
<!-- "Navigation region: Table of Contents" -->
<!-- "Link: Compliance Requirements" -->
```

#### ARIA Labels

```html
<!-- Always label TOC for assistive tech -->
<nav aria-labelledby="toc-heading">
  <h2 id="toc-heading">Table of Contents</h2>
  <ul>
    <li><a href="#intro">Introduction</a></li>
  </ul>
</nav>
```

### Table of Contents Example: NSW Strata Compliance Guide

#### Current Page (Check Implementation)
**Page:** `/guides/nsw-strata-compliance`

```markdown
## Table of Contents

1. [Key Compliance Requirements](#key-compliance-requirements)
2. [Annual Compliance Calendar](#annual-compliance-calendar)
3. [Strata Hub Registration & Reporting](#strata-hub-registration--reporting)
4. [Annual General Meeting Requirements](#annual-general-meeting-requirements)
5. [Financial Statements & Record Keeping](#financial-statements--record-keeping)
6. [Insurance & Building Safety](#insurance--building-safety)
7. [Penalties for Non-Compliance](#penalties-for-non-compliance)
8. [Frequently Asked Questions](#frequently-asked-questions)

---

## Key Compliance Requirements

...content...

## Annual Compliance Calendar

...content...

## Strata Hub Registration & Reporting

...content...
```

---

## Implementation Checklist

### Phase 1: Architecture & Structure (Week 1-2)

#### Header Hierarchy
- [ ] Audit all existing pages for header structure compliance
- [ ] Fix pages with:
  - [ ] Multiple H1s
  - [ ] Skipped header levels
  - [ ] Non-semantic header usage
- [ ] Create header templates for each page type
- [ ] Document in developer guidelines

#### Content Siloing
- [ ] Map current content to proposed silos
- [ ] Identify missing content (gaps in clusters)
- [ ] Create content roadmap for gaps
- [ ] Set up silo structure in navigation (if not already done)
- [ ] Document silo relationships for team

#### Schema Markup
- [ ] Audit: Which schemas are currently implemented?
- [ ] Test current schemas: https://schema.org/validator
- [ ] Fix any errors or missing data
- [ ] Document where each schema is generated

### Phase 2: Internal Linking (Week 3-4)

- [ ] Map existing internal links per page
- [ ] Identify pages with insufficient outbound links
- [ ] Identify pages missing inbound links (orphaned pages)
- [ ] Add 5-8 outbound links to each pillar page
- [ ] Ensure each sub-cluster article links back to pillar
- [ ] Add tool page cross-links
- [ ] Audit anchor text quality
- [ ] Test all links work (no 404s)

### Phase 3: Content Enhancement (Week 5-6)

#### Table of Contents
- [ ] Add TOC to all pillar guides (5,000+ words)
- [ ] Add TOC to how-to articles (10+ steps)
- [ ] Verify all TOC links are valid and match headers
- [ ] Test TOC on mobile (keyboard navigation)
- [ ] Add accessibility labels (aria-label)

#### SEO Content Updates
- [ ] Verify all pages have unique titles (under 60 chars)
- [ ] Verify all pages have meta descriptions (under 160 chars)
- [ ] Check pages for natural keyword usage
- [ ] Add related article links to blog posts
- [ ] Add breadcrumb navigation to complex sections

### Phase 4: Validation & Testing (Week 7)

- [ ] Google Search Console: Validate all schemas
- [ ] Rich Results Test: Check all TIER 1 schemas
- [ ] Mobile Friendly Test: Verify all pages
- [ ] Lighthouse SEO: Run audit (target 90+)
- [ ] PageSpeed Insights: Check Core Web Vitals
- [ ] Broken Link Checker: Fix any 404s
- [ ] Duplicate Content Check: Identify/merge duplicates

### Phase 5: Monitoring & Iteration (Ongoing)

- [ ] Weekly: Monitor Google Search Console errors
- [ ] Monthly: Audit 10 random pages for structure
- [ ] Monthly: Check trending queries → optimize pages
- [ ] Quarterly: Update evergreen content (dates, stats)
- [ ] Quarterly: Audit new schema opportunities
- [ ] Quarterly: Review silo performance (traffic, rankings)

---

## Performance Metrics

### Key Performance Indicators

#### Ranking Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Pages in Top 10 | Unknown | +50% | Q2 2026 |
| Pillar Page Rankings | Unknown | Top 5 (each) | Q1 2026 |
| Featured Snippets | Unknown | 10+ | Q1 2026 |
| Rich Results Eligible | 70% | 95% | Q1 2026 |

#### Traffic Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Organic Traffic | Baseline | +40% | Q2 2026 |
| Average Position | Unknown | < 20 | Q1 2026 |
| CTR from Search | Unknown | +25% | Q2 2026 |
| Pages with Traffic | Unknown | 100+ | Q1 2026 |

#### Content Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Pages with TOC | ~5 | 20+ | Q1 2026 |
| Schema Coverage | 70% | 95% | Q1 2026 |
| Internal Links/Page | 3-5 | 5-8 | Q1 2026 |
| Silo Cohesion | Low | High | Q1 2026 |

#### User Engagement Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Avg Session Duration | Unknown | +30% | Q2 2026 |
| Pages per Session | Unknown | +25% | Q2 2026 |
| Bounce Rate | Unknown | < 50% | Q2 2026 |
| Scroll Depth | Unknown | > 60% | Q2 2026 |

### Tracking Setup

#### Google Analytics 4

```typescript
// Track TOC interactions
gtag.event('toc_click', {
  'section': 'compliance-calendar',
  'page_title': 'NSW Strata Compliance Guide'
});

// Track pillar page engagement
gtag.event('pillar_engagement', {
  'pillar': 'compliance',
  'time_on_page': duration,
  'scroll_depth': depth
});

// Track silo navigation
gtag.event('silo_navigation', {
  'from_page': 'blog-agm',
  'to_page': 'guide-compliance',
  'silo': 'compliance'
});
```

#### Google Search Console

- Monitor: Impressions, clicks, average position
- Set targets: CTR increase, position improvement
- Check: Coverage issues, mobile usability
- Review: URL audit, sitemaps

#### Schema Validation

```bash
# Monthly schema validation
# Use: https://schema.org/validator
# Check: Rich Results Test (Google)
# Monitor: Structured Data Coverage (GSC)
```

### Monthly Audit Template

**Month/Year:** __________

#### Ranking Changes
- [ ] Top gainer keywords: ___________
- [ ] Lost rankings: ___________
- [ ] New keywords in Top 10: ___________
- [ ] Pillar pages trending: ___________

#### Traffic Analysis
- [ ] Total organic traffic: _________ (vs last month: ±__%)
- [ ] Top traffic sources (keywords): _________
- [ ] Pages with highest growth: _________
- [ ] Underperforming pages: _________

#### Technical Issues
- [ ] Crawl errors: ___________
- [ ] Mobile usability: ___________
- [ ] Rich results issues: ___________
- [ ] Broken links found: ___________

#### Content Updates Made
- [ ] New pages created: ___________
- [ ] Pages updated: ___________
- [ ] New schema added: ___________
- [ ] Internal links added: ___________

#### Next Month Actions
- [ ] Priority 1: ___________
- [ ] Priority 2: ___________
- [ ] Priority 3: ___________

---

## Appendix: Quick Reference Guide

### Header Level Quick Reference

```
H1: One per page. Page title. 50-60 chars. Primary keyword.
H2: Main sections. 3-6 per page. Primary/secondary keywords.
H3: Subsections. Under H2 only. Refinement of H2 topic.
H4: Detailed points. Under H3 only. List introductions, special emphasis.
H5-H6: Rarely needed. Not recommended for SEO.
```

### Silo Quick Reference

```
Compliance Silo → Pillar: /guides/nsw-strata-compliance
  ├─ Strata Hub Registration
  ├─ AGM Requirements
  ├─ Levy Compliance
  ├─ Insurance Requirements
  └─ Tool: Compliance Health Check

Financial Silo → Pillar: /guides/strata-financial-management
  ├─ Fund Management
  ├─ Levy Calculation
  ├─ Financial Hardship
  └─ Tool: Levy Calculator

Maintenance Silo → Pillar: /guides/maintenance-asset-management
  ├─ Maintenance Responsibilities
  ├─ Capital Works Planning
  └─ Special Levies

2025 Reforms Silo → Pillar: /guides/2025-nsw-strata-reforms
  ├─ Training Requirements
  ├─ Financial Hardship Changes
  └─ Transparency Updates

Suburb Silo → Hub: /strata-management
  ├─ /strata-management/[suburb] (100+ pages)
  └─ Each links to: Guides + Tools
```

### Schema Quick Reference

| Page Type | Required Schema | Optional Schema |
|-----------|-----------------|-----------------|
| Blog Post | Article, Breadcrumb | HowTo, ImageObject |
| Pillar Guide | WebPage, FAQ, Breadcrumb | HowTo |
| Tool Page | SoftwareApplication, Breadcrumb | Offer, ImageObject |
| Category Page | WebPage, Breadcrumb | N/A |
| Suburb Page | LocalBusiness, Breadcrumb | N/A |
| Homepage | Organization, SoftwareApplication | FAQPage |

### Anchor Text Quick Reference

```
60% Descriptive: "Learn more about AGM requirements"
30% Phrase Match: "NSW strata compliance guide"
10% Exact Match: "strata compliance" (sparingly)

NEVER: "click here", "read more", URL as text
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-04 | SEO Architect | Initial framework creation |

---

**Document Location:** `C:\Users\jayso\strata\SEO-STRUCTURE-FRAMEWORK.md`
**Status:** Ready for Implementation
**Next Review:** January 15, 2026

---

## Questions or Updates?

This framework should be reviewed and updated quarterly as the site evolves:
- After significant content additions
- Following major traffic/ranking changes
- When expanding into new topic clusters
- Quarterly check-in: Last Friday of each quarter

For questions about implementation, refer to the specific section or consult the development team guidelines.
