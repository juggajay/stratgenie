# SEO Structure Quick Start Guide

**For:** StrataGenie Content Team
**Purpose:** Quick reference for implementing SEO best practices
**Last Updated:** December 4, 2025

---

## 1. Header Hierarchy (Golden Rule)

### One H1, Sequential H2 → H3 → H4

```
✅ CORRECT:
<h1>Page Main Topic</h1>
<h2>Main Section</h2>
<h3>Subsection</h3>
<h3>Another Subsection</h3>
<h2>Another Main Section</h2>

❌ WRONG:
<h1>Title 1</h1>
<h1>Title 2</h1> ← Multiple H1s
<h3>Subsection</h3> ← Skipped H2
```

### By Page Type

| Type | Pattern |
|------|---------|
| Blog Post | H1: Title → H2: Sections → H3: Points → FAQ (H3) |
| Pillar Guide | H1: Topic → H2: Deep sections → H3: Sub-topics |
| Tool Page | H1: Tool name → H2: How to use → H3: Steps |
| Landing Page | H1: Category → H2: Topic clusters → H3: Items |

---

## 2. Content Silos (5 Main Clusters)

Link related content together. Each silo has a pillar page that all sub-pages link to and from.

```
SILO 1: Compliance
  Pillar: /guides/nsw-strata-compliance
  ├─ /blog/strata-hub-registration-guide
  ├─ /blog/how-to-run-agm-self-managed-strata
  ├─ /blog/strata-committee-mandatory-training-nsw
  ├─ /blog/strata-levy-payment-plans-nsw
  └─ /tools/compliance-health-check

SILO 2: Finance
  Pillar: /guides/strata-financial-management
  ├─ /blog/admin-fund-vs-capital-works-fund
  ├─ /blog/strata-levy-payment-plans-nsw
  └─ /tools/levy-calculator

SILO 3: Maintenance
  Pillar: /guides/maintenance-asset-management
  ├─ /blog/strata-maintenance-responsibilities
  └─ [Add more articles]

SILO 4: 2025 Reforms
  Pillar: /guides/2025-nsw-strata-reforms
  ├─ /blog/strata-committee-training-nsw
  └─ [Add more articles]

SILO 5: Suburbs (Local)
  Hub: /strata-management
  ├─ /strata-management/sydney
  ├─ /strata-management/north-sydney
  └─ [100+ suburbs...]
```

**Linking Rule:** All articles in a silo link back to the pillar. Pillar links to all articles.

---

## 3. Internal Linking (Do's and Don'ts)

### DO's

✅ Link back to pillar from every sub-page
✅ Link between related articles (in same silo)
✅ Use descriptive anchor text: "Learn about AGM requirements" (not "click here")
✅ Include 1 tool link per article (where relevant)
✅ Link to 1 cross-silo page (max)

### DON'Ts

❌ Link to unrelated content
❌ Use keywords as anchor text (use descriptive text)
❌ Create too many links (3-5 per 1,500 words)
❌ Link to low-quality pages
❌ Link to pages still in draft/noindex

### Anchor Text Examples

```
❌ "strata compliance" ← Exact match (overused)
❌ "click here" ← Vague
✅ "Learn about NSW strata compliance" ← Descriptive
✅ "Complete compliance guide" ← Action-oriented
✅ "See how AGM requirements work" ← Specific
```

---

## 4. Schema Markup (Priority Order)

### MUST HAVE (Already Implemented)

- [ ] **Organization** - On every page (company info)
- [ ] **BreadcrumbList** - On every page (navigation path)
- [ ] **Article** - On blog posts (rich snippet)
- [ ] **WebPage** - On guides/tools (page structure)
- [ ] **FAQPage** - On pages with FAQ sections

### SHOULD ADD (Q1 2026)

- [ ] **HowTo** - On how-to articles (5+ steps)
- [ ] **LocalBusiness** - On suburb pages
- [ ] **ImageObject** - On featured images

### NICE-TO-HAVE (Later)

- [ ] **Person/Author** - If adding team bios
- [ ] **VideoObject** - If adding videos
- [ ] **NewsArticle** - If adding news/updates

**Test here:** https://schema.org/validator

---

## 5. Table of Contents (For Long Content)

### When to Add

- Pillar guides (5,000+ words)
- How-to articles (10+ steps)
- Comparison pages (4+ sections)
- Reference pages

### Example Format

```markdown
## Table of Contents

1. [First Section](#first-section)
2. [Second Section](#second-section)
   - [Subsection 2.1](#subsection-21)
   - [Subsection 2.2](#subsection-22)
3. [Third Section](#third-section)

---

## First Section
...content...

## Second Section
...content...

### Subsection 2.1
...content...
```

### Anchor Rules

```
"NSW Strata Compliance" → #nsw-strata-compliance
"What's Changed?" → #whats-changed
"Admin Fund vs Capital Works Fund" → #admin-fund-vs-capital-works-fund

❌ "NSW Strata Compliance!!!" → Special chars removed
❌ "NSW STRATA" → Use lowercase
❌ Multiple hyphens → Single hyphen
```

---

## 6. Frontmatter Template (Blog Posts)

```yaml
---
title: "Exact Title Here (50-60 chars) | Keyword Included"
description: "Meta description (under 160 chars, compelling CTA)"
publishedAt: "2025-01-15"
updatedAt: "2025-01-15"
category: "compliance" # or "financial", "maintenance", "news"
tags: ["tag1", "tag2", "tag3", "related-keyword"]
pillar: "nsw-strata-compliance" # or other silo
author: "StrataGenie Team"
readingTime: "7 min read" # Calculate: ~200 words per minute
featured: false
image: "/images/blog/article-image.jpg"
imageAlt: "Descriptive alt text for image"
---
```

---

## 7. SEO Checklist (Before Publishing)

- [ ] **Title** - Under 60 characters, includes primary keyword
- [ ] **Meta Description** - Under 160 characters, compelling, includes secondary keyword
- [ ] **Headers** - One H1, sequential H2→H3→H4, no skipped levels
- [ ] **Keyword Usage** - Natural placement (intro, headers, conclusion)
- [ ] **Silo Assignment** - Assigned to correct silo/pillar
- [ ] **Pillar Link** - Linked to relevant pillar page
- [ ] **Related Links** - 2-3 contextual links to related articles
- [ ] **Schema** - Appropriate schema markup added (Article, HowTo, etc.)
- [ ] **Image** - High quality, alt text included
- [ ] **TOC** - Added if content exceeds 2,500 words
- [ ] **Anchor Text** - All links use descriptive anchor text
- [ ] **Spelling** - Proofread
- [ ] **Mobile Test** - Looks good on mobile
- [ ] **Broken Links** - All internal links work

---

## 8. Common Page Patterns

### Blog Post Structure

```markdown
# [H1] Title: Problem/Solution + Keyword

[Brief intro - 100-150 words explaining what you'll cover]

## [H2] Context/Why This Matters

[Section content]

## [H2] Main Topic Section 1

[Content]

### [H3] Sub-point 1.1
### [H3] Sub-point 1.2

## [H2] Main Topic Section 2

[Content]

### [H3] Sub-point 2.1

## [H2] Key Takeaways

[Bullet points with actionable next steps]

## [H2] Frequently Asked Questions

### [H3] Question 1?
### [H3] Question 2?

[CTA Section]

[Related Articles Section]
```

### Pillar Guide Structure

```markdown
# [H1] Comprehensive Topic Title | Complete Guide

[Hero section with overview]

## [H2] Quick Overview

[Key requirements/overview cards]

## [H2] Deep Topic 1

### [H3] Subtopic 1a
### [H3] Subtopic 1b

## [H2] Deep Topic 2

### [H3] Subtopic 2a
### [H3] Subtopic 2b

## [H2] Timeline/Calendar

[Table or timeline visualization]

## [H2] Frequently Asked Questions

### [H3] Question 1?
### [H3] Question 2?

## [H2] Tools & Resources

[Links to relevant tools and guides]

[CTA Section]

[Related Articles Section]
```

---

## 9. Keyword Strategy

### By Silo

| Silo | Primary Keyword | Secondary Keywords |
|------|-----------------|-------------------|
| Compliance | "NSW strata compliance" | "compliance requirements", "Strata Hub", "AGM" |
| Finance | "strata financial management" | "levies", "levy calculation", "capital works" |
| Maintenance | "strata maintenance" | "capital works plan", "repairs", "maintenance fund" |
| 2025 Reforms | "2025 NSW strata reforms" | "new rules", "requirements", "changes" |
| Suburb | "[Suburb] strata management" | "strata [suburb]", "self-managed strata" |

### On-Page Keyword Placement

1. **Title** (Include primary keyword)
2. **Meta Description** (Include secondary keyword)
3. **H1** (Include primary keyword, naturally)
4. **First paragraph** (Within 100 words)
5. **First H2** (Include if natural)
6. **Throughout content** (2-3% keyword density)
7. **Conclusion** (Reinforce main topic)

---

## 10. Performance Tracking

### What to Monitor Monthly

1. **Google Search Console**
   - Impressions (aim: +10% per month)
   - Click-through rate (aim: +5% per month)
   - Average position (aim: top 20)

2. **Google Analytics**
   - Organic traffic (baseline metric)
   - Sessions per user (aim: +20%)
   - Pages per session (aim: +15%)

3. **Rankings**
   - Pillar pages in top 5 (for main keyword)
   - 50+ pages in top 20
   - 5+ featured snippets

4. **Technical**
   - Core Web Vitals (all green)
   - Mobile usability (no errors)
   - Crawl errors (zero)

---

## Quick Decisions

### When writing new content, ask:

1. **Which silo does this belong to?**
   → Link to that pillar page

2. **Are there existing related articles?**
   → Link to 2-3 of them

3. **Does this have 5+ steps or 2,500+ words?**
   → Add table of contents

4. **Are there 3+ questions?**
   → Add FAQ schema markup

5. **What's the primary keyword?**
   → Include in title, H1, first paragraph

---

## Resources

- **Full Framework:** `/SEO-STRUCTURE-FRAMEWORK.md`
- **Schema Testing:** https://schema.org/validator
- **SEO Testing:** Google Search Console, Lighthouse
- **Content Research:** Google Search, Answer the Public

---

**Last Updated:** December 4, 2025
**Next Review:** January 15, 2026
