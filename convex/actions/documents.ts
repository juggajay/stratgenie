"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { Doc } from "../_generated/dataModel";

interface EmailResult {
  lotNumber: string;
  email: string;
  success: boolean;
  error?: string;
}

interface FinalizeResult {
  success: boolean;
  emailsSent: number;
  emailsFailed?: number;
  totalLots?: number;
  results?: EmailResult[];
  message: string;
}

/**
 * Finalize a document and send it to all lot owners.
 *
 * This action:
 * 1. Marks the document as final
 * 2. Gets all lots for the scheme
 * 3. Sends the document to each lot owner via email
 */
export const finalizeAndSendDocument = action({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args): Promise<FinalizeResult> => {
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
    const scheme = await ctx.runQuery(api.schemes.get, {
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
    const lots: LotWithShare[] = await ctx.runQuery(api.lots.listLotsForScheme, {
      schemeId: document.schemeId,
    });

    if (lots.length === 0) {
      return {
        success: true,
        emailsSent: 0,
        message: "Document finalized. No lots found to send emails to.",
      };
    }

    // Send document to each lot owner
    const emailResults = [];
    let successCount = 0;
    let failCount = 0;

    for (const lot of lots) {
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
      totalLots: lots.length,
      results: emailResults,
      message: `Document finalized and sent to ${successCount} of ${lots.length} lot owners.`,
    };
  },
});
