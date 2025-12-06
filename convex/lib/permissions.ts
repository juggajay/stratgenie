import { QueryCtx, MutationCtx, ActionCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Permission check result
 */
export interface AccessCheckResult {
  authorized: boolean;
  userId: Id<"users"> | null;
  role: "admin" | "member" | "viewer" | null;
}

/**
 * Check if the current user has access to a scheme.
 * Returns the user ID and role if authorized.
 *
 * @throws Error if user is not authenticated or doesn't have access
 */
export async function checkAccess(
  ctx: QueryCtx | MutationCtx,
  schemeId: Id<"schemes">
): Promise<{ userId: Id<"users">; role: "admin" | "member" | "viewer" }> {
  // Get authenticated identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  // Find user by token
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .first();

  if (!user) {
    throw new Error("User not found. Please refresh the page.");
  }

  // Check if user has access to this scheme
  const userScheme = await ctx.db
    .query("userSchemes")
    .withIndex("by_user_and_scheme", (q) =>
      q.eq("userId", user._id).eq("schemeId", schemeId)
    )
    .first();

  if (!userScheme) {
    throw new Error("Access denied: You don't have permission to access this scheme.");
  }

  return {
    userId: user._id,
    role: userScheme.role,
  };
}

/**
 * Check if user has access (non-throwing version).
 * Returns null if no access.
 */
export async function tryCheckAccess(
  ctx: QueryCtx | MutationCtx,
  schemeId: Id<"schemes">
): Promise<AccessCheckResult> {
  try {
    const result = await checkAccess(ctx, schemeId);
    return {
      authorized: true,
      userId: result.userId,
      role: result.role,
    };
  } catch {
    return {
      authorized: false,
      userId: null,
      role: null,
    };
  }
}

/**
 * Require a specific role level for an operation.
 * Admin can do everything, member can read/write, viewer can only read.
 */
export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  schemeId: Id<"schemes">,
  requiredLevel: "viewer" | "member" | "admin"
): Promise<{ userId: Id<"users">; role: "admin" | "member" | "viewer" }> {
  const { userId, role } = await checkAccess(ctx, schemeId);

  const roleHierarchy = { viewer: 0, member: 1, admin: 2 };

  if (roleHierarchy[role] < roleHierarchy[requiredLevel]) {
    throw new Error(
      `Access denied: This action requires ${requiredLevel} role, but you have ${role} role.`
    );
  }

  return { userId, role };
}

/**
 * Get the current authenticated user.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .first();
}

/**
 * Require authentication - throws if not logged in.
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx);
  if (!user) {
    throw new Error("Not authenticated");
  }
  return user;
}

/**
 * Check if user is authenticated (non-throwing).
 * Returns false if not authenticated.
 */
export async function isAuthenticated(ctx: QueryCtx | MutationCtx): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();
  return !!identity;
}
