# Jude's Craft Deals

Curated crochet, yarn, and beading deals near Edmond, OK and online — built for Jude, from Connor. 💛

Originally built on ChatGPT Sites; migrated to a static Vite + React app hosted on GitHub Pages.

## Layout

| Path | What it is |
|---|---|
| `src/App.tsx` | The entire UI: hero, featured deals, searchable feed, garage sales, store directions, deal modal, wishlist. |
| `src/data/deals.ts` | **The only file the refresh automation edits.** All deal records, store info, image references, `meta.lastChecked`, and per-store `storeChecks` dates. |
| `src/globals.css` | All styling (dark-red theme, deal cards, modal, Chicken easter egg). |
| `public/products/` | Self-hosted product thumbnails, one per deal (`<id>.<ext>`). |
| `public/store-icons/` | Self-hosted store badge icons. |
| `scripts/validate-deals.mjs` | Build-time guard: fails on duplicate product URLs/ids or missing local images. |
| `scripts/download-images.mjs` | Downloads deal photos into `public/products/`; `--rewrite` points the data at the local copies. |
| `scripts/refresh.mjs` | **The free twice-daily refresh engine.** Re-checks Hobbii & Hobby Lobby, corrects/prunes deterministically, stamps per-store check dates, expires "New today", and surfaces new-deal candidates. Never throws; leaves Walmart/Michaels untouched. |
| `scripts/check-prices.mjs` | Read-only price/link report for ad-hoc manual runs. |
| `REFRESH_LOG.md` | Admin trail — what each refresh actually checked, corrected, removed, and surfaced (newest first, ~60 kept). |
| `.github/workflows/deploy.yml` | Builds and deploys to GitHub Pages on every push to `main` (free). |
| `.github/workflows/refresh.yml` | Twice daily (10:00/22:00 UTC ≈ 5 AM/5 PM Central, 1 h earlier in winter): runs `refresh.mjs`, commits verified data, redeploys, and keeps one `refresh`-labelled review issue with new-deal candidates + anything flagged. **No API keys, no cost.** |

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # validate + typecheck + production build into dist/
```

## Data rules (for humans and refresh bots)

- One deal per product URL — `npm run validate-deals` enforces this and the build fails on duplicates.
- Every deal's `image` points at a local file in `public/products/`; the original retailer URL stays in `sourceImage` as a fallback.
- `fresh: true` means "added today" — `refresh.mjs` clears it on the next calendar day, and the "New today" badge only shows while `verified` is today.
- `saleType`: `"limited"` for genuine limited-time/clearance discounts, `"everyday"` for perpetual sale prices (e.g. Hobby Lobby's standing "always 40% off"); omit when unknown.
- Update `meta.lastChecked` after every successful audit. Never display promises about the next run.

## Refresh model (free)

Retailers split into two groups. **Hobbii & Hobby Lobby** answer scripts, so `refresh.mjs` verifies them twice daily, corrects Hobbii prices from its product JSON, removes ended sales, and advances `storeChecks[store].lastChecked`. **Walmart & Michaels** block datacenter requests, so they're never fetched — their deals and dates stay frozen, and the deal modal + `REFRESH_LOG.md` honestly show how long it's been since a human checked them. If a scripted store starts failing, it's skipped and logged (its date stops advancing), never breaking the run; the build gates every commit so bad data can't reach the site. New-deal hunting runs free but only **surfaces** candidates in the `refresh` review issue — copy stays human-curated.
