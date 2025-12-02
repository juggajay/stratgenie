# Change: User Onboarding & Free Trial

## Why

Currently, we have public marketing (CH-0007) and internal tools (CH-0001-0006), but no bridge between them. New users currently land in a void after signing up via Clerk. We need to guide them to "Success" (their first Dashboard view).

The system currently has:
- **No `users` table** - Clerk handles auth, but we don't persist user data in Convex
- **No onboarding flow** - Users who sign up have no guidance
- **No trial logic** - No mechanism to enforce the 14-day free trial before payment

Without this change, the marketing page CTAs lead nowhere meaningful.

## What Changes

### New Entities

1. **User** (new `security` capability)
   - Syncs Clerk identity into Convex for local queries
   - Tracks user profile (name, email, tokenIdentifier)
   - Links to owned/accessible schemes
   - Tracks subscription status and trial period

### New Features

1. **Identity Synchronization**
   - When a user authenticates, automatically sync to `users` table
   - Update `lastLogin` on subsequent visits

2. **Onboarding Wizard** (`/onboarding`)
   - Step-by-step flow for new users to create their first scheme
   - Step 1: "What is your Strata Plan Number?"
   - Step 2: "How many lots are in your scheme?"
   - Step 3: "Confirm and create"

3. **Free Trial Logic**
   - On scheme creation, set `trialEndsAt` to `Date.now() + 14 days`
   - Display trial status banner in dashboard
   - Block access after trial ends (redirect to billing)

4. **Route Protection**
   - `/dashboard/*` requires authenticated user with at least one scheme
   - Redirect to `/onboarding` if user has no schemes

## Impact

- **New specs**: `security` (new capability)
- **Modified specs**: `schemes` (adds `trialEndsAt` field)
- **Affected code**:
  - `convex/schema.ts` - new `users` table, modified `schemes` table
  - `convex/users.ts` - new module for user sync
  - `app/onboarding/page.tsx` - new onboarding wizard
  - `app/dashboard/layout.tsx` - route protection logic
  - `components/dashboard/trial-banner.tsx` - trial status UI
