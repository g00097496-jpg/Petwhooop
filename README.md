# PetWhoop — launch site and waitlist

Next.js 15 (App Router) · TypeScript · Tailwind · framer-motion · Supabase (database + Auth) · Resend + React Email · Cloudflare Turnstile · Vercel.

> **Status honesty.** The code builds, typechecks and its unit tests pass, and the page renders correctly. The live integrations (Supabase, Resend, Turnstile, admin sign-in, Vercel, custom domain) have **not been verified end to end**, because they need your accounts and keys. Follow the steps and the checklist below to verify them.

## What is in the repo
- `src/app/page.tsx` — the single-page site (sections in `src/components`).
- `src/app/api/waitlist/route.ts` — signup endpoint (origin check, honeypot, rate limit, Turnstile, validation, insert, emails after response).
- `src/lib/email.tsx` + `src/emails/*` — welcome and owner-notification emails.
- `src/app/verify`, `src/app/unsubscribe`, `src/app/api/unsubscribe` — double opt-in, unsubscribe, delete-my-data, one-click unsubscribe.
- `src/app/admin` — private dashboard (Supabase Auth + `admins` allowlist), CSV export, retry, remove.
- `supabase/migrations/0001_waitlist.sql` — schema, RLS, suppression list, campaign tables.
- `docs/IMAGE_PROMPTS.md` — how to swap in real renders.

## Setup
1. `npm install`
2. **Supabase:** create a project. In the SQL editor run `supabase/migrations/0001_waitlist.sql`. Copy the project URL, anon key and service-role key (Settings → API).
3. **Admin user:** Authentication → Users → add your user (email + password). Then run in SQL: `insert into public.admins (user_id) select id from auth.users where email = 'YOUR_ADMIN_EMAIL';` The owner notification address does **not** grant admin access; only rows in `admins` do.
4. **Resend:** create an API key. Add and verify your sending domain (DNS records: SPF, DKIM). Set `EMAIL_FROM` to an address on that domain, e.g. `PetWhoop <hello@yourdomain.com>`. Without a verified domain Resend only sends to your own account email.
5. **Turnstile:** Cloudflare dashboard → Turnstile → add the site (your domain and `localhost`). Copy site key and secret.
6. Copy `.env.example` to `.env.local` and fill every value. Generate secrets with `openssl rand -hex 32` for `TOKEN_SECRET` and `IP_HASH_SALT`. Never commit `.env.local`.
7. `npm run dev`, open http://localhost:3000.
8. **Deploy:** push to GitHub, import in Vercel, add the same variables (Production), deploy. Set `NEXT_PUBLIC_SITE_URL` to the final https URL; links in emails use it.
9. **Custom domain:** Vercel → Domains → add, set the DNS records it shows, then update `NEXT_PUBLIC_SITE_URL` and redeploy.
10. Run the testing checklist below on the live URL.

Signup is deliberately refused (HTTP 503) in production until Supabase and Turnstile are configured.

## Free-plan limits (checked November 2026 — re-check before relying on them)
- **Resend Free:** 3,000 emails/month and 100/day; sending pauses at the limit. Each signup sends 2 emails (welcome + owner notice), so about 50 signups/day at most.
- **Supabase Free:** 500 MB database, 2 active projects, and **projects pause after 1 week of inactivity** — a quiet waitlist can pause, and signups would then fail. Visit the project regularly or use Pro ($25/mo).
- **Vercel / Turnstile:** limits not re-verified here. Check Vercel's current terms on commercial use of the Hobby plan and Turnstile's free-tier limits.

## Testing checklist
- [ ] Page loads on desktop and phone; nav links and mobile menu work; no console errors.
- [ ] Submit a new email → success message; row appears in Supabase with `marketing_consent=false` when box unticked.
- [ ] Tick the box → `consent_timestamp`, `consent_text_version`, `consent_source` populated.
- [ ] Submit the same email again → same success message, no second row, no second email.
- [ ] Double-click the button → one row only.
- [ ] Welcome email arrives (check spam), renders, verify link works, row becomes `verified`.
- [ ] Verify link reused or after 7 days → graceful message.
- [ ] Owner notification arrives at the owner address, with no secrets in it.
- [ ] Unsubscribe link works; one-click unsubscribe works from a mail client; suppression row created.
- [ ] Delete-my-data removes the row.
- [ ] 6+ rapid submissions from one IP → rate limited.
- [ ] Fill the hidden honeypot via devtools → no row created.
- [ ] `/admin` redirects to login when signed out; a signed-in user not in `admins` is refused; admin sees list, search, filters, totals, trend; CSV downloads; retry and remove work.
- [ ] Break `RESEND_API_KEY` temporarily → signup still succeeds, row shows email `failed`, admin retry sends once fixed.
- [ ] Open Graph preview (share the URL in a chat app) shows `og.png`.
- [ ] Reduced motion: enable "reduce motion" in the OS; animations stop.

## Marketing emails
Nothing sends marketing automatically and there is no mass-send endpoint. Tables `campaigns` and `campaign_recipients` and the view `marketing_eligible` (consented, verified, not unsubscribed, not suppressed) exist so a campaign can be prepared; any send must be built and approved by you explicitly.

## Decisions and legal items for human review
- **Privacy Policy** (`/privacy`) is a draft with placeholders. Have it reviewed against UAE data-protection law (PDPL, Federal Decree-Law 45 of 2021) and any other jurisdictions your visitors are in. Decide retention period, data-transfer wording (Supabase, Resend, Vercel, Cloudflare may process outside the UAE) and a privacy contact.
- **Consent wording** (`CONSENT_TEXT` in `src/lib/validate.ts`) is versioned; bump `CONSENT_TEXT_VERSION` when you change it.
- **Welcome email for non-opt-in people** says no newsletters will be sent. Decide whether a single "early access is open" message is acceptable, with counsel.
- No certifications, vet endorsements, medical claims, battery-life claims, testimonials, availability or waitlist counts are made anywhere. The Vision section separates the prototype's demonstrated capabilities from planned ones; keep that if you edit it.
- Concept art is labelled as such.

## Not yet verified
Supabase migration run, Resend delivery and domain verification, Turnstile, admin sign-in, Vercel deployment, custom domain, real-device email rendering.
