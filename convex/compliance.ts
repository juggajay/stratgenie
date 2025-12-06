import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { checkAccess, requireRole } from "./lib/permissions";

// Compliance status thresholds (in milliseconds)
const DAYS_MS = 24 * 60 * 60 * 1000;
const UPCOMING_THRESHOLD = 60 * DAYS_MS; // 60 days
const DUE_SOON_THRESHOLD = 30 * DAYS_MS; // 30 days

export type ComplianceStatus = "on_track" | "upcoming" | "due_soon" | "overdue";

/**
 * Calculate compliance status based on due date
 * Per spec CH-0001:
 * - on_track: > 60 days remaining
 * - upcoming: 60 to 30 days remaining (the "Secretary Trigger")
 * - due_soon: < 30 days remaining (ACTION REQUIRED)
 * - overdue: past deadline
 *
 * Boundary cases (from spec scenarios):
 * - 90 days → on_track
 * - 60 days → upcoming (inclusive)
 * - 45 days → upcoming
 * - 30 days → upcoming (inclusive)
 * - 20 days → due_soon
 * - -1 days → overdue
 */
export function calculateComplianceStatus(
  dueDate: number | undefined,
  now: number = Date.now()
): ComplianceStatus | null {
  if (!dueDate) return null;

  const msRemaining = dueDate - now;

  if (msRemaining < 0) {
    return "overdue";
  } else if (msRemaining < DUE_SOON_THRESHOLD) {
    // Less than 30 days remaining
    return "due_soon";
  } else if (msRemaining <= UPCOMING_THRESHOLD) {
    // 30 to 60 days remaining (inclusive of 60)
    return "upcoming";
  } else {
    // More than 60 days remaining
    return "on_track";
  }
}

/**
 * Calculate next AGM due date (strict 1-year cycle)
 */
export function calculateNextAgmDueDate(lastAgmDate: number): number {
  const date = new Date(lastAgmDate);
  date.setFullYear(date.getFullYear() + 1);
  return date.getTime();
}

/**
 * Calculate Strata Hub report due date (3 months after AGM)
 */
export function calculateStrataHubDueDate(agmDate: number): number {
  const date = new Date(agmDate);
  date.setMonth(date.getMonth() + 3);
  return date.getTime();
}

// ============ QUERIES ============

export const getSchemeComplianceStatus = query({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args) => {
    // Return null if not authenticated (e.g., during logout)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    await checkAccess(ctx, args.schemeId);

    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      // Return null instead of throwing - handles stale localStorage references
      return null;
    }

    const now = Date.now();
    const agmStatus = calculateComplianceStatus(scheme.nextAgmDueDate, now);
    const strataHubStatus = calculateComplianceStatus(
      scheme.nextStrataHubReportDueDate,
      now
    );

    return {
      schemeId: args.schemeId,
      schemeName: scheme.name,
      agm: {
        status: agmStatus,
        lastDate: scheme.lastAgmDate ?? null,
        nextDueDate: scheme.nextAgmDueDate ?? null,
        needsSetup: !scheme.lastAgmDate,
      },
      strataHub: {
        status: strataHubStatus,
        lastDate: scheme.lastStrataHubReportDate ?? null,
        nextDueDate: scheme.nextStrataHubReportDueDate ?? null,
        needsSetup: !scheme.lastAgmDate, // Depends on AGM date
      },
    };
  },
});

export const listComplianceTasksForScheme = query({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args) => {
    // Return empty array if not authenticated (e.g., during logout)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    await checkAccess(ctx, args.schemeId);

    const tasks = await ctx.db
      .query("complianceTasks")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .collect();

    return tasks.sort((a, b) => a.dueDate - b.dueDate);
  },
});

// ============ MUTATIONS ============

export const setSchemeComplianceDates = mutation({
  args: {
    schemeId: v.id("schemes"),
    lastAgmDate: v.optional(v.number()),
    lastStrataHubReportDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, args.schemeId, "member");

    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    const updates: Record<string, number | undefined> = {};

    // If lastAgmDate is provided, calculate derived dates
    if (args.lastAgmDate !== undefined) {
      updates.lastAgmDate = args.lastAgmDate;
      updates.nextAgmDueDate = calculateNextAgmDueDate(args.lastAgmDate);
      // Strata Hub report is due 3 months after the NEXT AGM
      updates.nextStrataHubReportDueDate = calculateStrataHubDueDate(
        updates.nextAgmDueDate
      );

      // Update existing compliance tasks with new due dates
      const existingTasks = await ctx.db
        .query("complianceTasks")
        .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
        .collect();

      const agmDate = updates.nextAgmDueDate;

      for (const task of existingTasks) {
        let newDueDate: number;

        switch (task.type) {
          case "send_agm_notice":
            // AGM Date - 8 days (ensures 7-day statutory notice)
            newDueDate = agmDate - 8 * DAYS_MS;
            break;
          case "hold_agm":
            // AGM Date
            newDueDate = agmDate;
            break;
          case "file_strata_hub_report":
            // AGM Date + 3 months
            newDueDate = calculateStrataHubDueDate(agmDate);
            break;
          default:
            continue;
        }

        await ctx.db.patch(task._id, { dueDate: newDueDate });
      }

      // Delete any draft AGM notices so they can be regenerated with correct dates
      const draftNotices = await ctx.db
        .query("documents")
        .withIndex("by_scheme_and_type", (q) =>
          q.eq("schemeId", args.schemeId).eq("type", "agm_notice")
        )
        .collect();

      for (const doc of draftNotices) {
        if (doc.status === "draft") {
          await ctx.db.delete(doc._id);
        }
      }
    }

    // If lastStrataHubReportDate is explicitly provided
    if (args.lastStrataHubReportDate !== undefined) {
      updates.lastStrataHubReportDate = args.lastStrataHubReportDate;
    }

    await ctx.db.patch(args.schemeId, updates);

    return { success: true };
  },
});

export const generateAgmChecklist = mutation({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args) => {
    await requireRole(ctx, args.schemeId, "member");

    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    if (!scheme.nextAgmDueDate) {
      throw new Error(
        "Cannot generate checklist: AGM date not set. Please set your last AGM date first."
      );
    }

    const agmDate = scheme.nextAgmDueDate;

    // Calculate task due dates per spec:
    // - send_agm_notice: AGM Date - 8 days (ensures 7-day statutory notice)
    // - hold_agm: AGM Date
    // - file_strata_hub_report: AGM Date + 3 months
    const tasks = [
      {
        schemeId: args.schemeId,
        type: "send_agm_notice" as const,
        title: "Send AGM notice to all owners",
        status: "draft" as const,
        dueDate: agmDate - 8 * DAYS_MS,
      },
      {
        schemeId: args.schemeId,
        type: "hold_agm" as const,
        title: "Hold the Annual General Meeting",
        status: "draft" as const,
        dueDate: agmDate,
      },
      {
        schemeId: args.schemeId,
        type: "file_strata_hub_report" as const,
        title: "File Strata Hub annual report",
        status: "draft" as const,
        dueDate: calculateStrataHubDueDate(agmDate),
      },
    ];

    // Insert all tasks
    const taskIds = await Promise.all(
      tasks.map((task) => ctx.db.insert("complianceTasks", task))
    );

    return {
      success: true,
      tasksCreated: taskIds.length,
      taskIds,
    };
  },
});

export const updateComplianceTaskStatus = mutation({
  args: {
    taskId: v.id("complianceTasks"),
    status: v.union(
      v.literal("draft"),
      v.literal("in_progress"),
      v.literal("done")
    ),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    await requireRole(ctx, task.schemeId, "member");

    const updates: Record<string, unknown> = {
      status: args.status,
    };

    // Record completion timestamp if marking as done
    if (args.status === "done") {
      updates.completedAt = Date.now();
    }

    await ctx.db.patch(args.taskId, updates);

    return { success: true };
  },
});
