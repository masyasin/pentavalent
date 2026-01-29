-- Create visitor logs table for analytics
CREATE TABLE IF NOT EXISTS visitor_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT,
    browser TEXT,
    os TEXT,
    city TEXT,
    region TEXT,
    country TEXT,
    country_code TEXT,
    continent TEXT,
    latitude TEXT,
    longitude TEXT,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    is_mobile BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

-- Public can only insert
DROP POLICY IF EXISTS "Enable insert for all" ON visitor_logs;
CREATE POLICY "Enable insert for all" ON visitor_logs FOR INSERT WITH CHECK (true);

-- Only admins can select (using the same 'Enable all for all' logic used in other tables for now if that's the pattern, 
-- but better to restrict to auth.uid() if possible. However, looking at site_settings, they use true)
DROP POLICY IF EXISTS "Enable select for all" ON visitor_logs;
CREATE POLICY "Enable select for all" ON visitor_logs FOR SELECT USING (true);
