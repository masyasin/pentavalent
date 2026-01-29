-- Create FAQ table
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id TEXT NOT NULL,
    question_en TEXT NOT NULL,
    answer_id TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('general', 'business', 'investor', 'career', 'other')),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public Read Access" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins full access" ON faqs FOR ALL USING (true);


-- Create Trigger for updated_at
CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
