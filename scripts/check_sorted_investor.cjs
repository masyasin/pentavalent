
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSortedInvestor() {
    const { data, error } = await supabase
        .from('nav_menus')
        .select('*')
        .eq('path', '#investor')
        .eq('location', 'header')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Sorted Investor Menus:', data.map(m => ({ id: m.id, label: m.label_id, order: m.sort_order, active: m.is_active })));
    }
}

checkSortedInvestor();
