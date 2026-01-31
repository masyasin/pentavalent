import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateBusinessContent() {
    console.log('Updating business lines content based on user image...');

    // 1. Update Farmasi (Pharmaceuticals)
    const { data: farmasi } = await supabase
        .from('business_lines')
        .select('id')
        .eq('slug', 'distribusi-farmasi')
        .single();

    if (farmasi) {
        console.log('Found Farmasi, updating features...');
        // Clear existing features
        await supabase.from('business_features').delete().eq('business_line_id', farmasi.id); // This might fail if RLS prevents delete, assuming service role or permissive RLS from setup

        const features = [
            { business_line_id: farmasi.id, feature_id: 'Ethical (Produk Resep)', feature_en: 'Ethical (Prescription Products)', sort_order: 1 },
            { business_line_id: farmasi.id, feature_id: 'OTC (Over The Counter)', feature_en: 'OTC (Over The Counter)', sort_order: 2 },
            { business_line_id: farmasi.id, feature_id: 'Alat Kesehatan', feature_en: 'Medical Equipment', sort_order: 3 },
            { business_line_id: farmasi.id, feature_id: 'Reagensia', feature_en: 'Reagents', sort_order: 4 },
            { business_line_id: farmasi.id, feature_id: 'Food Supplement', feature_en: 'Food Supplement', sort_order: 5 }
        ];

        const { error } = await supabase.from('business_features').insert(features);
        if (error) console.error('Error updating Farmasi features:', error);
        else console.log('Successfully updated Farmasi features.');
    } else {
        console.error('Farmasi business line not found. Run seed_complete_v10.js first.');
    }

    // 2. Update Barang Konsumsi (Consumer Goods)
    const { data: konsumsi } = await supabase
        .from('business_lines')
        .select('id')
        .eq('slug', 'produk-konsumen') // Slug from seed_complete_v10.js
        .single();

    if (konsumsi) {
        console.log('Found Konsumsi, updating features...');
        // Clear existing features
        await supabase.from('business_features').delete().eq('business_line_id', konsumsi.id);

        const features = [
            { business_line_id: konsumsi.id, feature_id: 'Kosmetik', feature_en: 'Cosmetics', sort_order: 1 },
            { business_line_id: konsumsi.id, feature_id: 'Personal Care', feature_en: 'Personal Care', sort_order: 2 },
            { business_line_id: konsumsi.id, feature_id: 'Toiletries', feature_en: 'Toiletries', sort_order: 3 }
        ];

        const { error } = await supabase.from('business_features').insert(features);
        if (error) console.error('Error updating Konsumsi features:', error);
        else console.log('Successfully updated Konsumsi features.');
    } else {
        console.error('Konsumsi business line not found.');
    }
}

updateBusinessContent();
