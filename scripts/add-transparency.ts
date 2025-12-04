import sharp from "sharp";
import * as path from "path";

async function addTransparency(inputPath: string, outputPath: string) {
  console.log(`Processing: ${inputPath}`);

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log(`Image: ${info.width}x${info.height}, channels: ${info.channels}`);

  const pixels = new Uint8Array(info.width * info.height * 4);

  let transparentCount = 0;
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const a = data[i * 4 + 3];

    // Check for the medium grey background (~rgb(100,100,100))
    // This is the flattened checkerboard pattern
    const isMediumGrey = r >= 90 && r <= 110 && g >= 90 && g <= 110 && b >= 90 && b <= 110;
    // Also check if all channels are very similar (grey tone)
    const isGreyTone = Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10;
    const isBackground = isMediumGrey && isGreyTone;

    // Also check if already transparent
    const isTransparent = a < 10;

    pixels[i * 4] = r;
    pixels[i * 4 + 1] = g;
    pixels[i * 4 + 2] = b;

    if (isBackground || isTransparent) {
      pixels[i * 4 + 3] = 0; // Make transparent
      transparentCount++;
    } else {
      pixels[i * 4 + 3] = 255; // Keep opaque
    }
  }

  console.log(`Made ${transparentCount} pixels transparent (${(transparentCount / (info.width * info.height) * 100).toFixed(1)}%)`);

  await sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
    .png()
    .toFile(outputPath);

  // Verify output
  const outputInfo = await sharp(outputPath).metadata();
  console.log(`✅ Saved: ${outputPath}`);
  console.log(`   Output: ${outputInfo.width}x${outputInfo.height}, channels: ${outputInfo.channels}, hasAlpha: ${outputInfo.hasAlpha}`);
}

const logoDir = path.join(process.cwd(), "public", "images", "logo");
const inputFile = path.join(logoDir, "logo-seablue-final.png");
const outputFile = path.join(logoDir, "logo-seablue-transparent.png");

addTransparency(inputFile, outputFile);
