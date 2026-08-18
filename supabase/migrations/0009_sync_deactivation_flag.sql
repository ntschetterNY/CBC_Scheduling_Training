-- Distinguish sync-driven deactivation from a manual pause
-- ---------------------------------------------------------------------------
-- The Breeze directory sync flags a linked person inactive when Breeze stops
-- listing them (history is kept, never deleted). It must be able to reactivate
-- that same person if Breeze lists them again — but without ever clobbering a
-- pause an admin set by hand.
--
-- `deactivated_by_sync` records that the *sync* is what set active=false. A row
-- that is inactive with this flag false is a manual pause and sync leaves it
-- completely untouched. Reactivation clears the flag back to false.

alter table public.people
  add column if not exists deactivated_by_sync boolean not null default false;
