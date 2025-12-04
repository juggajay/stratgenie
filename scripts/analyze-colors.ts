import sharp from "sharp";
import * as path from "path";

async function analyzeColors(inputPath: string) {
  console.log(`Analyzing: ${inputPath}`);

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log(`Image: ${info.width}x${info.height}, channels: ${info.channels}`);

  // Sample corners and edges (likely background areas)
  const samples: { x: number; y: number; r: number; g: number; b: number; a: number }[] = [];

  // Top-left corner area
  for (let y = 0; y < 50; y += 10) {
    for (let x = 0; x < 50; x += 10) {
      const i = (y * info.width + x) * 4;
      samples.push({ x, y, r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] });
    }
  }

  // Top-right corner area
  for (let y = 0; y < 50; y += 10) {
    for (let x = info.width - 50; x < info.width; x += 10) {
      const i = (y * info.width + x) * 4;
      samples.push({ x, y, r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] });
    }
  }

  // Bottom-right corner area
  for (let y = info.height - 50; y < info.height; y += 10) {
    for (let x = info.width - 50; x < info.width; x += 10) {
      const i = (y * info.width + x) * 4;
      samples.push({ x, y, r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] });
    }
  }

  // Center-right (likely background)
  for (let y = info.height / 2 - 25; y < info.height / 2 + 25; y += 10) {
    for (let x = info.width - 100; x < info.width - 50; x += 10) {
      const i = (Math.floor(y) * info.width + Math.floor(x)) * 4;
      samples.push({ x: Math.floor(x), y: Math.floor(y), r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] });
    }
  }

  console.log("\nBackground color samples:");
  const colorCounts: Record<string, number> = {};
  samples.forEach(s => {
    const key = `rgb(${s.r},${s.g},${s.b}) a=${s.a}`;
    colorCounts[key] = (colorCounts[key] || 0) + 1;
  });

  // Sort by count
  const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
  console.log("\nMost common background colors:");
  sorted.slice(0, 10).forEach(([color, count]) => {
    console.log(`  ${color}: ${count} samples`);
  });

  // Also show unique samples
  console.log("\nSample locations:");
  samples.slice(0, 20).forEach(s => {
    console.log(`  (${s.x}, ${s.y}): rgb(${s.r},${s.g},${s.b}) alpha=${s.a}`);
  });
}

const logoDir = path.join(process.cwd(), "public", "images", "logo");
analyzeColors(path.join(logoDir, "logo-seablue-final.png"));
