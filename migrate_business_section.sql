-- Migration for Business Section (Operational Fields & Integrated Services)
-- This aligns the business_lines table with the UI shown in the screenshot

-- 1. Add missing enhancement columns to business_lines
ALTER TABLE public.business_lines 
ADD COLUMN IF NOT EXISTS subtitle_id TEXT,
ADD COLUMN IF NOT EXISTS subtitle_en TEXT,
ADD COLUMN IF NOT EXISTS icon_name TEXT,
ADD COLUMN IF NOT EXISTS color_accent TEXT;

-- 2. Upsert the 3 main business lines
-- Note: We use the existing slugs or create new ones
INSERT INTO public.business_lines (slug, title_id, title_en, subtitle_id, subtitle_en, description_id, description_en, icon_name, color_accent, sort_order)
VALUES 
(
    'pharmaceuticals', 
    'Distribusi Farmasi', 
    'Pharmaceutical Distribution', 
    'OBAT RESEP & NON-RESEP', 
    'PRESCRIPTION & NON-PRESCRIPTION',
    'Mendistribusikan produk farmasi resep dan non-resep kepada rumah sakit, apotek, klinik, dan fasilitas pelayanan kesehatan lainnya.',
    'Distributing prescription and non-prescription pharmaceutical products to hospitals, pharmacies, clinics, and other healthcare facilities.',
    'pill', -- Mapping icon name
    'from-blue-600 to-blue-800',
    1
),
(
    'medical-equipment', 
    'Alat Kesehatan & Produk Medis', 
    'Medical Devices & Products', 
    'PERALATAN & INSTRUMEN MEDIS', 
    'MEDICAL DEVICES & INSTRUMENTS',
    'Menyediakan berbagai alat kesehatan dan produk medis dengan pengelolaan distribusi yang sesuai standar mutu dan keamanan.',
    'Providing various medical devices and products with distribution management that complies with quality and safety standards.',
    'microscope',
    'from-cyan-500 to-cyan-700',
    2
),
(
    'consumer-goods', 
    'Produk Konsumen & Kesehatan', 
    'Consumer & Health Products', 
    'FMCG & PERSONAL CARE', 
    'FMCG & PERSONAL CARE',
    'Distribusi produk kesehatan konsumen, OTC, personal care, dan produk kecantikan melalui jaringan ritel dan modern trade.',
    'Distribution of consumer health products, OTC, personal care, and beauty products through retail and modern trade networks.',
    'shopping-bag',
    'from-emerald-500 to-emerald-700',
    3
)
ON CONFLICT (slug) DO UPDATE SET
    title_id = EXCLUDED.title_id,
    title_en = EXCLUDED.title_en,
    subtitle_id = EXCLUDED.subtitle_id,
    subtitle_en = EXCLUDED.subtitle_en,
    description_id = EXCLUDED.description_id,
    description_en = EXCLUDED.description_en,
    icon_name = EXCLUDED.icon_name,
    color_accent = EXCLUDED.color_accent,
    sort_order = EXCLUDED.sort_order;

-- 3. Insert Features for each line
-- First, clear existing features for these lines to avoid duplicates
DELETE FROM public.business_features 
WHERE business_line_id IN (SELECT id FROM public.business_lines WHERE slug IN ('pharmaceuticals', 'medical-equipment', 'consumer-goods'));

-- Insert fresh features
-- Pharmaceutical Features
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Ethical Products', 'Ethical Products', 1 FROM public.business_lines WHERE slug = 'pharmaceuticals';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Generic Drugs', 'Generic Drugs', 2 FROM public.business_lines WHERE slug = 'pharmaceuticals';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Cold Chain System', 'Cold Chain System', 3 FROM public.business_lines WHERE slug = 'pharmaceuticals';

-- Medical Device Features
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Hospital Equipment', 'Hospital Equipment', 1 FROM public.business_lines WHERE slug = 'medical-equipment';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Lab Diagnostics', 'Lab Diagnostics', 2 FROM public.business_lines WHERE slug = 'medical-equipment';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Medical Consumables', 'Medical Consumables', 3 FROM public.business_lines WHERE slug = 'medical-equipment';

-- Consumer Health Features
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'OTC Medicines', 'OTC Medicines', 1 FROM public.business_lines WHERE slug = 'consumer-goods';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Personal Care', 'Personal Care', 2 FROM public.business_lines WHERE slug = 'consumer-goods';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Beauty & Skin', 'Beauty & Skin', 3 FROM public.business_lines WHERE slug = 'consumer-goods';
