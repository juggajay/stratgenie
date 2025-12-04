import sharp from "sharp";
import * as path from "path";

async function removeWhiteBackground(inputPath: string, outputPath: string) {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const pixels = new Uint8Array(info.width * info.height * 4);

  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const isWhite = r > 245 && g > 245 && b > 245;
    pixels[i * 4] = r;
    pixels[i * 4 + 1] = g;
    pixels[i * 4 + 2] = b;
    pixels[i * 4 + 3] = isWhite ? 0 : 255;
  }

  await sharp(Buffer.from(pixels), { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(outputPath);
  console.log(`✅ Saved: ${outputPath}`);
}

const logoDir = path.join(process.cwd(), "public", "images", "logo");
removeWhiteBackground(
  path.join(logoDir, "logo-light-text-wide.png"),
  path.join(logoDir, "logo-dark-mode.png")
);
