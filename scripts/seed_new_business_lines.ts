import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedBusinessLines() {
    const lines = [
        {
            title_id: 'Alur Distribusi',
            title_en: 'Distribution Flow',
            description_id: 'Sistem manajemen rantai pasok terintegrasi yang memastikan produk kesehatan sampai ke tangan yang tepat pada waktu yang tepat.',
            description_en: 'Integrated supply chain management system that ensures healthcare products reach the right hands at the right time.',
            slug: 'alur-distribusi',
            image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000'
        },
        {
            title_id: 'Target Pasar',
            title_en: 'Target Market',
            description_id: 'Penyebaran jaringan luas yang mencakup rumah sakit, apotek, toko obat, dan retail di seluruh pelosok Indonesia.',
            description_en: 'Extensive network coverage including hospitals, pharmacies, drugstores, and retail outlets throughout Indonesia.',
            slug: 'target-market',
            image_url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=2000'
        }
    ];

    for (const line of lines) {
        const { data: existing } = await supabase.from('business_lines').select('id').eq('slug', line.slug).maybeSingle();
        if (!existing) {
            await supabase.from('business_lines').insert(line);
            console.log(`Inserted ${line.slug}`);
        } else {
            console.log(`${line.slug} already exists`);
        }
    }
}

seedBusinessLines();
