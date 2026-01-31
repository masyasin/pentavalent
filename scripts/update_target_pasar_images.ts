import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTargetPasarImages() {
    console.log('Updating Target Pasar Gallery Images...');

    const { data: line } = await supabase
        .from('business_lines')
        .select('id')
        .or('slug.eq.target-pasar,slug.eq.target-market')
        .single();

    if (!line) return;

    const businessId = line.id;

    const galleryImages = [
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1550581190-95123545b630?auto=format&fit=crop&q=80&w=1000', sort_order: 1 }, // Pharmacy/Modern
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000', sort_order: 2 }, // Supermarket
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1000', sort_order: 3 }  // Retail
    ];

    await supabase.from('business_images').delete().eq('business_line_id', businessId);
    await supabase.from('business_images').insert(galleryImages);

    console.log('Gallery images updated.');
}

updateTargetPasarImages();
