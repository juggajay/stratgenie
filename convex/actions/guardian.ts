"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api, internal } from "../_generated/api";
import OpenAI from "openai";
import { extractText } from "unpdf";
import { chunkText } from "./embeddings";

/**
 * Calculate cosine similarity between two vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

// ============================================================================
// Bylaw Ingestion Action
// ============================================================================

/**
 * Ingest a bylaw PDF - extract text, chunk, embed, and store.
 */
export const ingestBylaws = action({
  args: {
    bylawId: v.id("bylaws"),
  },
  handler: async (ctx, args) => {
    // Get the bylaw record
    const bylaw = await ctx.runQuery(api.guardian.getBylaw, {
      bylawId: args.bylawId,
    });

    if (!bylaw) {
      throw new Error("Bylaw not found");
    }

    if (!bylaw.fileUrl) {
      await ctx.runMutation(internal.guardian.updateBylawStatus, {
        bylawId: args.bylawId,
        status: "failed",
        errorMessage: "Could not get file URL",
      });
      return;
    }

    try {
      // Step 1: Extract text from PDF
      const pdfResponse = await fetch(bylaw.fileUrl);
      if (!pdfResponse.ok) {
        throw new Error(
          `Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText}`
        );
      }

      const pdfBuffer = await pdfResponse.arrayBuffer();
      const pdfUint8Array = new Uint8Array(pdfBuffer);
      const pdfData = await extractText(pdfUint8Array);

      const extractedText = Array.isArray(pdfData.text)
        ? pdfData.text.join("\n\n").trim()
        : String(pdfData.text || "").trim();

      // Step 2: Validate text layer exists (minimum 100 chars for bylaws)
      if (extractedText.length < 100) {
        await ctx.runMutation(internal.guardian.updateBylawStatus, {
          bylawId: args.bylawId,
          status: "failed",
          errorMessage:
            "This PDF appears to be a scanned image (no text layer). Please upload a text-based PDF.",
        });
        return;
      }

      // Step 3: Chunk the text
      const chunks = chunkText(extractedText, 1000, 200);

      if (chunks.length === 0) {
        await ctx.runMutation(internal.guardian.updateBylawStatus, {
          bylawId: args.bylawId,
          status: "failed",
          errorMessage: "Could not extract any text chunks from the PDF.",
        });
        return;
      }

      // Step 4: Generate embeddings for all chunks
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      if (!process.env.OPENAI_API_KEY) {
        await ctx.runMutation(internal.guardian.updateBylawStatus, {
          bylawId: args.bylawId,
          status: "failed",
          errorMessage: "OpenAI API key not configured.",
        });
        return;
      }

      // Batch embed chunks (OpenAI supports up to 2048 inputs)
      const BATCH_SIZE = 100;
      const allEmbeddings: number[][] = [];

      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batchChunks = chunks.slice(i, i + BATCH_SIZE);
        const batchTexts = batchChunks.map((c) => c.text);

        const response = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: batchTexts,
        });

        for (const item of response.data) {
          allEmbeddings.push(item.embedding);
        }
      }

      // Step 5: Store chunks with embeddings
      const chunksToStore = chunks.map((chunk, i) => ({
        schemeId: bylaw.schemeId,
        bylawId: args.bylawId,
        chunkIndex: chunk.chunkIndex,
        text: chunk.text,
        embedding: allEmbeddings[i],
        sectionHeader: chunk.sectionHeader,
      }));

      // Store in batches to avoid mutation size limits
      const STORE_BATCH_SIZE = 20;
      for (let i = 0; i < chunksToStore.length; i += STORE_BATCH_SIZE) {
        const batch = chunksToStore.slice(i, i + STORE_BATCH_SIZE);
        await ctx.runMutation(internal.guardian.storeChunks, {
          chunks: batch,
        });
      }

      // Step 6: Update bylaw status to ready
      await ctx.runMutation(internal.guardian.updateBylawStatus, {
        bylawId: args.bylawId,
        status: "ready",
        totalChunks: chunks.length,
      });
    } catch (error) {
      await ctx.runMutation(internal.guardian.updateBylawStatus, {
        bylawId: args.bylawId,
        status: "failed",
        errorMessage:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },
});

// ============================================================================
// Guardian Query Action
// ============================================================================

/**
 * Ask the Guardian Agent a question about bylaws.
 */
export const askGuardian = action({
  args: {
    schemeId: v.id("schemes"),
    question: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if scheme has bylaws
    const bylaw = await ctx.runQuery(api.guardian.getActiveBylaw, {
      schemeId: args.schemeId,
    });

    if (!bylaw) {
      return {
        success: false,
        error: "no_bylaws",
        message:
          "No bylaws have been uploaded for this scheme. Please upload your scheme's bylaws first.",
      };
    }

    // Generate embedding for the question
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: "config_error",
        message: "OpenAI API key not configured.",
      };
    }

    try {
      // Step 1: Embed the question
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: args.question,
      });
      const questionEmbedding = embeddingResponse.data[0].embedding;

      // Step 2: Get all chunks for the scheme and compute similarity
      const allChunks = await ctx.runQuery(internal.guardian.getChunksForScheme, {
        schemeId: args.schemeId,
      });

      console.log(`[Guardian] Searching for schemeId: ${args.schemeId}`);
      console.log(`[Guardian] Found ${allChunks.length} chunks for scheme`);
      if (allChunks.length > 0) {
        console.log(`[Guardian] First chunk schemeId: ${allChunks[0].schemeId}`);
        console.log(`[Guardian] First chunk text preview: ${allChunks[0].text.slice(0, 100)}...`);
        console.log(`[Guardian] First chunk has embedding: ${allChunks[0].embedding?.length > 0}`);
      }

      if (allChunks.length === 0) {
        return {
          success: true,
          answer:
            "No bylaw content has been indexed yet. The bylaws may still be processing, or the PDF may not have extractable text.",
          citations: [],
          disclaimer:
            "This is not legal advice. Please consult a lawyer for legal matters.",
        };
      }

      // Calculate scores and sort
      const scoredResults = allChunks.map((chunk) => {
        const score = cosineSimilarity(questionEmbedding, chunk.embedding);
        return { ...chunk, score };
      });

      scoredResults.sort((a, b) => b.score - a.score);

      // Log top scores for debugging
      const topScores = scoredResults.slice(0, 5).map(r => r.score.toFixed(3));
      console.log(`[Guardian] Top 5 similarity scores: ${topScores.join(", ")}`);

      // Always use top 5 chunks - let GPT determine relevance from context
      // text-embedding-3-small typically has lower absolute scores (0.2-0.5 range)
      const relevantChunks = scoredResults.slice(0, 5);

      // Step 3: Build context from retrieved chunks
      const context = relevantChunks
        .map((chunk, i) => {
          const header = chunk.sectionHeader
            ? `[${chunk.sectionHeader}]`
            : `[Section ${i + 1}]`;
          return `${header}\n${chunk.text}`;
        })
        .join("\n\n---\n\n");

      // Step 4: Generate answer using GPT-4o
      const systemPrompt = `You are a helpful assistant for NSW strata scheme bylaws. Your role is to help committee members understand their scheme's bylaws.

IMPORTANT RULES:
1. Answer based ONLY on the provided bylaw excerpts below. Do not use any external knowledge.
2. If the answer is not clearly stated in the excerpts, say "I couldn't find specific information about this in the provided bylaws."
3. Cite the relevant section or bylaw number when possible (e.g., "According to Bylaw 14...").
4. Keep your answers clear and concise.
5. Never provide legal advice. Remind users this is informational only.

BYLAW EXCERPTS:
${context}`;

      const chatResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: args.question },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      const answer = chatResponse.choices[0]?.message?.content || "";

      // Step 5: Format citations
      const citations = relevantChunks.map((chunk) => ({
        text: chunk.text.slice(0, 200) + (chunk.text.length > 200 ? "..." : ""),
        sectionHeader: chunk.sectionHeader,
        score: Math.round(chunk.score * 100) / 100,
      }));

      return {
        success: true,
        answer,
        citations,
        disclaimer:
          "This is not legal advice. The information provided is based solely on the uploaded bylaws. Please consult a qualified lawyer for legal matters.",
      };
    } catch (error) {
      return {
        success: false,
        error: "processing_error",
        message:
          error instanceof Error ? error.message : "An error occurred processing your question.",
      };
    }
  },
});
