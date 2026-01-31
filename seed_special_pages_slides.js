
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

const slides = [
    // Privacy Policy Slides
    {
        page_path: '/privacy-policy',
        title_id: 'Kebijakan Privasi',
        title_en: 'Privacy Policy',
        subtitle_id: 'Komitmen kami melindungi data dan informasi Anda.',
        subtitle_en: 'Our commitment to protecting your data and information.',
        image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000',
        sort_order: 1
    },
    {
        page_path: '/privacy-policy',
        title_id: 'Keamanan Data',
        title_en: 'Data Security',
        subtitle_id: 'Standar keamanan tertinggi untuk integritas informasi.',
        subtitle_en: 'Highest security standards for information integrity.',
        image_url: 'https://images.unsplash.com/photo-1563206767-5b1d97289374?auto=format&fit=crop&q=80&w=2000',
        sort_order: 2
    },
    {
        page_path: '/privacy-policy',
        title_id: 'Transparansi',
        title_en: 'Transparency',
        subtitle_id: 'Pengelolaan data yang terbuka dan akuntabel.',
        subtitle_en: 'Open and accountable data management.',
        image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000',
        sort_order: 3
    },

    // Code of Conduct Slides
    {
        page_path: '/code-of-conduct',
        title_id: 'Kode Etik Perusahaan',
        title_en: 'Code of Conduct',
        subtitle_id: 'Pedoman perilaku profesional dan berintegritas.',
        subtitle_en: 'Guidelines for professional and ethical behavior.',
        image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000',
        sort_order: 1
    },
    {
        page_path: '/code-of-conduct',
        title_id: 'Integritas',
        title_en: 'Integrity',
        subtitle_id: 'Menjunjung tinggi kejujuran dalam setiap aktivitas bisnis.',
        subtitle_en: 'Upholding honesty in every business activity.',
        image_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=2000',
        sort_order: 2
    },
    {
        page_path: '/code-of-conduct',
        title_id: 'Profesionalisme',
        title_en: 'Professionalism',
        subtitle_id: 'Standar kerja unggul demi kepercayaan pemangku kepentingan.',
        subtitle_en: 'Excellent work standards for stakeholder trust.',
        image_url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2000',
        sort_order: 3
    }
];

async function seedSlides() {
    console.log('Starting seed for special pages...');

    for (const slide of slides) {
        // Check if exists
        const { data: existing } = await supabase
            .from('hero_slides')
            .select('id')
            .eq('cta_secondary_link', slide.page_path) // We use this field for page mapping
            .eq('title_en', slide.title_en)
            .single();

        if (!existing) {
            console.log(`Creating slide for ${slide.page_path} - ${slide.title_en}...`);
            const { error } = await supabase.from('hero_slides').insert({
                title_id: slide.title_id,
                title_en: slide.title_en,
                subtitle_id: slide.subtitle_id,
                subtitle_en: slide.subtitle_en,
                image_url: slide.image_url,
                cta_secondary_link: slide.page_path, // Map to page path
                is_active: true,
                sort_order: slide.sort_order,
                // Required fields dummy
                cta_primary_text_id: 'Selengkapnya',
                cta_primary_text_en: 'Proprietary Info',
                cta_primary_link: '#'
            });

            if (error) console.error(`Error inserting ${slide.title_en}:`, error);
            else console.log(`Success ${slide.title_en}`);
        } else {
            console.log(`Slide for ${slide.title_en} already exists.`);
        }
    }
    console.log('Done.');
}

seedSlides();
