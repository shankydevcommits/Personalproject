# HouseHQ — Build Brief for Claude Code

## What this is
HouseHQ sells Australian property checklists (buying, renting, investing, selling) as branded, watermarked PDFs, for $7.99–$9.99 each (bundle $89.99), across all 8 states/territories. This folder contains a finished design mockup and all 104 products (96 core state checklists + 8 SMSF checklists) — the job now is to turn it into a real, working website.

## What's in this folder
```
/website/index.html        — Full design mockup (HTML/CSS/JS, single file, no framework).
                              This IS the visual design to build from — don't restyle it,
                              wire it up to real functionality. Basic SEO meta tags and
                              JSON-LD are already in the <head> as a starting point (see
                              SEO section below for why this isn't enough on its own).
/pdfs/{state}/*.pdf         — 104 branded, watermarked checklist PDFs (13 per state),
                              ready to sell as-is.
/source-markdown/*.md       — Original markdown source for every checklist.
/legal/*.md                 — Privacy Policy, Terms & Conditions, Refund Policy
                              (drafted, need a solicitor review before going live —
                              bracketed placeholders like [insert date] need filling in).
```

## Current site features (already built in the mockup, replicate the behaviour)
- **Unified per-state product grid**: each state has ONE grid containing all 13 checklists (not four separate grids), with category filtering done by hiding/showing individual cards via `data-category`. This is what makes the "All" view lay out as a continuous 3-per-row grid instead of broken chunks — keep this architecture, don't revert to per-category grids.
- **SMSF checklist is pinned first** in every state's list (gold star badge, sits above the title in normal flow, not absolutely positioned — this was a deliberate fix after the badge kept colliding with the checkmark icon).
- **Stage picker ("Find your stage")** and **state picker ("Choose your state")** are both clickable block grids (not pills/tabs), 3-per-row, defaulting to "All" and "VIC" respectively. Both call `switchTab()` / `switchState()` which trigger a shared `render()` function — call `render()` once on page load too, or the defaults won't actually display correctly (this was a real bug we hit and fixed).
- **Scrolling ticker banner** at the very top (above the nav) calling out the SMSF LRBA changes — swap this out for whatever the current "hot topic" is as things change.
- **Email-verification-gated download modal**: email + phone captured, only email gets a one-time code, phone is NOT OTP-verified (deliberate scope decision, see below).
- **Thank-you messages**: every "Notify me" and the Contact form swap to a confirmation message on submit (currently client-side only — needs a real backend to actually do anything with the submission).
- **Pricing**: individual checklists are $7.99 or $9.99, the full-state bundle is $89.99 (shown against a "$119.87" struck-through reference price, which is the real sum of all 13 items — keep this honest if prices change, don't hardcode a fake "was" price).

## What needs to actually be built

### 1. Real e-commerce / checkout
The mockup's "Buy now" buttons currently just open a UI modal with no backend. Need:
- A real payment flow. Recommend starting simple: **Payhip** (free plan, ~5%+processing per sale) embedded via their API/checkout, or **Stripe Checkout** if more control is wanted later.
- 104 products need to exist somewhere as sellable SKUs — either in Payhip's dashboard, or in your own product database if going the Stripe route.
- Bundle pricing ($89.99 per state) needs real logic — not just a static banner.

### 2. Email verification gate (this is the core requirement, not optional)
Per the founder's spec: **email + phone number are both captured at checkout, but only the email is verified before the download unlocks.** The mockup UI shows the intended flow (Step 1: capture email/phone → Step 2: enter 4-digit code sent to email → Step 3: unlock download). To make this real:
- Generate a one-time code (or magic link — arguably better UX) on purchase, email it via a transactional provider (Postmark, Resend, or SES are all solid, cheap options).
- Store pending verification state (email, phone, product purchased, code/token, expiry) — a lightweight DB (Postgres/SQLite via Supabase, or even a simple KV store) is enough at this scale.
- Only serve the actual PDF file/download link once the code is confirmed.
- Phone number should be stored but does NOT need OTP/SMS verification — that's an explicit scope decision to keep costs near zero (SMS OTP costs ~$0.05–0.10/verification via Twilio and needs its own infra; not worth it at this stage).

### 3. Consent and compliance (build this in from day one, don't retrofit)
- Marketing email consent (the checkbox in the modal) must be captured **separately** from the transactional "send me my purchase" flow — this is a Spam Act 2003 (Cth) requirement, not just a nice-to-have. Store consent with a timestamp.
- Every marketing email needs a working, one-click unsubscribe.
- Privacy Policy, Terms, and Refund Policy (in `/legal`) need real URLs and should be linked from every checkout/consent point, not just the footer.

### 4. State + category catalogue logic
Already built and working in the mockup's JS (`switchState()`, `switchTab()`, unified grid with `data-category` filtering). If rebuilding with a framework, replicate this exact behaviour rather than reinventing it.

### 5. Content pages still needed
- The Contact Us form needs a real submit handler (email it somewhere, or store as a lead) — currently just shows a client-side thank-you message with nothing behind it.
- "Notify me" forms need to actually capture emails somewhere (even just appending to a mailing list is fine for now) — same situation, currently cosmetic only.
- About, FAQ, and Disclaimer sections are done and just need to carry over as-is.

### 6. PDF delivery
- The 104 PDFs in `/pdfs/{state}/` are the actual sellable files, branded with a HouseHQ masthead and a light diagonal watermark on every page (basic anti-piracy deterrent, not DRM).
- Serve these from private storage (e.g. an S3/R2 bucket with signed, expiring URLs) rather than a public folder.

### 7. SEO — this is the single biggest gap between the mockup and a real, findable website
**Read this section carefully before building — it changes the site's technical architecture, not just its content.**

The mockup is a single-page app: one URL, one `<title>`, content shown/hidden with JavaScript. That's fine for a demo, but it is close to invisible to Google for the thing that actually matters: someone searching "first home buyer checklist Victoria" or "SMSF property rules 2026." A few basic meta tags and one JSON-LD block have been added to the `<head>` as a starting point, but **they don't fix the core problem**, which is that all 104 checklists currently share a single URL and a single page title.

To actually rank, this needs to become a **multi-page site with one real URL per checklist**, e.g.:
```
/checklists/vic/first-home-buyer-90-day-checklist
/checklists/nsw/end-of-lease-bond-back-checklist
/checklists/investors/buying-property-through-your-smsf-vic
```
Each of those pages needs:
- Its own `<title>` and meta description (e.g. "VIC First Home Buyer Checklist — Grants, Stamp Duty & Cooling-Off | HouseHQ")
- A genuine content preview on the page itself (not just a "buy now" button) — Google needs to see real text to rank it, so show the checklist's section headers and maybe the first section's items in full, with the rest behind the purchase/email-gate
- Its own `Product` schema (JSON-LD) with price, currency (AUD), and availability
- Internal links from the relevant category and state pages (e.g. the VIC state page links to all 13 VIC checklists)

Practical build note: if using Astro or Next.js (see suggested stack below), this is a natural fit — generate a static page per checklist at build time from the markdown source files in `/source-markdown/`, so content and SEO pages stay in sync automatically rather than being maintained twice.

Also needed:
- **`sitemap.xml`** listing every checklist URL, submitted to Google Search Console once live.
- **`robots.txt`** allowing crawling of checklist pages (don't accidentally block them).
- **Fast page load** — the current mockup loads Google Fonts render-blocking and has a lot of inline SVG; keep an eye on Core Web Vitals once this is a real multi-page site, since page speed is a ranking factor.
- **Alt text** on any images/icons that carry meaning (the current SVG icons are mostly decorative, so this matters less here, but don't skip it if real photography gets added later).

## Suggested stack (opinionated, not mandatory)
Given the scale (104 products, no complex logic beyond checkout + email-gate + now per-page SEO), this doesn't need to be heavy:
- **Frontend:** Astro is a particularly strong fit given the SEO requirement above — it generates real static HTML per page (great for search) while still supporting the interactive bits (checkout modal, filtering) as isolated components. SvelteKit or Next.js (static export) are reasonable alternatives if the team has a preference.
- **Backend/DB:** Supabase (Postgres + auth + storage) covers product storage, verification tokens, consent records, and file storage in one place with minimal setup.
- **Payments:** Payhip to start (near-zero setup cost), Stripe later if the business outgrows it.
- **Email:** Resend or Postmark for the verification code + transactional emails.
- **Hosting:** Vercel or Netlify — free tier covers this comfortably at launch scale, and both handle static-site SEO well out of the box (auto sitemaps, fast edge delivery).

## Things NOT to change
- The visual design (colors, fonts — Fraunces/Inter/IBM Plex Mono, the stamp/document motif, the roof+checklist logo) is deliberate and already approved. Rebuild the *functionality*, keep the *look*.
- Checklist content itself hasn't been proofread line-by-line yet — flag anything that looks wrong rather than silently "fixing" facts, since these are fact-checked against government sources and a wrong edit here is a legal-accuracy problem, not a copy problem.
