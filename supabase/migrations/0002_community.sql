-- =============================================================================
-- مجتمع الأستاذ — community members, ideas, and broadcasts
--
-- Additive migration. 0001_init.sql has already been applied to the live
-- project, so it must never be edited; new schema lands in numbered files.
--
-- Design notes:
--  • The membership list is NOT publicly readable. Unlike `registrations`
--    (which uses `for insert with check (true)`), anonymous visitors get no
--    direct table access at all here — every public write goes through a
--    SECURITY DEFINER function that validates, length-caps and rate-limits its
--    input. Same idiom as is_admin() in 0001.
--  • Joining is an upsert on lower(email), so a teacher who fills the form
--    twice updates their profile instead of creating a duplicate.
--  • Broadcast progress lives in a recipients table, which makes sending
--    resumable and guarantees nobody is emailed twice.
-- =============================================================================

-- ── Enums ────────────────────────────────────────────────────────────────────
do $$ begin
  create type member_status as enum ('active', 'pending', 'unsubscribed', 'blocked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type idea_status as enum ('new', 'reviewing', 'accepted', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type broadcast_status as enum ('draft', 'sending', 'sent', 'failed');
exception when duplicate_object then null; end $$;

-- ── community_members ────────────────────────────────────────────────────────
create table if not exists community_members (
  id               uuid primary key default gen_random_uuid(),
  full_name        text not null,
  email            text not null,                      -- always stored lowercased
  phone            text,
  city             text,
  region           text,                               -- المنطقة
  school_stage     text,                               -- المرحلة الدراسية
  specialization   text,                               -- التخصص
  years_experience int,
  workplace        text,                               -- جهة العمل / المدرسة
  interests        text[] not null default '{}',       -- ما يهمّه من برامج المؤسسة
  contribution     text[] not null default '{}',       -- كيف يرغب بالمساهمة
  bio              text,
  consent          boolean not null default false,     -- موافقة سياسة الخصوصية
  wants_updates    boolean not null default true,      -- موافقة استلام التحديثات
  status           member_status not null default 'active',
  source           text,                               -- الصفحة التي جاء منها
  token            uuid not null default gen_random_uuid(),  -- رابط إلغاء الاشتراك
  admin_note       text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Case-insensitive uniqueness: the join RPC lowercases before writing, and this
-- index also protects against an admin typing a differently-cased duplicate.
create unique index if not exists community_members_email_uk
  on community_members (lower(email));
create index if not exists idx_members_created on community_members (created_at desc);
create index if not exists idx_members_status  on community_members (status);
create unique index if not exists community_members_token_uk on community_members (token);

drop trigger if exists trg_members_updated on community_members;
create trigger trg_members_updated before update on community_members
  for each row execute function set_updated_at();

-- ── community_ideas ──────────────────────────────────────────────────────────
create table if not exists community_ideas (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid references community_members (id) on delete set null,
  name          text,                                  -- denormalized: survives member deletion
  email         text,
  title         text not null,
  body          text not null,
  topic         text,
  initiative_id uuid references initiatives (id) on delete set null,
  status        idea_status not null default 'new',
  featured      boolean not null default false,        -- يظهر ضمن «أصوات المجتمع»
  admin_note    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_ideas_created on community_ideas (created_at desc);
create index if not exists idx_ideas_status  on community_ideas (status);
create index if not exists idx_ideas_member  on community_ideas (member_id);

drop trigger if exists trg_ideas_updated on community_ideas;
create trigger trg_ideas_updated before update on community_ideas
  for each row execute function set_updated_at();

-- ── community_broadcasts ─────────────────────────────────────────────────────
create table if not exists community_broadcasts (
  id              uuid primary key default gen_random_uuid(),
  subject         text not null,
  preheader       text,
  body            jsonb not null default '[]'::jsonb,  -- paragraphs, as blog_posts.body
  cta_label       text,
  cta_url         text,
  audience        jsonb not null default '{}'::jsonb,  -- {interests:[],regions:[],stages:[]}
  status          broadcast_status not null default 'draft',
  recipient_count int not null default 0,
  sent_count      int not null default 0,
  failed_count    int not null default 0,
  error           text,
  sent_at         timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_broadcasts_created on community_broadcasts (created_at desc);

drop trigger if exists trg_broadcasts_updated on community_broadcasts;
create trigger trg_broadcasts_updated before update on community_broadcasts
  for each row execute function set_updated_at();

-- One row per (broadcast, member). This is the send ledger: it makes a send
-- resumable after a timeout and guarantees at-most-once delivery per member.
create table if not exists community_broadcast_recipients (
  broadcast_id uuid not null references community_broadcasts (id) on delete cascade,
  member_id    uuid not null references community_members (id) on delete cascade,
  status       text not null default 'queued',         -- queued | sent | failed
  error        text,
  sent_at      timestamptz,
  primary key (broadcast_id, member_id)
);
create index if not exists idx_recipients_queued
  on community_broadcast_recipients (broadcast_id, status);

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table community_members               enable row level security;
alter table community_ideas                 enable row level security;
alter table community_broadcasts            enable row level security;
alter table community_broadcast_recipients  enable row level security;

-- Drop-then-create rather than a swallowed duplicate_object exception: an
-- exception inside a loop aborts the remaining iterations, which would leave a
-- re-run with some tables unpolicied.
do $$
declare t text;
begin
  foreach t in array array[
    'community_members','community_ideas',
    'community_broadcasts','community_broadcast_recipients'
  ] loop
    execute format('drop policy if exists "admin manage %1$s" on %1$s;', t);
    execute format(
      'create policy "admin manage %1$s" on %1$s for all using (is_admin()) with check (is_admin());', t);
  end loop;
end $$;

-- The only content the public may read: ideas the team chose to showcase.
drop policy if exists "public read featured ideas" on community_ideas;
create policy "public read featured ideas" on community_ideas
  for select using ((featured = true and status = 'accepted') or is_admin());

-- =============================================================================
-- Public write surface — SECURITY DEFINER RPCs (no direct anon table access)
--
-- These run as the migration's owner (`postgres` in the Supabase SQL editor or
-- via `supabase db push`), which owns the tables above and therefore bypasses
-- their RLS — the same assumption is_admin() already makes in 0001.
-- =============================================================================

-- Turns a jsonb array into a trimmed, capped text[]. Non-arrays become '{}'.
create or replace function community_text_array(j jsonb, max_items int default 20, max_len int default 60)
returns text[]
language sql
immutable
as $$
  select coalesce(array_agg(v), '{}'::text[])
  from (
    select left(btrim(x), max_len) as v
    from jsonb_array_elements_text(
      case when jsonb_typeof(j) = 'array' then j else '[]'::jsonb end
    ) as t(x)
    where btrim(x) <> ''
    limit max_items
  ) s;
$$;

-- Join / update a community membership. Upserts on lower(email).
-- Returns {ok, status:'created'|'updated', token?} — the token is returned only
-- for a brand-new row so an attacker cannot harvest existing members' tokens.
create or replace function community_join(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email  text;
  v_name   text;
  v_recent int;
  v_row    community_members%rowtype;
  v_existed boolean;
begin
  v_email := lower(btrim(coalesce(payload->>'email', '')));
  v_name  := btrim(coalesce(payload->>'full_name', ''));

  if v_name = '' then
    return jsonb_build_object('ok', false, 'error', 'name_required');
  end if;
  if v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    return jsonb_build_object('ok', false, 'error', 'email_invalid');
  end if;
  if payload->'consent' is distinct from 'true'::jsonb then
    return jsonb_build_object('ok', false, 'error', 'consent_required');
  end if;

  -- Crude flood guard. There is no KV/rate-limiter in this stack, so the cap
  -- lives here: a burst of new sign-ups beyond this is a script, not a school.
  select count(*) into v_recent
  from community_members
  where created_at > now() - interval '1 minute';
  if v_recent >= 30 then
    return jsonb_build_object('ok', false, 'error', 'rate_limited');
  end if;

  select exists (select 1 from community_members m where lower(m.email) = v_email)
    into v_existed;

  insert into community_members (
    full_name, email, phone, city, region, school_stage, specialization,
    years_experience, workplace, interests, contribution, bio,
    consent, wants_updates, source
  ) values (
    left(v_name, 120),
    v_email,
    nullif(left(btrim(coalesce(payload->>'phone', '')), 32), ''),
    nullif(left(btrim(coalesce(payload->>'city', '')), 80), ''),
    nullif(left(btrim(coalesce(payload->>'region', '')), 80), ''),
    nullif(left(btrim(coalesce(payload->>'school_stage', '')), 80), ''),
    nullif(left(btrim(coalesce(payload->>'specialization', '')), 120), ''),
    case when coalesce(payload->>'years_experience', '') ~ '^[0-9]{1,2}$'
         then (payload->>'years_experience')::int else null end,
    nullif(left(btrim(coalesce(payload->>'workplace', '')), 160), ''),
    community_text_array(payload->'interests'),
    community_text_array(payload->'contribution'),
    nullif(left(btrim(coalesce(payload->>'bio', '')), 1200), ''),
    true,
    payload->'wants_updates' is distinct from 'false'::jsonb,
    nullif(left(btrim(coalesce(payload->>'source', '')), 80), '')
  )
  on conflict ((lower(email))) do update set
    full_name        = excluded.full_name,
    phone            = coalesce(excluded.phone, community_members.phone),
    city             = coalesce(excluded.city, community_members.city),
    region           = coalesce(excluded.region, community_members.region),
    school_stage     = coalesce(excluded.school_stage, community_members.school_stage),
    specialization   = coalesce(excluded.specialization, community_members.specialization),
    years_experience = coalesce(excluded.years_experience, community_members.years_experience),
    workplace        = coalesce(excluded.workplace, community_members.workplace),
    interests        = excluded.interests,
    contribution     = excluded.contribution,
    bio              = coalesce(excluded.bio, community_members.bio),
    consent          = true,
    wants_updates    = excluded.wants_updates,
    -- Re-submitting the form is an explicit opt-in, so it revives an
    -- unsubscribed member — but never un-blocks one the team blocked.
    status           = case when community_members.status = 'blocked'
                            then community_members.status else 'active'::member_status end
  returning * into v_row;

  return jsonb_build_object(
    'ok', true,
    'status', case when v_existed then 'updated' else 'created' end,
    'name', v_row.full_name,
    'token', case when v_existed then null else v_row.token end
  );
end $$;

-- Submit an idea. Links to a member when the email matches an existing one.
create or replace function community_idea_submit(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email     text;
  v_name      text;
  v_title     text;
  v_body      text;
  v_member    uuid;
  v_initiative uuid;
  v_recent    int;
begin
  v_email := lower(btrim(coalesce(payload->>'email', '')));
  v_name  := btrim(coalesce(payload->>'name', ''));
  v_title := btrim(coalesce(payload->>'title', ''));
  v_body  := btrim(coalesce(payload->>'body', ''));

  if v_title = '' or v_body = '' then
    return jsonb_build_object('ok', false, 'error', 'content_required');
  end if;
  if v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    return jsonb_build_object('ok', false, 'error', 'email_invalid');
  end if;

  -- Per-address throttle: a genuine contributor does not file six ideas an hour.
  select count(*) into v_recent
  from community_ideas
  where lower(coalesce(email, '')) = v_email
    and created_at > now() - interval '1 hour';
  if v_recent >= 5 then
    return jsonb_build_object('ok', false, 'error', 'rate_limited');
  end if;

  select id into v_member from community_members where lower(email) = v_email;

  -- The form sends an initiative slug; resolve it here so a bogus id can't be
  -- injected and an unpublished initiative can't be referenced.
  select id into v_initiative
  from initiatives
  where slug = nullif(btrim(coalesce(payload->>'initiative_slug', '')), '')
    and published = true;

  insert into community_ideas (member_id, name, email, title, body, topic, initiative_id)
  values (
    v_member,
    nullif(left(v_name, 120), ''),
    v_email,
    left(v_title, 160),
    left(v_body, 4000),
    nullif(left(btrim(coalesce(payload->>'topic', '')), 80), ''),
    v_initiative
  );

  return jsonb_build_object('ok', true);
end $$;

-- One-click unsubscribe / resubscribe by token (the link in every broadcast).
create or replace function community_unsubscribe(t uuid, resubscribe boolean default false)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare v_row community_members%rowtype;
begin
  update community_members set
    status        = case when resubscribe then 'active'::member_status
                         else 'unsubscribed'::member_status end,
    wants_updates = resubscribe
  where token = t and status <> 'blocked'
  returning * into v_row;

  if v_row.id is null then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  return jsonb_build_object(
    'ok', true,
    'name', v_row.full_name,
    'subscribed', v_row.wants_updates
  );
end $$;

-- Anonymous visitors may call these three functions and nothing else.
grant execute on function community_join(jsonb)                  to anon, authenticated;
grant execute on function community_idea_submit(jsonb)            to anon, authenticated;
grant execute on function community_unsubscribe(uuid, boolean)    to anon, authenticated;
