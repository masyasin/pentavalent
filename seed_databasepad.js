import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sonqawatrvahcomthxfn.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjAxOWFjNDk0LWNiYTYtNDNkNy05M2U2LWYwNGNmYzQyOWM0MCJ9.eyJwcm9qZWN0SWQiOiJzb25xYXdhdHJ2YWhjb210aHhmbiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5NjA1MDI4LCJleHAiOjIwODQ5NjUwMjgsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.kr_i_V7Bhn49deuhh6YIaXUS6S7nRr1WB1ZEGxBH0cE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAll() {
    console.log('🚀 Starting Master Seeding to DatabasePad...');

    // Cleanup helper with existence check
    const clearTable = async (table) => {
        const { error: checkErr } = await supabase.from(table).select('id').limit(1);
        if (checkErr && checkErr.code === '42P01') {
            console.log(`⚠️ Skipping ${table} (Relation does not exist)`);
            return false;
        }

        console.log(`Clearing ${table}...`);
        const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) {
            console.error(`Error clearing ${table}:`, error.message);
            return false;
        }
        return true;
    };

    // Cleanup
    console.log('Clearing old data...');
    // We keep branches because it has 38 rows of data we don't want to lose
    await clearTable('hero_slides');
    await clearTable('company_timeline');
    await clearTable('corporate_values');
    await clearTable('management');
    await clearTable('news');

    // 1. Management
    console.log('Seeding management...');
    const { error: mgmtErr } = await supabase.from('management').insert([
        { name: 'Afriandi Suherman', position_id: 'Direktur Utama', position_en: 'President Director', bio_id: 'Memimpin visi strategis perusahaan.', bio_en: 'Leading the strategic vision.', image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400', sort_order: 1 },
        { name: 'Sartono', position_id: 'Direktur Operasional', position_en: 'Operations Director', bio_id: 'Efisiensi rantai pasok nasional.', bio_en: 'National supply chain efficiency.', image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', sort_order: 2 },
        { name: 'Linawati', position_id: 'Direktur Keuangan', position_en: 'Finance Director', bio_id: 'Strategi finansial perusahaan publik.', bio_en: 'Public company financial strategy.', image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', sort_order: 3 },
        { name: 'Herman Kusuma', position_id: 'Komisaris Utama', position_en: 'President Commissioner', bio_id: 'Mengawasi tata kelola perusahaan.', bio_en: 'Overseeing corporate governance.', image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400', sort_order: 4 },
        { name: 'Dewi Lestari', position_id: 'Direktur Komersial', position_en: 'Commercial Director', bio_id: 'Mengatur strategi pemasaran global.', bio_en: 'Managing global marketing strategy.', image_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400', sort_order: 5 },
        { name: 'Ahmad Fauzi', position_id: 'Direktur Teknologi', position_en: 'Technology Director', bio_id: 'Inovasi sistem distribusi digital.', bio_en: 'Digital distribution system innovation.', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', sort_order: 6 },
        { name: 'Sarah Johnson', position_id: 'Komisaris Independen', position_en: 'Independent Commissioner', bio_id: 'Pakar hukum dan tata kelola internasional.', bio_en: 'International law and governance expert.', image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', sort_order: 7 },
        { name: 'Bambang Wijaya', position_id: 'Direktur Logistik', position_en: 'Logistics Director', bio_id: 'Optimasi jaringan suplai nasional.', bio_en: 'National supply chain optimization.', image_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=400', sort_order: 8 }
    ]);
    if (mgmtErr) console.error('Error seeding management:', mgmtErr.message);

    // 2. News Articles
    console.log('Seeding news articles...');
    const { error: newsErr } = await supabase.from('news').insert([
        {
            title_id: 'PT Penta Valent Tbk Raih Penghargaan Distributor Farmasi Terbaik 2025',
            title_en: 'PT Penta Valent Tbk Awarded Best Pharmaceutical Distributor 2025',
            slug: 'best-distributor-2025-' + Date.now(),
            content_id: 'Kami dengan bangga mengumumkan bahwa PT Penta Valent Tbk telah dianugerahi penghargaan sebagai Distributor Farmasi Terbaik Tahun 2025 oleh Asosiasi Logistik Kesehatan Indonesia.',
            content_en: 'We are proud to announce that PT Penta Valent Tbk has been awarded Best Pharmaceutical Distributor of the Year 2025 by the Indonesia Healthcare Logistics Association.',
            excerpt_id: 'Pencapaian luar biasa dalam menjaga standar distribusi kesehatan nasional.',
            excerpt_en: 'A remarkable achievement in maintaining national healthcare distribution standards.',
            featured_image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200',
            category: 'award',
            is_published: true,
            published_at: new Date().toISOString()
        },
        {
            title_id: 'Ekspansi Jaringan Distribusi: Pembukaan Depo Baru di wilayah Kalimantan',
            title_en: 'Distribution Network Expansion: Opening of New Depo in Kalimantan',
            slug: 'expansion-kalimantan-2026-' + Date.now(),
            content_id: 'Dalam upaya memperkuat jangkauan distribusi di wilayah Indonesia Tengah, kami secara resmi membuka depo logistik terbaru di Balikpapan.',
            content_en: 'In an effort to strengthen distribution reach in Central Indonesia, we have officially opened our latest logistics depo in Balikpapan.',
            excerpt_id: 'Memperkuat konektivitas kesehatan di wilayah Kalimantan dan sekitarnya.',
            excerpt_en: 'Strengthening healthcare connectivity in the Kalimantan region and surroundings.',
            featured_image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',
            category: 'expansion',
            is_published: true,
            published_at: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
            title_id: 'Transformasi Digital: Implementasi AI-Driven Warehouse Management',
            title_en: 'Digital Transformation: Implementing AI-Driven Warehouse Management',
            slug: 'ai-warehouse-management-' + Date.now(),
            content_id: 'PT Penta Valent Tbk terus berinovasi dengan mengintegrasikan kecerdasan buatan (AI) ke dalam sistem manajemen gudang kami.',
            content_en: 'PT Penta Valent Tbk continues to innovate by integrating artificial intelligence (AI) into our warehouse management systems.',
            excerpt_id: 'Menuju masa depan logistik kesehatan yang cerdas dan otomatis.',
            excerpt_en: 'Towards a smart and automated future of healthcare logistics.',
            featured_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
            category: 'partnership',
            is_published: true,
            published_at: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
            title_id: 'Laporan Keuangan Q4 2025: Pertumbuhan Pendapatan Signifikan',
            title_en: 'Q4 2025 Financial Report: Significant Revenue Growth',
            slug: 'financial-report-q4-2025-' + Date.now(),
            content_id: 'PT Penta Valent Tbk mencatatkan pertumbuhan pendapatan yang kuat pada kuartal keempat tahun 2025.',
            content_en: 'PT Penta Valent Tbk recorded strong revenue growth in the fourth quarter of 2025.',
            excerpt_id: 'Kinerja finansial yang solid mencerminkan kepercayaan pasar terhadap strategi perusahaan.',
            excerpt_en: 'Solid financial performance reflects market confidence in the company strategy.',
            featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
            category: 'investor',
            is_published: true,
            published_at: new Date(Date.now() - 86400000 * 10).toISOString()
        }
    ]);
    if (newsErr) console.error('Error seeding news articles:', newsErr.message);

    console.log('✅ Seeding complete!');
}

seedAll();
