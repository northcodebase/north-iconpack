#!/usr/bin/env node
/**
 * docs/generate-preview.js
 * Generates assets/preview.png — a grid of all icons for use in the README.
 *
 * Requires puppeteer:
 *   npm install --save-dev puppeteer
 *
 * Usage (from repo root):
 *   node docs/generate-preview.js
 *
 * Output:
 *   assets/preview.png  (1280 × auto, white background, 8-per-row grid)
 */

"use strict";

const fs   = require("fs");
const path = require("path");

const ROOT      = path.join(__dirname, "..");
const ICONS_DIR = path.join(ROOT, "icons");
const OUT_DIR   = path.join(ROOT, "assets");
const OUT_FILE  = path.join(OUT_DIR, "preview.png");

// ── Check puppeteer ──────────────────────────────────────────────────────────
let puppeteer;
try {
  puppeteer = require("puppeteer");
} catch {
  console.error("\nERROR: puppeteer not installed.");
  console.error("Run:  npm install --save-dev puppeteer\n");
  process.exit(1);
}

// ── Collect all SVGs ─────────────────────────────────────────────────────────
const categories = fs
  .readdirSync(ICONS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const icons = [];
for (const cat of categories) {
  const dir   = path.join(ICONS_DIR, cat);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".svg")).sort();
  for (const file of files) {
    icons.push({
      name:    path.parse(file).name,
      category: cat,
      svg:     fs.readFileSync(path.join(dir, file), "utf8").trim(),
    });
  }
}

console.log(`\nGenerating preview for ${icons.length} icons…`);

// ── Build HTML ───────────────────────────────────────────────────────────────
const COLS       = 10;
const CELL_SIZE  = 100;
const PADDING    = 32;
const IMG_WIDTH  = COLS * CELL_SIZE + PADDING * 2;

// Make SVG strokes dark for the preview
function prepareSVG(svgString) {
  return svgString
    .replace(/stroke="#[0-9a-fA-F]{3,6}"/g, 'stroke="#18181b"')
    .replace(/fill="#1a73e8"/g,             'fill="#e8f0fe"')
    .replace(/fill-opacity="[^"]*"/g,       'fill-opacity="0.4"');
}

const cells = icons
  .map(
    (icon) => `
  <div class="cell">
    <div class="icon-wrap">${prepareSVG(icon.svg)}</div>
    <div class="name">${icon.name}</div>
  </div>`
  )
  .join("\n");

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, "Inter", sans-serif;
    background: #ffffff;
    padding: ${PADDING}px;
    width: ${IMG_WIDTH}px;
  }
  .header {
    text-align: center;
    margin-bottom: 28px;
  }
  .header h1 {
    font-size: 22px;
    font-weight: 700;
    color: #18181b;
    letter-spacing: -0.02em;
  }
  .header p {
    font-size: 12px;
    color: #71717a;
    margin-top: 4px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(${COLS}, ${CELL_SIZE}px);
    gap: 0;
  }
  .cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 14px 6px 10px;
    gap: 7px;
  }
  .icon-wrap {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #18181b;
  }
  .icon-wrap svg {
    width: 28px;
    height: 28px;
    display: block;
  }
  .name {
    font-size: 9px;
    color: #71717a;
    text-align: center;
    font-family: "Courier New", monospace;
    line-height: 1.3;
    word-break: break-all;
    max-width: ${CELL_SIZE - 12}px;
  }
  .footer {
    text-align: center;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e4e4e7;
  }
  .footer p {
    font-size: 11px;
    color: #a1a1aa;
  }
</style>
</head>
<body>
  <div class="header">
    <h1>Northline Icons</h1>
    <p>${icons.length} minimal outline SVG icons · MIT License · github.com/northcodebase/north-iconpack</p>
  </div>
  <div class="grid">
    ${cells}
  </div>
  <div class="footer">
    <p>northline-icons v1.0.0 · ${icons.length} icons · 11 categories · 24×24 · MIT</p>
  </div>
</body>
</html>`;

// ── Screenshot with Puppeteer ─────────────────────────────────────────────────
(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
  });

  const page = await browser.newPage();

  await page.setContent(html);

  /* Wait for layout to settle */
  await page.waitForTimeout?.(300).catch(() => {});

  /* Auto-height screenshot */
  const bodyHandle = await page.$("body");
  const { height } = await bodyHandle.boundingBox();

  await page.setViewport({ width: IMG_WIDTH, height: Math.ceil(height), deviceScaleFactor: 2 });
  await page.setContent(html);

  await page.screenshot({
    path: OUT_FILE,
    type: "png",
    fullPage: true,
  });

  await browser.close();

  console.log(`Preview saved → ${OUT_FILE}`);
  console.log(`Size: ${IMG_WIDTH}px × ${Math.ceil(height)}px @ 2x\n`);
})();
