import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateMainImage() {
    const alurDistId = '8265cc7a-8d93-497d-bb07-a765e2cade25';
    const imageUrl = '/images/distribution-flow.jpg';

    console.log('Updating main image in business_lines...');
    const { data, error } = await supabase
        .from('business_lines')
        .update({ image_url: imageUrl })
        .eq('id', alurDistId)
        .select();

    if (error) {
        console.error('Error updating:', error);
    } else {
        console.log('Successfully updated main image:', data);
    }
}

updateMainImage();
