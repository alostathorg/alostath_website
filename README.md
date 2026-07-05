# مؤسسة الأستاذ — Al‑Ostath website

CMS‑driven website for Al‑Ostath Foundation. Arabic‑first, RTL. The team edits
everything (awards, initiatives, blog posts, application status/dates, media,
site settings) from a gated dashboard — no code changes required.

## Stack

- **Next.js 15** (App Router, TypeScript) — public site + gated `/admin`.
- **Supabase** — Postgres (single source of truth), Auth (admin sign‑in),
  Storage (logos / hero images / PDFs).
- One repo, one deploy (Vercel). The design system (`src/styles/`) is carried
  over unchanged from the original static build.

Public pages read from Supabase with **ISR** (`revalidate = 60`), so content
edits appear within a minute without a redeploy. RLS returns only `published`
rows to anonymous visitors.

## Project layout

```
src/
  app/
    (public pages)         home, about, council, contact, press,
                           awards[/slug], initiatives[/slug], blog[/slug]
    api/register/          public form endpoint → registrations table
    admin/                 gated dashboard (login, CRUD engine, media, settings)
  components/              SiteHeader / SiteFooter / SiteChrome (ported site.js)
  lib/
    supabase/              server / client / admin / public / middleware clients
    queries.ts             typed public reads (ISR)
    types.ts               row types (mirror the SQL schema)
  styles/                  design system + tokens (unchanged) + page styles
supabase/
  migrations/0001_init.sql schema + enums + RLS + storage bucket
  seed.ts                  one‑time seed from the original hardcoded content
```

## First‑time setup

### 1. Create a Supabase project

Then copy `.env.example` → `.env` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # server-only, used by the seed script
NEXT_PUBLIC_SUPABASE_BUCKET=media
```

### 2. Apply the schema

Run `supabase/migrations/0001_init.sql` against the project — via the Supabase
SQL editor, or the Supabase CLI (`supabase db push`). It creates all tables, the
`application_status` / `phase_state` enums, RLS policies, the `admins` table +
`is_admin()` helper, and the public `media` storage bucket.

### 3. Seed the current content

```sh
npm install
npm run seed
```

This upserts the awards, initiatives, blog posts, press assets, partners and
site settings that used to be hardcoded.

### 4. Create an admin user

Create a user in Supabase → Authentication → Users (email + password), then mark
them as an admin:

```sql
insert into admins (user_id, email)
select id, email from auth.users where email = 'you@example.com';
```

They can now sign in at `/admin/login`.

## Develop

```sh
npm run dev      # http://localhost:3000  (site) and /admin (dashboard)
```

## The dashboard (`/admin`)

- **الطلبات والاشتراكات** — every submission from the registration modal, the
  contact form, and newsletter sign‑ups (read + delete).
- **المحتوى** — CRUD for awards (incl. status, categories and the timeline
  phases), initiatives, blog posts, partners, and press assets. Publish/unpublish
  with the `منشور` toggle.
- **إعدادات الموقع** — contact block, socials, footer copyright, and the council
  countdown, edited as JSON.
- **الوسائط** — upload images/PDFs to Storage and copy their public URLs.

Access is gated two ways: middleware redirects unauthenticated users to
`/admin/login`, and every write is additionally enforced by RLS (`is_admin()`),
so a signed‑in non‑admin can read nothing privileged and write nothing.

## Deploy (Vercel)

1. Import the repo — Next.js is auto‑detected (no `vercel.json` needed).
2. Set the four env vars above in Project Settings → Environment Variables.
3. Deploy. Content changes made in `/admin` go live via ISR; only code changes
   need a new deployment.

## How the form flow maps to data

The interest‑registration modal (`SiteChrome.tsx`) adapts its fields to each
program's status (`open` → apply, `soon` → notify‑me, `closed` → waitlist,
`interest` → initiative, `council`) and `POST`s to `/api/register`, which inserts
into `registrations`. Anonymous inserts are the only write anon may perform;
reads are admin‑only.
