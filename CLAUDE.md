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

## UI & Design System - "Cyber-Magic" Dark Theme

When generating any UI (pages, components, layouts, forms, dashboards), Claude MUST follow these rules. These are not suggestions.

### 1. Overall Style

- Look & feel: dark, premium, magical, professional.
- Brand identity: "Cyber-Magic" - dark navy backgrounds with glowing cyan accents.
- Target user: volunteer strata committee member (not technical).
- Every screen must answer quickly:
  - "Am I compliant?"
  - "What needs my attention?"
  - "What should I do next?"
- Use glassmorphism effects for cards and modals.
- Favour clear hierarchy with glowing accents for primary actions.

### 2. Layout & Structure

- Use a header-based navigation on desktop with mobile hamburger menu.
- Page structure:
  - Page wrapper: `max-w-5xl mx-auto px-6 py-8`.
  - Top: glassmorphic header with branding and navigation.
  - Below: glass cards with `gap-6` between sections.
- On mobile:
  - Navigation via Sheet component (slide-in from left).
  - Cards stack vertically full-width.

### 3. Colors

Use the "Cyber-Magic" dark theme palette:

- **Primary (Cyan)**: `bg-cyan-600 hover:bg-cyan-500 text-white` with `shadow-lg shadow-cyan-600/20`.
- **Backgrounds**:
  - App background: `bg-slate-950` (Dark Navy #0F172A).
  - Card background: `bg-slate-900/80 backdrop-blur-xl border border-white/10`.
  - Elevated surfaces: `bg-slate-800/50`.
- **Borders**: `border-white/10` for subtle, `border-cyan-500/50` for emphasis.
- **Text**:
  - Primary text: `text-white`.
  - Secondary: `text-slate-300`.
  - Muted: `text-slate-400`.
- **Status colors** (dark glass style):
  - Success: `bg-emerald-900/20 text-emerald-400 border border-emerald-500/50`.
  - Warning: `bg-amber-900/20 text-amber-400 border border-amber-500/50`.
  - Danger: `bg-red-900/20 text-red-400 border border-red-500/50`.
  - Info: `bg-cyan-900/20 text-cyan-400 border border-cyan-500/50`.
- **Agent Identity Colors**:
  - Secretary (AI Secretary): Cyan `from-cyan-500 to-sky-400`.
  - Treasurer (Finance): Amber `from-amber-500 to-yellow-400`.
  - Guardian (Bylaws): Emerald `from-emerald-500 to-green-400`.
- **Special Colors**:
  - AI Processing: Violet `text-violet-400 bg-violet-900/20`.
  - Genie Gold (VIP features): Amber `text-amber-400`.

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

#### 5.1 Cards (Glassmorphic)

- Use the `GlassCard` component or apply glassmorphic classes:

```tsx
<Card className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg">
  <CardHeader className="pb-3">
    <CardTitle className="text-lg font-medium text-white">Title</CardTitle>
    <CardDescription className="text-sm text-slate-400">
      Short explanation.
    </CardDescription>
  </CardHeader>
  <CardContent className="pt-0">
    {/* content */}
  </CardContent>
</Card>
```

Or use the GlassCard component with glow effects:

```tsx
import { GlassCard } from "@/components/ui/glass-card";

<GlassCard glow="cyan" className="p-6">
  {/* content with cyan glow on hover */}
</GlassCard>
```

Rules:

- Use glassmorphic styling: `bg-slate-900/80 backdrop-blur-xl border border-white/10`.
- Add glow effects for interactive cards: `hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]`.
- Keep descriptions short (1–2 lines max).
- Prefer one main action per card (primary button with cyan glow).

#### 5.2 Buttons

Use shadcn `<Button>` with consistent dark theme styling:

**Primary (with glow):**

```tsx
<Button className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-lg shadow-cyan-600/20">
  Primary action
</Button>
```

**Outline / secondary (ghost on dark):**

```tsx
<Button variant="outline" className="rounded-lg border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">
  Secondary
</Button>
```

**Destructive:**

```tsx
<Button variant="outline" className="rounded-lg border-red-500/30 text-red-400 hover:bg-red-900/20">
  Delete
</Button>
```

Never invent your own button component when shadcn Button works.

#### 5.3 Status Pills (for compliance)

Use dark glass style pills with colored borders for status indicators:

```tsx
// On track (emerald)
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-900/20 text-emerald-400 border border-emerald-500/50">
  <CheckCircle2 className="h-3 w-3" />
  On track
</span>

// Upcoming (cyan)
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-900/20 text-cyan-400 border border-cyan-500/50">
  <Clock className="h-3 w-3" />
  Upcoming
</span>

// Due soon (amber)
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-900/20 text-amber-400 border border-amber-500/50">
  <AlertTriangle className="h-3 w-3" />
  Due soon
</span>

// Overdue (red)
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-900/20 text-red-400 border border-red-500/50">
  <XCircle className="h-3 w-3" />
  Overdue
</span>
```

Claude should use a consistent naming + style for these.

#### 5.4 Tables

Use simple, minimal tables with dark theme styling:

- Header: `text-xs font-medium text-slate-400 uppercase tracking-wide`.
- Rows: `text-sm text-slate-300`, hover: `hover:bg-white/5`.
- Borders: `border-white/10`.
- Keep actions on the right side with icon buttons or short text buttons.

### 6. Dashboard & Compliance Card Pattern

For compliance-related views (AGM, Strata Hub, tasks), Claude MUST follow this dark glassmorphic pattern:

```tsx
<Card className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg">
  <CardHeader>
    <div className="flex items-start justify-between gap-4">
      <div>
        <CardTitle className="text-lg font-medium text-white">AGM Compliance</CardTitle>
        <CardDescription className="text-sm text-slate-400">
          Next AGM due: 10 March 2026
        </CardDescription>
      </div>
      {/* status pill on the right */}
      <AgmStatusPill status="due_soon" />
    </div>
  </CardHeader>
  <CardContent className="pt-2 space-y-3">
    <p className="text-sm text-slate-400">
      <span className="font-medium text-white">Due in 24 days.</span> Start preparing your agenda and notice now.
    </p>
    <div className="flex flex-wrap items-center gap-3">
      <Button className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-lg shadow-cyan-600/20">
        Generate AGM checklist
      </Button>
      <Button variant="outline" className="rounded-lg border-white/10 text-slate-300 hover:bg-white/5">
        View tasks
      </Button>
    </div>
  </CardContent>
</Card>
```

Rules:

- Use glassmorphic card styling.
- Left: title (text-white) + description (text-slate-400).
- Right: dark glass status pill with colored border.
- Body: one short explanatory paragraph + 1–2 key actions (cyan primary, ghost secondary).

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

Form rules for dark theme:

- Use shadcn Form, FormField, Label, Input, Select, etc.
- Prefer single-column forms with clear grouping.
- Each field:
  - Label: `text-sm font-medium text-slate-300`
  - Input: Dark glass style `bg-slate-800/80 border-white/10 text-white`
  - Optional help text: `text-xs text-slate-500`

Example:

```tsx
<div className="space-y-1.5">
  <Label htmlFor="schemeName" className="text-sm font-medium text-slate-300">
    Scheme name
  </Label>
  <Input
    id="schemeName"
    placeholder="e.g. Pinecrest Apartments"
    className="rounded-lg bg-slate-800/80 border-white/10 text-white placeholder:text-slate-500 focus:ring-cyan-500/50 focus:border-cyan-500/50"
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