
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Inserting banners for Medical Equipment...');

    const banners = [
        {
            page_path: '/business/medical-equipment',
            title_id: 'Solusi Alat Kesehatan Terpadu',
            title_en: 'Integrated Medical Equipment Solutions',
            subtitle_id: 'Menyediakan peralatan medis canggih untuk fasilitas kesehatan modern.',
            subtitle_en: 'Providing advanced medical equipment for modern healthcare facilities.',
            image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=2000',
            sort_order: 1,
            is_active: true
        },
        {
            page_path: '/business/medical-equipment',
            title_id: 'Standar Kualitas Global',
            title_en: 'Global Quality Standards',
            subtitle_id: 'Produk kesehatan yang tersertifikasi dan aman bagi masyarakat Indonesia.',
            subtitle_en: 'Certified and safe health products for the Indonesian people.',
            image_url: 'https://images.unsplash.com/photo-1581053141640-d958210175a2?auto=format&fit=crop&q=80&w=2000',
            sort_order: 2,
            is_active: true
        }
    ];

    const { data, error } = await supabase
        .from('page_banners')
        .insert(banners);

    if (error) {
        console.error('Error inserting banners:', error);
    } else {
        console.log('Banners inserted successfully!');
    }
}

run();
