
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

const slides = [
    {
        page_path: '/investor/ringkasan-investor',
        title_id: 'Ringkasan Investor',
        title_en: 'Investor Highlight',
        subtitle_id: 'Ikhtisar kinerja strategis dan nilai perusahaan yang berkelanjutan.',
        subtitle_en: 'Overview of strategic performance and sustainable corporate value.',
        image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=2000',
        sort_order: 10
    },
    {
        page_path: '/investor/informasi-saham',
        title_id: 'Informasi Saham',
        title_en: 'Stock Information',
        subtitle_id: 'Pantau kinerja saham dan data pasar terkini.',
        subtitle_en: 'Monitor stock performance and latest market data.',
        image_url: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=2000',
        sort_order: 11
    },
    {
        page_path: '/investor/laporan-keuangan',
        title_id: 'Laporan Keuangan',
        title_en: 'Financial Reports',
        subtitle_id: 'Transparansi dan akuntabilitas dalam setiap laporan kinerja.',
        subtitle_en: 'Transparency and accountability in every performance report.',
        image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000',
        sort_order: 12
    },
    {
        page_path: '/investor/prospektus',
        title_id: 'Prospektus',
        title_en: 'Prospectus',
        subtitle_id: 'Informasi mendalam mengenai penawaran umum dan profil emiten.',
        subtitle_en: 'In-depth information regarding public offerings and issuer profile.',
        image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000',
        sort_order: 13
    },
    {
        page_path: '/investor/rups',
        title_id: 'RUPS',
        title_en: 'General Meetings',
        subtitle_id: 'Agenda dan hasil Rapat Umum Pemegang Saham.',
        subtitle_en: 'Agenda and results of General Meeting of Shareholders.',
        image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2000',
        sort_order: 14
    },
    {
        page_path: '/investor/keterbukaan-informasi',
        title_id: 'Keterbukaan Informasi',
        title_en: 'Information Disclosure',
        subtitle_id: 'Akses cepat ke pengumuman korporasi dan informasi publik.',
        subtitle_en: 'Quick access to corporate announcements and public information.',
        image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2000',
        sort_order: 15
    }
];

async function seedInvestorSlides() {
    console.log('Starting seed...');

    for (const slide of slides) {
        // Check if exists
        const { data: existing } = await supabase
            .from('hero_slides')
            .select('id')
            .eq('cta_secondary_link', slide.page_path) // We use this field for page mapping
            .single();

        if (!existing) {
            console.log(`Creating slide for ${slide.page_path}...`);
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
                cta_primary_text_id: 'Lihat Detail',
                cta_primary_text_en: 'View Details',
                cta_primary_link: slide.page_path
            });

            if (error) console.error(`Error inserting ${slide.page_path}:`, error);
            else console.log(`Success ${slide.page_path}`);
        } else {
            console.log(`Slide for ${slide.page_path} already exists.`);
        }
    }
    console.log('Done.');
}

seedInvestorSlides();
