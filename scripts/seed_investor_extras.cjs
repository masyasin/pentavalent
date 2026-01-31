
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedInvestorExtras() {
    console.log('🚀 Seeding Investor Highlights and Calendar...');

    const highlights = [
        {
            label_id: 'Pertumbuhan Pendapatan',
            label_en: 'Revenue Growth',
            value: '18.4%',
            growth: '+2.1%',
            icon_name: 'TrendingUp',
            sort_order: 1
        },
        {
            label_id: 'Kapitalisasi Pasar',
            label_en: 'Market Cap',
            value: '2.4T',
            growth: 'Stabil',
            icon_name: 'Activity',
            sort_order: 2
        },
        {
            label_id: 'Hasil Dividen',
            label_en: 'Dividend Yield',
            value: '4.2%',
            growth: '+0.5%',
            icon_name: 'PieChart',
            sort_order: 3
        }
    ];

    const calendar = [
        {
            title_id: 'Rilis Laporan Keuangan Tahunan 2024',
            title_en: 'FY2024 Financial Results Release',
            event_date: '2025-03-15',
            event_type: 'Earnings'
        },
        {
            title_id: 'Rapat Umum Pemegang Saham Tahunan (RUPST)',
            title_en: 'Annual General Meeting (AGMS)',
            event_date: '2025-04-22',
            event_type: 'Corporate'
        },
        {
            title_id: 'Rilis Laporan Kuartal I 2025',
            title_en: 'Q1 2025 Quarterly Filing',
            event_date: '2025-05-10',
            event_type: 'Earnings'
        }
    ];

    const stockData = [
        { date: '2025-01-31', open_price: 1500, high_price: 1550, low_price: 1480, close_price: 1520, volume: 1000000 },
        { date: '2025-01-30', open_price: 1480, high_price: 1510, low_price: 1470, close_price: 1500, volume: 850000 },
        { date: '2025-01-29', open_price: 1450, high_price: 1490, low_price: 1440, close_price: 1480, volume: 1200000 }
    ];

    try {
        const { error: hError } = await supabase.from('investor_highlights').insert(highlights);
        if (hError) console.error('Error seeding highlights:', hError.message);
        else console.log('✅ Seeded highlights');

        const { error: cError } = await supabase.from('investor_calendar').insert(calendar);
        if (cError) console.error('Error seeding calendar:', cError.message);
        else console.log('✅ Seeded calendar');

        const { error: sError } = await supabase.from('investor_stock_data').insert(stockData);
        if (sError) console.error('Error seeding stock data:', sError.message);
        else console.log('✅ Seeded stock data');

    } catch (e) {
        console.error('Seed exception:', e);
    }
}

seedInvestorExtras();
