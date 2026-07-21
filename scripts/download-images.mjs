// One-time backfill + refresh helper: download every deal's product photo into
// public/products/<id>.<ext> so the site never depends on retailer CDNs.
// Safe to re-run: existing local files are kept unless --force is passed.
// Usage: node scripts/download-images.mjs [--rewrite] [--force]
//   --rewrite  also rewrite src/data/deals.ts image fields to the local copies
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const DEALS = path.join(ROOT, "src", "data", "deals.ts");
const OUT = path.join(ROOT, "public", "products");
mkdirSync(OUT, { recursive: true });

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

const EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "image/svg+xml": "svg",
};

const src = readFileSync(DEALS, "utf8");

// photos map: key -> retailer URL
const photosBlock = src.slice(src.indexOf("export const photos"), src.indexOf("export const deals"));
const photos = {};
for (const m of photosBlock.matchAll(/(\w+):"(https?:[^"]+)"/g)) photos[m[1]] = m[2];

// deals: id -> photo key (matches both photos.key and already-localized entries)
const dealsBlock = src.slice(src.indexOf("export const deals"), src.indexOf("];", src.indexOf("export const deals")));
const wanted = [];
for (const m of dealsBlock.matchAll(/\{id:(\d+),.*?(?:image:photos\.(\w+)|sourceImage:photos\.(\w+))/g)) {
  const key = m[2] || m[3];
  if (key && photos[key]) wanted.push({ id: Number(m[1]), key, url: photos[key] });
}

const force = process.argv.includes("--force");
const rewrite = process.argv.includes("--rewrite");
const existing = new Set(readdirSync(OUT));
const localName = (id) => [...existing].find((f) => f.startsWith(`${id}.`));

const results = { ok: [], skipped: [], failed: [] };
for (const { id, key, url } of wanted) {
  const have = localName(id);
  if (have && !force) {
    results.skipped.push({ id, file: have });
    continue;
  }
  try {
    const res = await fetch(url, { headers: HEADERS, redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = (res.headers.get("content-type") || "").split(";")[0].trim();
    const ext = EXT[type] || "jpg";
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 500) throw new Error(`suspiciously small response (${buf.length} B)`);
    const file = `${id}.${ext}`;
    writeFileSync(path.join(OUT, file), buf);
    existing.add(file);
    results.ok.push({ id, key, file, kb: Math.round(buf.length / 1024) });
  } catch (err) {
    results.failed.push({ id, key, url, error: String(err.message || err) });
  }
}

for (const r of results.ok) console.log(`downloaded  ${r.file}  (${r.kb} KB)  [${r.key}]`);
for (const r of results.skipped) console.log(`kept        ${r.file}`);
for (const r of results.failed) console.log(`FAILED      id ${r.id} [${r.key}]  ${r.error}  ${r.url}`);

if (rewrite) {
  let out = src;
  let changed = 0;
  for (const { id, key } of wanted) {
    const file = localName(id);
    if (!file) continue;
    const re = new RegExp(`(\\{id:${id},[^\\n]*?)image:photos\\.${key},`);
    if (re.test(out)) {
      out = out.replace(re, `$1image:"products/${file}",sourceImage:photos.${key},`);
      changed++;
    }
  }
  if (changed) {
    writeFileSync(DEALS, out);
    console.log(`rewrote ${changed} deal(s) in src/data/deals.ts to local images`);
  }
}

console.log(`\n${results.ok.length} downloaded, ${results.skipped.length} kept, ${results.failed.length} failed`);
if (results.failed.length) process.exitCode = 1;
