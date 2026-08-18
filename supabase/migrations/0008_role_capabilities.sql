-- Per-person role capabilities ("who can do what")
-- ---------------------------------------------------------------------------
-- Breeze is the read-only source of truth for the *directory* (who exists and
-- their name + email). Team membership and role capabilities are owned by this
-- app in Supabase.
--
-- `person_roles` records which schedule_roles a given person is capable of
-- filling. The generator only assigns a person to a role they're marked
-- capable of — but with a deliberate fallback: a role that has *no* capability
-- rows stays open to every team member. That keeps existing teams (Safety,
-- Deacons) generating normally until their capabilities are filled in, and lets
-- you restrict role-by-role rather than all-or-nothing.

create table if not exists public.person_roles (
  id          uuid primary key default gen_random_uuid(),
  person_id   uuid not null references public.people (id) on delete cascade,
  role_id     uuid not null references public.schedule_roles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (person_id, role_id)
);

alter table public.person_roles enable row level security;

drop policy if exists "person_roles_select_authenticated" on public.person_roles;
create policy "person_roles_select_authenticated"
  on public.person_roles for select to authenticated
  using (true);

drop policy if exists "person_roles_write_admin" on public.person_roles;
create policy "person_roles_write_admin"
  on public.person_roles for all to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

create index if not exists person_roles_person_idx on public.person_roles (person_id);
create index if not exists person_roles_role_idx on public.person_roles (role_id);
