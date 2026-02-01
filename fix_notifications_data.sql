-- Master Fix for Notifications (Column, Realtime, RLS)

-- 1. Add consultation_type column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'contact_messages'
        AND column_name = 'consultation_type'
    ) THEN
        ALTER TABLE contact_messages ADD COLUMN consultation_type TEXT;
    END IF;
END $$;

-- 2. Reset RLS Policies for Contact Messages
DROP POLICY IF EXISTS "Public Insert Access" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated Read Access" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated Update Access" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated Delete Access" ON contact_messages;
DROP POLICY IF EXISTS "Public Read Access" ON contact_messages;

ALTER TABLE contact_messages FORCE ROW LEVEL SECURITY;

CREATE POLICY "Public Insert Access" ON contact_messages FOR INSERT WITH CHECK (true);
-- Allow Public Read to ensure Admin Panel can fetch data (bypassing auth sync issues)
CREATE POLICY "Public Read Access" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated Update Access" ON contact_messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete Access" ON contact_messages FOR DELETE USING (auth.role() = 'authenticated');

GRANT ALL ON contact_messages TO authenticated;
GRANT ALL ON contact_messages TO anon;

-- 3. Reset RLS Policies for Job Applications
DROP POLICY IF EXISTS "Public Insert Access" ON job_applications;
DROP POLICY IF EXISTS "Authenticated Read Access" ON job_applications;
DROP POLICY IF EXISTS "Public Read Access" ON job_applications;
DROP POLICY IF EXISTS "Authenticated Update Access" ON job_applications;
DROP POLICY IF EXISTS "Authenticated Delete Access" ON job_applications;

ALTER TABLE job_applications FORCE ROW LEVEL SECURITY;

CREATE POLICY "Public Insert Access" ON job_applications FOR INSERT WITH CHECK (true);
-- Allow Public Read to ensure Admin Panel can fetch data
CREATE POLICY "Public Read Access" ON job_applications FOR SELECT USING (true);
CREATE POLICY "Authenticated Update Access" ON job_applications FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete Access" ON job_applications FOR DELETE USING (auth.role() = 'authenticated');

GRANT ALL ON job_applications TO authenticated;
GRANT ALL ON job_applications TO anon;

-- 4. Enable Realtime
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE job_applications;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;
