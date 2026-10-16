#!/usr/bin/env node
/**
 * Regenerates the WebP profile photos served on the site.
 *
 * The photo renders at 112-140px, so we ship a 256px file for 1x
 * screens and a 512px file for 2x screens. The original 1179x1179 PNG
 * is not committed (it was ~950 KB); pass any source image explicitly.
 *
 * Usage (from the tools/ directory):
 *   npm install                                   # once
 *   npm run resize-photo -- ../path/to/src.png
 *
 * Outputs:
 *   ../assets/images/personal-photo-256.webp  (1x, 256x256)
 *   ../assets/images/personal-photo-512.webp  (2x, 512x512)
 */
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const src = process.argv[2];
if (!src) {
  console.error("usage: node resize-photo.mjs <source-image>");
  process.exit(1);
}
const outDir = join(root, "assets/images");

await mkdir(outDir, { recursive: true });
console.log(`source: ${src}`);

for (const size of [256, 512]) {
  const out = join(outDir, `personal-photo-${size}.webp`);
  const info = await sharp(src)
    .resize(size, size, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(out);
  console.log(`${out}  ${info.width}x${info.height}  ${info.size} bytes`);
}
