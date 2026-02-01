-- Create page_banners table
create table public.page_banners (
  id uuid default gen_random_uuid() primary key,
  page_path text not null,
  title_id text,
  title_en text,
  subtitle_id text,
  subtitle_en text,
  image_url text not null,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.page_banners enable row level security;

-- Create policies
create policy "Enable read access for all users"
on public.page_banners for select
to public
using (true);

create policy "Enable insert for authenticated users only"
on public.page_banners for insert
to authenticated
with check (true);

create policy "Enable update for authenticated users only"
on public.page_banners for update
to authenticated
using (true);

create policy "Enable delete for authenticated users only"
on public.page_banners for delete
to authenticated
using (true);

-- Create updated_at trigger
create trigger handle_updated_at before update on public.page_banners
  for each row execute procedure moddatetime (updated_at);
