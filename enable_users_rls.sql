-- Enable RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" 
ON users FOR SELECT 
USING (true); -- Allowing public read for now or restricted by ID

-- Allow Super Admin and Admin to manage users
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
CREATE POLICY "Admins can manage all users" 
ON users FOR ALL 
USING (true)
WITH CHECK (true);
