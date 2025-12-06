import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { requireAuth } from "./lib/permissions";

/**
 * Create a new report session (called when user uploads a file)
 */
export const createReport = mutation({
  args: {
    sessionId: v.string(),
    fileId: v.id("_storage"),
    fileName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Require authentication
    const user = await requireAuth(ctx);

    const reportId = await ctx.db.insert("strataHubReports", {
      sessionId: args.sessionId,
      userId: user._id,
      status: "processing",
      fileId: args.fileId,
      fileName: args.fileName,
      unlocked: false,
      createdAt: Date.now(),
    });

    return reportId;
  },
});

/**
 * Get report by session ID
 * SECURITY: Requires authentication and verifies user owns the report
 */
export const getReport = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Require authentication
    const user = await requireAuth(ctx);

    const report = await ctx.db
      .query("strataHubReports")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .first();

    // Verify the user owns this report (if userId exists - for backward compatibility)
    if (report && report.userId && report.userId !== user._id) {
      throw new Error("Access denied: You don't have permission to access this report.");
    }

    return report;
  },
});

/**
 * Get report by ID
 * SECURITY: Requires authentication and verifies user owns the report
 */
export const getReportById = query({
  args: {
    reportId: v.id("strataHubReports"),
  },
  handler: async (ctx, args) => {
    // Require authentication
    const user = await requireAuth(ctx);

    const report = await ctx.db.get(args.reportId);

    // Verify the user owns this report (if userId exists - for backward compatibility)
    if (report && report.userId && report.userId !== user._id) {
      throw new Error("Access denied: You don't have permission to access this report.");
    }

    return report;
  },
});

/**
 * Unlock a report after email capture
 * SECURITY: Requires authentication and verifies user owns the report
 */
export const unlockReport = mutation({
  args: {
    reportId: v.id("strataHubReports"),
  },
  handler: async (ctx, args) => {
    // Require authentication
    const user = await requireAuth(ctx);

    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    // Verify the user owns this report (if userId exists - for backward compatibility)
    if (report.userId && report.userId !== user._id) {
      throw new Error("Access denied: You don't have permission to unlock this report.");
    }

    await ctx.db.patch(args.reportId, {
      unlocked: true,
    });
  },
});

/**
 * Internal mutation to update report with extracted data
 */
export const updateReportWithData = internalMutation({
  args: {
    reportId: v.id("strataHubReports"),
    extractedData: v.object({
      strataPlanNumber: v.optional(v.string()),
      lastAfssDate: v.optional(v.string()),
      capitalWorksFundBalance: v.optional(v.int64()),
      adminFundBalance: v.optional(v.int64()),
      insuranceReplacementValue: v.optional(v.int64()),
      lastAgmDate: v.optional(v.string()),
      totalLots: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, {
      status: "completed",
      extractedData: args.extractedData,
      completedAt: Date.now(),
    });
  },
});

/**
 * Internal mutation to mark report as failed
 */
export const markReportFailed = internalMutation({
  args: {
    reportId: v.id("strataHubReports"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, {
      status: "failed",
      errorMessage: args.errorMessage,
      completedAt: Date.now(),
    });
  },
});

/**
 * Generate a file upload URL
 * SECURITY: Requires authentication
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Require authentication
    await requireAuth(ctx);

    return await ctx.storage.generateUploadUrl();
  },
});
