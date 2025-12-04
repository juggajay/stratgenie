/**
 * Generate StrataGenie Logo WITH TEXT using Gemini Nano Banana Pro
 * Run: npx tsx scripts/generate-logo-with-text.ts
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
    name: "StrataGenie Logo with Text - Horizontal",
    prompt: `Create a complete logo for "StrataGenie" with the text included.

Design:
- Left side: A friendly cartoon blue genie character emerging from a magic lamp
- The lamp has building/apartment windows on it (strata building reference)
- The genie is granting a wish with magical sparkles and gold stars floating around
- Right side: The text "StrataGenie" in a modern, clean sans-serif font
- The text should be white/light colored to stand out
- "Strata" in white, "Genie" could have a subtle blue or purple gradient
- Color scheme: Blue genie (#3b82f6), purple magic smoke (#8b5cf6), gold sparkles (#f59e0b)
- Dark navy background (#0f172a)
- Horizontal layout - icon on left, text on right

Style: Modern tech company logo, Pixar-inspired cartoon genie, clean professional typography. Wide/horizontal format (roughly 3:1 ratio). Include the text "StrataGenie" clearly readable.`,
    filename: "logo-text-horizontal.png",
  },
  {
    name: "StrataGenie Logo with Text - Stacked",
    prompt: `Create a complete stacked logo for "StrataGenie" with text below the icon.

Design:
- Top: A friendly cartoon blue genie emerging from a magical lamp with building windows
- The genie has a happy expression, granting wishes with sparkles and stars
- Purple magical smoke/energy flowing around
- Bottom: The text "StrataGenie" centered below the genie
- Clean, modern sans-serif font for the text
- Text in white with subtle blue glow effect
- Gold sparkles scattered around both icon and text
- Dark navy background (#0f172a)
- Color scheme: Blue (#3b82f6), purple (#8b5cf6), gold (#f59e0b), white text

Style: Modern app logo, cartoon genie mascot with professional text. Square format. The word "StrataGenie" must be clearly visible and readable below the character.`,
    filename: "logo-text-stacked.png",
  },
  {
    name: "StrataGenie Logo with Text - Integrated",
    prompt: `Create an integrated logo where the genie and "StrataGenie" text work together.

Design:
- A blue cartoon genie character emerging from a lamp, positioned creatively with the text
- The genie could be holding or presenting the text "StrataGenie"
- Or the magical smoke/sparkles could form part of the letters
- The lamp has apartment building windows (strata reference)
- Text "StrataGenie" in modern, bold, clean font
- White text with possible blue/purple gradient on "Genie" part
- Magical sparkles and stars around the composition
- Dark background (#0f172a) to make everything pop
- Colors: Blue genie, purple magic, gold sparkles, white text

Style: Creative integrated logo design, playful but professional. The genie and text should feel like one cohesive design. Wide format. Text must be clearly readable.`,
    filename: "logo-text-integrated.png",
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
  console.log("🧞‍♂️ Generating StrataGenie Logos WITH TEXT");
  console.log("🎨 Using Gemini Nano Banana Pro");
  console.log("=".repeat(50));

  let successCount = 0;

  for (const config of logos) {
    const success = await generateImage(config);
    if (success) successCount++;
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✨ Complete! Generated ${successCount}/${logos.length} logos with text`);
  console.log(`📁 Images saved to: public/images/logo/`);
}

main().catch(console.error);
