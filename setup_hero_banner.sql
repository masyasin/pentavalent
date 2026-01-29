-- 1. Create Hero Slides Table (if not exists)
CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    subtitle_id TEXT NOT NULL,
    subtitle_en TEXT NOT NULL,
    image_url TEXT NOT NULL,
    video_url TEXT,
    cta_primary_text_id TEXT NOT NULL,
    cta_primary_text_en TEXT NOT NULL,
    cta_primary_link TEXT NOT NULL,
    cta_secondary_text_id TEXT NOT NULL,
    cta_secondary_text_en TEXT NOT NULL,
    cta_secondary_link TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public Read Access" ON hero_slides;
CREATE POLICY "Public Read Access" ON hero_slides FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Enable insert for all" ON hero_slides;
CREATE POLICY "Enable insert for all" ON hero_slides FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for all" ON hero_slides;
CREATE POLICY "Enable update for all" ON hero_slides FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete for all" ON hero_slides;
CREATE POLICY "Enable delete for all" ON hero_slides FOR DELETE USING (true);

-- 2. Clear existing slides to avoid duplicates (Optional, but safe for 'reset')
DELETE FROM hero_slides;

-- 3. Insert the New Banner (Indo Map Concept)
INSERT INTO hero_slides (
    title_id, 
    title_en, 
    subtitle_id, 
    subtitle_en, 
    image_url, 
    cta_primary_text_id, 
    cta_primary_text_en, 
    cta_primary_link,
    cta_secondary_text_id, 
    cta_secondary_text_en, 
    cta_secondary_link,
    sort_order
) VALUES (
    'PENTA VALENT', 
    'PENTA VALENT',
    'Mitra Distribusi Kesehatan & Logistik Terpadu Menjangkau Seluruh Nusantara.',
    'Integrated Healthcare & Logistics Distribution Partner Reaching Across the Archipelago.',
    'https://images.unsplash.com/photo-1549213821-4708d624a1d1?auto=format&fit=crop&q=80&w=1600', -- Placeholder until actual image is placed
    'Jelajahi Jaringan', 'Explore Network', '#network',
    'Tentang Kami', 'About Us', '#about',
    1
),
(
    'Inovasi Logistik Modern', 
    'Modern Logistics Innovation',
    'Menerapkan teknologi terkini untuk efisiensi dan akurasi pengiriman produk kesehatan.',
    'Implementing cutting-edge technology for efficiency and accuracy in healthcare product delivery.',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600',
    'Layanan Kami', 'Our Services', '#services',
    'Hubungi Kami', 'Contact Us', '#contact',
    2
);
