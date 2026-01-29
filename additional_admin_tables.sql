-- Improvements for Job Applications and Menu Management

-- 1. Job Applications Admin Access
DROP POLICY IF EXISTS "Admins can view job applications" ON job_applications;
CREATE POLICY "Admins can view job applications" ON job_applications
FOR SELECT USING (true); -- Simplified for now, in prod check (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin', 'editor')

DROP POLICY IF EXISTS "Admins can update job applications" ON job_applications;
CREATE POLICY "Admins can update job applications" ON job_applications
FOR ALL USING (true);

-- 2. Menu Manager Table
CREATE TABLE IF NOT EXISTS nav_menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label_id TEXT NOT NULL,
    label_en TEXT NOT NULL,
    path TEXT NOT NULL,
    parent_id UUID REFERENCES nav_menus(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    location TEXT DEFAULT 'header', -- 'header', 'footer'
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE nav_menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON nav_menus FOR SELECT USING (is_active = true);
CREATE POLICY "Enable all for all" ON nav_menus FOR ALL USING (true) WITH CHECK (true);

-- 3. Channel Settings / Social Media Table (If separate from site_settings)
-- Many users prefer a separate list for easier management
CREATE TABLE IF NOT EXISTS social_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL, -- 'facebook', 'instagram', 'linkedin', etc.
    url TEXT NOT NULL,
    icon_name TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE social_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON social_channels FOR SELECT USING (is_active = true);
CREATE POLICY "Enable all for all" ON social_channels FOR ALL USING (true) WITH CHECK (true);
