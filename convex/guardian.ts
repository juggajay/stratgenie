import { v } from "convex/values";
import {
  mutation,
  query,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { api, internal } from "./_generated/api";
import { checkAccess, requireRole } from "./lib/permissions";

// ============================================================================
// Bylaw Queries
// ============================================================================

/**
 * Get all bylaws for a scheme.
 */
export const getBylawsForScheme = query({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    // Return empty array if not authenticated (e.g., during logout)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Verify user has access to this scheme
    await checkAccess(ctx, args.schemeId);

    return await ctx.db
      .query("bylaws")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .collect();
  },
});

/**
 * Get the active (ready) bylaw for a scheme.
 */
export const getActiveBylaw = query({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    // Return null if not authenticated (e.g., during logout)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Verify user has access to this scheme
    await checkAccess(ctx, args.schemeId);

    const bylaws = await ctx.db
      .query("bylaws")
      .withIndex("by_scheme_and_status", (q) =>
        q.eq("schemeId", args.schemeId).eq("status", "ready")
      )
      .collect();

    return bylaws[0] || null;
  },
});

/**
 * Get a single bylaw by ID.
 */
export const getBylaw = query({
  args: {
    bylawId: v.id("bylaws"),
  },
  handler: async (ctx, args) => {
    // Return null if not authenticated (e.g., during logout)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const bylaw = await ctx.db.get(args.bylawId);
    if (!bylaw) return null;

    // Verify user has access to this scheme
    await checkAccess(ctx, bylaw.schemeId);

    // Get the file URL
    const fileUrl = await ctx.storage.getUrl(bylaw.fileId);

    return {
      ...bylaw,
      fileUrl,
    };
  },
});

// ============================================================================
// Bylaw Mutations
// ============================================================================

/**
 * Generate an upload URL for a new bylaw file.
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Create a bylaw record after file upload.
 * This triggers the ingestion process.
 */
export const createBylaw = mutation({
  args: {
    schemeId: v.id("schemes"),
    fileId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify user has member role for this scheme
    await requireRole(ctx, args.schemeId, "member");

    // Validate scheme exists
    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    // Delete any existing bylaws and chunks for this scheme
    const existingBylaws = await ctx.db
      .query("bylaws")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .collect();

    for (const bylaw of existingBylaws) {
      // Delete chunks for this bylaw
      const chunks = await ctx.db
        .query("bylawChunks")
        .withIndex("by_bylaw", (q) => q.eq("bylawId", bylaw._id))
        .collect();

      for (const chunk of chunks) {
        await ctx.db.delete(chunk._id);
      }

      // Delete the bylaw file from storage
      await ctx.storage.delete(bylaw.fileId);

      // Delete the bylaw record
      await ctx.db.delete(bylaw._id);
    }

    // Create new bylaw record with processing status
    const bylawId = await ctx.db.insert("bylaws", {
      schemeId: args.schemeId,
      fileId: args.fileId,
      fileName: args.fileName,
      status: "processing",
      createdAt: Date.now(),
    });

    // Schedule the ingestion action (located in actions/guardian.ts for Node.js runtime)
    await ctx.scheduler.runAfter(0, api.actions.guardian.ingestBylaws, {
      bylawId,
    });

    return bylawId;
  },
});

/**
 * Delete a bylaw and its chunks.
 */
export const deleteBylaw = mutation({
  args: {
    bylawId: v.id("bylaws"),
  },
  handler: async (ctx, args) => {
    const bylaw = await ctx.db.get(args.bylawId);
    if (!bylaw) {
      throw new Error("Bylaw not found");
    }

    // Verify user has member role for this scheme
    await requireRole(ctx, bylaw.schemeId, "member");

    // Delete all chunks for this bylaw
    const chunks = await ctx.db
      .query("bylawChunks")
      .withIndex("by_bylaw", (q) => q.eq("bylawId", args.bylawId))
      .collect();

    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }

    // Delete the file from storage
    await ctx.storage.delete(bylaw.fileId);

    // Delete the bylaw record
    await ctx.db.delete(args.bylawId);

    return { success: true };
  },
});

// ============================================================================
// Internal Mutations for Ingestion
// ============================================================================

/**
 * Update bylaw status (internal use).
 */
export const updateBylawStatus = internalMutation({
  args: {
    bylawId: v.id("bylaws"),
    status: v.union(
      v.literal("processing"),
      v.literal("ready"),
      v.literal("failed")
    ),
    errorMessage: v.optional(v.string()),
    totalChunks: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bylawId, {
      status: args.status,
      errorMessage: args.errorMessage,
      totalChunks: args.totalChunks,
      processedAt: Date.now(),
    });
  },
});

/**
 * Store a batch of bylaw chunks (internal use).
 */
export const storeChunks = internalMutation({
  args: {
    chunks: v.array(
      v.object({
        schemeId: v.id("schemes"),
        bylawId: v.id("bylaws"),
        chunkIndex: v.number(),
        text: v.string(),
        embedding: v.array(v.float64()),
        sectionHeader: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const chunk of args.chunks) {
      await ctx.db.insert("bylawChunks", chunk);
    }
    return { stored: args.chunks.length };
  },
});

// ============================================================================
// Internal Query for Guardian Actions
// ============================================================================

/**
 * Get all chunks for a scheme (used by askGuardian action for similarity search).
 */
export const getChunksForScheme = internalQuery({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bylawChunks")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .collect();
  },
});
