import { createClient } from '@supabase/supabase-js';

// Use environment variables or hardcoded values if safe (here we use the one from src/lib/supabase.ts)
const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedNewsBanners() {
    console.log('Starting News Banners Seeding...');

    const banners = [
        {
            title_id: 'Inovasi Distribusi Kesehatan Melalui Teknologi AI',
            title_en: 'Healthcare Distribution Innovation Through AI Technology',
            subtitle_id: 'Meningkatkan efisiensi rantai pasok farmasi di seluruh penjuru Nusantara dengan sistem logistik cerdas.',
            subtitle_en: 'Enhancing pharmaceutical supply chain efficiency across the archipelago with intelligent logistics systems.',
            image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070',
            sort_order: 1,
            is_active: true
        },
        {
            title_id: 'Ekspansi Jaringan Nasional: 34 Cabang Utama',
            title_en: 'National Network Expansion: 34 Main Branches',
            subtitle_id: 'Memastikan ketersediaan produk kesehatan berkualitas tinggi menjangkau setiap provinsi dengan kecepatan dan integritas.',
            subtitle_en: 'Ensuring high-quality health product availability reaches every province with speed and integrity.',
            image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070',
            sort_order: 2,
            is_active: true
        },
        {
            title_id: 'Kemitraan Strategis Global untuk Masa Depan',
            title_en: 'Global Strategic Partnerships for the Future',
            subtitle_id: 'Berkolaborasi dengan produsen kesehatan kelas dunia untuk menghadirkan solusi pengobatan terbaik.',
            subtitle_en: 'Collaborating with world-class healthcare manufacturers to deliver the best medical solutions.',
            image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2070',
            sort_order: 3,
            is_active: true
        }
    ];

    for (const banner of banners) {
        const { error } = await supabase.from('news_banners').upsert(banner, { onConflict: 'title_en' });
        if (error) {
            console.error(`❌ Error seeding banner "${banner.title_en}":`, error.message);
        } else {
            console.log(`✅ Seeded banner: ${banner.title_en}`);
        }
    }

    console.log('News Banners Seeding complete!');
}

seedNewsBanners();
