import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

const allPartners = [
    // INTERNATIONAL
    { name: 'Pfizer Indonesia', partner_type: 'international', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Pfizer_logo.svg/2560px-Pfizer_logo.svg.png', website: 'https://www.pfizer.com', description_id: 'Perusahaan farmasi global terkemuka.', description_en: 'Leading global pharmaceutical company.', sort_order: 1 },
    { name: 'Johnson & Johnson', partner_type: 'international', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/J%26J_Logo_2023.svg/2560px-J%26J_Logo_2023.svg.png', website: 'https://www.jnj.com', description_id: 'Konglomerat multinasional kesehatan.', description_en: 'Multinational healthcare conglomerate.', sort_order: 2 },
    { name: 'Siemens Healthineers', partner_type: 'international', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Siemens_Healthineers_logo.svg/2560px-Siemens_Healthineers_logo.svg.png', website: 'https://www.siemens-healthineers.com', description_id: 'Pemimpin teknologi medis global.', description_en: 'Global medical technology leader.', sort_order: 3 },
    { name: 'Novartis Indonesia', partner_type: 'international', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Novartis_logo.svg/2560px-Novartis_logo.svg.png', website: 'https://www.novartis.com', description_id: 'Inovasi kesehatan dunia.', description_en: 'Global healthcare innovation.', sort_order: 4 },
    { name: 'Roche Indonesia', partner_type: 'international', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Roche_Logo.svg/1200px-Roche_Logo.svg.png', website: 'https://www.roche.com', description_id: 'Pemimpin diagnostik global.', description_en: 'Global diagnostics leader.', sort_order: 5 },
    { name: 'AstraZeneca', partner_type: 'international', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/AstraZeneca_logo.svg/2560px-AstraZeneca_logo.svg.png', website: 'https://www.astrazeneca.com', description_id: 'Biofarmasi berbasis inovasi.', description_en: 'Innovation-driven biopharmaceutical.', sort_order: 6 },
    { name: 'Merck', partner_type: 'international', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Merck_Logo.svg/2560px-Merck_Logo.svg.png', website: 'https://www.merckgroup.com', description_id: 'Sains dan teknologi kesehatan.', description_en: 'Healthcare science and technology.', sort_order: 7 },

    // PRINCIPALS (With local images where available)
    { name: 'PT. Lapi Laboratories Indonesia', partner_type: 'principal', logo_url: '/images/principals/lapi.png', website: 'https://www.lapi.co.id', description_id: 'Produsen farmasi terkemuka di Indonesia.', description_en: 'Leading pharmaceutical manufacturer in Indonesia.', sort_order: 8 },
    { name: 'PT. Cendo', partner_type: 'principal', logo_url: '/images/principals/cendo.png', website: 'https://www.cendo.co.id', description_id: 'Spesialis produk kesehatan mata.', description_en: 'Eye health products specialist.', sort_order: 9 },
    { name: 'PT. Meprofarm', partner_type: 'principal', logo_url: '/images/principals/mepro.png', website: 'https://www.meprofarm.co.id', description_id: 'Perusahaan farmasi nasional terpercaya.', description_en: 'Trusted national pharmaceutical company.', sort_order: 10 },
    { name: 'PT. Guardian Pharmatama', partner_type: 'principal', logo_url: '/images/principals/guardian.png', website: 'https://www.guardianpharmatama.com', description_id: 'Produsen obat-obatan berkualitas.', description_en: 'Quality pharmaceutical manufacturer.', sort_order: 11 },
    { name: 'PT. Nifah Pharmaceutical Indonesia', partner_type: 'principal', logo_url: '/images/principals/nifah.png', website: '', description_id: 'Industri farmasi nasional strategis.', description_en: 'Strategic national pharmaceutical industry.', sort_order: 12 },
    { name: 'PT. Galenium Pharmasia', partner_type: 'principal', logo_url: '/images/principals/galenium.png', website: 'https://www.galenium.com', description_id: 'Perusahaan farmasi modern.', description_en: 'Modern pharmaceutical company.', sort_order: 13 },
    { name: 'PT. Simex Pharmaceutical', partner_type: 'principal', logo_url: '/images/principals/simex.png', website: 'https://www.simexpharmaceutical.com', description_id: 'Produsen farmasi terpercaya.', description_en: 'Trusted pharmaceutical producer.', sort_order: 14 },
    { name: 'PT. Ethica Industri Farmasi', partner_type: 'principal', logo_url: '/images/principals/ethica.png', website: 'https://www.ethica.co.id', description_id: 'Industri farmasi standar internasional.', description_en: 'International standard pharmaceutical industry.', sort_order: 15 },
    { name: 'PT. Surya Dermato Medica', partner_type: 'principal', logo_url: '/images/principals/sdm.png', website: 'https://www.sdm-labs.com', description_id: 'Spesialis produk dermatologi.', description_en: 'Dermatology products specialist.', sort_order: 16 },
    { name: 'PT. Dipa Healthcare', partner_type: 'principal', logo_url: '/images/principals/dipa.png', website: 'https://www.dipahealthcare.com', description_id: 'Penyedia layanan kesehatan terpadu.', description_en: 'Integrated healthcare services provider.', sort_order: 17 },

    // Additional Principals with Web Logos
    { name: 'PT Kalbe Farma Tbk', partner_type: 'principal', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Kalbe_Farma_logo.svg/1200px-Kalbe_Farma_logo.svg.png', website: 'https://www.kalbe.co.id', description_id: 'Raksasa farmasi Indonesia.', description_en: 'Indonesian pharmaceutical giant.', sort_order: 18 },
    { name: 'PT Kimia Farma Tbk', partner_type: 'principal', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Kimia_Farma_logo.svg/1200px-Kimia_Farma_logo.svg.png', website: 'https://www.kimiafarma.co.id', description_id: 'BUMN farmasi terkemuka.', description_en: 'Leading state-owned pharmaceutical.', sort_order: 19 },
    { name: 'PT Dexa Medica', partner_type: 'principal', logo_url: 'https://www.dexa-medica.com/wp-content/uploads/2021/04/Logo-Dexa-Medica.png', website: 'https://www.dexa-medica.com', description_id: 'Farmasi berkualitas tinggi.', description_en: 'High-quality pharmaceutical company.', sort_order: 20 },
    { name: 'PT Pyridam Farma Tbk', partner_type: 'principal', logo_url: 'https://pyfa.co.id/wp-content/themes/pyfa-theme/assets/images/logo-pyfa.png', website: 'https://www.pyridam.com', description_id: 'Inovasi kesehatan Indonesia.', description_en: 'Indonesian healthcare innovation.', sort_order: 21 },
    { name: 'PT Novell Pharmaceutical', partner_type: 'principal', logo_url: 'https://novellpharm.com/wp-content/themes/novell/assets/images/logo.png', website: 'https://novellpharm.com', description_id: 'Laboratorium farmasi modern.', description_en: 'Modern pharmaceutical laboratories.', sort_order: 22 }
];

async function updateAllLogos() {
    console.log('🚀 Updating all partner logos (International & Principals)...');

    // Clear existing
    await supabase.from('partners').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const { error } = await supabase.from('partners').insert(allPartners.map(p => ({
        ...p,
        is_active: true
    })));

    if (error) {
        console.error('❌ Error updating logos:', error.message);
    } else {
        console.log(`✅ Successfully updated ${allPartners.length} partners with real logos!`);
    }
}

updateAllLogos();
