-- Feature Request upvotes
-- -----------------------
-- Tickets themselves live as GitHub issues (see lib/github.ts). Upvotes are
-- the one piece of ticket state we keep in Supabase rather than GitHub: one
-- row per (issue, user). Counts are read by anyone signed in; a user may only
-- add or remove their own vote. This mirrors VOREA's "fr-upvotes" store, but
-- as a first-class relational table instead of a KV blob.

create table if not exists public.feature_request_upvotes (
  issue_number integer not null,
  user_id      uuid not null references auth.users (id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (issue_number, user_id)
);

-- Look up "how many votes does issue N have" quickly.
create index if not exists feature_request_upvotes_issue_idx
  on public.feature_request_upvotes (issue_number);

alter table public.feature_request_upvotes enable row level security;

-- Any signed-in user can read all votes (needed to show counts).
drop policy if exists "fr_upvotes_select_authenticated" on public.feature_request_upvotes;
create policy "fr_upvotes_select_authenticated"
  on public.feature_request_upvotes for select
  to authenticated
  using (true);

-- A user may only cast their own vote.
drop policy if exists "fr_upvotes_insert_own" on public.feature_request_upvotes;
create policy "fr_upvotes_insert_own"
  on public.feature_request_upvotes for insert
  to authenticated
  with check (user_id = auth.uid());

-- A user may only retract their own vote.
drop policy if exists "fr_upvotes_delete_own" on public.feature_request_upvotes;
create policy "fr_upvotes_delete_own"
  on public.feature_request_upvotes for delete
  to authenticated
  using (user_id = auth.uid());
