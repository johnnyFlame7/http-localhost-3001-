# KBRANDMUSIC — Owner's Guide

This is the KBRANDMUSIC store codebase, configured for
`https://kbrandmusisc.com`. You retain ownership of the hosting, domain,
database, payment, and authentication accounts. The code is not live on
the domain until you deploy it and configure DNS and production credentials.

## What's already built (no further coding needed)
- Public storefront — home, shop with filters, product pages, cart,
  checkout — all reading live from your database, responsive on
  phone/tablet/desktop
- Real Stripe Checkout + webhook — successful payments automatically
  create/update paid orders in your database (not a fake/demo checkout)
- Secure Owner login via **Supabase Auth** (email + password) — no
  password is hard-coded anywhere in the code; only the one email address
  you set as `ADMIN_EMAIL` can reach `/admin`, checked on the server on
  every request
- Full admin dashboard: add/edit/delete products, change prices, sizes,
  stock, categories, new/featured flags, product images; edit logo, hero,
  about, story, promo, contact, shipping/returns text
- Product and site images upload straight to **Supabase Storage** from the
  dashboard and are served as real hosted URLs (not base64 blobs)
- Orders tab: customer info, items, quantities, totals, and a status
  dropdown (Pending → Paid → Processing → Shipped → Delivered / Cancelled)
  that saves to the real database instantly
- JSON export/import backup of your products and settings
- Legal and business page templates require your verified business details,
  shipping/returns rules, and jurisdiction-specific review before launch

## What YOU still need to do (all beginner steps below)
- Create your Supabase, Stripe, GitHub, Vercel, and domain accounts
- Paste your own keys into environment variables
- Fill in your real legal/business details
- Deploy and connect your domain

---

## STEP-BY-STEP SETUP

### 1) Create your Supabase account & project
Go to **supabase.com** → sign up → **New Project**. Pick a strong database
password and save it somewhere safe — you'll need it in a minute.

### 2) Create the database tables
On your computer, in this project folder:
```
npm install
```
Copy `.env.example` to `.env.local`. In Supabase: **Project Settings → Database →
Connection string → URI** — copy it, paste it as `DATABASE_URL` in `.env`
(replace `[YOUR-PASSWORD]` with the password from step 1). Keep all secret
values out of source control.

Then run:
```
npx prisma db push
npm run seed
```
This creates all your tables and loads your logo, photos, and starter
products into the real database.

### 3) Create your Owner account (Supabase Auth)
In Supabase: **Authentication → Users → Add User**. Enter your own email
and a strong password, and confirm the user (verify via the email Supabase
sends). This is the ONLY login that
will ever get into `/admin`.

### 4) Add the Supabase environment variables
In Supabase: **Project Settings → API** — copy the "Project URL" and the
"anon public" key. In your `.env.local`, set:
```
NEXT_PUBLIC_SUPABASE_URL=<Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
ADMIN_EMAIL=<the exact email you used in step 3>
```

### 5) Create the image storage bucket
In Supabase: **Storage → New Bucket** → name it exactly `images` → toggle
**Public bucket** ON → Create.
Then go to **Storage → images → Policies → New Policy** and add a policy
allowing authenticated users (i.e., you, once logged in) to upload:
```sql
create policy "Authenticated users can upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'images');

create policy "Public can view images"
on storage.objects for select
to public
using (bucket_id = 'images');
```
(Paste this in Supabase: **SQL Editor → New query → Run**.)

### 6) Create your Stripe account
Go to **dashboard.stripe.com/register** → sign up with your real business
details. Go to **Developers → API keys** → copy the **Secret key**.

### 7) Add Stripe keys
In `.env.local`:
```
STRIPE_SECRET_KEY=<your secret key>
```
(Leave `STRIPE_WEBHOOK_SECRET` for step 10, after you're deployed.)

### 8) Test it locally (optional but recommended)
```
npm run dev
```
Visit `http://localhost:3000` — your local preview. Visit `/admin/login` and sign
in with the email/password from step 3.

### 9) Deploy to hosting
Push this project to a **github.com** repository (free account). Go to
**vercel.com** → sign up → **Add New Project → Import** your GitHub repo.
Before deploying, add every variable from your `.env.local` file under
**Settings → Environment Variables**, and set:
```
NEXT_PUBLIC_BASE_URL=https://kbrandmusisc.com
```
Click **Deploy**. Add both `kbrandmusisc.com` and `www.kbrandmusisc.com`
under **Settings → Domains**; the www host redirects to the canonical
apex domain. Configure the DNS records Vercel displays at your registrar.

### 10) Configure the Stripe webhook (so payments mark orders "Paid")
In Stripe: **Developers → Webhooks → Add endpoint**.
URL: `https://kbrandmusisc.com/api/webhooks/stripe`
Events: `checkout.session.completed`,
`checkout.session.async_payment_succeeded`, and `checkout.session.expired`
Copy the "Signing secret" shown → add it to Vercel's environment variables
as `STRIPE_WEBHOOK_SECRET` → redeploy (Vercel → Deployments → ⋯ →
Redeploy).

### 11) Connect your domain
The domain in this project is `kbrandmusisc.com`. In Vercel:
**your project → Settings → Domains** → add `kbrandmusisc.com` and
`www.kbrandmusisc.com`. Vercel shows the DNS records to add at the
registrar where you already manage the domain. DNS changes can take time
to propagate; this repository cannot change registrar DNS on your behalf.

---

## USING YOUR STORE

**10) Owner login URL:** `https://kbrandmusisc.com/admin/login` — sign in
with the email/password from Supabase Auth (step 3). Works from any
device, anywhere — it's a real login, not a browser-only password.

**11) Add/edit a product:** Admin → Products tab → fill the form (or click
Edit on an existing one) → Save Product.

**12) Upload/change a product image:** in that same form, use the "Product
Image" file picker — it uploads straight to your Supabase Storage bucket
and fills in the image field automatically.

**13) View/manage orders:** Admin → Orders tab — shows every order with
customer details, items, quantities, and totals, pulled live from the
database (syncs across every device you log in from).

**14) Change order status:** in the Orders tab, use the status dropdown on
each order (Pending / Paid / Processing / Shipped / Delivered / Cancelled)
— saves to the database the moment you select it.

**15) Publish changes:** dashboard edits (products, content, order status)
save to the live database instantly — nothing more to do. Code changes
(if you or a future developer edit files directly) go live after
`git push` triggers a new Vercel deploy.

---

## Before taking real orders
Before accepting live orders, provide verified seller identity and contact
details, shipping destinations and timeframes, return/refund rules, and
applicable jurisdiction. Replace the legal templates in `app/legal/` with
policies reviewed for those facts and your sales markets.

---

## IMPLEMENTED vs. WHAT YOU CONFIGURE — CHECKLIST

**Already implemented in the code:**
- [x] Owner login via Supabase Auth (no hardcoded password)
- [x] Admin routes + admin API endpoints protected on the server
- [x] Full product management (add/edit/delete/images/prices/sizes/stock/categories/flags)
- [x] Full site content management (logo/hero/about/story/promo/contact/social/shipping/returns)
- [x] Orders: view, customer info, items, totals, status updates saved to DB
- [x] Real database (Postgres via Supabase) — no localStorage as source of truth
- [x] Real Stripe Checkout + webhook that creates/updates paid orders
- [x] Image uploads to Supabase Storage
- [x] Responsive design (phone/tablet/desktop), original KBRANDMUSIC branding
- [x] Legal page routes (final seller details and policy wording still required)
- [x] JSON backup/export of products & settings

**You still need to:**
- [ ] Create Supabase, Stripe, GitHub, Vercel accounts (steps 1, 3, 6, 9)
- [ ] Create the `images` storage bucket + policies (step 5)
- [ ] Add all environment variables to `.env.local` and Vercel (steps 4, 7, 10)
- [ ] Deploy and connect `kbrandmusisc.com` DNS in Vercel (steps 9, 11)
- [ ] Fill in real legal/business details in `app/legal/`
- [ ] Decide your shipping rates/carrier and update the Shipping settings
- [ ] Switch Stripe from test mode to live mode when ready for real payments
  (Stripe Dashboard → toggle "Test mode" off → use your live secret key)

---

## You are not locked in
Standard Next.js + Prisma + Supabase + Stripe — no proprietary format.
- **Move hosts:** any Node host can run `npm run build && npm start`.
- **Move database:** standard Postgres — export via `pg_dump` or Supabase's
  own export tools; Prisma works against any Postgres provider.
- **Move auth:** Supabase Auth is standard; migrating to another provider
  later just means swapping `lib/supabase/*` for that provider's SDK.
- **Hand to another developer:** give them this folder or GitHub repo
  access — everything is plain, readable, standard code.
