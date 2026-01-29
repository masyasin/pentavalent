-- Seed Data for PT. Penta Valent Tbk

-- 1. Insert Branches
INSERT INTO branches (name, type, city, province, address, phone, email, latitude, longitude)
VALUES 
('Kantor Pusat (HQ)', 'branch', 'Jakarta Barat', 'DKI Jakarta', 'Kawasan Industri Kedoya, Jakarta', '021-1234567', 'info@pentavalent.co.id', -6.1751, 106.8272),
('Cabang Surabaya', 'branch', 'Surabaya', 'Jawa Timur', 'Kawasan Industri Rungkut, Surabaya', '031-7654321', 'surabaya@pentavalent.co.id', -7.2575, 112.7521),
('Depo Medan', 'depo', 'Medan', 'Sumatera Utara', 'Jl. Gatot Subroto, Medan', '061-9876543', 'medan@pentavalent.co.id', 3.5952, 98.6722);

-- 2. Insert Partners
INSERT INTO partners (name, partner_type, website, sort_order)
VALUES 
('Principal Global Medicines', 'international', 'https://example.com', 1),
('Apotek Sehat Jaya', 'principal', 'https://example.com', 2),
('BioHealth Solutions', 'principal', 'https://example.com', 3);

-- 3. Insert News
INSERT INTO news (title_id, title_en, slug, excerpt_id, excerpt_en, content_id, content_en, category, is_published)
VALUES 
('PT. Penta Valent Tbk Raih Penghargaan Distributor Terbaik 2025', 'PT. Penta Valent Tbk Won Best Distributor Award 2025', 'award-distributor-terbaik-2025', 'Kami bangga mengumumkan pencapaian terbaru kami...', 'We are proud to announce our latest achievement...', 'Konten lengkap berita...', 'Full news content...', 'award', true),
('Ekspansi Depo Baru di Wilayah Kalimantan', 'New Depot Expansion in Kalimantan Region', 'ekspansi-kalimantan', 'Untuk meningkatkan layanan, kami membuka depo baru...', 'To improve service, we are opening a new depot...', 'Konten lengkap berita ekspansi...', 'Full expansion news content...', 'expansion', true);

-- 4. Insert Certifications
INSERT INTO certifications (name, description_id, description_en, certificate_number)
VALUES 
('CDOB (Cara Distribusi Obat yang Baik)', 'Sertifikasi nasional untuk standar distribusi farmasi.', 'National certification for pharmaceutical distribution standards.', 'CDOB-2024-001'),
('ISO 9001:2015', 'Sertifikasi manajemen mutu internasional.', 'International quality management certification.', 'ISO-QMS-2024-XYZ');

-- 5. Insert Careers (Jika tabel career sudah dibuat, jika belum lewati bagian ini)
-- Note: master_schema belum memiliki tabel careers, jadi kita abaikan dulu bagian ini
-- atau tambahkan ke master_schema jika diperlukan.
