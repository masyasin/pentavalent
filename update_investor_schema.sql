
-- Add is_active column if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investor_documents' AND column_name = 'is_active') THEN
        ALTER TABLE public.investor_documents ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Update constraint to accept new document types if check constraint exists
-- Assuming document_type is either text or has a check. If it's pure text, no enum update needed.
-- But safest is to just run this for new columns.
