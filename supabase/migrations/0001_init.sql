-- =============================================================================
-- Al-Ostath website — initial schema, RLS, and storage
-- Single source of truth: the dashboard writes, the website reads.
-- =============================================================================

-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";  -- gen_random_uuid()

-- ── Enums ────────────────────────────────────────────────────────────────────
-- Application status shared by awards (and, conceptually, other programs).
do $$ begin
  create type application_status as enum ('open', 'soon', 'closed');
exception when duplicate_object then null; end $$;

-- Timeline phase state, drives the `is-done / is-now / is-next` styling.
do $$ begin
  create type phase_state as enum ('done', 'now', 'next');
exception when duplicate_object then null; end $$;

-- ── Admin identity + helper ──────────────────────────────────────────────────
-- Membership table decides who may write. Add a row per trusted editor:
--   insert into admins (user_id) values ('<auth.users.id>');
create table if not exists admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER so RLS policies can check membership without recursion.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admins a where a.user_id = auth.uid());
$$;

-- Shared updated_at trigger.
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ── initiatives ──────────────────────────────────────────────────────────────
create table if not exists initiatives (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  tagline     text,                 -- short one-liner on the list page
  badge       text,                 -- e.g. "مبادرة وطنية"
  overview    text,                 -- lead paragraph on the detail page
  goal        text,                 -- the highlighted goal statement
  facts       jsonb not null default '[]'::jsonb,  -- [{k, v}] detail-page fact chips
  value_cards jsonb not null default '[]'::jsonb,  -- [{title, body}]
  steps       jsonb not null default '[]'::jsonb,  -- [{title, body}]
  partners    text[] not null default '{}',
  logo_url    text,
  hero_image_url text,
  theme       text not null default 'olive',        -- olive | gold | sage
  sort_order  int  not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists trg_initiatives_updated on initiatives;
create trigger trg_initiatives_updated before update on initiatives
  for each row execute function set_updated_at();

-- ── awards ───────────────────────────────────────────────────────────────────
create table if not exists awards (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  tagline       text,
  type          text,                 -- "جائزة فنّية وطنية"
  badge_label   text,                 -- badge chip text ("جائزة فنّية")
  beneficiaries text,                 -- "معلّمو ومعلّمات الوطن"
  status        application_status not null default 'soon',
  overview      text,
  goal          text,
  categories    text[] not null default '{}',   -- feeds the registration modal
  steps         jsonb not null default '[]'::jsonb,     -- [{title, body}]
  hero_image_url text,
  theme         text not null default 'gold',    -- gold | olive | sage
  partnership_note text,
  sort_order    int  not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
drop trigger if exists trg_awards_updated on awards;
create trigger trg_awards_updated before update on awards
  for each row execute function set_updated_at();

-- ── award timeline phases ────────────────────────────────────────────────────
create table if not exists award_timeline_phases (
  id         uuid primary key default gen_random_uuid(),
  award_id   uuid not null references awards (id) on delete cascade,
  label      text not null,
  date_text  text,                 -- Hijri/free text, e.g. "حتى ٣٠ رمضان ١٤٤٧هـ"
  state      phase_state not null default 'next',
  tag_text   text,                 -- optional chip, e.g. "مفتوح الآن"
  sort_order int not null default 0
);
create index if not exists idx_phases_award on award_timeline_phases (award_id, sort_order);

-- ── blog posts ───────────────────────────────────────────────────────────────
create table if not exists blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  body         jsonb not null default '[]'::jsonb,  -- array of paragraph strings
  cover_url    text,
  category     text,
  published_at date,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
drop trigger if exists trg_posts_updated on blog_posts;
create trigger trg_posts_updated before update on blog_posts
  for each row execute function set_updated_at();

-- ── registrations (public form submissions) ──────────────────────────────────
create table if not exists registrations (
  id           uuid primary key default gen_random_uuid(),
  program_name text not null,
  program_type text,                 -- award | initiative | council
  status       text,                 -- the REG flow status at submit time
  name         text,
  email        text,
  phone        text,
  category     text,
  message      text,                 -- contact-form body (null for award/newsletter)
  consent      boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists idx_registrations_created on registrations (created_at desc);

-- ── partners ─────────────────────────────────────────────────────────────────
create table if not exists partners (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  logo_url   text,
  sort_order int not null default 0
);

-- ── press assets ─────────────────────────────────────────────────────────────
create table if not exists press_assets (
  id          uuid primary key default gen_random_uuid(),
  title       text not null unique,
  kind        text,                  -- logo | zip | pdf | color | font
  description text,
  file_url    text,
  meta        jsonb not null default '{}'::jsonb,  -- e.g. {hex:"#BF9B2F"} for colors
  sort_order  int not null default 0
);

-- ── site settings (contact info, socials, countdowns…) ───────────────────────
create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_settings_updated on site_settings;
create trigger trg_settings_updated before update on site_settings
  for each row execute function set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table initiatives           enable row level security;
alter table awards                enable row level security;
alter table award_timeline_phases enable row level security;
alter table blog_posts            enable row level security;
alter table registrations         enable row level security;
alter table partners              enable row level security;
alter table press_assets          enable row level security;
alter table site_settings         enable row level security;
alter table admins                enable row level security;

-- Public read of published content ------------------------------------------------
create policy "public read published initiatives" on initiatives
  for select using (published = true or is_admin());
create policy "public read published awards" on awards
  for select using (published = true or is_admin());
create policy "public read timeline of visible awards" on award_timeline_phases
  for select using (
    is_admin() or exists (
      select 1 from awards a where a.id = award_id and a.published = true
    )
  );
create policy "public read published posts" on blog_posts
  for select using (published = true or is_admin());
create policy "public read partners" on partners for select using (true);
create policy "public read press assets" on press_assets for select using (true);
create policy "public read site settings" on site_settings for select using (true);

-- Admin writes (insert/update/delete) --------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'initiatives','awards','award_timeline_phases','blog_posts',
    'partners','press_assets','site_settings'
  ] loop
    execute format('create policy "admin write %1$s" on %1$s for all using (is_admin()) with check (is_admin());', t);
  end loop;
end $$;

-- Registrations: anyone may INSERT, only admins may READ. No update/delete for public.
create policy "public insert registrations" on registrations
  for insert with check (true);
create policy "admin read registrations" on registrations
  for select using (is_admin());
create policy "admin manage registrations" on registrations
  for delete using (is_admin());

-- Admins table: an admin can see who else is an admin; no self-service writes.
create policy "admin read admins" on admins for select using (is_admin());

-- =============================================================================
-- Storage: public-read media bucket, admin-write
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
create policy "admin upload media" on storage.objects
  for insert with check (bucket_id = 'media' and is_admin());
create policy "admin update media" on storage.objects
  for update using (bucket_id = 'media' and is_admin());
create policy "admin delete media" on storage.objects
  for delete using (bucket_id = 'media' and is_admin());
