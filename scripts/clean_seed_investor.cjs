
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanAndSeedInvestor() {
    console.log('🚀 CLEANING AND RE-SEEDING INVESTOR MENUS...');

    // 1. Find all possible parent menus with label containing 'Investor'
    const { data: oldMenus } = await supabase
        .from('nav_menus')
        .select('id')
        .ilike('label_id', '%investor%');

    const oldIds = oldMenus.map(m => m.id);

    // 2. Delete all children of those parents
    if (oldIds.length > 0) {
        await supabase.from('nav_menus').delete().in('parent_id', oldIds);
        // 3. Delete those parents
        await supabase.from('nav_menus').delete().in('id', oldIds);
    }

    // 4. Also delete any abandoned sub-menus by path
    const subMenuPaths = [
        '/investor/ringkasan-investor',
        '/investor/informasi-saham',
        '/investor/laporan-keuangan',
        '/investor/prospektus',
        '/investor/rups',
        '/investor/keterbukaan-informasi'
    ];
    await supabase.from('nav_menus').delete().in('path', subMenuPaths);

    // 5. Insert FRESH parent
    const { data: parentData, error: parentError } = await supabase.from('nav_menus').insert({
        label_id: 'Hubungan Investor',
        label_en: 'Investor Relations',
        path: '#investors', // Changed to #investors to match section ID usually (or #investor)
        sort_order: 5,
        location: 'header',
        is_active: true
    }).select().single();

    if (parentError) {
        console.error('Error inserting parent:', parentError);
        return;
    }

    const parentId = parentData.id;
    console.log(`✅ Fresh Parent Created: ${parentId}`);

    // 6. Insert FRESH children
    const children = [
        { label_id: 'Ringkasan Investor', label_en: 'Investor Highlight', path: '/investor/ringkasan-investor', sort_order: 1 },
        { label_id: 'Informasi Saham', label_en: 'Stock Information', path: '/investor/informasi-saham', sort_order: 2 },
        { label_id: 'Laporan Keuangan', label_en: 'Financial Reports', path: '/investor/laporan-keuangan', sort_order: 3 },
        { label_id: 'Prospektus', label_en: 'Prospectus', path: '/investor/prospektus', sort_order: 4 },
        { label_id: 'RUPS', label_en: 'General Meetings', path: '/investor/rups', sort_order: 5 },
        { label_id: 'Keterbukaan Informasi', label_en: 'Information Disclosure', path: '/investor/keterbukaan-informasi', sort_order: 6 }
    ].map(item => ({
        ...item,
        parent_id: parentId,
        location: 'header',
        is_active: true
    }));

    const { error: childrenError } = await supabase.from('nav_menus').insert(children);

    if (childrenError) {
        console.error('Error inserting children:', childrenError);
    } else {
        console.log('✅ Successfully re-seeded all investor menus on a clean slate.');
    }
}

cleanAndSeedInvestor();
