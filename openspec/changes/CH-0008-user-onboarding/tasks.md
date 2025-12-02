# Implementation Tasks

## 1. Backend Schema

- [ ] 1.1 Update `convex/schema.ts`: Add `users` table
  - Fields: `tokenIdentifier`, `email`, `name`, `createdAt`, `lastLoginAt`
  - Index by `tokenIdentifier`
- [ ] 1.2 Update `convex/schema.ts`: Add `userSchemes` table
  - Fields: `userId`, `schemeId`, `role`, `joinedAt`
  - Index by `userId`, `schemeId`, and composite
- [ ] 1.3 Update `convex/schema.ts`: Add `trialEndsAt` to `schemes` table
  - Optional timestamp field

## 2. User Sync (Backend)

- [ ] 2.1 Create `convex/users.ts` module
- [ ] 2.2 Implement `store` mutation
  - Accept identity from `ctx.auth`
  - Upsert user by `tokenIdentifier`
  - Update `lastLoginAt` on existing users
  - Return user record
- [ ] 2.3 Implement `currentUser` query
  - Return current authenticated user with their schemes
  - Return null if not authenticated
- [ ] 2.4 Implement `getUserSchemes` query
  - Return all schemes user has access to with role info

## 3. Scheme Creation with Trial

- [ ] 3.1 Update `convex/schemes.ts` - Modify `create` mutation
  - Accept `userId` parameter
  - Set `trialEndsAt` to 14 days from now
  - Create `userSchemes` record with role 'admin'
- [ ] 3.2 Implement `getTrialStatus` query
  - Return days remaining, `isExpired` boolean
  - Handle null `trialEndsAt` (paid/grandfathered)

## 4. Onboarding Wizard (Frontend)

- [ ] 4.1 Create `app/onboarding/page.tsx`
  - Multi-step wizard component
  - Check if user already has schemes → redirect to dashboard
- [ ] 4.2 Create `components/onboarding/scheme-form.tsx`
  - Step 1: Strata Plan Number + Address
  - Step 2: Number of lots
  - Step 3: Confirmation
- [ ] 4.3 Wire up form to `api.schemes.create`
  - On success, redirect to `/dashboard`
- [ ] 4.4 Add loading and error states

## 5. Route Protection (Frontend)

- [ ] 5.1 Create `hooks/useRequireAuth.ts`
  - Redirect to sign-in if not authenticated
  - Return loading state while checking
- [ ] 5.2 Create `hooks/useRequireScheme.ts`
  - Redirect to `/onboarding` if user has no schemes
  - Return loading state while checking
- [ ] 5.3 Update `app/dashboard/layout.tsx`
  - Add user sync on mount
  - Add scheme requirement check
  - Add trial expiry check
- [ ] 5.4 Create redirect logic for expired trials
  - Redirect to `/billing` if trial expired

## 6. Trial Banner (Frontend)

- [ ] 6.1 Create `components/dashboard/trial-banner.tsx`
  - Display days remaining in trial
  - "Upgrade now" CTA button
  - Dismissible but reappears on next session
- [ ] 6.2 Integrate banner into dashboard layout
  - Show only when `trialEndsAt` is set and not expired
  - Different styling for < 3 days remaining

## 7. User Sync Hook (Frontend)

- [ ] 7.1 Create `hooks/useUserSync.ts`
  - Call `api.users.store` when authenticated
  - Run once per session (use localStorage flag)
  - Return user data and loading state
- [ ] 7.2 Integrate into `ConvexClientProvider` or dashboard layout

## 8. Testing

- [ ] 8.1 Test user creation on first login
  - Verify user record created with correct data
- [ ] 8.2 Test user update on subsequent login
  - Verify `lastLoginAt` updated, no duplicate records
- [ ] 8.3 Test scheme creation with trial
  - Verify `trialEndsAt` set correctly
  - Verify `userSchemes` record created with 'admin' role
- [ ] 8.4 Test route protection
  - Unauthenticated → sign-in
  - No schemes → onboarding
  - Expired trial → billing
- [ ] 8.5 Test onboarding wizard flow
  - Complete flow creates scheme and redirects

## 9. Validation

- [ ] 9.1 Run `openspec validate CH-0008-user-onboarding --strict`
- [ ] 9.2 Run ESLint and fix any issues
- [ ] 9.3 Run TypeScript compiler and fix type errors
