-- Add line_type column to support different relationship types (Command vs Coordination)
alter table org_structure add column if not exists line_type text default 'solid';
