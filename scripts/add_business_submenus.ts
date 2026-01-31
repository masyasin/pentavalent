import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addBusinessSubMenus() {
    const parentId = 'b71e0038-9126-48d1-a106-1edd30ef149d'; // Lini Bisnis

    const items = [
        {
            label_id: 'Alur Distribusi',
            label_en: 'Distribution Flow',
            path: '/business/distribution-flow',
            parent_id: parentId,
            sort_order: 3,
            location: 'header',
            is_active: true
        },
        {
            label_id: 'Target Pasar',
            label_en: 'Target Market',
            path: '/business/target-market',
            parent_id: parentId,
            sort_order: 4,
            location: 'header',
            is_active: true
        }
    ];

    console.log('Inserting sub-menus...');
    const { data, error } = await supabase.from('nav_menus').insert(items).select();

    if (error) {
        console.error('Error inserting:', error);
    } else {
        console.log('Successfully inserted:', data);
    }
}

addBusinessSubMenus();
