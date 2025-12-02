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

## UI & Design System (ASM)

When generating any UI (pages, components, layouts, forms, dashboards), Claude MUST follow these rules. These are not suggestions.

### 1. Overall Style

- Look & feel: sleek, modern, calm, professional.
- Target user: volunteer strata committee member (not technical).
- Every screen must answer quickly:
  - "Am I compliant?"
  - "What needs my attention?"
  - "What should I do next?"
- Avoid visual noise. Favour clear hierarchy, white space, and one primary action per area.

### 2. Layout & Structure

- Use a left sidebar layout on desktop:
  - Sections: Dashboard, Schemes, Tasks, Agents, Documents, Settings.
- Page structure:
  - Page wrapper: `max-w-5xl mx-auto px-6 py-8` (or similar).
  - Top: page title + optional actions.
  - Below: cards, tables, forms with `gap-6` between sections.
- On mobile:
  - Sidebar collapses to a hamburger menu.
  - Cards stack vertically full-width.

### 3. Colors

Use Tailwind-style colors consistent with this palette:

- Primary: `blue-600` (`bg-blue-600 hover:bg-blue-700 text-white` for primary actions).
- Backgrounds:
  - App background: `bg-slate-50` or `bg-slate-100`.
  - Card background: `bg-white`.
- Borders: `border-slate-200`.
- Text:
  - Main text: `text-slate-900`.
  - Secondary: `text-slate-600`.
  - Muted: `text-slate-500`.
- Status colors:
  - Success: `green-500/600`.
  - Warning: `amber-500/600`.
  - Danger: `red-500/600`.
  - Info: `blue-500/600`.

Never introduce random colors. Reuse this palette.

### 4. Typography

Use:

- Font: `Inter, system-ui, sans-serif` (assume configured globally).
- Sizes:
  - Page title: `text-2xl font-semibold tracking-tight`.
  - Section heading: `text-xl font-semibold`.
  - Card title: `text-lg font-medium`.
  - Body text: `text-sm`.
  - Labels / small meta: `text-xs font-medium uppercase tracking-wide text-slate-500`.

All headings should be short, action-oriented, and clear.

### 5. Components (shadcn + Tailwind)

Claude MUST use shadcn/ui components where possible, with Tailwind classes for layout.

#### 5.1 Cards

- Base card:

```tsx
<Card className="border border-slate-200 rounded-xl bg-white shadow-sm">
  <CardHeader className="pb-3">
    <CardTitle className="text-lg font-medium">Title</CardTitle>
    <CardDescription className="text-sm text-slate-500">
      Short explanation.
    </CardDescription>
  </CardHeader>
  <CardContent className="pt-0">
    {/* content */}
  </CardContent>
</Card>
```

Rules:

- Use rounded-xl, border-slate-200, shadow-sm.
- Keep descriptions short (1–2 lines max).
- Prefer one main action per card (primary button).

#### 5.2 Buttons

Use shadcn <Button> with consistent styling:

Primary:

```tsx
<Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2">
  Primary action
</Button>
```

Outline / secondary:

```tsx
<Button variant="outline" className="rounded-lg border-slate-300 text-slate-700">
  Secondary
</Button>
```

Destructive:

```tsx
<Button variant="destructive" className="rounded-lg">
  Delete
</Button>
```

Never invent your own button component when shadcn Button works.

#### 5.3 Status Pills (for compliance)

Use small rounded pills to show statuses like on_track, upcoming, due_soon, overdue.

Examples:

```tsx
// On track
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
  On track
</span>

// Due soon
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
  Due soon
</span>

// Overdue
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
  Overdue
</span>
```

Claude should use a consistent naming + style for these.

#### 5.4 Tables

Use simple, minimal tables:

- Header: slightly bolder, text-xs font-medium text-slate-500 uppercase tracking-wide.
- Rows: text-sm, hover:bg-slate-50 on hover.
- Keep actions on the right side with icon buttons or short text buttons.

### 6. Dashboard & Compliance Card Pattern

For compliance-related views (AGM, Strata Hub, tasks), Claude MUST follow this pattern:

```tsx
<Card>
  <CardHeader>
    <div className="flex items-start justify-between gap-4">
      <div>
        <CardTitle className="text-lg font-medium">AGM Compliance</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Next AGM due: 10 March 2026
        </CardDescription>
      </div>
      {/* status pill on the right */}
      <AgmStatusPill status="due_soon" />
    </div>
  </CardHeader>
  <CardContent className="pt-2 space-y-3">
    <p className="text-sm text-slate-600">
      Your AGM is due in 24 days. Start preparing your agenda and notice now to meet statutory requirements.
    </p>
    <div className="flex flex-wrap items-center gap-3">
      <Button>Generate AGM checklist</Button>
      <Button variant="outline" className="text-slate-700">
        View tasks
      </Button>
    </div>
  </CardContent>
</Card>
```

Rules:

- Left: title + description.
- Right: status pill.
- Body: one short explanatory paragraph + 1–2 key actions (buttons).

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

Form rules:

- Use shadcn Form, FormField, Label, Input, Select, etc.
- Prefer single-column forms with clear grouping.
- Each field:
  - Label (text-sm font-medium text-slate-700)
  - Input (rounded-lg, border-slate-300)
  - Optional help text (text-xs text-slate-500).

Example:

```tsx
<div className="space-y-1.5">
  <Label htmlFor="schemeName" className="text-sm font-medium text-slate-700">
    Scheme name
  </Label>
  <Input
    id="schemeName"
    placeholder="e.g. Pinecrest Apartments"
    className="rounded-lg border-slate-300"
  />
  <p className="text-xs text-slate-500">
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