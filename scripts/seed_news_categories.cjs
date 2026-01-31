
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to generate slug
const slugify = (text) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

const dummyNews = [
    // --- NEWS (BERITA UMUM) ---
    {
        title_id: 'Penta Valent Perluas Jangkauan Distribusi di Indonesia Timur',
        title_en: 'Penta Valent Expands Distribution Reach in Eastern Indonesia',
        slug: 'penta-valent-expands-east-indonesia',
        content_id: '<p>PT Penta Valent Tbk resmi membuka cabang baru di Sorong dan Jayapura...</p>',
        content_en: '<p>PT Penta Valent Tbk officially opens new branches in Sorong and Jayapura...</p>',
        excerpt_id: 'Ekspansi strategis untuk menjangkau daerah terpencil.',
        excerpt_en: 'Strategic expansion to reach remote areas.',
        category: 'news',
        published_at: '2024-06-15',
        is_published: true,
        featured_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80'
    },
    {
        title_id: 'Kunjungan Kerja Direksi ke Fasilitas Logistik Baru',
        title_en: 'Board of Directors Visit to New Logistics Facility',
        slug: 'bod-visit-logistics',
        content_id: '<p>Direksi melakukan peninjauan kesiapan gudang pusat...</p>',
        content_en: '<p>The Board reviews the readiness of the central warehouse...</p>',
        excerpt_id: 'Memastikan standar kualitas GDP terjaga.',
        excerpt_en: 'Ensuring GDP quality standards are maintained.',
        category: 'news',
        published_at: '2023-11-20',
        is_published: true,
        featured_image: 'https://images.unsplash.com/photo-1566576912904-8004138f96e2?auto=format&fit=crop&q=80'
    },

    // --- PRESS RELEASE (SIARAN PERS) ---
    {
        title_id: 'Siaran Pers: Kinerja Keuangan Positif Tahun 2023',
        title_en: 'Press Release: Positive Financial Performance 2023',
        slug: 'press-release-financial-2023',
        content_id: '<p>Jakarta, 1 Maret 2024 - PT Penta Valent Tbk mengumumkan...</p><p><a href="#" class="btn-download">Download PDF Siaran Pers</a></p>',
        content_en: '<p>Jakarta, Mar 1, 2024 - PT Penta Valent Tbk announces...</p><p><a href="#" class="btn-download">Download Press Release PDF</a></p>',
        excerpt_id: 'Laba bersih meningkat 15% dibanding tahun sebelumnya.',
        excerpt_en: 'Net profit increased by 15% compared to the previous year.',
        category: 'press_release',
        published_at: '2024-03-01',
        is_published: true,
        featured_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80'
    },
    {
        title_id: 'Siaran Pers: Kerjasama Strategis dengan Principal Global',
        title_en: 'Press Release: Strategic Partnership with Global Principal',
        slug: 'press-release-partnership-global',
        content_id: '<p>Perseroan menandatangani kontrak eksklusif...</p><p><a href="#">Download PDF</a></p>',
        content_en: '<p>The Company signs exclusive contract...</p><p><a href="#">Download PDF</a></p>',
        excerpt_id: 'Menambah portofolio produk onkologi.',
        excerpt_en: 'Adding oncology product portfolio.',
        category: 'press_release',
        published_at: '2023-09-10',
        is_published: true,
        featured_image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80'
    },

    // --- CORPORATE NEWS (BERITA KORPORASI) ---
    {
        title_id: 'Perayaan HUT ke-55 Penta Valent',
        title_en: 'Penta Valent 55th Anniversary Celebration',
        slug: 'anniversary-55',
        content_id: '<p>Acara syukuran sederhana dengan karyawan...</p>',
        content_en: '<p>Simple thanksgiving event with employees...</p>',
        excerpt_id: 'Mengusung tema "Tumbuh Bersama".',
        excerpt_en: 'Carrying the theme "Growing Together".',
        category: 'corporate_news',
        published_at: '2023-09-01',
        is_published: true,
        featured_image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80'
    },
    {
        title_id: 'Program CSR: Pengobatan Gratis di Jakarta Utara',
        title_en: 'CSR Program: Free Medical Treatment in North Jakarta',
        slug: 'csr-free-treatment',
        content_id: '<p>Sebagai bentuk tanggung jawab sosial...</p>',
        content_en: '<p>As a form of social responsibility...</p>',
        excerpt_id: 'Melayani lebih dari 500 warga.',
        excerpt_en: 'Serving more than 500 residents.',
        category: 'corporate_news',
        published_at: '2022-12-15',
        is_published: true,
        featured_image: 'https://images.unsplash.com/photo-1584515933487-9bfa774883f4?auto=format&fit=crop&q=80'
    }
];

async function seedNews() {
    console.log('🔄 Seeding News with Categories (News, Press Release, Corporate)...');

    // Insert info DB
    for (const item of dummyNews) {
        // Check if slug exists
        const { data } = await supabase.from('news').select('id').eq('slug', item.slug).single();

        if (!data) {
            const { error } = await supabase.from('news').insert([item]);
            if (error) console.error('Error inserting:', item.slug, error);
            else console.log('Inserted:', item.slug);
        } else {
            const { error } = await supabase.from('news').update(item).eq('slug', item.slug);
            if (error) console.error('Error updating:', item.slug, error);
            else console.log('Updated:', item.slug);
        }
    }
    console.log('✅ News seeding completed!');
}

seedNews();
