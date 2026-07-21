// Deterministic price/link checker for the deals in src/data/deals.ts.
// Prints a markdown report to stdout. Always exits 0 — a blocked store or dead
// link must never kill the workflow; problems are surfaced in the report.
// With GITHUB_OUTPUT set, appends "problems=<n>" for the workflow to read.
//
// Per-store reality (tested 2026-07-20):
//   Hobbii       Shopify — <product-url>.js returns clean JSON. Reliable.
//   Hobby Lobby  price readable from embedded JSON/JSON-LD in HTML. Usually OK.
//   Walmart      price in __NEXT_DATA__ when not bot-blocked. Flaky from CI IPs.
//   Michaels     403s all scripted requests. Never checked; left to the AI audit.
import { readFileSync, appendFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const src = readFileSync(path.join(ROOT, "src", "data", "deals.ts"), "utf8");

const dealsBlock = src.slice(
  src.indexOf("const rawDeals"),
  src.indexOf("];", src.indexOf("const rawDeals")),
);
const deals = [...dealsBlock.matchAll(
  /\{id:(\d+),title:"([^"]+)",store:"([^"]+)".*?sale:([\d.]+),.*?url:"([^"]+)"/g,
)].map((m) => ({ id: +m[1], title: m[2], store: m[3], sale: +m[4], url: m[5] }));

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

async function get(url, asJson = false) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 25000);
  try {
    const res = await fetch(url, { headers: HEADERS, redirect: "follow", signal: ctl.signal });
    const body = res.ok ? (asJson ? await res.json() : await res.text()) : null;
    return { status: res.status, body };
  } catch (e) {
    return { status: 0, error: String(e.message || e) };
  } finally {
    clearTimeout(t);
  }
}

async function livePrice(deal) {
  if (deal.store === "Michaels") return { state: "SKIPPED", note: "Michaels blocks scripted checks" };
  if (deal.store === "Hobbii") {
    const r = await get(deal.url.split("?")[0] + ".js", true);
    if (r.status === 404) return { state: "GONE" };
    if (r.status !== 200) return { state: "BLOCKED", note: `HTTP ${r.status}` };
    const cents = r.body?.price;
    return typeof cents === "number" ? { state: "PRICED", price: cents / 100 } : { state: "UNPARSED" };
  }
  const r = await get(deal.url);
  if (r.status === 404 || r.status === 410) return { state: "GONE" };
  if (r.status !== 200) return { state: "BLOCKED", note: `HTTP ${r.status}` };
  const html = r.body;
  const patterns = deal.store === "Walmart"
    ? [/"currentPrice"\s*:\s*\{[^{}]*?"price"\s*:\s*([\d.]+)/, /"price"\s*:\s*"?\$?([\d.]+)"?\s*,\s*"priceCurrency"/]
    : [/"offers"[\s\S]{0,300}?"price"\s*:\s*"?([\d.]+)/, /"price"\s*:\s*"?([\d.]+)/];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return { state: "PRICED", price: +m[1] };
  }
  return { state: "UNPARSED" };
}

const rows = [];
let problems = 0;
for (const d of deals) {
  const r = await livePrice(d);
  let icon, note;
  if (r.state === "PRICED") {
    const diff = Math.abs(r.price - d.sale);
    if (diff <= 0.05) { icon = "✅"; note = `live $${r.price.toFixed(2)} matches`; }
    else { icon = "⚠️"; note = `live $${r.price.toFixed(2)} vs listed $${d.sale.toFixed(2)}`; problems++; }
  } else if (r.state === "GONE") { icon = "⚠️"; note = "product page gone (404)"; problems++; }
  else if (r.state === "BLOCKED") { icon = "⛔"; note = `blocked (${r.note || "network"}) — needs AI/manual check`; }
  else if (r.state === "UNPARSED") { icon = "⛔"; note = "page loaded but price not found — needs AI/manual check"; }
  else { icon = "⏭️"; note = r.note; }
  rows.push(`| ${icon} | ${d.id} | ${d.title.slice(0, 45)} | ${d.store} | $${d.sale.toFixed(2)} | ${note} |`);
}

console.log(`## Price check — ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} Central\n`);
console.log(`${deals.length} deals checked · **${problems} need attention** (⚠️) · ⛔ = store blocked the scripted check (not necessarily stale)\n`);
console.log("| | id | deal | store | listed | result |\n|---|---|---|---|---|---|");
rows.forEach((r) => console.log(r));

if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `problems=${problems}\n`);
