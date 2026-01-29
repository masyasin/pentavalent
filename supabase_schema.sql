-- Database Schema for PT. Penta Valent Tbk
-- This script creates the necessary tables and enums in Supabase

-- 1. Create Enums for better data integrity
DO $$ BEGIN
    CREATE TYPE branch_type AS ENUM ('head_office', 'branch', 'depo');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE partner_type AS ENUM ('principal', 'international');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM ('annual_report', 'quarterly_report', 'prospectus');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'editor', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Tables

-- Branches Table
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    branch_type branch_type NOT NULL DEFAULT 'branch',
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Partners Table
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    partner_type partner_type NOT NULL DEFAULT 'principal',
    website TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- News Table
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt_id TEXT,
    excerpt_en TEXT,
    content_id TEXT,
    content_en TEXT,
    featured_image TEXT,
    category TEXT DEFAULT 'default',
    published_at TIMESTAMPTZ DEFAULT now(),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Careers Table
CREATE TABLE IF NOT EXISTS careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    employment_type TEXT NOT NULL,
    description_id TEXT,
    description_en TEXT,
    requirements_id TEXT,
    requirements_en TEXT,
    deadline TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Job Applications Table
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

-- Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description_id TEXT,
    description_en TEXT,
    certificate_number TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Investor Documents Table
CREATE TABLE IF NOT EXISTS investor_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    document_type document_type NOT NULL,
    year INTEGER NOT NULL,
    quarter TEXT,
    file_url TEXT NOT NULL,
    published_at TIMESTAMPTZ DEFAULT now(),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Users Table (for reference - actual auth may use Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'viewer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
-- For a simple setup, we'll allow public reads on content tables

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (Read-only)
CREATE POLICY "Public Read Access" ON branches FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Access" ON partners FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Access" ON news FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Access" ON careers FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Access" ON certifications FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Access" ON investor_documents FOR SELECT USING (is_published = true);

-- Policies for inserting data (e.g. Contact Form, Job App)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Insert Access" ON contact_messages FOR INSERT WITH CHECK (true);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Insert Access" ON job_applications FOR INSERT WITH CHECK (true);
