
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndAddSlide() {
    const pagePath = '/about/legality-achievements';

    // Note: PageSlider uses cta_secondary_link to filter slides for the specific page.
    // This is a bit weird schema-wise but we follow the existing pattern.

    const { data: slides, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('cta_secondary_link', pagePath);

    if (error) {
        console.error('Error fetching slides:', error);
        return;
    }

    console.log(`Found ${slides.length} slides for path ${pagePath}`);

    if (slides.length === 0) {
        console.log('Adding default slide for Legality page...');
        const newSlide = {
            title_id: 'Legalitas & Kepatuhan',
            title_en: 'Legality & Compliance',
            subtitle_id: 'Fondasi kepercayaan dan kepatuhan dalam setiap langkah.',
            subtitle_en: 'Foundation of trust and compliance in every step.',
            image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000',
            sort_order: 5,
            is_active: true,
            cta_secondary_link: pagePath, // This acts as the page identifier for PageSlider
            // Fill required fields with dummies if needed
            cta_primary_text_id: 'Hubungi Kami',
            cta_primary_text_en: 'Contact Us',
            cta_primary_link: '/contact'
        };

        const { error: insertError } = await supabase.from('hero_slides').insert(newSlide);
        if (insertError) console.error('Error inserting slide:', insertError);
        else console.log('Successfully added slide.');
    }
}

checkAndAddSlide();
