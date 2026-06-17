#!/usr/bin/env node
/**
 * scripts/convert-to-ico.js
 * Converts every SVG in icons/ and icons-white/ → assets/ico/ and assets/ico-white/
 * using a pure-JS ICO encoder that wraps 128x128 transparent PNGs.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");

// Function to convert a folder of SVGs into ICOs
async function convertFolder(srcDirName, dstDirName) {
  const srcDir = path.join(ROOT, srcDirName);
  const dstDir = path.join(ROOT, "assets", dstDirName);

  if (!fs.existsSync(srcDir)) {
    console.warn(`Directory not found: ${srcDirName}, skipping.`);
    return;
  }

  const categories = fs
    .readdirSync(srcDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  console.log(`Converting SVGs in ${srcDirName} to ICOs in assets/${dstDirName}...`);

  let successCount = 0;
  let errorCount = 0;

  for (const cat of categories) {
    const srcCatDir = path.join(srcDir, cat);
    const dstCatDir = path.join(dstDir, cat);

    fs.mkdirSync(dstCatDir, { recursive: true });

    const files = fs
      .readdirSync(srcCatDir)
      .filter((f) => f.toLowerCase().endsWith(".svg"));

    for (const file of files) {
      const name = path.parse(file).name;
      const srcPath = path.join(srcCatDir, file);
      const dstPath = path.join(dstCatDir, `${name}.ico`);

      try {
        const svgContent = fs.readFileSync(srcPath);

        // Render transparent 128x128 PNG buffer
        const pngBuffer = await sharp(svgContent, { density: 512 })
          .resize(128, 128, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png({ compressionLevel: 9, palette: false })
          .toBuffer();

        // Structure a standard 1-image ICO file:
        // 1. ICO Header (6 bytes)
        // 2. Directory Entry (16 bytes)
        // 3. PNG data (at offset 22)
        const icoBuffer = Buffer.alloc(22 + pngBuffer.length);

        // Header
        icoBuffer.writeUInt16LE(0, 0);   // Reserved
        icoBuffer.writeUInt16LE(1, 2);   // Type: 1 = ICO
        icoBuffer.writeUInt16LE(1, 4);   // Image Count: 1

        // Directory Entry
        icoBuffer.writeUInt8(128, 6);    // Width
        icoBuffer.writeUInt8(128, 7);    // Height
        icoBuffer.writeUInt8(0, 8);      // Color palette size: 0 (no palette)
        icoBuffer.writeUInt8(0, 9);      // Reserved
        icoBuffer.writeUInt16LE(1, 10);  // Color planes: 1
        icoBuffer.writeUInt16LE(32, 12); // Bits per pixel: 32
        icoBuffer.writeUInt32LE(pngBuffer.length, 14); // Size of PNG data
        icoBuffer.writeUInt32LE(22, 18); // Offset of PNG data (header + directory entry)

        // Payload
        pngBuffer.copy(icoBuffer, 22);

        fs.writeFileSync(dstPath, icoBuffer);
        successCount++;
      } catch (err) {
        console.error(`  ✗ Failed to convert ${cat}/${file}: ${err.message}`);
        errorCount++;
      }
    }
  }

  console.log(`Finished assets/${dstDirName}: Converted ${successCount} icons successfully. Failures: ${errorCount}.\n`);
}

async function main() {
  console.log("Starting SVG to ICO conversion...");
  await convertFolder("icons", "ico");
  await convertFolder("icons-white", "ico-white");
  console.log("All ICO conversion tasks completed.");
}

main().catch((err) => {
  console.error("Global conversion error:", err);
  process.exit(1);
});
