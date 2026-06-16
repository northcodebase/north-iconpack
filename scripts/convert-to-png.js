#!/usr/bin/env node
/**
 * scripts/convert-to-png.js
 * Converts every SVG in icons/**\/*.svg → assets/icons/**\/*.png
 * maintaining the same category subfolder structure.
 *
 * Usage (from repo root):
 *   node scripts/convert-to-png.js              — default 128×128
 *   node scripts/convert-to-png.js --size 256   — custom size
 *
 * Requires:  npm install sharp
 */

"use strict";

const fs   = require("fs");
const path = require("path");
const sharp = require("sharp");

// ── Config ────────────────────────────────────────────────────────────────────
const ROOT      = path.join(__dirname, "..");
const ICONS_DIR = path.join(ROOT, "icons");
const OUT_DIR   = path.join(ROOT, "assets", "icons");

// Parse --size flag
const sizeArg = process.argv.indexOf("--size");
const SIZE    = sizeArg !== -1 ? parseInt(process.argv[sizeArg + 1], 10) : 128;

if (isNaN(SIZE) || SIZE < 16) {
  console.error("Invalid --size value. Must be a number >= 16.");
  process.exit(1);
}

// ── Collect all SVG files ─────────────────────────────────────────────────────
const categories = fs
  .readdirSync(ICONS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const jobs = [];
for (const cat of categories) {
  const srcDir = path.join(ICONS_DIR, cat);
  const dstDir = path.join(OUT_DIR, cat);
  fs.mkdirSync(dstDir, { recursive: true });

  const svgFiles = fs
    .readdirSync(srcDir)
    .filter((f) => f.toLowerCase().endsWith(".svg"))
    .sort();

  for (const file of svgFiles) {
    const name    = path.parse(file).name;
    const srcFile = path.join(srcDir, file);
    const dstFile = path.join(dstDir, `${name}.png`);
    jobs.push({ cat, name, srcFile, dstFile });
  }
}

// ── Convert ───────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\nNorthline Icons — SVG → PNG Conversion`);
  console.log(`  Output size : ${SIZE}×${SIZE}px`);
  console.log(`  Source      : icons/`);
  console.log(`  Destination : assets/icons/`);
  console.log(`  Total icons : ${jobs.length}\n`);

  let success = 0;
  let failed  = 0;

  for (const job of jobs) {
    try {
      const svgBuffer = fs.readFileSync(job.srcFile);

      await sharp(svgBuffer, { density: Math.ceil((SIZE / 24) * 96) })
        .resize(SIZE, SIZE, {
          fit:        "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 }, // transparent background
        })
        .png({ compressionLevel: 9, palette: false })
        .toFile(job.dstFile);

      process.stdout.write(`  ✓  ${job.cat}/${job.name}.png\n`);
      success++;
    } catch (err) {
      process.stderr.write(`  ✗  ${job.cat}/${job.name}  — ${err.message}\n`);
      failed++;
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`  Converted : ${success}`);
  if (failed > 0) console.log(`  Failed    : ${failed}`);
  console.log(`  Saved to  : assets/icons/`);
  console.log();
})();
