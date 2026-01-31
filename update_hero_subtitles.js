import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSubtitles() {
    // Update Slide 1
    const { error: e1 } = await supabase
        .from('hero_slides')
        .update({
            subtitle_id: 'Distribusi nasional terintegrasi dengan standar kepatuhan regulasi kesehatan tertinggi.',
            subtitle_en: 'National integrated distribution with the highest health regulatory compliance standards.'
        })
        .eq('id', '601be1e6-b085-49a4-9e5a-b8f0bd5f15cb');

    if (e1) console.error('Error updating Slide 1:', e1);

    // Update slides with specific title
    const { error: e2 } = await supabase
        .from('hero_slides')
        .update({
            subtitle_id: 'Sistem distribusi farmasi dan medis yang terstandar, aman, dan terpercaya.',
            subtitle_en: 'Standardized, secure, and trusted pharmaceutical and medical distribution.'
        })
        .eq('title_id', 'Mendukung Rantai Distribusi Kesehatan Indonesia');

    if (e2) console.error('Error updating matching slides:', e2);

    console.log('Update completed.');
}

updateSubtitles();
