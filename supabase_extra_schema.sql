-- Additional Tables for Dynamic Hero Slider and Business Lines

-- Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    subtitle_id TEXT NOT NULL,
    subtitle_en TEXT NOT NULL,
    image_url TEXT NOT NULL,
    cta_primary_text_id TEXT,
    cta_primary_text_en TEXT,
    cta_primary_link TEXT,
    cta_secondary_text_id TEXT,
    cta_secondary_text_en TEXT,
    cta_secondary_link TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Business Lines Table (Already exists in logic but not database)
CREATE TABLE IF NOT EXISTS business_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_id TEXT NOT NULL,
    description_en TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Business Features Table
CREATE TABLE IF NOT EXISTS business_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_line_id UUID REFERENCES business_lines(id) ON DELETE CASCADE,
    feature_id TEXT NOT NULL,
    feature_en TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Business Stats Table
CREATE TABLE IF NOT EXISTS business_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_line_id UUID REFERENCES business_lines(id) ON DELETE CASCADE,
    value_id TEXT NOT NULL,
    value_en TEXT NOT NULL,
    label_id TEXT NOT NULL,
    label_en TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add missing RLS policies
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Access" ON business_lines FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Access" ON business_features FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON business_stats FOR SELECT USING (true);
