-- Management Table
CREATE TABLE IF NOT EXISTS management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position_id TEXT NOT NULL,
    position_en TEXT NOT NULL,
    bio_id TEXT NOT NULL,
    bio_en TEXT NOT NULL,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE management ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON management FOR SELECT USING (is_active = true);
