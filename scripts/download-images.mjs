// One-time backfill + refresh helper: download every deal's product photo into
// public/products/<id>.<ext> so the site never depends on retailer CDNs.
// Safe to re-run: existing local files are kept unless --force is passed.
// Usage: node scripts/download-images.mjs [--rewrite] [--force]
//   --rewrite  also rewrite src/data/deals.ts image fields to the local copies
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Cards render at most ~560 px wide; anything larger is wasted bytes on a phone.
const MAX_WIDTH = 600;
const WEBP_QUALITY = 82;

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

const ARRAY_START = "const rawDeals";
if (src.indexOf(ARRAY_START) === -1) {
  console.error(`download-images: could not find "${ARRAY_START}" in ${DEALS} — has the file format changed?`);
  process.exit(1);
}

// photos map: key -> retailer URL
const photosBlock = src.slice(src.indexOf("export const photos"), src.indexOf(ARRAY_START));
const photos = {};
for (const m of photosBlock.matchAll(/(\w+):"(https?:[^"]+)"/g)) photos[m[1]] = m[2];

// deals: id -> photo key (matches both photos.key and already-localized entries)
const dealsBlock = src.slice(src.indexOf(ARRAY_START), src.indexOf("];", src.indexOf(ARRAY_START)));
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
  // Ask CDNs that support it for a thumbnail-sized render rather than the
  // full-resolution original — cards never display wider than ~560 px.
  let fetchUrl = url;
  const add = (params) => { fetchUrl += (fetchUrl.includes("?") ? "&" : "?") + params; };
  if (/cdn\.shopify\.com|hobbii\.com\/cdn/.test(url) && !/[?&]width=/.test(url)) add("width=600");
  else if (/walmartimages\.com/.test(url) && !/odnWidth=/.test(url)) add("odnHeight=600&odnWidth=600");
  else if (/amplience\.net/.test(url) && !/[?&]w=/.test(url)) add("w=600&h=600&sm=mc&fmt=webp");
  else if (/michaels\.com/.test(url) && !/fit=inside/.test(url)) add("fit=inside|600:600");
  try {
    const res = await fetch(fetchUrl, { headers: HEADERS, redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = Buffer.from(await res.arrayBuffer());
    if (raw.length < 500) throw new Error(`suspiciously small response (${raw.length} B)`);

    // Normalize every thumbnail to a capped-width WebP so retailer-side
    // inconsistency (3 MB PNGs, ignored resize params) can't bloat the site.
    const buf = await sharp(raw)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const file = `${id}.webp`;
    // drop any earlier copy of this id in a different format
    for (const old of [...existing].filter((f) => f.startsWith(`${id}.`) && f !== file)) {
      unlinkSync(path.join(OUT, old));
      existing.delete(old);
    }
    writeFileSync(path.join(OUT, file), buf);
    existing.add(file);
    results.ok.push({ id, key, file, kb: Math.round(buf.length / 1024), from: Math.round(raw.length / 1024) });
  } catch (err) {
    results.failed.push({ id, key, url, error: String(err.message || err) });
  }
}

for (const r of results.ok) console.log(`downloaded  ${r.file}  (${r.from} KB → ${r.kb} KB)  [${r.key}]`);
for (const r of results.skipped) console.log(`kept        ${r.file}`);
for (const r of results.failed) console.log(`FAILED      id ${r.id} [${r.key}]  ${r.error}  ${r.url}`);

if (rewrite) {
  let out = src;
  let changed = 0;
  for (const { id, key } of wanted) {
    const file = localName(id);
    if (!file) continue;
    // first localization: image:photos.KEY -> local path, keeping the retailer URL
    const fresh = new RegExp(`(\\{id:${id},[^\\n]*?)image:photos\\.${key},`);
    // already localized: correct the path if the stored extension changed
    const stale = new RegExp(`(\\{id:${id},[^\\n]*?)image:"products/${id}\\.[a-z0-9]+",`);
    if (fresh.test(out)) {
      out = out.replace(fresh, `$1image:"products/${file}",sourceImage:photos.${key},`);
      changed++;
    } else if (stale.test(out) && !out.match(stale)[0].includes(`products/${file}"`)) {
      out = out.replace(stale, `$1image:"products/${file}",`);
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
