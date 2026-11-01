-- =============================================================================
-- الترجمات — «مليون كلمة»: education content translated into Arabic (/translations)
--
-- Additive migration. 0001–0004 are already applied to the live project and
-- must never be edited; new schema lands in numbered files.
--
-- How a row moves:
--   1. A weekly scheduled Claude task finds 3–5 teacher-relevant sources,
--      translates them and INSERTs each one here with status = 'draft'.
--   2. The editor reviews it in /admin/translations (original beside the
--      Arabic, every paragraph editable) and shares a PDF with colleagues.
--   3. The editor then sets one of:
--        published — live on /translations, counted toward the million
--        revise    — sent back: the next weekly run rewrites it using
--                    review_note, then returns it to 'draft'
--        rejected  — kept (never deleted) so the task never picks the same
--                    source again
--
-- Design notes:
--  • `mode` records the rights decision made per source: 'full' only when the
--    source carries an open licence that allows translation (CC BY, BY-SA,
--    BY-NC, BY-NC-SA, public domain); everything else — including CC *ND*
--    licences, which forbid derivatives — is 'summary': an Arabic summary that
--    links to the original.
--  • `body` and `original_body` are arrays of paragraph strings, like
--    blog_posts.body / news.body. In 'full' mode they align 1:1 so the review
--    screen and the bilingual PDF can set them side by side.
--  • `word_count` is maintained by a trigger from the Arabic body — the number
--    the «مليون كلمة» counter adds up. It is never typed by hand.
--  • `status` is text + CHECK rather than an enum so a future state is a
--    one-line change. Labels live in src/lib/translations.ts.
--  • `source_url` is unique when present: the de-duplication key for the task.
-- =============================================================================

create table if not exists translations (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,                          -- Arabic title
  original_title   text,                                   -- title in the source language
  excerpt          text,                                   -- 1–2 line Arabic summary for cards
  body             jsonb not null default '[]'::jsonb,     -- Arabic paragraphs
  original_body    jsonb not null default '[]'::jsonb,     -- source paragraphs (aligned 1:1 in full mode)
  mode             text not null default 'summary'
                     check (mode in ('full', 'summary')),
  category         text,                                   -- one of the eight in lib/translations.ts
  tags             text[] not null default '{}',
  source_name      text,                                   -- e.g. UNESCO, OECD, Frontiers in Education
  source_url       text,                                   -- link to the original
  author           text,                                   -- original author(s)
  source_date      text,                                   -- original publication date, as given
  source_language  text not null default 'en',
  license          text,                                   -- e.g. CC BY 4.0, CC BY-SA 3.0 IGO, حقوق محفوظة
  license_url      text,
  word_count       integer not null default 0,             -- trigger-maintained, Arabic body
  status           text not null default 'draft'
                     check (status in ('draft', 'revise', 'rejected', 'published')),
  review_note      text,                                   -- editor → task (revise) or internal note
  batch_date       date not null default current_date,     -- the weekly run that produced it
  published_at     date,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create unique index if not exists uq_translations_source_url
  on translations (source_url) where source_url is not null;

create index if not exists idx_translations_list
  on translations (status, published_at desc);

create index if not exists idx_translations_batch
  on translations (batch_date desc);

drop trigger if exists trg_translations_updated on translations;
create trigger trg_translations_updated before update on translations
  for each row execute function set_updated_at();

-- ── Word count + publish date ────────────────────────────────────────────────
create or replace function translations_before_write()
returns trigger
language plpgsql
as $$
begin
  new.word_count := coalesce((
    select sum(array_length(regexp_split_to_array(btrim(p), '\s+'), 1))
    from jsonb_array_elements_text(
      case when jsonb_typeof(new.body) = 'array' then new.body else '[]'::jsonb end
    ) as p
    where btrim(p) <> ''
  ), 0);

  if new.status = 'published' and new.published_at is null then
    new.published_at := (now() at time zone 'Asia/Riyadh')::date;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_translations_before_write on translations;
create trigger trg_translations_before_write before insert or update on translations
  for each row execute function translations_before_write();

-- ── The counter ──────────────────────────────────────────────────────────────
-- Total Arabic words published, and how many items. Runs as the caller, so RLS
-- already limits an anonymous visitor to published rows.
create or replace function translations_totals()
returns table (words bigint, items bigint)
language sql
stable
as $$
  select coalesce(sum(word_count), 0)::bigint, count(*)::bigint
  from translations
  where status = 'published';
$$;

grant execute on function translations_totals() to anon, authenticated;

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table translations enable row level security;

drop policy if exists "public read published translations" on translations;
create policy "public read published translations" on translations
  for select using (status = 'published' or is_admin());

drop policy if exists "admin write translations" on translations;
create policy "admin write translations" on translations
  for all using (is_admin()) with check (is_admin());

-- ── Editable working lists for the weekly task ───────────────────────────────
-- Stored in site_settings under the key `translation` and edited from
-- إعدادات الموقع → الترجمات. Plain text, one entry per line, so no JSON is
-- ever typed by hand. Inserted only if missing: re-running never overwrites
-- what the editor has since changed.
insert into site_settings (key, value)
values (
  'translation',
  jsonb_build_object(
    'sources', concat_ws(E'\n',
      'UNESCO (UNESDOC) | https://unesdoc.unesco.org | غالباً CC BY-SA 3.0 IGO — ترجمة كاملة',
      'OECD Education | https://www.oecd.org/en/topics/education.html | المنشورات الحديثة غالباً CC BY 4.0 — تحقّق لكل مادة',
      'World Bank Open Knowledge Repository | https://openknowledge.worldbank.org | غالباً CC BY 3.0 IGO — ترجمة كاملة',
      'UNICEF Innocenti | https://www.unicef.org/innocenti | تختلف — تحقّق لكل مادة',
      'Frontiers in Education | https://www.frontiersin.org/journals/education | CC BY 4.0 — ترجمة كاملة',
      'Education Sciences (MDPI) | https://www.mdpi.com/journal/education | CC BY 4.0 — ترجمة كاملة',
      'OpenStax / OER Commons | https://oercommons.org | غالباً CC BY — ترجمة كاملة',
      'The Conversation — Education | https://theconversation.com/global/education | CC BY-ND — ملخص فقط',
      'Edutopia | https://www.edutopia.org | حقوق محفوظة — ملخص فقط',
      'Education Endowment Foundation | https://educationendowmentfoundation.org.uk | حقوق محفوظة — ملخص فقط'
    ),
    'glossary', concat_ws(E'\n',
      'formative assessment = التقويم البنائي',
      'summative assessment = التقويم الختامي',
      'classroom management = إدارة الصف',
      'differentiated instruction = التعليم المتمايز',
      'professional development = التطوير المهني',
      'learning outcomes = نواتج التعلّم',
      'curriculum = المنهج',
      'scaffolding = السقالات التعليمية',
      'metacognition = ما وراء المعرفة',
      'retrieval practice = ممارسة الاسترجاع',
      'spaced practice = التعلّم المتباعد',
      'feedback = التغذية الراجعة',
      'student engagement = انخراط الطلاب',
      'growth mindset = عقلية النمو',
      'teacher wellbeing = جودة حياة المعلّم',
      'evidence-based practice = الممارسة القائمة على الأدلة',
      'inclusive education = التعليم الدامج',
      'early childhood education = تعليم الطفولة المبكرة',
      'lesson study = دراسة الدرس',
      'project-based learning = التعلّم القائم على المشاريع'
    )
  )
)
on conflict (key) do nothing;
