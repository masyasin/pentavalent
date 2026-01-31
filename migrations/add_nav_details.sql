-- Add description and icon columns to nav_menus
ALTER TABLE nav_menus ADD COLUMN IF NOT EXISTS description_id TEXT;
ALTER TABLE nav_menus ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE nav_menus ADD COLUMN IF NOT EXISTS icon TEXT;
