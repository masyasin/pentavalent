
-- Add pdf_url column to news table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'pdf_url') THEN
        ALTER TABLE public.news ADD COLUMN pdf_url TEXT;
    END IF;
END $$;
