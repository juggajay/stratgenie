/**
 * Generate StrataGenie Logo - Exact Match
 * Run: npx tsx scripts/generate-logo-exact.ts
 */

import * as fs from "fs";
import * as path from "path";

const GEMINI_MODEL = "gemini-2.0-flash-exp-image-generation";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBbqRTDzD2M1GFFgv6y0VQqMdtu3SMRMdk";

const prompt = `Create a company logo. PNG format with TRANSPARENT background.

MASCOT - LEFT SIDE:
- Cute cartoon genie character
- Body color: Light cyan/turquoise (#4ECDC4)
- Chubby rounded body with arms crossed confidently over chest
- Friendly face with confident smirk, eyes looking slightly up and to the right
- Round head with small dark navy blue topknot/hair tuft on top
- Small pointed elf-like ears
- Body tapers downward into a purple/violet smoke wisp trail
- The smoke trail emerges from a golden brass Aladdin-style magic lamp positioned below
- 2-3 small yellow star sparkles floating near the genie

COMPANY NAME - RIGHT SIDE:
- Text: "StrataGenie" as ONE WORD on a SINGLE HORIZONTAL LINE (not stacked)
- "Strata" portion: SOLID FILLED PURE WHITE (#FFFFFF) - NOT grey, NOT outlined, SOLID WHITE
- "Genie" portion: SOLID FILLED CYAN (#22D3EE) matching genie body color
- Font: Bold rounded sans-serif like Nunito Bold or Quicksand Bold
- Vertically centered with the genie character

LAYOUT:
- Mascot (genie + lamp) on left: ~30-35% of total width
- Text on right: ~65-70% of total width
- Wide horizontal aspect ratio (approximately 3:1)

BACKGROUND: Completely TRANSPARENT. No solid color. PNG with alpha transparency.
This logo will be placed on dark navy backgrounds, so "Strata" MUST be bright solid white to be visible.

Style: Clean, professional cartoon mascot logo for a tech company website header.`;

async function generateLogo(): Promise<void> {
  console.log("🧞 Generating exact match logo...\n");
  console.log("Prompt:", prompt);
  console.log("\n" + "=".repeat(60) + "\n");

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status}`, errorText);
      return;
    }

    const data = await response.json();
    const imagePart = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);

    if (!imagePart?.inlineData) {
      console.error("❌ No image generated");
      console.log("Response:", JSON.stringify(data, null, 2));
      return;
    }

    const outputDir = path.join(process.cwd(), "public", "images", "logo");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    // Save with timestamp to compare iterations
    const timestamp = Date.now();
    const outputPath = path.join(outputDir, `logo-iteration-${timestamp}.png`);
    const finalPath = path.join(outputDir, "logo-seablue-final.png");

    fs.writeFileSync(outputPath, Buffer.from(imagePart.inlineData.data, "base64"));
    fs.copyFileSync(outputPath, finalPath);

    console.log(`✅ Saved iteration: ${outputPath}`);
    console.log(`✅ Updated final: ${finalPath}`);
    console.log("\n🔍 View at: http://localhost:3000");
    console.log("   Or open the file directly to compare");
  } catch (error) {
    console.error(`❌ Error:`, error);
  }
}

generateLogo();
