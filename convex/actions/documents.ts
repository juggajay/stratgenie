"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";

interface EmailResult {
  lotNumber: string;
  email: string;
  success: boolean;
  error?: string;
}

interface SendResult {
  success: boolean;
  emailsSent: number;
  emailsFailed?: number;
  totalLots?: number;
  results?: EmailResult[];
  message: string;
}

/**
 * Finalize a document and send it to selected lot owners.
 *
 * This action:
 * 1. Marks the document as final
 * 2. Sends the document to selected lots (or all if none specified)
 */
export const finalizeAndSendDocument = action({
  args: {
    documentId: v.id("documents"),
    lotIds: v.optional(v.array(v.id("lots"))),
  },
  handler: async (ctx, args): Promise<SendResult> => {
    // Get the document
    const document: Doc<"documents"> | null = await ctx.runQuery(api.documents.getDocument, {
      documentId: args.documentId,
    });

    if (!document) {
      throw new Error("Document not found");
    }

    if (document.status === "final") {
      throw new Error("Document is already finalized");
    }

    // Get the scheme
    const scheme: Doc<"schemes"> | null = await ctx.runQuery(api.schemes.get, {
      id: document.schemeId,
    });

    if (!scheme) {
      throw new Error("Scheme not found");
    }

    // Finalize the document
    await ctx.runMutation(api.documents.finalizeDocument, {
      documentId: args.documentId,
    });

    // Get all lots for the scheme
    type LotWithShare = Doc<"lots"> & { percentageShare: number };
    const allLots: LotWithShare[] = await ctx.runQuery(api.lots.listLotsForScheme, {
      schemeId: document.schemeId,
    });

    // Filter to selected lots if specified
    const lotsToSend = args.lotIds
      ? allLots.filter((lot) => args.lotIds!.includes(lot._id))
      : allLots;

    if (lotsToSend.length === 0) {
      return {
        success: true,
        emailsSent: 0,
        message: "Document finalized. No lots selected to send emails to.",
      };
    }

    // Send document to each selected lot owner
    const emailResults: EmailResult[] = [];
    let successCount = 0;
    let failCount = 0;

    for (const lot of lotsToSend) {
      try {
        const result: { success: boolean; messageId?: string; error?: string } = await ctx.runAction(internal.actions.documentEmail.sendDocumentEmail, {
          to: lot.ownerEmail,
          ownerName: lot.ownerName,
          schemeName: scheme.name,
          documentType: document.type,
          documentTitle: document.title,
          documentContent: document.content,
          replyTo: scheme.secretaryEmail,
        });

        emailResults.push({
          lotNumber: lot.lotNumber,
          email: lot.ownerEmail,
          success: result.success,
          error: result.error,
        });

        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        emailResults.push({
          lotNumber: lot.lotNumber,
          email: lot.ownerEmail,
          success: false,
          error: errorMessage,
        });
        failCount++;
      }
    }

    return {
      success: true,
      emailsSent: successCount,
      emailsFailed: failCount,
      totalLots: lotsToSend.length,
      results: emailResults,
      message: `Document finalized and sent to ${successCount} of ${lotsToSend.length} lot owners.`,
    };
  },
});

/**
 * Resend a finalized document to selected lot owners.
 *
 * This action sends an already-finalized document to selected lots.
 */
export const resendDocument = action({
  args: {
    documentId: v.id("documents"),
    lotIds: v.array(v.id("lots")),
  },
  handler: async (ctx, args): Promise<SendResult> => {
    // Get the document
    const document: Doc<"documents"> | null = await ctx.runQuery(api.documents.getDocument, {
      documentId: args.documentId,
    });

    if (!document) {
      throw new Error("Document not found");
    }

    if (document.status !== "final") {
      throw new Error("Document must be finalized before resending");
    }

    // Get the scheme
    const scheme: Doc<"schemes"> | null = await ctx.runQuery(api.schemes.get, {
      id: document.schemeId,
    });

    if (!scheme) {
      throw new Error("Scheme not found");
    }

    // Get all lots for the scheme
    type LotWithShare = Doc<"lots"> & { percentageShare: number };
    const allLots: LotWithShare[] = await ctx.runQuery(api.lots.listLotsForScheme, {
      schemeId: document.schemeId,
    });

    // Filter to selected lots
    const lotsToSend = allLots.filter((lot) => args.lotIds.includes(lot._id));

    if (lotsToSend.length === 0) {
      return {
        success: true,
        emailsSent: 0,
        message: "No lots selected to send emails to.",
      };
    }

    // Send document to each selected lot owner
    const emailResults: EmailResult[] = [];
    let successCount = 0;
    let failCount = 0;

    for (const lot of lotsToSend) {
      try {
        const result: { success: boolean; messageId?: string; error?: string } = await ctx.runAction(internal.actions.documentEmail.sendDocumentEmail, {
          to: lot.ownerEmail,
          ownerName: lot.ownerName,
          schemeName: scheme.name,
          documentType: document.type,
          documentTitle: document.title,
          documentContent: document.content,
          replyTo: scheme.secretaryEmail,
        });

        emailResults.push({
          lotNumber: lot.lotNumber,
          email: lot.ownerEmail,
          success: result.success,
          error: result.error,
        });

        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        emailResults.push({
          lotNumber: lot.lotNumber,
          email: lot.ownerEmail,
          success: false,
          error: errorMessage,
        });
        failCount++;
      }
    }

    return {
      success: true,
      emailsSent: successCount,
      emailsFailed: failCount,
      totalLots: lotsToSend.length,
      results: emailResults,
      message: `Document sent to ${successCount} of ${lotsToSend.length} lot owners.`,
    };
  },
});
