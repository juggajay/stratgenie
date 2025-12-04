/**
 * Remove white background from logo images
 * Run: npx tsx scripts/remove-background.ts
 */

import sharp from "sharp";
import * as path from "path";

async function removeWhiteBackground(inputPath: string, outputPath: string) {
  console.log(`Processing: ${path.basename(inputPath)}`);

  try {
    const image = sharp(inputPath);
    const { width, height } = await image.metadata();

    // Get raw pixel data
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Create new buffer with alpha channel
    const pixels = new Uint8Array(info.width * info.height * 4);

    for (let i = 0; i < info.width * info.height; i++) {
      const r = data[i * 3];
      const g = data[i * 3 + 1];
      const b = data[i * 3 + 2];

      // Check if pixel is white or near-white (threshold)
      const isWhite = r > 240 && g > 240 && b > 240;

      pixels[i * 4] = r;
      pixels[i * 4 + 1] = g;
      pixels[i * 4 + 2] = b;
      pixels[i * 4 + 3] = isWhite ? 0 : 255; // Transparent if white
    }

    await sharp(Buffer.from(pixels), {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png()
      .toFile(outputPath);

    console.log(`✅ Saved: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
}

async function main() {
  const logoDir = path.join(process.cwd(), "public", "images", "logo");

  await removeWhiteBackground(
    path.join(logoDir, "logo-transparent-wide.png"),
    path.join(logoDir, "logo-final-wide.png")
  );

  await removeWhiteBackground(
    path.join(logoDir, "logo-transparent-square.png"),
    path.join(logoDir, "logo-final-square.png")
  );

  console.log("\n✨ Done! Transparent logos saved.");
}

main();
