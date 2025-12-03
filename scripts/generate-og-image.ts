/**
 * Script to generate OG image using Gemini API
 * Run with: npx tsx scripts/generate-og-image.ts
 */

import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Load environment variables
config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function main() {
  console.log("Generating OG image using Gemini API (Nano Banana Pro)...\n");

  try {
    const result = await client.action(api.actions.imageGeneration.generateImage, {
      prompt:
        "Create a professional hero image for StrataGenie, an AI-powered strata compliance software for NSW Australia. Show a modern apartment building with a subtle digital/AI overlay effect, representing smart building management. Include visual elements suggesting compliance checkmarks, document automation, and community harmony.",
      style: "og-image",
    });

    if (result.success) {
      console.log("Image generated successfully!");
      console.log("Storage ID:", result.storageId);
      console.log("Image URL:", result.imageUrl);
      console.log("\nYou can download this image and save it as public/og-image.png");
    } else {
      console.error("Failed to generate image:", result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
