-- Fix for missing google_maps_url column in branches table
-- This adds the missing column to allow saving/editing branches in the admin panel

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- Verify other columns exist just in case
ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
