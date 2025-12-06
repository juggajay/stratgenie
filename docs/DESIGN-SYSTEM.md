# StrataGenie Design System

## Editorial Light Theme

A warm, premium editorial theme with coral accents designed for volunteer strata committee members.

---

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Animations](#animations)
7. [Status Indicators](#status-indicators)
8. [Agent Identity](#agent-identity)
9. [Code Examples](#code-examples)

---

## Brand Identity

### Logo
- Text-based logo using Newsreader font
- "Strata" in navy (#1a1a2e) + "Genie" in coral (#FF6B35)
- Use `font-display` class for the Newsreader font

```tsx
<span className="text-2xl font-display font-medium tracking-tight">
  <span className="text-foreground">Strata</span>
  <span className="text-[#FF6B35]">Genie</span>
</span>
```

### Design Principles
1. **Light & Editorial** - Warm cream backgrounds, white cards, subtle shadows
2. **Clarity First** - Every screen answers: "Am I compliant?" and "What needs attention?"
3. **Coral Accents** - Primary actions and focus states use coral (#FF6B35)
4. **Professional Warmth** - Sophisticated but approachable for non-technical users

---

## Color System

### Primary Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Coral | `#FF6B35` | `--primary` / `--coral` | Primary buttons, links, accents |
| Coral Hover | `#E85A2A` | `--accent` / `--coral-hover` | Hover states |
| Coral Light | `#FFF0EB` | `--coral-light` | Backgrounds, highlights |
| Coral Border | `#FFCDB8` | `--coral-border` | Subtle borders |

### Background Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Cream | `#FDFBF7` | `--background` / `--cream` | Page background |
| Cream Warm | `#F8F5F0` | `--secondary` / `--cream-warm` | Elevated surfaces, inputs |
| White | `#FFFFFF` | `--card` | Cards, modals |

### Text Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Navy | `#1a1a2e` | `--foreground` / `--navy` | Headings, primary text |
| Body | `#3d3d5c` | `--card-foreground` | Body text |
| Muted | `#6b6b8a` | `--muted-foreground` | Secondary text, labels |
| Light | `#9595ad` | `--text-light` | Placeholders, hints |

### Border Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Border | `#E8E4DE` | `--border` | Card borders, dividers |
| Ring | `#FF6B35` | `--ring` | Focus rings |

### Status Colors

| Status | Background | Text | Border |
|--------|------------|------|--------|
| Success | `#ECFDF5` | `#059669` | `#A7F3D0` |
| Warning | `#FEF3C7` | `#D97706` | `#FCD34D` |
| Danger | `#FEF2F2` | `#DC2626` | `#FECACA` |
| Info | `#FFF0EB` | `#E85A2A` | `#FFCDB8` |
| Neutral | `#F8F5F0` | `#6b6b8a` | `#E8E4DE` |

---

## Typography

### Font Families

| Font | CSS Variable | Usage |
|------|--------------|-------|
| Newsreader | `--font-display` | Headings, display text |
| Plus Jakarta Sans | `--font-body` | Body text, UI elements |

### Font Classes

```css
.font-display  /* Newsreader - for headings */
.font-body     /* Plus Jakarta Sans - for body */
```

### Text Hierarchy

| Element | Class | Size | Weight |
|---------|-------|------|--------|
| Page Title | `text-2xl font-display font-semibold tracking-tight` | 24px | 600 |
| Section Heading | `text-xl font-display font-semibold` | 20px | 600 |
| Card Title | `text-lg font-display font-medium` | 18px | 500 |
| Body | `text-sm` | 14px | 400 |
| Label | `text-xs font-medium uppercase tracking-wide` | 12px | 500 |
| Muted | `text-muted-foreground` | - | - |

---

## Spacing & Layout

### Page Structure

```tsx
<main className="max-w-5xl mx-auto px-6 py-8">
  {/* Content */}
</main>
```

### Grid Layouts

**Dashboard (2-column):**
```tsx
<div className="grid gap-6 lg:grid-cols-[300px_1fr]">
  {/* Sidebar */}
  {/* Main content */}
</div>
```

**Finance (2-column):**
```tsx
<div className="grid gap-6 lg:grid-cols-[280px_1fr]">
  {/* Sidebar */}
  {/* Main content */}
</div>
```

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `gap-2` | 8px | Inline elements |
| `gap-3` | 12px | Small spacing |
| `gap-4` | 16px | Component spacing |
| `gap-6` | 24px | Section spacing |
| `gap-8` | 32px | Large sections |

### Border Radius

| Element | Value |
|---------|-------|
| Cards | `rounded-xl` (12px) or `rounded-[20px]` (20px) |
| Buttons | `rounded-lg` (8px) |
| Icon boxes | `rounded-[10px]` |
| Pills/Badges | `rounded-full` |
| Inputs | `rounded-lg` (8px) |

---

## Components

### Cards

**Standard Card:**
```tsx
<Card className="bg-white border border-[#E8E4DE] rounded-xl shadow-sm">
  <CardHeader className="pb-3">
    <CardTitle className="text-lg font-medium text-foreground">Title</CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Description text
    </CardDescription>
  </CardHeader>
  <CardContent className="pt-0">
    {/* Content */}
  </CardContent>
</Card>
```

**Accent Card (with left border hover):**
```tsx
<Card className="card-accent">
  {/* Card content */}
</Card>
```

The `.card-accent` class adds:
- Gray left border by default (`#E8E4DE`)
- Coral left border on hover (`#FF6B35`)
- Smooth transition

### Buttons

**Primary (Coral):**
```tsx
<Button>Primary Action</Button>
```

**Outline:**
```tsx
<Button variant="outline">Secondary</Button>
```

**Ghost:**
```tsx
<Button variant="ghost">Ghost</Button>
```

**Destructive:**
```tsx
<Button variant="destructive">Delete</Button>
```

### Status Badges

```tsx
// Success
<Badge variant="success" className="gap-1">
  <CheckCircle2 className="h-3 w-3" />
  On track
</Badge>

// Warning
<Badge variant="warning" className="gap-1">
  <AlertTriangle className="h-3 w-3" />
  Due soon
</Badge>

// Danger
<Badge variant="danger" className="gap-1">
  <XCircle className="h-3 w-3" />
  Overdue
</Badge>

// Info (Coral)
<Badge variant="info" className="gap-1">
  <Clock className="h-3 w-3" />
  Upcoming
</Badge>
```

Or use utility classes directly:
```tsx
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium status-success">
  <CheckCircle2 className="h-3 w-3" />
  On track
</span>
```

### Icon Boxes

```tsx
<div className="flex h-11 w-11 items-center justify-center rounded-[10px] border bg-white border-[#E8E4DE] group-hover:bg-[#FFF0EB] group-hover:border-[#FF6B35]/30 transition-all">
  <Calendar className="h-5 w-5 text-[#6b6b8a] group-hover:text-[#FF6B35] transition-colors" />
</div>
```

### Inputs

```tsx
<input
  className="w-full px-3 py-2 text-sm border border-[#E8E4DE] rounded-lg bg-white text-[#1a1a2e] placeholder:text-[#9595ad] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
  placeholder="Enter text..."
/>
```

---

## Animations

### Entry Animations

**Fade Slide In (cards from bottom):**
```tsx
<div className="animate-fade-slide-in animate-delay-1">
  {/* Content fades in and slides up */}
</div>
```

**Slide In Left (sidebar):**
```tsx
<div className="animate-slide-in-left">
  {/* Content slides in from left */}
</div>
```

**Stagger Delays:**
```css
.animate-delay-1 { animation-delay: 0ms; }
.animate-delay-2 { animation-delay: 100ms; }
.animate-delay-3 { animation-delay: 200ms; }
.animate-delay-4 { animation-delay: 300ms; }
.animate-delay-5 { animation-delay: 400ms; }
```

### Attention Animations

**Pulse for items needing attention:**
```tsx
<div className="animate-attention-pulse">
  {/* Pulses with coral glow */}
</div>
```

Use for:
- Items with `due_soon` status
- Items with `overdue` status
- Critical notifications

### Hover Animations

**Card hover lift:**
```tsx
<div className="hover:-translate-y-0.5 hover:shadow-md transition-all">
  {/* Lifts on hover */}
</div>
```

**Button scale:**
```css
.btn-hover-scale:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}
```

### Loading States

**Pulse animation (standard):**
```tsx
<div className="animate-pulse space-y-3">
  <div className="h-12 bg-secondary rounded"></div>
  <div className="h-12 bg-secondary rounded"></div>
</div>
```

---

## Status Indicators

### Compliance Status

| Status | Color | Icon | Usage |
|--------|-------|------|-------|
| On Track | Emerald | `CheckCircle2` | Compliant, no action needed |
| Upcoming | Coral | `Clock` | Coming up, start preparing |
| Due Soon | Amber | `AlertTriangle` | Action required soon |
| Overdue | Red | `XCircle` | Immediate action required |
| Setup Required | Gray | `Settings` | Configuration needed |

### Urgency Classes

```css
.urgency-normal   /* Gray left border */
.urgency-attention /* Amber left border + light amber bg */
.urgency-urgent   /* Red left border + light red bg */
```

---

## Agent Identity

Each AI agent has a distinct identity color:

| Agent | Color | CSS Class | Hex |
|-------|-------|-----------|-----|
| Secretary | Cyan | `.agent-secretary` | `#0891B2` |
| Treasurer | Emerald | `.agent-treasurer` | `#059669` |
| Guardian | Amber | `.agent-guardian` | `#D97706` |
| Generic | Coral | `.card-accent` | `#FF6B35` |

### Agent Card Pattern

```tsx
<Card className="agent-guardian">
  {/* Card with amber left border on hover */}
</Card>
```

### Agent Badges

```tsx
<span className="badge-secretary">Secretary</span>
<span className="badge-treasurer">Treasurer</span>
<span className="badge-guardian">Guardian</span>
```

---

## Code Examples

### Dashboard Header

```tsx
<header className="bg-white/90 backdrop-blur-xl border-b border-[#E8E4DE] sticky top-0 z-10">
  <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-6">
      {/* Logo */}
      <span className="text-2xl font-display font-medium tracking-tight">
        <span className="text-foreground">Strata</span>
        <span className="text-[#FF6B35]">Genie</span>
      </span>
      <div className="h-6 w-px bg-[#E8E4DE]" />
      <h1 className="text-lg font-display font-bold tracking-tight text-foreground">
        Dashboard
      </h1>
    </div>
    {/* Navigation buttons */}
  </div>
</header>
```

### Compliance Item

```tsx
<div className="group flex items-center gap-4 p-4 rounded-xl bg-[#F8F5F0] hover:bg-[#FFF0EB] transition-all cursor-pointer">
  {/* Icon box */}
  <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border bg-white border-[#E8E4DE] group-hover:bg-[#FFF0EB] group-hover:border-[#FF6B35]/30 transition-all flex-shrink-0">
    <CheckCircle2 className="h-5 w-5 text-emerald-600 group-hover:text-[#FF6B35] transition-colors" />
  </div>

  {/* Content */}
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-foreground">Annual General Meeting</p>
    <p className="text-xs text-muted-foreground">Next due: 15 March 2026</p>
  </div>

  {/* Status badge */}
  <Badge variant="success">On track</Badge>
</div>
```

### Task Row

```tsx
<div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 rounded-lg bg-[#F8F5F0] hover:bg-[#FFF0EB] border border-[#E8E4DE] hover:border-[#FFCDB8] transition-all items-center">
  {/* Task name */}
  <div className="flex items-center gap-3 min-w-0">
    <Clock className="h-4 w-4 text-[#FF6B35]" />
    <span className="text-sm text-foreground truncate">Send AGM notice</span>
  </div>

  {/* Due date */}
  <div className="text-right">
    <span className="text-sm text-muted-foreground">Due in 5 days</span>
    <span className="block text-xs text-muted-foreground">10 Dec 2024</span>
  </div>

  {/* Action */}
  <Button size="sm">Generate</Button>
</div>
```

---

## File References

| File | Purpose |
|------|---------|
| `app/globals.css` | All CSS variables, utilities, animations |
| `components/ui/button.tsx` | Button component variants |
| `components/ui/card.tsx` | Card component |
| `components/ui/badge.tsx` | Badge component |
| `public/dashboard-animations.html` | Animation preview reference |
| `app/landing-v2-styles.css` | Landing page specific styles |

---

## Quick Reference

### Most Used Colors
- Primary: `#FF6B35` (coral)
- Background: `#FDFBF7` (cream)
- Card: `#FFFFFF` (white)
- Border: `#E8E4DE`
- Text: `#1a1a2e` (navy)

### Most Used Classes
- Card: `card-accent` or `agent-{type}`
- Status: `status-success`, `status-warning`, `status-danger`, `status-info`
- Animation: `animate-fade-slide-in`, `animate-slide-in-left`, `animate-attention-pulse`
- Layout: `max-w-5xl mx-auto px-6 py-8`
