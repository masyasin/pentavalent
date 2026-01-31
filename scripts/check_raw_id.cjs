
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRawParentID() {
    const { data, error } = await supabase
        .from('nav_menus')
        .select('id, label_id, parent_id')
        .eq('path', '/investor/rups')
        .single();

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(`Sub-menu: ${data.label_id}`);
        console.log(`Parent ID (Hex): ${Buffer.from(data.parent_id).toString('hex')}`);
        console.log(`Parent ID (String): "${data.parent_id}"`);
    }
}

checkRawParentID();
