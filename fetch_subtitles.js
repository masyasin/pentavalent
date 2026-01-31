import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubtitles() {
    const { data, error } = await supabase
        .from('hero_slides')
        .select('id, title_id, subtitle_id, subtitle_en')
        .eq('is_active', true);

    if (error) {
        console.error(error);
        return;
    }
    data.forEach(slide => {
        console.log(`ID: ${slide.id}`);
        console.log(`Title ID: ${slide.title_id}`);
        console.log(`Subtitle ID: ${slide.subtitle_id}`);
        console.log(`Subtitle EN: ${slide.subtitle_en}`);
        console.log('---');
    });
}

checkSubtitles();
