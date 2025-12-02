# Change: AGM & Strata Hub Compliance MVP

## Why

Volunteer committees often do not know:
- When their next AGM is due
- When their Strata Hub annual report must be submitted
- What concrete steps they must take to stay compliant

This leads to stress, last-minute scrambling, or non-compliance.

This change delivers:
- A clear, always-visible compliance status for each scheme
- A checklist of upcoming obligations tied to real dates
- The first "win" for the Secretary agent as a digital helper

## What Changes

- **Scheme entity**: Add AGM and Strata Hub date tracking fields
- **Compliance status**: Derive traffic-light status (on_track / due_soon / overdue) per obligation
- **ComplianceTask**: New entity for tracking AGM preparation steps
- **Dashboard**: Compliance card showing status and upcoming dates
- **Generate AGM checklist**: Action to create draft tasks for Secretary

**Out of scope (for now):**
- Actual generation of AGM notice/agenda documents
- Full Strata Hub JSON payload generation/submission
- Capital Works Fund standard form implementation
- Email sending flows

## Impact

- Affected specs: `schemes`, `compliance`
- Affected code:
  - `convex/schema.ts` (new fields and table)
  - `convex/schemes.ts` (date setters)
  - `convex/compliance.ts` (status calculation, checklist generation)
  - `app/(dashboard)/schemes/[schemeId]/` (compliance card component)

## Risks & Considerations

- Must not give a false sense of compliance – wording must emphasize that this is guidance, not legal advice
- Date calculations must be correct and thoroughly tested, as they anchor future workflows
- Must ensure multi-tenancy and role-based access are enforced on all new endpoints

## Acceptance Criteria

- For a scheme with valid dates, the dashboard shows:
  - AGM status + next due date
  - Strata Hub status + next due date
- For a scheme with missing data, the UI clearly indicates what needs to be set up (e.g. "Add your last AGM date")
- A Secretary can click "Generate AGM checklist" and see draft tasks created for that scheme only
- All new Convex functions are covered by tests for:
  - Date calculations (on time / due soon / overdue)
  - Role-based access
  - Scheme isolation
