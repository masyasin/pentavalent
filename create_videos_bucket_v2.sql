-- Create 'videos' bucket (100MB limit)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('videos', 'videos', true, 104857600, array['video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do update set
file_size_limit = 104857600,
allowed_mime_types = array['video/mp4', 'video/webm', 'video/quicktime'];

-- Create Policies (Skip Alter Table which causes permission errors)
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Public Access Videos') then
    create policy "Public Access Videos" on storage.objects for select using ( bucket_id = 'videos' );
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Authenticated Upload Videos') then
    create policy "Authenticated Upload Videos" on storage.objects for insert with check ( bucket_id = 'videos' and auth.role() = 'authenticated' );
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Authenticated Update Videos') then
    create policy "Authenticated Update Videos" on storage.objects for update using ( bucket_id = 'videos' and auth.role() = 'authenticated' );
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Authenticated Delete Videos') then
    create policy "Authenticated Delete Videos" on storage.objects for delete using ( bucket_id = 'videos' and auth.role() = 'authenticated' );
  end if;
end $$;
