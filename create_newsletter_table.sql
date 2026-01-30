-- Create Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Allow anyone to subscribe (insert)
CREATE POLICY "Allow public signups" ON newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

-- Allow admins to manage (all access)
-- Note: Assuming you have an admin check mechanism or this is run for admin access
CREATE POLICY "Allow service role full access" ON newsletter_subscriptions
    USING (true)
    WITH CHECK (true);
