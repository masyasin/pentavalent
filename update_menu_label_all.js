
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAllMenuLocations() {
    console.log('Updating all menu label locations...');

    const { data, error } = await supabase
        .from('nav_menus')
        .update({
            label_id: 'Legalitas, Kepatuhan & Pencapaian',
            label_en: 'Legality, Compliance & Achievements'
        })
        .eq('path', '/about/legality-achievements');

    if (error) {
        console.error('Error updating menus:', error);
    } else {
        console.log(`Successfully updated ${data?.length || 0} menu label(s) in database.`);
    }
}

updateAllMenuLocations();
