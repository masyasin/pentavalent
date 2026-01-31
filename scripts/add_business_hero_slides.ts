import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addBusinessHeroSlides() {
    console.log('Adding hero slides for business pages...');

    const slides = [
        {
            title_id: 'Distribusi Farmasi',
            title_en: 'Pharmaceutical Distribution',
            subtitle_id: 'Standar tertinggi dalam rantai pasok farmasi nasional.',
            subtitle_en: 'Highest standards in national pharmaceutical supply chain.',
            image_url: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Pelajari Lebih Lanjut',
            cta_primary_text_en: 'Learn More',
            cta_primary_link: '#details',
            cta_secondary_text_id: 'Kontak Kami',
            cta_secondary_text_en: 'Contact Us',
            cta_secondary_link: '/business/pharmaceuticals',
            sort_order: 10,
            is_active: true
        },
        {
            title_id: 'Produk Konsumen',
            title_en: 'Consumer Goods',
            subtitle_id: 'Menjangkau setiap keluarga dengan produk berkualitas.',
            subtitle_en: 'Reaching every family with quality products.',
            image_url: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Pelajari Lebih Lanjut',
            cta_primary_text_en: 'Learn More',
            cta_primary_link: '#details',
            cta_secondary_text_id: 'Kontak Kami',
            cta_secondary_text_en: 'Contact Us',
            cta_secondary_link: '/business/consumer-goods',
            sort_order: 11,
            is_active: true
        }
    ];

    for (const slide of slides) {
        // Check if exists
        const { data: existing } = await supabase
            .from('hero_slides')
            .select('id')
            .eq('cta_secondary_link', slide.cta_secondary_link)
            .maybeSingle();

        if (existing) {
            console.log(`Slide for ${slide.cta_secondary_link} already exists.`);
            continue;
        }

        const { error } = await supabase.from('hero_slides').insert(slide);
        if (error) {
            console.error(`Error inserting slide for ${slide.title_en}:`, error);
        } else {
            console.log(`Successfully inserted slide for ${slide.title_en}`);
        }
    }
}

addBusinessHeroSlides();
