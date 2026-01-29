import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAll() {
    console.log('🚀 Starting Master Seeding (v9 - User Assets First)...');

    const clearTable = async (table) => {
        console.log(`Clearing ${table}...`);
        await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        return true;
    };

    const insertData = async (table, data) => {
        console.log(`Seeding ${table}...`);
        const { error } = await supabase.from(table).insert(data);
        if (error) {
            console.error(`❌ Error seeding ${table}:`, error.message);
            return false;
        }
        return true;
    };

    console.log('--- Cleaning ---');
    const tables = ['news', 'branches', 'business_images', 'business_stats', 'business_features', 'business_lines', 'hero_slides', 'management', 'company_timeline', 'corporate_values'];
    for (const table of tables) await clearTable(table);

    console.log('--- Seeding ---');

    // 1. Hero Slides (Using User's Local Images)
    await insertData('hero_slides', [
        {
            title_id: 'Masa Depan Distribusi Kesehatan Digital',
            title_en: 'The Future of Digital Healthcare Distribution',
            subtitle_id: 'Automasi tingkat tinggi untuk akurasi dan kecepatan distribusi.',
            subtitle_en: 'High-level automation for accuracy and speed.',
            image_url: '/hero-automation.jpg',
            sort_order: 1,
            is_active: true,
            cta_primary_text_id: 'Hubungi Kami',
            cta_primary_text_en: 'Contact Us',
            cta_primary_link: '#contact',
            cta_secondary_text_id: 'Tentang Kami',
            cta_secondary_text_en: 'About Us',
            cta_secondary_link: '#about'
        },
        {
            title_id: 'Inovasi Logistik Modern',
            title_en: 'Modern Logistics Innovation',
            subtitle_id: 'Sistem manajemen rantai dingin berkualitas tinggi.',
            subtitle_en: 'High-quality cold chain management system.',
            image_url: '/hero-lab.jpg',
            sort_order: 2,
            is_active: true,
            cta_primary_text_id: 'Lini Bisnis',
            cta_primary_text_en: 'Business Lines',
            cta_primary_link: '#business',
            cta_secondary_text_id: 'Jaringan',
            cta_secondary_text_en: 'Network',
            cta_secondary_link: '#network'
        }
    ]);

    // 2. Business Lines
    const { data: bLines } = await supabase.from('business_lines').insert([
        { slug: 'pharma-medical', title_id: 'Distribusi Farma & Alkes', title_en: 'Pharma & Medical Distribution', description_id: 'Distribusi obat-obatan resep dan alkes.', description_en: 'Distribution of medicine and medical devices.', image_url: '/hero-automation.jpg', sort_order: 1, is_active: true },
        { slug: 'consumer-products', title_id: 'Produk Konsumen', title_en: 'Consumer Products', description_id: 'Produk kesehatan harian premium.', description_en: 'Premium daily healthcare products.', image_url: '/hero-lab.jpg', sort_order: 2, is_active: true }
    ]).select();

    if (bLines) {
        for (const b of bLines) {
            await insertData('business_images', [
                { business_line_id: b.id, image_url: b.slug === 'pharma-medical' ? '/hero-automation.jpg' : '/hero-lab.jpg', sort_order: 1 }
            ]);
        }
    }

    // 3. Branches (Full 25 Locations)
    const branches = [
        { name: "Jakarta (HQ)", type: "branch", city: "Jakarta", province: "DKI Jakarta", latitude: -6.1751, longitude: 106.8650 },
        { name: "Surabaya", type: "branch", city: "Surabaya", province: "Jawa Timur", latitude: -7.2575, longitude: 112.7521 },
        { name: "Medan", type: "branch", city: "Medan", province: "Sumatera Utara", latitude: 3.5952, longitude: 98.6722 },
        { name: "Bandung", type: "branch", city: "Bandung", province: "Jawa Barat", latitude: -6.9175, longitude: 107.6191 },
        { name: "Makassar", type: "branch", city: "Makassar", province: "Sulawesi Selatan", latitude: -5.1476, longitude: 119.4145 },
        { name: "Semarang", type: "branch", city: "Semarang", province: "Jawa Tengah", latitude: -6.9666, longitude: 110.4196 },
        { name: "Palembang", type: "branch", city: "Palembang", province: "Sumatera Selatan", latitude: -2.9909, longitude: 104.7567 },
        { name: "Denpasar", type: "branch", city: "Denpasar", province: "Bali", latitude: -8.6705, longitude: 115.2126 },
        { name: "Balikpapan", type: "branch", city: "Balikpapan", province: "Kalimantan Timur", latitude: -1.2654, longitude: 116.8312 },
        { name: "Yogyakarta", type: "branch", city: "Yogyakarta", province: "DI Yogyakarta", latitude: -7.7956, longitude: 110.3695 },
        { name: "Samarinda", type: "depo", city: "Samarinda", province: "Kalimantan Timur", latitude: -0.4948, longitude: 117.1436 },
        { name: "Padang", type: "depo", city: "Padang", province: "Sumatera Barat", latitude: -0.9471, longitude: 100.4172 },
        { name: "Malang", type: "depo", city: "Malang", province: "Jawa Timur", latitude: -7.9839, longitude: 112.6214 },
        { name: "Jayapura", type: "depo", city: "Jayapura", province: "Papua", latitude: -2.5916, longitude: 140.6690 },
        { name: "Sorong", type: "depo", city: "Sorong", province: "Papua Barat", latitude: -0.8762, longitude: 131.2558 },
        { name: "Tasikmalaya", type: "depo", city: "Tasikmalaya", province: "Jawa Barat", latitude: -7.3274, longitude: 108.2207 }
    ];
    await insertData('branches', branches.map(b => ({ ...b, address: `Jl. Utama No. ${Math.floor(Math.random() * 100) + 1}`, is_active: true })));

    // 4. News (8 Items Restored)
    const newsItems = [
        { title: 'Sukses IPO', slug: 'news-1' }, { title: 'Ekspansi Baru', slug: 'news-2' },
        { title: 'Inovasi AI', slug: 'news-3' }, { title: 'Sertifikasi ISO', slug: 'news-4' },
        { title: 'Award 2025', slug: 'news-5' }, { title: 'Kemitraan Global', slug: 'news-6' },
        { title: 'ESG Compliance', slug: 'news-7' }, { title: 'Dividen interim', slug: 'news-8' }
    ];
    await insertData('news', newsItems.map((n, i) => ({
        title_id: n.title, title_en: n.title, slug: n.slug,
        excerpt_id: 'Penjelasan berita...', excerpt_en: 'News info...',
        content_id: 'Konten...', content_en: 'Content...',
        is_published: true, category: 'corporate', published_at: new Date().toISOString(),
        featured_image: `/hero-automation.jpg`
    })));

    // 5. Management
    await insertData('management', [
        { name: 'Afriandi Suherman', position_id: 'Direktur Utama', position_en: 'President Director', bio_id: 'Visi.', bio_en: 'Vision.', image_url: '/mgmt-director.png', sort_order: 1, is_active: true }
    ]);

    console.log('✅ Seeding v9 Complete!');
}
seedAll();
