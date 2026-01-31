
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSubmenusToAllInvestor() {
    console.log('🚀 Ensuring sub-menus are attached to ALL "Hubungan Investor" menus across locations...');

    const possibleParents = [
        '801e9782-9fc9-495b-999a-de7355769d7b',
        '497c672f-9988-47cf-b0f7-e5a6e0bf903a'
    ];

    const baseItems = [
        { label_id: 'Ringkasan Investor', label_en: 'Investor Highlight', path: '/investor/ringkasan-investor', sort_order: 1 },
        { label_id: 'Informasi Saham', label_en: 'Stock Information', path: '/investor/informasi-saham', sort_order: 2 },
        { label_id: 'Laporan Keuangan', label_en: 'Financial Reports', path: '/investor/laporan-keuangan', sort_order: 3 },
        { label_id: 'Prospektus', label_en: 'Prospectus', path: '/investor/prospektus', sort_order: 4 },
        { label_id: 'RUPS', label_en: 'General Meetings', path: '/investor/rups', sort_order: 5 },
        { label_id: 'Keterbukaan Informasi', label_en: 'Information Disclosure', path: '/investor/keterbukaan-informasi', sort_order: 6 }
    ];

    for (const parentId of possibleParents) {
        // First delete existing for this parent to avoid duplicates if any
        await supabase.from('nav_menus').delete().eq('parent_id', parentId);

        const itemsToInsert = baseItems.map(item => ({
            ...item,
            parent_id: parentId,
            location: 'header',
            is_active: true
        }));

        await supabase.from('nav_menus').insert(itemsToInsert);
    }

    console.log('✅ Done syncing sub-menus.');
}

addSubmenusToAllInvestor();
