# Design: Email Dispatch Architecture

## Overview

This document describes the architecture for integrating Resend email API to dispatch levy notices when a levy run is issued.

## System Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend      │     │    Convex        │     │    Resend       │
│   (React)       │     │    Backend       │     │    API          │
└────────┬────────┘     └────────┬─────────┘     └────────┬────────┘
         │                       │                        │
         │ 1. Click "Issue"      │                        │
         │ ───────────────────►  │                        │
         │                       │                        │
         │ 2. Show confirmation  │                        │
         │ ◄───────────────────  │                        │
         │                       │                        │
         │ 3. Confirm send       │                        │
         │ ───────────────────►  │                        │
         │                       │                        │
         │                       │ 4. For each invoice:   │
         │                       │    - Generate HTML     │
         │                       │    - Call Resend API   │
         │                       │ ──────────────────────►│
         │                       │                        │
         │                       │ 5. Email queued        │
         │                       │ ◄──────────────────────│
         │                       │                        │
         │                       │ 6. Update invoice      │
         │                       │    status = "sent"     │
         │                       │    sentAt = now()      │
         │                       │                        │
         │ 7. Return summary     │                        │
         │ ◄───────────────────  │                        │
         │    { sent: 2,         │                        │
         │      skipped: 1 }     │                        │
```

## Component Design

### 1. Email Action (`convex/actions/email.ts`)

```typescript
// Node.js runtime for Resend SDK
"use node";

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const sendEmail = action({
  args: { ... },
  handler: async (ctx, args): Promise<SendEmailResult> => {
    // 1. Initialize Resend client
    // 2. Send email
    // 3. Return result
  }
});
```

### 2. Issue Levy Run Flow (`convex/levies.ts`)

The `issueLevyRun` mutation will be refactored to:

1. **Validate** - Check levy run exists and is in "draft" status
2. **Count** - Get invoices with/without owner emails
3. **Dispatch** - For each invoice with email:
   - Generate HTML notice using existing template
   - Schedule `sendLevyNoticeEmail` action
   - Track success/failure
4. **Update** - Mark run as "issued", update invoice statuses
5. **Return** - Summary of sent/skipped counts

### 3. Email Template

Reuse the `generateLevyNoticeHTML` function from `levy-run-details-dialog.tsx`:

```typescript
function generateLevyNoticeHTML(
  invoice: LevyInvoice,
  levyRun: LevyRun,
  schemeName: string
): string
```

Move this to a shared utility: `lib/email-templates.ts`

### 4. Frontend Confirmation Flow

```
┌─────────────────────────────────────┐
│         Issue Levy Run?             │
├─────────────────────────────────────┤
│                                     │
│  This will send levy notices to     │
│  3 lot owners via email.            │
│                                     │
│  ⚠️ 1 owner has no email and will   │
│     be skipped.                     │
│                                     │
├─────────────────────────────────────┤
│  [Cancel]              [Send Now]   │
└─────────────────────────────────────┘
```

## Configuration

### Environment Variables

| Variable | Description | Where |
|----------|-------------|-------|
| `RESEND_API_KEY` | Resend API key | Convex Dashboard |

### Resend Setup

1. Create Resend account at resend.com
2. Verify sending domain (or use test domain)
3. Generate API key
4. Add to Convex environment variables

## Email Format

### Subject Line
```
Levy Notice: [Scheme Name] - [Period Label]
```

Example: `Levy Notice: Sunrise Apartments SP12345 - Q1 2026`

### From Address
```
[Scheme Name] <levies@yourdomain.com>
```

### Reply-To
```
[Scheme Admin Email] (if available)
```

## Error Handling

| Error | Handling |
|-------|----------|
| Invalid API key | Fail fast, return error to user |
| Rate limit | Resend queues automatically |
| Invalid email | Skip, increment `skipped` count |
| Network error | Retry once, then mark as failed |

## Data Model Updates

### LevyInvoice (existing)

Add tracking for email delivery:

```typescript
// Already exists:
status: "pending" | "sent" | "paid"
sentAt?: number  // timestamp when email was sent

// Optional future enhancement:
emailMessageId?: string  // Resend message ID for tracking
```

## Security Considerations

1. **API Key Protection** - Stored in Convex environment, never exposed to client
2. **Email Validation** - Basic format check before sending
3. **Rate Limiting** - Resend handles this, but we send sequentially
4. **No PII Logging** - Don't log email addresses in console

## Testing Strategy

1. **Unit Tests** - Mock Resend API, test email generation
2. **Integration** - Use Resend test mode (emails logged, not sent)
3. **Manual** - Test with real emails to verify delivery

## Future Enhancements (Out of Scope)

- PDF attachment instead of HTML body
- Delivery webhooks (track opens, bounces)
- Email templates editor
- Scheduled sending
- Bulk retry for failed emails
