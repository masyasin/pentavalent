import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedPartners() {
    console.log('🚀 Seeding Partners Data...\n');

    // Clear existing partners
    console.log('Clearing partners table...');
    await supabase.from('partners').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert partner data
    const partnersData = [
        {
            name: 'Pfizer Indonesia',
            partner_type: 'international',
            description_id: 'Perusahaan farmasi global terkemuka yang mengembangkan obat-obatan inovatif untuk berbagai penyakit.',
            description_en: 'Leading global pharmaceutical company developing innovative medicines for various diseases.',
            logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400',
            website: 'https://www.pfizer.com',
            sort_order: 1,
            is_active: true
        },
        {
            name: 'Johnson & Johnson',
            partner_type: 'international',
            description_id: 'Konglomerat multinasional yang bergerak di bidang farmasi, alat kesehatan, dan produk konsumen.',
            description_en: 'Multinational conglomerate in pharmaceuticals, medical devices, and consumer products.',
            logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400',
            website: 'https://www.jnj.com',
            sort_order: 2,
            is_active: true
        },
        {
            name: 'Siemens Healthineers',
            partner_type: 'international',
            description_id: 'Penyedia teknologi medis terdepan untuk diagnostik dan terapi.',
            description_en: 'Leading medical technology provider for diagnostics and therapy.',
            logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400',
            website: 'https://www.siemens-healthineers.com',
            sort_order: 3,
            is_active: true
        },
        {
            name: 'PT Kalbe Farma Tbk',
            partner_type: 'principal',
            description_id: 'Perusahaan farmasi terbesar di Indonesia dengan portofolio produk yang lengkap.',
            description_en: 'Indonesia\'s largest pharmaceutical company with comprehensive product portfolio.',
            logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400',
            website: 'https://www.kalbe.co.id',
            sort_order: 4,
            is_active: true
        },
        {
            name: 'PT Kimia Farma Tbk',
            partner_type: 'principal',
            description_id: 'BUMN farmasi terpercaya dengan jaringan apotek terluas di Indonesia.',
            description_en: 'Trusted state-owned pharmaceutical company with Indonesia\'s widest pharmacy network.',
            logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400',
            website: 'https://www.kimiafarma.co.id',
            sort_order: 5,
            is_active: true
        },
        {
            name: 'PT Sanbe Farma',
            partner_type: 'principal',
            description_id: 'Produsen farmasi nasional berkualitas dengan standar internasional.',
            description_en: 'Quality national pharmaceutical manufacturer with international standards.',
            logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400',
            website: 'https://www.sanbe.co.id',
            sort_order: 6,
            is_active: true
        },
        {
            name: 'Novartis Indonesia',
            partner_type: 'international',
            description_id: 'Perusahaan farmasi global yang fokus pada inovasi kesehatan.',
            description_en: 'Global pharmaceutical company focused on healthcare innovation.',
            logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400',
            website: 'https://www.novartis.com',
            sort_order: 7,
            is_active: true
        },
        {
            name: 'Roche Indonesia',
            partner_type: 'international',
            description_id: 'Pemimpin global dalam diagnostik dan farmasi.',
            description_en: 'Global leader in diagnostics and pharmaceuticals.',
            logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400',
            website: 'https://www.roche.com',
            sort_order: 8,
            is_active: true
        },
        {
            name: 'PT Dexa Medica',
            partner_type: 'principal',
            description_id: 'Perusahaan farmasi nasional dengan produk berkualitas tinggi.',
            description_en: 'National pharmaceutical company with high-quality products.',
            logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400',
            website: 'https://www.dexa-medica.com',
            sort_order: 9,
            is_active: true
        },
        {
            name: 'PT Tempo Scan Pacific Tbk',
            partner_type: 'principal',
            description_id: 'Produsen farmasi dan consumer health terkemuka di Indonesia.',
            description_en: 'Leading pharmaceutical and consumer health manufacturer in Indonesia.',
            logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400',
            website: 'https://www.tempo.co.id',
            sort_order: 10,
            is_active: true
        },
        {
            name: 'AstraZeneca Indonesia',
            partner_type: 'international',
            description_id: 'Perusahaan biofarmasi global dengan fokus pada inovasi.',
            description_en: 'Global biopharmaceutical company focused on innovation.',
            logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400',
            website: 'https://www.astrazeneca.com',
            sort_order: 11,
            is_active: true
        },
        {
            name: 'Merck Indonesia',
            partner_type: 'international',
            description_id: 'Perusahaan sains dan teknologi terkemuka di bidang kesehatan.',
            description_en: 'Leading science and technology company in healthcare.',
            logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400',
            website: 'https://www.merck.com',
            sort_order: 12,
            is_active: true
        }
    ];

    console.log('Inserting partners data...');
    const { data, error } = await supabase.from('partners').insert(partnersData);

    if (error) {
        console.error('❌ Error seeding partners:', error.message);
        return;
    }

    console.log(`✅ Successfully seeded ${partnersData.length} partners!`);
    console.log('\n📊 Summary:');
    console.log(`   - International Partners: ${partnersData.filter(p => p.partner_type === 'international').length}`);
    console.log(`   - National Principals: ${partnersData.filter(p => p.partner_type === 'principal').length}`);
}

seedPartners();
