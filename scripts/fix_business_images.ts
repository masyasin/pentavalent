import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixBusinessImages() {
    console.log('Fixing broken business images...');

    // Update Barang Konsumsi (Consumer Goods)
    const { data: konsumsi } = await supabase
        .from('business_lines')
        .select('id')
        .eq('slug', 'produk-konsumen')
        .single();

    if (konsumsi) {
        console.log('Found Konsumsi, updating images with safer URLs...');
        // Clear existing images
        await supabase.from('business_images').delete().eq('business_line_id', konsumsi.id);

        const images = [
            'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=1200', // Cosmetics Model (Confirmed Working)
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200', // Lotion (Confirmed Working)
            'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=1200', // Soap/Toiletries (New)
            'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=1200', // Makeup Tools (New)
            'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=1200'  // Retail Shelves (New)
        ];

        const { error } = await supabase.from('business_images').insert(
            images.map((url, i) => ({
                business_line_id: konsumsi.id,
                image_url: url,
                sort_order: i + 1
            }))
        );

        if (error) console.error('Error updating Konsumsi images:', error);
        else console.log('Successfully updated Konsumsi images.');
    }
}

fixBusinessImages();
