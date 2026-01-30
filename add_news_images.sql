-- Run this SQL in Supabase Dashboard SQL Editor
ALTER TABLE news ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
