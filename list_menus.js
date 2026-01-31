
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllMenus() {
    const { data, error } = await supabase
        .from('nav_menus')
        .select('*')
        .order('location', { ascending: false })
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching menus:', error);
    } else {
        // console.log(JSON.stringify(data, null, 2));
        // Print a summary table
        console.table(data.map(m => ({ location: m.location, path: m.path, label_id: m.label_id })));
    }
}

listAllMenus();
