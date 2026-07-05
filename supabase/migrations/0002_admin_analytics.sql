-- CrossBridge SQ-6 Training — admin analytics & user management
-- Run this in the Supabase SQL Editor after 0001_init.sql.
--
-- What it adds:
--   * time-on-task tracking columns on module_progress
--     (time_spent_seconds = lesson time, quiz_time_seconds = quiz time)
--   * an add_module_time() RPC the app calls to accrue time
--   * a "super admin" concept, identified by email (no table edits needed),
--     who can see the time analytics and promote/demote admins from the app UI
--
-- The super admin is defined by email so the very first one is bootstrapped
-- without ever touching the Supabase dashboard. Everyone else is managed from
-- the app's Users directory page.

-- ---------------------------------------------------------------------------
-- time-on-task columns
-- ---------------------------------------------------------------------------
alter table public.module_progress
  add column if not exists time_spent_seconds integer not null default 0,
  add column if not exists quiz_time_seconds  integer not null default 0;

-- ---------------------------------------------------------------------------
-- who is a super admin?  (email-based — edit this list to add more)
-- ---------------------------------------------------------------------------
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = any (
    array['natecards@gmail.com']
  );
$$;

-- ---------------------------------------------------------------------------
-- accrue time on a module (called periodically by the client)
-- ---------------------------------------------------------------------------
create or replace function public.add_module_time(
  p_module_slug text,
  p_lesson integer,
  p_quiz integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return;
  end if;

  insert into public.module_progress
    (user_id, module_slug, status, time_spent_seconds, quiz_time_seconds)
  values
    (auth.uid(), p_module_slug, 'in_progress',
     greatest(coalesce(p_lesson, 0), 0), greatest(coalesce(p_quiz, 0), 0))
  on conflict (user_id, module_slug) do update
    set time_spent_seconds =
          public.module_progress.time_spent_seconds + greatest(coalesce(p_lesson, 0), 0),
        quiz_time_seconds =
          public.module_progress.quiz_time_seconds + greatest(coalesce(p_quiz, 0), 0),
        updated_at = now();
end;
$$;

grant execute on function public.add_module_time(text, integer, integer) to authenticated;
grant execute on function public.is_super_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- super-admin visibility & control (in addition to the 0001 admin policies)
-- ---------------------------------------------------------------------------

-- Super admin can read every profile (to build the Users directory).
drop policy if exists "profiles_select_superadmin" on public.profiles;
create policy "profiles_select_superadmin"
  on public.profiles for select
  using (public.is_super_admin());

-- Super admin can update any profile — this is how admins are seeded from the
-- app UI. (Regular users still only update their own via profiles_update_own,
-- and that policy's WITH CHECK blocks self role-escalation.)
drop policy if exists "profiles_update_superadmin" on public.profiles;
create policy "profiles_update_superadmin"
  on public.profiles for update
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- Super admin can read everyone's progress (including the time columns) for
-- the analytics view.
drop policy if exists "progress_select_superadmin" on public.module_progress;
create policy "progress_select_superadmin"
  on public.module_progress for select
  using (public.is_super_admin());
