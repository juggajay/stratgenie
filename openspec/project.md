# Project Context

## Purpose

**Autonomous Strata Manager (ASM)** is a SaaS platform for New South Wales (NSW) strata schemes, focused on:

- Helping **self-managed and small schemes (2–50 lots)** stay compliant with:
  - Strata Schemes Management Act 2015 (SSMA 2015)
  - NSW Strata Hub reporting
  - Capital Works Fund planning (new standard form, 2026+)
- Acting as a **"fractional digital strata manager"** for volunteer committees:
  - Automating administrative and reporting workflows
  - Drafting agendas, minutes, levy notices, and routine correspondence
  - Tracking key compliance dates and obligations
- Providing **AI-assisted agents** (e.g. Secretary, Treasurer, Guardian) that:
  - Interpret bylaws and prior decisions (with citations)
  - Guide users, but always require a human approval step for legal/financial actions

**Primary User:** Volunteer Secretary / Committee member with limited time, limited legal knowledge, who wants to "not break the law" while keeping management costs under control.

---

## Tech Stack

### Languages
- **TypeScript** (strict mode, end-to-end)

### Frontend
- **Next.js 15** (App Router)
- **React Server Components** where appropriate
- **Tailwind CSS** for styling
- **shadcn/ui** as the component library
- **Zod** for schema validation on forms and API boundaries

### Backend
- **Convex** as the primary backend:
  - Data storage and queries
  - Actions/mutations as the main server execution model
  - Real-time where useful (e.g. dashboards, task lists)
- **LangGraph / agentic workflows**:
  - Agents implemented as graphs that call Convex functions
  - Agents live on the backend; frontends interact via Convex actions

### Infrastructure / Hosting
- **Vercel** for Next.js hosting
- **Convex Cloud** for backend/data
- Region preference: **Australia** (data residency preference for strata committees)
- Email provider: TBD (likely Resend/Postmark/etc.)
- File storage: Convex file storage or external blob provider (TBD)

### AI Providers
- **Anthropic / Claude** as the primary LLM (used via Claude Code for development and in-app features)
- May use **OpenAI or other providers** for:
  - Embeddings
  - Moderation
  - Specialized models (if needed)

---

## Project Conventions

### Code Style

- Use **TypeScript strict mode** and avoid `any` unless absolutely necessary.
- Prefer **functional, stateless components** where possible.
- All public Convex functions should:
  - Be fully typed
  - Validate input with Zod or equivalent schema
  - Enforce auth and authorization at the top of the function

### Naming Conventions

Domain language preferred:
- Entities: `Scheme`, `Lot`, `Owner`, `LevyNotice`, `Invoice`, `StrataHubAnnualReport`
- Queries: `getSchemeById`, `listInvoicesForScheme`
- Mutations: `createScheme`, `approveInvoice`
- Actions: `generateStrataHubPayload`, `runAgmWorkflow`

### File / Folder Structure

```
convex/
  schema.ts          # Convex schema
  schemes.ts         # Scheme CRUD + domain logic
  owners.ts          # Owners, lots, contact info
  invoices.ts        # Invoice lifecycle
  compliance.ts      # AGM dates, Strata Hub, tasks
  agents/            # Agent graphs and orchestration

app/
  (marketing)/       # Public pages/landing
  (auth)/            # Sign in/up
  (dashboard)/schemes/[schemeId]/...

lib/
  types/             # Shared types
  utils/             # Generic utilities
  validation/        # Zod schemas

openspec/
  project.md         # This file
  specs/             # Domain and workflow specs
  changes/           # Proposals and deltas
```

### Linting & Formatting
- **ESLint** with Next.js + TypeScript config
- **Prettier** for formatting
- Consistent imports with aliasing: `@/lib/...`, `@/components/...`

---

## Architecture Patterns

### High-Level Architecture
- **Single codebase, TypeScript everywhere**
- **Convex as source of truth** for schema, backend types, client types (via generated code)
- **Next.js App Router** for UI with route groups for app sections

### Domain-Driven Structure
Group code by **domain, not technical layer**:
- `convex/schemes.ts` – CRUD + domain logic for schemes
- `convex/owners.ts` – owners, lots, contact info
- `convex/compliance.ts` – AGM dates, Strata Hub data, tasks
- `convex/invoices.ts` – invoice lifecycle
- `convex/agents/*.ts` – agent workflows (Secretary, Treasurer, Guardian)

### Agents & Workflows
Agents are **narrow, task-oriented** workflows (not generic chatbots):
- **Secretary agent:** AGM agenda, notices, minutes, Strata Hub reporting checklist
- **Treasurer agent:** Invoice intake, levy notices, payment workflows
- **Guardian agent:** Bylaw Q&A and governance guardrails

Each agent:
- Operates on **explicit Convex data** (no hidden state)
- Produces **draft outputs** (documents, emails, tasks)
- Requires a **human approval step** for actions with legal/financial consequences

### Multi-Tenancy & Access Control
- Enforced by **schemeId**: every domain object belongs to a scheme
- All queries/mutations must check scheme membership and user role
- Roles: `owner`, `committee_member`, `secretary`, `treasurer`, `viewer`
- Access rules are **backend-enforced** in Convex; frontend never relies on UI-only restrictions

### Convex Node.js Runtime Pattern
When using Node.js-specific libraries (e.g., `unpdf` for PDF extraction):
- **Only actions** can use Node.js runtime (mutations/queries run in V8 isolate)
- Add `"use node";` directive at the **top** of the file
- Split Node.js actions into separate files (e.g., `convex/actions/guardian.ts`)
- Keep mutations/queries in main module files without the directive
- Reference actions via `api.actions.[module].[function]` path

---

## Testing Strategy

### Approach
Start with **practical, high-value tests**, then expand:
- Convex unit/integration tests for:
  - Critical compliance logic (AGM dates, overdue detection)
  - Invoice lifecycle (created → approved → payable)
- Lightweight tests around agent workflows (e.g. "workflow must create a StrataHubAnnualReportDraft record, not submit directly")
- Use **type-safety and Zod** as the first line of defense

---

## Git Workflow

### Branching
- `main`: Always deployable, protected, changes via PR
- Feature branches: Named by scope (e.g. `feature/agm-workflow`, `feature/invoice-intake`)
- Solo-dev workflow: PRs for significant changes, small focused commits

### Commit Messages
Clear, descriptive format:
- `feat: add basic scheme model and onboarding flow`
- `chore: configure Convex schema and auth`
- `fix: correct AGM overdue calculation`

---

## Domain Context

### NSW Strata Regulatory Environment
- **SSMA 2015** (Strata Schemes Management Act 2015) governs all strata operations
- **Strata Hub** is NSW government's digital reporting portal
- **Capital Works Fund** requirements change in April 2026 (new standard form)

### Key Domain Entities
- **Scheme** – A strata plan (SP12345), the top-level tenant
- **Lot** – Individual unit within a scheme
- **Owner** – Person/entity owning a lot
- **Levy** – Periodic contribution to Admin Fund or Capital Works Fund
- **AGM** – Annual General Meeting (mandatory, strict notice periods)
- **Strata Hub Report** – Annual submission to NSW government

### Critical Workflows
1. AGM + Strata Hub annual reporting
2. Invoice intake → approval → payment
3. Bylaw Q&A (Guardian agent)
4. Levy calculation and notices

---

## Important Constraints

### Security
- Strong isolation between schemes (multi-tenancy)
- No cross-scheme data access without explicit linking
- Use established auth provider (e.g. Clerk/Auth0/Convex auth)

### Compliance & Liability
- The system is an **administrative tool, not a legal adviser**
- Every legal/financial output must follow: **Draft → Human Review → Final**
- All UIs must clearly distinguish draft vs final status

### Performance & UX
- Simple, clear flows over "feature-rich" complexity
- Focus on Volunteer Secretary needs:
  - Clear tasks
  - Simple dashboards ("traffic light" compliance indicators)
  - Natural language commands where possible

---

## External Dependencies

### Government Systems
- **NSW Strata Hub** – Annual reporting submissions
- **ABR (Australian Business Register)** – ABN/GST validation for invoices

### Planned Integrations (TBD)
- Email provider (Resend/Postmark)
- File storage (Convex or external blob provider)
- Payment processing (if applicable)

---

## AI Assistant Guidelines

### When Using AI Coding Assistants

Always point AI to:
- `openspec/project.md` (this file)
- Relevant `openspec/specs/*.md`
- `convex/schema.ts`
- Any existing domain modules involved

When asking for code:
- Specify **exact file paths** and **constraints**
- Favor small, incremental changes over massive rewrites
- No new dependencies unless justified

AI is allowed to:
- Generate new Convex queries/mutations/actions following conventions
- Scaffold Next.js pages/components using shadcn + Tailwind
- Propose refactors **only** when behavior stays identical

AI should not:
- Bypass domain rules (e.g., submitting Strata Hub reports without draft/approval)
- Introduce side effects or cross-scheme data access without explicit requirements
