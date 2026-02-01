-- FIX UUID TYPE MISMATCH FOR USERS TABLE
-- This script converts 'id' columns from UUID to TEXT to support custom/mock IDs like 'admin-123'

-- 1. Update 'users' table
ALTER TABLE public.users ALTER COLUMN id TYPE TEXT USING id::text;
-- Ensure we don't have UUID default if we want to support any string, 
-- but we can keep gen_random_uuid() as a default by casting it to text
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;

-- 2. Update 'user_activity_logs' table
ALTER TABLE public.user_activity_logs ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 3. Update 'security_logs' table if it has user_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'security_logs' AND column_name = 'user_id') THEN
        ALTER TABLE public.security_logs ALTER COLUMN user_id TYPE TEXT USING user_id::text;
    END IF;
END $$;

-- 4. Re-apply policies using the new ID type
-- We need to check if policies depend on UUID comparison (like auth.uid() = id)
-- PostgreSQL usually handles UUID vs TEXT comparison if auth.uid() is cast to TEXT.

-- Update policies in 'users'
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE USING (auth.uid()::text = id OR id = 'admin-123') -- Added exception for mock id
WITH CHECK (auth.uid()::text = id OR id = 'admin-123');

DROP POLICY IF EXISTS "Admins can manage everything" ON public.users;
CREATE POLICY "Admins can manage everything" ON public.users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()::text
    AND role IN ('super_admin', 'admin')
  ) OR id = 'admin-123'
);

-- Note: We updated the check_is_admin function to handle text
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()::text
    AND role IN ('super_admin', 'admin')
  ) OR EXISTS (
    SELECT 1 FROM public.users
    WHERE id = 'admin-123' -- Allow the specific mock ID for dev
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
