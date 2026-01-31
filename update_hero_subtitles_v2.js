import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSubtitles() {
    // Update slides with title "Mendukung Rantai Distribusi Kesehatan Indonesia"
    const { error: e2 } = await supabase
        .from('hero_slides')
        .update({
            subtitle_id: 'Jaringan distribusi farmasi dan medis nasional terpercaya.',
            subtitle_en: 'Trusted national pharmaceutical and medical distribution network.'
        })
        .eq('title_id', 'Mendukung Rantai Distribusi Kesehatan Indonesia');

    if (e2) console.error('Error updating matching slides:', e2);

    console.log('Update completed.');
}

updateSubtitles();
