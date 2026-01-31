import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixConsumerImages() {
    console.log('Fixing consumer goods images...');

    const { data: konsumsi } = await supabase
        .from('business_lines')
        .select('id')
        .eq('slug', 'produk-konsumen')
        .single();

    if (konsumsi) {
        console.log('Found Konsumsi, deleting old images and inserting new ones...');

        await supabase.from('business_images').delete().eq('business_line_id', konsumsi.id);

        const images = [
            'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=1932&auto=format&fit=crop', // Modern cosmetic products
            'https://images.unsplash.com/photo-1631729371254-42c2a89ddf0f?q=80&w=2080&auto=format&fit=crop', // Skincare bottles aesthetic
            'https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=987&auto=format&fit=crop', // Shelf display (soft)
            'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2080&auto=format&fit=crop', // Beauty products close up
            'https://images.unsplash.com/photo-1576426863848-c2185fc6e3c8?q=80&w=2080&auto=format&fit=crop'  // Warehouse/Distribution clean
        ];

        const { error } = await supabase.from('business_images').insert(
            images.map((url, i) => ({
                business_line_id: konsumsi.id,
                image_url: url,
                sort_order: i + 1
            }))
        );

        if (error) {
            console.error('Error updating Konsumsi images:', error);
        } else {
            console.log('Successfully updated Konsumsi images with verified URLs.');
        }
    } else {
        console.error('Could not find business line for consumer goods.');
    }
}

fixConsumerImages();
