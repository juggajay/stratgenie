"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { extractText } from "unpdf";

// ============================================================================
// Types
// ============================================================================

interface Chunk {
  text: string;
  chunkIndex: number;
  sectionHeader?: string;
}

// ============================================================================
// Embedding Generation
// ============================================================================

/**
 * Generate embeddings for a single text using OpenAI text-embedding-3-small.
 */
export const generateEmbedding = internalAction({
  args: {
    text: v.string(),
  },
  handler: async (_, args): Promise<number[]> => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY environment variable is not set. Add it to Convex Dashboard > Settings > Environment Variables."
      );
    }

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: args.text,
    });

    return response.data[0].embedding;
  },
});

/**
 * Generate embeddings for multiple texts in batch.
 * OpenAI supports batching up to 2048 inputs.
 */
export const generateEmbeddingsBatch = internalAction({
  args: {
    texts: v.array(v.string()),
  },
  handler: async (_, args): Promise<number[][]> => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY environment variable is not set. Add it to Convex Dashboard > Settings > Environment Variables."
      );
    }

    // OpenAI batch limit is 2048, but we'll chunk to be safe
    const BATCH_SIZE = 100;
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < args.texts.length; i += BATCH_SIZE) {
      const batch = args.texts.slice(i, i + BATCH_SIZE);

      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: batch,
      });

      // OpenAI returns embeddings in the same order as input
      for (const item of response.data) {
        allEmbeddings.push(item.embedding);
      }
    }

    return allEmbeddings;
  },
});

// ============================================================================
// PDF Text Extraction (reused from CH-0003)
// ============================================================================

/**
 * Extract text from a PDF file URL.
 * Returns the extracted text or throws an error.
 */
export const extractPdfText = internalAction({
  args: {
    fileUrl: v.string(),
  },
  handler: async (_, args): Promise<string> => {
    // Download the PDF file
    const pdfResponse = await fetch(args.fileUrl);
    if (!pdfResponse.ok) {
      throw new Error(
        `Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText}`
      );
    }

    // Check content type
    const contentType = pdfResponse.headers.get("content-type") || "";
    if (contentType.startsWith("image/")) {
      throw new Error(
        "File appears to be an image, not a PDF. Please upload a PDF file."
      );
    }

    // Convert to Uint8Array for unpdf
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfUint8Array = new Uint8Array(pdfBuffer);

    // Extract text from PDF using unpdf
    const pdfData = await extractText(pdfUint8Array);

    // unpdf returns { text: string[], totalPages: number }
    // Join all page texts into a single string
    const extractedText = Array.isArray(pdfData.text)
      ? pdfData.text.join("\n\n").trim()
      : String(pdfData.text || "").trim();

    return extractedText;
  },
});

// ============================================================================
// Text Chunking
// ============================================================================

/**
 * Split text into chunks with overlap.
 * Preserves section headers where detected.
 */
export function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): Chunk[] {
  const chunks: Chunk[] = [];

  // Detect section headers (patterns like "Bylaw 14", "## Section", "14.", etc.)
  const headerPattern = /^(#{1,3}\s+.+|Bylaw\s+\d+.*|\d+\.\s+.+|[A-Z][A-Z\s]+:)/gm;

  let currentHeader: string | undefined;
  let position = 0;
  let chunkIndex = 0;

  while (position < text.length) {
    // Find the chunk boundary
    let end = Math.min(position + chunkSize, text.length);

    // Try to break at a sentence or paragraph boundary if possible
    if (end < text.length) {
      // Look for paragraph break, sentence end, or word boundary
      const searchStart = Math.max(position + chunkSize - 100, position);
      const searchEnd = Math.min(position + chunkSize + 100, text.length);
      const searchText = text.slice(searchStart, searchEnd);

      // Prefer paragraph breaks
      const paragraphBreak = searchText.lastIndexOf("\n\n");
      if (paragraphBreak !== -1 && paragraphBreak > 50) {
        end = searchStart + paragraphBreak;
      } else {
        // Try sentence end
        const sentenceEnd = searchText.search(/[.!?]\s+/);
        if (sentenceEnd !== -1 && sentenceEnd > 50) {
          end = searchStart + sentenceEnd + 1;
        }
      }
    }

    const chunkText = text.slice(position, end).trim();

    // Check for headers in this chunk
    const headerMatch = chunkText.match(headerPattern);
    if (headerMatch) {
      currentHeader = headerMatch[0].trim();
    }

    if (chunkText.length > 0) {
      chunks.push({
        text: chunkText,
        chunkIndex,
        sectionHeader: currentHeader,
      });
      chunkIndex++;
    }

    // Move position with overlap
    position = end - overlap;
    if (position >= text.length - overlap) {
      break;
    }
  }

  return chunks;
}

// ============================================================================
// Public Action for Testing
// ============================================================================

/**
 * Test action to verify embedding generation works.
 */
export const testEmbedding = action({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      return { success: false, error: "OPENAI_API_KEY not set" };
    }

    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: args.text,
      });

      return {
        success: true,
        dimensions: response.data[0].embedding.length,
        model: response.model,
        usage: response.usage,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
