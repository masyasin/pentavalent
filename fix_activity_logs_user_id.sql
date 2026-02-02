-- FIX: Change user_id column type to TEXT in user_activity_logs
-- This allows supporting custom string IDs (like 'admin-123') and avoids 400 Bad Request errors

ALTER TABLE public.user_activity_logs ALTER COLUMN user_id TYPE TEXT;

-- Verify the change
COMMENT ON COLUMN public.user_activity_logs.user_id IS 'Stored as TEXT to support both UUIDs and custom string IDs';
