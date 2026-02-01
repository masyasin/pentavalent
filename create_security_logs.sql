-- CREATE SECURITY LOGS TABLE
-- This table will store all blocked malicious attempts for admin review

CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'MALICIOUS_ATTEMPT', 'SPAM_FILTERED'
    field_name TEXT,
    payload TEXT,
    page_url TEXT,
    user_agent TEXT,
    ip_address TEXT DEFAULT 'logged_by_client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public can insert logs" ON public.security_logs;
CREATE POLICY "Public can insert logs" ON public.security_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view logs" ON public.security_logs;
CREATE POLICY "Admins can view logs" ON public.security_logs FOR SELECT USING (auth.role() = 'authenticated');

-- Grants
GRANT INSERT ON public.security_logs TO anon, authenticated;
GRANT SELECT ON public.security_logs TO authenticated;
