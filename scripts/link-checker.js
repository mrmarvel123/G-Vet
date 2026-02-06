const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((f) => {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, filelist);
    else filelist.push(full);
  });
  return filelist;
}

const htmlFiles = walk(root).filter((f) => f.endsWith(".html"));

const linkRegex = /(?:href|src)=["']([^"'#?]+?)(?:[#?][^"']*)?["']/gi;
const jsHrefRegex = /window\.location\.href\s*=\s*["']([^"']+?)["']/gi;

const missing = {};

function existsCandidate(target, baseDir) {
  // Normalize
  if (!target) return false;
  // If absolute (starts with /), treat relative to root
  if (target.startsWith("/")) {
    const rel = target.replace(/^\//, "");
    const p1 = path.join(root, rel);
    const p2 = p1 + ".html";
    return fs.existsSync(p1) || fs.existsSync(p2);
  }
  // Relative path
  const pRel = path.resolve(baseDir, target);
  if (fs.existsSync(pRel)) return true;
  if (fs.existsSync(pRel + ".html")) return true;
  // Try relative to root
  const pRoot = path.join(root, target);
  if (fs.existsSync(pRoot)) return true;
  if (fs.existsSync(pRoot + ".html")) return true;
  return false;
}

htmlFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const dir = path.dirname(file);
  let m;
  while ((m = linkRegex.exec(content)) !== null) {
    const target = m[1];
    if (!existsCandidate(target, dir)) {
      missing[target] = missing[target] || [];
      missing[target].push(file);
    }
  }
  while ((m = jsHrefRegex.exec(content)) !== null) {
    const target = m[1];
    // strip fragment/query
    const t = target.split(/[?#]/)[0];
    if (!existsCandidate(t, dir)) {
      missing[t] = missing[t] || [];
      missing[t].push(file + " (js)");
    }
  }
});

console.log("Scanned HTML files:", htmlFiles.length);
const keys = Object.keys(missing);
if (keys.length === 0) {
  console.log("No missing HTML link targets found.");
  process.exit(0);
}
console.log("Missing targets found:", keys.length);
keys.forEach((k) => {
  console.log("\nTarget:", k);
  missing[k].forEach((src) =>
    console.log("  referenced from:", path.relative(root, src)),
  );
});
process.exit(1);
