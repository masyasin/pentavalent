-- Add 'head_office' to branch_type enum
-- Note: This cannot be run in a transaction block in some versions of Postgres
-- but Supabase SQL editor handles it fine if run as a single command or script.

ALTER TYPE public.branch_type ADD VALUE IF NOT EXISTS 'head_office';
