-- Create tables for Good Corporate Governance (GCG)

-- GCG Principles Table
CREATE TABLE IF NOT EXISTS gcg_principles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_id TEXT NOT NULL,
    description_en TEXT NOT NULL,
    icon_name TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Board of Commissioners Table
CREATE TABLE IF NOT EXISTS board_of_commissioners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position_id TEXT NOT NULL,
    position_en TEXT NOT NULL,
    commissioner_type TEXT DEFAULT 'independent', -- independent, non_independent
    bio_id TEXT,
    bio_en TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Board of Directors Table (if not exists)
CREATE TABLE IF NOT EXISTS board_of_directors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position_id TEXT NOT NULL,
    position_en TEXT NOT NULL,
    bio_id TEXT,
    bio_en TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- GCG Committees Table
CREATE TABLE IF NOT EXISTS gcg_committees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_id TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_id TEXT,
    description_en TEXT,
    chairman_name TEXT,
    members TEXT[], -- Array of member names
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- GCG Policies Table
CREATE TABLE IF NOT EXISTS gcg_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    category TEXT NOT NULL, -- ethics, compliance, risk_management, etc.
    description_id TEXT,
    description_en TEXT,
    document_url TEXT,
    effective_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE gcg_principles ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_of_commissioners ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_of_directors ENABLE ROW LEVEL SECURITY;
ALTER TABLE gcg_committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE gcg_policies ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies
DROP POLICY IF EXISTS "Public Read Access" ON gcg_principles;
CREATE POLICY "Public Read Access" ON gcg_principles FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public Read Access" ON board_of_commissioners;
CREATE POLICY "Public Read Access" ON board_of_commissioners FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public Read Access" ON board_of_directors;
CREATE POLICY "Public Read Access" ON board_of_directors FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public Read Access" ON gcg_committees;
CREATE POLICY "Public Read Access" ON gcg_committees FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public Read Access" ON gcg_policies;
CREATE POLICY "Public Read Access" ON gcg_policies FOR SELECT USING (is_active = true);

-- Enable Seeding Policies
CREATE POLICY "Enable insert for all" ON gcg_principles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON gcg_principles FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON gcg_principles FOR DELETE USING (true);

CREATE POLICY "Enable insert for all" ON board_of_commissioners FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON board_of_commissioners FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON board_of_commissioners FOR DELETE USING (true);

CREATE POLICY "Enable insert for all" ON board_of_directors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON board_of_directors FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON board_of_directors FOR DELETE USING (true);

CREATE POLICY "Enable insert for all" ON gcg_committees FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON gcg_committees FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON gcg_committees FOR DELETE USING (true);

CREATE POLICY "Enable insert for all" ON gcg_policies FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON gcg_policies FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON gcg_policies FOR DELETE USING (true);
