/**
 * Copies latin-subset woff2 files used by CashoutFX into public/fonts/
 * and writes public/fonts/fonts.css.
 *
 * Run after: npm install --no-save @fontsource/inter @fontsource/cormorant-garamond
 */
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "fonts");

const interSrc = path.join(root, "node_modules", "@fontsource", "inter", "files");
const cormorantSrc = path.join(root, "node_modules", "@fontsource", "cormorant-garamond", "files");

/** @type {Array<{ src: string; dest: string; family: string; style: string; weight: number }>} */
const fonts = [
  { src: "inter-latin-400-normal.woff2", dest: "inter-latin-400.woff2", family: "Inter", style: "normal", weight: 400 },
  { src: "inter-latin-500-normal.woff2", dest: "inter-latin-500.woff2", family: "Inter", style: "normal", weight: 500 },
  { src: "inter-latin-600-normal.woff2", dest: "inter-latin-600.woff2", family: "Inter", style: "normal", weight: 600 },
  { src: "inter-latin-700-normal.woff2", dest: "inter-latin-700.woff2", family: "Inter", style: "normal", weight: 700 },
  {
    src: "cormorant-garamond-latin-400-normal.woff2",
    dest: "cormorant-garamond-latin-400.woff2",
    family: "Cormorant Garamond",
    style: "normal",
    weight: 400,
  },
  {
    src: "cormorant-garamond-latin-400-italic.woff2",
    dest: "cormorant-garamond-latin-400-italic.woff2",
    family: "Cormorant Garamond",
    style: "italic",
    weight: 400,
  },
  {
    src: "cormorant-garamond-latin-600-normal.woff2",
    dest: "cormorant-garamond-latin-600.woff2",
    family: "Cormorant Garamond",
    style: "normal",
    weight: 600,
  },
];

const latinRange =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

await mkdir(outDir, { recursive: true });

for (const font of fonts) {
  const from = path.join(font.family === "Inter" ? interSrc : cormorantSrc, font.src);
  const to = path.join(outDir, font.dest);
  await copyFile(from, to);
}

const css = `/* Self-hosted fonts for CashoutFX — latin subset only */

${fonts
  .map(
    (font) => `/* ${font.family} ${font.weight} ${font.style} */
@font-face {
  font-family: '${font.family}';
  font-style: ${font.style};
  font-weight: ${font.weight};
  font-display: swap;
  src: url('/fonts/${font.dest}') format('woff2');
  unicode-range: ${latinRange};
}`,
  )
  .join("\n\n")}
`;

await writeFile(path.join(outDir, "fonts.css"), css, "utf8");
console.log(`Wrote ${fonts.length} font files and fonts.css to public/fonts/`);
