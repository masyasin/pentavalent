const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMenus() {
    const { data, error } = await supabase
        .from('nav_menus')
        .select('id, label_en, path, parent_id')
        .or('label_en.ilike.%Career%,label_en.ilike.%Contact%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    data.forEach(m => {
        console.log(`Menu: ${m.label_en}, Path: ${m.path}, ID: ${m.id}`);
    });
}

checkMenus();
