-- Comprehensive Master Schema for PT. Penta Valent Tbk

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE branch_type AS ENUM ('branch', 'depo', 'subdepo');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE partner_type AS ENUM ('principal', 'international');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM ('annual_report', 'financial_report', 'public_disclosure');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('open', 'closed', 'draft');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'editor', 'viewer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABLES

-- Hero Slides
CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    subtitle_id TEXT NOT NULL,
    subtitle_en TEXT NOT NULL,
    image_url TEXT NOT NULL,
    video_url TEXT,
    cta_primary_text_id TEXT,
    cta_primary_text_en TEXT,
    cta_primary_link TEXT DEFAULT '#business',
    cta_secondary_text_id TEXT,
    cta_secondary_text_en TEXT,
    cta_secondary_link TEXT DEFAULT '#contact',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- About Section Tables
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

CREATE TABLE IF NOT EXISTS corporate_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_id TEXT NOT NULL,
    description_en TEXT NOT NULL,
    icon_name TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Management Table
CREATE TABLE IF NOT EXISTS management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position_id TEXT NOT NULL,
    position_en TEXT NOT NULL,
    bio_id TEXT NOT NULL,
    bio_en TEXT NOT NULL,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Business Lines Tables
CREATE TABLE IF NOT EXISTS business_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_id TEXT NOT NULL,
    description_en TEXT NOT NULL,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS business_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_line_id UUID REFERENCES business_lines(id) ON DELETE CASCADE,
    feature_id TEXT NOT NULL,
    feature_en TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS business_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_line_id UUID REFERENCES business_lines(id) ON DELETE CASCADE,
    label_id TEXT NOT NULL,
    label_en TEXT NOT NULL,
    value_id TEXT NOT NULL,
    value_en TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS business_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_line_id UUID REFERENCES business_lines(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Other Content Tables
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type branch_type NOT NULL DEFAULT 'branch',
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT,
    email TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    partner_type partner_type NOT NULL,
    logo_url TEXT,
    website TEXT,
    description_id TEXT,
    description_en TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content_id TEXT NOT NULL,
    content_en TEXT NOT NULL,
    excerpt_id TEXT,
    excerpt_en TEXT,
    featured_image TEXT,
    category TEXT,
    published_at TIMESTAMPTZ DEFAULT now(),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description_id TEXT,
    description_en TEXT,
    issuer TEXT,
    certificate_number TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS Policies
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE management ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access" ON hero_slides;
CREATE POLICY "Public Read Access" ON hero_slides FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public Read Access" ON company_timeline;
CREATE POLICY "Public Read Access" ON company_timeline FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public Read Access" ON corporate_values;
CREATE POLICY "Public Read Access" ON corporate_values FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public Read Access" ON management;
CREATE POLICY "Public Read Access" ON management FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public Read Access" ON business_lines;
CREATE POLICY "Public Read Access" ON business_lines FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public Read Access" ON business_features;
CREATE POLICY "Public Read Access" ON business_features FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Access" ON business_stats;
CREATE POLICY "Public Read Access" ON business_stats FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Access" ON branches;
CREATE POLICY "Public Read Access" ON branches FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public Read Access" ON partners;
CREATE POLICY "Public Read Access" ON partners FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public Read Access" ON news;
CREATE POLICY "Public Read Access" ON news FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Public Read Access" ON certifications;
CREATE POLICY "Public Read Access" ON certifications FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public Read Access" ON business_images;
CREATE POLICY "Public Read Access" ON business_images FOR SELECT USING (true);

-- Add write access for seeding (NOTE: In production, these should be restricted to authenticated admins)
DROP POLICY IF EXISTS "Enable insert for all" ON hero_slides;
CREATE POLICY "Enable insert for all" ON hero_slides FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all" ON hero_slides;
CREATE POLICY "Enable update for all" ON hero_slides FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Enable delete for all" ON hero_slides;
CREATE POLICY "Enable delete for all" ON hero_slides FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON company_timeline;
CREATE POLICY "Enable insert for all" ON company_timeline FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all" ON company_timeline;
CREATE POLICY "Enable update for all" ON company_timeline FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Enable delete for all" ON company_timeline;
CREATE POLICY "Enable delete for all" ON company_timeline FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON corporate_values;
CREATE POLICY "Enable insert for all" ON corporate_values FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all" ON corporate_values;
CREATE POLICY "Enable update for all" ON corporate_values FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Enable delete for all" ON corporate_values;
CREATE POLICY "Enable delete for all" ON corporate_values FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON management;
CREATE POLICY "Enable insert for all" ON management FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all" ON management;
CREATE POLICY "Enable update for all" ON management FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Enable delete for all" ON management;
CREATE POLICY "Enable delete for all" ON management FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON business_lines;
CREATE POLICY "Enable insert for all" ON business_lines FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all" ON business_lines;
CREATE POLICY "Enable update for all" ON business_lines FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Enable delete for all" ON business_lines;
CREATE POLICY "Enable delete for all" ON business_lines FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON business_features;
CREATE POLICY "Enable insert for all" ON business_features FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all" ON business_features;
CREATE POLICY "Enable update for all" ON business_features FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Enable delete for all" ON business_features;
CREATE POLICY "Enable delete for all" ON business_features FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON business_stats;
CREATE POLICY "Enable insert for all" ON business_stats FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all" ON business_stats;
CREATE POLICY "Enable update for all" ON business_stats FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Enable delete for all" ON business_stats;
CREATE POLICY "Enable delete for all" ON business_stats FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON business_images;
CREATE POLICY "Enable insert for all" ON business_images FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all" ON business_images;
CREATE POLICY "Enable update for all" ON business_images FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Enable delete for all" ON business_images;
CREATE POLICY "Enable delete for all" ON business_images FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON branches;
CREATE POLICY "Enable insert for all" ON branches FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all" ON branches;
CREATE POLICY "Enable update for all" ON branches FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Enable delete for all" ON branches;
CREATE POLICY "Enable delete for all" ON branches FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON partners;
CREATE POLICY "Enable insert for all" ON partners FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all" ON partners;
CREATE POLICY "Enable update for all" ON partners FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Enable delete for all" ON partners;
CREATE POLICY "Enable delete for all" ON partners FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON news;
CREATE POLICY "Enable insert for all" ON news FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all" ON news;
CREATE POLICY "Enable update for all" ON news FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Enable delete for all" ON news;
CREATE POLICY "Enable delete for all" ON news FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON certifications;
CREATE POLICY "Enable insert for all" ON certifications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all" ON certifications;
CREATE POLICY "Enable update for all" ON certifications FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Enable delete for all" ON certifications;
CREATE POLICY "Enable delete for all" ON certifications FOR DELETE USING (true);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'viewer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON users FOR SELECT USING (true);
CREATE POLICY "Enable all for all" ON users FOR ALL USING (true) WITH CHECK (true);
