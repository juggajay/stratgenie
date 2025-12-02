# Design: User Onboarding & Free Trial

## Architecture Overview

This change introduces the first user-centric data layer. Currently, the app is "scheme-centric" - you pick a scheme and work within it. After this change, the flow becomes:

```
Clerk Auth → User Sync → Scheme Selection/Creation → Dashboard
```

## Key Design Decisions

### 1. User Sync Strategy: Client-Side vs Webhook

**Options considered:**

| Approach | Pros | Cons |
|----------|------|------|
| Clerk Webhooks | Real-time, reliable, handles edge cases | Complex setup, requires endpoint, harder to debug |
| Client-side sync | Simple, immediate, easy to implement | Runs on every page load, slight latency |

**Decision: Client-side sync (MVP)**

For MVP, we'll use a client-side `useEffect` that calls `api.users.store` on authenticated pages. This pattern:
- Checks if user exists by `tokenIdentifier`
- Creates if missing, updates `lastLogin` if present
- Returns user record with their scheme memberships

This can be upgraded to webhooks later if needed.

### 2. User-Scheme Relationship

**Current state:** No relationship - schemes exist independently.

**New model:**

```
User (1) ←——owns——→ (N) UserScheme (N) ←——→ (1) Scheme
```

The `userSchemes` join table tracks:
- `userId`: Reference to user
- `schemeId`: Reference to scheme
- `role`: 'admin' | 'member' | 'viewer'
- `joinedAt`: When access was granted

**Why a join table?**
- Supports multiple users per scheme (future: invite codes)
- Supports multiple schemes per user
- Tracks role/permissions per relationship
- Clean audit trail

### 3. Onboarding Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     /onboarding                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1: Scheme Details                                      │
│  ┌────────────────────────────────────────┐                 │
│  │ What is your Strata Plan Number?       │                 │
│  │ [SP_______________]                    │                 │
│  │                                        │                 │
│  │ What is the scheme address?            │                 │
│  │ [____________________________]         │                 │
│  └────────────────────────────────────────┘                 │
│                                              [Next →]       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 2: Scheme Size                                         │
│  ┌────────────────────────────────────────┐                 │
│  │ How many lots are in your scheme?      │                 │
│  │ [___] lots                             │                 │
│  │                                        │                 │
│  │ (This helps us set up your strata roll)│                 │
│  └────────────────────────────────────────┘                 │
│                                   [← Back] [Next →]         │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 3: Confirm                                             │
│  ┌────────────────────────────────────────┐                 │
│  │ Ready to create your scheme!           │                 │
│  │                                        │                 │
│  │ SP12345                                │                 │
│  │ 123 Example Street, Sydney             │                 │
│  │ 6 lots                                 │                 │
│  │                                        │                 │
│  │ Your 14-day free trial starts now.     │                 │
│  └────────────────────────────────────────┘                 │
│                           [← Back] [Create Scheme →]        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4. Trial Logic

**Trial period:** 14 days from scheme creation.

**Storage:** `trialEndsAt` timestamp on the `schemes` table.

**Enforcement:**
1. Banner in dashboard shows days remaining
2. After trial expires, middleware redirects to `/billing`
3. Stripe subscription clears the trial flag

**Edge cases:**
- User creates multiple schemes: Each scheme has independent trial
- User is invited to existing scheme: Inherits that scheme's trial status
- Trial expires mid-session: Next navigation triggers redirect

### 5. Route Protection Matrix

| Route | Requires Auth | Requires Scheme | Requires Active Trial |
|-------|--------------|-----------------|----------------------|
| `/` | No | No | No |
| `/signup` | No | No | No |
| `/onboarding` | Yes | No | No |
| `/dashboard/*` | Yes | Yes | Yes |
| `/billing` | Yes | No | No |

## Data Model Changes

### New: `users` table

```typescript
users: defineTable({
  tokenIdentifier: v.string(),  // Clerk user ID (e.g., "clerk|user_xxx")
  email: v.string(),
  name: v.optional(v.string()),
  createdAt: v.number(),
  lastLoginAt: v.number(),
})
  .index("by_token", ["tokenIdentifier"])
```

### New: `userSchemes` table

```typescript
userSchemes: defineTable({
  userId: v.id("users"),
  schemeId: v.id("schemes"),
  role: v.union(v.literal("admin"), v.literal("member"), v.literal("viewer")),
  joinedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_scheme", ["schemeId"])
  .index("by_user_and_scheme", ["userId", "schemeId"])
```

### Modified: `schemes` table

Add field:
```typescript
trialEndsAt: v.optional(v.number()),  // timestamp, null = paid/grandfathered
```

## Security Considerations

1. **Token verification**: Always verify Clerk token server-side via `ctx.auth`
2. **Scheme access**: All scheme queries must check `userSchemes` membership
3. **Role enforcement**: Admin-only actions (e.g., delete scheme) check role
4. **Trial bypass prevention**: Trial check happens in Convex, not just frontend
