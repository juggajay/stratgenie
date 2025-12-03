"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #334155;
`;

const buttonStyle = `
  display: inline-block;
  background-color: #2563eb;
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
`;

function generateStrataRollEmail(name?: string): string {
  const greeting = name ? `Hi ${name},` : "Hi there,";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="${baseStyles} background-color: #f8fafc; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Your Strata Roll Template</h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <p style="margin-top: 0;">${greeting}</p>

          <p>Thanks for downloading the StrataGenie Strata Roll Template! This NSW-compliant template includes all the fields required under the Strata Schemes Management Act 2015.</p>

          <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; font-weight: 500; color: #166534;">What's included:</p>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #166534;">
              <li>Lot number and unit entitlement fields</li>
              <li>Owner contact details section</li>
              <li>Correspondence address for notices</li>
              <li>Agent/tenant information</li>
              <li>Emergency contacts</li>
            </ul>
          </div>

          <p><strong>Remember:</strong> Under Section 178 of the Act, your strata roll must be updated within 14 days of any change in lot ownership or owner details.</p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="https://stratagenie.com.au/tools/strata-roll-template" style="${buttonStyle}">
              Download Template Again
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">

          <p style="font-size: 14px; color: #64748b;">
            <strong>Want to simplify strata management?</strong><br>
            StrataGenie helps self-managed strata committees stay compliant with automated reminders, document generation, and AI-powered guidance.
          </p>

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://stratagenie.com.au/sign-up" style="${buttonStyle} background-color: #0f172a;">
              Start Free Trial
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0;">StrataGenie - Strata compliance made simple</p>
          <p style="margin: 8px 0 0 0;">
            <a href="https://stratagenie.com.au/privacy" style="color: #94a3b8;">Privacy Policy</a> ·
            <a href="https://stratagenie.com.au/terms" style="color: #94a3b8;">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateHealthCheckEmail(
  name: string | undefined,
  score: number,
  rating: string,
  recommendations: string[]
): string {
  const greeting = name ? `Hi ${name},` : "Hi there,";

  const ratingColors: Record<string, { bg: string; text: string; border: string }> = {
    excellent: { bg: "#f0fdf4", text: "#166534", border: "#10b981" },
    good: { bg: "#eff6ff", text: "#1e40af", border: "#3b82f6" },
    "needs-attention": { bg: "#fffbeb", text: "#92400e", border: "#f59e0b" },
    "at-risk": { bg: "#fef2f2", text: "#991b1b", border: "#ef4444" },
  };

  const ratingLabels: Record<string, string> = {
    excellent: "Excellent",
    good: "Good",
    "needs-attention": "Needs Attention",
    "at-risk": "At Risk",
  };

  const colors = ratingColors[rating] || ratingColors.good;
  const label = ratingLabels[rating] || "Good";

  const recommendationsList = recommendations
    .map((rec, i) => `<li style="margin-bottom: 8px;">${rec}</li>`)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="${baseStyles} background-color: #f8fafc; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Your Compliance Health Check Results</h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <p style="margin-top: 0;">${greeting}</p>

          <p>Thanks for completing the StrataGenie Compliance Health Check! Here's a summary of your results:</p>

          <!-- Score Card -->
          <div style="text-align: center; margin: 32px 0;">
            <div style="background-color: ${colors.bg}; border: 2px solid ${colors.border}; border-radius: 12px; padding: 24px; display: inline-block;">
              <div style="font-size: 48px; font-weight: bold; color: ${colors.text};">${score}%</div>
              <div style="font-size: 18px; font-weight: 500; color: ${colors.text}; margin-top: 4px;">${label}</div>
            </div>
          </div>

          <!-- Recommendations -->
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h3 style="margin-top: 0; color: #1e293b;">Recommendations</h3>
            <ul style="margin: 0; padding-left: 20px; color: #475569;">
              ${recommendationsList}
            </ul>
          </div>

          <p>These recommendations are based on your answers and NSW strata compliance requirements. Taking action on these items will help protect your scheme from penalties and ensure smooth operations.</p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="https://stratagenie.com.au/tools/compliance-health-check" style="${buttonStyle} background-color: #7c3aed;">
              Retake Health Check
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">

          <p style="font-size: 14px; color: #64748b;">
            <strong>Want help improving your compliance score?</strong><br>
            StrataGenie tracks deadlines, generates compliant documents, and provides AI-powered guidance to keep your scheme on track.
          </p>

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://stratagenie.com.au/sign-up" style="${buttonStyle}">
              Start Free Trial
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0;">StrataGenie - Strata compliance made simple</p>
          <p style="margin: 8px 0 0 0;">
            <a href="https://stratagenie.com.au/privacy" style="color: #94a3b8;">Privacy Policy</a> ·
            <a href="https://stratagenie.com.au/terms" style="color: #94a3b8;">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send strata roll template download email
 */
export const sendStrataRollEmail = action({
  args: {
    to: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (_, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[sendStrataRollEmail] RESEND_API_KEY not configured");
      return { success: false, error: "Email not configured" };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: "StrataGenie <hello@stratagenie.com.au>",
        to: args.to,
        subject: "Your Free Strata Roll Template",
        html: generateStrataRollEmail(args.name),
      });

      if (error) {
        console.error("[sendStrataRollEmail] Error:", error);
        return { success: false, error: error.message };
      }

      console.log("[sendStrataRollEmail] Sent to:", args.to, "ID:", data?.id);
      return { success: true, messageId: data?.id };
    } catch (err) {
      console.error("[sendStrataRollEmail] Exception:", err);
      return { success: false, error: "Failed to send email" };
    }
  },
});

/**
 * Send compliance health check results email
 */
export const sendHealthCheckEmail = action({
  args: {
    to: v.string(),
    name: v.optional(v.string()),
    score: v.number(),
    rating: v.string(),
    recommendations: v.array(v.string()),
  },
  handler: async (_, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[sendHealthCheckEmail] RESEND_API_KEY not configured");
      return { success: false, error: "Email not configured" };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: "StrataGenie <hello@stratagenie.com.au>",
        to: args.to,
        subject: `Your Compliance Score: ${args.score}% - ${args.rating.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}`,
        html: generateHealthCheckEmail(args.name, args.score, args.rating, args.recommendations),
      });

      if (error) {
        console.error("[sendHealthCheckEmail] Error:", error);
        return { success: false, error: error.message };
      }

      console.log("[sendHealthCheckEmail] Sent to:", args.to, "ID:", data?.id);
      return { success: true, messageId: data?.id };
    } catch (err) {
      console.error("[sendHealthCheckEmail] Exception:", err);
      return { success: false, error: "Failed to send email" };
    }
  },
});
