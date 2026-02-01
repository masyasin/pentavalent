-- FIX COLUMN MISMATCH AND PERMISSIONS
-- This script fixes the 'status' column issues and ensures the table structure matches the Frontend queries.

-- 1. Contact Messages: Ensure 'is_read' exists (it usually does)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_messages' AND column_name = 'is_read') THEN
        ALTER TABLE contact_messages ADD COLUMN is_read BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 2. Job Applications: Ensure 'status' exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_applications' AND column_name = 'status') THEN
        ALTER TABLE job_applications ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- 3. Reset RLS and Permissions (Broad access to fix 400 Errors)
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Full Access" ON contact_messages;
CREATE POLICY "Public Full Access" ON contact_messages FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Full Access" ON job_applications;
CREATE POLICY "Public Full Access" ON job_applications FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON TABLE contact_messages TO anon, authenticated, service_role;
GRANT ALL ON TABLE job_applications TO anon, authenticated, service_role;
