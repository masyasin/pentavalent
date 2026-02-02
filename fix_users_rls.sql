-- Fix Row Level Security (RLS) policies for the users table
-- This script ensures that Super Admins can manage all users and users can see their own profile.

-- 1. Clean up old policies and functions
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Super admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP FUNCTION IF EXISTS public.is_admin_check(text);

-- 2. Create a helper function to check roles without triggering infinite recursion
-- We use SECURITY DEFINER to bypass RLS inside the function
CREATE OR REPLACE FUNCTION public.is_admin_check(required_role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id::text = auth.uid()::text
    AND role::text = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Create Policy: Allow everyone (authenticated) to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (auth.uid()::text = id::text);

-- 5. Create Policy: Allow Super Admins to perform ALL operations on ALL users
CREATE POLICY "Super admins can manage all users" 
ON public.users 
FOR ALL 
TO authenticated 
USING (is_admin_check('super_admin'))
WITH CHECK (is_admin_check('super_admin'));

-- 6. Create Policy: Allow Admins to VIEW all users
CREATE POLICY "Admins can view all users" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (is_admin_check('super_admin') OR is_admin_check('admin'));
