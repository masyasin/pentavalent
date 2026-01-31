
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMenus() {
    console.log('🔄 Checking Nav Menus...');

    const { data, error } = await supabase
        .from('nav_menus')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('❌ Error fetching menus:', error);
    } else {
        console.table(data);

        // Find 'news' or 'berita' parent
        const newsParent = data.find(m => m.path === '/news' || m.label_id.toLowerCase().includes('berita'));
        if (newsParent) {
            console.log('Found News Parent:', newsParent);
            const children = data.filter(m => m.parent_id === newsParent.id);
            console.log('Children:', children);
        } else {
            console.log('News parent not found');
        }
    }
}

checkMenus();
