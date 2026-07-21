// Build-time guard for src/data/deals.ts. Fails (exit 1) on:
//  - duplicate product URLs (a refresh must never insert a URL that already exists)
//  - duplicate deal ids
//  - a deal pointing at a local image that does not exist in public/
// Run directly (node scripts/validate-deals.mjs) or via npm run build.
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const src = readFileSync(path.join(ROOT, "src", "data", "deals.ts"), "utf8");

const dealsBlock = src.slice(
  src.indexOf("const rawDeals"),
  src.indexOf("];", src.indexOf("const rawDeals")),
);

const errors = [];
const ids = new Map();
const urls = new Map();

for (const m of dealsBlock.matchAll(/\{id:(\d+),.*?url:"([^"]+)".*?\}/g)) {
  const id = Number(m[1]);
  const url = m[2];
  if (ids.has(id)) errors.push(`duplicate id ${id}`);
  ids.set(id, true);
  const normalized = url.replace(/[?#].*$/, "").replace(/\/+$/, "").toLowerCase();
  if (urls.has(normalized)) errors.push(`duplicate product URL (ids ${urls.get(normalized)} and ${id}): ${url}`);
  urls.set(normalized, id);
}

for (const m of dealsBlock.matchAll(/image:"((?:products|store-icons)\/[^"]+)"/g)) {
  if (!existsSync(path.join(ROOT, "public", m[1]))) errors.push(`missing local image: public/${m[1]}`);
}

if (!ids.size) errors.push("no deals parsed — has the file format changed?");

if (errors.length) {
  console.error(`validate-deals: FAILED\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}
console.log(`validate-deals: OK (${ids.size} deals, ${urls.size} unique URLs)`);
