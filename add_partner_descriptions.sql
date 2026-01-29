-- Add description columns to partners table
ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS description_id TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;
