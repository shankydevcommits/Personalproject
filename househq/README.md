# HouseHQ website

Real, working e-commerce site for HouseHQ's 104 Australian property
checklists: state/category catalogue, Stripe checkout, an email
verification gate before download, marketing-consent tracking with
one-click unsubscribe, contact form, and "notify me" signups.

This folder is self-contained and lives inside the same GitHub repo as an
unrelated cricket game (at the repo root) purely for convenience — the two
projects share nothing and deploy completely separately. See
`SETUP-GUIDE.md` for the full non-technical, step-by-step walkthrough of
getting this live.

## Stack

- **Next.js 16** (App Router, TypeScript) — pages + API routes in one app.
- **Supabase** (Postgres + private Storage) — orders, consent records,
  contact/notify submissions, and the 104 PDF files.
- **Stripe Checkout** — payment. Chosen over Payhip because the brief's
  verification-gate requirement (code emailed only after payment, download
  locked until verified) needs a webhook tied to our own database — Stripe's
  webhook makes that reliable and precise; Payhip doesn't expose an
  equivalent hook cleanly.
- **Resend** — verification codes, backup download links, marketing emails,
  contact form notifications.
- **Vercel** — hosting, deployed from this subfolder only.

## Folder layout

```
househq/
  app/                  Next.js pages + API routes
  components/           React components (Storefront, BuyModal, forms, etc.)
  lib/                  Server helpers: catalog, Supabase, Stripe, Resend, tokens
  data/products.json    All 104 products (13 per state, incl. the SMSF checklist) + 8 bundles (generated from the mockup)
  supabase/schema.sql   Database schema — run once in Supabase's SQL editor
  scripts/upload-pdfs.mjs  One-time script to upload the 104 PDFs to Supabase Storage
  private-content/      Source PDFs, legal markdown, checklist markdown (not public)
  design-reference/     The original approved mockup + build brief, kept as-is
```

## How the purchase flow actually works

1. Buyer clicks "Buy now" → modal collects email, phone, marketing consent
   (recorded separately per the Spam Act 2003) → creates an `orders` row and
   a Stripe Checkout Session, then redirects to Stripe's hosted payment page.
2. Stripe redirects back to `/verify?order=...` on success. Meanwhile
   Stripe's webhook (`/api/webhooks/stripe`) fires, marks the order paid,
   generates a 4-digit code + a magic-link token, and emails both via Resend.
3. The buyer enters the code (or lands via the magic link) on `/verify`.
   `/api/verify` checks it, marks the order verified, and generates a
   short-lived signed URL straight from Supabase's private Storage bucket —
   nothing is ever served from a public folder or a guessable URL.
4. A backup email with the same signed link(s) goes out for safety.

Bundles follow the same flow but generate 13 signed links (one per state
checklist) instead of one.

## SEO: a real page per checklist

The interactive `/` catalogue is a single page, which search engines can't
usefully index per-checklist. Alongside it, every checklist also gets its
own static, crawlable page:

- `/checklists` — index of all 8 states
- `/checklists/{state}` — hub page linking to that state's 13 checklists
- `/checklists/{state}/{slug}` — one page per checklist, with its own
  title/meta description, `Product` JSON-LD (price, currency, availability),
  a genuine content preview pulled straight from the source markdown in
  `private-content/source-markdown/` (first section shown in full, later
  sections shown as locked titles), and a buy button reusing the same
  checkout flow as the main catalogue.

`app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and
`/robots.txt` automatically from the product catalogue — nothing to
maintain by hand when products change.

## Local development

```
npm install
cp .env.example .env.local   # fill in the values, see SETUP-GUIDE.md
npm run dev
```

## Deployment

Deployed on Vercel with **Root Directory set to `househq`**, from this same
GitHub repo. This is the key setting that keeps the game (at the repo root)
completely untouched — see `SETUP-GUIDE.md`.

## A note on dependency security warnings

`npm audit` currently flags some transitive `postcss`/`sharp` advisories
that ship inside Next.js's own build tooling — there's no newer Next 16.x
release yet that clears them, and the "fix" npm suggests is a downgrade to
a years-old Next version, which is not actually safe. Worth rerunning
`npm audit` every so often and upgrading `next` when a clean release lands.
