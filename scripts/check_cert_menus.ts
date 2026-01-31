import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCertMenus() {
    console.log('Checking certification menus...');
    const { data: menuItems, error } = await supabase
        .from('nav_menus')
        .select('*')
        .or('label_id.eq.Sertifikasi,label_id.eq.Sertifikasi & Penghargaan');

    if (error) {
        console.error(error);
        return;
    }

    console.log('Found menus:', menuItems);
}

checkCertMenus();
