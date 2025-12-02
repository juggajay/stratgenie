# Communications Capability

This capability handles outbound communications to lot owners, starting with email dispatch for levy notices.

---

## ADDED Requirements

### Requirement: Email Dispatch Service

The system SHALL provide an email dispatch service using the Resend API for sending transactional emails to lot owners.

#### Scenario: Send levy notice email

GIVEN a levy invoice with a valid owner email address
AND the Resend API key is configured
WHEN the `sendLevyNoticeEmail` action is invoked
THEN the system generates an HTML email from the levy notice template
AND sends the email via Resend API
AND returns a success result with the message ID

#### Scenario: Handle missing email address

GIVEN a levy invoice where the lot owner has no email address
WHEN attempting to send a levy notice
THEN the system skips the invoice
AND increments the "skipped" count in the summary

#### Scenario: Handle email delivery failure

GIVEN a levy invoice with a valid owner email address
AND the Resend API returns an error
WHEN the `sendLevyNoticeEmail` action is invoked
THEN the system logs the error
AND returns a failure result with the error message
AND the invoice status remains unchanged

---

### Requirement: Levy Notice Email Template

The system SHALL use a consistent HTML email template for levy notices that includes all required billing information.

#### Scenario: Generate levy notice HTML

GIVEN a levy invoice, levy run, and scheme information
WHEN generating the email content
THEN the email includes:
  - Scheme name and identifier
  - Lot number and owner name
  - Amount due prominently displayed
  - Due date highlighted
  - Levy period label
  - Fund type (Admin or Capital Works)
  - Calculation breakdown (total budget, unit entitlement, percentage share)
  - Generation timestamp

#### Scenario: Email subject line format

GIVEN a levy run for "Sunrise Apartments SP12345" with period "Q1 2026"
WHEN generating the email subject
THEN the subject is "Levy Notice: Sunrise Apartments SP12345 - Q1 2026"

---

### Requirement: Issue Levy Run with Email Dispatch

The system SHALL send levy notice emails to all eligible owners when a levy run is issued.

#### Scenario: Issue levy run with all owners having emails

GIVEN a levy run with 5 invoices
AND all 5 lot owners have valid email addresses
WHEN the user confirms issuing the levy run
THEN the system sends 5 emails
AND updates all invoice statuses to "sent"
AND sets `sentAt` timestamp on each invoice
AND updates the levy run status to "issued"
AND returns summary `{ sent: 5, skipped: 0, failed: 0 }`

#### Scenario: Issue levy run with some owners missing emails

GIVEN a levy run with 5 invoices
AND 3 lot owners have valid email addresses
AND 2 lot owners have no email address
WHEN the user confirms issuing the levy run
THEN the system sends 3 emails
AND updates 3 invoice statuses to "sent"
AND leaves 2 invoice statuses as "pending"
AND updates the levy run status to "issued"
AND returns summary `{ sent: 3, skipped: 2, failed: 0 }`

#### Scenario: Pre-flight check before issuing

GIVEN a levy run in "draft" status with 10 invoices
AND 8 owners have emails, 2 do not
WHEN the user clicks "Issue"
THEN the system displays a confirmation:
  - "This will send levy notices to 8 owners via email."
  - "2 owners will be skipped (missing email)."
  - Options: [Cancel] [Send Now]

---

## Entities

### EmailDispatchResult

```typescript
interface EmailDispatchResult {
  success: boolean;
  messageId?: string;  // Resend message ID if successful
  error?: string;      // Error message if failed
}
```

### IssueResult

```typescript
interface IssueResult {
  sent: number;     // Number of emails successfully sent
  skipped: number;  // Number skipped (no email)
  failed: number;   // Number failed (API error)
}
```

### IssuePreview

```typescript
interface IssuePreview {
  totalInvoices: number;
  withEmail: number;
  withoutEmail: number;
}
```
