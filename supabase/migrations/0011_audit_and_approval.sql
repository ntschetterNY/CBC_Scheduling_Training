-- Account approval gate + activity audit log
-- Run this in the Supabase SQL Editor after 0010_merge_tech_booth.sql.
--
-- What it adds:
--   1. profiles.approved — new sign-ups start UNAPPROVED and can't read any
--      app data until the super admin approves them from /admin/users.
--      Existing users are grandfathered in as approved.
--   2. is_approved() helper + tightened RLS: every "any authenticated user
--      can read" policy now also requires an approved account.
--   3. A trigger that pins `role` and `approved` so a user can't edit their
--      own privileges (the old profiles_update_own policy didn't prevent it).
--   4. set_user_access() RPC — the only path the app uses to change a user's
--      role/approval. Super-admin only, and it writes an audit entry.
--   5. audit_log — page views (with load time), clicks, and admin actions.
--      Users insert their own rows; only the super admin can read them.

-- ---------------------------------------------------------------------------
-- 1. approval flag
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists approved boolean not null default false;

-- Grandfather everyone who already has an account.
update public.profiles set approved = true;

create or replace function public.is_approved()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_super_admin()
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.approved
      );
$$;

grant execute on function public.is_approved() to authenticated;

-- ---------------------------------------------------------------------------
-- 2. pin role/approved against self-edits
-- ---------------------------------------------------------------------------
-- profiles_update_own allows a user to update their own row, and RLS can't
-- compare old vs new values — so pin the privilege columns with a trigger.
-- Dashboard/service-role sessions (auth.uid() is null) and the super admin
-- are exempt.
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or public.is_super_admin() then
    return new;
  end if;
  if new.role is distinct from old.role
     or new.approved is distinct from old.approved then
    raise exception 'Only the super admin can change roles or approval';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profiles on public.profiles;
create trigger protect_profiles
  before update on public.profiles
  for each row execute function public.protect_profile_privileges();

-- ---------------------------------------------------------------------------
-- 3. require approval on every broad read policy
-- ---------------------------------------------------------------------------
drop policy if exists "teams_select_authenticated" on public.teams;
create policy "teams_select_authenticated"
  on public.teams for select to authenticated
  using (public.is_approved());

drop policy if exists "roles_select_authenticated" on public.schedule_roles;
create policy "roles_select_authenticated"
  on public.schedule_roles for select to authenticated
  using (public.is_approved());

drop policy if exists "people_select_authenticated" on public.people;
create policy "people_select_authenticated"
  on public.people for select to authenticated
  using (public.is_approved());

drop policy if exists "members_select_authenticated" on public.team_members;
create policy "members_select_authenticated"
  on public.team_members for select to authenticated
  using (public.is_approved());

drop policy if exists "blackouts_select_authenticated" on public.blackout_dates;
create policy "blackouts_select_authenticated"
  on public.blackout_dates for select to authenticated
  using (public.is_approved());

drop policy if exists "blackouts_write_own_or_admin" on public.blackout_dates;
create policy "blackouts_write_own_or_admin"
  on public.blackout_dates for all to authenticated
  using (
    public.is_app_admin()
    or (
      public.is_approved()
      and exists (
        select 1 from public.people p
        where p.id = person_id
          and p.email is not null
          and lower(p.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
    )
  )
  with check (
    public.is_app_admin()
    or (
      public.is_approved()
      and exists (
        select 1 from public.people p
        where p.id = person_id
          and p.email is not null
          and lower(p.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
    )
  );

drop policy if exists "assignments_select_authenticated" on public.assignments;
create policy "assignments_select_authenticated"
  on public.assignments for select to authenticated
  using (public.is_approved());

drop policy if exists "person_roles_select_authenticated" on public.person_roles;
create policy "person_roles_select_authenticated"
  on public.person_roles for select to authenticated
  using (public.is_approved());

drop policy if exists "fr_upvotes_select_authenticated" on public.feature_request_upvotes;
create policy "fr_upvotes_select_authenticated"
  on public.feature_request_upvotes for select to authenticated
  using (public.is_approved());

drop policy if exists "fr_upvotes_insert_own" on public.feature_request_upvotes;
create policy "fr_upvotes_insert_own"
  on public.feature_request_upvotes for insert to authenticated
  with check (user_id = auth.uid() and public.is_approved());

-- ---------------------------------------------------------------------------
-- 4. audit log
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id          bigint generated always as identity primary key,
  user_id     uuid references auth.users (id) on delete set null,
  email       text,
  event       text not null check (event in ('page_view', 'click', 'admin_action')),
  path        text,
  target      text,
  detail      jsonb,
  duration_ms integer,
  created_at  timestamptz not null default now()
);

create index if not exists audit_log_created_idx on public.audit_log (created_at desc);
create index if not exists audit_log_user_idx on public.audit_log (user_id, created_at desc);

alter table public.audit_log enable row level security;

-- Anyone signed in (approved or not — pending users' activity is useful too)
-- may record their own events.
drop policy if exists "audit_insert_own" on public.audit_log;
create policy "audit_insert_own"
  on public.audit_log for insert to authenticated
  with check (user_id = auth.uid());

-- Only the super admin can read the log.
drop policy if exists "audit_select_superadmin" on public.audit_log;
create policy "audit_select_superadmin"
  on public.audit_log for select to authenticated
  using (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- 5. role/approval changes go through one audited RPC
-- ---------------------------------------------------------------------------
create or replace function public.set_user_access(
  p_user_id  uuid,
  p_role     text,
  p_approved boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  if not public.is_super_admin() then
    raise exception 'Only the super admin can change user access';
  end if;
  if p_role not in ('trainee', 'admin') then
    raise exception 'Invalid role %', p_role;
  end if;

  update public.profiles
     set role = p_role, approved = p_approved
   where id = p_user_id
   returning full_name into v_name;

  if not found then
    raise exception 'No such user';
  end if;

  insert into public.audit_log (user_id, email, event, target, detail)
  values (
    auth.uid(),
    lower(coalesce(auth.jwt() ->> 'email', '')),
    'admin_action',
    'set_user_access',
    jsonb_build_object(
      'target_user_id', p_user_id,
      'target_name', v_name,
      'role', p_role,
      'approved', p_approved
    )
  );
end;
$$;

grant execute on function public.set_user_access(uuid, text, boolean) to authenticated;
