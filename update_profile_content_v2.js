
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProfileContent() {
    console.log('Fetching company info...');

    // 1. Update Company Info
    const { data: info, error: fetchError } = await supabase
        .from('company_info')
        .select('*')
        .single();

    if (fetchError) {
        console.error('Error fetching info:', fetchError);
        return;
    }

    let newDescId = info.description_id;
    if (newDescId) {
        // Replace "perusahaan distributor ... terkemuka" with "salah satu perusahaan distributor ..."
        // We try to match reasonably
        newDescId = newDescId.replace(/perusahaan distributor produk farmasi, medis, dan kesehatan terkemuka/i, "salah satu perusahaan distributor produk farmasi, medis, dan kesehatan");

        // Fallback if not exact match, just prepend/adjust if needed logic, but here assume match or manual fix
        // If replace didn't happen (maybe slightly different text), we might force it if we knew the exact text.
        // Let's also check distinct string "55+ Tahun Berdampak" if it exists in description? No, user said it's on the card label.
    }

    const updates = {
        stats_years_label_id: 'Tahun Pengalaman Operasional',
        stats_years_label_en: 'Years of Operational Experience',
        description_id: newDescId
    };

    const { error: updateError } = await supabase
        .from('company_info')
        .update(updates)
        .eq('id', info.id);

    if (updateError) {
        console.error('Error updating company info:', updateError);
    } else {
        console.log('Successfully updated company info labels and description.');
    }

    // 2. Insert IPO Timeline
    const ipoEvent = {
        year: '2023',
        title_id: 'Pencatatan Saham Perdana (IPO)',
        title_en: 'Initial Public Offering (IPO)',
        description_id: 'Resmi melantai di Bursa Efek Indonesia sebagai perusahaan publik (PT Penta Valent Tbk).',
        description_en: 'Officially listed on the Indonesia Stock Exchange as a public company (PT Penta Valent Tbk).',
        sort_order: 2023, // Use year as sort order or high number
        is_active: true
    };

    // Check if already exists to avoid duplicate
    const { data: existing, error: checkError } = await supabase
        .from('company_timeline')
        .select('*')
        .eq('year', '2023');

    if (!existing || existing.length === 0) {
        const { error: insertError } = await supabase
            .from('company_timeline')
            .insert(ipoEvent);

        if (insertError) {
            console.error('Error inserting IPO event:', insertError);
        } else {
            console.log('Successfully inserted IPO timeline event.');
        }
    } else {
        console.log('IPO Timeline event already exists, skipping insert.');
    }
}

updateProfileContent();
