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
    (public pages)         home, about, council, community, contact, press,
                           awards[/slug], initiatives[/slug], blog[/slug]
    api/register/          public form endpoint → registrations table
    api/community/         join / idea / unsubscribe endpoints (SQL RPC backed)
    admin/                 gated dashboard (login, CRUD engine, media, settings)
    admin/community/       members, ideas, broadcasts
  components/              SiteHeader / SiteFooter / SiteChrome (ported site.js)
  lib/
    supabase/              server / client / admin / public / middleware clients
    queries.ts             typed public reads (ISR)
    types.ts               row types (mirror the SQL schema)
    community.ts           shared option lists (regions, stages, interests…)
    email.ts               Resend transport + RTL email templates
    validate.ts            shared form validators
  styles/                  design system + tokens (unchanged) + page styles
supabase/
  migrations/0001_init.sql schema + enums + RLS + storage bucket
  migrations/0002_community.sql  مجتمع الأستاذ tables, RLS, public write RPCs
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

Optional, and only needed to send community broadcasts:

```
RESEND_API_KEY=...                   # https://resend.com → API Keys
COMMUNITY_FROM_EMAIL=مجتمع الأستاذ <community@ostath.sa>
NEXT_PUBLIC_SITE_URL=https://ostath.sa
```

Without these the site behaves exactly as before — teachers still join the
community and submit ideas — but the dashboard can't send email, so use the CSV
export instead.

### 2. Apply the schema

Run the migrations in order against the project — via the Supabase SQL editor,
or the Supabase CLI (`supabase db push`):

- `supabase/migrations/0001_init.sql` — all content tables, the
  `application_status` / `phase_state` enums, RLS policies, the `admins` table +
  `is_admin()` helper, and the public `media` storage bucket.
- `supabase/migrations/0002_community.sql` — مجتمع الأستاذ: members, ideas,
  broadcasts, their RLS, and the three `SECURITY DEFINER` functions that are the
  only way anonymous visitors may write.

Both files are idempotent, so re-running them is safe. `0001` has already been
applied to the live project — never edit it; add a numbered file instead.

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
- **مجتمع الأستاذ** — three screens: **أعضاء المجتمع** (search, filter by status,
  CSV export, per‑member detail with an internal note), **أفكار المجتمع** (review
  incoming ideas, set a status, feature one on the public page), and **رسائل
  المجتمع** (compose a broadcast, target a segment, send).

Access is gated two ways: middleware redirects unauthenticated users to
`/admin/login`, and every write is additionally enforced by RLS (`is_admin()`),
so a signed‑in non‑admin can read nothing privileged and write nothing.

## Deploy (Vercel)

1. Import the repo — Next.js is auto‑detected (no `vercel.json` needed).
2. Set the four env vars above in Project Settings → Environment Variables.
3. Deploy. Content changes made in `/admin` go live via ISR; only code changes
   need a new deployment.

## مجتمع الأستاذ (the teacher community)

`/community` is where a teacher joins the foundation's community and where they
send ideas back. It exists to close a loop the rest of the site can't: give the
team an opted‑in audience to reach when something is published, and give
teachers a channel into the initiatives.

**Three tables** (`supabase/migrations/0002_community.sql`): `community_members`,
`community_ideas`, and `community_broadcasts` + `community_broadcast_recipients`.

**Public writes never touch a table directly.** Unlike `registrations` — whose
RLS is `for insert with check (true)` — anonymous visitors get no access to the
community tables at all. `/api/community/join` and `/api/community/idea` call
`SECURITY DEFINER` SQL functions (`community_join`, `community_idea_submit`,
`community_unsubscribe`) that own validation, length caps and rate limiting. The
membership list is therefore not readable with the public anon key, and joining
twice with the same email updates the member instead of duplicating them.

**Sending is batched and resumable.** `prepareBroadcast` resolves the audience
into one row per recipient; `sendBroadcastBatch` sends the next 100 and reports
progress, and the dashboard loops until the queue drains. Because progress is
persisted per recipient, a serverless timeout — or closing the tab — costs
nothing: the next run picks up exactly where it stopped and nobody is emailed
twice. Every broadcast carries an RFC 8058 `List-Unsubscribe` header pointing at
a POST‑only endpoint, so link scanners can't unsubscribe people by prefetching.

**Segments.** A broadcast can target interests, regions and school stages; an
empty selection means every active member who opted into updates. The option
lists live in `src/lib/community.ts` so the join form, the admin filters and the
audience picker can never drift apart.

## How the form flow maps to data

The interest‑registration modal (`SiteChrome.tsx`) adapts its fields to each
program's status (`open` → apply, `soon` → notify‑me, `closed` → waitlist,
`interest` → initiative, `council`) and `POST`s to `/api/register`, which inserts
into `registrations`. Anonymous inserts are the only write anon may perform;
reads are admin‑only.
