# Change CH-0006: Email Dispatch (Resend Integration)

## Summary

Upgrade the "Issue" button on Levy Runs to dispatch real emails to all lot owners, transforming "Issue" from a status change into actual bill delivery.

## Why

Currently, "Issuing" a levy run is just a database status change. Users expect "Issue" to mean "Send the bill." The current workflow requires manually:
1. Downloading 20+ individual PDF notices
2. Opening email client
3. Composing individual emails with attachments
4. Sending one by one

This is tedious, error-prone, and defeats the purpose of automated levy generation.

## What

### Integration
- Connect **Resend** API for transactional email delivery
- Use HTML email body with styled levy notice (same template as PDF preview)

### Backend Changes
- New `sendLevyNoticeEmail` action in `convex/actions/email.ts`
- Update `issueLevyRun` mutation to:
  - Loop through invoices with valid owner emails
  - Schedule email dispatch for each
  - Return summary count `{ sent: N, skipped: M }`
  - Update invoice status to "sent" with timestamp

### Frontend Changes
- Update "Issue" button to show confirmation dialog:
  - "This will send levy notices to X owners. Proceed?"
  - Show count of owners without emails (will be skipped)
- Show "Sending..." spinner during dispatch
- Display success toast with result: "3 emails sent, 1 skipped (missing email)"

## Impact

### Affected Capabilities
- `finance` - Updates to levy run issuing workflow
- `communications` - New capability for email dispatch

### Dependencies
- Requires Resend API key configuration
- Requires valid "From" email address (domain verification)

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Emails go to spam | Use clear subject line: "Levy Notice for [Scheme Name] - [Period]" |
| Missing owner emails | Alert user with skip count before sending |
| Email delivery failures | Log failures, allow manual retry per invoice |
| Rate limiting | Resend handles queuing; we batch sequentially |

## Out of Scope (Future)

- PDF attachment (MVP uses inline HTML body)
- Email templates customization
- Delivery tracking/webhooks
- Bulk retry for failed emails
