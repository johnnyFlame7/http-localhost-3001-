# KBRANDMUSIC — Easy Setup (No Terminal, No Coding)

This path uses only websites — Supabase and Vercel — in your browser.
No PowerShell, no npm, no local installs.

---

## STEP 1 — Create your Supabase project
Go to **supabase.com** → Sign up → **New Project**. Set a database
password and save it somewhere safe.

## STEP 2 — Create your tables (copy + paste, no terminal)
In Supabase, open **SQL Editor → New query**.
Open the file **`1-schema.sql`** (in this same folder) on your computer,
copy ALL of its text, paste it into the SQL Editor, and click **Run**.

## STEP 3 — Load your starter products & content (copy + paste)
Same place — **SQL Editor → New query**. Open **`2-seed.sql`**, copy ALL
of its text, paste it in, click **Run**. This loads your logo, photos,
homepage text, and 8 starter products straight into the database.

## STEP 4 — Create your Owner login
In Supabase: **Authentication → Users → Add User**. Enter your own email
and a password. This is the only account that can access `/admin`.

## STEP 5 — Create the image bucket (copy + paste)
**Storage → New Bucket** → name it exactly `images` → turn ON **Public
bucket** → Create.
Then **SQL Editor → New query**, paste this, click Run:
```sql
create policy "Authenticated users can upload"
on storage.objects for insert to authenticated
with check (bucket_id = 'images');

create policy "Public can view images"
on storage.objects for select to public
using (bucket_id = 'images');
```

## STEP 6 — Get your Supabase keys
**Project Settings → API** — keep this tab open, you'll copy from it in
Step 8: the **Project URL** and the **anon public** key.
Also **Project Settings → Database → Connection string → URI** — copy
this too (this is your `DATABASE_URL`).

## STEP 7 — Create your Stripe account
Go to **dashboard.stripe.com/register** → sign up. Then **Developers →
API keys** → copy the **Secret key**.

## STEP 8 — Put your code on GitHub (drag and drop, no Git needed)
Go to **github.com** → sign up → **New repository** → name it
`kbrandmusic` → Create. On the next page, click **"uploading an existing
file"** → drag your entire unzipped `kbrandmusic-app` folder in → Commit.

## STEP 9 — Deploy on Vercel (this is where everything gets connected)
Go to **vercel.com** → sign up with your GitHub account → **Add New
Project** → import your `kbrandmusic` repo.
Before clicking Deploy, open **Environment Variables** and add each of
these (paste the values you collected in Steps 6–7):

| Name | Value |
|---|---|
| `DATABASE_URL` | your Supabase connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon public key |
| `ADMIN_EMAIL` | the email you used in Step 4 |
| `STRIPE_SECRET_KEY` | your Stripe secret key |
| `NEXT_PUBLIC_BASE_URL` | leave blank for now, fill in after deploy |

Click **Deploy**. In a minute or two, Vercel gives you a live link like
`kbrandmusic.vercel.app` — that's your real, live store.

Go back into Vercel → Settings → Environment Variables → set
`NEXT_PUBLIC_BASE_URL` to that link (e.g. `https://kbrandmusic.vercel.app`)
→ **Redeploy** (Deployments tab → ⋯ → Redeploy).

## STEP 10 — Connect Stripe payments fully (webhook)
In Stripe: **Developers → Webhooks → Add endpoint**.
URL: `https://kbrandmusic.vercel.app/api/webhooks/stripe`
Event: `checkout.session.completed`.
Copy the signing secret shown → add it in Vercel as `STRIPE_WEBHOOK_SECRET`
→ Redeploy once more.

## STEP 11 — Connect your own domain (optional, anytime later)
Buy `kbrandmusic.com` at Namecheap or GoDaddy. In Vercel: **Settings →
Domains** → add it → copy the DNS records shown → paste them into your
domain registrar's DNS settings.

---

## Your links going forward
- **Store:** `https://kbrandmusic.vercel.app` (or your domain once connected)
- **Owner login:** `https://kbrandmusic.vercel.app/admin/login`
- **Manage everything** (products, images, content, orders) from that
  admin login — no code, no terminal, ever again.
