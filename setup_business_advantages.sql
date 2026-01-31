-- Create Business Advantages Table
CREATE TABLE IF NOT EXISTS business_advantages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_line_id UUID NOT NULL REFERENCES business_lines(id) ON DELETE CASCADE,
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_id TEXT NOT NULL,
    description_en TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE business_advantages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read Access" ON business_advantages FOR SELECT USING (true);
CREATE POLICY "Enable insert for all" ON business_advantages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON business_advantages FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON business_advantages FOR DELETE USING (true);
