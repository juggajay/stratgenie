# StrataGenie UI/UX Audit — Strict Review

## Overall Score: **6.5/10** — Good foundation, but far from perfect

---

## Critical Issues (Must Fix)

### 1. **No Mobile Experience**
**Severity: CRITICAL**

Your app has zero mobile consideration:
- `lg:grid-cols-[280px_1fr]` collapses to stacked, but there's no hamburger menu
- No mobile navigation at all — users are stranded
- Large modals (`60vw x 60vh`, `h-[90vh]`) are unusable on phones
- Chat interface has hardcoded `h-[600px]` — broken on mobile

**Impact:** 50%+ of users will have a broken experience.

---

### 2. **Color Inconsistency**
**Severity: HIGH**

You're using 3 different "primary" colors randomly:

| Location | Color | Problem |
|----------|-------|---------|
| Landing page buttons | `bg-blue-600` | Correct per design system |
| Task list actions | `bg-teal-700` | Why? Not in CLAUDE.md |
| Invoice approve button | `bg-teal-700` | Inconsistent with brand |
| Guardian | `text-indigo-600` | Third color introduced |
| Compliance "On track" pill | `bg-teal-700 text-white` | Should be `bg-green-100 text-green-700` per design system |

**Lines affected:**
- `task-list.tsx:197, 209, 229, 240`
- `invoice-review-dialog.tsx:472, 494`
- `compliance-card.tsx:30` — "On track" uses teal instead of green

**Fix:** Standardize on `bg-blue-600` for primary actions, `bg-green-*` for success states.

---

### 3. **Header Duplicated 3 Times**
**Severity: HIGH**

Every page has its own header implementation:
- `dashboard/page.tsx:33-106`
- `finance/page.tsx:198-236`
- `guardian/page.tsx:100-135`

All nearly identical but with subtle differences. This is:
- Maintenance nightmare
- Inconsistent spacing/styling
- Violates DRY

**Fix:** Extract to `<AppHeader />` component with props for title, actions, breadcrumbs.

---

### 4. **Invoice Review Dialog is a UX Disaster**
**Severity: HIGH**

`invoice-review-dialog.tsx`:

| Issue | Line | Problem |
|-------|------|---------|
| Fixed viewport size | `193` | `w-[60vw] h-[60vh]` — breaks on small screens |
| Too many buttons | `422-508` | 6 buttons in footer — cognitive overload |
| Cramped form | `271-409` | 6 fields squeezed into 1/3 of modal width |
| No success feedback | — | Approve works silently, no toast/confirmation |
| Confusing actions | `434-443` | "Reject" deletes the transaction (destructive!) with no confirmation |

**Specific problems:**
- Line 437: `handleReject` calls `deleteTransaction` — extremely destructive with no confirmation dialog
- Line 193: Hardcoded viewport units don't work on mobile
- Line 306-349: Amount/GST inputs side-by-side in narrow column — hard to use

---

### 5. **Task List Action Buttons Are Confusing**
**Severity: MEDIUM-HIGH**

`task-list.tsx:178-259`:

The same button can mean 4 different things:
- "Generate" (create document)
- "Start" (change status)
- "Complete" (change status)
- "View Draft" / "View Notice" (open dialog)

Users won't understand that "Generate" creates a document while "Start" just changes a status field.

Also:
- Line 254-257: Hover to see "Undo" is a hidden action — bad discoverability
- Line 197-220: `bg-teal-700` doesn't match any design system color

---

### 6. **Scheme Selector Always Visible — Wasted Space**
**Severity: MEDIUM**

The 280px sidebar showing scheme selector is:
- Visible on EVERY page (Dashboard, Finance, Guardian)
- Takes 25% of horizontal space
- Rarely used after initial selection
- Doesn't collapse or hide

**Better UX:** Put scheme selector in header dropdown, reclaim space for content.

---

### 7. **No Loading Skeletons / Inconsistent Loading States**
**Severity: MEDIUM**

| Component | Loading State | Problem |
|-----------|---------------|---------|
| `compliance-card.tsx:227-243` | Skeleton pulse | Good |
| `task-list.tsx:134-152` | Skeleton pulse | Good |
| `guardian/page.tsx:22-30` | Spinner | Inconsistent |
| `finance/page.tsx` | None visible | Bad |

Some pages show skeletons, others show spinners, others show nothing.

---

### 8. **Empty States Are Weak**
**Severity: MEDIUM**

Example from `dashboard/page.tsx:138-143`:
```tsx
<div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
  <p className="text-muted-foreground">
    Select a scheme to view compliance status
  </p>
</div>
```

Problems:
- No icon
- No illustration
- No call-to-action
- Just gray text in a box

Compare to `finance/page.tsx:277-283` which at least has an icon. But still no CTA.

---

### 9. **Disclaimer Footer Repeated Everywhere**
**Severity: LOW-MEDIUM**

Every page has its own disclaimer footer with slightly different wording:
- Dashboard: "administrative guidance only, not legal advice"
- Finance: "AI and should be verified... not accounting advice"
- Guardian: "informational answers... not legal advice"

**Fix:** Standardize wording, extract to shared component, or put in global footer.

---

### 10. **Trial Banner Links to Non-Existent Page**
**Severity: MEDIUM**

`trial-banner.tsx` links to `/billing` — this route doesn't exist in your codebase. Users will get a 404.

---

## Design System Violations

| Rule (from CLAUDE.md) | Violation |
|----------------------|-----------|
| "Primary: `blue-600`" | Using `teal-700` for buttons in task-list, invoice dialog |
| "Status pills: `bg-green-100 text-green-700`" | Using `bg-teal-700 text-white` for "On track" |
| "One primary action per area" | Invoice dialog has 6 buttons |
| "Card title: `text-lg font-medium`" | `CardTitle` doesn't apply these classes |
| "Rounded corners: `rounded-xl`" | Buttons use `rounded-lg` (inconsistent) |

---

## Information Architecture Issues

### Navigation is Flat and Confusing

Current nav buttons in header:
- Guardian
- Finance
- Strata Roll (Sheet)
- Settings (Dialog)

Problems:
1. No visual indication of current page
2. Strata Roll opens a Sheet, Settings opens Dialog — inconsistent patterns
3. No breadcrumbs on sub-pages (Finance/Guardian have basic ones, but they're custom)
4. Dashboard has 4 buttons, Finance has 1, Guardian has 0 — inconsistent

---

## Accessibility Issues

| Issue | Location | Severity |
|-------|----------|----------|
| Icon-only buttons without labels | Various hover arrows | Medium |
| Color-only status indication | Compliance pills rely on color | Medium |
| No skip-to-content link | All pages | Low |
| Focus states unclear | Button hover vs focus | Low |

---

## Micro-Interactions Missing

1. **No toast notifications** — Sonner is set up but rarely used
2. **No confirmation for destructive actions** — "Reject" deletes without warning
3. **No success states** — Approve an invoice, nothing happens visually
4. **No animation on state changes** — Status pills just swap, no transition

---

## Quick Wins (Easy Fixes)

| Fix | Impact | Effort |
|-----|--------|--------|
| Change all `bg-teal-700` to `bg-blue-600` | High (consistency) | 5 min |
| Add confirmation dialog to "Reject" button | High (prevents data loss) | 15 min |
| Add toast on approve/save success | Medium (feedback) | 10 min |
| Extract header to shared component | Medium (maintenance) | 30 min |
| Fix "On track" pill to `bg-green-100 text-green-700` | Low (consistency) | 2 min |
| Create `/billing` page or remove link | Medium (prevents 404) | 10 min |

---

## Summary

**What You're Doing Well:**
- Clean card-based design
- Good use of shadcn components
- Compliance status visualization is clear
- Proper skeleton loading in some places
- Consistent spacing with `gap-6`

**What Needs Work:**
1. Mobile is completely broken
2. Color consistency (teal vs blue vs indigo)
3. Header duplication across pages
4. Invoice review dialog is overcomplicated
5. Missing feedback (toasts, confirmations)
6. Navigation lacks hierarchy and current-state indication
