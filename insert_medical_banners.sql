
-- SQL to insert banners for "Alat Kesehatan & Produk Medis" page
-- Path: /business/medical-equipment

-- First, ensure RLS is not blocking if you are running this as a script, 
-- but normally the SQL Editor in Supabase UI bypasses RLS.

INSERT INTO public.page_banners (
    page_path, 
    title_id, 
    title_en, 
    subtitle_id, 
    subtitle_en, 
    image_url, 
    sort_order, 
    is_active
) VALUES 
(
    '/business/medical-equipment',
    'Solusi Alat Kesehatan Terpadu',
    'Integrated Medical Equipment Solutions',
    'Menyediakan peralatan medis canggih untuk fasilitas kesehatan modern.',
    'Providing advanced medical equipment for modern healthcare facilities.',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=2000',
    1,
    true
),
(
    '/business/medical-equipment',
    'Standar Kualitas Global',
    'Global Quality Standards',
    'Produk kesehatan yang tersertifikasi dan aman bagi masyarakat Indonesia.',
    'Certified and safe health products for the Indonesian people.',
    'https://images.unsplash.com/photo-1581053141640-d958210175a2?auto=format&fit=crop&q=80&w=2000',
    2,
    true
),
(
    '/business/medical-equipment',
    'Inovasi Teknologi Medis',
    'Medical Technology Innovation',
    'Menghadirkan teknologi terbaru untuk meningkatkan efisiensi diagnosa dan perawatan.',
    'Bringing the latest technology to improve diagnostic and treatment efficiency.',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2000',
    3,
    true
);

-- Optional: Verify migration
SELECT * FROM public.page_banners WHERE page_path = '/business/medical-equipment';
