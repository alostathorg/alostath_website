-- =============================================================================
-- الإعلامات — brand partners showcase (/partners)
--
-- Additive migration. 0001_init.sql and 0002_community.sql are already applied
-- to the live project and must never be edited; new schema lands in numbered
-- files.
--
-- Design notes:
--  • This is a different thing from the existing `partners` table, which holds
--    the foundation's institutional partners for the logo marquee. Brand
--    partners are companies whose products, services or offers help teachers;
--    each gets its own introduction page and an outbound CTA to its website.
--  • `published` defaults to FALSE here (the 0001 content tables default to
--    true): a brand row must be vetted — logo, link, offer — before it goes
--    live. The dashboard's منشور toggle switches it on.
--  • `category` / `pricing` are plain text without a check constraint. The
--    allowed values and their Arabic labels live in src/lib/brandPartners.ts,
--    so adding a category is a code change, not another migration. Unknown
--    values render as «أخرى».
-- =============================================================================

create table if not exists brand_partners (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name           text not null,
  tagline        text,                                  -- one line: what it does for the teacher
  category       text not null default 'other',        -- edtech | content | training | supplies | services | wellbeing | other
  pricing        text not null default 'paid',         -- free | freemium | paid
  audience       text[] not null default '{}',         -- who it is for, e.g. معلّمو المرحلة الابتدائية
  teacher_offer  text,                                  -- headline of the teacher-specific benefit / discount
  offer_code     text,                                  -- promo code, shown LTR
  offer_note     text,                                  -- validity, how to claim, eligibility
  overview       text,                                  -- lead paragraph «عن العلامة»
  highlights     jsonb not null default '[]'::jsonb,   -- [{title, body}] «ماذا يقدّم للمعلّم»
  location       text,                                  -- HQ city / country
  website_url    text,                                  -- brand home page (hostname is shown to the teacher)
  cta_url        text,                                  -- specific landing / offer page; falls back to website_url
  cta_label      text,                                  -- optional CTA label override
  logo_url       text,                                  -- any aspect ratio; rendered contained in a logo well
  hero_image_url text,                                  -- optional product image on the detail page
  featured       boolean not null default false,        -- sorts first, spotlight card + «شريك مميّز»
  sort_order     int  not null default 0,
  published      boolean not null default false,        -- deliberate: drafts until reviewed
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_brand_partners_list
  on brand_partners (published, featured desc, sort_order);

drop trigger if exists trg_brand_partners_updated on brand_partners;
create trigger trg_brand_partners_updated before update on brand_partners
  for each row execute function set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table brand_partners enable row level security;

drop policy if exists "public read published brand_partners" on brand_partners;
create policy "public read published brand_partners" on brand_partners
  for select using (published = true or is_admin());

drop policy if exists "admin write brand_partners" on brand_partners;
create policy "admin write brand_partners" on brand_partners
  for all using (is_admin()) with check (is_admin());
