import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

const realPartnersData = [
    {
        name: 'Pfizer Indonesia',
        partner_type: 'international',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Pfizer_logo.svg/2560px-Pfizer_logo.svg.png',
        website: 'https://www.pfizer.com',
        description_id: 'Perusahaan farmasi global terkemuka yang mengembangkan obat-obatan inovatif.',
        description_en: 'Leading global pharmaceutical company developing innovative medicines.',
        sort_order: 1
    },
    {
        name: 'Johnson & Johnson',
        partner_type: 'international',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/J%26J_Logo_2023.svg/2560px-J%26J_Logo_2023.svg.png',
        website: 'https://www.jnj.com',
        description_id: 'Konglomerat multinasional di bidang farmasi dan alat kesehatan.',
        description_en: 'Multinational conglomerate in pharmaceuticals and medical devices.',
        sort_order: 2
    },
    {
        name: 'Siemens Healthineers',
        partner_type: 'international',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Siemens_Healthineers_logo.svg/2560px-Siemens_Healthineers_logo.svg.png',
        website: 'https://www.siemens-healthineers.com',
        description_id: 'Penyedia teknologi medis terdepan untuk diagnostik dan terapi.',
        description_en: 'Leading medical technology provider for diagnostics and therapy.',
        sort_order: 3
    },
    {
        name: 'PT Kalbe Farma Tbk',
        partner_type: 'principal',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Kalbe_Farma_logo.svg/1200px-Kalbe_Farma_logo.svg.png',
        website: 'https://www.kalbe.co.id',
        description_id: 'Perusahaan farmasi terbesar di Indonesia.',
        description_en: 'Indonesia\'s largest pharmaceutical company.',
        sort_order: 4
    },
    {
        name: 'PT Kimia Farma Tbk',
        partner_type: 'principal',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Kimia_Farma_logo.svg/1200px-Kimia_Farma_logo.svg.png',
        website: 'https://www.kimiafarma.co.id',
        description_id: 'BUMN farmasi terpercaya dengan jaringan apotek terluas.',
        description_en: 'Trusted state-owned pharmaceutical company with widest pharmacy network.',
        sort_order: 5
    },
    {
        name: 'PT Sanbe Farma',
        partner_type: 'principal',
        logo_url: 'https://www.sanbe-farma.com/wp-content/themes/sanbe/images/logo.png',
        website: 'https://www.sanbe.co.id',
        description_id: 'Produsen farmasi nasional berkualitas tinggi.',
        description_en: 'High-quality national pharmaceutical manufacturer.',
        sort_order: 6
    },
    {
        name: 'Novartis Indonesia',
        partner_type: 'international',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Novartis_logo.svg/2560px-Novartis_logo.svg.png',
        website: 'https://www.novartis.com',
        description_id: 'Perusahaan farmasi global yang fokus pada inovasi.',
        description_en: 'Global pharmaceutical company focused on innovation.',
        sort_order: 7
    },
    {
        name: 'Roche Indonesia',
        partner_type: 'international',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Roche_Logo.svg/1200px-Roche_Logo.svg.png',
        website: 'https://www.roche.com',
        description_id: 'Pemimpin global dalam diagnostik dan farmasi.',
        description_en: 'Global leader in diagnostics and pharmaceuticals.',
        sort_order: 8
    },
    {
        name: 'PT Dexa Medica',
        partner_type: 'principal',
        logo_url: 'https://www.dexa-medica.com/wp-content/uploads/2021/04/Logo-Dexa-Medica.png',
        website: 'https://www.dexa-medica.com',
        description_id: 'Perusahaan farmasi nasional dengan produk berkualitas.',
        description_en: 'National pharmaceutical company with quality products.',
        sort_order: 9
    },
    {
        name: 'AstraZeneca Indonesia',
        partner_type: 'international',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/AstraZeneca_logo.svg/2560px-AstraZeneca_logo.svg.png',
        website: 'https://www.astrazeneca.com',
        description_id: 'Perusahaan biofarmasi global berbasis sains.',
        description_en: 'Science-led global biopharmaceutical company.',
        sort_order: 10
    },
    {
        name: 'Merck Indonesia',
        partner_type: 'international',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Merck_Logo.svg/2560px-Merck_Logo.svg.png',
        website: 'https://www.merckgroup.com',
        description_id: 'Perusahaan sains dan teknologi terkemuka.',
        description_en: 'Leading science and technology company.',
        sort_order: 11
    },
    {
        name: 'PT. Lapi Laboratories Indonesia',
        partner_type: 'principal',
        logo_url: '/images/principals/lapi.png',
        website: 'https://www.lapi.co.id',
        description_id: 'Produsen farmasi terkemuka di Indonesia',
        description_en: 'Leading pharmaceutical manufacturer in Indonesia',
        sort_order: 12
    },
    {
        name: 'PT. Cendo',
        partner_type: 'principal',
        logo_url: '/images/principals/cendo.png',
        website: 'https://www.cendo.co.id',
        description_id: 'Spesialis produk kesehatan mata',
        description_en: 'Eye health products specialist',
        sort_order: 13
    },
    {
        name: 'PT. Meprofarm',
        partner_type: 'principal',
        logo_url: '/images/principals/mepro.png',
        website: 'https://www.meprofarm.co.id',
        description_id: 'Perusahaan farmasi nasional',
        description_en: 'National pharmaceutical company',
        sort_order: 14
    },
    {
        name: 'PT. Guardian Pharmatama',
        partner_type: 'principal',
        logo_url: '/images/principals/guardian.png',
        website: 'https://www.guardianpharmatama.com',
        description_id: 'Produsen obat-obatan berkualitas',
        description_en: 'Quality pharmaceutical manufacturer',
        sort_order: 15
    },
    {
        name: 'PT. Nifah Pharmaceutical Indonesia',
        partner_type: 'principal',
        logo_url: '/images/principals/nifah.png',
        website: '',
        description_id: 'Industri farmasi Indonesia',
        description_en: 'Indonesian pharmaceutical industry',
        sort_order: 16
    }
];

async function updateLogos() {
    console.log('🚀 Updating partner logos with real URLs...');

    // Clear existing partners to avoid duplicates and ensure type consistency
    await supabase.from('partners').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const { error } = await supabase.from('partners').insert(realPartnersData.map(p => ({
        ...p,
        is_active: true
    })));

    if (error) {
        console.error('❌ Error updating logos:', error.message);
    } else {
        console.log('✅ Successfully updated active partners with real logos!');
    }
}

updateLogos();
