-- Fix RLS: Allow full access during development (matches site_settings pattern)
alter table org_structure enable row level security;

-- Drop restrictive policies
drop policy if exists "Enable read access for all users" on org_structure;
drop policy if exists "Enable insert for authenticated users only" on org_structure;
drop policy if exists "Enable update for authenticated users only" on org_structure;
drop policy if exists "Enable delete for authenticated users only" on org_structure;

-- Create permissive policy
create policy "Enable full access for all" on org_structure for all using (true) with check (true);
