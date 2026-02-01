-- Migration for Expanded Business Section (9 Cards Grid)
-- This aligns the business_lines table with the 3x3 grid shown in the latest screenshot

-- 1. Ensure columns exist
ALTER TABLE public.business_lines 
ADD COLUMN IF NOT EXISTS subtitle_id TEXT,
ADD COLUMN IF NOT EXISTS subtitle_en TEXT,
ADD COLUMN IF NOT EXISTS icon_name TEXT,
ADD COLUMN IF NOT EXISTS color_accent TEXT;

-- 2. Clean existing data to avoid conflicts with new structure
DELETE FROM public.business_features WHERE business_line_id IN (SELECT id FROM public.business_lines);
DELETE FROM public.business_lines;

-- 3. Insert 9 Business Units
INSERT INTO public.business_lines (slug, title_id, title_en, subtitle_id, subtitle_en, description_id, description_en, icon_name, color_accent, sort_order)
VALUES 
('distribution-flow', 'Alur Distribusi', 'Distribution Flow', '', '', 'Manajemen rantai pasok terintegrasi dari hulu ke hilir.', 'Integrated supply chain management from upstream to downstream.', 'truck', 'from-slate-400 to-slate-600', 1),
('target-market', 'Target Pasar', 'Target Market', '', '', 'Menjangkau berbagai segmen pasar di seluruh wilayah Indonesia.', 'Reaching various market segments across all regions of Indonesia.', 'activity', 'from-slate-400 to-slate-600', 2),
('medical-instruments', 'Alat Kesehatan & Produk Medis', 'Medical Devices & Products', '', '', 'Penyediaan peralatan medis berkualitas tinggi untuk fasilitas kesehatan.', 'Providing high-quality medical equipment for healthcare facilities.', 'microscope', 'from-slate-400 to-slate-600', 3),
('pharma-prescription', 'Distribusi Farmasi', 'Pharmaceutical Distribution', 'OBAT RESEP & NON-RESEP', 'PRESCRIPTION & NON-PRESCRIPTION', 'Distribusi obat-obatan dengan standar CDOB yang ketat.', 'Distribution of medicines with strict CDOB standards.', 'pill', 'from-blue-600 to-blue-800', 4),
('medical-equipment-core', 'Alat Kesehatan & Produk Medis', 'Medical Devices & Products', 'PERALATAN & INSTRUMEN MEDIS', 'MEDICAL DEVICES & INSTRUMENTS', 'Solusi peralatan medis terintegrasi.', 'Integrated medical equipment solutions.', 'microscope', 'from-cyan-500 to-cyan-700', 5),
('pharma-general', 'Distribusi Farmasi', 'Pharmaceutical Distribution', '', '', 'Layanan distribusi farmasi yang luas dan handal.', 'Broad and reliable pharmaceutical distribution services.', 'pill', 'from-slate-400 to-slate-600', 6),
('consumer-health-core', 'Produk Konsumen & Kesehatan', 'Consumer & Health Products', 'FMCG & PERSONAL CARE', 'FMCG & PERSONAL CARE', 'Produk kesehatan berkualitas untuk konsumen sehari-hari.', 'Quality health products for everyday consumers.', 'shopping-bag', 'from-emerald-500 to-emerald-700', 7),
('consumer-beauty-core', 'Produk Konsumen & Kecantikan', 'Consumer & Beauty Products', '', '', 'Rangkaian produk kecantikan dan perawatan diri.', 'A range of beauty and personal care products.', 'shopping-bag', 'from-slate-400 to-slate-600', 8),
('business-strategy', 'Strategi Usaha', 'Business Strategy', '', '', 'Visi strategis untuk pertumbuhan jangka panjang.', 'Strategic vision for long-term growth.', 'activity', 'from-slate-400 to-slate-600', 9);

-- 4. Insert Features for all 9 units
-- Card 1: Alur Distribusi
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Sertifikasi CDOB (GDP) Penuh', 'Full CDOB (GDP) Certification', 1 FROM public.business_lines WHERE slug = 'distribution-flow';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Manajemen Rantai Dingin (Cold Chain)', 'Cold Chain Management', 2 FROM public.business_lines WHERE slug = 'distribution-flow';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Pengiriman Last-Mile Efisien', 'Efficient Last-Mile Delivery', 3 FROM public.business_lines WHERE slug = 'distribution-flow';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Sistem ERP Terintegrasi', 'Integrated ERP System', 4 FROM public.business_lines WHERE slug = 'distribution-flow';

-- Card 2: Target Pasar
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Farmasi', 'Pharmacy', 1 FROM public.business_lines WHERE slug = 'target-market';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Modern Trade', 'Modern Trade', 2 FROM public.business_lines WHERE slug = 'target-market';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Modern Market', 'Modern Market', 3 FROM public.business_lines WHERE slug = 'target-market';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Kios Kosmetik', 'Cosmetic Kiosks', 4 FROM public.business_lines WHERE slug = 'target-market';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Pasar Tradisional', 'Traditional Market', 5 FROM public.business_lines WHERE slug = 'target-market';

-- Card 3: Alat Kesehatan & Produk Medis (Top Right)
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Alat Kesehatan Rumah Sakit', 'Hospital Equipment', 1 FROM public.business_lines WHERE slug = 'medical-instruments';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Reagensia & Laboratorium', 'Lab Reagents', 2 FROM public.business_lines WHERE slug = 'medical-instruments';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Alat Monitoring Pasien', 'Patient Monitoring Devices', 3 FROM public.business_lines WHERE slug = 'medical-instruments';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Produk Diagnostik Cepat', 'Rapid Diagnostic Products', 4 FROM public.business_lines WHERE slug = 'medical-instruments';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Consumables Medis', 'Medical Consumables', 5 FROM public.business_lines WHERE slug = 'medical-instruments';

-- Card 4: Distribusi Farmasi (Mid Left)
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Ethical Products', 'Ethical Products', 1 FROM public.business_lines WHERE slug = 'pharma-prescription';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Generic Drugs', 'Generic Drugs', 2 FROM public.business_lines WHERE slug = 'pharma-prescription';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Cold Chain System', 'Cold Chain System', 3 FROM public.business_lines WHERE slug = 'pharma-prescription';

-- Card 5: Alat Kesehatan & Produk Medis (Mid Center)
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Hospital Equipment', 'Hospital Equipment', 1 FROM public.business_lines WHERE slug = 'medical-equipment-core';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Lab Diagnostics', 'Lab Diagnostics', 2 FROM public.business_lines WHERE slug = 'medical-equipment-core';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Medical Consumables', 'Medical Consumables', 3 FROM public.business_lines WHERE slug = 'medical-equipment-core';

-- Card 6: Distribusi Farmasi (Mid Right)
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Ethical (Produk Resep)', 'Ethical (Prescription)', 1 FROM public.business_lines WHERE slug = 'pharma-general';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'OTC (Over The Counter)', 'OTC', 2 FROM public.business_lines WHERE slug = 'pharma-general';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Alat Kesehatan', 'Medical Devices', 3 FROM public.business_lines WHERE slug = 'pharma-general';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Reagensia', 'Reagents', 4 FROM public.business_lines WHERE slug = 'pharma-general';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Food Supplement', 'Food Supplements', 5 FROM public.business_lines WHERE slug = 'pharma-general';

-- Card 7: Produk Konsumen & Kesehatan (Bottom Left)
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'OTC Medicines', 'OTC Medicines', 1 FROM public.business_lines WHERE slug = 'consumer-health-core';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Personal Care', 'Personal Care', 2 FROM public.business_lines WHERE slug = 'consumer-health-core';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Beauty & Skin', 'Beauty & Skin', 3 FROM public.business_lines WHERE slug = 'consumer-health-core';

-- Card 8: Produk Konsumen & Kecantikan (Bottom Center)
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Kosmetik', 'Cosmetics', 1 FROM public.business_lines WHERE slug = 'consumer-beauty-core';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Personal Care', 'Personal Care', 2 FROM public.business_lines WHERE slug = 'consumer-beauty-core';
INSERT INTO public.business_features (business_line_id, feature_id, feature_en, sort_order)
SELECT id, 'Toiletries', 'Toiletries', 3 FROM public.business_lines WHERE slug = 'consumer-beauty-core';

-- Card 9: Strategi Usaha (Bottom Right)
-- (No specific features listed in preview image)
