/**
 * Generate celebratory users image
 * Run: npx tsx scripts/generate-celebration.ts
 */

import * as fs from "fs";
import * as path from "path";

const GEMINI_MODEL = "gemini-2.0-flash-exp-image-generation";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const API_KEY = "AIzaSyBbqRTDzD2M1GFFgv6y0VQqMdtu3SMRMdk";

async function generateImage(): Promise<boolean> {
  console.log("\n🎉 Generating celebration image...");

  const prompt = `Cartoon illustration of two happy people celebrating - one male and one female professional.

Style: Modern flat illustration, friendly cartoon style, vibrant colors.

The two people are:
- Standing side by side, arms raised in celebration/victory pose
- Big genuine smiles, expressing relief and happiness
- One hand pointing or gesturing downward (as if showing off something below them)
- Professional but casual attire (business casual)
- Male: friendly face, neat appearance
- Female: friendly face, neat appearance

Background: Transparent or simple gradient that fades out.

They look like happy strata committee members who just had their workload reduced. Celebratory confetti or sparkles around them.

Clean modern illustration style, not photorealistic.`;

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
      console.error(`❌ API Error: ${response.status}`);
      return false;
    }

    const data = await response.json();
    const imagePart = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);

    if (!imagePart?.inlineData) {
      console.error(`❌ No image generated`);
      return false;
    }

    const outputDir = path.join(process.cwd(), "public", "images");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, "celebration-users.png");
    fs.writeFileSync(outputPath, Buffer.from(imagePart.inlineData.data, "base64"));
    console.log(`✅ Saved: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    return false;
  }
}

generateImage();
