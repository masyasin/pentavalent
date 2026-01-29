
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedHero() {
    console.log('🚀 Starting Hero Banner Seeding (6 SLIDES CONFIG)...');

    // 1. Clear existing
    await supabase.from('hero_slides').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Helper for Clean Slide (No Text, No Buttons)
    const cleanSlide = (titleId, sortOrder, videoUrl, imageUrl) => ({
        title_id: '', title_en: '',
        subtitle_id: '', subtitle_en: '',
        cta_primary_text_id: '', cta_primary_text_en: '', cta_primary_link: '#',
        cta_secondary_text_id: '', cta_secondary_text_en: '', cta_secondary_link: '#',
        image_url: imageUrl || '',
        video_url: videoUrl || null,
        sort_order: sortOrder,
        is_active: true
    });

    // 2. Define Slides
    const slides = [
        // 1. Video 1 (slider_PT_Penta_Valent_Tbk.mp4)
        cleanSlide('Video 1', 1, '/slider_PT_Penta_Valent_Tbk.mp4', ''),

        // 2. Video 2 (2.mp4)
        cleanSlide('Video 2', 2, '/2.mp4', ''),

        // 3. Video 3 (3.mp4)
        cleanSlide('Video 3', 3, '/3.mp4', ''),

        // 4. PENTAVALENT (hero-banner-indo.jpg) - CLEAN
        cleanSlide('Penta Valent', 4, null, '/hero-banner-indo.jpg'),

        // 5. Future of Healthcare (Legacy - With Text)
        {
            title_id: 'Masa Depan Distribusi Kesehatan',
            title_en: 'The Future of Digital Healthcare',
            subtitle_id: 'Automasi tingkat tinggi untuk akurasi dan kecepatan distribusi produk farmasi.',
            subtitle_en: 'High-level automation for accuracy and speed in pharmaceutical distribution.',
            image_url: '/hero-automation.jpg',
            video_url: null,
            cta_primary_text_id: 'Hubungi Kami',
            cta_primary_text_en: 'Contact Us',
            cta_primary_link: '#contact',
            cta_secondary_text_id: 'Lini Bisnis',
            cta_secondary_text_en: 'Business Lines',
            cta_secondary_link: '#business',
            sort_order: 5,
            is_active: true
        },

        // 6. Modern Logistics (Legacy - With Text)
        {
            title_id: 'Inovasi Logistik Modern',
            title_en: 'Modern Logistics Innovation',
            subtitle_id: 'Sistem manajemen rantai dingin berkualitas tinggi untuk keamanan produk.',
            subtitle_en: 'High-quality cold chain management system for product safety.',
            image_url: '/hero-lab.jpg',
            video_url: null,
            cta_primary_text_id: 'Layanan Kami',
            cta_primary_text_en: 'Our Services',
            cta_primary_link: '#services',
            cta_secondary_text_id: 'Portofolio',
            cta_secondary_text_en: 'Portfolio',
            cta_secondary_link: '#portfolio',
            sort_order: 6,
            is_active: true
        }
    ];

    const { error: insertError } = await supabase.from('hero_slides').insert(slides);

    if (insertError) {
        console.error('❌ Error inserting slides:', insertError.message);
    } else {
        console.log(`✅ Successfully updated banners (6 Slides)!`);
        console.log('1. 🎥 Video: slider_PT_Penta_Valent_Tbk.mp4');
        console.log('2. 🎥 Video: 2.mp4');
        console.log('3. 🎥 Video: 3.mp4');
        console.log('4. 🖼️ PENTAVALENT (Clean Image)');
        console.log('5. 🖼️ Future Banner');
        console.log('6. 🖼️ Modern Banner');
    }
}

seedHero();
