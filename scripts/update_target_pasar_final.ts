import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTargetPasar() {
    console.log('Updating Target Pasar content...');

    // 1. Find the target-pasar business line
    const { data: line } = await supabase
        .from('business_lines')
        .select('id, slug')
        .or('slug.eq.target-pasar,slug.eq.target-market')
        .single();

    if (!line) {
        console.error('Business line "target-pasar" not found.');
        return;
    }

    const businessId = line.id;
    const pagePath = '/business/target-market';

    // 2. Update Features (Target Pasarnya)
    const features = [
        { business_line_id: businessId, feature_id: 'Farmasi', feature_en: 'Pharmacy', sort_order: 1 },
        { business_line_id: businessId, feature_id: 'Modern Trade', feature_en: 'Modern Trade', sort_order: 2 },
        { business_line_id: businessId, feature_id: 'Modern Market', feature_en: 'Modern Market', sort_order: 3 },
        { business_line_id: businessId, feature_id: 'Kios Kosmetik', feature_en: 'Cosmetic Kiosk', sort_order: 4 },
        { business_line_id: businessId, feature_id: 'Pasar Tradisional', feature_en: 'Traditional Market', sort_order: 5 }
    ];

    console.log('Cleaning and inserting features...');
    await supabase.from('business_features').delete().eq('business_line_id', businessId);
    await supabase.from('business_features').insert(features);

    // 3. Update Hero Slides (Premium Slider)
    const slides = [
        {
            title_id: 'Jaringan Farmasi Terluas',
            title_en: 'Widest Pharmacy Network',
            subtitle_id: 'Bekerja sama dengan ribuan apotek di seluruh Indonesia.',
            subtitle_en: 'Partnering with thousands of pharmacies across Indonesia.',
            image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Lihat Jaringan',
            cta_primary_text_en: 'View Network',
            cta_primary_link: '#network',
            cta_secondary_text_id: 'Kontak Kami',
            cta_secondary_text_en: 'Contact Us',
            cta_secondary_link: pagePath,
            sort_order: 1,
            is_active: true
        },
        {
            title_id: 'Modern Trade & Market',
            title_en: 'Modern Trade & Market',
            subtitle_id: 'Mendistribusikan produk ke jaringan ritel modern terkemuka.',
            subtitle_en: 'Distributing products to leading modern retail networks.',
            image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Ritel Modern',
            cta_primary_text_en: 'Modern Retail',
            cta_primary_link: '#retail',
            cta_secondary_text_id: 'Jadi Mitra',
            cta_secondary_text_en: 'Become Partner',
            cta_secondary_link: pagePath,
            sort_order: 2,
            is_active: true
        },
        {
            title_id: 'Pusat Kosmetik & Ritel',
            title_en: 'Cosmetic & Retail Centers',
            subtitle_id: 'Menjangkau kios kosmetik dan pasar tradisional hingga ke pelosok.',
            subtitle_en: 'Reaching cosmetic kiosks and traditional markets nationwide.',
            image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=2000',
            cta_primary_text_id: 'Pasar Konsumen',
            cta_primary_text_en: 'Consumer Market',
            cta_primary_link: '#consumer',
            cta_secondary_text_id: 'Kerja Sama',
            cta_secondary_text_en: 'Collaborate',
            cta_secondary_link: pagePath,
            sort_order: 3,
            is_active: true
        }
    ];

    console.log('Cleaning and inserting hero slides...');
    await supabase.from('hero_slides').delete().eq('cta_secondary_link', pagePath);
    await supabase.from('hero_slides').insert(slides);

    console.log('Target Pasar update complete!');
}

updateTargetPasar();
