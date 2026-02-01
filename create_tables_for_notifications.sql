-- Create contact_messages table if not exists
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    consultation_type TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies for contact_messages
-- Allow public to insert (contact form)
DROP POLICY IF EXISTS "Public Insert Access" ON contact_messages;
CREATE POLICY "Public Insert Access" ON contact_messages FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admin) to read, update, delete
DROP POLICY IF EXISTS "Authenticated Read Access" ON contact_messages;
CREATE POLICY "Authenticated Read Access" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated Update Access" ON contact_messages;
CREATE POLICY "Authenticated Update Access" ON contact_messages FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated Delete Access" ON contact_messages;
CREATE POLICY "Authenticated Delete Access" ON contact_messages FOR DELETE USING (auth.role() = 'authenticated');


-- Create job_status enum if not exists
DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create job_applications table if not exists
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id UUID REFERENCES careers(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    cover_letter TEXT,
    resume_url TEXT,
    status job_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for job_applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Policies for job_applications
-- Allow public to insert (job application form)
DROP POLICY IF EXISTS "Public Insert Access" ON job_applications;
CREATE POLICY "Public Insert Access" ON job_applications FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admin) to read, update, delete
DROP POLICY IF EXISTS "Authenticated Read Access" ON job_applications;
CREATE POLICY "Authenticated Read Access" ON job_applications FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated Update Access" ON job_applications;
CREATE POLICY "Authenticated Update Access" ON job_applications FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated Delete Access" ON job_applications;
CREATE POLICY "Authenticated Delete Access" ON job_applications FOR DELETE USING (auth.role() = 'authenticated');
