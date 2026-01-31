
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllInvestorMenus() {
    const { data, error } = await supabase
        .from('nav_menus')
        .select('*')
        .ilike('label_id', '%Hubungan Investor%');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('All Investor Menus:', data.map(m => ({ id: m.id, label: m.label_id, location: m.location, path: m.path })));
    }
}

checkAllInvestorMenus();
