/**
 * Generate StrataGenie Logo using Gemini Nano Banana Pro
 * Run: npx tsx scripts/generate-logo.ts
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

const logos: ImageConfig[] = [
  {
    name: "StrataGenie Logo - Main",
    prompt: `Create a modern logo for "StrataGenie" - an AI-powered strata management software.

Design concept:
- A friendly, cartoon-style genie character emerging from a magic lamp/bottle
- The genie should look modern and tech-savvy, not traditional - think AI/robot genie hybrid
- The genie is granting a wish, with magical sparkles and stars floating around
- The lamp/bottle could be stylized to look like a building or have building elements
- Color scheme: Primary blue (#3b82f6), with purple (#8b5cf6) magical effects and gold/amber (#f59e0b) sparkles
- The genie should have a friendly, helpful expression
- Include subtle strata/building elements (apartment building silhouette, rooftop)
- Modern, clean, professional but playful style
- Dark background (#0f172a) to make colors pop

Style: Pixar-inspired 3D cartoon logo, vibrant colors, magical glow effects, professional yet approachable. Square format suitable for app icon. NO TEXT in the image.`,
    filename: "logo-genie-main.png",
  },
  {
    name: "StrataGenie Logo - Lamp Focus",
    prompt: `Create a sleek logo icon for "StrataGenie" software.

Design concept:
- A magical lamp/bottle hybrid that looks like a modern apartment building
- Blue smoke/magic swirling out of the top forming a subtle genie shape
- The lamp has windows like an apartment building
- Magical sparkles, stars and compliance checkmarks floating in the smoke
- Color scheme: Blue (#3b82f6) lamp/building, purple (#8b5cf6) magical smoke, gold (#f59e0b) sparkles
- Glowing effects around the lamp
- Dark gradient background (#0f172a to #1e293b)

Style: Modern minimalist logo with magical elements, suitable for app icon. Clean lines, vibrant colors, subtle glow effects. Square format. NO TEXT.`,
    filename: "logo-genie-lamp.png",
  },
  {
    name: "StrataGenie Logo - Mascot",
    prompt: `Create a cartoon mascot logo for "StrataGenie" - an AI assistant for strata management.

Design concept:
- A cute, friendly robot-genie hybrid character
- Floating/hovering pose with magical energy around it
- Has a genie-style flowing lower body made of blue/purple magical energy
- Upper body is a friendly robot with glowing blue eyes
- Wearing a small construction hard hat or holding building blueprints
- Magical sparkles and stars surrounding the character
- One hand raised as if granting a wish or presenting something
- Color scheme: Blue (#3b82f6) body, purple (#8b5cf6) magical effects, teal accents, gold sparkles
- Dark background to make character pop

Style: Pixar/Disney-inspired 3D cartoon character, expressive and friendly, professional mascot suitable for tech company. Square format. NO TEXT.`,
    filename: "logo-genie-mascot.png",
  },
  {
    name: "StrataGenie Logo - Badge",
    prompt: `Create a professional badge-style logo for "StrataGenie".

Design concept:
- Circular or shield-shaped badge design
- Center: A stylized genie emerging from a lamp, simplified and iconic
- The genie is made of flowing lines suggesting magic and AI
- Behind the genie: silhouette of an apartment building
- Magical stars and sparkles around the edges
- Gradient from blue (#3b82f6) to purple (#8b5cf6)
- Gold (#f59e0b) accent details and sparkles
- Clean, vector-style design suitable for multiple sizes
- Dark navy background (#0f172a)

Style: Modern tech company badge logo, clean and professional, slight magical whimsy. Would work as favicon, app icon, or watermark. Square format. NO TEXT.`,
    filename: "logo-genie-badge.png",
  },
];

async function generateImage(config: ImageConfig): Promise<boolean> {
  console.log(`\n🧞 Generating: ${config.name}...`);

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

    const outputDir = path.join(process.cwd(), "public", "images", "logo");
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
  console.log("🧞‍♂️ Generating StrataGenie Logo Concepts");
  console.log("🎨 Using Gemini Nano Banana Pro");
  console.log("=".repeat(50));

  let successCount = 0;

  for (const config of logos) {
    const success = await generateImage(config);
    if (success) successCount++;
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✨ Complete! Generated ${successCount}/${logos.length} logo concepts`);
  console.log(`📁 Images saved to: public/images/logo/`);
}

main().catch(console.error);
