import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sonqawatrvahcomthxfn.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjAxOWFjNDk0LWNiYTYtNDNkNy05M2U2LWYwNGNmYzQyOWM0MCJ9.eyJwcm9qZWN0SWQiOiJzb25xYXdhdHJ2YWhjb210aHhmbiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5NjA1MDI4LCJleHAiOjIwODQ5NjUwMjgsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.kr_i_V7Bhn49deuhh6YIaXUS6S7nRr1WB1ZEGxBH0cE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Starting Supabase Seeding...');

    // 1. Branches
    console.log('Seeding branches...');
    const { error: err1 } = await supabase.from('branches').insert([
        { name: 'Kantor Pusat (HQ)', branch_type: 'head_office', city: 'Jakarta Barat', province: 'DKI Jakarta', address: 'Kawasan Industri Kedoya, Jakarta', phone: '021-1234567', email: 'info@pentavalent.co.id', latitude: -6.1751, longitude: 106.8272 },
        { name: 'Cabang Surabaya', branch_type: 'branch', city: 'Surabaya', province: 'Jawa Timur', address: 'Kawasan Industri Rungkut, Surabaya', phone: '031-7654321', email: 'surabaya@pentavalent.co.id', latitude: -7.2575, longitude: 112.7521 },
        { name: 'Depo Medan', branch_type: 'depo', city: 'Medan', province: 'Sumatera Utara', address: 'Jl. Gatot Subroto, Medan', phone: '061-9876543', email: 'medan@pentavalent.co.id', latitude: 3.5952, longitude: 98.6722 }
    ]);
    if (err1) console.log('❌ Branches error:', err1.message);

    // 2. Partners
    console.log('Seeding partners...');
    const { error: err2 } = await supabase.from('partners').insert([
        { name: 'Principal Global Medicines', partner_type: 'international', website: 'https://example.com', sort_order: 1 },
        { name: 'Apotek Sehat Jaya', partner_type: 'principal', website: 'https://example.com', sort_order: 2 },
        { name: 'BioHealth Solutions', partner_type: 'principal', website: 'https://example.com', sort_order: 3 }
    ]);
    if (err2) console.log('❌ Partners error:', err2.message);

    // 3. News
    console.log('Seeding news...');
    const { error: err3 } = await supabase.from('news').insert([
        { title_id: 'PT. Penta Valent Tbk Raih Penghargaan Distributor Terbaik 2025', title_en: 'PT. Penta Valent Tbk Won Best Distributor Award 2025', slug: 'award-distributor-terbaik-2025', excerpt_id: 'Kami bangga mengumumkan pencapaian terbaru kami...', excerpt_en: 'We are proud to announce our latest achievement...', category: 'award', is_published: true },
        { title_id: 'Ekspansi Depo Baru di Wilayah Kalimantan', title_en: 'New Depot Expansion in Kalimantan Region', slug: 'ekspansi-kalimantan', excerpt_id: 'Untuk meningkatkan layanan, kami membuka depo baru...', excerpt_en: 'To improve service, we are opening a new depot...', category: 'expansion', is_published: true }
    ]);
    if (err3) console.log('❌ News error:', err3.message);

    // 4. Certifications
    console.log('Seeding certifications...');
    const { error: err4 } = await supabase.from('certifications').insert([
        { name: 'CDOB (Cara Distribusi Obat yang Baik)', description_id: 'Sertifikasi nasional untuk standar distribusi farmasi.', description_en: 'National certification for pharmaceutical distribution standards.', certificate_number: 'CDOB-2024-001' },
        { name: 'ISO 9001:2015', description_id: 'Sertifikasi manajemen mutu internasional.', description_en: 'International quality management certification.', certificate_number: 'ISO-QMS-2024-XYZ' }
    ]);
    if (err4) console.log('❌ Certifications error:', err4.message);

    // 5. Careers
    console.log('Seeding careers...');
    const { data: careers, error: err5 } = await supabase.from('careers').insert([
        { title: 'Sales Executive', department: 'Sales', location: 'Jakarta', employment_type: 'full_time', description_id: 'Bertanggung jawab atas target penjualan wilayah...', description_en: 'Responsible for regional sales targets...', is_active: true },
        { title: 'Warehouse Operator', department: 'Operations', location: 'Surabaya', employment_type: 'full_time', description_id: 'Mengelola stok dan pengiriman barang...', description_en: 'Managing stock and shipping...', is_active: true }
    ]).select();
    if (err5) console.log('❌ Careers error:', err5.message);

    // 6. Investor Documents
    console.log('Seeding documents...');
    const { error: err6 } = await supabase.from('investor_documents').insert([
        { title_id: 'Laporan Tahunan 2024', title_en: 'Annual Report 2024', document_type: 'annual_report', year: 2024, file_url: 'https://example.com/ar2024.pdf' },
        { title_id: 'Prospektus IPO', title_en: 'IPO Prospectus', document_type: 'prospectus', year: 2023, file_url: 'https://example.com/prospectus.pdf' }
    ]);
    if (err6) console.log('❌ Documents error:', err6.message);

    console.log('Seeding complete!');
}

seed();
