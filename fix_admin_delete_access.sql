-- FIX ADMIN DELETE & UPDATE ACCESS
-- This script explicitly re-enables ability for Admin (Authenticated users) to DELETE and UPDATE messages/jobs/content.

-- 1. Contact Messages (Allow Delete & Update)
DROP POLICY IF EXISTS "Authenticated Delete Access" ON contact_messages;
CREATE POLICY "Authenticated Delete Access" ON contact_messages FOR DELETE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated Update Access" ON contact_messages;
CREATE POLICY "Authenticated Update Access" ON contact_messages FOR UPDATE USING (auth.role() = 'authenticated');

-- 2. Job Applications (Allow Delete & Update)
DROP POLICY IF EXISTS "Authenticated Delete Access" ON job_applications;
CREATE POLICY "Authenticated Delete Access" ON job_applications FOR DELETE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated Update Access" ON job_applications;
CREATE POLICY "Authenticated Update Access" ON job_applications FOR UPDATE USING (auth.role() = 'authenticated');

-- 3. Business Lines (Allow Admin to Edit)
DROP POLICY IF EXISTS "Authenticated All Access" ON business_lines;
CREATE POLICY "Authenticated All Access" ON business_lines FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated All Access" ON business_features;
CREATE POLICY "Authenticated All Access" ON business_features FOR ALL USING (auth.role() = 'authenticated');

-- 4. News & Others
DROP POLICY IF EXISTS "Authenticated All Access" ON news;
CREATE POLICY "Authenticated All Access" ON news FOR ALL USING (auth.role() = 'authenticated');

-- 5. IMPORTANT: Grant USAGE permission on sequences if needed, and Table permissions
GRANT ALL ON contact_messages TO authenticated;
GRANT ALL ON job_applications TO authenticated;
GRANT ALL ON business_lines TO authenticated;
GRANT ALL ON business_features TO authenticated;
GRANT ALL ON news TO authenticated;
