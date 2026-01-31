import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addMoreBusinessHeroSlides() {
    console.log('Adding MORE hero slides for business pages to meet the minimum of 3...');

    const slides = [
        // --- Pharmaceuticals Additional Slides ---
        {
            title_id: 'Infrastruktur Modern',
            title_en: 'Modern Infrastructure',
            subtitle_id: 'Didukung fasilitas penyimpanan berstandar CDOB terkini.',
            subtitle_en: 'Supported by the latest GSDP standard storage facilities.',
            image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Lihat Fasilitas',
            cta_primary_text_en: 'View Facilities',
            cta_primary_link: '#gallery',
            cta_secondary_text_id: 'Kontak Kami',
            cta_secondary_text_en: 'Contact Us',
            cta_secondary_link: '/business/pharmaceuticals',
            sort_order: 12, // Following previous 10, 11
            is_active: true
        },
        {
            title_id: 'Jangkauan Nasional',
            title_en: 'National Reach',
            subtitle_id: 'Melayani pengiriman ke seluruh pelosok Indonesia tepat waktu.',
            subtitle_en: 'Serving timely deliveries to all corners of Indonesia.',
            image_url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Jaringan Kami',
            cta_primary_text_en: 'Our Network',
            cta_primary_link: '#network',
            cta_secondary_text_id: 'Hubungi Kami',
            cta_secondary_text_en: 'Contact Us',
            cta_secondary_link: '/business/pharmaceuticals',
            sort_order: 13,
            is_active: true
        },

        // --- Consumer Goods Additional Slides ---
        {
            title_id: 'Kemitraan Global',
            title_en: 'Global Partnerships',
            subtitle_id: 'Dipercaya oleh berbagai brand multinasional terkemuka.',
            subtitle_en: 'Trusted by various leading multinational brands.',
            image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Mitra Kami',
            cta_primary_text_en: 'Our Partners',
            cta_primary_link: '#partners',
            cta_secondary_text_id: 'Kerja Sama',
            cta_secondary_text_en: 'Collaborate',
            cta_secondary_link: '/business/consumer-goods',
            sort_order: 12,
            is_active: true
        },
        {
            title_id: 'Kualitas Terjamin',
            title_en: 'Guaranteed Quality',
            subtitle_id: 'Memastikan produk sampai ke tangan konsumen dalam kondisi terbaik.',
            subtitle_en: 'Ensuring products reach consumers in the best condition.',
            image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Layanan Kami',
            cta_primary_text_en: 'Our Services',
            cta_primary_link: '#services',
            cta_secondary_text_id: 'Info Lebih Lanjut',
            cta_secondary_text_en: 'More Info',
            cta_secondary_link: '/business/consumer-goods',
            sort_order: 13,
            is_active: true
        }
    ];

    for (const slide of slides) {
        // We use title_id and secondary_link combined roughly to check uniqueness to avoid re-inserting same slide
        const { data: existing } = await supabase
            .from('hero_slides')
            .select('id')
            .eq('cta_secondary_link', slide.cta_secondary_link)
            .eq('title_id', slide.title_id)
            .maybeSingle();

        if (existing) {
            console.log(`Slide "${slide.title_en}" already exists.`);
            continue;
        }

        const { error } = await supabase.from('hero_slides').insert(slide);
        if (error) {
            console.error(`Error inserting slide "${slide.title_en}":`, error);
        } else {
            console.log(`Successfully inserted slide "${slide.title_en}"`);
        }
    }
}

addMoreBusinessHeroSlides();
