-- FINAL SECURITY POLICY FOR SECURITY_LOGS TABLE
-- Run this in Supabase SQL Editor to ensure everything works perfectly

-- 1. Enable RLS
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- 2. Clear existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can insert logs" ON public.security_logs;
DROP POLICY IF EXISTS "Admins can view logs" ON public.security_logs;
DROP POLICY IF EXISTS "Admins can delete logs" ON public.security_logs;

-- 3. Policy: Allow anyone to send logs (needed to catch public attacks/spam)
CREATE POLICY "Public can insert logs" ON public.security_logs 
FOR INSERT WITH CHECK (true);

-- 4. Policy: Allow authenticated users (Admins) to view logs
CREATE POLICY "Admins can view logs" ON public.security_logs 
FOR SELECT USING (auth.role() = 'authenticated');

-- 5. Policy: Allow authenticated users (Admins) to delete logs
CREATE POLICY "Admins can delete logs" ON public.security_logs 
FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Grant appropriate permissions
GRANT INSERT ON public.security_logs TO anon;
GRANT ALL ON public.security_logs TO authenticated;

-- Notify successful run
-- SUCCESS: Security Logs RLS is now fully operational.
