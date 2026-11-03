-- =============================================================================
-- الطلبات والاشتراكات — follow-up workflow for incoming form submissions.
--
-- Additive migration. 0001–0005 are already applied to the live project and
-- must never be edited; new schema lands in numbered files.
--
-- Until now a registration could only be read in a table and deleted. This adds
-- what the team needs to actually work the inbox:
--   • review_status — where the team is with it (labels in src/lib/registrations.ts):
--       new         — just arrived, nobody has looked at it
--       in_progress — someone is following it up
--       done        — answered / handled
--       archived    — kept for the record, out of the way
--     `registrations.status` already exists and holds the *public* REG flow
--     state at submit time, so the team's state gets its own column.
--   • admin_note  — an internal note, never shown to the sender.
--   • handled_at  — stamped by the dashboard whenever review_status changes.
--
-- Idempotent: safe to re-run.
-- =============================================================================

alter table registrations add column if not exists review_status text not null default 'new';
alter table registrations add column if not exists admin_note    text;
alter table registrations add column if not exists handled_at    timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'registrations_review_status_check'
  ) then
    alter table registrations
      add constraint registrations_review_status_check
      check (review_status in ('new', 'in_progress', 'done', 'archived'));
  end if;
end $$;

create index if not exists idx_registrations_review on registrations (review_status, created_at desc);

-- Admins could only read and delete; now they may also update (status + note).
drop policy if exists "admin update registrations" on registrations;
create policy "admin update registrations" on registrations
  for update using (is_admin()) with check (is_admin());
