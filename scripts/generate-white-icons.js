#!/usr/bin/env node
/**
 * scripts/generate-white-icons.js
 * Generates a white-fill variant of every SVG icon in icons/ → icons-white/
 * by replacing the brand accent color #1a73e8 with white (#ffffff).
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT, "icons");
const DST_DIR = path.join(ROOT, "icons-white");

function processDirectory() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Source directory does not exist: ${SRC_DIR}`);
    process.exit(1);
  }

  // Find all category directories
  const categories = fs.readdirSync(SRC_DIR).filter(f => {
    return fs.statSync(path.join(SRC_DIR, f)).isDirectory();
  });

  console.log(`Generating white icon variants from ${categories.length} categories...`);

  let count = 0;
  for (const cat of categories) {
    const srcCatDir = path.join(SRC_DIR, cat);
    const dstCatDir = path.join(DST_DIR, cat);

    if (!fs.existsSync(dstCatDir)) {
      fs.mkdirSync(dstCatDir, { recursive: true });
    }

    const files = fs.readdirSync(srcCatDir).filter(f => f.toLowerCase().endsWith(".svg"));
    for (const file of files) {
      const srcPath = path.join(srcCatDir, file);
      const dstPath = path.join(dstCatDir, file);

      const content = fs.readFileSync(srcPath, "utf8");

      // Replace boundary line and dark detail color #202124 with white (#ffffff)
      const replaced = content
        .replace(/fill="#202124"/gi, 'fill="#ffffff"')
        .replace(/stroke="#202124"/gi, 'stroke="#ffffff"')
        .replace(/#202124/gi, '#ffffff');

      fs.writeFileSync(dstPath, replaced, "utf8");
      count++;
    }
  }

  console.log(`Successfully generated ${count} white icon variants in: icons-white/`);
}

processDirectory();
