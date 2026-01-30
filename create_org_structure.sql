create table if not exists org_structure (
  id uuid default gen_random_uuid() primary key,
  management_id uuid references management(id) on delete cascade not null,
  parent_id uuid references org_structure(id) on delete cascade,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Toggle RLS
alter table org_structure enable row level security;

-- Policies
create policy "Enable read access for all users" on org_structure for select using (true);
create policy "Enable insert for authenticated users only" on org_structure for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on org_structure for update using (auth.role() = 'authenticated');
create policy "Enable delete for authenticated users only" on org_structure for delete using (auth.role() = 'authenticated');
