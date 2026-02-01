-- FIX BUSINESS SLUGS to match Frontend
-- This updates the database slugs to match what the 'BusinessPage' is looking for.

UPDATE business_lines SET slug = 'alur-distribusi' WHERE slug = 'distribution-flow';
UPDATE business_lines SET slug = 'target-pasar' WHERE slug = 'target-market';
UPDATE business_lines SET slug = 'distribusi-alkes' WHERE slug = 'medical-equipment-core';
UPDATE business_lines SET slug = 'distribusi-farmasi' WHERE slug = 'pharma-general';
UPDATE business_lines SET slug = 'produk-konsumen' WHERE slug = 'consumer-health-core';
UPDATE business_lines SET slug = 'strategi-bisnis' WHERE slug = 'business-strategy';

-- Fallback: If previous migration used different IDs or names, try these alternatives
UPDATE business_lines SET slug = 'distribusi-alkes' WHERE slug = 'medical-instruments' AND NOT EXISTS (SELECT 1 FROM business_lines WHERE slug = 'distribusi-alkes');
UPDATE business_lines SET slug = 'distribusi-farmasi' WHERE slug = 'pharma-prescription' AND NOT EXISTS (SELECT 1 FROM business_lines WHERE slug = 'distribusi-farmasi');
