const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePaths() {
    console.log('Updating Career and Contact paths...');

    // Update Career
    const { error: err1 } = await supabase
        .from('nav_menus')
        .update({ path: '/career' })
        .ilike('label_en', '%Career%');

    if (err1) console.error('Error updating Career:', err1);
    else console.log('Updated Career to /career');

    // Update Contact
    const { error: err2 } = await supabase
        .from('nav_menus')
        .update({ path: '/contact' })
        .ilike('label_en', '%Contact%');

    if (err2) console.error('Error updating Contact:', err2);
    else console.log('Updated Contact to /contact');
}

updatePaths();
