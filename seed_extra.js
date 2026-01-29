import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sonqawatrvahcomthxfn.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjAxOWFjNDk0LWNiYTYtNDNkNy05M2U2LWYwNGNmYzQyOWM0MCJ9.eyJwcm9qZWN0SWQiOiJzb25xYXdhdHJ2YWhjb210aHhmbiIsInR5cCI6ImFub24iLCJpYXQiOjE3Njk2MDUwMjgsImV4cCI6MjA4NDk2NTAyOCwiaXNzIjoiZmFtb3VzLmRhdGFiYXNlcGFkIiwiYXVkIjoiZmFtb3VzLmNsaWVudHMifQ.kr_i_V7Bhn49deuhh6YIaXUS6S7nRr1WB1ZEGxBH0cE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedExtra() {
    console.log('Starting Extra Seeding (Hero & Business)...');

    // 1. Hero Slides
    console.log('Seeding hero_slides...');
    const { error: heroErr } = await supabase.from('hero_slides').insert([
        {
            title_id: 'Solusi Distribusi Kesehatan Terintegrasi',
            title_en: 'Integrated Healthcare Distribution Solutions',
            subtitle_id: 'Menjangkau pelosok negeri dengan produk farmasi dan alat kesehatan berkualitas tinggi.',
            subtitle_en: 'Reaching all corners of the nation with high-quality pharmaceutical and medical products.',
            image_url: 'https://d64gsuwffb70l.cloudfront.net/6979ff7d5d710261efd346d6_1769605335122_386227f5.jpg',
            cta_primary_text_id: 'Jelajahi Lini Bisnis',
            cta_primary_text_en: 'Explore Business Lines',
            cta_primary_link: '#business',
            cta_secondary_text_id: 'Hubungi Kami',
            cta_secondary_text_en: 'Contact Us',
            cta_secondary_link: '#contact',
            sort_order: 1
        },
        {
            title_id: 'Inovasi & Teknologi dalam Distribusi',
            title_en: 'Innovation & Technology in Distribution',
            subtitle_id: 'Penerapan sistem logistik modern untuk memastikan keamanan dan ketersediaan produk.',
            subtitle_en: 'Implementing modern logistics systems to ensure product safety and availability.',
            image_url: 'https://d64gsuwffb70l.cloudfront.net/6979ff7d5d710261efd346d6_1769605345633_28a383d4.jpg',
            cta_primary_text_id: 'Tentang Kami',
            cta_primary_text_en: 'About Us',
            cta_primary_link: '#about',
            cta_secondary_text_id: 'Jaringan Kami',
            cta_secondary_text_en: 'Our Network',
            cta_secondary_link: '#network',
            sort_order: 2
        },
        {
            title_id: 'Kemitraan Strategis Global',
            title_en: 'Strategic Global Partnerships',
            subtitle_id: 'Berkolaborasi dengan brand kesehatan terkemuka dunia untuk kesehatan Indonesia.',
            subtitle_en: 'Collaborating with world-leading healthcare brands for Indonesia\'s health.',
            image_url: 'https://d64gsuwffb70l.cloudfront.net/697a07882750ca11cca5ba96_1769605361022_b37265a1.jpg',
            cta_primary_text_id: 'Mitra Kami',
            cta_primary_text_en: 'Our Partners',
            cta_primary_link: '#partners',
            cta_secondary_text_id: 'Hubungan Investor',
            cta_secondary_text_en: 'Investor Relations',
            cta_secondary_link: '#investor',
            sort_order: 3
        }
    ]);
    if (heroErr) console.log('❌ hero_slides error:', heroErr.message);

    // 2. Business Lines
    console.log('Seeding business_lines...');
    const { data: bLines, error: bErr } = await supabase.from('business_lines').insert([
        {
            title_id: 'Distribusi Farmasi',
            title_en: 'Pharmaceutical Distribution',
            description_id: 'Distribusi produk farmasi dengan standar CDOB dan sistem cold chain untuk menjaga kualitas produk.',
            description_en: 'Pharmaceutical product distribution with CDOB standards and cold chain system to maintain product quality.',
            image_url: 'https://d64gsuwffb70l.cloudfront.net/697a07882750ca11cca5ba96_1769605221012_6137a558.jpg',
            sort_order: 1
        },
        {
            title_id: 'Alat Kesehatan',
            title_en: 'Medical Devices',
            description_id: 'Distribusi alat kesehatan dengan sertifikasi CDAKB untuk memastikan keamanan dan kualitas produk.',
            description_en: 'Medical device distribution with CDAKB certification to ensure product safety and quality.',
            image_url: 'https://d64gsuwffb70l.cloudfront.net/697a07882750ca11cca5ba96_1769605240285_94499a43.png',
            sort_order: 2
        },
        {
            title_id: 'Consumer Health',
            title_en: 'Consumer Health',
            description_id: 'Distribusi produk consumer health dan kosmetik untuk memenuhi kebutuhan kesehatan masyarakat.',
            description_en: 'Consumer health and cosmetic product distribution to meet public health needs.',
            image_url: 'https://d64gsuwffb70l.cloudfront.net/697a07882750ca11cca5ba96_1769605262600_4f1661f5.png',
            sort_order: 3
        }
    ]).select();

    if (bErr) {
        console.log('❌ business_lines error:', bErr.message);
    } else if (bLines) {
        const pharmaId = bLines[0].id;
        const medicalId = bLines[1].id;
        const consumerId = bLines[2].id;

        // Seeding Business Features
        console.log('Seeding business_features...');
        const { error: fErr } = await supabase.from('business_features').insert([
            { business_line_id: pharmaId, feature_id: 'Distribusi obat resep dan OTC', feature_en: 'Prescription & OTC drug distribution', sort_order: 1 },
            { business_line_id: pharmaId, feature_id: 'Sistem CDOB terintegrasi', feature_en: 'Integrated CDOB system', sort_order: 2 },
            { business_line_id: pharmaId, feature_id: 'Cold chain untuk produk sensitif', feature_en: 'Cold chain for sensitive products', sort_order: 3 },
            { business_line_id: medicalId, feature_id: 'Alat diagnostik laboratorium', feature_en: 'Laboratory diagnostic equipment', sort_order: 1 },
            { business_line_id: medicalId, feature_id: 'Peralatan medis rumah sakit', feature_en: 'Hospital medical equipment', sort_order: 2 },
            { business_line_id: medicalId, feature_id: 'Sertifikasi CDAKB', feature_en: 'CDAKB certification', sort_order: 3 },
            { business_line_id: consumerId, feature_id: 'Produk vitamin & suplemen', feature_en: 'Vitamin & supplement products', sort_order: 1 },
            { business_line_id: consumerId, feature_id: 'Skincare & kosmetik', feature_en: 'Skincare & cosmetics', sort_order: 2 },
            { business_line_id: consumerId, feature_id: 'E-commerce fulfillment', feature_en: 'E-commerce fulfillment', sort_order: 3 }
        ]);
        if (fErr) console.log('❌ business_features error:', fErr.message);

        // Seeding Business Stats
        console.log('Seeding business_stats...');
        const { error: sErr } = await supabase.from('business_stats').insert([
            { business_line_id: pharmaId, value_id: '5000+', value_en: '5000+', label_id: 'SKU Produk', label_en: 'Product SKUs', sort_order: 1 },
            { business_line_id: pharmaId, value_id: '10000+', value_en: '10000+', label_id: 'Outlet Terlayani', label_en: 'Served Outlets', sort_order: 2 },
            { business_line_id: medicalId, value_id: '2000+', value_en: '2000+', label_id: 'Jenis Alkes', label_en: 'Medical Types', sort_order: 1 },
            { business_line_id: medicalId, value_id: '500+', value_en: '500+', label_id: 'Rumah Sakit', label_en: 'Hospitals', sort_order: 2 },
            { business_line_id: consumerId, value_id: '3000+', value_en: '3000+', label_id: 'SKU Produk', label_en: 'Product SKUs', sort_order: 1 },
            { business_line_id: consumerId, value_id: '15000+', value_en: '15000+', label_id: 'Outlet', label_en: 'Outlets', sort_order: 2 }
        ]);
        if (sErr) console.log('❌ business_stats error:', sErr.message);
    }

    console.log('Extra Seeding complete!');
}

seedExtra();
