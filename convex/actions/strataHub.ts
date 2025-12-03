"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import OpenAI from "openai";
import { extractText } from "unpdf";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for extracting NSW Strata Hub data
const EXTRACTION_SYSTEM_PROMPT = `You are an expert at extracting data from NSW Strata scheme documents (AGM Minutes, Financial Statements, Annual Reports).

Your task is to extract specific data points required for the NSW Strata Hub portal reporting.

IMPORTANT RULES:
1. Only extract data you can clearly identify in the document
2. Return null for any field you cannot confidently determine
3. All monetary values must be converted to cents (multiply dollars by 100)
4. Dates must be in ISO format: YYYY-MM-DD
5. Do NOT guess or hallucinate - if uncertain, return null

Extract the following fields if present:
- strataPlanNumber: The strata plan number (e.g., "SP12345", "SP 12345")
- lastAfssDate: The date of the last Annual Fire Safety Statement (AFSS)
- capitalWorksFundBalance: The capital works fund (sinking fund) balance in CENTS
- adminFundBalance: The administrative fund balance in CENTS
- insuranceReplacementValue: The building insurance replacement/sum insured value in CENTS
- lastAgmDate: The date of the last Annual General Meeting
- totalLots: The total number of lots in the scheme

Respond ONLY with a valid JSON object. No explanation, no markdown, just the JSON object.

Example response:
{
  "strataPlanNumber": "SP12345",
  "lastAfssDate": "2024-06-15",
  "capitalWorksFundBalance": 4523100,
  "adminFundBalance": 1234500,
  "insuranceReplacementValue": 1500000000,
  "lastAgmDate": "2024-03-20",
  "totalLots": 24
}`;

interface ExtractedData {
  strataPlanNumber: string | null;
  lastAfssDate: string | null;
  capitalWorksFundBalance: number | null;
  adminFundBalance: number | null;
  insuranceReplacementValue: number | null;
  lastAgmDate: string | null;
  totalLots: number | null;
}

/**
 * Analyze an uploaded PDF document and extract Strata Hub data
 */
export const analyzeDocument = action({
  args: {
    reportId: v.id("strataHubReports"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Get the file from Convex storage
      const fileUrl = await ctx.storage.getUrl(args.storageId);
      if (!fileUrl) {
        await ctx.runMutation(internal.strataHub.markReportFailed, {
          reportId: args.reportId,
          errorMessage: "Could not retrieve uploaded file",
        });
        return { success: false, error: "File not found" };
      }

      // 2. Fetch and parse the PDF
      console.log("[analyzeDocument] Fetching PDF from storage...");
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();

      let extractedText: string;
      try {
        const result = await extractText(new Uint8Array(arrayBuffer));
        // unpdf returns text as an array of strings (one per page), join them
        extractedText = Array.isArray(result.text)
          ? result.text.join('\n')
          : String(result.text || '');
        console.log("[analyzeDocument] Extracted", extractedText.length, "characters from PDF");
      } catch (pdfError) {
        console.error("[analyzeDocument] PDF parsing failed:", pdfError);
        await ctx.runMutation(internal.strataHub.markReportFailed, {
          reportId: args.reportId,
          errorMessage: "Could not parse PDF. Please ensure the document contains selectable text (not scanned images).",
        });
        return { success: false, error: "PDF parsing failed" };
      }

      // 3. Check if we got meaningful text
      if (extractedText.trim().length < 100) {
        await ctx.runMutation(internal.strataHub.markReportFailed, {
          reportId: args.reportId,
          errorMessage: "The PDF appears to be empty or contains only scanned images. Please upload a document with selectable text.",
        });
        return { success: false, error: "Insufficient text content" };
      }

      // 4. Truncate if too long (keep first ~15000 chars to fit in context)
      const truncatedText = extractedText.substring(0, 15000);

      // 5. Send to OpenAI for extraction
      console.log("[analyzeDocument] Sending to OpenAI for analysis...");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Extract the NSW Strata Hub reporting data from this document:\n\n${truncatedText}`,
          },
        ],
        temperature: 0.1, // Low temperature for consistent extraction
        max_tokens: 500,
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        await ctx.runMutation(internal.strataHub.markReportFailed, {
          reportId: args.reportId,
          errorMessage: "AI analysis returned empty response",
        });
        return { success: false, error: "Empty AI response" };
      }

      // 6. Parse the JSON response
      console.log("[analyzeDocument] AI Response:", aiResponse);
      let parsed: ExtractedData;
      try {
        // Remove any markdown code blocks if present
        const cleanJson = aiResponse.replace(/```json\n?|\n?```/g, "").trim();
        parsed = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error("[analyzeDocument] Failed to parse AI response:", parseError);
        await ctx.runMutation(internal.strataHub.markReportFailed, {
          reportId: args.reportId,
          errorMessage: "Failed to parse AI analysis results",
        });
        return { success: false, error: "JSON parse failed" };
      }

      // 7. Convert to the format expected by the database (BigInt for money)
      const extractedData = {
        strataPlanNumber: parsed.strataPlanNumber ?? undefined,
        lastAfssDate: parsed.lastAfssDate ?? undefined,
        capitalWorksFundBalance: parsed.capitalWorksFundBalance
          ? BigInt(Math.round(parsed.capitalWorksFundBalance))
          : undefined,
        adminFundBalance: parsed.adminFundBalance
          ? BigInt(Math.round(parsed.adminFundBalance))
          : undefined,
        insuranceReplacementValue: parsed.insuranceReplacementValue
          ? BigInt(Math.round(parsed.insuranceReplacementValue))
          : undefined,
        lastAgmDate: parsed.lastAgmDate ?? undefined,
        totalLots: parsed.totalLots ?? undefined,
      };

      // 8. Save the results
      await ctx.runMutation(internal.strataHub.updateReportWithData, {
        reportId: args.reportId,
        extractedData,
      });

      console.log("[analyzeDocument] Successfully processed document");
      return { success: true };
    } catch (error) {
      console.error("[analyzeDocument] Unexpected error:", error);
      await ctx.runMutation(internal.strataHub.markReportFailed, {
        reportId: args.reportId,
        errorMessage: "An unexpected error occurred during analysis",
      });
      return { success: false, error: "Unexpected error" };
    }
  },
});
