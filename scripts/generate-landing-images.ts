/**
 * Generate Landing Page Images using Gemini Nano Banana Pro
 * Run: npx ts-node scripts/generate-landing-images.ts
 */

import * as fs from "fs";
import * as path from "path";

const GEMINI_MODEL = "gemini-2.0-flash-exp-image-generation";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || "AIzaSyBbqRTDzD2M1GFFgv6y0VQqMdtu3SMRMdk";

interface ImageConfig {
  name: string;
  prompt: string;
  filename: string;
}

const imagesToGenerate: ImageConfig[] = [
  {
    name: "Hero Dashboard",
    prompt: "Create a sleek, modern dark-themed dashboard UI mockup for a strata management SaaS application. Show compliance status cards with green checkmarks, AGM countdown timer, financial summaries. Use a dark slate background (#0f172a) with blue (#3b82f6) and purple (#8b5cf6) accent glows. Glassmorphism cards with subtle transparency. Professional, minimal, futuristic. No text. 16:9 aspect ratio.",
    filename: "hero-dashboard.png",
  },
  {
    name: "AI Secretary Agent",
    prompt: "Create an abstract, futuristic illustration of an AI secretary agent. Show a stylized robotic assistant with calendar and document icons floating around it. Use blue (#3b82f6) as the primary color with subtle purple accents. Dark background with glowing elements. Modern, professional, minimal design. No text. Square format.",
    filename: "agent-secretary.png",
  },
  {
    name: "AI Treasurer Agent",
    prompt: "Create an abstract, futuristic illustration of an AI treasurer/financial agent. Show a stylized robotic assistant with floating invoice documents, calculator, and currency symbols. Use emerald green (#10b981) as the primary color. Dark background with glowing elements. Modern, professional, minimal design. No text. Square format.",
    filename: "agent-treasurer.png",
  },
  {
    name: "AI Guardian Agent",
    prompt: "Create an abstract, futuristic illustration of an AI legal/guardian agent. Show a stylized robotic assistant with scales of justice, legal documents, and shield icons. Use purple (#8b5cf6) as the primary color. Dark background with glowing elements. Modern, professional, minimal design. No text. Square format.",
    filename: "agent-guardian.png",
  },
  {
    name: "AI Postman Agent",
    prompt: "Create an abstract, futuristic illustration of an AI communication/postman agent. Show a stylized robotic assistant with email envelopes, notification bells, and message icons floating around. Use amber/orange (#f59e0b) as the primary color. Dark background with glowing elements. Modern, professional, minimal design. No text. Square format.",
    filename: "agent-postman.png",
  },
  {
    name: "Strata Hub Integration",
    prompt: "Create a modern illustration showing data integration and compliance. Show connected nodes, checkmarks, and data flowing between systems. Use emerald green (#10b981) and teal as primary colors. Dark background with glowing network lines. Abstract, professional, tech-focused. No text. 16:9 aspect ratio.",
    filename: "strata-hub-integration.png",
  },
  {
    name: "OG Image",
    prompt: "Create a professional Open Graph social media image for StrataGenie, an AI-powered strata management platform. Show a modern Australian apartment building with subtle AI/digital overlay effects - glowing circuit patterns, holographic compliance checkmarks. Dark blue gradient background (#0f172a to #1e3a5f). Futuristic, trustworthy, professional. No text. 1200x630 aspect ratio.",
    filename: "og-image.png",
  },
];

async function generateImage(config: ImageConfig): Promise<boolean> {
  console.log(`\n🎨 Generating: ${config.name}...`);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: config.prompt,
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
      console.error(`❌ API Error: ${response.status} - ${errorText}`);
      return false;
    }

    const data = await response.json();

    if (data.error) {
      console.error(`❌ Gemini Error: ${data.error.message}`);
      return false;
    }

    // Extract image data
    const imagePart = data.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData
    );

    if (!imagePart?.inlineData) {
      console.error(`❌ No image in response`);
      // Check if there's text explaining why
      const textPart = data.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.text
      );
      if (textPart?.text) {
        console.log(`   Response: ${textPart.text}`);
      }
      return false;
    }

    // Save image
    const outputDir = path.join(process.cwd(), "public", "images", "generated");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, config.filename);
    const imageBuffer = Buffer.from(imagePart.inlineData.data, "base64");
    fs.writeFileSync(outputPath, imageBuffer);

    console.log(`✅ Saved: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    return false;
  }
}

async function main() {
  console.log("🚀 Starting Gemini Nano Banana Pro Image Generation");
  console.log("=" .repeat(50));

  let successCount = 0;
  let failCount = 0;

  for (const config of imagesToGenerate) {
    const success = await generateImage(config);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    // Rate limiting - wait between requests
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✨ Complete! Generated ${successCount}/${imagesToGenerate.length} images`);
  if (failCount > 0) {
    console.log(`⚠️  ${failCount} images failed to generate`);
  }
}

main().catch(console.error);
