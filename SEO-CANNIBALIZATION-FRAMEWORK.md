# SEO Cannibalization Prevention & Resolution Framework

> **PURPOSE:** This framework prevents multiple pages from competing for the same search keywords, which dilutes ranking power and confuses search engines. Use this system proactively during content planning and reactively to resolve existing conflicts.

**Last Updated:** 4 December 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Publish Overlap Check Process](#pre-publish-overlap-check-process)
3. [Keyword Mapping Template](#keyword-mapping-template)
4. [Content Differentiation Guidelines](#content-differentiation-guidelines)
5. [Consolidation Decision Criteria](#consolidation-decision-criteria)
6. [Resolution Action Playbook](#resolution-action-playbook)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Overview

### What is SEO Cannibalization?

SEO cannibalization occurs when multiple pages on your site compete for the same or similar keywords. This splits your ranking power and confuses search engines about which page is most relevant.

**Example from StrataGenie:**
- `Blog post: "Strata Levy Payment Plans NSW"`
- `Pillar page: "Strata Financial Management"`
- `Tool: "Levy Calculator"`

All three could rank for "strata levy NSW" — diluting ranking potential.

### Why It Matters

- **Fragmented Authority:** Each page gets less backlink power, making none rank well
- **Confusing Search Engines:** Unclear which page should rank for a given keyword
- **Wasted Link Equity:** Potential link value spread across pages instead of concentrated
- **Lower Click-Through Rates:** Multiple similar results in SERP confuse users

### Prevention vs. Resolution

| Phase | Action | Timing |
|-------|--------|--------|
| **Prevention** | Pre-publish overlap checks | Before publishing new content |
| **Detection** | Monthly keyword tracking audit | Ongoing |
| **Resolution** | Consolidation or differentiation | When conflicts detected |

---

## Pre-Publish Overlap Check Process

Use this checklist **before publishing any new content** (blog post, guide, tool, page).

### Step 1: Define Your New Content

**Document the following:**

```yaml
Content Type: [blog post | pillar page | tool | landing page]
Title: [Proposed title]
Target Keywords:
  - primary: [main keyword with search volume]
  - secondary: [2-3 supporting keywords]
  - long-tail: [3-5 long-tail variations]
Target Audience: [who this page serves]
Content Angle: [unique angle or perspective]
Pillar Connection: [which pillar page, if any]
```

**Example:**

```yaml
Content Type: blog post
Title: "Financial Hardship Information Statement: Strata Scheme Guide"
Target Keywords:
  - primary: "financial hardship information statement strata"
  - secondary: ["hardship strata nsw", "strata financial difficulties"]
  - long-tail: ["strata financial hardship form", "strata hardship support nsw"]
Target Audience: committee members facing financial difficulties
Content Angle: how to file hardship statement with government support
Pillar Connection: "2025-nsw-strata-reforms" (reform-specific guidance)
```

### Step 2: Search for Competing Pages

**Check these sources (in order):**

1. **Internal:** Search your own site using `site:stratagenie.com.au [keyword]`
2. **Content Inventory:** Review SEO.md's Content Inventory section for existing content
3. **Keyword Map:** Cross-reference the Keyword Mapping Template (below)
4. **Google SERP:** Check top 10 results for target keywords
5. **Related Content:** Check pillar pages for existing child posts

**Tools to Use:**

- Google Search Console (if available)
- Manual site: searches
- SEO.md keyword table
- Google SERPs

### Step 3: Document Overlap Analysis

**Create an overlap report:**

```markdown
## Overlap Analysis: [Your New Content]

### Direct Competitors (Same Keyword)

| Competing Page | URL | Primary Keyword | Overlap % |
|----------------|-----|-----------------|-----------|
| Existing page 1 | /path | keyword | 90% |

**Assessment:** [No conflict / Minor overlap / Significant conflict]

### Indirect Competitors (Related Keywords)

| Page | Keyword | Potential Conflict |
|------|---------|-------------------|
| Blog post | keyword2 | Minor (different intent) |

### Decision

- [ ] Proceed with new content (no conflict)
- [ ] Differentiate content (modify angle/keywords)
- [ ] Consolidate (merge with existing page)
- [ ] Redirect (merge and 301 redirect)
```

### Step 4: Make Decision

**Apply the Consolidation Decision Criteria (below) to determine next step.**

**Decision Tree:**

```
Is there an existing page with 80%+ keyword overlap?
├─ YES → Can you differentiate the content?
│   ├─ YES → Modify keywords/angle → Proceed
│   └─ NO → Consolidate → Merge or redirect
└─ NO → Proceed with publication
```

### Step 5: Document & Move Forward

- **If proceeding:** Add to Keyword Mapping Template with unique keyword assignments
- **If consolidating:** Update SEO.md content inventory and redirect plan
- **If redirecting:** Create 301 redirect mapping (see Resolution Playbook)

---

## Keyword Mapping Template

This master template prevents accidental keyword conflicts by documenting which keywords belong to which pages.

### How to Use

1. **Column "Page":** Full URL or page identifier
2. **Column "Primary Keyword":** The main target keyword (1-2 per page)
3. **Column "Secondary Keywords":** Supporting keywords (2-3 per page)
4. **Column "Content Type":** Format of the page
5. **Column "Status":** live | draft | planned | archived
6. **Column "Updated":** Last review date

### StrataGenie Keyword Map (Master Reference)

#### Compliance & Registration Cluster

| Page | Primary Keyword | Secondary Keywords | Content Type | Status | Updated |
|------|-----------------|-------------------|--------------|--------|---------|
| /guides/nsw-strata-compliance | strata compliance nsw | nsw strata law, strata compliance checklist | Pillar Page | live | 2025-01-15 |
| /blog/strata-hub-registration-guide | strata hub registration | strata hub guide, register strata scheme | Blog Post | live | 2025-01-15 |
| /tools/compliance-health-check | strata compliance checklist | compliance scoring, compliance audit | Tool | live | 2025-01-18 |

#### Financial Management Cluster

| Page | Primary Keyword | Secondary Keywords | Content Type | Status | Updated |
|------|-----------------|-------------------|--------------|--------|---------|
| /guides/strata-financial-management | strata financial management | strata levy calculator, strata budgeting | Pillar Page | live | 2025-01-16 |
| /blog/admin-fund-vs-capital-works-fund | admin fund vs capital works fund | strata admin fund, capital works fund nsw | Blog Post | live | 2025-01-16 |
| /tools/levy-calculator | strata levy calculator | nsw levy calculator, calculate strata levies | Tool | live | 2025-01-18 |
| /blog/strata-levy-payment-plans-nsw | strata levy payment plans | levy payment assistance, strata payment plans | Blog Post | live | 2025-01-16 |

#### Self-Managed Strata Cluster

| Page | Primary Keyword | Secondary Keywords | Content Type | Status | Updated |
|------|-----------------|-------------------|--------------|--------|---------|
| /guides/transition-to-self-managed | self managed strata nsw | how to fire strata manager, self managed advantages | Pillar Page | live | 2025-01-17 |
| /blog/how-to-transition-to-self-managed-strata | how to transition self managed strata | steps to become self managed, managing strata yourself | Blog Post | live | 2025-01-17 |

#### Maintenance & Asset Management Cluster

| Page | Primary Keyword | Secondary Keywords | Content Type | Status | Updated |
|------|-----------------|-------------------|--------------|--------|---------|
| /guides/maintenance-asset-management | strata maintenance | capital works plan, building maintenance | Pillar Page | live | 2025-01-18 |
| /blog/strata-maintenance-responsibilities | strata maintenance responsibilities | owner obligations, strata maintenance schedule | Blog Post | live | 2025-01-18 |

#### 2025 NSW Reforms Cluster (New - High Priority)

| Page | Primary Keyword | Secondary Keywords | Content Type | Status | Updated |
|------|-----------------|-------------------|--------------|--------|---------|
| /guides/2025-nsw-strata-reforms | 2025 strata reforms nsw | strata law changes 2025, new strata rules | Pillar Page | live | 2025-01-15 |
| /blog/financial-hardship-information-statement-strata | financial hardship information statement strata | strata hardship support, financial hardship form | Blog Post | live | 2025-01-15 |
| /blog/strata-committee-mandatory-training-nsw | strata committee mandatory training | committee training requirements, strata committee training | Blog Post | live | 2025-01-17 |
| /blog/disclosure-of-insurance-commissions-strata | disclosure of insurance commissions strata | strata insurance commissions, insurance disclosure | Blog Post | live | 2025-01-18 |
| /blog/how-to-run-agm-self-managed-strata | how to run agm self managed strata | agm procedures, self managed agm guide | Blog Post | live | 2025-01-18 |

#### Local/Suburb Landing Pages

| Page | Primary Keyword | Secondary Keywords | Content Type | Status | Updated |
|------|-----------------|-------------------|--------------|--------|---------|
| /strata-management/[suburb] | strata management [suburb] | self managed strata [suburb], strata [suburb] | Landing Page | live | 2025-01-15 |
| *Pattern repeats for 20 suburbs* | - | - | - | - | - |

### How to Update This Map

**Before publishing new content:**

1. Add row with new page, keywords, type
2. Check for 80%+ keyword overlap with existing rows
3. If overlap detected → follow Consolidation Decision Criteria
4. If approved → add to this map before publishing

**Monthly maintenance:**

- Review map for keyword drift
- Check if published content actually ranks for assigned keywords
- Adjust secondary keywords if SERP data shows different relevance
- Archive old/consolidated pages

---

## Content Differentiation Guidelines

When two pages target related keywords, differentiate them by **search intent**, **content depth**, **audience**, or **angle**.

### Differentiation Strategies

#### 1. Search Intent Separation

**Assign each page a different search intent:**

| Intent Type | Page Type | Example |
|-------------|-----------|---------|
| **Informational** | Blog post, Pillar page | "How to run an AGM" |
| **Transactional** | Tool, CTA-driven page | "Levy calculator" |
| **Commercial** | Buying guide, comparison | "Best strata manager [suburb]" |
| **Navigational** | Product page | "Strata Hub login" |

**Example: Levy Payment**

```
Informational Page: /blog/strata-levy-payment-plans-nsw
  └─ Keyword: "strata levy payment plans"
     Intent: Learn about payment options
     Content: Explain different payment plans, benefits, how to request

Transactional Page: /tools/levy-calculator
  └─ Keyword: "strata levy calculator"
     Intent: Calculate your specific levy
     Content: Interactive calculator tool with personalized results
```

**Rule:** Each page should serve ONE primary intent. Different intents = different pages.

#### 2. Content Depth Stratification

**Use pillar/cluster model:**

```
PILLAR PAGE (2,000-3,000 words)
├─ Broad overview of topic
├─ Links to all child posts
├─ Moderate depth on each subtopic
└─ Acts as "hub" for internal linking

CLUSTER POSTS (800-1,500 words each)
├─ Deep-dive on one specific subtopic
├─ Links back to pillar
└─ Optimized for long-tail variations
```

**Example: Strata Levy Topic**

```
Pillar Page: /guides/strata-financial-management
  ├─ Overview of all financial topics
  ├─ Section on levies (200 words)
  └─ Link to cluster posts

Cluster Post 1: /blog/strata-levy-payment-plans-nsw
  ├─ Deep-dive: payment options (1,000 words)
  └─ Link back to pillar

Cluster Post 2: /blog/admin-fund-vs-capital-works-fund
  ├─ Deep-dive: fund types (1,000 words)
  └─ Link back to pillar

Tool: /tools/levy-calculator
  ├─ Interactive calculation (not text)
  └─ Links to blog posts for explanation
```

#### 3. Audience Differentiation

**Target different audience segments:**

| Page | Primary Audience | Secondary Audience | Angle |
|------|------------------|-------------------|-------|
| Blog: "AGM Guide" | Self-managed committees | Treasurer, minutes secretary | Practical how-to |
| Blog: "AGM Compliance" | Compliance officers | Risk-aware managers | Regulatory/legal |
| Pillar: "Self-Managed Guide" | New self-managed schemes | Committee members | Comprehensive overview |

**Rule:** If pages target the same keyword but different audiences, make the audience difference EXPLICIT in content.

**How:**

- Use different opening/framing
- Address different pain points
- Include audience-specific examples
- Call out differences: "Unlike hired managers, self-managed schemes need to..."

#### 4. Angle/Perspective Differentiation

**Create distinct content angles:**

```
Angle 1: Process-focused
  Title: "How to Run an AGM: Step-by-Step Guide"
  Focus: Procedures, checklist, timeline

Angle 2: Compliance-focused
  Title: "AGM Legal Requirements in NSW 2025"
  Focus: Legal obligations, penalties, regulations

Angle 3: Problem-solution-focused
  Title: "Common AGM Mistakes & How to Avoid Them"
  Focus: Problems, solutions, lessons learned

Angle 4: Role-specific
  Title: "Treasurer's Guide to AGM Financial Reports"
  Focus: Treasurer role, specific tasks, templates
```

**Rule:** Different angles serve different search intents. A user searching "how to run agm" (procedural) is different from "agm requirements nsw" (legal).

### Differentiation Checklist

Before publishing two similar pages, answer:

- [ ] **Different search intent?** (informational vs. transactional vs. commercial)
- [ ] **Different content depth?** (pillar vs. cluster vs. tool)
- [ ] **Different primary audience?** (and is it explicit in content?)
- [ ] **Different content angle?** (how-to vs. legal vs. problem-solution)
- [ ] **Different target keywords?** (minimal keyword overlap, max 30%)
- [ ] **Internal linking plan?** (clear connection between related pages)

**If you answered "NO" to 3+ questions → likely cannibalizing. Consider consolidation.**

---

## Consolidation Decision Criteria

Use this framework to decide whether to merge two competing pages or keep them separate.

### Decision Matrix

#### Keep Separate (Differentiate)

✅ **Consolidate only if:**

- Different search intents (informational vs. transactional)
- Different audience segments (self-managed vs. professional manager)
- Different content depth (pillar vs. blog post vs. tool)
- Distinct angles (how-to vs. legal vs. problem-solution)
- Minimal keyword overlap (< 30%)
- Clear internal linking strategy

**Score: 3+ YES → Keep separate**

#### Consolidate (Merge or Redirect)

⚠️ **Consolidate if:**

- Same primary keyword (80%+ overlap)
- Same search intent
- Same audience
- Similar content angle
- No clear differentiation path
- Both compete for same ranking position

**Score: 3+ YES → Consolidate**

### Scoring Sheet

Print and complete before deciding:

```
CONSOLIDATION DECISION SCORESHEET
==================================

Content 1: [page name]
Content 2: [page name]
Target Keyword: [shared keyword]

DIFFERENTIATION POTENTIAL (Score each 1-5)

1. Intent Difference
   How different are user search intents?
   1=identical | 5=completely different
   Score: ___

2. Audience Difference
   Do they serve different audience segments?
   1=identical | 5=completely different
   Score: ___

3. Content Depth Difference
   How different are word count/depth/comprehensiveness?
   1=identical | 5=completely different
   Score: ___

4. Angle/Perspective Difference
   How different is the content angle?
   1=identical | 5=completely different
   Score: ___

5. Keyword Overlap
   What % of keywords overlap?
   (Score: 5 if <20%, 4 if 20-40%, 3 if 40-60%, 2 if 60-80%, 1 if >80%)
   Overlap: __%
   Score: ___

TOTAL SCORE: ___ / 25

DECISION:
- Score 18+: KEEP SEPARATE (strong differentiation)
- Score 13-17: CONDITIONAL (differentiate before publishing)
- Score <13: CONSOLIDATE (merge or redirect)
```

### Consolidation Options

If consolidating, choose the best approach:

#### Option A: Merge Content

**Use when:** Older page has low traffic, newer page is more comprehensive

**Steps:**

1. Identify "primary" page (usually pillar or more comprehensive)
2. Extract unique value from "secondary" page
3. Merge key sections into primary page
4. 301 redirect secondary page to primary

**Example:**

```
Redirect: /blog/strata-levy-payment-plans-nsw
To: /guides/strata-financial-management#payment-plans
```

#### Option B: Cross-Link & Differentiate

**Use when:** Both pages serve distinct purposes but target overlapping keywords

**Steps:**

1. Add differentiation as per Content Differentiation Guidelines
2. Modify secondary keywords of one page
3. Add cross-links in both pages
4. Update Keyword Mapping Template

**Example:**

```
Before:
  Page 1: "How to Transition to Self-Managed Strata"
  Page 2: "Self-Managed Strata Guide"

After:
  Page 1: "How to Transition to Self-Managed Strata" (procedural/how-to)
  Page 2: "Self-Managed Strata Guide" (comprehensive overview)

Primary keyword change:
  Page 1: "how to transition self managed strata" (process-focused)
  Page 2: "self managed strata nsw" (general/overview)

Cross-links:
  Page 1 → Page 2: "For a complete overview of self-managed management, see our guide"
  Page 2 → Page 1: "Ready to transition? Follow our step-by-step process"
```

#### Option C: Create Landing Page Hub

**Use when:** Multiple related pages exist and need better organization

**Steps:**

1. Create pillar page (if not exists) as central hub
2. Make cluster pages child/supporting content
3. Pillar links to all cluster pages in introduction
4. Cluster pages link back to pillar

**Example:**

```
Pillar: /guides/2025-nsw-strata-reforms (NEW)
├── Child: /blog/financial-hardship-statement (existing)
├── Child: /blog/strata-levy-payment-plans (existing)
├── Child: /blog/strata-committee-training (existing)
└── Child: /blog/disclosure-of-insurance (existing)
```

---

## Resolution Action Playbook

Use this playbook to quickly resolve existing cannibalization conflicts identified through monitoring.

### Scenario 1: Two Blog Posts Targeting Same Keyword

**Situation:**
- Blog post A: "/blog/strata-agm-guide" ranks for "how to run agm"
- Blog post B: "/blog/agm-procedures-nsw" also targets "how to run agm"
- Both have 1,000 words, similar structure

**Resolution Steps:**

1. **Analyze:** Which page has better traffic/engagement?
   - Use Google Analytics (if available) or estimate
   - Higher traffic = keep this one

2. **Differentiate:** Modify the lower-traffic page

   **Option A:** Change angle
   ```
   Page A (keep): "How to Run an AGM: Step-by-Step Guide"
     └─ Primary keyword: "how to run agm"
     └─ Focus: Procedural/logistics

   Page B (modify): "AGM Legal Requirements & Compliance in NSW"
     └─ Primary keyword: "agm requirements nsw"
     └─ Focus: Regulatory/legal
   ```

   **Option B:** Change audience
   ```
   Page A (keep): "AGM Guide for Self-Managed Strata"
     └─ Audience: DIY committees

   Page B (modify): "AGM Guide for Professional Strata Managers"
     └─ Audience: managers/professionals
   ```

3. **Update Keywords:** Modify Page B's frontmatter
   ```yaml
   title: "AGM Legal Requirements & Compliance in NSW"
   description: "NSW legal requirements for strata AGMs..."
   category: "compliance"
   tags: ["agm-requirements", "agm-compliance", "nsw-regulations"]
   pillar: "nsw-strata-compliance"  # Move to compliance pillar
   ```

4. **Update Internal Links:** In Page A, add:
   ```markdown
   > For legal requirements, see [AGM Legal Requirements & Compliance in NSW](/blog/agm-legal-requirements).
   ```

5. **Update Keyword Mapping:** Edit Keyword Mapping Template

6. **Monitor:** Check rankings in 30 days for both keywords

### Scenario 2: Blog Post & Pillar Page Competition

**Situation:**
- Pillar Page: "/guides/nsw-strata-compliance" (2,500 words, links to 5 blog posts)
- Blog Post: "/blog/strata-compliance-checklist" (1,200 words, standalone)
- Both rank for "strata compliance nsw"

**Resolution Steps:**

1. **Assess Pillar Quality:** Is pillar page comprehensive?
   - If YES → Blog post is redundant. Use Merge Content approach.
   - If NO → Keep both, differentiate by intent.

2. **Merge Content (if pillar is comprehensive)**

   - Extract key unique points from blog post
   - Add to pillar as new section
   - 301 redirect blog post to pillar section anchor

   ```
   Add to /guides/nsw-strata-compliance:

   ## Strata Compliance Checklist
   [Merged content from /blog/strata-compliance-checklist]

   Then redirect:
   /blog/strata-compliance-checklist → /guides/nsw-strata-compliance#checklist
   ```

3. **Cross-Link (if keeping both)**

   ```
   In pillar (intro section):
   "Get a quick checklist of must-do compliance items in our [Strata Compliance Checklist](/blog/strata-compliance-checklist)."

   In blog post (end):
   "For a comprehensive guide, see our [Complete Strata Compliance Guide](/guides/nsw-strata-compliance)."
   ```

4. **Update Keyword Map:**
   ```
   /guides/nsw-strata-compliance: "strata compliance nsw" (pillar, broad)
   /blog/strata-compliance-checklist: "strata compliance checklist" (blog, specific tool)
   ```

5. **Monitor:** Track both keywords monthly

### Scenario 3: Tool Page & Blog Post Competition

**Situation:**
- Tool: "/tools/levy-calculator" targets "strata levy calculator"
- Blog: "/blog/how-to-calculate-strata-levies" targets "how to calculate strata levies"
- Users confused about which to use

**Resolution Steps:**

1. **Clarify Intent Difference**

   ```
   Tool Page: /tools/levy-calculator
   ├─ Intent: Transactional (DO the calculation)
   ├─ Primary keyword: "strata levy calculator"
   └─ CTA: Calculate now

   Blog Post: /blog/how-to-calculate-strata-levies
   ├─ Intent: Informational (LEARN how calculation works)
   ├─ Primary keyword: "how to calculate strata levies"
   └─ CTA: Learn more
   ```

2. **Optimize For Different Keywords**

   Blog post: "how to calculate," "calculate strata levies," "levy calculation method"
   Tool page: "strata levy calculator," "levy calculator tool," "calculate levies"

3. **Cross-Link Strategically**

   ```
   In blog post (opening):
   "Want to calculate your actual levy amount? Try our [free levy calculator](/tools/levy-calculator)."

   In tool page (below calculator):
   "Not sure how we calculate this? [Learn the math behind levy calculations](/blog/how-to-calculate-strata-levies)."
   ```

4. **Update Keyword Map:**
   ```
   /tools/levy-calculator: "strata levy calculator" (tool)
   /blog/how-to-calculate-strata-levies: "how to calculate strata levies" (educational)
   ```

5. **Monitor:** Track both keywords, click-through rates to each page

### Scenario 4: Multiple Suburb Pages Targeting Same Locality

**Situation:**
- Suburb page: "/strata-management/parramatta" targets "strata management parramatta"
- Blog post: "/blog/parramatta-strata-guide" also exists
- Both target same local audience

**Resolution Steps:**

1. **Consolidate Local Content**

   **Option A:** Merge into suburb page
   ```
   /strata-management/parramatta expands to include:
   - Local council info
   - Common issues
   - Local resources

   Redirect: /blog/parramatta-strata-guide → /strata-management/parramatta
   ```

   **Option B:** Keep suburb page generic, make blog post specific
   ```
   /strata-management/parramatta: Generic strata info for Parramatta
   /blog/parramatta-apartment-living-guide: Specific blog about Parramatta

   Primary keywords:
   - Suburb page: "strata management parramatta"
   - Blog post: "parramatta apartments strata"
   ```

2. **Cross-Link:**
   ```
   Suburb page → Blog post: "See our detailed guide on [Parramatta apartment living](...)"
   Blog post → Suburb page: "Check our [Parramatta strata management hub](...)"
   ```

3. **Update Keyword Map:** Assign different long-tail variations to each

4. **Monitor:** Track both keywords monthly in local search

### Scenario 5: Outdated Content vs. Updated Replacement

**Situation:**
- Old post: "/blog/2024-strata-levy-guide" (published Jan 2024)
- New post: "/blog/2025-strata-levy-guide" (published Jan 2025)
- Both rank for "strata levy guide"
- Old content still getting traffic

**Resolution Steps:**

1. **Assess Freshness Difference**

   - If old content is significantly outdated: Redirect
   - If old content has value for historical reasons: Keep + differentiate

2. **301 Redirect (if completely outdated)**

   ```
   /blog/2024-strata-levy-guide → /blog/2025-strata-levy-guide
   ```

   Update URL in all internal links.

3. **Differentiate (if both have value)**

   ```
   /blog/2024-strata-levy-guide
   ├─ Title: "Strata Levy Guide (2024): Historical Reference"
   ├─ Add banner: "This is our 2024 guide. See [2025 updates](/blog/2025-strata-levy-guide)"
   └─ Primary keyword: "strata levy guide 2024" (historical)

   /blog/2025-strata-levy-guide
   ├─ Title: "Strata Levy Guide 2025: Updated for NSW Changes"
   └─ Primary keyword: "strata levy guide 2025" (current)
   ```

   Cross-link prominently.

4. **Update Keyword Map:** Add year differentiation

5. **Monitor:** Check if old page traffic decreases after redirect

### Scenario 6: Near-Duplicate Content (Accidental)

**Situation:**
- Two blog posts created independently with 70%+ similar content
- Both good quality but too much overlap
- Example: Two guides on "Strata Committee Roles"

**Resolution Steps:**

1. **Assess Quality & Traffic**
   - Which page has better engagement/traffic?
   - Which is more recent/comprehensive?
   - Which serves a clearer audience?

2. **Keep the Better Page, Consolidate**

   ```
   Keep: /blog/strata-committee-roles-complete-guide (1,500 words, comprehensive)
   Merge: /blog/committee-positions-explained (1,200 words, simpler)

   Extract unique sections from "Merge" page
   Add to "Keep" page as new subsections
   ```

3. **Create Redirect**

   ```
   301 Redirect: /blog/committee-positions-explained
              → /blog/strata-committee-roles-complete-guide
   ```

4. **Update All Internal Links** to point to surviving page

5. **Monitor:** Ensure traffic consolidates after redirect (2-4 weeks)

### Scenario 7: Category Page Cannibalizing Blog Posts

**Situation:**
- Category page: "/blog/category/compliance" (lists all compliance posts)
- Individual blog posts also ranking for their specific keywords
- Category page competing for similar keywords as posts

**Resolution Steps:**

1. **Modify Category Page**

   ```
   Change category page focus:
   - Add intro explaining compliance category
   - List all posts in category
   - Use category page for broad keyword: "strata compliance blog"
   - Keep individual posts for specific keywords
   ```

2. **Differentiate Keywords**

   ```
   Category page: "strata compliance blog articles"
   Blog posts: Specific topics (registration, checklist, etc.)
   ```

3. **Update Metadata**

   Category page meta:
   ```
   title: "Strata Compliance Articles & Guides"
   description: "Collection of articles on NSW strata compliance requirements..."
   ```

4. **Internal Linking**

   Category page → lists with snippets + links to each post
   Posts → link back to category at the end

5. **Monitor:** Ensure category ranks for broad terms, posts for specific terms

---

## Monitoring & Maintenance

### Monthly Keyword Rank Check

**Frequency:** 1st of every month

**Process:**

1. **Create Monthly Checklist** (spreadsheet or doc)

   | Keyword | Target Page | Estimated Rank | Notes |
   |---------|-------------|-----------------|-------|
   | strata compliance nsw | /guides/nsw-strata-compliance | TBD | Monitor |
   | strata hub registration | /blog/strata-hub-registration | TBD | Monitor |

2. **Check Current Rankings**
   - Use `site:stratagenie.com.au [keyword]` in Google
   - Note top 3 results
   - If two StrataGenie pages rank together → cannibalization alert

3. **Document Findings**

   ```
   CANNIBALIZATION CHECK - January 2025

   Keyword: "strata levy calculator"
   Target page: /tools/levy-calculator
   Results:
   - Position 1: /tools/levy-calculator ✓
   - Position 3: /blog/how-to-calculate-strata-levies (ALERT)

   Status: INVESTIGATE
   Action: Check if blog post is differentiated enough
   ```

4. **Escalate Conflicts**
   - If two StrataGenie pages in top 3 → Run Consolidation Decision
   - If pages aren't differentiated → Apply resolution scenario

### Quarterly Content Audit

**Frequency:** Every 3 months (Jan, Apr, Jul, Oct)

**Process:**

1. **Review Content Inventory** in SEO.md
2. **Check for New Additions** since last audit
3. **Apply Pre-Publish Overlap Check** to any new content published without it
4. **Identify Potential Issues:**
   - Pages with very similar titles
   - Pages targeting same topic
   - Pages in same category with minimal differentiation

5. **Consolidate or Differentiate** as needed

6. **Update Keyword Mapping Template**

### Annual Content Strategy Review

**Frequency:** Once per year (December)

**Process:**

1. **Analyze Top Performers**
   - Which keywords drive most traffic?
   - Which pages have highest conversion rates?
   - Any unexpected wins?

2. **Identify Content Gaps**
   - Keywords we don't rank for
   - Competitor content we're missing
   - New topics in industry

3. **Consolidation Review**
   - Are we consolidating too much? (losing ranking potential)
   - Are we keeping too much separate? (diluting authority)
   - Any pages that should be merged?

4. **Update SEO Strategy** based on findings

---

## Quick Reference Checklists

### Before Publishing New Content

- [ ] Define primary + secondary keywords
- [ ] Search `site:stratagenie.com.au [keyword]` for existing content
- [ ] Check Keyword Mapping Template for conflicts
- [ ] Review pillar pages for related content
- [ ] Complete Consolidation Decision Scoresheet
- [ ] If keeping separate: Apply Content Differentiation Guidelines
- [ ] If consolidating: Choose merge, cross-link, or redirect option
- [ ] Update Keyword Mapping Template
- [ ] Add to SEO.md Content Inventory
- [ ] Publish with confidence!

### Detecting Cannibalization

- [ ] Two StrataGenie pages in top 5 SERP results for same keyword
- [ ] Similar content across multiple pages
- [ ] Low rankings despite high authority pages
- [ ] Traffic suddenly splitting between pages
- [ ] Google Search Console showing rank drops

### Fixing Cannibalization

- [ ] Run Consolidation Decision Scoresheet
- [ ] Choose resolution scenario (1-7 above)
- [ ] Execute steps (merge, redirect, cross-link, differentiate)
- [ ] Update Keyword Mapping Template
- [ ] Monitor for 30+ days
- [ ] Check traffic consolidation

---

## Files to Update

When implementing this framework, update these files:

| File | Change | When |
|------|--------|------|
| SEO.md | Add new content to Content Inventory | Every publish |
| SEO-CANNIBALIZATION-FRAMEWORK.md | Update Keyword Mapping Template | Monthly |
| Content frontmatter | Update keywords/pillar if consolidating | As needed |
| Internal links | Add cross-links between related pages | As needed |
| Redirects | Create 301 redirects for merged pages | On consolidation |

---

## Summary: When to Act

| Situation | Action | Urgency |
|-----------|--------|---------|
| Two pages targeting >80% same keywords | Consolidate | High |
| Two pages in SERP top 5 for same keyword | Audit immediately | High |
| New content published without overlap check | Check now | Medium |
| Old content + new content very similar | Merge or differentiate | Medium |
| Category page cannibalizing posts | Differentiate by keyword | Medium |
| Traffic splitting between similar pages | Check analytics | Medium |
| Outdated content still ranking | 301 redirect | Low |

---

**Remember:** Prevention is easier than cure. Always run the pre-publish overlap check before publishing. When in doubt, consolidate — it's easier to split later than to recover from ranking dilution.

**Last Updated:** 4 December 2025
**Framework Version:** 1.0
**Next Review:** 4 March 2026 (quarterly audit)
