/**
 * Generate StrataGenie Logo with Transparent Background
 * Run: npx tsx scripts/generate-logo-transparent.ts
 */

import * as fs from "fs";
import * as path from "path";

const GEMINI_MODEL = "gemini-2.0-flash-exp-image-generation";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const API_KEY = "AIzaSyBbqRTDzD2M1GFFgv6y0VQqMdtu3SMRMdk";

const logos = [
  {
    name: "StrataGenie Logo - Transparent Wide",
    prompt: `Create a logo for "StrataGenie" on a PURE WHITE background (for easy background removal).

Design:
- A friendly blue cartoon genie character with confident pose, arms crossed or one hand gesturing
- Genie emerging from a golden magic lamp
- Purple magical smoke/energy swirling around
- Gold sparkles and stars floating nearby
- Next to the genie: the text "StrataGenie" in bold modern font
- "Strata" in dark blue/navy, "Genie" in purple gradient
- The genie should look tech-savvy and friendly, like an AI assistant

IMPORTANT:
- Use a SOLID PURE WHITE (#FFFFFF) background - no gradients, no dark colors
- Keep all elements crisp with clean edges against the white
- Horizontal/wide format
- Colors: Blue genie (#3b82f6), purple smoke (#8b5cf6), gold lamp/sparkles (#f59e0b)
- Text must be clearly readable

Style: Modern tech company logo, Pixar-style cartoon character, professional typography. Wide format (3:1 ratio).`,
    filename: "logo-transparent-wide.png",
  },
  {
    name: "StrataGenie Logo - Transparent Square",
    prompt: `Create a square logo for "StrataGenie" on a PURE WHITE background.

Design:
- Top: Friendly blue cartoon genie emerging from golden lamp with purple magic smoke
- The genie has a happy, helpful expression and is gesturing like granting a wish
- Gold sparkles and stars around
- Bottom: Text "StrataGenie" centered below
- Modern bold sans-serif font
- "Strata" in dark navy, "Genie" in purple

IMPORTANT:
- SOLID PURE WHITE (#FFFFFF) background only - no dark colors
- Clean crisp edges on all elements
- Square format
- Colors: Blue (#3b82f6), purple (#8b5cf6), gold (#f59e0b), navy text

Style: App icon style, cartoon mascot with text below, clean professional look.`,
    filename: "logo-transparent-square.png",
  },
];

async function generateImage(config: any): Promise<boolean> {
  console.log(`\n🧞 Generating: ${config.name}...`);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: config.prompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      }),
    });

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status}`);
      return false;
    }

    const data = await response.json();
    const imagePart = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);

    if (!imagePart?.inlineData) {
      console.error(`❌ No image generated`);
      return false;
    }

    const outputDir = path.join(process.cwd(), "public", "images", "logo");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, config.filename);
    fs.writeFileSync(outputPath, Buffer.from(imagePart.inlineData.data, "base64"));
    console.log(`✅ Saved: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    return false;
  }
}

async function main() {
  console.log("🧞 Generating Logos with White Background (for transparency)");
  console.log("=".repeat(50));

  for (const logo of logos) {
    await generateImage(logo);
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log("\n✨ Done! Images saved to public/images/logo/");
}

main();
