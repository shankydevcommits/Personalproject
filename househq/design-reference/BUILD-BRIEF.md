# HouseHQ — Build Brief for Claude Code

## What this is
HouseHQ sells Australian property checklists (buying, renting, investing, selling) as branded, watermarked PDFs, for under $10 each, across all 8 states/territories. This folder contains a finished design mockup and all 96 products — the job now is to turn it into a real, working website.

## What's in this folder
```
/website/index.html        — Full design mockup (HTML/CSS/JS, single file, no framework).
                              This IS the visual design to build from — don't restyle it,
                              wire it up to real functionality.
/pdfs/{state}/*.pdf         — 96 branded, watermarked checklist PDFs (12 per state),
                              ready to sell as-is.
/source-markdown/*.md       — Original markdown source for every checklist (useful if
                              content ever needs editing/regenerating).
/legal/*.md                 — Privacy Policy, Terms & Conditions, Refund Policy
                              (drafted, need a solicitor review before going live —
                              bracketed placeholders like [insert date] need filling in).
```

## What needs to actually be built

### 1. Real e-commerce / checkout
The mockup's "Buy now" buttons currently just open a UI modal with no backend. Need:
- A real payment flow. Recommend starting simple: **Payhip** (free plan, ~5%+processing per sale) embedded via their API/checkout, or **Stripe Checkout** if more control is wanted later.
- 96 products need to exist somewhere as sellable SKUs — either in Payhip's dashboard, or in your own product database if going the Stripe route.
- Bundle pricing (the "$69 for all 12" bundle shown per state) needs real logic — not just a static banner.

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
The mockup already has working client-side JS for this (`switchState()`, `switchTab()`, the "All" tab that shows all 12 at once). If rebuilding with a framework, replicate this exact behaviour — state selector × category tabs, both independently switchable, with the section heading, bundle title, and "3 checklists · [STATE]" labels all updating reactively.

### 5. Content pages still needed
- The Contact Us form needs a real submit handler (email it somewhere, or store as a lead).
- "Notify me" forms in the Coming Soon cards need to actually capture emails somewhere (even just appending to a mailing list is fine for now).
- About, FAQ, and Disclaimer sections are done and just need to carry over as-is (already real content, not placeholders).

### 6. PDF delivery
- The 96 PDFs in `/pdfs/{state}/` are the actual sellable files — branded with a HouseHQ masthead and a light diagonal "HouseHQ · [STATE] · Licensed Copy" watermark on every page (for basic anti-piracy — this is a deterrent, not DRM, so don't over-invest in making it bulletproof).
- Serve these from private storage (e.g. an S3/R2 bucket with signed, expiring URLs) rather than a public folder — don't let people guess a URL and skip the verification step entirely.

## Suggested stack (opinionated, not mandatory)
Given the scale (96 products, no complex logic beyond checkout + email-gate), this doesn't need to be heavy:
- **Frontend:** keep it close to the existing mockup — a lightweight framework (Astro, SvelteKit, or even Next.js if you want React) rather than a full SPA, since this is mostly content pages.
- **Backend/DB:** Supabase (Postgres + auth + storage) covers product storage, verification tokens, consent records, and file storage in one place with minimal setup.
- **Payments:** Payhip to start (near-zero setup cost, matches the "under $10/month tooling" constraint from earlier scoping), Stripe later if the business outgrows it.
- **Email:** Resend or Postmark for the verification code + transactional emails.
- **Hosting:** Vercel or Netlify — free tier covers this comfortably at launch scale.

## Things NOT to change
- The visual design (colors, fonts — Fraunces/Inter/IBM Plex Mono, the stamp/document motif) is deliberate and already approved. Rebuild the *functionality*, keep the *look*.
- Checklist content itself hasn't been proofread line-by-line yet — flag anything that looks wrong rather than silently "fixing" facts, since these are fact-checked against government sources and a wrong edit here is a legal-accuracy problem, not a copy problem.
