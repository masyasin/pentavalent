-- Add missing tables for Careers and Investor Documents
CREATE TABLE IF NOT EXISTS careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    employment_type TEXT DEFAULT 'full_time',
    description_id TEXT NOT NULL,
    description_en TEXT NOT NULL,
    requirements_id TEXT,
    requirements_en TEXT,
    deadline DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    cover_letter TEXT,
    resume_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS investor_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    document_type TEXT NOT NULL, -- annual_report, quarterly_report, prospectus, gcg, etc.
    year INTEGER NOT NULL,
    quarter TEXT,
    file_url TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access" ON careers;
CREATE POLICY "Public Read Access" ON careers FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public Read Access" ON investor_documents;
CREATE POLICY "Public Read Access" ON investor_documents FOR SELECT USING (is_published = true);

-- Enable Seeding
CREATE POLICY "Enable insert for all" ON careers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON careers FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON careers FOR DELETE USING (true);

CREATE POLICY "Enable insert for all" ON job_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for all" ON investor_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON investor_documents FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON investor_documents FOR DELETE USING (true);
