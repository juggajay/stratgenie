"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

/**
 * Result type for email sending operations.
 */
export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email using the Resend API.
 *
 * Requires RESEND_API_KEY to be set in Convex environment variables.
 *
 * For testing, use from: "onboarding@resend.dev"
 * For production, use your verified domain.
 */
export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    from: v.optional(v.string()),
    replyTo: v.optional(v.string()),
  },
  handler: async (_, args): Promise<SendEmailResult> => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("[sendEmail] RESEND_API_KEY not configured");
      return {
        success: false,
        error:
          "RESEND_API_KEY environment variable is not set. Add it to Convex Dashboard > Settings > Environment Variables.",
      };
    }

    const resend = new Resend(apiKey);

    // Use test domain if not specified
    const fromAddress = args.from || "Strata Manager <onboarding@resend.dev>";

    try {
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: args.to,
        subject: args.subject,
        html: args.html,
        replyTo: args.replyTo,
      });

      if (error) {
        console.error("[sendEmail] Resend API error:", error);
        return {
          success: false,
          error: error.message || "Unknown Resend error",
        };
      }

      console.log("[sendEmail] Email sent successfully:", data?.id);
      return {
        success: true,
        messageId: data?.id,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("[sendEmail] Exception:", errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
});
