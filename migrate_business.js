
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Starting migration...');

    // 1. Shift current nav_menus
    const { data: currentMenus, error: menuFetchError } = await supabase
        .from('nav_menus')
        .select('id, sort_order')
        .eq('parent_id', 'b71e0038-9126-48d1-a106-1edd30ef149d')
        .gte('sort_order', 2);

    if (menuFetchError) {
        console.error('Error fetching menus:', menuFetchError);
        return;
    }

    for (const menu of currentMenus) {
        await supabase
            .from('nav_menus')
            .update({ sort_order: menu.sort_order + 1 })
            .eq('id', menu.id);
    }
    console.log('Shifted existing menus.');

    // 2. Insert new sub-menu
    const { data: newMenu, error: menuInsertError } = await supabase
        .from('nav_menus')
        .insert([
            {
                label_id: 'Alat Kesehatan & Produk Medis',
                label_en: 'Medical Equipment & Medical Products',
                path: '/business/medical-equipment',
                parent_id: 'b71e0038-9126-48d1-a106-1edd30ef149d',
                sort_order: 2,
                is_active: true,
                location: 'header'
            }
        ])
        .select();

    if (menuInsertError) {
        console.error('Error inserting menu:', menuInsertError);
        return;
    }
    console.log('Inserted new menu:', newMenu[0].id);

    // 3. Insert into business_lines
    const { data: newBusiness, error: bizInsertError } = await supabase
        .from('business_lines')
        .insert([
            {
                slug: 'distribusi-alkes',
                title_id: 'Alat Kesehatan & Produk Medis',
                title_en: 'Medical Equipment & Medical Products',
                description_id: 'Lini bisnis Alat Kesehatan & Produk Medis kami menyediakan produk kesehatan berkualitas mulai dari peralatan medis rumah sakit hingga produk perawatan kesehatan mandiri, menjamin ketersediaan alat medis yang esensial di seluruh pelosok Indonesia.',
                description_en: 'Our Medical Equipment & Medical Products business line provides quality health products ranging from hospital medical equipment to self-healthcare products, ensuring the availability of essential medical devices throughout Indonesia.'
            }
        ])
        .select();

    if (bizInsertError) {
        console.error('Error inserting business line:', bizInsertError);
        return;
    }
    const bizId = newBusiness[0].id;
    console.log('Inserted new business line:', bizId);

    // 4. Insert Features
    await supabase.from('business_features').insert([
        { business_line_id: bizId, feature_id: 'Alat Kesehatan', feature_en: 'Medical Devices', sort_order: 1 },
        { business_line_id: bizId, feature_id: 'Reagensia', feature_en: 'Reagents', sort_order: 2 },
        { business_line_id: bizId, feature_id: 'Perlengkapan Medis', feature_en: 'Medical Supplies', sort_order: 3 },
        { business_line_id: bizId, feature_id: 'Produk Diagnostik', feature_en: 'Diagnostic Products', sort_order: 4 },
        { business_line_id: bizId, feature_id: 'Peralatan Rumah Sakit', feature_en: 'Hospital Equipment', sort_order: 5 }
    ]);
    console.log('Inserted features.');

    // 5. Insert Stats
    await supabase.from('business_stats').insert([
        { business_line_id: bizId, label_id: 'Kategori Produk', label_en: 'Product Categories', value_id: '450+', value_en: '450+', sort_order: 1 },
        { business_line_id: bizId, label_id: 'RS & Klinik', label_en: 'Hospitals & Clinics', value_id: '1.200+', value_en: '1,200+', sort_order: 2 },
        { business_line_id: bizId, label_id: 'Prinsipal Global', label_en: 'Global Principals', value_id: '15+', value_en: '15+', sort_order: 3 }
    ]);
    console.log('Inserted stats.');

    // 6. Insert Images (Dummy)
    await supabase.from('business_images').insert([
        { business_line_id: bizId, image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200', sort_order: 1 },
        { business_line_id: bizId, image_url: 'https://images.unsplash.com/photo-1581093458791-9f3c3250bb8b?auto=format&fit=crop&q=80&w=1200', sort_order: 2 },
        { business_line_id: bizId, image_url: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=1200', sort_order: 3 }
    ]);
    console.log('Inserted images.');

    console.log('Migration completed successfully!');
}

run();
