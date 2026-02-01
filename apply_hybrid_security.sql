-- Create a function to check for the secure admin header
CREATE OR REPLACE FUNCTION is_admin_client()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the specific header matches our secret
  RETURN (current_setting('request.headers', true)::json->>'x-admin-secure-token') = 'pentavalent-admin-secret-88';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to everyone (needed for RLS usage)
GRANT EXECUTE ON FUNCTION is_admin_client() TO anon, authenticated, service_role;

-- Update RLS Policy for Contact Messages (Read)
DROP POLICY IF EXISTS "Authenticated Read Access" ON contact_messages;
CREATE POLICY "Authenticated Read Access" ON contact_messages 
FOR SELECT 
USING (auth.role() = 'authenticated' OR is_admin_client());

-- Update RLS Policy for Job Applications (Read)
DROP POLICY IF EXISTS "Authenticated Read Access" ON job_applications;
CREATE POLICY "Authenticated Read Access" ON job_applications 
FOR SELECT 
USING (auth.role() = 'authenticated' OR is_admin_client());
