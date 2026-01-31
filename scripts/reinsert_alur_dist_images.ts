import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanAndInsert() {
    const alurDistId = '8265cc7a-8d93-497d-bb07-a765e2cade25';

    console.log('Cleaning existing images for Alur Distribusi...');
    await supabase.from('business_images').delete().eq('business_line_id', alurDistId);

    const images = [
        {
            business_line_id: alurDistId,
            image_url: '/images/distribution-flow.jpg',
            sort_order: 0
        },
        {
            business_line_id: alurDistId,
            image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000',
            sort_order: 1
        },
        {
            business_line_id: alurDistId,
            image_url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1000',
            sort_order: 2
        }
    ];

    console.log('Inserting images...');
    const { data, error } = await supabase.from('business_images').insert(images).select();

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Successfully inserted:', data);
    }

    // Also update main business line image
    await supabase.from('business_lines').update({ image_url: '/images/distribution-flow.jpg' }).eq('id', alurDistId);
}

cleanAndInsert();
