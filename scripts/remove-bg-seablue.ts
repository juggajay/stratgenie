import sharp from "sharp";
import * as path from "path";

async function removeDarkBackground(inputPath: string, outputPath: string) {
  // Force to RGB (3 channels) to ensure consistent reading
  const { data, info } = await sharp(inputPath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(info.width * info.height * 4);

  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    // Dark navy background removal (#0f172a = RGB 15,23,42)
    // Only remove very dark navy pixels (all channels low, blue slightly higher)
    // Preserve gray (#9ca3af = 156,163,175), cyan, and all other colors
    // Remove black/very dark pixels
    const isBlack = r < 30 && g < 30 && b < 30;
    pixels[i * 4] = r;
    pixels[i * 4 + 1] = g;
    pixels[i * 4 + 2] = b;
    pixels[i * 4 + 3] = isBlack ? 0 : 255;
  }

  await sharp(Buffer.from(pixels), { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(outputPath);
  console.log(`✅ Saved: ${outputPath}`);
}

const logoDir = path.join(process.cwd(), "public", "images", "logo");
removeDarkBackground(
  path.join(logoDir, "logo-seablue-wide.png"),
  path.join(logoDir, "logo-seablue-final.png")
);
