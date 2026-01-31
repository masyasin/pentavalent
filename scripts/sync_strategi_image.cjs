
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncStrategiToImage() {
    console.log('🔄 Syncing Strategi Bisnis content with the provided image...');

    const { data: bLine } = await supabase
        .from('business_lines')
        .select('id')
        .eq('slug', 'strategi-bisnis')
        .single();

    if (!bLine) return;

    const bLineId = bLine.id;

    // Delete existing
    await supabase.from('business_advantages').delete().eq('business_line_id', bLineId);

    const advantages = [
        {
            business_line_id: bLineId,
            title_id: 'Berpengalaman Lebih dari 54 Tahun',
            title_en: 'Over 54 Years of Experience',
            description_id: 'Pengalaman penting untuk menghadapi persaingan dan masalah yang timbul dalam usaha, serta mengantisipasi tantangan yang ada dalam perjalanan usaha.',
            description_en: 'Crucial experience in facing competition and business issues, and anticipating challenges throughout the business journey.',
            icon_name: 'Users',
            sort_order: 1
        },
        {
            business_line_id: bLineId,
            title_id: 'Cara Distribusi Obat yang Baik',
            title_en: 'Good Distribution Practice',
            description_id: 'Perseroan telah mengimplementasikan Cara Distribusi Obat yang Baik (CDOB) sejak tahun 2015, mendapatkan penghargaan dari BPOM pada 2017, dan sertifikasi seluruh cabang pada 2019.',
            description_en: 'The Company has implemented Good Distribution Practice (GDP/CDOB) since 2015, received BPOM awards in 2017, and certified all branches in 2019.',
            icon_name: 'ShieldCheck',
            sort_order: 2
        },
        {
            business_line_id: bLineId,
            title_id: 'Jaringan Distribusi yang Luas',
            title_en: 'Extensive Distribution Network',
            description_id: 'Perseroan memiliki 34 Cabang di seluruh Indonesia yang menjangkau 21.000 outlet produk farmasi dan 14.000 outlet produk konsumsi secara nasional.',
            description_en: 'The Company has 34 Branches across Indonesia serving national coverage to reach 21,000 pharmaceutical outlets and 14,000 consumer product outlets.',
            icon_name: 'TrendingUp',
            sort_order: 3
        },
        {
            business_line_id: bLineId,
            title_id: 'Memiliki Sistem Teknologi Informasi yang Handal',
            title_en: 'Reliable Information Technology System',
            description_id: 'Perseroan menggunakan sistem Oracle sejak 2017 untuk menyediakan data real-time, cepat, dan handal guna menunjang kelancaran komunikasi dan operasional.',
            description_en: 'The Company has implemented the Oracle system since 2017 to provide real-time, fast, and reliable data to support smooth communication and operations.',
            icon_name: 'Server',
            sort_order: 4
        },
        {
            business_line_id: bLineId,
            title_id: 'Memiliki Prinsipal dan Pelanggan yang Ternama',
            title_en: 'Renowned Principals and Customers',
            description_id: 'Perseroan saat ini memiliki kontrak dengan prinsipal-prinsipal ternama serta pelanggan-pelanggan yang terpercaya di bidang farmasi.',
            description_en: 'The Company currently holds contracts with renowned principals and trusted customers in the pharmaceutical sector.',
            icon_name: 'Handshake',
            sort_order: 5
        }
    ];

    await supabase.from('business_advantages').insert(advantages);
    console.log('✅ Content synced successfully!');
}

syncStrategiToImage();
