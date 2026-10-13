-- =============================================================================
-- الأخبار — foundation news, announcements and media coverage (/news)
--
-- Additive migration. 0001–0003 are already applied to the live project and
-- must never be edited; new schema lands in numbered files.
--
-- Design notes:
--  • A separate table from blog_posts: an article is an essay, a news item is a
--    dated event. News carries what an article never needs — a type, a pin,
--    and for media coverage the outlet's name and a link to the original.
--  • `kind` is plain text without a check constraint. The allowed values and
--    their Arabic labels live in src/lib/news.ts, so adding a type is a code
--    change, not another migration. Unknown values render as «أخبار المؤسسة».
--  • `published` defaults to FALSE (like brand_partners): a news item is a
--    public statement by the foundation and goes live only when an editor
--    switches منشور on.
-- =============================================================================

create table if not exists news (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  kind         text not null default 'news',             -- news | announcement | media
  excerpt      text,
  body         jsonb not null default '[]'::jsonb,       -- array of paragraph strings, as blog_posts.body
  cover_url    text,
  source_name  text,                                     -- media coverage: the outlet, e.g. صحيفة الرياض
  source_url   text,                                     -- media coverage: link to the original story
  pinned       boolean not null default false,           -- shown first, in the wide card
  published_at date,
  published    boolean not null default false,           -- deliberate: drafts until reviewed
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_news_list
  on news (published, pinned desc, published_at desc);

drop trigger if exists trg_news_updated on news;
create trigger trg_news_updated before update on news
  for each row execute function set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table news enable row level security;

drop policy if exists "public read published news" on news;
create policy "public read published news" on news
  for select using (published = true or is_admin());

drop policy if exists "admin write news" on news;
create policy "admin write news" on news
  for all using (is_admin()) with check (is_admin());
