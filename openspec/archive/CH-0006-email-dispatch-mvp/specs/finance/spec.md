# Finance Capability - Spec Delta

Updates to the finance capability for email dispatch integration.

---

## MODIFIED Requirements

### Requirement: Levy Run Issue Flow

The system SHALL display a confirmation dialog and dispatch emails when issuing a levy run.

**Previous behavior:** Clicking "Issue" immediately changed the levy run status from "draft" to "issued" without sending any communications.

**New behavior:** Clicking "Issue" shows a confirmation dialog and triggers email dispatch to all owners with valid email addresses.

#### Scenario: Issue button shows confirmation dialog

GIVEN a levy run in "draft" status
AND the user clicks the "Issue" button
THEN the system displays a confirmation dialog
AND shows the count of owners who will receive emails
AND shows the count of owners who will be skipped (no email)
AND provides Cancel and "Send Now" options

#### Scenario: User confirms issue

GIVEN a levy run confirmation dialog is displayed
AND the user clicks "Send Now"
THEN the system displays a "Sending..." loading state
AND dispatches emails to all owners with valid emails
AND updates the levy run status to "issued"
AND displays a success toast with the result summary
AND closes the dialog

#### Scenario: User cancels issue

GIVEN a levy run confirmation dialog is displayed
AND the user clicks "Cancel"
THEN the dialog closes
AND no emails are sent
AND the levy run remains in "draft" status

---

## ADDED Requirements

### Requirement: Issue Confirmation UI

The system SHALL display a confirmation dialog before issuing a levy run with email dispatch.

#### Scenario: Display email count in confirmation

GIVEN a levy run with 10 invoices
AND 8 lot owners have email addresses
AND 2 lot owners do not have email addresses
WHEN the confirmation dialog is displayed
THEN the dialog shows:
  - "This will send levy notices to 8 owners via email."
  - Warning: "2 owners will be skipped (missing email)."

#### Scenario: All owners have emails

GIVEN a levy run with 5 invoices
AND all 5 lot owners have email addresses
WHEN the confirmation dialog is displayed
THEN the dialog shows:
  - "This will send levy notices to 5 owners via email."
AND no warning is displayed

#### Scenario: No owners have emails

GIVEN a levy run with 3 invoices
AND no lot owners have email addresses
WHEN the confirmation dialog is displayed
THEN the dialog shows:
  - "No owners have email addresses."
  - "The levy run will be marked as issued but no emails will be sent."
AND the "Send Now" button text changes to "Issue Without Email"

---

### Requirement: Issue Result Feedback

The system SHALL display the result of the email dispatch to the user.

#### Scenario: Successful dispatch

GIVEN emails were sent successfully
WHEN the issue process completes
THEN a success toast is displayed
AND shows "3 emails sent, 1 skipped (missing email)"

#### Scenario: Partial failure

GIVEN some emails failed to send
WHEN the issue process completes
THEN a warning toast is displayed
AND shows "2 emails sent, 1 failed, 1 skipped"
