-- Fix: "infinite recursion detected in policy for relation 'profiles'"
--
-- The original admin policies checked whether the current user is an admin by
-- running `select 1 from public.profiles ...` *inside* a policy that is itself
-- attached to `public.profiles`. Evaluating the policy re-evaluates the policy,
-- which Postgres detects as infinite recursion and aborts. Because
-- `module_progress` also has an admin SELECT policy that reads `profiles`, every
-- read of a progress row (including the row returned by the "save progress"
-- upsert) hit the same recursion — so trainees couldn't complete a module.
--
-- The fix: check the admin role through a SECURITY DEFINER function. It runs
-- with the definer's rights and so bypasses RLS on `profiles`, breaking the
-- self-referential loop. The admin policies then call the function instead of
-- querying `profiles` directly.
--
-- Safe to run on an existing database — it only replaces the two admin policies
-- and adds the helper function.

-- ---------------------------------------------------------------------------
-- Helper: is the current user an admin? (RLS-safe)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- profiles: replace the recursive admin SELECT policy
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
  on public.profiles for select
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- module_progress: replace the admin SELECT policy that read profiles
-- ---------------------------------------------------------------------------
drop policy if exists "progress_select_admin" on public.module_progress;
create policy "progress_select_admin"
  on public.module_progress for select
  using (public.is_admin());
