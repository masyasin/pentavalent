import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedCategoryImages() {
    console.log('Seeding Targeted Images into Database...');

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

    const images = [
        // Farmasi (100-199) - Hospitals, Pharmacies, Labs
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200', sort_order: 101 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1532187863486-abf91ad9b0c0?auto=format&fit=crop&q=80&w=1200', sort_order: 102 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1200', sort_order: 103 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=1200', sort_order: 104 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1579152433976-067a69daed8a?auto=format&fit=crop&q=80&w=1200', sort_order: 105 },

        // Modern Trade (200-299) - Specialized health stores, beauty retail
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200', sort_order: 201 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200', sort_order: 202 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1580234811497-9bd7fd0f56ee?auto=format&fit=crop&q=80&w=1200', sort_order: 203 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200', sort_order: 204 },

        // Modern Market (300-399) - Supermarkets, Minimarkets
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200', sort_order: 301 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1516594798245-443f1f738723?auto=format&fit=crop&q=80&w=1200', sort_order: 302 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=1200', sort_order: 303 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1200', sort_order: 304 },

        // Kios Kosmetik (400-499) - Cosmetic wholesalers, beauty salons
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200', sort_order: 401 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=1200', sort_order: 402 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200', sort_order: 403 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1200', sort_order: 404 },

        // Pasar Tradisional (500-599) - Traditional drugstores, herbal stores
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1590244944866-44b50043522c?auto=format&fit=crop&q=80&w=1200', sort_order: 501 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=1200', sort_order: 502 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200', sort_order: 503 },
        { business_line_id: businessId, image_url: 'https://images.unsplash.com/photo-1563821037081-30206888497a?auto=format&fit=crop&q=80&w=1200', sort_order: 504 }
    ];

    // Clean existing dummy range
    await supabase.from('business_images')
        .delete()
        .eq('business_line_id', businessId)
        .gte('sort_order', 100);

    const { error } = await supabase.from('business_images').insert(images);

    if (error) console.error('Error:', error);
    else console.log('Successfully seeded category-specific images into database.');
}

seedCategoryImages();
