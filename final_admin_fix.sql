-- FIX ADMIN PERMISSIONS COMPLETELY
-- This script ensures Admin has full rights over contact_messages and job_applications

-- 1. Reset RLS and Policies for Messages
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Insert Access" ON contact_messages;
CREATE POLICY "Public Insert Access" ON contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Access" ON contact_messages;
CREATE POLICY "Public Read Access" ON contact_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated Delete Access" ON contact_messages;
CREATE POLICY "Authenticated Delete Access" ON contact_messages FOR DELETE USING (true); -- Granting broad delete for debugging

DROP POLICY IF EXISTS "Authenticated Update Access" ON contact_messages;
CREATE POLICY "Authenticated Update Access" ON contact_messages FOR UPDATE USING (true);

-- 2. Reset RLS and Policies for Jobs
ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Insert Access" ON job_applications;
CREATE POLICY "Public Insert Access" ON job_applications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Access" ON job_applications;
CREATE POLICY "Public Read Access" ON job_applications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated Delete Access" ON job_applications;
CREATE POLICY "Authenticated Delete Access" ON job_applications FOR DELETE USING (true);

DROP POLICY IF EXISTS "Authenticated Update Access" ON job_applications;
CREATE POLICY "Authenticated Update Access" ON job_applications FOR UPDATE USING (true);

-- 3. Grants
GRANT ALL ON TABLE contact_messages TO anon, authenticated, service_role;
GRANT ALL ON TABLE job_applications TO anon, authenticated, service_role;
