import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertDiagram() {
    const alurDistId = '8265cc7a-8d93-497d-bb07-a765e2cade25';
    const imageUrl = '/images/distribution-flow.jpg';

    console.log('Inserting diagram into business_images...');

    // First, shift other images if any
    await supabase.rpc('increment_sort_order', { table_name: 'business_images', line_id: alurDistId });

    const { data, error } = await supabase.from('business_images').insert({
        business_line_id: alurDistId,
        image_url: imageUrl,
        sort_order: 0
    }).select();

    if (error) {
        console.error('Error inserting:', error);
    } else {
        console.log('Successfully inserted diagram:', data);
    }
}

insertDiagram();
