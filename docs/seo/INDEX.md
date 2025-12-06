# StrataGenie SEO Documentation

Complete SEO system covering content creation, meta optimization, and authority building.

---

## Quick Navigation

| I want to... | Read this |
|--------------|-----------|
| Write a blog article | [content-guidelines.md](./content-guidelines.md) |
| Optimize title/description | [meta-quick-reference.md](./meta-quick-reference.md) |
| Plan content strategy | [content-planner-framework.md](./content-planner-framework.md) |
| Build authority (E-E-A-T) | [EEAT-FRAMEWORK.md](./EEAT-FRAMEWORK.md) |
| See a real example | [content-example-walkthrough.md](./content-example-walkthrough.md) |

---

## Documentation Structure

### 1. Content Writing (For Writers)
How to write SEO-optimized articles.

| File | Purpose |
|------|---------|
| `content-guidelines.md` | Complete writing style guide (~1,200 lines) |
| `content-quick-reference.md` | Writer's cheat sheet - hooks, structure, CTAs |
| `content-example-walkthrough.md` | Step-by-step article creation example |
| `content-master-index.md` | Master index for content documentation |

### 2. Meta Optimization (For Developers)
Title tags, descriptions, URLs, technical SEO.

| File | Purpose |
|------|---------|
| `meta-optimization-guide.md` | Complete methodology (~3,000 words) |
| `meta-quick-reference.md` | Cheat sheet - formulas, power words, CTAs |
| `implementation-checklist.md` | 4-week execution plan |
| `meta-readme.md` | Guide to meta optimization system |
| `meta-index.md` | Complete index of meta docs |

**Code utilities:** `lib/seo/meta-templates.ts` - TypeScript functions

### 3. Content Strategy (For Planners)
Topic clusters, content calendars, agent coordination.

| File | Purpose |
|------|---------|
| `content-planner-framework.md` | Master strategy document (~1,158 lines) |
| `agents-integration-guide.md` | 9-agent workflow for content |
| `framework-quick-reference.md` | Field guide & checklists |
| `example-cluster.md` | Real-world topic cluster example |
| `framework-readme.md` | Navigation for framework docs |

### 4. Authority Building (E-E-A-T)
Experience, Expertise, Authoritativeness, Trustworthiness.

| File | Purpose |
|------|---------|
| `EEAT-FRAMEWORK.md` | Complete E-E-A-T implementation guide |
| `topical-authority-roadmap.md` | 12-month content production plan |
| `QUICK-REFERENCE.md` | E-E-A-T checklist for writers |
| `README.md` | Overview of E-E-A-T documentation |

---

## Code Files (lib/seo/)

Production code used by the application:

| File | Purpose |
|------|---------|
| `constants.ts` | SEO configuration (site URL, keywords) |
| `metadata.ts` | Metadata generation utilities |
| `schemas.ts` | JSON-LD schema markup |
| `meta-templates.ts` | Title/description template functions |

```typescript
// Usage example
import { titleTemplates, descriptionTemplates } from '@/lib/seo/meta-templates';

const title = titleTemplates.featureBenefitBrand({
  featureName: "AGM Compliance",
  valueProp: "Never Miss Deadlines"
});
```

---

## Quick Start by Role

### Content Writer
1. Read `content-guidelines.md` (style guide)
2. Keep `content-quick-reference.md` open while writing
3. Follow `content-example-walkthrough.md` for first article

### Developer
1. Import from `lib/seo/meta-templates.ts`
2. Reference `meta-quick-reference.md` for formulas
3. Follow `implementation-checklist.md` for full optimization

### Content Strategist
1. Read `content-planner-framework.md` (topic clusters)
2. Use `agents-integration-guide.md` for workflow
3. Follow `example-cluster.md` pattern

### SEO Lead
1. Review `EEAT-FRAMEWORK.md` (authority strategy)
2. Plan with `topical-authority-roadmap.md`
3. Monitor using checklists

---

## Key Formulas

### Title Tag
```
[Primary Keyword] | [Value Prop] | StrataGenie
```
50-60 characters • Brand last • Max 2 keywords

### Meta Description
```
[Hook/Problem] [Solution] [Proof] [CTA]
```
150-160 characters • Include social proof • End with CTA

### Article Hook (5 patterns)
1. Problem-Solution: `[Problem] + [Promise] + [Context]`
2. Authority-Urgency: `[Requirement] + [Stakes] + [Guide provides]`
3. Confusion-Clarity: `[Confusion] + [Why] + [Promise clarity]`
4. Statistics-Stakes: `[Stat] + [Meaning] + [Coverage]`
5. Empowerment: `[Current state] + [Transformation] + [How]`

---

## File Count Summary

| Category | Files | ~Lines |
|----------|-------|--------|
| Content Writing | 4 | 3,500 |
| Meta Optimization | 5 | 5,500 |
| Content Strategy | 5 | 3,700 |
| Authority (E-E-A-T) | 4 | 2,500 |
| **Total Docs** | **18** | **~15,000** |
| Code (lib/seo/) | 4 | ~800 |

---

*Last updated: January 2025*
