-- Tables for Detailed Investor Stats (Ratios, Shareholders, Dividends)

-- 1. Key Financial Ratios (displayed on Stock Info page)
CREATE TABLE IF NOT EXISTS investor_ratios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL, -- e.g "P/E Ratio"
    value TEXT NOT NULL, -- e.g "12.4x"
    description_id TEXT, -- e.g "Rasio Harga per Laba"
    description_en TEXT, -- e.g "Price to Earnings"
    icon_name TEXT, -- Lucide icon name string
    sort_order INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Shareholder Composition
CREATE TABLE IF NOT EXISTS investor_shareholders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- e.g "PT Penta Valent Group"
    percentage DECIMAL(5,2) NOT NULL, -- e.g 65.20
    color_start TEXT, -- Tailwind color class or hex
    color_end TEXT, -- Tailwind color class or hex
    sort_order INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Dividend History
CREATE TABLE IF NOT EXISTS investor_dividend_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    amount TEXT NOT NULL, -- e.g "15 IDR/Share"
    sort_order INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE investor_ratios ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_shareholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_dividend_history ENABLE ROW LEVEL SECURITY;

-- Policies (Public Read, Admin Write)
CREATE POLICY "Public Read Ratios" ON investor_ratios FOR SELECT USING (true);
CREATE POLICY "Admin All Ratios" ON investor_ratios FOR ALL USING (true);

CREATE POLICY "Public Read Shareholders" ON investor_shareholders FOR SELECT USING (true);
CREATE POLICY "Admin All Shareholders" ON investor_shareholders FOR ALL USING (true);

CREATE POLICY "Public Read Dividends" ON investor_dividend_history FOR SELECT USING (true);
CREATE POLICY "Admin All Dividends" ON investor_dividend_history FOR ALL USING (true);

-- Functions (Optional: trigger to update updated_at)
