const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedPagesSlides() {
    console.log('🚀 Seeding Slides for Career and Contact...');

    const slides = [
        // CAREER
        {
            title_id: 'Bergabung Bersama Kami',
            title_en: 'Join Our Team',
            subtitle_id: 'Jadilah bagian dari visi kami untuk memajukan kesehatan Indonesia.',
            subtitle_en: 'Be part of our vision to advance Indonesia\'s healthcare.',
            image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Lihat Lowongan',
            cta_primary_text_en: 'View Openings',
            cta_primary_link: '#positions',
            cta_secondary_text_id: 'Karir',
            cta_secondary_text_en: 'Career',
            cta_secondary_link: '/career',
            sort_order: 1,
            is_active: true
        },
        {
            title_id: 'Kembangkan Potensi Anda',
            title_en: 'Grow Your Potential',
            subtitle_id: 'Lingkungan kerja yang mendukung inovasi dan profesionalisme.',
            subtitle_en: 'A work environment that supports innovation and professionalism.',
            image_url: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Budaya Kami',
            cta_primary_text_en: 'Our Culture',
            cta_primary_link: '#culture',
            cta_secondary_text_id: 'Pelajari',
            cta_secondary_text_en: 'Learn More',
            cta_secondary_link: '/career',
            sort_order: 2,
            is_active: true
        },

        // CONTACT
        {
            title_id: 'Hubungi Kami',
            title_en: 'Get in Touch',
            subtitle_id: 'Kami siap membantu memenuhi kebutuhan distribusi kesehatan Anda.',
            subtitle_en: 'We are ready to assist with your healthcare distribution needs.',
            image_url: 'https://images.unsplash.com/photo-1423666639041-f14d70fa4c5d?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Kirim Pesan',
            cta_primary_text_en: 'Send Message',
            cta_primary_link: '#form',
            cta_secondary_text_id: 'Kontak',
            cta_secondary_text_en: 'Contact',
            cta_secondary_link: '/contact',
            sort_order: 1,
            is_active: true
        },
        {
            title_id: 'Kantor Pusat',
            title_en: 'Headquarters',
            subtitle_id: 'Kunjungi kantor pusat kami untuk kolaborasi lebih lanjut.',
            subtitle_en: 'Visit our headquarters for further collaboration.',
            image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Lokasi',
            cta_primary_text_en: 'Location',
            cta_primary_link: '#map',
            cta_secondary_text_id: 'Info',
            cta_secondary_text_en: 'Info',
            cta_secondary_link: '/contact',
            sort_order: 2,
            is_active: true
        }
    ];

    console.log('Inserting hero slides...');
    const { error } = await supabase.from('hero_slides').insert(slides);

    if (error) {
        console.error('Error inserting slides:', error.message);
    } else {
        console.log('✅ Career & Contact Hero Slides seeded successfully!');
    }
}

seedPagesSlides();
