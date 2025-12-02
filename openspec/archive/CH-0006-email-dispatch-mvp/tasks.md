# Implementation Tasks

## 1. Setup & Configuration

- [ ] 1.1 Install Resend SDK
  - `npm install resend`
- [ ] 1.2 Add `RESEND_API_KEY` to Convex Dashboard environment variables
- [ ] 1.3 Verify Resend account and sending domain (or use test mode)

## 2. Shared Utilities

- [ ] 2.1 Create `lib/email-templates.ts`
  - Extract `generateLevyNoticeHTML` from `levy-run-details-dialog.tsx`
  - Export as reusable function
  - Add scheme name parameter support
- [ ] 2.2 Create `lib/email-utils.ts`
  - `isValidEmail(email: string): boolean` - basic email validation
  - `formatEmailSubject(schemeName: string, periodLabel: string): string`

## 3. Backend - Email Action

- [ ] 3.1 Create `convex/actions/email.ts`
  - Add `"use node";` directive for Resend SDK
  - Implement `sendEmail` action
    - Args: `to`, `subject`, `html`, `replyTo?`
    - Returns: `{ success, messageId?, error? }`
  - Handle Resend API errors gracefully

## 4. Backend - Levy Issue Flow

- [ ] 4.1 Create `convex/actions/levyEmail.ts`
  - Implement `sendLevyNoticeEmail` action
    - Takes `invoiceId`, `schemeId`
    - Fetches invoice, lot, levy run, scheme data
    - Generates HTML using template
    - Calls `sendEmail` action
    - Returns result
- [ ] 4.2 Update `convex/levies.ts` - `issueLevyRun` mutation
  - Add pre-flight check: count invoices with/without emails
  - Return `{ totalInvoices, withEmail, withoutEmail }` for confirmation
- [ ] 4.3 Create `convex/levies.ts` - `confirmIssueLevyRun` mutation
  - Loop through invoices with valid emails
  - Schedule `sendLevyNoticeEmail` for each
  - Update levy run status to "issued"
  - Update invoice status to "sent" with `sentAt` timestamp
  - Return `{ sent, skipped, failed }` summary

## 5. Frontend - Issue Confirmation Dialog

- [ ] 5.1 Create `components/levies/issue-confirmation-dialog.tsx`
  - Props: `levyRunId`, `open`, `onOpenChange`, `onConfirm`
  - Query to get invoice counts (with/without email)
  - Display confirmation message:
    - "This will send levy notices to X owners via email."
    - Warning if any owners missing email
  - Cancel and "Send Now" buttons
  - Loading state during send

## 6. Frontend - Integration

- [ ] 6.1 Update `components/levies/levy-runs-list.tsx`
  - Replace direct `issueLevyRun` call with dialog flow
  - Add state for issue confirmation dialog
  - Wire up "Issue" button to open dialog
- [ ] 6.2 Add success/error toast notifications
  - Success: "3 emails sent, 1 skipped (missing email)"
  - Error: "Failed to send emails. Please try again."

## 7. Backend - Query Updates

- [ ] 7.1 Add `convex/levies.ts` - `getIssuePreview` query
  - Input: `levyRunId`
  - Returns: `{ totalInvoices, withEmail, withoutEmail, emails: string[] }`
  - Used by confirmation dialog

## 8. Testing

- [ ] 8.1 Test email generation
  - Verify HTML template renders correctly
  - Test with various lot/owner data combinations
- [ ] 8.2 Test issue flow
  - Test with all owners having emails
  - Test with some owners missing emails
  - Test with no owners having emails
- [ ] 8.3 Test email delivery (manual)
  - Send test email to personal address
  - Verify formatting and content

## 9. Validation

- [ ] 9.1 Run `openspec validate CH-0006-email-dispatch-mvp --strict`
- [ ] 9.2 Run ESLint and fix any issues
- [ ] 9.3 Run TypeScript compiler and fix any type errors
