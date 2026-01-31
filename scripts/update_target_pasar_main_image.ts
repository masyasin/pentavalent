import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateMainImage() {
    console.log('Updating Main Image for Target Pasar...');

    const { error } = await supabase
        .from('business_lines')
        .update({ image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e' }) // Modern Market theme
        .or('slug.eq.target-pasar,slug.eq.target-market');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Main image updated.');
    }
}

updateMainImage();
