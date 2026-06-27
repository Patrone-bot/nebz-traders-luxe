import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "src/assets/story/hero.jpg");
const output = path.join(root, "src/assets/story/hero.webp");

const meta = await sharp(input).metadata();
const width = 800;
const height = Math.round((meta.height / meta.width) * width);

await sharp(input)
  .resize(width, height, { fit: "inside", withoutEnlargement: true })
  .webp({ quality: 81 })
  .toFile(output);

const result = await sharp(output).metadata();
const outStat = await import("node:fs").then((fs) => fs.statSync(output));
const inStat = await import("node:fs").then((fs) => fs.statSync(input));

console.log(
  JSON.stringify({
    width: result.width,
    height: result.height,
    inputBytes: inStat.size,
    outputBytes: outStat.size,
  }),
);
