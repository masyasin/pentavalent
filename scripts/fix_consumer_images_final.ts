import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixConsumerImagesFinal() {
    console.log('Final fix for consumer goods images...');

    const { data: konsumsi } = await supabase
        .from('business_lines')
        .select('id')
        .eq('slug', 'produk-konsumen')
        .single();

    if (konsumsi) {
        console.log('Found Konsumsi, replacing images with vetted high-availability URLs...');

        await supabase.from('business_images').delete().eq('business_line_id', konsumsi.id);

        const images = [
            // 1. Cosmetics / Beauty Products (Reliable ID)
            'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=1200',

            // 2. Retail / Supermarket Shelf (Reliable ID)
            'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1200',

            // 3. Skincare / Personal Care (Reliable ID)
            'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1200',

            // 4. Warehouse / Distribution (Reliable ID)
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',

            // 5. Shopping / Retail Context (Reliable ID)
            'https://images.unsplash.com/photo-1580913428706-c311ab527ebc?auto=format&fit=crop&q=80&w=1200'
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
            console.log('Successfully updated Konsumsi images with final set.');
        }
    } else {
        console.error('Could not find business line for consumer goods.');
    }
}

fixConsumerImagesFinal();
