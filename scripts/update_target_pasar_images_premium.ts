import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTargetPasarImages() {
    console.log('Updating Target Pasar Gallery Images with Premium Dummies...');

    const { data: line } = await supabase
        .from('business_lines')
        .select('id')
        .or('slug.eq.target-pasar,slug.eq.target-market')
        .single();

    if (!line) {
        console.error('Target Pasar line not found.');
        return;
    }

    const businessId = line.id;

    const galleryImages = [
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=1200', sort_order: 1 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200', sort_order: 2 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1200', sort_order: 3 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1522335714441-df013a122607?auto=format&fit=crop&q=80&w=1200', sort_order: 4 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1590244944866-44b50043522c?auto=format&fit=crop&q=80&w=1200', sort_order: 5 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1586528116311-ad863c17d15f?auto=format&fit=crop&q=80&w=1200', sort_order: 6 }
    ];

    await supabase.from('business_images').delete().eq('business_line_id', businessId);
    const { error } = await supabase.from('business_images').insert(galleryImages);

    if (error) {
        console.error('Error inserting images:', error);
    } else {
        console.log('Premium Gallery images for Target Pasar updated successfully.');
    }
}

updateTargetPasarImages();
