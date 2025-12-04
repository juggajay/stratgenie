/**
 * Generate StrataGenie Logo with Sea Blue theme - clearer text
 * Run: npx tsx scripts/generate-logo-seablue.ts
 */

import * as fs from "fs";
import * as path from "path";

const GEMINI_MODEL = "gemini-2.0-flash-exp-image-generation";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const API_KEY = "AIzaSyBbqRTDzD2M1GFFgv6y0VQqMdtu3SMRMdk";

const logos = [
  {
    name: "StrataGenie Logo - Sea Blue Clear",
    prompt: `Company logo with transparent background.

Cute cartoon genie mascot on the left - cyan blue chunky round body, arms crossed, big white smile, emerging from golden magic lamp, purple smoke trail, gold sparkles around.

Text "StrataGenie" on the right - the word "Strata" must be PURE WHITE color for contrast, the word "Genie" in bright cyan/turquoise. Bold modern sans-serif font.

IMPORTANT: Transparent/clear background, no solid color background. PNG with transparency.`,
    filename: "logo-seablue-wide.png",
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
  console.log("🧞 Generating Sea Blue Logo with Clear Text");
  console.log("=".repeat(50));

  for (const logo of logos) {
    await generateImage(logo);
  }

  console.log("\n✨ Done!");
}

main();
