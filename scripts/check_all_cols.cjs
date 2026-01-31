
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllCols() {
    const { data, error } = await supabase
        .from('nav_menus')
        .select('*')
        .eq('id', '801e9782-9fc9-495b-999a-de7355769d7b')
        .single();

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Parent Details (All):', data);
    }
}

checkAllCols();
