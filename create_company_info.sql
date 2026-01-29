-- Create company_info table for General Profile settings
CREATE TABLE IF NOT EXISTS company_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tagline_id TEXT,
    tagline_en TEXT,
    title_text_id TEXT,
    title_text_en TEXT,
    title_italic_id TEXT,
    title_italic_en TEXT,
    description_id TEXT,
    description_en TEXT,
    stats_years_value TEXT,
    stats_years_label_id TEXT,
    stats_years_label_en TEXT,
    stats_public_value TEXT,
    stats_public_label_id TEXT,
    stats_public_label_en TEXT,
    image_url TEXT,
    vision_text_id TEXT,
    vision_text_en TEXT,
    mission_text_id TEXT,
    mission_text_en TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read Access" ON company_info FOR SELECT USING (true);
CREATE POLICY "Admin Full Access" ON company_info FOR ALL USING (true);

-- Initial Seed Data
INSERT INTO company_info (
    tagline_id, tagline_en,
    title_text_id, title_text_en,
    title_italic_id, title_italic_en,
    description_id, description_en,
    stats_years_value, stats_years_label_id, stats_years_label_en,
    stats_public_value, stats_public_label_id, stats_public_label_en,
    image_url,
    vision_text_id, vision_text_en,
    mission_text_id, mission_text_en
) VALUES (
    'PROFIL PERUSAHAAN', 'CORPORATE PROFILE',
    'Warisan Kepercayaan,', 'Legacy of Trust,',
    'Masa Depan Kesehatan', 'Future of Healthcare',
    'Didirikan pada tahun 1968, PT Penta Valent Tbk telah berkembang menjadi kekuatan distribusi kesehatan nasional yang utama. Kami menjembatani kesenjangan antara produsen global dan masyarakat Indonesia dengan integritas dan keunggulan.', 
    'Founded in 1968, PT Penta Valent Tbk has evolved into a premier national healthcare distribution powerhouse. We bridge the gap between global manufacturers and the Indonesian people with integrity and excellence.',
    '55+', 'Tahun Berdampak', 'Years of Impact',
    'Tbk', 'Perusahaan Publik', 'Publicly Listed',
    'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=1000',
    'Menjadi perusahaan distribusi kesehatan terkemuka di Indonesia yang memberikan nilai tambah bagi seluruh pemangku kepentingan.',
    'To become the leading healthcare distribution company in Indonesia that provides added value for all stakeholders.',
    'Menyediakan layanan distribusi yang handal, efisien, dan berkualitas tinggi untuk produk farmasi, alat kesehatan, dan consumer health di seluruh Indonesia.',
    'To provide reliable, efficient, and high-quality distribution services for pharmaceutical, medical devices, and consumer health products throughout Indonesia.'
);
