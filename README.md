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
| `.github/workflows/deploy.yml` | Builds and deploys to GitHub Pages on every push to `main`. |

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
