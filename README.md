# CAPRAVA — online store

The website and e‑commerce store for **CAPRAVA**, a premium fragrance house from Kosovo.
Built with Next.js 15 (App Router) and TypeScript, in Albanian (`/sq`, default) and English (`/en`).

## What's included

- **Home** — brand quote, hero, the two launch fragrances (Souverian & Tittara), the three pillars, the full 8‑fragrance collection, the ingredient DNA, the 15 ML / 75 ML formats and newsletter sign‑up.
- **Shop** — filter by *for her* / *for him*, available fragrances and the upcoming collection.
- **Product pages** — size selector (15 ML 28 € · 75 ML 149 €), add to bag, olfactory pyramid, product structured data for Google. Upcoming fragrances show a "notify me" form instead.
- **Bag** — slide‑out drawer and a full cart page, saved in the browser, with a free‑shipping progress bar.
- **Checkout** — contact and delivery form, shipping by country (Kosovo, Albania, North Macedonia, Montenegro), **cash on delivery**, and **card payment through Stripe** when it's configured. Prices are always recalculated on the server.
- **Story**, **Partnerships** (retail partners, distributors, creators/ambassadors, investors — with an enquiry form), **Contact**, and draft **Terms / Privacy / Shipping & returns** pages.
- Sitemap, robots.txt, per‑page SEO metadata, language switcher that remembers the choice.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run build && npm start` runs the production build. `npm run typecheck` checks types.

## Put it online (Vercel, free tier)

1. Go to <https://vercel.com/new> and sign in with GitHub.
2. Import the `ariongj/caprava` repository (pick the branch you want live). Vercel detects Next.js; keep the defaults.
3. Add the environment variables below under **Settings → Environment Variables** (at least `NEXT_PUBLIC_SITE_URL`), then **Deploy**.
4. To use your own domain (e.g. `caprava.com`), add it under **Settings → Domains** and follow the DNS instructions.

Any host that runs Node.js works as well (Netlify, Render, a VPS with `npm run build && npm start`).

## Shareable preview

`preview/index.html` is a single-file preview of the store that opens in any browser without a server (double-click it, or host it anywhere static). Shopping, the bag and checkout are clickable, but orders and forms are not sent — a bar at the bottom says so.

Regenerate it after changing the site: run the store (`npm run build && npm start`), then `npm run preview` (or `node scripts/preview/build.mjs http://localhost:3000`).

## Bottle cut-outs

`public/products/cutout/*.webp` are the bottle photos with their studio backdrop removed; the site uses them everywhere and for the spraying-bottle animation. To redo them from new photos (`public/products/<slug>.jpg`), with `numpy`, `pillow` and `scipy` installed:

```bash
python scripts/cutouts/1-masks.py public/products /tmp/masks
python scripts/cutouts/2-silhouette.py public/products /tmp/masks public/products/cutout
```

## Configuration

Copy `.env.example` to `.env.local` for local work. All values are optional except the site URL in production.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for SEO tags, the sitemap and Stripe redirects. |
| `STRIPE_SECRET_KEY` | Turns on card payments (Stripe Checkout). Without it only cash on delivery is offered. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret of a Stripe webhook pointing at `/api/stripe/webhook` (event `checkout.session.completed`), so paid orders are sent to you. |
| `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM` | Email every order and form submission to the team (via [Resend](https://resend.com)) and send the customer an order confirmation. |
| `NOTIFY_WEBHOOK_URL` | Also POST every order/submission as JSON to any URL (Zapier, Make, Slack, a Google Sheet script…). |

Orders and messages are always written to the server log as well, so nothing is lost before email is set up — but **set up email or the webhook before taking real orders**.

## Where to edit things

| What | File |
| --- | --- |
| Prices, sizes, shipping countries and costs, free‑shipping threshold, contact email, socials, pre‑order mode | `lib/config.ts` |
| Fragrances (names, colours, descriptions, notes, availability) | `lib/products.ts` |
| All site text in Albanian and English | `lib/i18n.ts` |
| Terms, privacy, shipping & returns | `lib/legal.ts` |
| Styles | `app/globals.css` |
| Bottle illustration (replace with product photos when ready) | `components/Bottle.tsx` |

To launch a new fragrance: set `available: true` (and `named: true` with its final name) in `lib/products.ts`.

## Before launch — to confirm

- Contact email, phone, Instagram/TikTok handles (`lib/config.ts`).
- Shipping prices per country and delivery times.
- The note pyramids for Souverian and Tittara are drafts built from the CAPRAVA ingredient palette — replace with the chemist's final formulas.
- The legal pages are drafts (marked on the page) — have them reviewed and add the company's legal name and business number.
- Product photography to replace the illustrated bottles.
