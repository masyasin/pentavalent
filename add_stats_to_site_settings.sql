ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS company_stats JSONB DEFAULT '[
  {"value": "55+", "label_id": "Tahun Pengalaman", "label_en": "Years of Experience", "icon": "Clock"},
  {"value": "34", "label_id": "Cabang & Depo", "label_en": "Branches & Depots", "icon": "Building2"},
  {"value": "14K+", "label_id": "Titik Distribusi", "label_en": "Distribution Points", "icon": "Users"},
  {"value": "2023", "label_id": "Melantai di Bursa", "label_en": "Publicly Listed", "icon": "TrendingUp"}
]'::jsonb;
