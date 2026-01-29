-- INSTRUCTIONS FOR RUNNING THIS SQL
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run" to execute

-- Add DELETE policy for visitor_logs (allow all for now)
DROP POLICY IF EXISTS "Enable delete for all" ON visitor_logs;
CREATE POLICY "Enable delete for all" 
ON visitor_logs 
FOR DELETE 
USING (true);

-- Create function to truncate visitor logs (bypasses RLS)
CREATE OR REPLACE FUNCTION truncate_visitor_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER  -- This runs with the privileges of the function owner, bypassing RLS
AS $$
BEGIN
    TRUNCATE TABLE visitor_logs RESTART IDENTITY CASCADE;
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION truncate_visitor_logs() TO authenticated;
GRANT EXECUTE ON FUNCTION truncate_visitor_logs() TO anon;

-- Verify the function was created
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'truncate_visitor_logs';
