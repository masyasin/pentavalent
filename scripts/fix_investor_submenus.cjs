
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixInvestorSubmenus() {
    console.log('🔄 Fixing Investor Relations sub-menus parent ID...');

    // The correct header parent ID
    const correctParentId = '801e9782-9fc9-495b-999a-de7355769d7b';

    // Sub-menu paths to target
    const subMenuPaths = [
        '/investor/ringkasan-investor',
        '/investor/informasi-saham',
        '/investor/laporan-keuangan',
        '/investor/prospektus',
        '/investor/rups',
        '/investor/keterbukaan-informasi'
    ];

    const { data, error } = await supabase
        .from('nav_menus')
        .update({ parent_id: correctParentId })
        .in('path', subMenuPaths);

    if (error) {
        console.error('❌ Error updating sub-menus:', error);
    } else {
        console.log('✅ Successfully updated sub-menus to point to the correct header parent.');
    }
}

fixInvestorSubmenus();
