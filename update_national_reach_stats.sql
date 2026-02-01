-- Update site_settings with national reach statistics
UPDATE site_settings 
SET company_stats = '[
  {"value": "34", "label_id": "Cabang Nasional", "label_en": "National Branches", "icon": "MapPin"},
  {"value": "21.000+", "label_id": "Outlet Farmasi", "label_en": "Pharma Outlets", "icon": "Pill"},
  {"value": "14.000+", "label_id": "Outlet Konsumsi", "label_en": "Consumer Outlets", "icon": "ShoppingBag"}
]'::jsonb
WHERE id = (SELECT id FROM site_settings LIMIT 1);
