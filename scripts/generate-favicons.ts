import sharp from "sharp";
import path from "path";
import fs from "fs";

const SOURCE_LOGO = path.join(process.cwd(), "public/images/logo/logo-final-square.png");
const PUBLIC_DIR = path.join(process.cwd(), "public");

async function generateFavicons() {
  console.log("Generating favicons from:", SOURCE_LOGO);

  // Check source exists
  if (!fs.existsSync(SOURCE_LOGO)) {
    console.error("Source logo not found:", SOURCE_LOGO);
    process.exit(1);
  }

  // Generate apple-touch-icon.png (180x180)
  await sharp(SOURCE_LOGO)
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"));
  console.log("Created: apple-touch-icon.png (180x180)");

  // Generate favicon-32x32.png
  await sharp(SOURCE_LOGO)
    .resize(32, 32)
    .png()
    .toFile(path.join(PUBLIC_DIR, "favicon-32x32.png"));
  console.log("Created: favicon-32x32.png");

  // Generate favicon-16x16.png
  await sharp(SOURCE_LOGO)
    .resize(16, 16)
    .png()
    .toFile(path.join(PUBLIC_DIR, "favicon-16x16.png"));
  console.log("Created: favicon-16x16.png");

  // Generate favicon.ico (using 32x32 PNG as base, then convert)
  // Note: Sharp doesn't support ICO directly, so we'll use the PNG
  // For proper ICO, we'll copy the 32x32 as favicon.ico (browsers accept PNG)
  await sharp(SOURCE_LOGO)
    .resize(32, 32)
    .png()
    .toFile(path.join(PUBLIC_DIR, "favicon.ico"));
  console.log("Created: favicon.ico (32x32 PNG)");

  // Generate larger icon for PWA/Android
  await sharp(SOURCE_LOGO)
    .resize(192, 192)
    .png()
    .toFile(path.join(PUBLIC_DIR, "icon-192.png"));
  console.log("Created: icon-192.png");

  await sharp(SOURCE_LOGO)
    .resize(512, 512)
    .png()
    .toFile(path.join(PUBLIC_DIR, "icon-512.png"));
  console.log("Created: icon-512.png");

  console.log("\nAll favicons generated successfully!");
}

generateFavicons().catch(console.error);
