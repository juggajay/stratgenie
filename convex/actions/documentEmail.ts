"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

/**
 * Result type for document email dispatch.
 */
export interface DocumentEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send a document (AGM notice, etc.) via email.
 */
export const sendDocumentEmail = internalAction({
  args: {
    to: v.string(),
    ownerName: v.string(),
    schemeName: v.string(),
    documentType: v.string(),
    documentTitle: v.string(),
    documentContent: v.string(),
    from: v.optional(v.string()),
    replyTo: v.optional(v.string()),
  },
  handler: async (_, args): Promise<DocumentEmailResult> => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("[sendDocumentEmail] RESEND_API_KEY not configured");
      return {
        success: false,
        error: "RESEND_API_KEY not configured",
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.to)) {
      console.error("[sendDocumentEmail] Invalid email:", args.to);
      return {
        success: false,
        error: "Invalid email address",
      };
    }

    const resend = new Resend(apiKey);

    // Generate subject based on document type
    const subject = `${args.schemeName} - ${args.documentTitle}`;

    // Wrap document content in email template
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; }
    .header { background: #f8fafc; padding: 20px; border-bottom: 2px solid #0d9488; }
    .header h1 { margin: 0; color: #0d9488; font-size: 20px; }
    .intro { padding: 20px; background: #fff; }
    .document { border: 1px solid #e2e8f0; margin: 20px; }
    .footer { padding: 20px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${args.schemeName}</h1>
  </div>
  <div class="intro">
    <p>Dear ${args.ownerName},</p>
    <p>Please find attached the ${args.documentTitle} for ${args.schemeName}.</p>
    <p>The document is included below for your review.</p>
  </div>
  <div class="document">
    ${args.documentContent}
  </div>
  <div class="footer">
    <p>This email was sent by StrataGenie on behalf of ${args.schemeName}.</p>
    <p>If you have any questions, please contact your strata committee.</p>
  </div>
</body>
</html>`;

    // Use test domain if not specified
    const fromAddress = args.from || "Strata Manager <onboarding@resend.dev>";

    try {
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: args.to,
        subject,
        html,
        replyTo: args.replyTo,
      });

      if (error) {
        console.error("[sendDocumentEmail] Resend API error:", error);
        return {
          success: false,
          error: error.message || "Unknown Resend error",
        };
      }

      console.log(
        "[sendDocumentEmail] Email sent to",
        args.to,
        "messageId:",
        data?.id
      );
      return {
        success: true,
        messageId: data?.id,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("[sendDocumentEmail] Exception:", errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
});
