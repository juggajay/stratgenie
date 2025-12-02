# Implementation Tasks

## 1. Backend Schema

- [x] 1.1 Update `convex/schema.ts`: Add AGM/StrataHub date fields to Scheme table
  - `lastAgmDate`, `nextAgmDueDate`
  - `lastStrataHubReportDate`, `nextStrataHubReportDueDate`
- [x] 1.2 Update `convex/schema.ts`: Add ComplianceTask table
  - Fields: `schemeId`, `type`, `status`, `dueDate`, `title`

## 2. Backend Queries

- [x] 2.1 Add `getSchemeComplianceStatus(schemeId)` query
  - Returns AGM status, StrataHub status, and relevant dates
  - Enforces scheme membership check
- [x] 2.2 Add `listComplianceTasksForScheme(schemeId)` query
  - Returns tasks filtered by schemeId
  - Enforces scheme membership check

## 3. Backend Mutations/Actions

- [x] 3.1 Add `setSchemeComplianceDates` mutation
  - Sets lastAgmDate and/or lastStrataHubReportDate
  - Calculates and sets next due dates automatically
  - Role check: secretary or committee_member
- [x] 3.2 Add `generateAgmChecklist(schemeId)` action
  - Creates draft ComplianceTask records with calculated due dates:
    - `send_agm_notice` (Due: AGM Date - 8 days, ensures 7-day statutory notice)
    - `hold_agm` (Due: AGM Date)
    - `file_strata_hub_report` (Due: AGM Date + 3 months)
  - Role check: secretary only
- [x] 3.3 Add `updateComplianceTaskStatus` mutation
  - Allows marking tasks as in_progress or done
  - Role check: secretary or committee_member

## 4. Compliance Status Logic

- [x] 4.1 Implement status calculation functions
  - `calculateComplianceStatus(dueDate, today)` → on_track | upcoming | due_soon | overdue
  - Used for both AGM and Strata Hub status
- [x] 4.2 Define thresholds (4-state system)
  - `on_track`: > 60 days remaining
  - `upcoming`: 60-30 days remaining (the "Secretary Trigger")
  - `due_soon`: < 30 days remaining (ACTION REQUIRED)
  - `overdue`: past deadline

## 5. Frontend Components

- [x] 5.1 Create `ComplianceCard` component
  - Shows AGM status + next due date
  - Shows Strata Hub status + next due date
  - Visual states: on_track (green), upcoming (blue), due_soon (amber), overdue (red)
  - Show suggested action for `upcoming` status (e.g., "Draft Agenda")
- [x] 5.2 Add ComplianceCard to scheme dashboard page
- [x] 5.3 Add "Generate AGM checklist" button
  - Calls `generateAgmChecklist` action
  - Shows success/failure toast
- [x] 5.4 Create `ComplianceTaskList` component
  - Displays tasks with type, dueDate, status
  - Allows marking tasks as done

## 6. Testing

- [x] 6.1 Unit tests for status calculation functions
  - Test all 4 states: on_track, upcoming, due_soon, overdue
  - Test boundary cases: exactly at 60 days, 30 days, 0 days
- [x] 6.2 Integration tests for `getSchemeComplianceStatus`
  - Test with valid dates, missing dates, edge cases
- [x] 6.3 Tests for `generateAgmChecklist`
  - Verify correct tasks created with calculated due dates
  - Verify `send_agm_notice` is AGM Date - 8 days
  - Verify `file_strata_hub_report` is AGM Date + 3 months
  - Verify scheme isolation (no cross-scheme task creation)
- [x] 6.4 Tests for role-based access
  - Verify only secretary can generate checklist
  - Verify scheme membership is enforced

## 7. Validation

- [x] 7.1 Run `openspec validate CH-0001-agm-compliance-mvp --strict`
- [x] 7.2 Run ESLint and fix any issues
- [x] 7.3 Run TypeScript compiler and fix any type errors
