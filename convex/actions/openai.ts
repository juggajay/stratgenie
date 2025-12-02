"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { extractText } from "unpdf";

// Return type for extraction results
type ExtractionResult =
  | {
      success: true;
      data: {
        vendorName: string | null;
        invoiceDate: string | null;
        totalAmount: number | null;
        taxAmount: number | null;
        description: string | null;
        category: string | null;
        confidence: number;
      };
    }
  | {
      success: false;
      error: string;
      reason?: string;
      rawResponse?: string;
    };

/**
 * Extract invoice data from an image or PDF using OpenAI GPT-4o.
 *
 * - For images: Uses GPT-4o Vision mode
 * - For PDFs: Extracts text with pdf-parse, then uses GPT-4o text mode
 *
 * Returns structured JSON with vendor, date, amounts, and description.
 */
export const extractInvoiceData = action({
  args: {
    fileUrl: v.string(), // Public URL to the invoice file
    fileName: v.optional(v.string()), // Original filename to detect type
  },
  handler: async (_, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY environment variable is not set. Add it to Convex Dashboard > Settings > Environment Variables."
      );
    }

    try {
      // Detect file type - prefer fileName, fallback to content-type detection
      const isPdf = await detectIfPdf(args.fileUrl, args.fileName);

      let response: ExtractionResult;

      if (isPdf) {
        // PDF extraction using pdf-parse + text mode
        response = await extractFromPdf(openai, args.fileUrl);
      } else {
        // Image extraction using Vision mode
        response = await extractFromImage(openai, args.fileUrl);
      }

      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        error: message,
      };
    }
  },
});

/**
 * Detect if the file is a PDF based on filename or content-type.
 */
async function detectIfPdf(
  fileUrl: string,
  fileName?: string
): Promise<boolean> {
  // First check filename extension (most reliable if provided)
  if (fileName) {
    const lowerFileName = fileName.toLowerCase();
    if (lowerFileName.endsWith(".pdf")) {
      return true;
    }
    // If filename has a known image extension, it's not a PDF
    if (
      lowerFileName.endsWith(".png") ||
      lowerFileName.endsWith(".jpg") ||
      lowerFileName.endsWith(".jpeg") ||
      lowerFileName.endsWith(".gif") ||
      lowerFileName.endsWith(".webp")
    ) {
      return false;
    }
  }

  // Fallback: Check content-type via HEAD request
  try {
    const headResponse = await fetch(fileUrl, { method: "HEAD" });
    const contentType = headResponse.headers.get("content-type") || "";

    if (contentType.includes("application/pdf")) {
      return true;
    }
    if (contentType.startsWith("image/")) {
      return false;
    }
  } catch {
    // HEAD request failed, continue to next check
  }

  // Last resort: Check URL for hints
  const lowerUrl = fileUrl.toLowerCase();
  if (lowerUrl.includes(".pdf") || lowerUrl.includes("application/pdf")) {
    return true;
  }

  // Default to image (Vision API) if we can't determine
  return false;
}

/**
 * Extract invoice data from an image using GPT-4o Vision.
 */
async function extractFromImage(
  openai: OpenAI,
  fileUrl: string
): Promise<ExtractionResult> {
  const prompt = getVisionPrompt();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: fileUrl,
              detail: "high",
            },
          },
        ],
      },
    ],
    max_tokens: 1000,
    temperature: 0,
  });

  return parseOpenAIResponse(response.choices[0]?.message?.content);
}

/**
 * Extract invoice data from a PDF using unpdf + GPT-4o text mode.
 */
async function extractFromPdf(
  openai: OpenAI,
  fileUrl: string
): Promise<ExtractionResult> {
  // Download the PDF file
  const pdfResponse = await fetch(fileUrl);
  if (!pdfResponse.ok) {
    return {
      success: false,
      error: `Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText}`,
    };
  }

  // Double-check content type from response
  const contentType = pdfResponse.headers.get("content-type") || "";
  if (contentType.startsWith("image/")) {
    // This is actually an image, not a PDF - redirect to image extraction
    // This shouldn't happen if detectIfPdf worked correctly, but just in case
    return {
      success: false,
      error:
        "File appears to be an image, not a PDF. Please try uploading again.",
    };
  }

  // Convert to Uint8Array for unpdf
  const pdfBuffer = await pdfResponse.arrayBuffer();
  const pdfUint8Array = new Uint8Array(pdfBuffer);

  // Extract text from PDF using unpdf
  let pdfData;
  try {
    pdfData = await extractText(pdfUint8Array);
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  // unpdf returns { text: string[], totalPages: number }
  // Join all page texts into a single string
  const extractedText = Array.isArray(pdfData.text)
    ? pdfData.text.join("\n\n").trim()
    : String(pdfData.text || "").trim();

  // GUARD CLAUSE: Check for scanned PDFs with no text layer
  if (extractedText.length < 20) {
    return {
      success: false,
      error:
        "This PDF appears to be a scanned image (no text layer). Please upload a PNG/JPG screenshot instead.",
    };
  }

  // Use GPT-4o text mode to extract structured data
  const prompt = getTextPrompt(extractedText);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 1000,
    temperature: 0,
  });

  return parseOpenAIResponse(response.choices[0]?.message?.content);
}

/**
 * Prompt for Vision mode (images).
 */
function getVisionPrompt(): string {
  return `You are an expert invoice data extractor for Australian businesses.

Analyze this invoice image and extract the following information as JSON:

{
  "vendor_name": "Name of the business/vendor issuing the invoice",
  "invoice_date": "Date on the invoice in ISO format (YYYY-MM-DD)",
  "total_amount_cents": Total amount INCLUDING GST in cents (e.g., $440.00 = 44000),
  "tax_amount_cents": GST/tax amount in cents (e.g., $40.00 = 4000),
  "description": "Brief description of goods/services",
  "category": "One of: repairs, insurance, utilities, admin, cleaning, gardening, legal, other",
  "confidence": A number from 0 to 1 indicating your confidence in the extraction
}

Important rules:
1. All amounts MUST be in Australian cents (multiply dollars by 100)
2. If GST is not explicitly shown, calculate it as 1/11 of the total (standard Australian GST)
3. If you cannot confidently extract a field, set it to null
4. The total_amount_cents should be the final payable amount INCLUDING GST
5. Return ONLY valid JSON, no markdown or explanation

If you cannot read the invoice at all, return:
{
  "error": "Could not extract invoice data",
  "reason": "Brief explanation"
}`;
}

/**
 * Prompt for text mode (PDFs with text layer).
 */
function getTextPrompt(invoiceText: string): string {
  return `You are an expert invoice data extractor for Australian businesses.

Extract the following information from this invoice text and return as JSON:

{
  "vendor_name": "Name of the business/vendor issuing the invoice",
  "invoice_date": "Date on the invoice in ISO format (YYYY-MM-DD)",
  "total_amount_cents": Total amount INCLUDING GST in cents (e.g., $440.00 = 44000),
  "tax_amount_cents": GST/tax amount in cents (e.g., $40.00 = 4000),
  "description": "Brief description of goods/services",
  "category": "One of: repairs, insurance, utilities, admin, cleaning, gardening, legal, other",
  "confidence": A number from 0 to 1 indicating your confidence in the extraction
}

Important rules:
1. All amounts MUST be in Australian cents (multiply dollars by 100)
2. If GST is not explicitly shown, calculate it as 1/11 of the total (standard Australian GST)
3. If you cannot confidently extract a field, set it to null
4. The total_amount_cents should be the final payable amount INCLUDING GST
5. Return ONLY valid JSON, no markdown or explanation

Invoice text:
---
${invoiceText}
---

If you cannot extract meaningful data, return:
{
  "error": "Could not extract invoice data",
  "reason": "Brief explanation"
}`;
}

/**
 * Parse the OpenAI response into our standard format.
 */
function parseOpenAIResponse(
  content: string | null | undefined
): ExtractionResult {
  if (!content) {
    return {
      success: false,
      error: "No response from OpenAI",
    };
  }

  try {
    // Remove markdown code blocks if present
    const jsonString = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const extracted = JSON.parse(jsonString);

    // Check for extraction error
    if (extracted.error) {
      return {
        success: false,
        error: extracted.error,
        reason: extracted.reason,
      };
    }

    // Return successful extraction
    return {
      success: true,
      data: {
        vendorName: extracted.vendor_name || null,
        invoiceDate: extracted.invoice_date || null,
        totalAmount: extracted.total_amount_cents || null,
        taxAmount: extracted.tax_amount_cents || null,
        description: extracted.description || null,
        category: extracted.category || null,
        confidence: extracted.confidence || 0.5,
      },
    };
  } catch {
    return {
      success: false,
      error: "Failed to parse OpenAI response",
      rawResponse: content,
    };
  }
}
