-- Drop existing policies to be clean
DROP POLICY IF EXISTS "Public Insert Access" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated Read Access" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated Update Access" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated Delete Access" ON contact_messages;

-- Re-enable RLS
ALTER TABLE contact_messages FORCE ROW LEVEL SECURITY;

-- 1. Public can INSERT (submit form)
CREATE POLICY "Public Insert Access" ON contact_messages 
FOR INSERT 
WITH CHECK (true);

-- 2. Authenticated users (admins) can SELECT, UPDATE, DELETE
CREATE POLICY "Authenticated Read Access" ON contact_messages 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update Access" ON contact_messages 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete Access" ON contact_messages 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Grant permissions to roles just in case
GRANT ALL ON contact_messages TO authenticated;
GRANT INSERT ON contact_messages TO anon;

