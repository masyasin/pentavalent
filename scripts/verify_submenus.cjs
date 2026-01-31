
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySubmenus() {
    const { data, error } = await supabase
        .from('nav_menus')
        .select('*')
        .ilike('path', '/investor/%');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Sub-menus Verification:', data.map(m => ({ label: m.label_id, parent: m.parent_id, location: m.location, active: m.is_active })));
    }
}

verifySubmenus();
