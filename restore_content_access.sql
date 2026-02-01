-- RESTORE PUBLIC ACCESS (Fix "Not Found" and Admin Data Issues)

-- 1. Contact Messages (Fixes Admin Panel Data)
ALTER TABLE contact_messages FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON contact_messages;
CREATE POLICY "Public Read Access" ON contact_messages FOR SELECT USING (true);
GRANT SELECT ON contact_messages TO anon, authenticated;

-- 2. Job Applications (Fixes Admin Panel Data)
ALTER TABLE job_applications FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON job_applications;
CREATE POLICY "Public Read Access" ON job_applications FOR SELECT USING (true);
GRANT SELECT ON job_applications TO anon, authenticated;

-- 3. Business Content (Fixes Public Website "Not Found")
ALTER TABLE business_lines FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON business_lines;
CREATE POLICY "Public Read Access" ON business_lines FOR SELECT USING (true);
GRANT SELECT ON business_lines TO anon, authenticated;

ALTER TABLE business_images FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON business_images;
CREATE POLICY "Public Read Access" ON business_images FOR SELECT USING (true);
GRANT SELECT ON business_images TO anon, authenticated;

ALTER TABLE business_stats FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON business_stats;
CREATE POLICY "Public Read Access" ON business_stats FOR SELECT USING (true);
GRANT SELECT ON business_stats TO anon, authenticated;

ALTER TABLE business_features FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON business_features;
CREATE POLICY "Public Read Access" ON business_features FOR SELECT USING (true);
GRANT SELECT ON business_features TO anon, authenticated;

ALTER TABLE business_advantages FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON business_advantages;
CREATE POLICY "Public Read Access" ON business_advantages FOR SELECT USING (true);
GRANT SELECT ON business_advantages TO anon, authenticated;

-- 4. General Content
ALTER TABLE news FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON news;
CREATE POLICY "Public Read Access" ON news FOR SELECT USING (true);
GRANT SELECT ON news TO anon, authenticated;



ALTER TABLE page_banners FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON page_banners;
CREATE POLICY "Public Read Access" ON page_banners FOR SELECT USING (true);
GRANT SELECT ON page_banners TO anon, authenticated;

ALTER TABLE site_settings FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON site_settings;
CREATE POLICY "Public Read Access" ON site_settings FOR SELECT USING (true);
GRANT SELECT ON site_settings TO anon, authenticated;

ALTER TABLE careers FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON careers;
CREATE POLICY "Public Read Access" ON careers FOR SELECT USING (true);
GRANT SELECT ON careers TO anon, authenticated;

ALTER TABLE partners FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON partners;
CREATE POLICY "Public Read Access" ON partners FOR SELECT USING (true);
GRANT SELECT ON partners TO anon, authenticated;
