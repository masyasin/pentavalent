-- Fix Row Level Security (RLS) policies for the users table
-- This script ensures that Super Admins can manage all users and users can see their own profile.

-- 1. Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts (if any)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Super admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- 3. Create Policy: Allow everyone (authenticated) to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (auth.uid()::text = id::text);

-- 4. Create Policy: Allow Super Admins to perform ALL operations on ALL users
-- Using auth.jwt() to avoid querying the same table (prevents infinite recursion)
CREATE POLICY "Super admins can manage all users" 
ON public.users 
FOR ALL 
TO authenticated 
USING (
  (auth.jwt() ->> 'role') = 'super_admin' 
  OR 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id::text = auth.uid()::text AND role = 'super_admin'
  )
)
WITH CHECK (
  (auth.jwt() ->> 'role') = 'super_admin'
  OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id::text = auth.uid()::text AND role = 'super_admin'
  )
);

-- 5. Create Policy: Allow Admins to VIEW all users
CREATE POLICY "Admins can view all users" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (
  (auth.jwt() ->> 'role') IN ('super_admin', 'admin')
  OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id::text = auth.uid()::text AND role IN ('super_admin', 'admin')
  )
);
