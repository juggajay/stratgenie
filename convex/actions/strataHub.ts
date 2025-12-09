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
        console.log("[analyzeDocument] Raw unpdf result:", JSON.stringify(result, null, 2).substring(0, 500));

        // Handle various unpdf return formats
        // Cast to any to handle different unpdf versions
        const pdfResult = result as { text?: string | string[]; pages?: Array<{ text?: string }>; totalPages?: number };
        if (typeof result === 'string') {
          extractedText = result;
        } else if (pdfResult && typeof pdfResult.text === 'string') {
          extractedText = pdfResult.text;
        } else if (pdfResult && Array.isArray(pdfResult.text)) {
          extractedText = pdfResult.text.join('\n');
        } else if (pdfResult && pdfResult.pages && Array.isArray(pdfResult.pages)) {
          // Some versions return { pages: [{ text: "..." }, ...] }
          extractedText = pdfResult.pages.map((p: { text?: string }) => p.text || '').join('\n');
        } else {
          // Fallback: stringify and extract
          extractedText = String(pdfResult?.text || result || '');
        }

        console.log("[analyzeDocument] Extracted", extractedText.length, "characters from PDF");

        // Log first 2000 chars of raw text for debugging extraction issues
        if (extractedText.length > 0) {
          console.log("[analyzeDocument] Raw text preview (first 2000 chars):");
          console.log(extractedText.substring(0, 2000));
        }
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

// ============================================================================
// Insurance Certificate Extraction (CH-0013)
// ============================================================================

const INSURANCE_EXTRACTION_PROMPT = `You are an expert at extracting data from Australian insurance certificates (Certificate of Currency, Policy Schedules).

Your task is to extract key insurance details for NSW Strata scheme compliance reporting.

## CRITICAL CURRENCY RULES:
- Convert dollars to cents by multiplying by 100.
- Return exact values, no rounding.
- If a value is $15,000,000.00, return 1500000000.

## FIELD EXTRACTION RULES:

1. **insurerName**: The name of the insurance company (e.g., "QBE Insurance", "Allianz Australia").

2. **policyNumber**: The policy or certificate number. Look for "Policy No", "Policy Number", "Certificate No".

3. **replacementValue**: The building replacement/sum insured value. Look for:
   - "Sum Insured"
   - "Building Replacement Value"
   - "Total Sum Insured"
   - "Building Sum Insured"
   Return value in CENTS (exact, no rounding).

4. **expiryDate**: When the policy expires. Look for:
   - "Expiry Date"
   - "Period of Insurance: ... to [date]"
   - "Cover until"
   - "Policy End Date"
   Return as ISO format: YYYY-MM-DD

5. **inceptionDate**: When the policy started. Look for:
   - "Inception Date"
   - "Period of Insurance: [date] to ..."
   - "Cover from"
   - "Policy Start Date"
   Return as ISO format: YYYY-MM-DD

6. **strataPlanNumber**: If mentioned on the certificate.

## GENERAL RULES:
- Only extract data you can clearly identify.
- Return null for any field you cannot confidently determine.
- Do NOT guess - if uncertain, return null.

Respond ONLY with a valid JSON object:
{
  "insurerName": "string or null",
  "policyNumber": "string or null",
  "replacementValue": number_in_cents_or_null,
  "expiryDate": "YYYY-MM-DD or null",
  "inceptionDate": "YYYY-MM-DD or null",
  "strataPlanNumber": "string or null"
}`;

interface InsuranceExtractedData {
  insurerName: string | null;
  policyNumber: string | null;
  replacementValue: number | null;
  expiryDate: string | null;
  inceptionDate: string | null;
  strataPlanNumber: string | null;
}

/**
 * Analyze an insurance certificate and extract details
 */
export const analyzeInsuranceCertificate = action({
  args: {
    schemeId: v.id("schemes"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    data?: InsuranceExtractedData;
    error?: string;
  }> => {
    try {
      // 1. Get the file from Convex storage
      const fileUrl = await ctx.storage.getUrl(args.storageId);
      if (!fileUrl) {
        return { success: false, error: "File not found" };
      }

      // 2. Fetch and parse the PDF
      console.log("[analyzeInsuranceCertificate] Fetching PDF from storage...");
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();

      let extractedText: string;
      try {
        const result = await extractText(new Uint8Array(arrayBuffer));
        const pdfResult = result as { text?: string | string[]; pages?: Array<{ text?: string }> };

        if (typeof result === 'string') {
          extractedText = result;
        } else if (pdfResult && typeof pdfResult.text === 'string') {
          extractedText = pdfResult.text;
        } else if (pdfResult && Array.isArray(pdfResult.text)) {
          extractedText = pdfResult.text.join('\n');
        } else if (pdfResult && pdfResult.pages && Array.isArray(pdfResult.pages)) {
          extractedText = pdfResult.pages.map((p: { text?: string }) => p.text || '').join('\n');
        } else {
          extractedText = String(pdfResult?.text || result || '');
        }

        console.log("[analyzeInsuranceCertificate] Extracted", extractedText.length, "characters");
      } catch (pdfError) {
        console.error("[analyzeInsuranceCertificate] PDF parsing failed:", pdfError);
        return { success: false, error: "Could not parse PDF" };
      }

      if (extractedText.trim().length < 50) {
        return { success: false, error: "PDF appears empty or is a scanned image" };
      }

      // 3. Truncate and send to OpenAI
      const truncatedText = extractedText.substring(0, 10000);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: INSURANCE_EXTRACTION_PROMPT },
          {
            role: "user",
            content: `Extract insurance details from this certificate:\n\n${truncatedText}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 500,
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        return { success: false, error: "AI returned empty response" };
      }

      // 4. Parse the JSON response
      console.log("[analyzeInsuranceCertificate] AI Response:", aiResponse);
      let parsed: InsuranceExtractedData;
      try {
        const cleanJson = aiResponse.replace(/```json\n?|\n?```/g, "").trim();
        parsed = JSON.parse(cleanJson);
      } catch {
        console.error("[analyzeInsuranceCertificate] Failed to parse AI response");
        return { success: false, error: "Failed to parse AI response" };
      }

      return { success: true, data: parsed };
    } catch (error) {
      console.error("[analyzeInsuranceCertificate] Unexpected error:", error);
      return { success: false, error: "Unexpected error during analysis" };
    }
  },
});

// ============================================================================
// AFSS (Annual Fire Safety Statement) Extraction (CH-0013)
// ============================================================================

const AFSS_EXTRACTION_PROMPT = `You are an expert at extracting data from Australian Annual Fire Safety Statements (AFSS) and Fire Safety Certificates.

Your task is to extract key fire safety details for NSW Strata scheme compliance reporting.

## FIELD EXTRACTION RULES:

1. **afssDate**: The date the AFSS was issued/signed. Look for:
   - "Date of Statement"
   - "Statement Date"
   - "Signed" date
   - "Issued" date
   Return as ISO format: YYYY-MM-DD

2. **nextDueDate**: When the next AFSS is due (typically 1 year from issue). Look for:
   - "Valid until"
   - "Next statement due"
   - If not stated, this can be inferred as 1 year from afssDate
   Return as ISO format: YYYY-MM-DD (or null if cannot determine)

3. **buildingAddress**: The address of the building covered by this AFSS.

4. **strataPlanNumber**: If mentioned on the certificate.

5. **certifierName**: Name of the accredited practitioner or fire safety company.

6. **certifierLicenseNumber**: The license/accreditation number of the certifier.

## GENERAL RULES:
- Only extract data you can clearly identify.
- Return null for any field you cannot confidently determine.
- Do NOT guess - if uncertain, return null.
- AFSS documents may also be called "Annual Fire Safety Statement" or "Fire Safety Statement".

Respond ONLY with a valid JSON object:
{
  "afssDate": "YYYY-MM-DD or null",
  "nextDueDate": "YYYY-MM-DD or null",
  "buildingAddress": "string or null",
  "strataPlanNumber": "string or null",
  "certifierName": "string or null",
  "certifierLicenseNumber": "string or null"
}`;

interface AfssExtractedData {
  afssDate: string | null;
  nextDueDate: string | null;
  buildingAddress: string | null;
  strataPlanNumber: string | null;
  certifierName: string | null;
  certifierLicenseNumber: string | null;
}

/**
 * Analyze an AFSS certificate and extract details
 */
export const analyzeAfssCertificate = action({
  args: {
    schemeId: v.id("schemes"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    data?: AfssExtractedData;
    error?: string;
  }> => {
    try {
      // 1. Get the file from Convex storage
      const fileUrl = await ctx.storage.getUrl(args.storageId);
      if (!fileUrl) {
        return { success: false, error: "File not found" };
      }

      // 2. Fetch and parse the PDF
      console.log("[analyzeAfssCertificate] Fetching PDF from storage...");
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();

      let extractedText: string;
      try {
        const result = await extractText(new Uint8Array(arrayBuffer));
        const pdfResult = result as { text?: string | string[]; pages?: Array<{ text?: string }> };

        if (typeof result === 'string') {
          extractedText = result;
        } else if (pdfResult && typeof pdfResult.text === 'string') {
          extractedText = pdfResult.text;
        } else if (pdfResult && Array.isArray(pdfResult.text)) {
          extractedText = pdfResult.text.join('\n');
        } else if (pdfResult && pdfResult.pages && Array.isArray(pdfResult.pages)) {
          extractedText = pdfResult.pages.map((p: { text?: string }) => p.text || '').join('\n');
        } else {
          extractedText = String(pdfResult?.text || result || '');
        }

        console.log("[analyzeAfssCertificate] Extracted", extractedText.length, "characters");
      } catch (pdfError) {
        console.error("[analyzeAfssCertificate] PDF parsing failed:", pdfError);
        return { success: false, error: "Could not parse PDF" };
      }

      if (extractedText.trim().length < 50) {
        return { success: false, error: "PDF appears empty or is a scanned image" };
      }

      // 3. Truncate and send to OpenAI
      const truncatedText = extractedText.substring(0, 8000);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: AFSS_EXTRACTION_PROMPT },
          {
            role: "user",
            content: `Extract fire safety details from this AFSS document:\n\n${truncatedText}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 400,
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        return { success: false, error: "AI returned empty response" };
      }

      // 4. Parse the JSON response
      console.log("[analyzeAfssCertificate] AI Response:", aiResponse);
      let parsed: AfssExtractedData;
      try {
        const cleanJson = aiResponse.replace(/```json\n?|\n?```/g, "").trim();
        parsed = JSON.parse(cleanJson);
      } catch {
        console.error("[analyzeAfssCertificate] Failed to parse AI response");
        return { success: false, error: "Failed to parse AI response" };
      }

      return { success: true, data: parsed };
    } catch (error) {
      console.error("[analyzeAfssCertificate] Unexpected error:", error);
      return { success: false, error: "Unexpected error during analysis" };
    }
  },
});
