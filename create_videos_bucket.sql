-- Create or Update 'videos' bucket with 100MB limit
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('videos', 'videos', true, 104857600, array['video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do update set
file_size_limit = 104857600,
allowed_mime_types = array['video/mp4', 'video/webm', 'video/quicktime'];

-- Enable RLS on storage.objects if not enabled
alter table storage.objects enable row level security;

-- Policies for 'videos' bucket
drop policy if exists "Public Access Videos" on storage.objects;
drop policy if exists "Authenticated Upload Videos" on storage.objects;
drop policy if exists "Authenticated Update Videos" on storage.objects;
drop policy if exists "Authenticated Delete Videos" on storage.objects;
drop policy if exists "Public Access" on storage.objects; -- clean up potential conflicts

create policy "Public Access Videos" on storage.objects 
  for select using ( bucket_id = 'videos' );

create policy "Authenticated Upload Videos" on storage.objects 
  for insert with check ( bucket_id = 'videos' and auth.role() = 'authenticated' );

create policy "Authenticated Update Videos" on storage.objects 
  for update using ( bucket_id = 'videos' and auth.role() = 'authenticated' );

create policy "Authenticated Delete Videos" on storage.objects 
  for delete using ( bucket_id = 'videos' and auth.role() = 'authenticated' );
