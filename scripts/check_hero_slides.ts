
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHeroSlides() {
    const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .not('cta_secondary_link', 'ilike', '/about%')
        .not('cta_secondary_link', 'ilike', '/investor%')
        .not('cta_secondary_link', 'ilike', '/business%')
        .not('cta_secondary_link', 'ilike', '/news%')
        .not('cta_secondary_link', 'ilike', '/career%')
        .not('cta_secondary_link', 'ilike', '/contact%')
        .not('cta_secondary_link', 'ilike', '/privacy-policy%')
        .not('cta_secondary_link', 'ilike', '/code-of-conduct%')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching hero slides:', error);
        return;
    }

    console.log(JSON.stringify(data.map(d => ({
        id: d.id,
        sort_order: d.sort_order,
        title_id: d.title_id,
        subtitle_id: d.subtitle_id,
        image_url: d.image_url,
        video_url: d.video_url,
        cta: d.cta_primary_text_id
    })), null, 2));
}

checkHeroSlides();
