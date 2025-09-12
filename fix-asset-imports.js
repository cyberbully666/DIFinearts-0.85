const fs = require("fs");
const path = require("path");

// Folder where assets are stored
const ASSETS_FOLDER = path.join(__dirname, "src", "Assets");

// Recursively find all JS/JSX files
function getJsFiles(dir, files = []) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getJsFiles(fullPath, files);
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      files.push(fullPath);
    }
  });
  return files;
}

// Build a map of actual asset paths with correct capitalization
function getAssetMap(dir, base = "./") {
  let map = {};
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const relativePath = path.join(base, file);
    if (fs.statSync(fullPath).isDirectory()) {
      Object.assign(map, getAssetMap(fullPath, relativePath));
    } else {
      const normalized = relativePath.replace(/\\/g, "/"); // Windows → Unix style
      const key = normalized.toLowerCase(); // key for case-insensitive match
      map[key] = normalized; // store correct capitalization
    }
  });
  return map;
}

// Update imports in JS files
function fixImports() {
  const jsFiles = getJsFiles(path.join(__dirname, "src"));
  const assetMap = getAssetMap(ASSETS_FOLDER, "./Assets");

  jsFiles.forEach((file) => {
    let content = fs.readFileSync(file, "utf8");
    let updated = content.replace(
      /from\s+['"](\.\/Assets\/[^'"]+)['"]/gi,
      (match, p1) => {
        const key = p1.toLowerCase();
        if (assetMap[key]) {
          return `from '${assetMap[key]}'`;
        }
        return match; // leave unchanged if not found
      }
    );

    if (content !== updated) {
      fs.writeFileSync(file, updated, "utf8");
      console.log(`Fixed imports in: ${file}`);
    }
  });
}

fixImports();
console.log("✅ All asset imports fixed to match actual file paths.");
