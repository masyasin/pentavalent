
-- Fix RLS policies for page_banners to allow seeding/migrations
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.page_banners;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.page_banners;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.page_banners;

-- Create more permissive policies (matching the pattern in master_schema.sql)
CREATE POLICY "Enable insert for all" ON public.page_banners FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON public.page_banners FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all" ON public.page_banners FOR DELETE USING (true);
