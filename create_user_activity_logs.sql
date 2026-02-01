-- USER ACTIVITY & AUDIT LOGS TABLE
-- Records all administrative actions for accountability

CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    email TEXT,
    action TEXT NOT NULL, -- 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE'
    module TEXT, -- 'NEWS', 'CAREERS', 'SETTINGS', etc.
    details TEXT, -- Description of what was changed
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.user_activity_logs;
CREATE POLICY "Admins can view activity logs" ON public.user_activity_logs FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "System can insert activity logs" ON public.user_activity_logs;
CREATE POLICY "System can insert activity logs" ON public.user_activity_logs FOR INSERT WITH CHECK (true);

-- Grants
GRANT INSERT, SELECT ON public.user_activity_logs TO authenticated;
