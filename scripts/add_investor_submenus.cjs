
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addInvestorSubMenus() {
    console.log('🚀 Adding Investor Relations sub-menus...');

    const parentId = '497c672f-9988-47cf-b0f7-e5a6e0bf903a'; // Hubungan Investor

    const items = [
        {
            label_id: 'Ringkasan Investor',
            label_en: 'Investor Highlight',
            path: '/investor/ringkasan-investor',
            parent_id: parentId,
            sort_order: 1,
            location: 'header',
            is_active: true
        },
        {
            label_id: 'Informasi Saham',
            label_en: 'Stock Information',
            path: '/investor/informasi-saham',
            parent_id: parentId,
            sort_order: 2,
            location: 'header',
            is_active: true
        },
        {
            label_id: 'Laporan Keuangan',
            label_en: 'Financial Reports',
            path: '/investor/laporan-keuangan',
            parent_id: parentId,
            sort_order: 3,
            location: 'header',
            is_active: true
        },
        {
            label_id: 'Prospektus',
            label_en: 'Prospectus',
            path: '/investor/prospektus',
            parent_id: parentId,
            sort_order: 4,
            location: 'header',
            is_active: true
        },
        {
            label_id: 'RUPS',
            label_en: 'General Meetings',
            path: '/investor/rups',
            parent_id: parentId,
            sort_order: 5,
            location: 'header',
            is_active: true
        },
        {
            label_id: 'Keterbukaan Informasi',
            label_en: 'Information Disclosure',
            path: '/investor/keterbukaan-informasi',
            parent_id: parentId,
            sort_order: 6,
            location: 'header',
            is_active: true
        }
    ];

    const { data, error } = await supabase.from('nav_menus').insert(items).select();

    if (error) {
        console.error('❌ Error inserting:', error);
    } else {
        console.log('✅ Successfully inserted sub-menus:', data.length);
    }
}

addInvestorSubMenus();
