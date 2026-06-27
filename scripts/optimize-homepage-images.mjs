/**
 * Converts homepage story photos + brand logo to resized WebP (q81).
 * Skips hero.webp (optimized separately via optimize-hero.mjs).
 *
 * Usage: node scripts/optimize-homepage-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const storyDir = path.join(root, "src/assets/story");
const brandingDir = path.join(root, "public/branding");
const manifestPath = path.join(storyDir, "homepage-image-meta.json");

const QUALITY = 81;

/** maxWidth tuned for ~640px layout slots (2× retina headroom without 1400px sources). */
const STORY_ASSETS = [
  { input: "nebz-before.png", output: "founders-before.webp", maxWidth: 800 },
  { input: "nebz-after2.jpg", output: "founders-after.webp", maxWidth: 800 },
  { input: "nyathira-before.png", output: "nyathira-before.webp", maxWidth: 800 },
  { input: "nyathira-after2.jpg", output: "nyathira-after.webp", maxWidth: 800 },
  { input: "part-one.jpg", output: "story-stage-01.webp", maxWidth: 800 },
  { input: "story2.jpg", output: "story-stage-02.webp", maxWidth: 800 },
  { input: "story4.jpg", output: "story-stage-03.webp", maxWidth: 800 },
  { input: "last-image.jpg", output: "mission.webp", maxWidth: 800 },
  { input: "journey-04.jpg", output: "story-stage-04.webp", maxWidth: 800 },
  { input: "journey-05.jpg", output: "story-stage-05.webp", maxWidth: 800 },
  { input: "journey-06.jpg", output: "story-stage-06.webp", maxWidth: 800 },
];

const LOGO = {
  input: path.join(brandingDir, "logo.png"),
  output: path.join(brandingDir, "logo.webp"),
  maxWidth: 256,
};

async function optimizeFile({ inputPath, outputPath, maxWidth }) {
  const inputStat = fs.statSync(inputPath);
  const meta = await sharp(inputPath).metadata();
  const width = Math.min(maxWidth, meta.width);
  const height = Math.round((meta.height / meta.width) * width);

  await sharp(inputPath)
    .rotate()
    .resize(width, height, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outputPath);

  const outMeta = await sharp(outputPath).metadata();
  const outputStat = fs.statSync(outputPath);

  return {
    input: path.basename(inputPath),
    output: path.basename(outputPath),
    width: outMeta.width,
    height: outMeta.height,
    inputBytes: inputStat.size,
    outputBytes: outputStat.size,
  };
}

const results = [];

for (const asset of STORY_ASSETS) {
  const inputPath = path.join(storyDir, asset.input);
  const outputPath = path.join(storyDir, asset.output);
  if (!fs.existsSync(inputPath)) {
    console.warn(`Skip missing: ${asset.input}`);
    continue;
  }
  results.push(
    await optimizeFile({
      inputPath,
      outputPath,
      maxWidth: asset.maxWidth,
    }),
  );
}

if (fs.existsSync(LOGO.input)) {
  results.push(
    await optimizeFile({
      inputPath: LOGO.input,
      outputPath: LOGO.output,
      maxWidth: LOGO.maxWidth,
    }),
  );
}

const dimensions = Object.fromEntries(
  results
    .filter((r) => r.output.endsWith(".webp") && r.output !== "logo.webp")
    .map((r) => [r.output.replace(".webp", ""), { width: r.width, height: r.height }]),
);

fs.writeFileSync(manifestPath, `${JSON.stringify({ quality: QUALITY, dimensions, assets: results }, null, 2)}\n`);

const totalIn = results.reduce((s, r) => s + r.inputBytes, 0);
const totalOut = results.reduce((s, r) => s + r.outputBytes, 0);

console.log(JSON.stringify({ totalInputBytes: totalIn, totalOutputBytes: totalOut, results }, null, 2));
