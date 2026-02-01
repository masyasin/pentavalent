-- Create request_header function if it doesn't exist
CREATE OR REPLACE FUNCTION public.request_header(header text)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT current_setting('request.headers', true)::json->>header;
$$;

-- Create investor_calendar table
CREATE TABLE IF NOT EXISTS public.investor_calendar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_type TEXT NOT NULL, -- 'Earnings', 'Corporate', 'Meeting', etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.investor_calendar ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Allow public read access" ON public.investor_calendar;
CREATE POLICY "Allow public read access" ON public.investor_calendar
    FOR SELECT USING (true);

-- Allow full access to authenticated users (admins) or via secret header
DROP POLICY IF EXISTS "Allow admin full access" ON public.investor_calendar;
CREATE POLICY "Allow admin full access" ON public.investor_calendar
    FOR ALL USING (
        (public.request_header('x-admin-secret') = 'penta-valent-admin-2024')
        OR (auth.role() = 'authenticated')
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_investor_calendar_updated_at
    BEFORE UPDATE ON public.investor_calendar
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed initial data
INSERT INTO public.investor_calendar (title_id, title_en, event_date, event_type)
VALUES 
('Rilis Laporan Keuangan Tahunan 2024', 'Annual Financial Results Release 2024', '2025-03-15', 'Earnings'),
('Rapat Umum Pemegang Saham Tahunan', 'Annual General Meeting', '2025-04-22', 'Corporate'),
('Petiaran Q1 2025', 'Q1 2025 Earnings Call', '2025-05-10', 'Meeting');
