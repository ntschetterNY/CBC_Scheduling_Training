-- Feature Request tracker
-- ------------------------
-- Screenshots attached to a feature request are uploaded from the app to
-- Supabase Storage, then embedded (by public URL) into the GitHub issue the
-- request opens. The bucket is therefore public-read so GitHub can render the
-- images. Uploads are limited to signed-in users.

insert into storage.buckets (id, name, public)
values ('feature-request-photos', 'feature-request-photos', true)
on conflict (id) do nothing;

-- Any signed-in user may upload a screenshot into this bucket.
drop policy if exists "feature_photos_authenticated_insert" on storage.objects;
create policy "feature_photos_authenticated_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'feature-request-photos');

-- Anyone may read them (needed so GitHub can render the embedded images).
drop policy if exists "feature_photos_public_read" on storage.objects;
create policy "feature_photos_public_read"
  on storage.objects for select to public
  using (bucket_id = 'feature-request-photos');
