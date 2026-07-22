// Free, deterministic twice-daily refresh. NO paid AI, NO API keys.
//
// What it does, all for $0:
//   1. Re-checks every Hobbii & Hobby Lobby deal against live data.
//        match  -> stamp `verified` = today
//        drift  -> correct price from the retailer's own data (Hobbii only;
//                  Hobby Lobby mismatches are flagged, not auto-corrected,
//                  because its price is HTML-scraped and less certain)
//        ended  -> remove the deal + its local image (Hobbii sale gone / 404)
//   2. Leaves Walmart & Michaels completely alone (they block scripts) — no
//      fetch, no spend, no failure. Their `verified` dates stay frozen.
//   3. Advances storeChecks[store].lastChecked ONLY for stores actually
//      reached this run, so a store going stale is visible in the UI + log.
//   4. Hunts new Hobbii deals and SURFACES them as candidates (never auto-adds
//      — copy stays human-curated).
//   5. Writes an admin trail to REFRESH_LOG.md and candidates to
//      refresh-candidates.md (for the workflow's review issue).
//
// Safety: every store is isolated in try/catch; a store that errors is skipped
// and its date is NOT advanced. A parser that suddenly wants to delete most of
// a store's deals is treated as broken (removals aborted). The script never
// throws and always exits 0 — a bad run must never break the site or the job.
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync, appendFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const DEALS = path.join(ROOT, "src", "data", "deals.ts");
const PRODUCTS = path.join(ROOT, "public", "products");
const LOG = path.join(ROOT, "REFRESH_LOG.md");
const CANDIDATES = path.join(ROOT, "refresh-candidates.md");

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};
const CT = { timeZone: "America/Chicago" };
const TODAY = new Date().toLocaleDateString("en-US", { ...CT, month: "long", day: "numeric", year: "numeric" });
const TIME = new Date().toLocaleTimeString("en-US", { ...CT, hour: "numeric", minute: "2-digit" });
const NOW = `${TODAY} at ${TIME} Central`;
const REMOVAL_ABORT_RATIO = 0.4; // >40% of a store's fetched deals wanting removal = broken parser

const out = (k, v) => { if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`); };

async function get(url, asJson = false) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 25000);
  try {
    const res = await fetch(url, { headers: HEADERS, redirect: "follow", signal: ctl.signal });
    return { status: res.status, body: res.ok ? (asJson ? await res.json() : await res.text()) : null };
  } catch (e) {
    return { status: 0, error: String(e.message || e) };
  } finally {
    clearTimeout(t);
  }
}

// Resolve a deal against live data. Returns one of:
//   {state:"match"} | {state:"correct",sale,regular} | {state:"remove",why}
//   {state:"flag",why} | {state:"skip",why}   (skip/flag never mutate)
async function resolve(deal) {
  if (deal.store === "Hobbii") {
    const r = await get(deal.url.split("?")[0] + ".js", true);
    if (r.status === 404) return { state: "remove", why: "product page gone (404)" };
    if (r.status !== 200 || !r.body) return { state: "skip", why: `blocked (HTTP ${r.status || r.error})` };
    const variants = (r.body.variants || []).filter((v) => v.available);
    if (!variants.length) return { state: "remove", why: "no variants in stock" };
    const disc = variants.filter((v) => v.compare_at_price && Number(v.compare_at_price) > Number(v.price));
    if (!disc.length) return { state: "remove", why: "sale ended (no discounted variant)" };
    const best = disc.sort((a, b) => (1 - a.price / a.compare_at_price) - (1 - b.price / b.compare_at_price)).at(-1);
    const sale = +(best.price / 100).toFixed(2);
    const regular = +(best.compare_at_price / 100).toFixed(2);
    if (Math.abs(sale - deal.sale) <= 0.05 && Math.abs(regular - deal.regular) <= 0.05) return { state: "match" };
    return { state: "correct", sale, regular };
  }
  if (deal.store === "Hobby Lobby") {
    const r = await get(deal.url);
    if (r.status === 404 || r.status === 410) return { state: "remove", why: `product page gone (${r.status})` };
    if (r.status !== 200 || !r.body) return { state: "skip", why: `blocked (HTTP ${r.status || r.error})` };
    // HL product pages list every color variant, each with its own price. The
    // deal targets one specific variant, so match the listed price against ANY
    // discounted price on the page rather than just the first one.
    const prices = [...r.body.matchAll(/"discountedPrice"\s*:\s*([\d.]+)/g)].map((m) => +m[1]);
    if (!prices.length) {
      const m = r.body.match(/"offers"[\s\S]{0,300}?"price"\s*:\s*"?([\d.]+)/) || r.body.match(/"price"\s*:\s*"?([\d.]+)/);
      if (!m) return { state: "skip", why: "price not found in page" };
      prices.push(+m[1]);
    }
    if (prices.some((p) => Math.abs(p - deal.sale) <= 0.05)) return { state: "match" };
    const nearest = prices.reduce((a, b) => (Math.abs(b - deal.sale) < Math.abs(a - deal.sale) ? b : a));
    // HTML-scraped: don't silently rewrite, surface for a human look
    return { state: "flag", why: `listed $${deal.sale.toFixed(2)} not among live prices (nearest $${nearest.toFixed(2)}) — review` };
  }
  return { state: "skip", why: "not script-checkable" };
}

function parseDealLine(line) {
  const id = line.match(/\{id:(\d+)/);
  const store = line.match(/store:"([^"]+)"/);
  const url = line.match(/url:"([^"]+)"/);
  const sale = line.match(/sale:([\d.]+)/);
  const regular = line.match(/regular:([\d.]+)/);
  const verified = line.match(/verified:"([^"]+)"/);
  if (!id || !store || !url || !sale || !regular) return null;
  return { id: +id[1], store: store[1], url: url[1], sale: +sale[1], regular: +regular[1], verified: verified?.[1], fresh: /,fresh:true/.test(line) };
}

async function main() {
  let src = readFileSync(DEALS, "utf8");
  const startIdx = src.indexOf("const rawDeals");
  const endIdx = src.indexOf("];", startIdx);
  if (startIdx === -1 || endIdx === -1) { console.error("refresh: could not locate rawDeals array"); return; }

  const head = src.slice(0, startIdx);
  const arrayText = src.slice(startIdx, endIdx);
  const tail = src.slice(endIdx);
  const lines = arrayText.split("\n");

  const log = { checked: 0, matched: 0, corrected: 0, removed: [], flagged: [], skipped: {}, reached: new Set() };
  const perStore = {}; // store -> {fetched, removeLines:Set}
  const decisions = []; // {lineIdx, action, ...}
  const freshClear = new Set(); // line indices whose "New today" flag should expire

  for (let i = 0; i < lines.length; i++) {
    const d = parseDealLine(lines[i]);
    if (!d) continue;
    log.checked++;
    // "New today" only means added today — expire it on any later calendar day,
    // independent of the price re-check (which bumps `verified` to today).
    if (d.fresh && d.verified !== TODAY) freshClear.add(i);
    let res;
    try {
      res = await resolve(d);
    } catch (e) {
      res = { state: "skip", why: `error: ${String(e.message || e)}` };
    }
    perStore[d.store] ||= { fetched: 0, removeLines: new Set() };
    if (["match", "correct", "remove", "flag"].includes(res.state)) { perStore[d.store].fetched++; log.reached.add(d.store); }
    if (res.state === "match") { decisions.push({ i, action: "stamp" }); log.matched++; }
    else if (res.state === "correct") { decisions.push({ i, action: "correct", sale: res.sale, regular: res.regular }); log.corrected++; }
    else if (res.state === "remove") { perStore[d.store].removeLines.add(i); decisions.push({ i, action: "remove", id: d.id, why: res.why, title: d.url }); }
    else if (res.state === "flag") { log.flagged.push(`#${d.id} ${d.store}: ${res.why}`); }
    else { (log.skipped[d.store] ||= 0), log.skipped[d.store]++; }
  }

  // Safety valve: if a store wants to drop >40% of what it fetched, its parser
  // or the site likely broke — cancel that store's removals and just log it.
  const abortedStores = [];
  for (const [store, s] of Object.entries(perStore)) {
    if (s.fetched >= 3 && s.removeLines.size / s.fetched > REMOVAL_ABORT_RATIO) {
      abortedStores.push(`${store} (${s.removeLines.size}/${s.fetched} — aborted, likely a broken parser)`);
      for (const i of s.removeLines) {
        const dec = decisions.find((x) => x.i === i && x.action === "remove");
        if (dec) dec.action = "abort";
      }
    }
  }

  // Apply line edits
  const removedIds = [];
  const drop = new Set();
  for (const dec of decisions) {
    if (dec.action === "stamp" || dec.action === "correct") {
      lines[dec.i] = lines[dec.i].replace(/verified:"[^"]+"/, `verified:"${TODAY}"`);
    }
    if (dec.action === "correct") {
      lines[dec.i] = lines[dec.i].replace(/sale:[\d.]+/, `sale:${dec.sale}`).replace(/regular:[\d.]+/, `regular:${dec.regular}`);
    }
    if (dec.action === "remove") { drop.add(dec.i); removedIds.push(dec.id); log.removed.push(`#${dec.id}: ${dec.why}`); }
  }
  for (const i of freshClear) if (!drop.has(i)) lines[i] = lines[i].replace(/,fresh:true/, "");
  const newArrayText = lines.filter((_, i) => !drop.has(i)).join("\n");
  src = head + newArrayText + tail;

  // Advance storeChecks dates only for stores actually reached this run
  for (const store of log.reached) {
    const key = store.includes(" ") ? `"${store}"` : store;
    src = src.replace(
      new RegExp(`(${key}:\\{lastChecked:")[^"]+(",auto:)`),
      `$1${TODAY}$2`,
    );
  }
  // Freshness stamp (meta.lastChecked has a space after the colon; storeChecks does not)
  src = src.replace(/lastChecked: "[^"]*"/, `lastChecked: "${NOW}"`);

  const changed = src !== readFileSync(DEALS, "utf8");
  if (changed) writeFileSync(DEALS, src);

  // Remove images for pruned deals
  if (removedIds.length && existsSync(PRODUCTS)) {
    for (const id of removedIds) {
      for (const f of readdirSync(PRODUCTS).filter((f) => f.startsWith(`${id}.`))) {
        try { unlinkSync(path.join(PRODUCTS, f)); } catch { /* already gone */ }
      }
    }
  }

  // --- new-deal hunt (surface only) ---
  const candidates = await huntHobbii(src).catch((e) => { console.error("hunt failed:", e.message); return []; });

  writeReports(log, abortedStores, candidates);

  out("changed", changed ? "true" : "false");
  out("removed", log.removed.length);
  out("corrected", log.corrected);
  out("flagged", log.flagged.length);
  out("candidates", candidates.length);
  console.log(`refresh: ${log.checked} checked · ${log.matched} matched · ${log.corrected} corrected · ${log.removed.length} removed · ${log.flagged.length} flagged · ${candidates.length} new candidates`);
}

async function huntHobbii(src) {
  const have = new Set([...src.matchAll(/url:"([^"]+)"/g)].map((m) => m[1].replace(/[?#].*$/, "").toLowerCase()));
  const found = new Map();
  const relevant = /hook|needle|marker|tool|winder|swift|gauge|scissor|pom|counter|blocking|tunisian|yarn/i;
  for (const c of ["all", "yarn", "crochet-hooks", "accessories"]) {
    for (let page = 1; page <= 4; page++) {
      const r = await get(`https://hobbii.com/collections/${c}/products.json?limit=250&page=${page}`, true);
      if (r.status !== 200 || !r.body?.products?.length) break;
      for (const p of r.body.products) {
        const isYarn = p.product_type === "yarn";
        if (!isYarn && !relevant.test(p.title)) continue;
        const avail = (p.variants || []).filter((v) => v.available);
        const disc = avail.filter((v) => v.compare_at_price && Number(v.compare_at_price) > Number(v.price));
        if (!disc.length || disc.length < avail.length) continue; // require ALL available variants discounted
        const pct = Math.max(...disc.map((v) => Math.round((1 - v.price / v.compare_at_price) * 100)));
        if (pct < 35) continue;
        const url = `https://hobbii.com/products/${p.handle}`;
        if (have.has(url.toLowerCase())) continue;
        const sale = Math.min(...disc.map((v) => +v.price));
        found.set(url, { title: p.title, type: p.product_type || "accessory", pct, sale, url });
      }
    }
  }
  return [...found.values()].sort((a, b) => b.pct - a.pct).slice(0, 20);
}

function writeReports(log, aborted, candidates) {
  const skippedStr = Object.entries(log.skipped).map(([s, n]) => `${s} ${n}`).join(", ") || "none";
  const storeLine = (s) => log.reached.has(s) ? `reached, checked today` : (log.skipped[s] ? `skipped (${log.skipped[s]} blocked)` : `not script-checkable`);

  let entry = `## ${NOW}\n\n`;
  entry += `- **${log.checked}** deals checked · ${log.matched} matched · ${log.corrected} corrected · ${log.removed.length} removed · ${log.flagged.length} flagged\n`;
  entry += `- Hobbii: ${storeLine("Hobbii")} · Hobby Lobby: ${storeLine("Hobby Lobby")} · Walmart: not script-checkable · Michaels: not script-checkable\n`;
  if (aborted.length) entry += `- ⚠️ removals aborted for: ${aborted.join("; ")}\n`;
  if (log.removed.length) entry += `- Removed: ${log.removed.join("; ")}\n`;
  if (log.flagged.length) entry += `- Flagged for review: ${log.flagged.join("; ")}\n`;
  entry += `- ${candidates.length} new-deal candidate(s) surfaced (see refresh-candidates.md)\n\n`;

  const prev = existsSync(LOG) ? readFileSync(LOG, "utf8").replace(/^# Refresh log\s*/, "") : "";
  const kept = (entry + prev).split(/(?=^## )/m).filter((s) => s.trim()).slice(0, 60).join("");
  writeFileSync(LOG, `# Refresh log\n\n${kept}`);

  let cand = `# Jude's Craft Deals — refresh review · ${NOW}\n\n`;
  cand += `Free scripted refresh: **${log.checked}** checked · ${log.matched} matched · ${log.corrected} corrected · ${log.removed.length} removed · ${log.flagged.length} flagged. Walmart & Michaels block scripts, so their deals were left untouched (see their staleness in the app + REFRESH_LOG.md).\n\n`;
  if (log.removed.length) cand += `**Removed (sale ended / page gone):** ${log.removed.join("; ")}\n\n`;
  if (log.flagged.length) cand += `**Flagged — a scripted price looks off, check by hand:** ${log.flagged.join("; ")}\n\n`;
  if (aborted.length) cand += `**⚠️ Removals aborted (a parser likely broke, deals kept):** ${aborted.join("; ")}\n\n`;
  cand += `## New-deal candidates (not auto-added)\n\nGenuine Hobbii discounts not yet in the catalog. Add the good ones with proper titles/descriptions in a session — the hunt only surfaces, it never publishes machine-written copy.\n\n`;
  if (candidates.length) {
    cand += `| % off | sale | type | product | url |\n|---|---|---|---|---|\n`;
    for (const c of candidates) cand += `| ${c.pct}% | $${c.sale.toFixed(2)} | ${c.type} | ${c.title} | ${c.url} |\n`;
  } else {
    cand += `_No new qualifying Hobbii discounts this run._\n`;
  }
  writeFileSync(CANDIDATES, cand);
}

main().catch((e) => { console.error("refresh: unexpected error (exiting 0 so the job/site are unharmed):", e); });
