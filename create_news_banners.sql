-- Create news_banners table
CREATE TABLE IF NOT EXISTS public.news_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    subtitle_id TEXT,
    subtitle_en TEXT,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.news_banners ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access for news_banners"
ON public.news_banners FOR SELECT
TO public
USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access for news_banners"
ON public.news_banners FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert dummy data
INSERT INTO public.news_banners (title_id, title_en, subtitle_id, subtitle_en, image_url, sort_order)
VALUES 
(
    'Inovasi Distribusi Kesehatan Melalui Teknologi AI', 
    'Healthcare Distribution Innovation Through AI Technology', 
    'Meningkatkan efisiensi rantai pasok farmasi di seluruh penjuru Nusantara dengan sistem logistik cerdas.',
    'Enhancing pharmaceutical supply chain efficiency across the archipelago with intelligent logistics systems.',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070',
    1
),
(
    'Ekspansi Jaringan Nasional: 34 Cabang di Seluruh Indonesia', 
    'National Network Expansion: 34 Branches Across Indonesia', 
    'Memastikan ketersediaan produk kesehatan berkualitas tinggi menjangkau setiap provinsi dengan kecepatan dan integritas.',
    'Ensuring high-quality health product availability reaches every province with speed and integrity.',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070',
    2
),
(
    'Kemitraan Strategis Global untuk Masa Depan Kesehatan', 
    'Global Strategic Partnerships for the Future of Healthcare', 
    'Berkolaborasi dengan produsen kesehatan kelas dunia untuk menghadirkan solusi pengobatan terbaik bagi masyarakat.',
    'Collaborating with world-class healthcare manufacturers to deliver the best medical solutions for the community.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2070',
    3
);
