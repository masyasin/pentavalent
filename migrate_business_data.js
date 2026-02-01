
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Starting migration for business data...');

    // 1. Update existing business line
    const { data: line, error: fetchError } = await supabase
        .from('business_lines')
        .select('id')
        .eq('slug', 'distribusi-alkes')
        .single();

    if (fetchError) {
        console.error('Error fetching business line:', fetchError);
        return;
    }
    const bizId = line.id;

    const { error: updateError } = await supabase
        .from('business_lines')
        .update({
            title_id: 'Alat Kesehatan & Produk Medis',
            title_en: 'Medical Equipment & Medical Products',
            description_id: 'Lini bisnis Alat Kesehatan & Produk Medis kami menyediakan produk kesehatan berkualitas mulai dari peralatan medis rumah sakit hingga produk perawatan kesehatan mandiri, menjamin ketersediaan alat medis yang esensial di seluruh pelosok Indonesia.',
            description_en: 'Our Medical Equipment & Medical Products business line provides quality health products ranging from hospital medical equipment to self-healthcare products, ensuring the availability of essential medical devices throughout Indonesia.'
        })
        .eq('id', bizId);

    if (updateError) {
        console.error('Error updating business line:', updateError);
        return;
    }
    console.log('Updated business line labels.');

    // 2. Clear existing related data to avoid duplicates
    await supabase.from('business_features').delete().eq('business_line_id', bizId);
    await supabase.from('business_stats').delete().eq('business_line_id', bizId);
    await supabase.from('business_images').delete().eq('business_line_id', bizId);
    console.log('Cleared existing related data.');

    // 3. Insert Features
    await supabase.from('business_features').insert([
        { business_line_id: bizId, feature_id: 'Alat Kesehatan Rumah Sakit', feature_en: 'Hospital Medical Devices', sort_order: 1 },
        { business_line_id: bizId, feature_id: 'Reagensia & Laboratorium', feature_en: 'Reagents & Lab Supplies', sort_order: 2 },
        { business_line_id: bizId, feature_id: 'Alat Monitoring Pasien', feature_en: 'Patient Monitoring Equipment', sort_order: 3 },
        { business_line_id: bizId, feature_id: 'Produk Diagnostik Cepat', feature_en: 'Rapid Diagnostic Products', sort_order: 4 },
        { business_line_id: bizId, feature_id: 'Consumables Medis', feature_en: 'Medical Consumables', sort_order: 5 }
    ]);
    console.log('Inserted features.');

    // 4. Insert Stats
    await supabase.from('business_stats').insert([
        { business_line_id: bizId, label_id: 'Produk Tersertifikasi', label_en: 'Certified Products', value_id: '500+', value_en: '500+', sort_order: 1 },
        { business_line_id: bizId, label_id: 'Fasilitas Kesehatan Rakyat', label_en: 'Health Facilities', value_id: '1.500+', value_en: '1,500+', sort_order: 2 },
        { business_line_id: bizId, label_id: 'Kemitraan Global', label_en: 'Global Partnerships', value_id: '20+', value_en: '20+', sort_order: 3 }
    ]);
    console.log('Inserted stats.');

    // 5. Insert Images (Dummy)
    await supabase.from('business_images').insert([
        { business_line_id: bizId, image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200', sort_order: 1 },
        { business_line_id: bizId, image_url: 'https://images.unsplash.com/photo-1581093458791-9f3c3250bb8b?auto=format&fit=crop&q=80&w=1200', sort_order: 2 },
        { business_line_id: bizId, image_url: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=1200', sort_order: 3 }
    ]);
    console.log('Inserted images.');

    console.log('Business data migration completed successfully!');
}

run();
