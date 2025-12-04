# SEO Cannibalization Prevention - Quick Start Guide

**TL;DR version of the framework. Print or bookmark this.**

---

## What is Cannibalization?

Multiple pages competing for the same keyword = fragmented rankings. Bad.

**Example:**
- Page A ranks #7 for "strata compliance"
- Page B ranks #9 for "strata compliance"
- Neither ranks in top 5 (where the traffic is)
- If merged, one could rank #2-3

**Fix it:** Consolidate, differentiate, or redirect.

---

## Decision Tree: Keep Separate or Consolidate?

```
Do you have two similar pages targeting the same keyword?

    ├─ Does Page A have higher traffic/engagement?
    │   └─ YES → Keep Page A, consolidate Page B into it
    │
    ├─ Can you differentiate them (different intent, audience, angle)?
    │   └─ YES → Keep separate + cross-link
    │   └─ NO → Consolidate
    │
    └─ > 80% keyword overlap?
        └─ YES → Must consolidate
        └─ NO → Can keep separate if differentiated
```

---

## 5-Minute Pre-Publish Checklist

Before publishing ANY new content:

1. **Search Google** for your primary keyword
   - Are there existing StrataGenie pages in top 10?
   - Yes → Check overlap (below)

2. **Check Keyword Mapping Template** in SEO-CANNIBALIZATION-FRAMEWORK.md
   - Is your keyword already assigned to another page?
   - Yes → It's a conflict

3. **Assess Overlap**
   - Same keyword? (80%+ overlap)
     - YES → Consolidate ❌ Don't publish independently
     - NO → Can differentiate ✅
   - Different search intent? (informational vs. transactional)
     - YES → Keep separate ✅
     - NO → Consolidate ❌

4. **Make Decision**
   - [ ] Proceed (low overlap, different intent)
   - [ ] Modify (change keywords/angle/audience)
   - [ ] Consolidate (merge with existing page)

5. **Document & Update**
   - Add to Keyword Mapping Template
   - Plan internal links
   - Hit publish

---

## 3 Quick Fixes for Common Cannibalization

### Fix 1: Two Blog Posts, Same Topic

**Problem:** `/blog/agm-guide` and `/blog/how-to-run-agm` both rank for "how to run agm"

**Quick Fix (30 mins):**

1. Delete or redirect the weaker page
   ```
   301 Redirect: /blog/how-to-run-agm → /blog/agm-guide
   ```

2. Keep the better-traffic page
3. Done

**Or, if both are good quality:**

- Change one keyword: `/blog/how-to-run-agm` becomes "agm procedures for self-managed strata"
- Add cross-link at bottom of each post
- Monitor

### Fix 2: Blog Post vs. Pillar Page Conflict

**Problem:** Blog post and pillar page both ranking for same keyword

**Quick Fix (1 hour):**

1. Check: Is pillar comprehensive?
   - YES → Add blog post content to pillar, 301 redirect blog
   - NO → Keep both, add cross-links, change blog keyword

2. If keeping both:
   - Pillar: "Strata Compliance Guide" → broad keyword
   - Blog: "Strata Compliance Checklist" → specific keyword
   - Add links in both directions

3. Monitor rankings

### Fix 3: Tool vs. Blog Post Conflict

**Problem:** `/tools/levy-calculator` and `/blog/how-to-calculate-levies` both ranking

**Quick Fix (45 mins):**

1. Differentiate by search intent:
   - **Tool page:** "I want to CALCULATE my levy" (transactional)
   - **Blog post:** "I want to LEARN how to calculate" (informational)

2. Assign different keywords:
   - Tool: "strata levy calculator" (transactional intent)
   - Blog: "how to calculate strata levies" (informational intent)

3. Cross-link:
   - Blog → Tool: "Try our calculator"
   - Tool → Blog: "Learn how we calculate"

4. Monitor and validate

---

## When to Act (Urgency Levels)

### 🔴 DO THIS TODAY

- Two StrataGenie pages in Google top 5 for same keyword
- Same page title as existing page
- Exact duplicate content exists
- Major ranking drop for previously ranking page

**Action:** Run Consolidation Decision Form (template 3)

### 🟠 DO THIS THIS WEEK

- Two pages with 80%+ keyword overlap
- New content published without pre-publish check
- Conflicting pages not linked to each other
- Category page cannibalizing individual posts

**Action:** Audit with Template 4, create plan

### 🟡 DO THIS THIS MONTH

- Two pages in top 10 for same keyword (but different positions)
- Moderate keyword overlap (40-60%)
- Old content still ranking alongside new content
- Related pages could be better cross-linked

**Action:** Template 1-3, implement differentiation

### 🟢 DO THIS QUARTERLY

- Monthly keyword rank check (Template 5)
- Content gap analysis
- Consolidation review
- Keyword strategy update

---

## Quick Fixes by Scenario

| Scenario | Quick Fix | Time |
|----------|-----------|------|
| 2 blog posts, same keyword | Redirect weaker → stronger | 5 min |
| Blog + pillar, same keyword | Merge blog into pillar + redirect | 30 min |
| Blog + tool, same keyword | Change blog keyword to "how to," tool to "calculator" | 15 min |
| 3+ similar posts | Create pillar page, make posts children, redirect old posts | 1 hour |
| Old + new content, same keyword | Check freshness → redirect old if outdated | 10 min |
| Category page issue | Change category page keyword to broader term | 15 min |

---

## Keyword Audit: 60-Second Check

Run this monthly (1st of month):

```bash
For each primary keyword:
  1. Google: "[keyword]"
  2. Count StrataGenie pages in top 10
  3. If 2+ pages → ALERT
  4. Document in Template 5
  5. Create fix if needed
```

**That's it.** Takes 10-15 minutes for all keywords.

---

## Three Rules for Cannibalization-Free Content

### Rule 1: Different Keywords = Different Pages

```
Page A targets: "strata levy calculator"
Page B targets: "how to calculate strata levy"
✅ Different keywords = safe to have both
```

### Rule 2: Same Keyword = Different Intent

```
Page A intent: Transactional (DO calculation)
Page B intent: Informational (LEARN about calculation)
✅ Different intents = safe to have both
```

### Rule 3: Similar Content = Cross-Link or Consolidate

```
If Pages A & B are SIMILAR and TARGET SIMILAR KEYWORDS:
  → Cross-link them strongly AND/OR
  → Consolidate into one better page
```

---

## Common Mistakes to Avoid

| ❌ Don't | ✅ Do Instead |
|---------|----------------|
| Create two pages for same keyword without plan | Check overlap first, assign different keywords |
| Publish blog post without checking pillar pages | Run pre-publish check (Template 1) |
| Leave similar pages un-linked | Add cross-links and clear differentiation |
| Delete pages with traffic without redirects | Use 301 redirects to preserve SEO value |
| Ignore keyword conflicts | Check for cannibalization monthly |
| Create "similar" content for different reasons | Be intentional about content purpose |

---

## Files You Need to Know

| File | Purpose | Update |
|------|---------|--------|
| `SEO-CANNIBALIZATION-FRAMEWORK.md` | Full framework (bookmark this) | Monthly |
| `docs/CANNIBALIZATION-TEMPLATES.md` | Ready-to-use templates | As needed |
| `docs/CANNIBALIZATION-QUICK-START.md` | This file (print it!) | Quarterly |
| `SEO.md` | Content inventory, keywords | Every publish |

---

## Checklist: Before Publishing Content

```
□ 1. Define primary keyword
□ 2. Search site:stratagenie.com.au [keyword]
□ 3. Check Keyword Mapping Template
□ 4. Google [keyword] and review top 10
□ 5. Complete overlap analysis
□ 6. Make decision: proceed/differentiate/consolidate
□ 7. If proceeding, differentiate keywords (if needed)
□ 8. Update Keyword Mapping Template
□ 9. Plan internal links
□ 10. Publish with confidence
```

**Takes 10-15 minutes. Worth it.**

---

## Vocabulary Quick Reference

| Term | Definition |
|------|-----------|
| **Cannibalization** | Multiple pages competing for same keyword, diluting authority |
| **Keyword Overlap** | Percentage of shared target keywords between pages (>80% = problem) |
| **Search Intent** | What the user wants: Informational, Transactional, Commercial, Navigational |
| **Primary Keyword** | Main target keyword for a page (1-2 per page) |
| **Secondary Keywords** | Supporting keywords (2-3 per page) |
| **Long-tail Keywords** | Longer, more specific keyword variations (3-5 per page) |
| **Pillar Page** | Comprehensive guide page (hub for topic cluster) |
| **Cluster Post** | Supporting post linked to pillar page |
| **301 Redirect** | Permanent redirect that passes SEO authority from old URL to new |
| **SERP** | Search Engine Results Page (what appears when you Google) |

---

## Emergency: I Found Cannibalization Right Now

### In 30 Seconds:

1. **Identify conflicting pages:** Which 2+ pages compete for same keyword?
2. **Which has more traffic?** Keep that one, consolidate others to it.
3. **Create redirect:** `301 Redirect: /old-url → /good-url`
4. **Add internal links:** From good page to related content
5. **Monitor:** Check rankings in 30 days

### Next Steps:

1. Document incident (Template 4)
2. Run Consolidation Decision Form (Template 3)
3. Create action plan
4. Implement fixes
5. Monitor and report results

---

## ROI of Preventing Cannibalization

| Benefit | Impact |
|---------|--------|
| **Consolidated ranking authority** | +2-5 positions in search results |
| **Higher clickthrough rates** | 2-3x more traffic from same keyword |
| **Faster ranking increases** | Reach top 10 in weeks, not months |
| **Better user experience** | Clear, differentiated content |
| **Easier link building** | One page to send backlinks to |
| **Time savings** | Not chasing declining rankings |

**Conservative estimate:** Proper cannibalization prevention = 30-50% more SEO traffic over 6 months.

---

## Monthly Routine (15 Minutes)

**Every 1st of the month:**

1. **Run keyword audit** (10 min)
   - Check primary keywords in Google
   - Note any StrataGenie pages in top 10 for each keyword
   - If 2+ pages for same keyword → Alert

2. **Check for new conflicts** (3 min)
   - Any new posts published without pre-publish check?
   - Any accidental near-duplicates?

3. **Document** (2 min)
   - Fill out Template 5 (Monthly Cannibalization Audit)
   - Create issues if found

**That's all you need.**

---

## Get Help

**Questions?**

1. Check SEO-CANNIBALIZATION-FRAMEWORK.md (detailed guide)
2. Find your scenario in "Resolution Action Playbook" section
3. Use the templates (CANNIBALIZATION-TEMPLATES.md)
4. Ask SEO lead for complex consolidations

---

## TL;DR of TL;DR

- **Before publishing:** Check for keyword conflicts (10 min)
- **Monthly:** Audit for emerging cannibalization (15 min)
- **When found:** Consolidate, differentiate, or cross-link (1-2 hours)
- **Result:** Better rankings, more traffic, less work

---

**Print this. Bookmark this. Use this every time you publish content.**

**Last Updated:** 4 December 2025
