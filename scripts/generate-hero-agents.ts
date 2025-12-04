/**
 * Generate Cartoon Superhero Agent Images using Gemini Nano Banana Pro
 * Run: npx tsx scripts/generate-hero-agents.ts
 */

import * as fs from "fs";
import * as path from "path";

const GEMINI_MODEL = "gemini-2.0-flash-exp-image-generation";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const API_KEY = "AIzaSyBbqRTDzD2M1GFFgv6y0VQqMdtu3SMRMdk";

interface ImageConfig {
  name: string;
  prompt: string;
  filename: string;
}

const heroAgents: ImageConfig[] = [
  {
    name: "Secretary Superhero",
    prompt: `Create a fun cartoon superhero character representing an AI Secretary Agent.

    Character design:
    - Friendly robot/android superhero with a cape flowing dynamically
    - Blue color scheme (#3b82f6) with glowing accents
    - Holding a magical glowing calendar in one hand and a checklist in the other
    - Dynamic action pose - flying or leaping through the air
    - Clock/time symbols orbiting around them like a power aura
    - Wearing a superhero mask and suit with calendar/scheduling motifs
    - Confident, helpful expression

    Style: Pixar-inspired 3D cartoon, vibrant colors, dynamic lighting, dark gradient background (#0f172a to #1e293b), heroic and energetic pose. No text.`,
    filename: "hero-secretary.png",
  },
  {
    name: "Treasurer Superhero",
    prompt: `Create a fun cartoon superhero character representing an AI Treasurer/Financial Agent.

    Character design:
    - Friendly robot/android superhero with a flowing emerald green cape
    - Emerald green color scheme (#10b981) with gold accents
    - Holding a glowing calculator shield in one hand, golden coins floating around
    - Dynamic action pose - standing heroically or in flight
    - Dollar signs, charts, and invoice documents orbiting as power effects
    - Wearing a superhero suit with financial/money motifs
    - Smart, trustworthy expression with glasses

    Style: Pixar-inspired 3D cartoon, vibrant colors, dynamic lighting, dark gradient background (#0f172a to #1e293b), heroic and powerful pose. No text.`,
    filename: "hero-treasurer.png",
  },
  {
    name: "Guardian Superhero",
    prompt: `Create a fun cartoon superhero character representing an AI Guardian/Legal Agent.

    Character design:
    - Wise robot/android superhero with a majestic purple flowing cape
    - Purple color scheme (#8b5cf6) with silver/white accents
    - Holding golden scales of justice that glow with power
    - Dynamic pose - protective stance with one arm raised
    - Legal documents, shields, and gavel icons orbiting as magical effects
    - Wearing an armored superhero suit with justice/protection motifs
    - Noble, wise, protective expression

    Style: Pixar-inspired 3D cartoon, vibrant colors, dramatic lighting, dark gradient background (#0f172a to #1e293b), heroic guardian pose. No text.`,
    filename: "hero-guardian.png",
  },
  {
    name: "Postman Superhero",
    prompt: `Create a fun cartoon superhero character representing an AI Postman/Communication Agent.

    Character design:
    - Speedy robot/android superhero with a dynamic amber/orange flowing cape
    - Amber/orange color scheme (#f59e0b) with white accents
    - Carrying a glowing messenger bag, emails and letters flying around them
    - Dynamic action pose - running at super speed or flying fast
    - Email envelopes, notification bells, and message bubbles as speed trails
    - Wearing a sleek superhero suit with communication/mail motifs
    - Friendly, eager, speedy expression

    Style: Pixar-inspired 3D cartoon, vibrant colors, motion blur effects, dark gradient background (#0f172a to #1e293b), dynamic speed pose. No text.`,
    filename: "hero-postman.png",
  },
];

async function generateImage(config: ImageConfig): Promise<boolean> {
  console.log(`\n🦸 Generating: ${config.name}...`);

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
      const textPart = data.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.text
      );
      if (textPart?.text) {
        console.log(`   Response: ${textPart.text.substring(0, 200)}...`);
      }
      return false;
    }

    // Save image
    const outputDir = path.join(process.cwd(), "public", "images", "agents");
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
  console.log("🦸‍♂️ Generating Cartoon Superhero Agent Images");
  console.log("🎨 Using Gemini Nano Banana Pro");
  console.log("=".repeat(50));

  let successCount = 0;

  for (const config of heroAgents) {
    const success = await generateImage(config);
    if (success) successCount++;
    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✨ Complete! Generated ${successCount}/${heroAgents.length} superhero agents`);
  console.log(`📁 Images saved to: public/images/agents/`);
}

main().catch(console.error);
