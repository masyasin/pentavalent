import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedBusinessDetails() {
    console.log('Seeding detailed content for new business sub-menus...');

    // Find IDs first
    const { data: businessLines } = await supabase.from('business_lines').select('id, slug');
    const alurDistId = businessLines?.find(b => b.slug === 'alur-distribusi')?.id;
    const targetPasarId = businessLines?.find(b => b.slug === 'target-pasar')?.id;

    if (!alurDistId || !targetPasarId) {
        console.error('Could not find business line IDs');
        return;
    }

    // --- Alur Distribusi Details ---
    const alurStats = [
        { business_line_id: alurDistId, label_id: 'Cabang Nasional', label_en: 'National Branches', value_id: '34', value_en: '34', sort_order: 1 },
        { business_line_id: alurDistId, label_id: 'Tracking Real-time', label_en: 'Real-time Tracking', value_id: '100%', value_en: '100%', sort_order: 2 },
        { business_line_id: alurDistId, label_id: 'Kapasitas Gudang', label_en: 'Warehouse Capacity', value_id: '50.000+ m2', value_en: '50,000+ sqm', sort_order: 3 }
    ];

    const alurFeatures = [
        { business_line_id: alurDistId, feature_id: 'Sertifikasi CDOB (GDP) Penuh', feature_en: 'Full GSDP Certification', sort_order: 1 },
        { business_line_id: alurDistId, feature_id: 'Manajemen Rantai Dingin (Cold Chain)', feature_en: 'Cold Chain Management', sort_order: 2 },
        { business_line_id: alurDistId, feature_id: 'Pengiriman Last-Mile Efisien', feature_en: 'Efficient Last-Mile Delivery', sort_order: 3 },
        { business_line_id: alurDistId, feature_id: 'Sistem ERP Terintegrasi', feature_en: 'Integrated ERP System', sort_order: 4 }
    ];

    // --- Target Pasar Details ---
    const targetStats = [
        { business_line_id: targetPasarId, label_id: 'Apotek Terdaftar', label_en: 'Registered Pharmacies', value_id: '21.000+', value_en: '21,000+', sort_order: 1 },
        { business_line_id: targetPasarId, label_id: 'Rumah Sakit & Klinik', label_en: 'Hospitals & Clinics', value_id: '5.000+', value_en: '5,000+', sort_order: 2 },
        { business_line_id: targetPasarId, label_id: 'Outlet Produk Konsumen', label_en: 'Consumer Outlets', value_id: '14.000+', value_en: '14,000+', sort_order: 3 }
    ];

    const targetFeatures = [
        { business_line_id: targetPasarId, feature_id: 'Cakupan Nasional 34 Provinsi', feature_en: '34 Provinces Nationwide Coverage', sort_order: 1 },
        { business_line_id: targetPasarId, feature_id: 'Layanan Key Account Khusus', feature_en: 'Dedicated Key Account Services', sort_order: 2 },
        { business_line_id: targetPasarId, feature_id: 'Analisis Intelijen Pasar', feature_en: 'Market Intelligence Analytics', sort_order: 3 },
        { business_line_id: targetPasarId, feature_id: 'Jaringan Distribusi Multi-Channel', feature_en: 'Multi-Channel Distribution Network', sort_order: 4 }
    ];

    console.log('Inserting stats and features...');
    await supabase.from('business_stats').delete().in('business_line_id', [alurDistId, targetPasarId]);
    await supabase.from('business_features').delete().in('business_line_id', [alurDistId, targetPasarId]);

    await supabase.from('business_stats').insert([...alurStats, ...targetStats]);
    await supabase.from('business_features').insert([...alurFeatures, ...targetFeatures]);

    console.log('Seeding images...');
    await supabase.from('business_images').delete().in('business_line_id', [alurDistId, targetPasarId]);

    const images = [
        { business_line_id: alurDistId, image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000', sort_order: 1 },
        { business_line_id: alurDistId, image_url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1000', sort_order: 2 },
        { business_line_id: targetPasarId, image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000', sort_order: 1 },
        { business_line_id: targetPasarId, image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=1000', sort_order: 2 }
    ];
    await supabase.from('business_images').insert(images);

    console.log('Done!');
}

seedBusinessDetails();
