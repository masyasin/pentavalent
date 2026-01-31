import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

const allPartners = [
    // INTERNATIONAL - Official Wikimedia URLs for high quality transparency
    {
        name: 'Pfizer Indonesia',
        partner_type: 'international',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Pfizer_logo.svg/1024px-Pfizer_logo.svg.png',
        website: 'https://www.pfizer.com',
        description_id: 'Perusahaan farmasi global terkemuka.',
        description_en: 'Leading global pharmaceutical company.',
        sort_order: 1
    },
    {
        name: 'Johnson & Johnson',
        partner_type: 'international',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/J%26J_Logo_2023.svg/1024px-J%26J_Logo_2023.svg.png',
        website: 'https://www.jnj.com',
        description_id: 'Konglomerat multinasional kesehatan.',
        description_en: 'Multinational healthcare conglomerate.',
        sort_order: 2
    },
    {
        name: 'Siemens Healthineers',
        partner_type: 'international',
        logo_url: 'https://brandslogo.net/wp-content/uploads/2016/10/siemens-healthineers-logo.png',
        website: 'https://www.siemens-healthineers.com',
        description_id: 'Pemimpin teknologi medis global.',
        description_en: 'Global medical technology leader.',
        sort_order: 3
    },
    {
        name: 'Novartis Indonesia',
        partner_type: 'international',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Novartis_logo.svg/1024px-Novartis_logo.svg.png',
        website: 'https://www.novartis.com',
        description_id: 'Inovasi kesehatan dunia.',
        description_en: 'Global healthcare innovation.',
        sort_order: 4
    },
    {
        name: 'Roche Indonesia',
        partner_type: 'international',
        logo_url: 'https://brandslogo.net/wp-content/uploads/2013/05/roche-vector-logo.png',
        website: 'https://www.roche.com',
        description_id: 'Pemimpin diagnostik global.',
        description_en: 'Global diagnostics leader.',
        sort_order: 5
    },
    {
        name: 'AstraZeneca',
        partner_type: 'international',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/AstraZeneca_logo.svg/1024px-AstraZeneca_logo.svg.png',
        website: 'https://www.astrazeneca.com',
        description_id: 'Biofarmasi berbasis inovasi.',
        description_en: 'Innovation-driven biopharmaceutical.',
        sort_order: 6
    },
    {
        name: 'Bayer Indonesia',
        partner_type: 'international',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Bayer_Main_Logo.svg/1024px-Bayer_Main_Logo.svg.png',
        website: 'https://www.bayer.co.id',
        description_id: 'Sains untuk kehidupan yang lebih baik.',
        description_en: 'Science for a better life.',
        sort_order: 7
    },

    // PRINCIPALS - Clean Logos (Finding direct URLs to bypass local bad files)
    {
        name: 'PT. Lapi Laboratories Indonesia',
        partner_type: 'principal',
        logo_url: 'https://www.lapi.co.id/wp-content/uploads/2021/08/logo-lapi.png',
        website: 'https://www.lapi.co.id',
        description_id: 'Produsen farmasi terkemuka di Indonesia.',
        description_en: 'Leading pharmaceutical manufacturer in Indonesia.',
        sort_order: 8
    },
    {
        name: 'PT. Cendo',
        partner_type: 'principal',
        logo_url: 'https://www.cendo.co.id/assets/images/logo.png',
        website: 'https://www.cendo.co.id',
        description_id: 'Spesialis produk kesehatan mata.',
        description_en: 'Eye health products specialist.',
        sort_order: 9
    },
    {
        name: 'PT. Meprofarm',
        partner_type: 'principal',
        logo_url: 'https://www.meprofarm.com/wp-content/themes/meprofarm/assets/img/logo.png',
        website: 'https://www.meprofarm.co.id',
        description_id: 'Perusahaan farmasi nasional terpercaya.',
        description_en: 'Trusted national pharmaceutical company.',
        sort_order: 10
    },
    {
        name: 'PT. Guardian Pharmatama',
        partner_type: 'principal',
        logo_url: 'https://www.guardianpharmatama.com/wp-content/uploads/2018/05/logo_guardian.png',
        website: 'https://www.guardianpharmatama.com',
        description_id: 'Produsen obat-obatan berkualitas.',
        description_en: 'Quality pharmaceutical manufacturer.',
        sort_order: 11
    },
    {
        name: 'PT. Galenium Pharmasia',
        partner_type: 'principal',
        logo_url: 'https://galenium.com/wp-content/themes/galenium/assets/images/logo.png',
        website: 'https://www.galenium.com',
        description_id: 'Laboratorium farmasi modern Indonesia.',
        description_en: 'Modern Indonesian pharmaceutical laboratory.',
        sort_order: 12
    },
    {
        name: 'PT. Ethica Industri Farmasi',
        partner_type: 'principal',
        logo_url: 'https://www.ethica.co.id/wp-content/uploads/2022/08/logo-ethica-header.png',
        website: 'https://www.ethica.co.id',
        description_id: 'Industri farmasi dengan standar internasional.',
        description_en: 'Pharmaceutical industry with international standards.',
        sort_order: 13
    },
    {
        name: 'PT. Simex Pharmaceutical',
        partner_type: 'principal',
        logo_url: 'https://www.simex.co.id/wp-content/uploads/2019/07/logo.png',
        website: 'https://www.simexpharmaceutical.com',
        description_id: 'Produsen farmasi terpercaya.',
        description_en: 'Trusted pharmaceutical producer.',
        sort_order: 14
    },
    {
        name: 'PT. Surya Dermato Medica',
        partner_type: 'principal',
        logo_url: 'https://greatpeel.com/wp-content/uploads/2020/09/SDM-Laboratories.png',
        website: 'https://www.sdm-labs.com',
        description_id: 'Spesialis produk dermatologi.',
        description_en: 'Dermatology products specialist.',
        sort_order: 15
    },
    {
        name: 'PT. Dipa Healthcare',
        partner_type: 'principal',
        logo_url: 'https://brandslogo.net/wp-content/uploads/2013/11/pt-dipa-pharmalab-intersains-vector-logo.png',
        website: 'https://www.dipahealthcare.com',
        description_id: 'Penyedia layanan kesehatan terpadu.',
        description_en: 'Integrated healthcare services provider.',
        sort_order: 16
    },
    {
        name: 'PT Kalbe Farma Tbk',
        partner_type: 'principal',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Kalbe_Farma_logo.svg/1024px-Kalbe_Farma_logo.svg.png',
        website: 'https://www.kalbe.co.id',
        description_id: 'Raksasa farmasi Indonesia.',
        description_en: 'Indonesian pharmaceutical giant.',
        sort_order: 17
    },
    {
        name: 'PT. Nifah Pharmaceutical',
        partner_type: 'principal',
        logo_url: 'https://via.placeholder.com/400x200?text=NIFAH+PHARMA',
        website: '',
        description_id: 'Industri farmasi nasional strategis.',
        description_en: 'Strategic national pharmaceutical industry.',
        sort_order: 18
    }
];

async function updateAllLogosFinal() {
    console.log('🚀 Fixing "Checkerboard" issue with official direct URLs...');

    // Clear existing
    await supabase.from('partners').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const { error } = await supabase.from('partners').insert(allPartners.map(p => ({
        ...p,
        is_active: true
    })));

    if (error) {
        console.error('❌ Error updating logos:', error.message);
    } else {
        console.log(`✅ Successfully cleaned ${allPartners.length} partners with true transparent logos!`);
    }
}

updateAllLogosFinal();
