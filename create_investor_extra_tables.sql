-- SQL for Investor Highlights and Corporate Calendar
-- Run this in Supabase SQL Editor

-- 1. Investor Highlights (Financial Stats)
CREATE TABLE IF NOT EXISTS investor_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label_id TEXT NOT NULL,
    label_en TEXT NOT NULL,
    value TEXT NOT NULL,
    growth TEXT,
    icon_name TEXT DEFAULT 'Activity',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Corporate Calendar (Events)
CREATE TABLE IF NOT EXISTS investor_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_type TEXT DEFAULT 'General', -- Earnings, Corporate, Meeting, etc.
    location_id TEXT,
    location_en TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Stock Information (Historical / Summary)
CREATE TABLE IF NOT EXISTS investor_stock_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    open_price DECIMAL(12, 2),
    high_price DECIMAL(12, 2),
    low_price DECIMAL(12, 2),
    close_price DECIMAL(12, 2) NOT NULL,
    volume BIGINT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE investor_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_stock_data ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Access" ON investor_highlights FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Access" ON investor_calendar FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Access" ON investor_stock_data FOR SELECT USING (true);

-- Admin Access
CREATE POLICY "Enable all for all" ON investor_highlights FOR ALL USING (true);
CREATE POLICY "Enable all for all" ON investor_calendar FOR ALL USING (true);
CREATE POLICY "Enable all for all" ON investor_stock_data FOR ALL USING (true);
