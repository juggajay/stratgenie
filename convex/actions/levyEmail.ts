"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import {
  generateLevyNoticeHTML,
  formatLevyEmailSubject,
  type LevyInvoiceData,
  type LevyRunData,
} from "../../lib/email-templates";
import { isValidEmail } from "../../lib/email-utils";

/**
 * Result type for levy email dispatch.
 */
export interface LevyEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send a single levy notice email.
 *
 * This is designed to be called for each invoice when issuing a levy run.
 */
export const sendLevyNoticeEmail = internalAction({
  args: {
    to: v.string(),
    schemeName: v.string(),
    invoice: v.object({
      amount: v.int64(),
      lotNumber: v.string(),
      ownerName: v.string(),
      ownerEmail: v.string(),
      ownerAddress: v.optional(v.string()),
      unitEntitlement: v.number(),
      percentageShare: v.number(),
    }),
    levyRun: v.object({
      fundType: v.union(v.literal("admin"), v.literal("capital_works")),
      periodLabel: v.string(),
      dueDate: v.number(),
      totalAmount: v.int64(),
    }),
    from: v.optional(v.string()),
    replyTo: v.optional(v.string()),
  },
  handler: async (_, args): Promise<LevyEmailResult> => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("[sendLevyNoticeEmail] RESEND_API_KEY not configured");
      return {
        success: false,
        error: "RESEND_API_KEY not configured",
      };
    }

    // Validate email
    if (!isValidEmail(args.to)) {
      console.error("[sendLevyNoticeEmail] Invalid email:", args.to);
      return {
        success: false,
        error: "Invalid email address",
      };
    }

    const resend = new Resend(apiKey);

    // Generate email content
    const invoiceData: LevyInvoiceData = {
      amount: args.invoice.amount,
      lotNumber: args.invoice.lotNumber,
      ownerName: args.invoice.ownerName,
      ownerEmail: args.invoice.ownerEmail,
      ownerAddress: args.invoice.ownerAddress,
      unitEntitlement: args.invoice.unitEntitlement,
      percentageShare: args.invoice.percentageShare,
    };

    const levyRunData: LevyRunData = {
      fundType: args.levyRun.fundType,
      periodLabel: args.levyRun.periodLabel,
      dueDate: args.levyRun.dueDate,
      totalAmount: args.levyRun.totalAmount,
    };

    const html = generateLevyNoticeHTML(invoiceData, levyRunData, args.schemeName);
    const subject = formatLevyEmailSubject(args.schemeName, args.levyRun.periodLabel);

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
        console.error("[sendLevyNoticeEmail] Resend API error:", error);
        return {
          success: false,
          error: error.message || "Unknown Resend error",
        };
      }

      console.log(
        "[sendLevyNoticeEmail] Email sent to",
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
      console.error("[sendLevyNoticeEmail] Exception:", errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
});
