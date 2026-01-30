-- Allow management_id to be null for text-only nodes
alter table org_structure alter column management_id drop not null;

-- Add columns for custom text labels
alter table org_structure add column if not exists custom_title text;
alter table org_structure add column if not exists custom_position text;
