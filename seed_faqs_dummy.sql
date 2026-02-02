-- Create FAQ table if not exists
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

-- Create policies (safe with IF NOT EXISTS or dropping first)
DROP POLICY IF EXISTS "Public Read Access" ON faqs;
CREATE POLICY "Public Read Access" ON faqs FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admins full access" ON faqs;
CREATE POLICY "Admins full access" ON faqs FOR ALL USING (true);

-- Seed dummy data for faqs table
INSERT INTO faqs (question_id, question_en, answer_id, answer_en, category, sort_order)
VALUES 
-- General Category
('Apa itu PT Penta Valent Tbk?', 
 'What is PT Penta Valent Tbk?', 
 'PT Penta Valent Tbk adalah distributor produk farmasi, alat kesehatan, dan produk konsumen terkemuka di Indonesia yang didirikan sejak tahun 1968.', 
 'PT Penta Valent Tbk is a leading distributor of pharmaceutical products, medical devices, and consumer goods in Indonesia, established since 1968.', 
 'general', 1),

('Di mana lokasi kantor pusat PT Penta Valent Tbk?', 
 'Where is PT Penta Valent Tbk headquarters located?', 
 'Kantor pusat kami berlokasi di Jl. Tanah Abang III No. 12, Jakarta Pusat, Indonesia.', 
 'Our headquarters is located at Jl. Tanah Abang III No. 12, Central Jakarta, Indonesia.', 
 'general', 2),

-- Business Category
('Apa saja lini bisnis utama PT Penta Valent Tbk?', 
 'What are the main business lines of PT Penta Valent Tbk?', 
 'Lini bisnis utama kami meliputi distribusi produk farmasi, peralatan medis (Medical Devices), dan produk kesehatan konsumen (Consumer & Health Products).', 
 'Our main business lines include the distribution of pharmaceutical products, medical devices, and consumer health products.', 
 'business', 1),

('Bagaimana cara menjadi mitra bisnis atau pemasok?', 
 'How can I become a business partner or supplier?', 
 'Anda dapat menghubungi tim pengembangan bisnis kami melalui formulir kontak di website atau mengirim email ke info@pentavalent.co.id untuk diskusi kemitraan.', 
 'You can contact our business development team through the contact form on our website or by emailing info@pentavalent.co.id for partnership discussions.', 
 'business', 2),

-- Investor Category
('Di bursa mana saham PT Penta Valent Tbk diperdagangkan?', 
 'On which exchange are PT Penta Valent Tbk shares traded?', 
 'Saham kami diperdagangkan di Bursa Efek Indonesia (BEI) dengan kode saham PEVE.', 
 'Our shares are traded on the Indonesia Stock Exchange (IDX) under the ticker symbol PEVE.', 
 'investor', 1),

('Di mana saya bisa mendapatkan laporan tahunan terbaru?', 
 'Where can I get the latest annual report?', 
 'Laporan tahunan terbaru dapat diunduh di bagian Hubungan Investor pada website kami dalam sub-menu Laporan Keuangan.', 
 'The latest annual report can be downloaded from the Investor Relations section of our website under the Financial Reports sub-menu.', 
 'investor', 2),

-- Career Category
('Bagaimana cara melamar pekerjaan di PT Penta Valent Tbk?', 
 'How do I apply for a job at PT Penta Valent Tbk?', 
 'Anda dapat melihat lowongan yang tersedia dan melamar langsung melalui halaman Karir di website kami.', 
 'You can view available openings and apply directly through the Careers page on our website.', 
 'career', 1),

('Apakah PT Penta Valent Tbk memiliki program magang?', 
 'Does PT Penta Valent Tbk have an internship program?', 
 'Ya, kami membuka peluang magang bagi mahasiswa tingkat akhir secara periodik. Silakan cek halaman Karir kami untuk informasi terbaru.', 
 'Yes, we periodically offer internship opportunities for final-year students. Please check our Careers page for the latest information.', 
 'career', 2),

-- Other Category
('Apakah website ini menggunakan cookie?', 
 'Does this website use cookies?', 
 'Ya, kami menggunakan cookie untuk meningkatkan pengalaman pengguna dan menganalisis trafik website. Detailnya dapat dilihat pada Kebijakan Privasi kami.', 
 'Yes, we use cookies to improve user experience and analyze website traffic. Details can be found in our Privacy Policy.', 
 'other', 1);
