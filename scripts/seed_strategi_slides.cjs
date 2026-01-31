
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedStrategiSlides() {
    console.log('🚀 Seeding Hero Slides for Strategi Usaha...');

    const slides = [
        {
            title_id: 'Pertumbuhan Berkelanjutan',
            title_en: 'Sustainable Growth',
            subtitle_id: 'Visi strategis untuk menjadi pemimpin pasar dalam distribusi kesehatan.',
            subtitle_en: 'Strategic vision to be the market leader in healthcare distribution.',
            image_url: 'https://images.unsplash.com/photo-1507679799987-c7377eb56496?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Lihat Strategi',
            cta_primary_text_en: 'View Strategy',
            cta_primary_link: '#strategy',
            cta_secondary_text_id: 'Hubungi Kami',
            cta_secondary_text_en: 'Contact Us',
            cta_secondary_link: '/business/strategi-usaha',
            sort_order: 1,
            is_active: true
        },
        {
            title_id: 'Ekspansi Jaringan Nasional',
            title_en: 'National Network Expansion',
            subtitle_id: 'Terus memperluas jangkauan untuk melayani seluruh pelosok Indonesia.',
            subtitle_en: 'Continuously expanding reach to serve every corner of Indonesia.',
            image_url: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Jaringan Kami',
            cta_primary_text_en: 'Our Network',
            cta_primary_link: '#network',
            cta_secondary_text_id: 'Pelajari',
            cta_secondary_text_en: 'Learn More',
            cta_secondary_link: '/business/strategi-usaha',
            sort_order: 2,
            is_active: true
        }
    ];

    console.log('Inserting hero slides...');
    const { error } = await supabase.from('hero_slides').insert(slides);

    if (error) {
        console.error('Error inserting slides:', error.message);
    } else {
        console.log('✅ Strategi Usaha Hero Slides seeded successfully!');
    }
}

seedStrategiSlides();
