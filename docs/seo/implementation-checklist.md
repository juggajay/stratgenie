# SEO Meta Optimization Implementation Checklist

**For: StrataGenie Team**
**Purpose: Ensure consistent, optimized metadata across all pages**

---

## Quick Start (First 24 Hours)

- [ ] Read `META_OPTIMIZATION_GUIDE.md` (15 min)
- [ ] Import `meta-templates.ts` into your project
- [ ] Audit current homepage metadata using Google Search Console
- [ ] Create 3 alternative title/description pairs for homepage
- [ ] Test alternatives using Google's SERP simulator
- [ ] Document A/B test hypothesis

---

## Phase 1: Foundation (Week 1)

### 1.1 Homepage Optimization

**File:** `app/page.tsx` → metadata export

```typescript
// Current (baseline)
title: "StrataGenie | AI-Powered Strata Compliance Copilot for NSW"
description: "Stay compliant, avoid penalties, and simplify strata admin..."

// Optimized (variant A)
title: "Strata Compliance Made Easy | AI Agents | StrataGenie"
description: "Automate AGM compliance, Strata Hub tracking & deadline alerts. Join 500+ NSW schemes. No credit card required. Start free today."
```

**Tasks:**
- [ ] Copy current metadata to spreadsheet
- [ ] Generate 2 alternative versions using templates
- [ ] Check character counts (title: 50-60, desc: 150-160)
- [ ] Run through `validateMetadata()` function
- [ ] Document baseline metrics from Google Search Console

### 1.2 Feature Pages (4 agents)

**Pages:**
- [ ] `/agents/secretary`
- [ ] `/agents/treasurer`
- [ ] `/agents/guardian`
- [ ] `/agents/postman`

**For each page:**
- [ ] Use `titleTemplates.featureBenefitBrand()`
- [ ] Use `descriptionTemplates.featureBenefitProof()`
- [ ] Include agent-specific power words (from `powerWords` object)
- [ ] Add OpenGraph image (1200x630px)
- [ ] Validate with checker

**Example (Secretary):**
```typescript
title: "AI Secretary Agent | Auto-Draft AGM Notices | StrataGenie"
description: "AI Secretary handles AGM deadlines, drafts compliant notices, sends reminders & generates minutes. 99% accuracy. 24/7 availability. Start free."
```

### 1.3 Tools Pages (3 tools)

**Pages:**
- [ ] `/tools/levy-calculator`
- [ ] `/tools/compliance-health-check`
- [ ] `/tools/strata-roll-template`

**For each page:**
```typescript
// Use toolOutcome template
titleTemplates.toolOutcome({ featureName: "Levy Calculator", benefit: "Save Hours Monthly" })

// Use featureBenefitProof template
descriptionTemplates.featureBenefitProof({
  featureName: "Levy Calculator",
  benefit: "saves hours on manual calculations",
  socialProof: "Used by 5,000+ lot owners",
  cta: "Try now"
})
```

**Tasks:**
- [ ] Create title for each (under 60 chars)
- [ ] Create description for each (150-160 chars)
- [ ] Include "free" keyword (high-intent)
- [ ] Add specific CTA (not "Learn more")
- [ ] Create unique OG image for each

---

## Phase 2: Content Expansion (Week 2-3)

### 2.1 Guides (5 guides)

**Pages:**
- [ ] `/guides/agm-compliance-checklist`
- [ ] `/guides/nsw-strata-reforms-2025`
- [ ] `/guides/strata-financial-management`
- [ ] `/guides/transition-to-self-managed`
- [ ] `/guides/maintenance-asset-management`

**Template:**
```typescript
// Use numberDriven or problemSolution
titleTemplates.numberDriven({
  metric: "10 Essential",
  valueProp: "AGM Compliance Tips"
})

// Use questionAnswer pattern
descriptionTemplates.questionAnswer({
  problem: "When is your AGM due",
  solution: "Our comprehensive guide covers notice periods, voting rules & minutes templates",
  benefit: "everything a self-managed scheme needs",
  cta: "Read free guide"
})
```

**Checklist per guide:**
- [ ] Title: 50-60 chars, includes year/number if relevant
- [ ] Description: 150-160 chars, includes benefit + free
- [ ] Keywords: 2-3 target keywords naturally integrated
- [ ] OG image: 1200x630px with guide theme
- [ ] CTA in description: "Read guide," "Download," "Learn"
- [ ] Slug: kebab-case, includes primary keyword

### 2.2 Blog Posts (Existing + New)

**Existing posts to optimize:**
- [ ] `/blog/2025/01/agm-notice-requirements`
- [ ] `/blog/2025/01/strata-hub-registration-guide`
- [ ] `/blog/2025/01/strata-committee-mandatory-training-nsw`
- [ ] + others in `/content/blog/`

**For each post:**
- [ ] Use `blogPost` slug template (if slug needs updating)
- [ ] Generate title using `titleTemplates.problemSolution()` or `emotionalHook`
- [ ] Create description using `descriptionTemplates.problemSolveProof()`
- [ ] Include publication date in metadata
- [ ] Add author/publisher info
- [ ] Validate metadata

**Template:**
```typescript
// Title
titleTemplates.problemSolution({
  problem: "Confused about AGM notices",
  solution: "Learn NSW requirements"
})

// Description
descriptionTemplates.problemSolveProof({
  problem: "Unsure how to draft compliant AGM notices",
  solution: "Our guide explains NSW notice periods, voting rules & templates",
  socialProof: "Read by 5,000+ committee members",
  cta: "Read article"
})
```

**Checklist:**
- [ ] Title: 50-60 chars
- [ ] Description: 150-160 chars
- [ ] Article metadata: publishedTime, authors, keywords
- [ ] OG image: 1200x630px
- [ ] Keywords in first 100 words of content
- [ ] Internal links to relevant tools/guides

---

## Phase 3: Location Pages (Week 3-4)

### 3.1 Suburb Pages

**Pages:** All in `/strata-management/[suburb]/`

Examples:
- [ ] `/strata-management/sydney`
- [ ] `/strata-management/bondi`
- [ ] `/strata-management/manly`
- [ ] `/strata-management/surry-hills`
- [ ] + 20+ more suburbs (check `/public/data/suburbs.json`)

**Template (hyper-local):**
```typescript
// Use locationService template
titleTemplates.locationService({
  primaryKeyword: "Strata Management Software",
  location: "Bondi"
})

// Use locationSpecific description
descriptionTemplates.locationSpecific({
  location: "Bondi",
  benefit: "Save $2,000+/year avoiding traditional managers",
  solution: "AI compliance, AGM automation, Strata Hub exports",
  cta: "Start free trial"
})
```

**Result:**
```
Title: "Strata Management Software in Bondi | StrataGenie"
Description: "Bondi schemes save $2,000+/year. AI compliance, AGM automation, Strata Hub ready. Start free."
```

**Bulk Implementation:**
- [ ] Use location data from `suburbs.json` to auto-generate
- [ ] Validate all titles are unique
- [ ] Validate all descriptions are unique
- [ ] Test 5 randomly selected pages for proper OG images
- [ ] Check mobile truncation (title: 35 chars, desc: 120 chars)

---

## Phase 4: A/B Testing (Ongoing)

### 4.1 Test Planning

**Identify top 5 low-CTR pages from GSC:**
- [ ] Homepage (if under 8% CTR)
- [ ] Top tool page (if under 5% CTR)
- [ ] Top guide (if under 3% CTR)
- [ ] Blog category page
- [ ] One location page

### 4.2 Test Documentation

**For each test, create spreadsheet with:**

| Element | Current (A) | Variant B | Variant C | Duration | Winner |
|---------|-------------|-----------|-----------|----------|--------|
| Homepage Title | Current | Benefit-focused | Urgency | 2 weeks | TBD |
| Homepage Desc | Current | Social proof | Numbers | 2 weeks | TBD |
| Tool Title | Current | Outcome-focused | Free emphasis | 2 weeks | TBD |

### 4.3 Testing Cycle

**Week 4:**
- [ ] Implement variant B on Test 1
- [ ] Run for 14 days
- [ ] Collect GSC data daily
- [ ] Document daily impressions/clicks/CTR

**Week 5:**
- [ ] Analyze variant B results
- [ ] Create variant C (new challenger)
- [ ] Implement variant C if B won
- [ ] Start new test on different page

**Template for tracking:**
```
## Test #1: Homepage Description - Emotional Angle
- **Start:** Jan 20, 2025
- **End:** Feb 3, 2025
- **Metric:** CTR

| Version | Impressions | Clicks | CTR | Winner |
|---------|---|---|---|---|
| A (Current) | 12,000 | 650 | 5.4% | Control |
| B (Relief angle) | 12,100 | 720 | 5.95% | ✓ (10% lift) |
| C (Scarcity) | 11,900 | 680 | 5.7% | N/A |

**Conclusion:** Implement B; test vs new challenger in 2 weeks
```

---

## Phase 5: Monitoring & Maintenance (Ongoing)

### 5.1 Monthly Audit

**First of every month:**
- [ ] Pull GSC data for all public pages
- [ ] Identify top 5 pages by CTR
- [ ] Identify bottom 5 pages by CTR
- [ ] Flag any duplicate titles/descriptions
- [ ] Check for pages missing metadata
- [ ] Review any new pages added

**Spreadsheet template:**
```
| URL | Impressions | Clicks | CTR | Previous CTR | Change | Action |
|---|---|---|---|---|---|---|
| / | 5000 | 350 | 7.0% | 5.2% | +34% | Keep & monitor |
| /tools/levy | 1200 | 42 | 3.5% | 4.1% | -14% | A/B test |
| /blog/2025/01/agm | 800 | 15 | 1.9% | 2.0% | -5% | Monitor |
```

### 5.2 Quarterly Deep Dive

**Every 3 months (Jan, Apr, Jul, Oct):**
- [ ] Review this guide for updates
- [ ] Analyze winning A/B tests
- [ ] Update power words list based on performance
- [ ] Check competitor titles (benchmark)
- [ ] Plan next 3 months of optimizations
- [ ] Update changelog at bottom of guide

### 5.3 Annual Review

**Every year (January):**
- [ ] Review all metadata for freshness (dates, stats, etc.)
- [ ] Update year references (e.g., "2025" → "2026")
- [ ] Analyze full year of CTR data
- [ ] Create new testing plan based on learnings
- [ ] Update power words / emotional triggers based on performance

---

## Quality Assurance Checklist

### Pre-Publication Validation

**For every new/updated page:**

- [ ] **Title:**
  - [ ] 50-60 characters
  - [ ] Includes primary keyword
  - [ ] Brand name included (except homepage)
  - [ ] Unique (no duplicates in site)
  - [ ] No keyword stuffing
  - [ ] Title case capitalization

- [ ] **Description:**
  - [ ] 150-160 characters
  - [ ] Starts with hook/benefit
  - [ ] Includes social proof (stat or metric)
  - [ ] Ends with clear CTA
  - [ ] Unique (no duplicates in site)
  - [ ] No keyword stuffing
  - [ ] Passes `validateMetadata()` check

- [ ] **URL/Slug:**
  - [ ] Lowercase only
  - [ ] Hyphens for word breaks
  - [ ] Descriptive (human-readable)
  - [ ] No dates (unless evergreen)
  - [ ] Under 75 characters
  - [ ] Matches slug template format

- [ ] **OpenGraph:**
  - [ ] OG title present (150 chars max)
  - [ ] OG description present (160 chars max)
  - [ ] OG image present (1200x630px)
  - [ ] OG URL correct (full canonical URL)
  - [ ] Type correct (article, website, etc.)

- [ ] **Twitter Card:**
  - [ ] Card type: `summary_large_image`
  - [ ] Title present
  - [ ] Description present
  - [ ] Image present (1200x630px)

- [ ] **Structured Data:**
  - [ ] Schema.org markup appropriate for page type
  - [ ] JSON-LD format used
  - [ ] Validation passes schema checker

- [ ] **Mobile Preview:**
  - [ ] Title not truncated (under 35 chars on mobile)
  - [ ] Description not truncated (under 120 chars on mobile)
  - [ ] OG image displays correctly

### Content QA

- [ ] Content matches metadata promises
- [ ] Primary keyword in first 100 words
- [ ] H1 tag matches or closely related to title
- [ ] Internal links to related pages included
- [ ] External links to authoritative sources
- [ ] No spelling/grammar errors in metadata

---

## Common Mistakes to Avoid

| Mistake | Why Bad | Fix |
|---------|--------|-----|
| "Home" as title | Generic, no keywords | "Strata Compliance Made Easy \| StrataGenie" |
| Same description on multiple pages | Duplicate content | Create unique descriptions per page |
| No CTA in description | Low engagement | Always end with "Start free," "Learn more," etc. |
| Title with exact keyword 3x | Keyword stuffing | Use variations and natural language |
| URL with date (blog only) | Pages age artificially | Use dates only for blog/news content |
| OG image missing | Social shares look broken | Create/upload OG image per page |
| Description under 120 chars | Incomplete information | Expand to at least 150 chars |
| Title under 30 chars | Too short, looks incomplete | Expand to 50-60 range |
| Special characters/emoji | Encoding issues on Google | Use plain ASCII text only |
| "Click here" as CTA | Weak, not specific | Use "Start free," "Download," "Learn" |

---

## Tools & Resources

### Google Tools
- **Search Console:** Impressions, clicks, CTR by page
- **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly
- **Rich Results Test:** https://search.google.com/test/rich-results
- **SERP Simulator:** Google's preview of how title/desc appear

### Third-Party Tools
- **Yoast SEO Analyzer:** Quick metadata quality check
- **SEMrush:** Competitor title/description analysis
- **Ahrefs:** Backlink & keyword research
- **Lighthouse:** Page performance scoring

### Our Tools
- **`meta-templates.ts`:** TypeScript templates & validators
- **`validateMetadata()`:** Quick quality checker
- **`charUtils`:** Character counting & truncation helpers

### Resources
- **SEO Guide:** `lib/seo/META_OPTIMIZATION_GUIDE.md`
- **Power Words List:** In `meta-templates.ts` → `powerWords` object
- **A/B Testing Framework:** See Testing section above

---

## Team Roles & Responsibilities

| Role | Responsibility | Tools |
|------|---|---|
| **Product Manager** | Define page priorities, strategy | Spreadsheet, roadmap |
| **Content Lead** | Write/review metadata, manage docs | META_OPTIMIZATION_GUIDE.md |
| **Developer** | Implement in code, maintain templates | meta-templates.ts, IDE |
| **SEO Lead** | Monitor GSC, run tests, optimize | Google Search Console, test tracker |

---

## Success Metrics

### Month 1 Goals
- [ ] 90% of public pages have validated metadata
- [ ] All critical pages (home, tools, guides) optimized
- [ ] Baseline GSC metrics documented
- [ ] 3 A/B tests planned

### Month 2 Goals
- [ ] +15% CTR on 2 winning A/B tests
- [ ] All blog posts optimized
- [ ] 5+ location pages tested and ranked

### Month 3 Goals
- [ ] +25% organic traffic YoY
- [ ] +35% CTR improvement on optimized pages
- [ ] 10+ completed A/B tests
- [ ] Documented playbook for future pages

### Q1 Goals
- [ ] 500,000+ monthly organic impressions (GSC)
- [ ] 8%+ average CTR across all pages
- [ ] Page 1 rankings for 20+ keywords
- [ ] 30% of site traffic from organic search

---

## Approval & Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Product Manager** | [Name] | [ ] | [ ] |
| **SEO Lead** | [Name] | [ ] | [ ] |
| **Content Lead** | [Name] | [ ] | [ ] |
| **Engineering Lead** | [Name] | [ ] | [ ] |

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | Jan 2025 | Initial checklist: 5 phases, QA guidelines, testing framework |
| --- | --- | --- |

---

**Last Updated:** January 2025
**Next Review:** April 2025
**Contact:** SEO@stratagenie.app

---

## Appendix: Quick Reference Links

- [SEO Optimization Guide](./META_OPTIMIZATION_GUIDE.md)
- [Meta Templates (TypeScript)](./meta-templates.ts)
- [Google Search Console](https://search.google.com/search-console)
- [Google SERP Simulator](https://search.google.com/test/mobile-friendly)
- [Yoast SEO Checker](https://yoast.com/seo-checker/)
