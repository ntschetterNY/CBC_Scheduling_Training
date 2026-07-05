-- CrossBridge SQ-6 Training — database schema
-- Run this in the Supabase SQL Editor (or via the Supabase CLI) to set up
-- the tables, security policies, and triggers the app needs.
--
-- What it creates:
--   profiles         one row per user, with a role (trainee | admin)
--   module_progress  per-user, per-module completion + quiz score
-- Row Level Security ensures a user only sees/edits their own rows, while
-- admins can read everyone's progress.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  role        text not null default 'trainee' check (role in ('trainee', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A user can read their own profile.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles.
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- A user can update their own profile (but not escalate role via the app;
-- role changes should be done by an admin in the Supabase dashboard).
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- module_progress
-- ---------------------------------------------------------------------------
create table if not exists public.module_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  module_slug  text not null,
  status       text not null default 'in_progress'
               check (status in ('in_progress', 'completed')),
  quiz_score   integer,      -- percentage 0-100, null until a quiz is taken
  quiz_total   integer,      -- number of questions in the attempt
  completed_at timestamptz,
  updated_at   timestamptz not null default now(),
  unique (user_id, module_slug)
);

alter table public.module_progress enable row level security;

create index if not exists module_progress_user_idx
  on public.module_progress (user_id);

-- A user can do anything with their own progress rows.
drop policy if exists "progress_all_own" on public.module_progress;
create policy "progress_all_own"
  on public.module_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admins can read everyone's progress (for the admin dashboard).
drop policy if exists "progress_select_admin" on public.module_progress;
create policy "progress_select_admin"
  on public.module_progress for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- keep updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles on public.profiles;
create trigger touch_profiles before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_progress on public.module_progress;
create trigger touch_progress before update on public.module_progress
  for each row execute function public.touch_updated_at();
