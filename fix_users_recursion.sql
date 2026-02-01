-- FIX INFINITE RECURSION IN USERS TABLE POLICIES
-- This error occurs when a policy on 'users' table performs a subquery on the 'users' table.

-- 1. Clean up existing policies
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Public Read Access" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all" ON public.users;
DROP POLICY IF EXISTS "Admins can manage" ON public.users;
DROP POLICY IF EXISTS "Enable all for all" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage everything" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- 2. Create a SECURITY DEFINER function to check roles
-- SECURITY DEFINER functions run with the privileges of the creator (superuser),
-- ignoring RLS on the tables they query. This is the standard way to break RLS recursion.
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. New Policies
-- A. Public/Authenticated Read: Allow all users to see profiles (needed for dashboard/logs)
CREATE POLICY "Public Read Access" ON public.users
FOR SELECT USING (true);

-- B. Own Update: Allow any user to update their own avatar/name
CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- C. Admin Full Access: Allow admins to manage all users
-- We use the SECURITY DEFINER function here
CREATE POLICY "Admins can manage everything" ON public.users
FOR ALL USING (public.check_is_admin());

-- 5. Grant permissions
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO authenticated;
GRANT ALL ON TABLE public.users TO authenticated, service_role;
GRANT SELECT ON TABLE public.users TO anon;
