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
    prompt: `Create a horizontal logo for "StrataGenie" with PURE WHITE background.

LAYOUT:
- Left: LARGE friendly cartoon genie character (about 40% of logo width)
- Right: Medium-sized TEXT "StrataGenie" (about 60% of logo width)

Genie character (BIG - the star of the logo):
- Friendly smiling cyan/sea blue cartoon genie emerging from golden magic lamp
- The genie should be LARGE and prominent - the main visual element
- Cyan color (#06b6d4)
- Purple/cyan magical smoke swirling around
- Gold sparkles and stars

TEXT (medium size, not huge):
- "StrataGenie" in medium-sized, bold font
- "Strata" in VERY LIGHT GRAY (#e5e7eb) - almost white
- "Genie" in CYAN (#06b6d4)
- Use bold sans-serif font
- Text should be smaller than the genie height

REQUIREMENTS:
- PURE WHITE (#FFFFFF) background
- BIG genie mascot on left - this is the main focus
- Smaller text on right
- 4:1 wide horizontal format
- Professional tech company look

The genie should be the dominant visual element.`,
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
