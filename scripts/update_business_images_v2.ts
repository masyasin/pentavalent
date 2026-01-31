import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateBusinessImages() {
    console.log('Updating business images to be more relevant...');

    // 1. Update Farmasi (Pharmaceuticals)
    const { data: farmasi } = await supabase
        .from('business_lines')
        .select('id')
        .eq('slug', 'distribusi-farmasi')
        .single();

    if (farmasi) {
        console.log('Found Farmasi, updating images...');
        // Clear existing images
        await supabase.from('business_images').delete().eq('business_line_id', farmasi.id);

        const images = [
            'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1200', // Pharmacy shelves / Ethical
            'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=1200', // Pills / OTC
            'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=1200', // Lab / Reagents
            'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200', // Medical Equipment context
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200'  // Warehouse
        ];

        const { error } = await supabase.from('business_images').insert(
            images.map((url, i) => ({
                business_line_id: farmasi.id,
                image_url: url,
                sort_order: i + 1
            }))
        );

        if (error) console.error('Error updating Farmasi images:', error);
        else console.log('Successfully updated Farmasi images.');
    }

    // 2. Update Barang Konsumsi (Consumer Goods)
    const { data: konsumsi } = await supabase
        .from('business_lines')
        .select('id')
        .eq('slug', 'produk-konsumen')
        .single();

    if (konsumsi) {
        console.log('Found Konsumsi, updating images...');
        // Clear existing images
        await supabase.from('business_images').delete().eq('business_line_id', konsumsi.id);

        const images = [
            'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=1200', // Cosmetics / Beauty
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200', // Bottles / Personal Care
            'https://images.unsplash.com/photo-1556228720-1987515b227c?auto=format&fit=crop&q=80&w=1200', // Toiletries / Bathroom context
            'https://images.unsplash.com/photo-1522335789203-abd6538d8ad3?auto=format&fit=crop&q=80&w=1200', // Makeup / Cosmetics high end
            'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=1200'  // Retail shelf
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

updateBusinessImages();
