"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";

/**
 * Image Generation using Google Gemini (Nano Banana Pro)
 * Uses Gemini 3 Pro Image for high-quality blog and marketing images
 */

// Nano Banana Pro model for high-quality image generation
const GEMINI_MODEL = "gemini-2.0-flash-exp-image-generation";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GeminiImageResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: {
          mimeType: string;
          data: string;
        };
        text?: string;
      }>;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

/**
 * Generate an image using Gemini API
 */
export const generateImage = action({
  args: {
    prompt: v.string(),
    style: v.optional(
      v.union(
        v.literal("blog-hero"),
        v.literal("og-image"),
        v.literal("pillar-page"),
        v.literal("tool-page"),
        v.literal("suburb-page")
      )
    ),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    imageUrl?: string;
    storageId?: string;
    error?: string;
  }> => {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return { success: false, error: "GOOGLE_GEMINI_API_KEY not configured" };
    }

    // Build style-specific prompt enhancements
    const stylePrompts: Record<string, string> = {
      "blog-hero":
        "Professional minimalist illustration, Australian strata building theme, blue and teal color palette (#0d9488, #0891b2), clean modern design, suitable for blog header at 1200x630px aspect ratio",
      "og-image":
        "Professional marketing graphic, modern SaaS aesthetic, blue and teal gradient background, clean typography friendly, 1200x630px social media card style",
      "pillar-page":
        "Isometric illustration style, NSW strata buildings, professional business aesthetic, informative and trustworthy feel",
      "tool-page":
        "Clean UI mockup style, calculator/tool interface, modern SaaS design, professional and user-friendly",
      "suburb-page":
        "Sydney suburb skyline with apartment buildings, professional photography style, warm natural lighting, Australian urban landscape",
    };

    const styleEnhancement = args.style
      ? stylePrompts[args.style]
      : stylePrompts["blog-hero"];

    const fullPrompt = `${args.prompt}. Style: ${styleEnhancement}. The image should be professional, high-quality, and suitable for a business website. No text or watermarks in the image.`;

    try {
      // Use header-based authentication (more secure than URL query parameter)
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error:", errorText);
        return {
          success: false,
          error: `Gemini API error: ${response.status} - ${errorText}`,
        };
      }

      const data: GeminiImageResponse = await response.json();

      if (data.error) {
        return {
          success: false,
          error: data.error.message,
        };
      }

      // Extract image data from response
      const imagePart = data.candidates?.[0]?.content?.parts?.find(
        (part) => part.inlineData
      );

      if (!imagePart?.inlineData) {
        return {
          success: false,
          error: "No image generated in response",
        };
      }

      // Convert base64 to blob and store in Convex
      const imageBuffer = Buffer.from(imagePart.inlineData.data, "base64");
      const blob = new Blob([imageBuffer], {
        type: imagePart.inlineData.mimeType,
      });

      // Store the image in Convex storage
      const storageId = await ctx.storage.store(blob);
      const imageUrl = await ctx.storage.getUrl(storageId);

      return {
        success: true,
        storageId: storageId,
        imageUrl: imageUrl || undefined,
      };
    } catch (error) {
      console.error("Image generation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Generate OG image for the homepage
 */
export const generateOGImage = action({
  args: {},
  handler: async (ctx): Promise<{
    success: boolean;
    imageUrl?: string;
    error?: string;
  }> => {
    const result = await ctx.runAction(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (await import("../actions/imageGeneration")).generateImage as any,
      {
        prompt:
          "Create a professional hero image for StrataGenie, an AI-powered strata compliance software for NSW Australia. Show a modern apartment building with a subtle digital/AI overlay effect, representing smart building management. Include visual elements suggesting compliance checkmarks, document automation, and community harmony.",
        style: "og-image" as const,
      }
    );

    return result;
  },
});

/**
 * Generate blog post hero image based on title and topic
 */
export const generateBlogHeroImage = action({
  args: {
    title: v.string(),
    topic: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    imageUrl?: string;
    storageId?: string;
    error?: string;
  }> => {
    const categoryHints: Record<string, string> = {
      compliance: "legal documents, compliance checkmarks, official stamps",
      financial: "charts, calculators, financial reports, levy notices",
      maintenance: "building tools, repair equipment, maintenance workers",
      "self-managed": "community meeting, teamwork, independence",
    };

    const categoryHint = args.category
      ? categoryHints[args.category] || ""
      : "";

    const prompt = `Create a blog hero image for an article titled "${args.title}" about ${args.topic} in NSW strata management. ${categoryHint ? `Include visual elements related to: ${categoryHint}.` : ""} The image should be professional and informative, suitable for a business blog.`;

    const result = await ctx.runAction(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (await import("../actions/imageGeneration")).generateImage as any,
      {
        prompt,
        style: "blog-hero" as const,
      }
    );

    return result;
  },
});
