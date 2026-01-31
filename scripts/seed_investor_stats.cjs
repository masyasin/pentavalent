const { createClient } = require('@supabase/supabase-js');


const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';


const supabase = createClient(supabaseUrl, supabaseKey);

async function seedStats() {
    console.log('🚀 Seeding Investor Statistics...');

    // 1. Ratios
    const ratios = [
        {
            label: 'P/E Ratio',
            value: '12.4x',
            description_id: 'Rasio Harga terhadap Laba',
            description_en: 'Price to Earnings',
            icon_name: 'Activity',
            sort_order: 1
        },
        {
            label: 'EPS',
            value: '45.8',
            description_id: 'Laba per Saham',
            description_en: 'Earnings Per Share',
            icon_name: 'TrendingUp',
            sort_order: 2
        },
        {
            label: 'PBV',
            value: '1.8x',
            description_id: 'Rasio Harga terhadap Nilai Buku',
            description_en: 'Price to Book Value',
            icon_name: 'FileText',
            sort_order: 3
        },
        {
            label: 'ROE',
            value: '15.2%',
            description_id: 'Pengembalian Ekuitas',
            description_en: 'Return on Equity',
            icon_name: 'PieChart',
            sort_order: 4
        }
    ];

    // 2. Shareholders
    const shareholders = [
        {
            name: 'PT Penta Valent Group',
            percentage: 65.20,
            color_start: 'from-blue-600',
            color_end: 'to-cyan-500',
            sort_order: 1
        },
        {
            name: 'Public / Masyarakat',
            percentage: 34.80,
            color_start: 'from-cyan-400',
            color_end: 'to-emerald-400',
            sort_order: 2
        }
    ];

    // 3. Dividend History
    const dividends = [
        { year: 2023, amount: '15 IDR/Share', sort_order: 2023 },
        { year: 2024, amount: '18 IDR/Share', sort_order: 2024 }
    ];

    try {
        // Clear existing (optional, but good for idempotent seeding)
        // Note: In production you might Check before insert, but here for init it's fine.

        const { error: rError } = await supabase.from('investor_ratios').insert(ratios);
        if (rError) console.error('Error seeding ratios:', rError);
        else console.log('✅ Ratios seeded');

        const { error: sError } = await supabase.from('investor_shareholders').insert(shareholders);
        if (sError) console.error('Error seeding shareholders:', sError);
        else console.log('✅ Shareholders seeded');

        const { error: dError } = await supabase.from('investor_dividend_history').insert(dividends);
        if (dError) console.error('Error seeding dividends:', dError);
        else console.log('✅ Dividends seeded');

    } catch (e) {
        console.error('Unexpected error:', e);
    }
}

seedStats();
