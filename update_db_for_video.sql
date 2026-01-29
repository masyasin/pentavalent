-- Run this in your Supabase SQL Editor to enable Video Banners!

ALTER TABLE hero_slides 
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Verify it worked
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'hero_slides';
