-- RESTORE ORIGINAL BUSINESS DATA (3 ITEMS ONLY)
-- This script reverts the business data to the original 3 main categories.
-- It also ensures the SLUGS MATCH the frontend code expectations.

-- 1. Enable Permissions
ALTER TABLE business_lines FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON business_lines;
CREATE POLICY "Public Read Access" ON business_lines FOR SELECT USING (true);
GRANT SELECT ON business_lines TO anon, authenticated;

-- 2. Wipe Current Data (which had 9 items)
DELETE FROM business_features;
DELETE FROM business_lines;

-- 3. Insert Original 3 Categories (with CORRECT SLUGS for Indonesian Frontend)
-- Frontend expects: 'distribusi-farmasi', 'distribusi-alkes', 'produk-konsumen'

INSERT INTO public.business_lines (slug, title_id, title_en, subtitle_id, subtitle_en, description_id, description_en, icon_name, color_accent, sort_order)
VALUES 
(
    'distribusi-farmasi', 
    'Distribusi Farmasi', 
    'Pharmaceutical Distribution', 
    'OBAT RESEP & NON-RESEP', 
    'PRESCRIPTION & NON-PRESCRIPTION',
    'Mendistribusikan produk farmasi resep dan non-resep kepada rumah sakit, apotek, klinik, dan fasilitas pelayanan kesehatan lainnya.',
    'Distributing prescription and non-prescription pharmaceutical products to hospitals, pharmacies, clinics, and other healthcare facilities.',
    'pill',
    'from-blue-600 to-blue-800',
    1
),
(
    'distribusi-alkes', 
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
    'produk-konsumen', 
    'Produk Konsumen & Kesehatan', 
    'Consumer & Health Products', 
    'FMCG & PERSONAL CARE', 
    'FMCG & PERSONAL CARE',
    'Distribusi produk kesehatan konsumen, OTC, personal care, dan produk kecantikan melalui jaringan ritel dan modern trade.',
    'Distribution of consumer health products, OTC, personal care, and beauty products through retail and modern trade networks.',
    'shopping-bag',
    'from-emerald-500 to-emerald-700',
    3
);

-- 4. Insert Features (Checklists)
-- Pharmaceutical Features
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Ethical Products', 'Ethical Products', 1 FROM public.business_lines WHERE slug = 'distribusi-farmasi';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Generic Drugs', 'Generic Drugs', 2 FROM public.business_lines WHERE slug = 'distribusi-farmasi';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Cold Chain System', 'Cold Chain System', 3 FROM public.business_lines WHERE slug = 'distribusi-farmasi';

-- Medical Device Features
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Hospital Equipment', 'Hospital Equipment', 1 FROM public.business_lines WHERE slug = 'distribusi-alkes';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Lab Diagnostics', 'Lab Diagnostics', 2 FROM public.business_lines WHERE slug = 'distribusi-alkes';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Medical Consumables', 'Medical Consumables', 3 FROM public.business_lines WHERE slug = 'distribusi-alkes';

-- Consumer Health Features
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'OTC Medicines', 'OTC Medicines', 1 FROM public.business_lines WHERE slug = 'produk-konsumen';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Personal Care', 'Personal Care', 2 FROM public.business_lines WHERE slug = 'produk-konsumen';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Beauty & Skin', 'Beauty & Skin', 3 FROM public.business_lines WHERE slug = 'produk-konsumen';
