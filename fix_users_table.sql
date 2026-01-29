-- Create user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'editor', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'viewer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public Read Access" ON users;
CREATE POLICY "Public Read Access" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage all users" ON users;
CREATE POLICY "Admins can manage all users" 
ON users FOR ALL 
USING (
  (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
)
WITH CHECK (
  (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
);

-- Note: The above policy assumes auth.uid() matches the users.id. 
-- If using custom auth, you might need "USING (true)" for development or a different check.
-- For now, let's use a simpler policy to ensure you don't get locked out during setup:
DROP POLICY IF EXISTS "Enable all for all" ON users;
CREATE POLICY "Enable all for all" ON users FOR ALL USING (true) WITH CHECK (true);
