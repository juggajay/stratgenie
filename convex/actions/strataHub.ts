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

## CRITICAL CURRENCY RULES - READ CAREFULLY:
- Do NOT round any currency values. Return the EXACT value including cents.
- Convert dollars to cents by multiplying by 100.
- If a value is $14,250.85, return 1425085 (integer cents, no rounding).
- If a value is $45,231.00, return 4523100.
- If a value is $1,500,000.00, return 150000000.
- NEVER lose precision. Every cent matters for financial reporting.

## FIELD EXTRACTION RULES:

1. **strataPlanNumber**: Look for "SP" followed by numbers. Common formats: "SP12345", "SP 12345", "Strata Plan 12345", "Strata Plan No. 12345".

2. **lastAfssDate**: This is the Annual Fire Safety Statement date. Look for ANY of these terms:
   - "AFSS" or "A.F.S.S."
   - "Annual Fire Safety Statement"
   - "Fire Safety Statement"
   - "Fire safety certificate"
   Return as ISO format: YYYY-MM-DD

3. **capitalWorksFundBalance**: Look for ANY of these terms:
   - "Capital Works Fund"
   - "Sinking Fund"
   - "Capital Fund"
   - "Long-term maintenance fund"
   Return value in CENTS (exact, no rounding).

4. **adminFundBalance**: Look for ANY of these terms:
   - "Administrative Fund"
   - "Admin Fund"
   - "Administration Fund"
   - "Operating Fund"
   Return value in CENTS (exact, no rounding).

5. **insuranceReplacementValue**: Look for ANY of these terms:
   - "Sum Insured"
   - "Replacement Value"
   - "Building Insurance Value"
   - "Insured Value"
   Return value in CENTS (exact, no rounding).

6. **lastAgmDate**: Look for ANY of these terms:
   - "Annual General Meeting"
   - "AGM"
   - "A.G.M."
   - Meeting date in the document header
   Return as ISO format: YYYY-MM-DD

7. **totalLots**: Look for ANY of these terms:
   - "Total number of lots"
   - "Total lots"
   - "Number of lots"
   - "Lots:"
   - "X lots in the scheme"
   - "comprising X lots"
   Return as integer.

## GENERAL RULES:
- Only extract data you can clearly identify in the document.
- Return null for any field you cannot confidently determine.
- Do NOT guess or hallucinate - if uncertain, return null.
- Dates must be in ISO format: YYYY-MM-DD

Respond ONLY with a valid JSON object. No explanation, no markdown, just the JSON object.

Example response:
{
  "strataPlanNumber": "SP12345",
  "lastAfssDate": "2024-06-15",
  "capitalWorksFundBalance": 4523100,
  "adminFundBalance": 1425085,
  "insuranceReplacementValue": 150000000,
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

        // Log first 2000 chars of raw text for debugging extraction issues
        console.log("[analyzeDocument] Raw text preview (first 2000 chars):");
        console.log(extractedText.substring(0, 2000));
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
      // AI returns exact cents as integers, no rounding needed
      const extractedData = {
        strataPlanNumber: parsed.strataPlanNumber ?? undefined,
        lastAfssDate: parsed.lastAfssDate ?? undefined,
        capitalWorksFundBalance: parsed.capitalWorksFundBalance
          ? BigInt(parsed.capitalWorksFundBalance)
          : undefined,
        adminFundBalance: parsed.adminFundBalance
          ? BigInt(parsed.adminFundBalance)
          : undefined,
        insuranceReplacementValue: parsed.insuranceReplacementValue
          ? BigInt(parsed.insuranceReplacementValue)
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
