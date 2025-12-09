import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { checkAccess, requireRole } from "./lib/permissions";
import { calculateComplianceStatus, ComplianceStatus } from "./compliance";

// ============================================================================
// Strata Hub Compliance Module (CH-0013)
// ============================================================================
//
// This module handles NSW Strata Hub compliance tracking including:
// - Emergency contacts (4 required by NSW Strata Hub)
// - AFSS (Annual Fire Safety Statement) tracking
// - Insurance details tracking
// - Readiness score calculation
// - 28-day update rule tracking
// ============================================================================

// Time constants
const DAYS_MS = 24 * 60 * 60 * 1000;
const TWENTY_EIGHT_DAYS_MS = 28 * DAYS_MS;

// Types for Strata Hub readiness
export type StrataHubField = {
  id: string;
  label: string;
  value: string | number | null;
  isComplete: boolean;
  category: "basic" | "contacts" | "financial" | "compliance";
};

export type ReadinessResult = {
  score: number; // 0-100 percentage
  completedFields: number;
  totalFields: number;
  missingFields: StrataHubField[];
  allFields: StrataHubField[];
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get Strata Hub readiness score and field status.
 * Calculates completeness based on all mandatory Strata Hub fields.
 */
export const getStrataHubReadiness = query({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args): Promise<ReadinessResult | null> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    await checkAccess(ctx, args.schemeId);

    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      return null;
    }

    // Get financial data for fund balances
    // Use approved/paid transactions to calculate current balances
    const approvedTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_scheme_and_status", (q) =>
        q.eq("schemeId", args.schemeId).eq("status", "approved")
      )
      .collect();

    const paidTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_scheme_and_status", (q) =>
        q.eq("schemeId", args.schemeId).eq("status", "paid")
      )
      .collect();

    const allTransactions = [...approvedTransactions, ...paidTransactions];

    // Calculate fund balances
    let adminBalance = scheme.openingBalanceAdmin ?? 0n;
    let capitalBalance = scheme.openingBalanceCapital ?? 0n;

    for (const tx of allTransactions) {
      const amount = tx.amount;
      const fund = tx.fund ?? "admin";
      const isIncome = tx.type === "income";

      if (fund === "admin") {
        adminBalance = isIncome ? adminBalance + amount : adminBalance - amount;
      } else {
        capitalBalance = isIncome
          ? capitalBalance + amount
          : capitalBalance - amount;
      }
    }

    // Define all Strata Hub mandatory fields
    const fields: StrataHubField[] = [
      // Basic Info
      {
        id: "strataNumber",
        label: "Strata Plan Number",
        value: scheme.strataNumber || null,
        isComplete: !!scheme.strataNumber,
        category: "basic",
      },
      {
        id: "address",
        label: "Scheme Address",
        value: scheme.address || null,
        isComplete: !!scheme.address,
        category: "basic",
      },
      {
        id: "lotCount",
        label: "Number of Lots",
        value: scheme.lotCount || null,
        isComplete: !!scheme.lotCount && scheme.lotCount > 0,
        category: "basic",
      },
      {
        id: "buildingClass",
        label: "Building Classification",
        value: scheme.buildingClass || null,
        isComplete: !!scheme.buildingClass,
        category: "basic",
      },

      // Emergency Contacts (4 required)
      {
        id: "emergencyContact1",
        label: "Emergency Contact 1",
        value: scheme.emergencyContacts?.[0]?.name || null,
        isComplete: !!(
          scheme.emergencyContacts?.[0]?.name &&
          scheme.emergencyContacts?.[0]?.phone
        ),
        category: "contacts",
      },
      {
        id: "emergencyContact2",
        label: "Emergency Contact 2",
        value: scheme.emergencyContacts?.[1]?.name || null,
        isComplete: !!(
          scheme.emergencyContacts?.[1]?.name &&
          scheme.emergencyContacts?.[1]?.phone
        ),
        category: "contacts",
      },
      {
        id: "emergencyContact3",
        label: "Emergency Contact 3",
        value: scheme.emergencyContacts?.[2]?.name || null,
        isComplete: !!(
          scheme.emergencyContacts?.[2]?.name &&
          scheme.emergencyContacts?.[2]?.phone
        ),
        category: "contacts",
      },
      {
        id: "emergencyContact4",
        label: "Emergency Contact 4",
        value: scheme.emergencyContacts?.[3]?.name || null,
        isComplete: !!(
          scheme.emergencyContacts?.[3]?.name &&
          scheme.emergencyContacts?.[3]?.phone
        ),
        category: "contacts",
      },

      // Financial
      {
        id: "adminFundBalance",
        label: "Admin Fund Balance",
        value: Number(adminBalance),
        isComplete: true, // Always complete (default to 0)
        category: "financial",
      },
      {
        id: "capitalWorksFundBalance",
        label: "Capital Works Fund Balance",
        value: Number(capitalBalance),
        isComplete: true, // Always complete (default to 0)
        category: "financial",
      },
      {
        id: "insuranceValue",
        label: "Insurance Replacement Value",
        value: scheme.insuranceDetails?.replacementValue
          ? Number(scheme.insuranceDetails.replacementValue)
          : null,
        isComplete: !!(
          scheme.insuranceDetails?.replacementValue &&
          scheme.insuranceDetails.replacementValue > 0n
        ),
        category: "financial",
      },

      // Compliance
      {
        id: "lastAgmDate",
        label: "Last AGM Date",
        value: scheme.lastAgmDate || null,
        isComplete: !!scheme.lastAgmDate,
        category: "compliance",
      },
      {
        id: "afssDate",
        label: "AFSS Date",
        value: scheme.afssLastDate || null,
        isComplete:
          !!scheme.afssLastDate || scheme.afssStatus === "exempt",
        category: "compliance",
      },
    ];

    const completedFields = fields.filter((f) => f.isComplete).length;
    const totalFields = fields.length;
    const score = Math.round((completedFields / totalFields) * 100);

    return {
      score,
      completedFields,
      totalFields,
      missingFields: fields.filter((f) => !f.isComplete),
      allFields: fields,
    };
  },
});

/**
 * Get 28-day update alerts.
 * Returns contacts/fields that were changed within last 28 days
 * and haven't been updated in Strata Hub yet.
 */
export const get28DayAlerts = query({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    await checkAccess(ctx, args.schemeId);

    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      return [];
    }

    const now = Date.now();
    const alerts: {
      type: string;
      field: string;
      changedAt: number;
      daysRemaining: number;
      requiresUpdate: boolean;
    }[] = [];

    // Check if any contact was changed recently
    const lastSubmission = scheme.lastStrataHubSubmittedAt || 0;

    // Check emergency contacts
    for (const contact of scheme.emergencyContacts || []) {
      if (contact.lastUpdated > lastSubmission) {
        const daysSinceChange = (now - contact.lastUpdated) / DAYS_MS;
        const daysRemaining = Math.ceil(28 - daysSinceChange);

        if (daysRemaining > 0) {
          alerts.push({
            type: "contact_change",
            field: `Emergency Contact ${contact.priority} (${contact.name})`,
            changedAt: contact.lastUpdated,
            daysRemaining,
            requiresUpdate: true,
          });
        }
      }
    }

    // Check if secretary details changed
    if (
      scheme.lastContactChangeAt &&
      scheme.lastContactChangeAt > lastSubmission
    ) {
      const daysSinceChange = (now - scheme.lastContactChangeAt) / DAYS_MS;
      const daysRemaining = Math.ceil(28 - daysSinceChange);

      if (daysRemaining > 0) {
        alerts.push({
          type: "secretary_change",
          field: "Secretary/Committee Details",
          changedAt: scheme.lastContactChangeAt,
          daysRemaining,
          requiresUpdate: true,
        });
      }
    }

    return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
  },
});

/**
 * Get submission preview - all fields formatted for Strata Hub portal.
 */
export const getSubmissionPreview = query({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    await checkAccess(ctx, args.schemeId);

    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      return null;
    }

    // Get fund balances (same logic as getStrataHubReadiness)
    const approvedTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_scheme_and_status", (q) =>
        q.eq("schemeId", args.schemeId).eq("status", "approved")
      )
      .collect();

    const paidTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_scheme_and_status", (q) =>
        q.eq("schemeId", args.schemeId).eq("status", "paid")
      )
      .collect();

    const allTransactions = [...approvedTransactions, ...paidTransactions];

    let adminBalance = scheme.openingBalanceAdmin ?? 0n;
    let capitalBalance = scheme.openingBalanceCapital ?? 0n;

    for (const tx of allTransactions) {
      const amount = tx.amount;
      const fund = tx.fund ?? "admin";
      const isIncome = tx.type === "income";

      if (fund === "admin") {
        adminBalance = isIncome ? adminBalance + amount : adminBalance - amount;
      } else {
        capitalBalance = isIncome
          ? capitalBalance + amount
          : capitalBalance - amount;
      }
    }

    // Format for display
    const formatCurrency = (cents: bigint): string => {
      const dollars = Number(cents) / 100;
      return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
      }).format(dollars);
    };

    const formatDate = (timestamp: number | undefined): string | null => {
      if (!timestamp) return null;
      return new Date(timestamp).toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    return {
      // Basic Info
      strataPlanNumber: scheme.strataNumber,
      schemeAddress: scheme.address || null,
      totalLots: scheme.lotCount || null,
      buildingClass: scheme.buildingClass || null,

      // Emergency Contacts
      emergencyContacts: (scheme.emergencyContacts || []).map((c) => ({
        priority: c.priority,
        type: c.contactType,
        name: c.name,
        phone: c.phone,
        email: c.email || null,
      })),

      // Financial
      adminFundBalance: formatCurrency(adminBalance),
      adminFundBalanceCents: Number(adminBalance),
      capitalWorksFundBalance: formatCurrency(capitalBalance),
      capitalWorksFundBalanceCents: Number(capitalBalance),
      insuranceReplacementValue: scheme.insuranceDetails?.replacementValue
        ? formatCurrency(scheme.insuranceDetails.replacementValue)
        : null,
      insuranceReplacementValueCents: scheme.insuranceDetails?.replacementValue
        ? Number(scheme.insuranceDetails.replacementValue)
        : null,

      // Compliance
      lastAgmDate: formatDate(scheme.lastAgmDate),
      lastAgmDateTimestamp: scheme.lastAgmDate || null,
      afssDate: formatDate(scheme.afssLastDate),
      afssDateTimestamp: scheme.afssLastDate || null,

      // Insurance Details
      insurerName: scheme.insuranceDetails?.insurerName || null,
      policyNumber: scheme.insuranceDetails?.policyNumber || null,
      insuranceExpiry: formatDate(scheme.insuranceDetails?.expiryDate),

      // Committee
      secretaryName: scheme.secretaryName || null,
      secretaryEmail: scheme.secretaryEmail || null,
      secretaryPhone: scheme.secretaryPhone || null,
      treasurerName: scheme.treasurerName || null,
      treasurerEmail: scheme.treasurerEmail || null,
      treasurerPhone: scheme.treasurerPhone || null,
      chairpersonName: scheme.chairpersonName || null,
      chairpersonEmail: scheme.chairpersonEmail || null,
      chairpersonPhone: scheme.chairpersonPhone || null,

      // Tracking
      lastSubmittedAt: formatDate(scheme.lastStrataHubSubmittedAt),
    };
  },
});

/**
 * Get comprehensive compliance status including AFSS and Insurance.
 */
export const getExtendedComplianceStatus = query({
  args: { schemeId: v.id("schemes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    await checkAccess(ctx, args.schemeId);

    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      return null;
    }

    const now = Date.now();

    // Calculate statuses
    const agmStatus = calculateComplianceStatus(scheme.nextAgmDueDate, now);
    const strataHubStatus = calculateComplianceStatus(
      scheme.nextStrataHubReportDueDate,
      now
    );

    // AFSS status - use stored status or calculate from date
    let afssStatus: ComplianceStatus | null = null;
    if (scheme.afssStatus === "exempt") {
      afssStatus = "on_track"; // Exempt buildings are always compliant
    } else if (scheme.afssNextDueDate) {
      afssStatus = calculateComplianceStatus(scheme.afssNextDueDate, now);
    } else if (scheme.afssLastDate) {
      // Calculate next due as 1 year from last AFSS
      const nextAfssDue = scheme.afssLastDate + 365 * DAYS_MS;
      afssStatus = calculateComplianceStatus(nextAfssDue, now);
    }

    // Insurance status - calculate from expiry date
    let insuranceStatus: ComplianceStatus | null = null;
    if (scheme.insuranceDetails?.expiryDate) {
      insuranceStatus = calculateComplianceStatus(
        scheme.insuranceDetails.expiryDate,
        now
      );
    }

    // Calculate days until for each
    const getDaysUntil = (date: number | undefined): number | null => {
      if (!date) return null;
      return Math.ceil((date - now) / DAYS_MS);
    };

    return {
      schemeId: args.schemeId,
      schemeName: scheme.name,
      agm: {
        status: agmStatus,
        dueDate: scheme.nextAgmDueDate || null,
        daysUntil: getDaysUntil(scheme.nextAgmDueDate),
        needsSetup: !scheme.lastAgmDate,
      },
      strataHub: {
        status: strataHubStatus,
        dueDate: scheme.nextStrataHubReportDueDate || null,
        daysUntil: getDaysUntil(scheme.nextStrataHubReportDueDate),
        lastSubmitted: scheme.lastStrataHubSubmittedAt || null,
      },
      afss: {
        status: afssStatus,
        lastDate: scheme.afssLastDate || null,
        dueDate: scheme.afssNextDueDate || null,
        daysUntil: getDaysUntil(scheme.afssNextDueDate),
        isExempt: scheme.afssStatus === "exempt",
        needsSetup: !scheme.afssLastDate && scheme.afssStatus !== "exempt",
      },
      insurance: {
        status: insuranceStatus,
        expiryDate: scheme.insuranceDetails?.expiryDate || null,
        daysUntil: getDaysUntil(scheme.insuranceDetails?.expiryDate),
        hasDetails: !!(
          scheme.insuranceDetails?.insurerName ||
          scheme.insuranceDetails?.policyNumber
        ),
        needsSetup: !scheme.insuranceDetails?.replacementValue,
      },
    };
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Update emergency contacts.
 * Tracks lastUpdated for 28-day rule compliance.
 */
export const updateEmergencyContacts = mutation({
  args: {
    schemeId: v.id("schemes"),
    contacts: v.array(
      v.object({
        priority: v.number(),
        contactType: v.union(
          v.literal("building_manager"),
          v.literal("secretary"),
          v.literal("chairperson"),
          v.literal("treasurer"),
          v.literal("caretaker"),
          v.literal("other")
        ),
        name: v.string(),
        phone: v.string(),
        email: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, args.schemeId, "member");

    const now = Date.now();

    // Add lastUpdated timestamp to each contact
    const contactsWithTimestamp = args.contacts.map((contact) => ({
      ...contact,
      lastUpdated: now,
    }));

    await ctx.db.patch(args.schemeId, {
      emergencyContacts: contactsWithTimestamp,
      lastContactChangeAt: now,
    });

    return { success: true };
  },
});

/**
 * Update AFSS (Fire Safety) details.
 */
export const updateAfssDetails = mutation({
  args: {
    schemeId: v.id("schemes"),
    lastDate: v.optional(v.number()),
    nextDueDate: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("current"),
        v.literal("due_soon"),
        v.literal("overdue"),
        v.literal("exempt")
      )
    ),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, args.schemeId, "member");

    const updates: Record<string, unknown> = {};

    if (args.lastDate !== undefined) {
      updates.afssLastDate = args.lastDate;
      // Auto-calculate next due date as 1 year from last date
      if (args.lastDate && args.nextDueDate === undefined) {
        updates.afssNextDueDate = args.lastDate + 365 * DAYS_MS;
      }
    }

    if (args.nextDueDate !== undefined) {
      updates.afssNextDueDate = args.nextDueDate;
    }

    if (args.status !== undefined) {
      updates.afssStatus = args.status;
    }

    await ctx.db.patch(args.schemeId, updates);

    return { success: true };
  },
});

/**
 * Update insurance details.
 */
export const updateInsuranceDetails = mutation({
  args: {
    schemeId: v.id("schemes"),
    insurerName: v.optional(v.string()),
    policyNumber: v.optional(v.string()),
    replacementValue: v.optional(v.int64()),
    expiryDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, args.schemeId, "member");

    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    const now = Date.now();

    // Merge with existing insurance details
    const existingDetails = scheme.insuranceDetails || {};
    const updatedDetails = {
      insurerName: args.insurerName ?? existingDetails.insurerName,
      policyNumber: args.policyNumber ?? existingDetails.policyNumber,
      replacementValue:
        args.replacementValue ?? existingDetails.replacementValue,
      expiryDate: args.expiryDate ?? existingDetails.expiryDate,
      lastUpdated: now,
    };

    await ctx.db.patch(args.schemeId, {
      insuranceDetails: updatedDetails,
    });

    return { success: true };
  },
});

/**
 * Update building classification.
 */
export const updateBuildingClass = mutation({
  args: {
    schemeId: v.id("schemes"),
    buildingClass: v.union(
      v.literal("class_1a"),
      v.literal("class_1b"),
      v.literal("class_2"),
      v.literal("class_3"),
      v.literal("class_4"),
      v.literal("class_5"),
      v.literal("class_6"),
      v.literal("class_7a"),
      v.literal("class_7b"),
      v.literal("class_8"),
      v.literal("class_9a"),
      v.literal("class_9b"),
      v.literal("class_9c"),
      v.literal("class_10")
    ),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, args.schemeId, "member");

    await ctx.db.patch(args.schemeId, {
      buildingClass: args.buildingClass,
    });

    return { success: true };
  },
});

/**
 * Update extended committee details.
 */
export const updateCommitteeDetails = mutation({
  args: {
    schemeId: v.id("schemes"),
    secretaryPhone: v.optional(v.string()),
    treasurerName: v.optional(v.string()),
    treasurerEmail: v.optional(v.string()),
    treasurerPhone: v.optional(v.string()),
    chairpersonName: v.optional(v.string()),
    chairpersonEmail: v.optional(v.string()),
    chairpersonPhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, args.schemeId, "member");

    const updates: Record<string, unknown> = {};
    const now = Date.now();

    if (args.secretaryPhone !== undefined) {
      updates.secretaryPhone = args.secretaryPhone;
    }
    if (args.treasurerName !== undefined) {
      updates.treasurerName = args.treasurerName;
    }
    if (args.treasurerEmail !== undefined) {
      updates.treasurerEmail = args.treasurerEmail;
    }
    if (args.treasurerPhone !== undefined) {
      updates.treasurerPhone = args.treasurerPhone;
    }
    if (args.chairpersonName !== undefined) {
      updates.chairpersonName = args.chairpersonName;
    }
    if (args.chairpersonEmail !== undefined) {
      updates.chairpersonEmail = args.chairpersonEmail;
    }
    if (args.chairpersonPhone !== undefined) {
      updates.chairpersonPhone = args.chairpersonPhone;
    }

    // Track contact change for 28-day rule
    if (Object.keys(updates).length > 0) {
      updates.lastContactChangeAt = now;
    }

    await ctx.db.patch(args.schemeId, updates);

    return { success: true };
  },
});

/**
 * Mark Strata Hub report as submitted.
 * Records the submission timestamp for tracking.
 */
export const markStrataHubSubmitted = mutation({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, args.schemeId, "member");

    const now = Date.now();

    await ctx.db.patch(args.schemeId, {
      lastStrataHubSubmittedAt: now,
      lastStrataHubReportDate: now,
    });

    return { success: true, submittedAt: now };
  },
});
