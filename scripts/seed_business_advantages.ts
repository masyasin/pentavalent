import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAdvantages() {
    console.log('Seeding Competitive Advantages...');

    const slugs = ['distribusi-farmasi', 'produk-konsumen'];

    const advantages = [
        {
            title_id: 'Berpengalaman Lebih dari 54 Tahun',
            title_en: 'Over 54 Years of Experience',
            description_id: 'Pengalaman penting untuk menghadapi persaingan dan masalah yang timbul dalam usaha, serta mengantisipasi tantangan yang ada dalam perjalanan usaha.',
            description_en: 'Essential experience to face competition and issues arising in business, as well as anticipating challenges in the business journey.',
            icon_name: 'users',
            sort_order: 1
        },
        {
            title_id: 'Cara Distribusi Obat yang Baik',
            title_en: 'Good Distribution Practice (CDOB)',
            description_id: 'Perseroan telah mengimplementasikan Cara Distribusi Obat yang Baik (CDOB) sejak tahun 2015, dan mendapatkan penghargaan dari Badan Pengawas Obat dan Makanan (BPOM) pada tahun 2017 dan telah memperoleh sertifikat untuk seluruh cabang pada tahun 2019.',
            description_en: 'The Company has implemented Good Distribution Practice (CDOB) since 2015, received an award from the National Agency of Drug and Food Control (BPOM) in 2017, and obtained certificates for all branches in 2019.',
            icon_name: 'award',
            sort_order: 2
        },
        {
            title_id: 'Jaringan Distribusi yang Luas',
            title_en: 'Extensive Distribution Network',
            description_id: 'Perseroan memiliki 34 Cabang di seluruh Indonesia yang melayani cakupan nasional guna menjangkau 21.000 outlet untuk produk farmasi dan 14.000 outlet untuk produk konsumsi.',
            description_en: 'The Company has 34 Branches throughout Indonesia serving national coverage to reach 21,000 outlets for pharmaceutical products and 14,000 outlets for consumer products.',
            icon_name: 'trending',
            sort_order: 3
        },
        {
            title_id: 'Memiliki Sistem Teknologi Informasi yang Handal',
            title_en: 'Reliable Information Technology System',
            description_id: 'Perseroan mengimplementasikan sistem Oracle sejak tahun 2017. Dengan sistem tersebut, Perseroan dapat menyediakan data online secara real time, cepat dan dapat diandalkan, sehingga menunjang kelancaran komunikasi dan aktivitas operasional.',
            description_en: 'The Company implemented the Oracle system since 2017. With this system, the Company can provide real-time, fast, and reliable online data, supporting smooth communication and operational activities.',
            icon: 'server',
            sort_order: 4
        },
        {
            title_id: 'Memiliki Prinsipal dan Pelanggan yang Ternama',
            title_en: 'Reputable Principals and Customers',
            description_id: 'Perseroan saat ini memiliki kontrak dengan prinsipal-prinsipal ternama serta pelanggan-pelanggan yang terpercaya di bidang farmasi.',
            description_en: 'The Company currently holds contracts with reputable principals as well as trusted customers in the pharmaceutical field.',
            icon: 'handshake',
            sort_order: 5
        }
    ];

    for (const slug of slugs) {
        const { data: businessLine } = await supabase
            .from('business_lines')
            .select('id')
            .eq('slug', slug)
            .single();

        if (businessLine) {
            console.log(`Updating advantages for ${slug}...`);
            // Delete existing
            // Attempt to verify if table exists by selecting
            const { error: checkError } = await supabase.from('business_advantages').select('id').limit(1);
            if (checkError && checkError.code === '42P01') {
                console.error('❌ Table "business_advantages" does not exist. Please run setup_business_advantages.sql first.');
                return;
            }

            await supabase.from('business_advantages').delete().eq('business_line_id', businessLine.id);

            const { error } = await supabase.from('business_advantages').insert(
                advantages.map(adv => ({
                    ...adv,
                    business_line_id: businessLine.id
                }))
            );

            if (error) console.error(`Error inserting advantages for ${slug}:`, error);
            else console.log(`✅ Automatically inserted advantages for ${slug}`);
        }
    }
}

seedAdvantages();
