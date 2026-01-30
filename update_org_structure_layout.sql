-- Add layout_type for Staff/Side nodes
alter table org_structure add column if not exists layout_type text default 'standard'; -- 'standard', 'staff_right', 'staff_left'
