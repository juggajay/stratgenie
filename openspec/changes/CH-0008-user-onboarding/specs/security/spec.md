# security Specification (Delta)

## Purpose

Manages user identity, authentication state, and access control for strata schemes.

## ADDED Requirements

### Requirement: User Identity Synchronization

The system SHALL synchronize authenticated Clerk users into the local `users` table.

Fields:
- `tokenIdentifier`: Clerk user identifier (unique)
- `email`: User's email address
- `name`: User's display name (optional)
- `createdAt`: Timestamp of first sync
- `lastLoginAt`: Timestamp of most recent sync

#### Scenario: First-time user login

- **GIVEN** a user authenticates via Clerk for the first time
- **WHEN** the system processes the authentication
- **THEN** the system SHALL create a new record in the `users` table
- **AND** `createdAt` SHALL be set to the current timestamp
- **AND** `lastLoginAt` SHALL be set to the current timestamp

#### Scenario: Returning user login

- **GIVEN** a user who already exists in the `users` table authenticates
- **WHEN** the system processes the authentication
- **THEN** the system SHALL update `lastLoginAt` to the current timestamp
- **AND** SHALL NOT create a duplicate user record

#### Scenario: Unauthenticated access attempt

- **GIVEN** a visitor who is not authenticated
- **WHEN** they attempt to access a protected route
- **THEN** the system SHALL redirect to the sign-in page

---

### Requirement: User-Scheme Relationship

The system SHALL track which users have access to which schemes via the `userSchemes` table.

Fields:
- `userId`: Reference to user
- `schemeId`: Reference to scheme
- `role`: One of 'admin', 'member', 'viewer'
- `joinedAt`: Timestamp of when access was granted

#### Scenario: User creates a new scheme

- **GIVEN** an authenticated user
- **WHEN** they create a new scheme via onboarding
- **THEN** the system SHALL create a `userSchemes` record
- **AND** the `role` SHALL be set to 'admin'
- **AND** `joinedAt` SHALL be set to the current timestamp

#### Scenario: User with no schemes accesses dashboard

- **GIVEN** an authenticated user with no entries in `userSchemes`
- **WHEN** they attempt to access `/dashboard`
- **THEN** the system SHALL redirect to `/onboarding`

#### Scenario: User queries their accessible schemes

- **GIVEN** an authenticated user with access to multiple schemes
- **WHEN** they query for their schemes
- **THEN** the system SHALL return all schemes where a `userSchemes` record exists for their userId
- **AND** each result SHALL include the user's role for that scheme

---

### Requirement: Free Trial Period

The system SHALL enforce a 14-day free trial period for new schemes.

Fields on `schemes` table:
- `trialEndsAt`: Timestamp when trial expires (nullable)

#### Scenario: New scheme creation sets trial period

- **GIVEN** a user creates a new scheme
- **WHEN** the scheme is created
- **THEN** `trialEndsAt` SHALL be set to 14 days from the current timestamp

#### Scenario: Active trial access

- **GIVEN** a scheme with `trialEndsAt` in the future
- **WHEN** a user attempts to access the dashboard
- **THEN** access SHALL be granted
- **AND** a trial status banner SHALL be displayed

#### Scenario: Expired trial access

- **GIVEN** a scheme with `trialEndsAt` in the past
- **AND** no active subscription
- **WHEN** a user attempts to access the dashboard
- **THEN** the system SHALL redirect to `/billing`

#### Scenario: Paid scheme access (no trial restriction)

- **GIVEN** a scheme with `trialEndsAt` set to null (paid or grandfathered)
- **WHEN** a user attempts to access the dashboard
- **THEN** access SHALL be granted
- **AND** no trial banner SHALL be displayed

---

### Requirement: Onboarding Flow

The system SHALL provide an onboarding wizard for new users to create their first scheme.

#### Scenario: New user completes onboarding

- **GIVEN** an authenticated user with no schemes
- **WHEN** they complete the onboarding wizard with valid data
- **THEN** the system SHALL create a new scheme
- **AND** SHALL link the user to the scheme as 'admin'
- **AND** SHALL redirect to `/dashboard`

#### Scenario: User with existing scheme visits onboarding

- **GIVEN** an authenticated user who already owns a scheme
- **WHEN** they navigate to `/onboarding`
- **THEN** the system SHALL redirect to `/dashboard`
