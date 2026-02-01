-- RESET AND FIX BUSINESS DATA (Complete Fix)
-- This script wipes the business table and re-inserts the data with the CORRECT slugs.

-- 1. Enable Permissions (Just in case)
ALTER TABLE business_lines FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON business_lines;
CREATE POLICY "Public Read Access" ON business_lines FOR SELECT USING (true);
GRANT SELECT ON business_lines TO anon, authenticated;

-- 2. Clean Existing Data
DELETE FROM business_features;
DELETE FROM business_lines;

-- 3. Insert Data with CORRECT SLUGS (Indonesian)
INSERT INTO public.business_lines (slug, title_id, title_en, subtitle_id, subtitle_en, description_id, description_en, icon_name, color_accent, sort_order)
VALUES 
-- Card 1: Alur Distribusi
('alur-distribusi', 'Alur Distribusi', 'Distribution Flow', '', '', 'Manajemen rantai pasok terintegrasi dari hulu ke hilir.', 'Integrated supply chain management from upstream to downstream.', 'truck', 'from-slate-400 to-slate-600', 1),
-- Card 2: Target Pasar
('target-pasar', 'Target Pasar', 'Target Market', '', '', 'Menjangkau berbagai segmen pasar di seluruh wilayah Indonesia.', 'Reaching various market segments across all regions of Indonesia.', 'activity', 'from-slate-400 to-slate-600', 2),
-- Card 3: Alat Kesehatan (Extra) - Keeping English slug as backup or mapping to detail
('medical-instruments', 'Alat Kesehatan & Produk Medis', 'Medical Devices & Products', '', '', 'Penyediaan peralatan medis berkualitas tinggi untuk fasilitas kesehatan.', 'Providing high-quality medical equipment for healthcare facilities.', 'microscope', 'from-slate-400 to-slate-600', 3),
-- Card 4: Pharma Prescription - Backup
('pharma-prescription', 'Distribusi Farmasi', 'Pharmaceutical Distribution', 'OBAT RESEP & NON-RESEP', 'PRESCRIPTION & NON-PRESCRIPTION', 'Distribusi obat-obatan dengan standar CDOB yang ketat.', 'Distribution of medicines with strict CDOB standards.', 'pill', 'from-blue-600 to-blue-800', 4),
-- Card 5: Distribusi Alkes (MAIN LINK)
('distribusi-alkes', 'Alat Kesehatan & Produk Medis', 'Medical Devices & Products', 'PERALATAN & INSTRUMEN MEDIS', 'MEDICAL DEVICES & INSTRUMENTS', 'Solusi peralatan medis terintegrasi.', 'Integrated medical equipment solutions.', 'microscope', 'from-cyan-500 to-cyan-700', 5),
-- Card 6: Distribusi Farmasi (MAIN LINK)
('distribusi-farmasi', 'Distribusi Farmasi', 'Pharmaceutical Distribution', '', '', 'Layanan distribusi farmasi yang luas dan handal.', 'Broad and reliable pharmaceutical distribution services.', 'pill', 'from-slate-400 to-slate-600', 6),
-- Card 7: Produk Konsumen (MAIN LINK)
('produk-konsumen', 'Produk Konsumen & Kesehatan', 'Consumer & Health Products', 'FMCG & PERSONAL CARE', 'FMCG & PERSONAL CARE', 'Produk kesehatan berkualitas untuk konsumen sehari-hari.', 'Quality health products for everyday consumers.', 'shopping-bag', 'from-emerald-500 to-emerald-700', 7),
-- Card 8: Beauty
('consumer-beauty-core', 'Produk Konsumen & Kecantikan', 'Consumer & Beauty Products', '', '', 'Rangkaian produk kecantikan dan perawatan diri.', 'A range of beauty and personal care products.', 'shopping-bag', 'from-slate-400 to-slate-600', 8),
-- Card 9: Strategi Bisnis
('strategi-bisnis', 'Strategi Usaha', 'Business Strategy', '', '', 'Visi strategis untuk pertumbuhan jangka panjang.', 'Strategic vision for long-term growth.', 'activity', 'from-slate-400 to-slate-600', 9);

-- 4. Re-Insert Features (Mapped to NEW Slugs)
-- Alur Distribusi
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Sertifikasi CDOB (GDP) Penuh', 'Full CDOB (GDP) Certification', 1 FROM public.business_lines WHERE slug = 'alur-distribusi';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Manajemen Rantai Dingin (Cold Chain)', 'Cold Chain Management', 2 FROM public.business_lines WHERE slug = 'alur-distribusi';

-- Target Pasar
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Farmasi', 'Pharmacy', 1 FROM public.business_lines WHERE slug = 'target-pasar';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Modern Trade', 'Modern Trade', 2 FROM public.business_lines WHERE slug = 'target-pasar';

-- Distribusi Alkes (Card 5)
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Hospital Equipment', 'Hospital Equipment', 1 FROM public.business_lines WHERE slug = 'distribusi-alkes';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Lab Diagnostics', 'Lab Diagnostics', 2 FROM public.business_lines WHERE slug = 'distribusi-alkes';

-- Distribusi Farmasi (Card 6 - Main)
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Ethical (Produk Resep)', 'Ethical (Prescription)', 1 FROM public.business_lines WHERE slug = 'distribusi-farmasi';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'OTC (Over The Counter)', 'OTC', 2 FROM public.business_lines WHERE slug = 'distribusi-farmasi';

-- Produk Konsumen (Card 7)
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'OTC Medicines', 'OTC Medicines', 1 FROM public.business_lines WHERE slug = 'produk-konsumen';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Beauty & Skin', 'Beauty & Skin', 3 FROM public.business_lines WHERE slug = 'produk-konsumen';

-- Strategi Bisnis
-- (No features)
