# Jude's Craft Deals

Curated crochet, yarn, and beading deals near Edmond, OK and online — built for Jude, from Connor. 💛

Originally built on ChatGPT Sites; migrated to a static Vite + React app hosted on GitHub Pages.

## Layout

| Path | What it is |
|---|---|
| `src/App.tsx` | The entire UI: hero, featured deals, searchable feed, garage sales, store directions, deal modal, wishlist. |
| `src/data/deals.ts` | **The only file the refresh automation edits.** All deal records, store info, image references, and `meta.lastChecked`. |
| `src/globals.css` | All styling (dark-red theme, deal cards, modal, Chicken easter egg). |
| `public/products/` | Self-hosted product thumbnails, one per deal (`<id>.<ext>`). |
| `public/store-icons/` | Self-hosted store badge icons. |
| `scripts/validate-deals.mjs` | Build-time guard: fails on duplicate product URLs/ids or missing local images. |
| `scripts/download-images.mjs` | Downloads deal photos into `public/products/`; `--rewrite` points the data at the local copies. |
| `scripts/check-prices.mjs` | Deterministic price/link checker (Hobbii/Hobby Lobby/Walmart; Michaels blocks bots). Read-only, never fails the run. |
| `.github/workflows/deploy.yml` | Builds and deploys to GitHub Pages on every push to `main`. |
| `.github/workflows/price-check.yml` | Twice daily (10:00/22:00 UTC ≈ 5 AM/5 PM Central, 1 h earlier in winter): runs the checker, files/updates a `price-check` issue when deals drift. |
| `.github/workflows/ai-refresh.yml` | Mon/Wed/Fri full AI audit via Claude Code: verifies all deals, prunes, hunts new ones, self-hosts images, commits, redeploys. Needs `ANTHROPIC_API_KEY` **or** `CLAUDE_CODE_OAUTH_TOKEN` repo secret. |

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # validate + typecheck + production build into dist/
```

## Data rules (for humans and refresh bots)

- One deal per product URL — `npm run validate-deals` enforces this and the build fails on duplicates.
- Every deal's `image` points at a local file in `public/products/`; the original retailer URL stays in `sourceImage` as a fallback.
- `fresh: true` means "added today" — clear it on the next calendar day's first refresh.
- `saleType`: `"limited"` for genuine limited-time/clearance discounts, `"everyday"` for perpetual sale prices (e.g. Hobby Lobby's standing 50% off); omit when unknown.
- Update `meta.lastChecked` after every successful audit. Never display promises about the next run.
