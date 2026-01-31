
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInvestorPresence() {
    const { data: menus, error } = await supabase
        .from('nav_menus')
        .select('*')
        .eq('is_active', true)
        .eq('location', 'header')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error:', error);
    } else {
        const investorMenu = menus.find(m => m.label_id.includes('Investor') && !m.parent_id);
        if (investorMenu) {
            const children = menus.filter(m => m.parent_id === investorMenu.id);
            console.log(`✅ Parent Found: ${investorMenu.label_id} [${investorMenu.id}]`);
            console.log(`✅ Children Found: ${children.length}`);
            children.forEach(c => console.log(`   - ${c.label_id}`));
        } else {
            console.log('❌ Investor Parent NOT FOUND in Header Menus');
        }
    }
}

checkInvestorPresence();
