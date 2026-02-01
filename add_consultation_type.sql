-- Add tables to supabase_realtime publication to enable listening to changes
-- BEGIN;
--   DROP PUBLICATION IF EXISTS supabase_realtime;
--   CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
-- COMMIT;

-- Safer approach:
-- Make sure the publication exists first (if not, create it)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
    END IF;
END
$$;

ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE job_applications;

-- Add consultation_type column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'contact_messages'
        AND column_name = 'consultation_type'
    ) THEN
        ALTER TABLE contact_messages ADD COLUMN consultation_type TEXT;
    END IF;
END $$;

-- Reload schema cache (notify PostgREST)
NOTIFY pgrst, 'reload config';
