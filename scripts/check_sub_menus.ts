import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubMenus() {
    console.log('Checking sub-menus for Lini Bisnis...');
    const { data, error } = await supabase
        .from('nav_menus')
        .select('*')
        .eq('parent_id', 'aad6c68d-b418-43a9-a6c7-bffd5c8e88b6');

    if (error) {
        console.error(error);
        return;
    }

    console.log('Current sub-menus:', data);
}

checkSubMenus();
