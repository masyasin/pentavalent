-- Comprehensive RLS Policy Refresh
-- This script ensures Public Read Access is enabled for ALL dynamic content tables.

-- Function to safely enable public read access
CREATE OR REPLACE PROCEDURE enable_public_read(tbl_name text)
LANGUAGE plpgsql
AS $$
BEGIN
    BEGIN
        -- Enable RLS
        EXECUTE 'ALTER TABLE ' || tbl_name || ' ENABLE ROW LEVEL SECURITY';
        -- Drop existing policy if any
        EXECUTE 'DROP POLICY IF EXISTS "Public Read Access" ON ' || tbl_name;
        -- Create new permissive policy
        EXECUTE 'CREATE POLICY "Public Read Access" ON ' || tbl_name || ' FOR SELECT USING (true)';
        -- Grant permission to anon and authenticated
        EXECUTE 'GRANT SELECT ON ' || tbl_name || ' TO anon, authenticated';
    EXCEPTION WHEN undefined_table THEN
        -- Verify via information schema just in case, but usually just ignore
        RAISE NOTICE 'Table % does not exist, skipping.', tbl_name;
    END;
END;
$$;

-- Apply to all relevant tables
CALL enable_public_read('contact_messages');
CALL enable_public_read('job_applications');
CALL enable_public_read('business_lines');
CALL enable_public_read('business_images');
CALL enable_public_read('business_stats');
CALL enable_public_read('business_features');
CALL enable_public_read('business_advantages');
CALL enable_public_read('news');
CALL enable_public_read('page_banners');
CALL enable_public_read('site_settings');
CALL enable_public_read('careers');
CALL enable_public_read('partners');

-- Additional tables that might be causing "Not Found" if missing policies
CALL enable_public_read('management_teams');
CALL enable_public_read('company_milestones');
CALL enable_public_read('company_values');
CALL enable_public_read('certifications');
CALL enable_public_read('networks');
CALL enable_public_read('investor_stats');
CALL enable_public_read('investor_documents');
CALL enable_public_read('investor_shareholders');

-- Clean up helper procedure
DROP PROCEDURE enable_public_read;
