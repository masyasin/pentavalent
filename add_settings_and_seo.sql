-- Database additions for Site Settings and SEO
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL DEFAULT 'PT. Penta Valent Tbk',
    logo_url TEXT,
    favicon_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    google_maps_url TEXT,
    social_links JSONB DEFAULT '{}',
    footer_text_id TEXT,
    footer_text_en TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Initialize with one row if empty
INSERT INTO site_settings (id) 
SELECT gen_random_uuid() 
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

CREATE TABLE IF NOT EXISTS seo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_slug TEXT UNIQUE NOT NULL, -- 'home', 'about', 'products', 'news', 'careers', 'investor', 'contact'
    title_id TEXT,
    title_en TEXT,
    description_id TEXT,
    description_en TEXT,
    keywords_id TEXT,
    keywords_en TEXT,
    og_image TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access" ON site_settings;
CREATE POLICY "Public Read Access" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Access" ON seo_settings;
CREATE POLICY "Public Read Access" ON seo_settings FOR SELECT USING (true);

-- Admin Write Access (simplified for now as requested/configured previously)
DROP POLICY IF EXISTS "Enable all for all" ON site_settings;
CREATE POLICY "Enable all for all" ON site_settings FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for all" ON seo_settings;
CREATE POLICY "Enable all for all" ON seo_settings FOR ALL USING (true);
