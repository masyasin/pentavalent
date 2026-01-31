
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedInvestorHeroSlides() {
    console.log('🚀 Seeding Investor Relations hero slides...');

    const slides = [
        {
            title_id: 'Ringkasan Kinerja Keuangan',
            title_en: 'Financial Highlights',
            subtitle_id: 'Transparansi dalam pertumbuhan nilai berkelanjutan PT Pentavalent.',
            subtitle_en: 'Transparency in sustainable value growth of PT Pentavalent.',
            image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Lihat Data',
            cta_primary_text_en: 'View Data',
            cta_primary_link: '/investor/ringkasan-investor',
            cta_secondary_text_id: 'Download Laporan',
            cta_secondary_text_en: 'Download Report',
            cta_secondary_link: '/investor/ringkasan-investor',
            is_active: true,
            sort_order: 1
        },
        {
            title_id: 'Informasi Saham PENT',
            title_en: 'PENT Stock Information',
            subtitle_id: 'Pantau pergerakan nilai investasi Anda secara real-time.',
            subtitle_en: 'Monitor your investment value movement in real-time.',
            image_url: 'https://images.unsplash.com/photo-1611974714013-3c7457018fca?auto=format&fit=crop&q=80&w=2000',
            cta_primary_link: '/investor/informasi-saham',
            cta_secondary_link: '/investor/informasi-saham',
            is_active: true,
            sort_order: 1
        },
        {
            title_id: 'Laporan Keuangan & Tahunan',
            title_en: 'Financial & Annual Reports',
            subtitle_id: 'Dokumen komprehensif mengenai akuntabilitas dan performa korporasi.',
            subtitle_en: 'Comprehensive documents on corporate accountability and performance.',
            image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000',
            cta_primary_link: '/investor/laporan-keuangan',
            cta_secondary_link: '/investor/laporan-keuangan',
            is_active: true,
            sort_order: 1
        },
        {
            title_id: 'Prospektus Perusahaan',
            title_en: 'Company Prospectus',
            subtitle_id: 'Informasi mendalam mengenai model bisnis dan potensi pertumbuhan.',
            subtitle_en: 'In-depth information on business models and growth potential.',
            image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000',
            cta_primary_link: '/investor/prospektus',
            cta_secondary_link: '/investor/prospektus',
            is_active: true,
            sort_order: 1
        },
        {
            title_id: 'Rapat Umum Pemegang Saham',
            title_en: 'General Meetings of Shareholders',
            subtitle_id: 'Forum pengambilan keputusan strategis demi masa depan perusahaan.',
            subtitle_en: 'Forum for strategic decision making for the company future.',
            image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2000',
            cta_primary_link: '/investor/rups',
            cta_secondary_link: '/investor/rups',
            is_active: true,
            sort_order: 1
        },
        {
            title_id: 'Keterbukaan Informasi',
            title_en: 'Information Disclosure',
            subtitle_id: 'Berita dan fakta material terkini kepada publik dan pemegang saham.',
            subtitle_en: 'Latest material news and facts to the public and shareholders.',
            image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000',
            cta_primary_link: '/investor/keterbukaan-informasi',
            cta_secondary_link: '/investor/keterbukaan-informasi',
            is_active: true,
            sort_order: 1
        }
    ];

    const { data, error } = await supabase.from('hero_slides').insert(slides).select();

    if (error) {
        console.error('❌ Error inserting slides:', error);
    } else {
        console.log('✅ Successfully inserted slides:', data.length);
    }
}

seedInvestorHeroSlides();
