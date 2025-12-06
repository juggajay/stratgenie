<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## UI & Design System - "Editorial" Light Theme

> **Full Reference**: See `docs/DESIGN-SYSTEM.md` for comprehensive design system documentation including all colors, typography, components, animations, and code examples.

When generating any UI (pages, components, layouts, forms, dashboards), Claude MUST follow these rules. These are not suggestions.

### 1. Overall Style

- Look & feel: light, editorial, warm, professional.
- Brand identity: "Editorial" - cream backgrounds with coral accents.
- Target user: volunteer strata committee member (not technical).
- Every screen must answer quickly:
  - "Am I compliant?"
  - "What needs my attention?"
  - "What should I do next?"
- Use solid white cards with subtle shadows.
- Favour clear hierarchy with coral accents for primary actions.

### 2. Layout & Structure

- Use a header-based navigation on desktop with mobile hamburger menu.
- Page structure:
  - Page wrapper: `max-w-5xl mx-auto px-6 py-8`.
  - Top: white header with branding and navigation.
  - Below: white cards with `gap-6` between sections.
- On mobile:
  - Navigation via Sheet component (slide-in from left).
  - Cards stack vertically full-width.

### 3. Colors

Use the "Editorial" light theme palette:

- **Primary (Coral)**: `bg-[#FF6B35] hover:bg-[#E85A2A] text-white`.
- **Backgrounds**:
  - App background: `bg-background` (Cream #FDFBF7).
  - Card background: `bg-white border border-[#E8E4DE]`.
  - Elevated surfaces: `bg-[#F8F5F0]`.
- **Borders**: `border-[#E8E4DE]` for subtle, `border-[#FF6B35]/30` for emphasis.
- **Text**:
  - Primary text: `text-foreground` (Navy #1a1a2e).
  - Secondary: `text-[#3d3d5c]`.
  - Muted: `text-muted-foreground` (#6b6b8a).
- **Status colors** (light style):
  - Success: `bg-emerald-50 text-emerald-600 border border-emerald-200`.
  - Warning: `bg-amber-50 text-amber-600 border border-amber-200`.
  - Danger: `bg-red-50 text-red-600 border border-red-200`.
  - Info: `bg-[#FFF0EB] text-[#FF6B35] border border-[#FFCDB8]`.
- **Agent Identity Colors**:
  - Secretary (AI Secretary): Coral `text-[#FF6B35]`.
  - Treasurer (Finance): Amber `text-amber-600`.
  - Guardian (Bylaws): Terracotta `text-[#D97706]`.
- **Special Colors**:
  - AI Processing: Violet `text-violet-600 bg-violet-50`.
  - Accent Light: `bg-[#FFF0EB]`.

Never introduce random colors. Reuse this palette.

### 4. Typography

Use:

- Font: `Newsreader` for display/headings, `Plus Jakarta Sans` for body.
- Sizes:
  - Page title: `text-2xl font-semibold tracking-tight font-display`.
  - Section heading: `text-xl font-semibold`.
  - Card title: `text-lg font-medium`.
  - Body text: `text-sm`.
  - Labels / small meta: `text-xs font-medium uppercase tracking-wide text-muted-foreground`.

All headings should be short, action-oriented, and clear.

### 5. Components (shadcn + Tailwind)

Claude MUST use shadcn/ui components where possible, with Tailwind classes for layout.

#### 5.1 Cards

- Use the `Card` component or `GlassCard` with light theme styling:

```tsx
<Card className="bg-white border border-[#E8E4DE] rounded-xl shadow-sm">
  <CardHeader className="pb-3">
    <CardTitle className="text-lg font-medium text-foreground">Title</CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Short explanation.
    </CardDescription>
  </CardHeader>
  <CardContent className="pt-0">
    {/* content */}
  </CardContent>
</Card>
```

Or use the GlassCard component with hover effects:

```tsx
import { GlassCard } from "@/components/ui/glass-card";

<GlassCard glow="coral" className="p-6">
  {/* content with coral glow on hover */}
</GlassCard>
```

Rules:

- Use light card styling: `bg-white border border-[#E8E4DE] shadow-sm`.
- Add subtle hover effects for interactive cards: `hover:shadow-md hover:border-[#FF6B35]/30`.
- Keep descriptions short (1–2 lines max).
- Prefer one main action per card (primary button with coral color).

#### 5.2 Buttons

Use shadcn `<Button>` with consistent light theme styling:

**Primary (coral):**

```tsx
<Button>
  Primary action
</Button>
```
(Default button uses coral #FF6B35)

**Outline / secondary:**

```tsx
<Button variant="outline">
  Secondary
</Button>
```

**Destructive:**

```tsx
<Button variant="destructive">
  Delete
</Button>
```

Never invent your own button component when shadcn Button works.

#### 5.3 Status Pills (for compliance)

Use light background pills with colored borders for status indicators:

```tsx
// On track (emerald)
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
  <CheckCircle2 className="h-3 w-3" />
  On track
</span>

// Upcoming (coral)
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFF0EB] text-[#FF6B35] border border-[#FFCDB8]">
  <Clock className="h-3 w-3" />
  Upcoming
</span>

// Due soon (amber)
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
  <AlertTriangle className="h-3 w-3" />
  Due soon
</span>

// Overdue (red)
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
  <XCircle className="h-3 w-3" />
  Overdue
</span>
```

Claude should use a consistent naming + style for these.

#### 5.4 Tables

Use simple, minimal tables with light theme styling:

- Header: `text-xs font-medium text-muted-foreground uppercase tracking-wide`.
- Rows: `text-sm text-foreground`, hover: `hover:bg-[#F8F5F0]`.
- Borders: `border-[#E8E4DE]`.
- Keep actions on the right side with icon buttons or short text buttons.

### 6. Dashboard & Compliance Card Pattern

For compliance-related views (AGM, Strata Hub, tasks), Claude MUST follow this light theme pattern:

```tsx
<Card className="bg-white border border-[#E8E4DE] rounded-xl shadow-sm">
  <CardHeader>
    <div className="flex items-start justify-between gap-4">
      <div>
        <CardTitle className="text-lg font-medium text-foreground">AGM Compliance</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Next AGM due: 10 March 2026
        </CardDescription>
      </div>
      {/* status pill on the right */}
      <AgmStatusPill status="due_soon" />
    </div>
  </CardHeader>
  <CardContent className="pt-2 space-y-3">
    <p className="text-sm text-muted-foreground">
      <span className="font-medium text-foreground">Due in 24 days.</span> Start preparing your agenda and notice now.
    </p>
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        Generate AGM checklist
      </Button>
      <Button variant="outline">
        View tasks
      </Button>
    </div>
  </CardContent>
</Card>
```

Rules:

- Use light card styling with subtle shadow.
- Left: title (text-foreground) + description (text-muted-foreground).
- Right: light status pill with colored background and border.
- Body: one short explanatory paragraph + 1–2 key actions (coral primary, outline secondary).

### 7. Agents UI

For "agents" (AI Secretary, Treasurer, Guardian), Claude should:

- Use a two-column layout on desktop:
  - Left: conversation (chat).
  - Right: structured context + actions for that scheme (deadlines, tasks, key documents).
- Chat area uses:
  - User bubbles and agent bubbles clearly distinguished.
  - Suggested quick actions (chips or buttons) under the input when helpful.

Example layout:

```tsx
<div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
  {/* Chat column */}
  <Card className="flex flex-col">
    {/* header & chat messages */}
  </Card>

  {/* Context/actions column */}
  <div className="space-y-4">
    <Card>{/* scheme compliance summary */}</Card>
    <Card>{/* upcoming tasks */}</Card>
  </div>
</div>
```

### 8. Forms

Form rules for light theme:

- Use shadcn Form, FormField, Label, Input, Select, etc.
- Prefer single-column forms with clear grouping.
- Each field:
  - Label: `text-sm font-medium text-foreground`
  - Input: Light style `bg-white border-[#E8E4DE] text-foreground`
  - Optional help text: `text-xs text-muted-foreground`

Example:

```tsx
<div className="space-y-1.5">
  <Label htmlFor="schemeName" className="text-sm font-medium text-foreground">
    Scheme name
  </Label>
  <Input
    id="schemeName"
    placeholder="e.g. Pinecrest Apartments"
    className="rounded-lg"
  />
  <p className="text-xs text-muted-foreground">
    This is how the scheme will appear on dashboards and documents.
  </p>
</div>
```

### 9. Icons

Claude MUST use lucide-react icons only.

Example mappings:

- Dashboard: LayoutDashboard
- Schemes: Building2
- Tasks: CheckCircle2
- Agents: Bot
- Documents: FileText
- Settings: Settings

Import style:

```tsx
import { Building2, CheckCircle2, Bot } from "lucide-react";
```

### 10. Interaction & Motion

- Use Tailwind transitions: transition-all, hover:-translate-y-0.5, hover:shadow-md for interactive cards.
- Use subtle toasts for success/error (via your chosen toast system).
- Avoid heavy animations.

### 11. Things Claude MUST NOT Do

- Do NOT introduce new UI libraries beyond:
  - Next.js + React
  - Tailwind
  - shadcn/ui
  - lucide-react
- Do NOT mix inline styles with Tailwind unless absolutely necessary.
- Do NOT create new visual patterns that conflict with the ones above.
- Do NOT create dense, text-heavy UIs with long paragraphs and no clear actions.

If in doubt, Claude should:

- Use a card.
- Use a clear title.
- Use a short explanation.
- Offer one primary action and one secondary action.