
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function refineProfile() {
    // Update Timeline 2023 to be more formal
    const { error: updateTimelineError } = await supabase
        .from('company_timeline')
        .update({
            title_id: 'Pencatatan Saham Perdana (IPO)',
            title_en: 'Initial Public Offering (IPO)',
            description_id: 'Resmi menjadi perusahaan publik (Tbk) dan tercatat di Bursa Efek Indonesia.',
            description_en: 'Officially became a public company (Tbk) and listed on the Indonesia Stock Exchange.'
        })
        .eq('year', '2023');

    if (updateTimelineError) console.error(updateTimelineError);
    else console.log('Updated Timeline 2023 title/desc.');
}

refineProfile();
