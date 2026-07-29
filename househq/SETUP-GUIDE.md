# HouseHQ — Setup Guide (no coding required)

This walks you through everything between "the code exists" and "the site
is live and taking real payments." Every step below is done by clicking
around on websites — nothing here requires writing code. Where a terminal
command is genuinely the easiest path, you can hand it straight back to
Claude Code to run for you instead of typing it yourself.

Total new accounts you'll create: **Supabase, Stripe, Resend, Vercel.**
All four have free tiers that comfortably cover this site at launch scale.

---

## Part 1 — Understanding what Claude Code just did in GitHub

You don't need to touch git or a terminal for any of this part — just the
github.com website.

1. Go to **github.com** and open your repository
   (`shankydevcommits/personalproject`).
2. Click the **branches** dropdown (top-left of the file list, usually
   says "main"). You'll see a branch called
   **`claude/website-project-setup-4m6mcu`** — that's where all of this
   website's code was committed and pushed to. Your existing cricket game
   lives untouched at the root of `main`; the entire website is inside one
   new folder, `househq/`, so the two never overlap.
3. To bring the website into your main branch, you open a **Pull Request**
   (GitHub's term for "here's a proposed change, review it, then merge
   it"). Two ways to do that:
   - Ask Claude Code, in this same chat, to "open a pull request for this"
     — it'll create it for you with a description of everything that was
     built.
   - Or do it yourself: on GitHub, click **"Compare & pull request"**
     (GitHub shows this banner automatically after a branch is pushed), 
     leave base = `main` and compare = `claude/website-project-setup-4m6mcu`,
     click **Create pull request**, then **Merge pull request** once
     you're happy.
4. Merging is safe here — every new file lives inside `househq/`, so it
   can't break your game's `index.html` at the repo root.

From here on, whenever you want more changes, just describe them to Claude
Code in chat. It'll commit and push automatically; you only need GitHub to
review/merge if you want a checkpoint before it goes live.

---

## Part 2 — Set up Supabase (the database + private file storage)

1. Go to **supabase.com** → sign up (free) → **New project**.
2. Pick any project name (e.g. "househq"), a strong database password
   (save it somewhere), and a region close to Australia (e.g. Sydney).
3. Once it's created, go to **Project Settings → API**. You'll need two
   values later:
   - **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (under "Project API keys", NOT the "anon" key)
     → this is `SUPABASE_SERVICE_ROLE_KEY`. Keep this one secret — never
     put it in a public place, only in Vercel's environment variables
     (Part 5).
4. Go to the **SQL Editor** (left sidebar) → **New query**. Open
   `househq/supabase/schema.sql` from the repo, copy its entire contents,
   paste into the SQL editor, and click **Run**. This creates the tables
   the site needs (orders, consent records, contact messages, notify
   signups). It's safe to run more than once if you're unsure whether it
   worked.
5. You do **not** need to manually create the storage bucket — the upload
   script in Part 6 creates it automatically the first time it runs.

---

## Part 3 — Set up Stripe (payments)

1. Go to **stripe.com** → sign up (free to create, no monthly fee — Stripe
   takes a percentage per transaction, roughly 1.75% + 30c for Australian
   cards).
2. You'll start in **Test mode** (a toggle top-right of the dashboard) —
   perfect for trying the whole flow with fake card numbers before going
   live. Leave it in test mode for now.
3. Go to **Developers → API keys**. Copy the **Secret key** (starts with
   `sk_test_...`) → this is `STRIPE_SECRET_KEY`.
4. You'll set up the **webhook** after the site is deployed to Vercel in
   Part 5, because Stripe needs a real URL to send events to. Come back to
   this step then — instructions are in Part 5.
5. Later, when you're ready to accept real payments: flip the toggle to
   **Live mode**, complete Stripe's business verification (ABN, bank
   account), and swap the test keys for live keys (`sk_live_...`) in
   Vercel.

---

## Part 4 — Set up Resend (sending emails)

1. Go to **resend.com** → sign up (free tier: 3,000 emails/month, plenty
   at launch).
2. Go to **Domains → Add Domain** and add the domain you'll send from
   (e.g. `househq.com.au`). Resend gives you 3–4 DNS records (TXT/MX) to
   add — this part happens wherever you bought the domain (e.g. GoDaddy,
   Namecheap, Cloudflare). If you don't have a domain yet, you can still
   test everything using Resend's own sandbox sending, just know real
   customers won't receive email until a domain is verified.
3. Go to **API Keys → Create API Key** → copy it → this is
   `RESEND_API_KEY`.
4. Decide the "from" address you want customers to see, e.g.
   `orders@yourdomain.com.au` → this is `EMAIL_FROM` (format exactly like
   `"HouseHQ <orders@yourdomain.com.au>"`, quotes included).
5. Decide which inbox should receive Contact Us form submissions → that's
   `CONTACT_NOTIFY_EMAIL`.

---

## Part 5 — Deploy to Vercel

1. Go to **vercel.com** → sign up with your GitHub account (this is what
   lets Vercel deploy straight from your repo).
2. Click **Add New → Project**, select your `personalproject` repository.
3. **This is the one setting that keeps the game and the website
   separate:** in the import screen, click **Edit** next to "Root
   Directory" and set it to `househq`. Framework preset should
   auto-detect as **Next.js**.
4. Before clicking Deploy, expand **Environment Variables** and add every
   variable from `househq/.env.example`:

   | Variable | Where it comes from |
   |---|---|
   | `SITE_URL` | Leave blank for now — Vercel gives you a URL after the first deploy (e.g. `https://househq.vercel.app`); come back and set this, then redeploy. |
   | `NEXT_PUBLIC_SUPABASE_URL` | Part 2 |
   | `SUPABASE_SERVICE_ROLE_KEY` | Part 2 |
   | `SUPABASE_STORAGE_BUCKET` | `checklists` |
   | `STRIPE_SECRET_KEY` | Part 3 |
   | `STRIPE_WEBHOOK_SECRET` | See step 6 below |
   | `RESEND_API_KEY` | Part 4 |
   | `EMAIL_FROM` | Part 4 |
   | `CONTACT_NOTIFY_EMAIL` | Part 4 |
   | `UNSUBSCRIBE_SECRET` | Any long random string — see below |

   For `UNSUBSCRIBE_SECRET`, ask Claude Code to generate one for you
   (it's just a random password used internally, you'll never need to
   remember it), or generate it yourself at
   https://1password.com/password-generator (32+ characters).

5. Click **Deploy**. After a minute or two you'll get a live URL. Copy it,
   go back into **Project Settings → Environment Variables**, set
   `SITE_URL` to that exact URL (no trailing slash), and click
   **Redeploy** on the latest deployment so it picks up the change.

6. **Now set up the Stripe webhook** (back in Stripe):
   - Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
   - Endpoint URL: `https://<your-vercel-url>/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Click **Add endpoint**, then reveal and copy the **Signing secret**
     (starts with `whsec_...`) → paste this into Vercel as
     `STRIPE_WEBHOOK_SECRET`, then redeploy once more.

---

## Part 6 — Upload the 96 PDFs to Supabase

The actual checklist PDFs live in `househq/private-content/pdfs/` in the
repo (they're already there, committed alongside the code — nothing to
upload from your own computer). They need to be pushed into Supabase's
private storage once.

**Easiest option:** ask Claude Code, in this chat, to "run the PDF upload
script" — hand it your Supabase Project URL and service role key (or
confirm they're already in `.env.local`), and it'll run
`npm run upload-pdfs` for you and report back the result.

**Doing it yourself:** if you'd rather run it yourself, you'd need Node.js
installed locally, then:
```
cd househq
cp .env.example .env.local   # fill in NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
npm install
npm run upload-pdfs
```
This creates a private `checklists` bucket in Supabase (if it doesn't
already exist) and uploads all 96 files into it, organised by state. It's
safe to re-run — it overwrites files with the same name rather than
duplicating them.

---

## Part 7 — Test the whole flow before going live

With Stripe still in **test mode**:

1. Visit your live Vercel URL, click "Buy now" on any checklist.
2. Fill in your own email + a fake mobile number, continue to payment.
3. On Stripe's test checkout page, use the card number `4242 4242 4242
   4242`, any future expiry date, any 3-digit CVC, any postcode.
4. You should land back on `/verify` and get an email within a few
   seconds with a 4-digit code. Enter it (or just click the magic link in
   the email) and confirm the PDF downloads.
5. Check the **Contact Us** form and one of the **Notify me** boxes too —
   both should show a success message and (for Contact) land in your
   `CONTACT_NOTIFY_EMAIL` inbox.
6. In Supabase, open **Table Editor → orders** and confirm a row exists
   with `status = verified`.

## Part 8 — Going live for real

1. In Stripe, switch to **Live mode**, finish the business verification
   (ABN etc.), grab the live secret key (`sk_live_...`) and set up a
   **second** webhook endpoint pointed at the same URL, using the live
   signing secret. Update `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`
   in Vercel to the live values, redeploy.
2. Get the three documents in `househq/private-content/legal/` reviewed
   by a solicitor and the bracketed placeholders (dates, ABN, contact
   email) filled in — they render live at `/legal/privacy`, `/legal/terms`
   and `/legal/refund`, and each page shows a "draft document" banner
   until you do this. This is a genuine legal step, not something Claude
   Code should do on your behalf.
3. Optional: add a custom domain in Vercel → Project → Settings →
   Domains, then update `SITE_URL` to match and redeploy.

---

## Where to get help mid-setup

If any step above throws an error, paste exactly what you see back into
this chat with Claude Code — screenshots work fine — and it can tell you
what went wrong and what to do next.
