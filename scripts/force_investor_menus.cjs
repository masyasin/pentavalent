
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceInvestorMenus() {
    console.log('🚀 Forcing Investor menus to be in header and active...');

    const investorIds = [
        '801e9782-9fc9-495b-999a-de7355769d7b', // Parent
    ];

    const subMenuPaths = [
        '/investor/ringkasan-investor',
        '/investor/informasi-saham',
        '/investor/laporan-keuangan',
        '/investor/prospektus',
        '/investor/rups',
        '/investor/keterbukaan-informasi'
    ];

    // Update parent
    await supabase.from('nav_menus').update({ location: 'header', is_active: true }).eq('id', investorIds[0]);

    // Update sub-menus
    await supabase.from('nav_menus').update({ location: 'header', is_active: true, parent_id: investorIds[0] }).in('path', subMenuPaths);

    console.log('✅ Done forcing.');
}

forceInvestorMenus();
