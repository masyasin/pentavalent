-- Create News Comments Table
CREATE TABLE IF NOT EXISTS news_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    news_id UUID REFERENCES news(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES news_comments(id) ON DELETE CASCADE,
    is_approved BOOLEAN DEFAULT true, -- Default to true for simplicity, change to false for moderation
    is_admin_reply BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Allow anyone to read approved comments
CREATE POLICY "Allow public read approved comments" ON news_comments
    FOR SELECT USING (is_approved = true);

-- Allow anyone to post comments
CREATE POLICY "Allow public insert comments" ON news_comments
    FOR INSERT WITH CHECK (true);

-- Allow admins full access
CREATE POLICY "Allow service role full access on comments" ON news_comments
    USING (true)
    WITH CHECK (true);
