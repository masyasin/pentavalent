import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

const pharmaceuticalPrincipals = [
    {
        name: 'PT. Lapi Laboratories Indonesia',
        partner_type: 'principal',
        logo_url: '/images/principals/lapi.png',
        website: 'https://www.lapi.co.id',
        description_id: 'Produsen farmasi terkemuka di Indonesia',
        description_en: 'Leading pharmaceutical manufacturer in Indonesia',
        sort_order: 1
    },
    {
        name: 'PT. Cendo',
        partner_type: 'principal',
        logo_url: '/images/principals/cendo.png',
        website: 'https://www.cendo.co.id',
        description_id: 'Spesialis produk kesehatan mata',
        description_en: 'Eye health products specialist',
        sort_order: 2
    },
    {
        name: 'PT. Meprofarm',
        partner_type: 'principal',
        logo_url: '/images/principals/mepro.png',
        website: 'https://www.meprofarm.co.id',
        description_id: 'Perusahaan farmasi nasional',
        description_en: 'National pharmaceutical company',
        sort_order: 3
    },
    {
        name: 'PT. Guardian Pharmatama',
        partner_type: 'principal',
        logo_url: '/images/principals/guardian.png',
        website: 'https://www.guardianpharmatama.com',
        description_id: 'Produsen obat-obatan berkualitas',
        description_en: 'Quality pharmaceutical manufacturer',
        sort_order: 4
    },
    {
        name: 'PT. Nifah Pharmaceutical Indonesia',
        partner_type: 'principal',
        logo_url: '/images/principals/nifah.png',
        website: '',
        description_id: 'Industri farmasi Indonesia',
        description_en: 'Indonesian pharmaceutical industry',
        sort_order: 5
    },
    {
        name: 'PT. Galenium Pharmasia',
        partner_type: 'principal',
        logo_url: '/images/principals/galenium.png',
        website: 'https://www.galenium.com',
        description_id: 'Perusahaan farmasi modern',
        description_en: 'Modern pharmaceutical company',
        sort_order: 6
    },
    {
        name: 'PT. Simex Pharmaceutical Indonesia',
        partner_type: 'principal',
        logo_url: '/images/principals/simex.png',
        website: 'https://www.simexpharmaceutical.com',
        description_id: 'Produsen farmasi terpercaya',
        description_en: 'Trusted pharmaceutical manufacturer',
        sort_order: 7
    },
    {
        name: 'PT. Ethica Industri Farmasi',
        partner_type: 'principal',
        logo_url: '/images/principals/ethica.png',
        website: 'https://www.ethica.co.id',
        description_id: 'Industri farmasi etis',
        description_en: 'Ethical pharmaceutical industry',
        sort_order: 8
    },
    {
        name: 'PT. Surya Dermato Medica Laboratories',
        partner_type: 'principal',
        logo_url: '/images/principals/sdm.png',
        website: 'https://www.sdm-labs.com',
        description_id: 'Spesialis produk dermatologi',
        description_en: 'Dermatology products specialist',
        sort_order: 9
    },
    {
        name: 'PT. Dipa Healthcare',
        partner_type: 'principal',
        logo_url: '/images/principals/dipa.png',
        website: 'https://www.dipahealthcare.com',
        description_id: 'Penyedia layanan kesehatan',
        description_en: 'Healthcare service provider',
        sort_order: 10
    },
    {
        name: 'PT. Satya Abadi Pharma',
        partner_type: 'principal',
        logo_url: '',
        website: 'https://sapharma.co.id',
        description_id: 'Produsen farmasi Indonesia',
        description_en: 'Indonesian pharmaceutical manufacturer',
        sort_order: 11
    },
    {
        name: 'PT. Promed',
        partner_type: 'principal',
        logo_url: '',
        website: '',
        description_id: 'Perusahaan farmasi nasional',
        description_en: 'National pharmaceutical company',
        sort_order: 12
    },
    {
        name: 'PT. Fahrenheit',
        partner_type: 'principal',
        logo_url: '',
        website: 'https://fahrenheit.co.id',
        description_id: 'Industri farmasi Pratapa Nirmala',
        description_en: 'Pratapa Nirmala pharmaceutical industry',
        sort_order: 13
    },
    {
        name: 'PT. Erlangga Edi Laboratories',
        partner_type: 'principal',
        logo_url: '',
        website: 'https://erela.co.id',
        description_id: 'Laboratorium farmasi',
        description_en: 'Pharmaceutical laboratory',
        sort_order: 14
    },
    {
        name: 'PT. Erlimpex',
        partner_type: 'principal',
        logo_url: '',
        website: '',
        description_id: 'Perusahaan farmasi',
        description_en: 'Pharmaceutical company',
        sort_order: 15
    },
    {
        name: 'PT. Metiska Farma',
        partner_type: 'principal',
        logo_url: '',
        website: '',
        description_id: 'Pharmaceutical industry',
        description_en: 'Pharmaceutical industry',
        sort_order: 16
    },
    {
        name: 'Novell Pharmaceutical Laboratories',
        partner_type: 'principal',
        logo_url: '',
        website: 'https://novellpharm.com',
        description_id: 'Laboratorium farmasi',
        description_en: 'Pharmaceutical laboratories',
        sort_order: 17
    },
    {
        name: 'PT. Imfarmind Farmasi Industri',
        partner_type: 'principal',
        logo_url: '',
        website: '',
        description_id: 'Industri farmasi',
        description_en: 'Pharmaceutical industry',
        sort_order: 18
    },
    {
        name: 'Pyridam Farma',
        partner_type: 'principal',
        logo_url: '',
        website: 'https://www.pyridam.com',
        description_id: 'Perusahaan farmasi',
        description_en: 'Pharmaceutical company',
        sort_order: 19
    },
    {
        name: 'PT. Prosweal Indomax',
        partner_type: 'principal',
        logo_url: '',
        website: '',
        description_id: 'Perusahaan farmasi Indonesia',
        description_en: 'Indonesian pharmaceutical company',
        sort_order: 20
    }
];

async function seedPrincipals() {
    try {
        console.log('🚀 Starting pharmaceutical principals seeding...');

        // Delete existing principals
        const { error: deleteError } = await supabase
            .from('partners')
            .delete()
            .eq('partner_type', 'principal');

        if (deleteError) {
            console.error('❌ Error deleting existing principals:', deleteError);
            return;
        }

        console.log('✅ Cleared existing principals');

        // Insert new principals
        const { data, error } = await supabase
            .from('partners')
            .insert(pharmaceuticalPrincipals.map(p => ({
                ...p,
                is_active: true
            })))
            .select();

        if (error) {
            console.error('❌ Error inserting principals:', error);
            return;
        }

        console.log(`✅ Successfully seeded ${data?.length} pharmaceutical principals!`);
        console.log('\n📋 Seeded principals:');
        data?.forEach((p, idx) => {
            console.log(`   ${idx + 1}. ${p.name}`);
        });

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

seedPrincipals();
