-- Ensure UPDATE policy exists for site_settings
-- Run this in Supabase SQL Editor

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'site_settings';

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Enable all for all" ON site_settings;
DROP POLICY IF EXISTS "Public Read Access" ON site_settings;

-- Allow SELECT for everyone
CREATE POLICY "Enable select for all" 
ON site_settings 
FOR SELECT 
USING (true);

-- Allow UPDATE for everyone (you can restrict this later)
CREATE POLICY "Enable update for all" 
ON site_settings 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow INSERT for everyone
CREATE POLICY "Enable insert for all" 
ON site_settings 
FOR INSERT 
WITH CHECK (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'site_settings';
