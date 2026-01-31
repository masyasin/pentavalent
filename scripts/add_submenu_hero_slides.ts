import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSubMenuHeroSlides() {
    console.log('Adding hero slides for new sub-menus...');

    const slides = [
        // --- Alur Distribusi (/business/distribution-flow) ---
        {
            title_id: 'Manajemen Logistik Modern',
            title_en: 'Modern Logistics Management',
            subtitle_id: 'Alur distribusi yang efisien dengan teknologi pergudangan terkini.',
            subtitle_en: 'Efficient distribution flow with the latest warehousing technology.',
            image_url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Lihat Proses',
            cta_primary_text_en: 'View Process',
            cta_primary_link: '#details',
            cta_secondary_text_id: 'Kontak Kami',
            cta_secondary_text_en: 'Contact Us',
            cta_secondary_link: '/business/distribution-flow',
            sort_order: 1,
            is_active: true
        },
        {
            title_id: 'Ketepatan Pengiriman',
            title_en: 'Delivery Precision',
            subtitle_id: 'Memastikan setiap produk sampai tepat waktu di seluruh Indonesia.',
            subtitle_en: 'Ensuring every product arrives on time across Indonesia.',
            image_url: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Jangkauan',
            cta_primary_text_en: 'Reach',
            cta_primary_link: '#reach',
            cta_secondary_text_id: 'Hubungi Kami',
            cta_secondary_text_en: 'Contact Us',
            cta_secondary_link: '/business/distribution-flow',
            sort_order: 2,
            is_active: true
        },
        {
            title_id: 'Integrasi Sistem End-to-End',
            title_en: 'End-to-End System Integration',
            subtitle_id: 'Monitoring real-time untuk transparansi alur distribusi maksimal.',
            subtitle_en: 'Real-time monitoring for maximum distribution flow transparency.',
            image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Teknologi',
            cta_primary_text_en: 'Technology',
            cta_primary_link: '#tech',
            cta_secondary_text_id: 'Konsultasi',
            cta_secondary_text_en: 'Consultation',
            cta_secondary_link: '/business/distribution-flow',
            sort_order: 3,
            is_active: true
        },

        // --- Target Pasar (/business/target-market) ---
        {
            title_id: 'Sektor Rumah Sakit & Klinik',
            title_en: 'Hospital & Clinic Sector',
            subtitle_id: 'Melayani kebutuhan institusi kesehatan di seluruh penjuru negeri.',
            subtitle_en: 'Serving the needs of healthcare institutions across the country.',
            image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Layanan Medis',
            cta_primary_text_en: 'Medical Services',
            cta_primary_link: '#medical',
            cta_secondary_text_id: 'Hubungi Kami',
            cta_secondary_text_en: 'Contact Us',
            cta_secondary_link: '/business/target-market',
            sort_order: 1,
            is_active: true
        },
        {
            title_id: 'Jaringan Apotek Nasional',
            title_en: 'National Pharmacy Network',
            subtitle_id: 'Mitra distribusi utama untuk ribuan apotek di Indonesia.',
            subtitle_en: 'Primary distribution partner for thousands of pharmacies in Indonesia.',
            image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Retail Farmasi',
            cta_primary_text_en: 'Pharmacy Retail',
            cta_primary_link: '#retail',
            cta_secondary_text_id: 'Jadi Mitra',
            cta_secondary_text_en: 'Become Partner',
            cta_secondary_link: '/business/target-market',
            sort_order: 2,
            is_active: true
        },
        {
            title_id: 'Pasar Konsumen Luas',
            title_en: 'Broad Consumer Market',
            subtitle_id: 'Menjangkau retail modern dan tradisional untuk produk kesehatan konsumen.',
            subtitle_en: 'Reaching modern and traditional retail for consumer health products.',
            image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Pasar Konsumen',
            cta_primary_text_en: 'Consumer Market',
            cta_primary_link: '#consumer',
            cta_secondary_text_id: 'Kerja Sama',
            cta_secondary_text_en: 'Collaborate',
            cta_secondary_link: '/business/target-market',
            sort_order: 3,
            is_active: true
        }
    ];

    for (const slide of slides) {
        const { data: existing } = await supabase
            .from('hero_slides')
            .select('id')
            .eq('cta_secondary_link', slide.cta_secondary_link)
            .eq('title_id', slide.title_id)
            .maybeSingle();

        if (!existing) {
            const { error } = await supabase.from('hero_slides').insert(slide);
            if (error) {
                console.error(`Error inserting slide "${slide.title_en}":`, error);
            } else {
                console.log(`Successfully inserted slide "${slide.title_en}"`);
            }
        } else {
            console.log(`Slide "${slide.title_en}" already exists.`);
        }
    }
}

addSubMenuHeroSlides();
