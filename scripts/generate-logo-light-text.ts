/**
 * Generate StrataGenie Logo with LIGHT text for dark backgrounds
 * Run: npx tsx scripts/generate-logo-light-text.ts
 */

import * as fs from "fs";
import * as path from "path";

const GEMINI_MODEL = "gemini-2.0-flash-exp-image-generation";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const API_KEY = "AIzaSyBbqRTDzD2M1GFFgv6y0VQqMdtu3SMRMdk";

const logos = [
  {
    name: "StrataGenie Logo - Light Text Wide",
    prompt: `Create a horizontal logo for "StrataGenie" with WHITE/LIGHT colored text on a pure white background.

Design:
- Left: Friendly blue cartoon genie with arms crossed, emerging from golden magic lamp
- Purple magical smoke swirling, gold sparkles and stars
- Right: The text "StrataGenie" in BRIGHT WHITE color with subtle glow/outline
- Make "Strata" PURE WHITE and "Genie" in LIGHT PURPLE/LAVENDER (#c4b5fd or #a78bfa)
- The text needs a subtle dark outline or shadow so it's visible on the white background but will POP on dark backgrounds
- Add a subtle glow effect around the white text

CRITICAL:
- Text must be WHITE/VERY LIGHT colored (not dark navy!)
- Pure white (#FFFFFF) background for easy removal
- Wide horizontal format
- Text should have slight shadow/outline for visibility

Style: Modern tech logo, cartoon genie, light-colored professional typography.`,
    filename: "logo-light-text-wide.png",
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
  console.log("🧞 Generating Logo with LIGHT text");
  console.log("=".repeat(50));

  for (const logo of logos) {
    await generateImage(logo);
  }

  console.log("\n✨ Done!");
}

main();
