import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateAgmNoticeHtml, AgmNoticeData } from "./templates/agm_notice";

/**
 * Get a scheme by ID.
 */
export const getScheme = query({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.schemeId);
  },
});

/**
 * Generate an AGM Notice document for a scheme.
 *
 * Validates required fields, generates content from template, and saves as draft.
 */
export const generateAgmNotice = mutation({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    // Fetch scheme details
    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    // Validate required fields
    const missingFields: string[] = [];

    if (!scheme.name) {
      missingFields.push("Scheme name");
    }
    if (!scheme.strataNumber) {
      missingFields.push("Strata number");
    }
    if (!scheme.nextAgmDueDate) {
      missingFields.push("AGM date");
    }
    if (!scheme.defaultMeetingLocation) {
      missingFields.push("Meeting location");
    }
    if (!scheme.defaultMeetingTime) {
      missingFields.push("Meeting time");
    }

    if (missingFields.length > 0) {
      throw new Error(
        `Cannot generate AGM Notice. Missing required fields: ${missingFields.join(", ")}`
      );
    }

    // Prepare template data
    const templateData: AgmNoticeData = {
      schemeName: scheme.name,
      strataNumber: scheme.strataNumber,
      address: scheme.address || "",
      meetingDate: new Date(scheme.nextAgmDueDate!),
      meetingTime: scheme.defaultMeetingTime!,
      meetingLocation: scheme.defaultMeetingLocation!,
      secretaryName: scheme.secretaryName,
    };

    // Generate content from template
    const content = generateAgmNoticeHtml(templateData);

    // Create document title
    const meetingDate = new Date(scheme.nextAgmDueDate!);
    const monthYear = meetingDate.toLocaleDateString("en-AU", {
      month: "long",
      year: "numeric",
    });
    const title = `AGM Notice - ${monthYear}`;

    // Save draft document
    const documentId = await ctx.db.insert("documents", {
      schemeId: args.schemeId,
      type: "agm_notice",
      status: "draft",
      content,
      title,
      createdAt: Date.now(),
    });

    return documentId;
  },
});

/**
 * Get a document by ID.
 *
 * Returns the document with its scheme data for membership verification.
 */
export const getDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      return null;
    }

    // Fetch scheme for context
    const scheme = await ctx.db.get(document.schemeId);

    return {
      ...document,
      scheme: scheme
        ? {
            name: scheme.name,
            strataNumber: scheme.strataNumber,
          }
        : null,
    };
  },
});

/**
 * List all documents for a scheme, sorted by creation date (newest first).
 */
export const listDocumentsForScheme = query({
  args: {
    schemeId: v.id("schemes"),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_scheme", (q) => q.eq("schemeId", args.schemeId))
      .collect();

    // Sort by createdAt descending (newest first)
    return documents.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get documents of a specific type for a scheme.
 */
export const getDocumentsByType = query({
  args: {
    schemeId: v.id("schemes"),
    type: v.union(
      v.literal("agm_notice"),
      v.literal("agm_minutes"),
      v.literal("levy_notice")
    ),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_scheme_and_type", (q) =>
        q.eq("schemeId", args.schemeId).eq("type", args.type)
      )
      .collect();

    return documents.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Finalize a document - transitions from draft to final.
 *
 * Sets the status to 'final' and records the finalization timestamp.
 */
export const finalizeDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    if (document.status === "final") {
      throw new Error("Document is already finalized");
    }

    await ctx.db.patch(args.documentId, {
      status: "final",
      finalizedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Update scheme meeting details.
 *
 * Used to set the default meeting location and time for document generation.
 */
export const updateSchemeMeetingDetails = mutation({
  args: {
    schemeId: v.id("schemes"),
    defaultMeetingLocation: v.optional(v.string()),
    defaultMeetingTime: v.optional(v.string()),
    secretaryName: v.optional(v.string()),
    secretaryEmail: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const scheme = await ctx.db.get(args.schemeId);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    const updates: Record<string, string | undefined> = {};

    if (args.defaultMeetingLocation !== undefined) {
      updates.defaultMeetingLocation = args.defaultMeetingLocation;
    }
    if (args.defaultMeetingTime !== undefined) {
      updates.defaultMeetingTime = args.defaultMeetingTime;
    }
    if (args.secretaryName !== undefined) {
      updates.secretaryName = args.secretaryName;
    }
    if (args.secretaryEmail !== undefined) {
      updates.secretaryEmail = args.secretaryEmail;
    }
    if (args.address !== undefined) {
      updates.address = args.address;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.schemeId, updates);
    }

    return { success: true };
  },
});
