import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

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
    const reportId = await ctx.db.insert("strataHubReports", {
      sessionId: args.sessionId,
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
 * Get report by session ID (public query - returns data regardless of unlock status)
 */
export const getReport = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db
      .query("strataHubReports")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .first();

    return report;
  },
});

/**
 * Get report by ID
 */
export const getReportById = query({
  args: {
    reportId: v.id("strataHubReports"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.reportId);
  },
});

/**
 * Unlock a report after email capture
 */
export const unlockReport = mutation({
  args: {
    reportId: v.id("strataHubReports"),
  },
  handler: async (ctx, args) => {
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
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
