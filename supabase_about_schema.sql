-- Tables for AboutSection

-- Company Timeline Table
CREATE TABLE IF NOT EXISTS company_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT NOT NULL,
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_id TEXT NOT NULL,
    description_en TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Corporate Values Table
CREATE TABLE IF NOT EXISTS corporate_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_id TEXT NOT NULL,
    description_en TEXT NOT NULL,
    icon_name TEXT, -- Name of the icon to use (e.g., 'shield', 'zap')
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE company_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON company_timeline FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Access" ON corporate_values FOR SELECT USING (is_active = true);
