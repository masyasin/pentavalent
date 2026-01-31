import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addPrincipalsMenu() {
    console.log('Adding Prinsipals menu...');

    // We'll insert a menu item that points to /about/network-partners
    // But we'll label it "Prinsipals"

    const newItem = {
        label_id: 'Prinsipals',
        label_en: 'Principals',
        path: '/about/network-partners',
        sort_order: 3, // Adjust order as needed, maybe after Business?
        parent_id: null, // Top level or submenu? Assuming top level based on "delete Jaringan from header".
        is_active: true
    };

    const { data, error } = await supabase
        .from('nav_menus')
        .insert(newItem)
        .select();

    if (error) {
        console.error('Error inserting menu:', error);
    } else {
        console.log('Successfully inserted Prinsipals menu:', data);
    }
}

addPrincipalsMenu();
