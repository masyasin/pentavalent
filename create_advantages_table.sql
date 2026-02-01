-- Create table for competitive advantages
CREATE TABLE IF NOT EXISTS public.advantages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_id TEXT NOT NULL,
    description_en TEXT NOT NULL,
    icon TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.advantages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access on advantages"
    ON public.advantages FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated all access on advantages"
    ON public.advantages FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert initial data (from AboutSection.tsx)
INSERT INTO public.advantages (title_id, title_en, description_id, description_en, icon, sort_order)
VALUES 
('Skala Jaringan Nasional', 'National Network Scale', 'Didukung 34 cabang dan depo strategis untuk jangkauan seluruh Indonesia.', 'Supported by 34 strategic branches and depots for nationwide reach.', '🌐', 0),
('Sistem Operasional Digital', 'Digital Operational System', 'Infrastruktur logistik modern dengan monitoring real-time terintegrasi.', 'Modern logistics infrastructure with integrated real-time monitoring.', '⚙️', 1),
('Kepatuhan Kualitas Mutlak', 'Absolute Quality Compliance', 'Sertifikasi penuh CDOB, CDAKB, dan ISO 9001:2015 menjamin keamanan produk.', 'Full CDOB, CDAKB, and ISO 9001:2015 certifications ensure product safety.', '⚖️', 2),
('Rekam Jejak Teruji', 'Proven Track Record', 'Kepercayaan berkelanjutan melayani puluhan ribu outlet sejak 1968.', 'Enduring trust serving tens of thousands of outlets since 1968.', '📈', 3);
