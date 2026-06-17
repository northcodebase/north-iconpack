#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ICONS_DIR = path.join(ROOT, "icons");
const METADATA_PATH = path.join(ROOT, "metadata.json");

function scanIcons() {
  const list = [];
  const categories = fs.readdirSync(ICONS_DIR).filter(f => {
    return fs.statSync(path.join(ICONS_DIR, f)).isDirectory();
  });

  for (const cat of categories) {
    const dir = path.join(ICONS_DIR, cat);
    const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith(".svg"));
    for (const file of files) {
      const name = path.parse(file).name;
      list.push({
        name,
        file,
        category: cat
      });
    }
  }
  return list;
}

function generateTags(name) {
  const parts = name.split("-");
  const tags = new Set(parts);
  // Add some helpful synonyms/tags based on the name
  if (name.includes("plus") || name.includes("add")) tags.add("create").add("new").add("insert");
  if (name.includes("minus") || name.includes("remove")) tags.add("delete").add("subtract");
  if (name.includes("lock") || name.includes("shield") || name.includes("secure")) tags.add("security").add("auth").add("safe").add("privacy");
  if (name.includes("file") || name.includes("folder") || name.includes("document")) tags.add("storage").add("data").add("directory");
  if (name.includes("chat") || name.includes("message") || name.includes("mail")) tags.add("communication").add("contact").add("inbox");
  if (name.includes("pay") || name.includes("card") || name.includes("wallet") || name.includes("commerce")) tags.add("money").add("finance").add("billing");
  if (name.includes("arrow") || name.includes("chevron")) tags.add("navigation").add("direction");
  if (name.includes("ai") || name.includes("sparkle") || name.includes("bot")) tags.add("magic").add("intelligence").add("neural");
  return Array.from(tags);
}

function run() {
  const actualIcons = scanIcons();
  console.log(`Scanned ${actualIcons.length} icons from disk.`);

  let metadata = {};
  if (fs.existsSync(METADATA_PATH)) {
    let raw = fs.readFileSync(METADATA_PATH, "utf8");
    metadata = JSON.parse(raw.replace(/^\uFEFF/, ""));
  }

  const existingIconsMap = new Map();
  if (metadata.icons && Array.isArray(metadata.icons)) {
    metadata.icons.forEach(icon => {
      existingIconsMap.set(`${icon.category}/${icon.file}`, icon);
    });
  }

  // Define default category labels/descriptions if they don't exist
  const categoryMeta = metadata.categories || {};
  const newCategories = {
    "actions": { "label": "Actions", "description": "Icons representing user interactions and common operations" },
    "navigation": { "label": "Navigation", "description": "Directional and structural navigation icons" },
    "security": { "label": "Security", "description": "Authentication, privacy, and protection-related icons" },
    "communication": { "label": "Communication", "description": "Messaging, notification, and connectivity icons" },
    "files": { "label": "Files", "description": "File system and storage icons" },
    "commerce": { "label": "Commerce", "description": "Payment, shopping, and financial icons" },
    "users": { "label": "Users", "description": "People, identity, and role icons" },
    "alerts": { "label": "Alerts", "description": "Informational and warning state icons" },
    "system": { "label": "System", "description": "Device, infrastructure, and OS-level icons" },
    "theme": { "label": "Theme", "description": "Light and dark mode toggle icons" },
    "brands": { "label": "Brands", "description": "Northline product brand mark icons" },
    "development": { "label": "Development", "description": "Developer, programming, and terminal icons" },
    "ai": { "label": "AI & Modern Apps", "description": "Artificial intelligence, agents, and automation icons" },
    "media": { "label": "Media", "description": "Audio, video, image, and playback controls" },
    "extensions": { "label": "Browser Extensions", "description": "Web browser extension, page and tab control icons" }
  };

  // Merge categories
  Object.keys(newCategories).forEach(key => {
    if (!categoryMeta[key]) {
      categoryMeta[key] = newCategories[key];
    }
    categoryMeta[key].count = 0; // Reset count to recalculate
  });

  const updatedIcons = [];
  actualIcons.forEach(actual => {
    const key = `${actual.category}/${actual.file}`;
    let iconData = existingIconsMap.get(key);

    // If category has changed or it doesn't exist, build new
    if (!iconData) {
      // Maybe existed with different category
      // Look up by file only
      let found = false;
      for (const item of existingIconsMap.values()) {
        if (item.file === actual.file) {
          iconData = { ...item, category: actual.category };
          found = true;
          break;
        }
      }

      if (!found) {
        iconData = {
          name: actual.name,
          file: actual.file,
          category: actual.category,
          tags: generateTags(actual.name)
        };
      }
    }

    updatedIcons.push(iconData);
    if (categoryMeta[actual.category]) {
      categoryMeta[actual.category].count++;
    }
  });

  // Sort icons alphabetically by name
  updatedIcons.sort((a, b) => a.name.localeCompare(b.name));

  metadata.totalIcons = updatedIcons.length;
  metadata.generatedAt = new Date().toISOString();
  metadata.categories = categoryMeta;
  metadata.icons = updatedIcons;

  fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2), "utf8");
  console.log(`Successfully updated ${METADATA_PATH} with ${updatedIcons.length} total icons.`);
}

run();
