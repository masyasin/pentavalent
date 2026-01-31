
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkID25b() {
    const { data, error } = await supabase
        .from('nav_menus')
        .select('*')
        .eq('id', '25b8370c-b2b5-4ce6-9ca4-f2d46b8e9f35')
        .single();

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Menu 25b Details:', data);
    }
}

checkID25b();
