const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateContactSlides() {
    console.log('Building update for Contact Page Slides...');

    // 1. Delete existing slides for Contact page to avoid duplicates
    console.log('Removing old Contact slides...');
    const { error: deleteError } = await supabase
        .from('hero_slides')
        .delete()
        .eq('cta_secondary_link', '/contact');

    if (deleteError) {
        console.error('Error deleting old slides:', deleteError.message);
        return;
    }

    // 2. Define new "Bonafide" Office Building Slides
    // Using high-end architectural images from Unsplash
    const slides = [
        {
            title_id: 'Pusat Operasional Utama',
            title_en: 'Main Operational Headquarters',
            subtitle_id: 'Gedung perkantoran modern yang merefleksikan komitmen kami terhadap inovasi dan keunggulan.',
            subtitle_en: 'Modern office building reflecting our commitment to innovation and excellence.',
            // Image: Modern high-rise glass building, looking up, blue sky
            image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Lokasi Kami',
            cta_primary_text_en: 'Our Location',
            cta_primary_link: '#map',
            cta_secondary_text_id: 'Hubungi',
            cta_secondary_text_en: 'Contact Us',
            cta_secondary_link: '/contact',
            sort_order: 1,
            is_active: true
        },
        {
            title_id: 'Infrastruktur Kelas Dunia',
            title_en: 'World-Class Infrastructure',
            subtitle_id: 'Fasilitas berstandar internasional untuk mendukung layanan distribusi ke seluruh negeri.',
            subtitle_en: 'International standard facilities to support nationwide distribution services.',
            // Image: Sleek corporate exterior, glass and steel, very premium
            image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Fasilitas',
            cta_primary_text_en: 'Facilities',
            cta_primary_link: '#facilities',
            cta_secondary_text_id: 'Info',
            cta_secondary_text_en: 'Info',
            cta_secondary_link: '/contact',
            sort_order: 2,
            is_active: true
        },
        {
            title_id: 'Layanan Profesional',
            title_en: 'Professional Services',
            subtitle_id: 'Tim kami siap menyambut Anda di kantor pusat kami yang representatif.',
            subtitle_en: 'Our team is ready to welcome you at our representative headquarters.',
            // Image: Modern building facade with sunlight/reflection, widely used for "enterprise" look
            image_url: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Jadwalkan Temu',
            cta_primary_text_en: 'Schedule Meeting',
            cta_primary_link: '#form',
            cta_secondary_text_id: 'Kontak',
            cta_secondary_text_en: 'Contact',
            cta_secondary_link: '/contact',
            sort_order: 3,
            is_active: true
        }
    ];

    console.log('Inserting 3 new Contact slides...');
    const { error: insertError } = await supabase.from('hero_slides').insert(slides);

    if (insertError) {
        console.error('Error inserting slides:', insertError.message);
    } else {
        console.log('✅ Contact Page Slides updated with 3 Premium Office images!');
    }
}

updateContactSlides();
