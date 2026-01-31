
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateRupsTitles() {
    console.log('Updating RUPS titles...');

    const { data: docs, error } = await supabase
        .from('investor_documents')
        .select('*')
        .in('document_type', ['rups_report', 'rups_annual', 'rups_extraordinary', 'rups_materials']);

    if (error) return console.error(error);

    for (const doc of docs) {
        let newTitleId = doc.title_id;
        let newTitleEn = doc.title_en;
        let newType = doc.document_type;
        const lowerId = doc.title_id.toLowerCase();

        const year = doc.year;

        // Helper to detect type
        const isAnnual = lowerId.includes('tahunan') || lowerId.includes('rupst') || lowerId.includes('agms') || doc.document_type === 'rups_annual';
        const isExtra = lowerId.includes('luar biasa') || lowerId.includes('lb') || lowerId.includes('egms') || doc.document_type === 'rups_extraordinary';

        // Helper strings
        const suffixId = isAnnual ? `Tahunan ${year}` : (isExtra ? `Luar Biasa ${year}` : `${year}`);
        const suffixEn = isAnnual ? `Annual General Meeting of Shareholders ${year}` : (isExtra ? `Extraordinary General Meeting of Shareholders ${year}` : `General Meeting of Shareholders ${year}`);

        // Update Logic based on content keywords
        if (lowerId.includes('risalah') || lowerId.includes('summary of minutes') || lowerId.includes('minutes')) {
            newTitleId = `Risalah Rapat Umum Pemegang Saham ${suffixId}`;
            newTitleEn = `Minutes of ${suffixEn}`;
        } else if (lowerId.includes('materi') || lowerId.includes('materials')) {
            newTitleId = `Materi Rapat Umum Pemegang Saham ${suffixId}`;
            newTitleEn = `Materials for ${suffixEn}`;
        } else if (lowerId.includes('pemanggilan') || lowerId.includes('notice')) {
            newTitleId = `Pemanggilan Rapat Umum Pemegang Saham ${suffixId}`;
            newTitleEn = `Notice of ${suffixEn}`;
        } else if (lowerId.includes('keputusan') || lowerId.includes('resolutions')) {
            newTitleId = `Keputusan Rapat Umum Pemegang Saham ${suffixId}`;
            newTitleEn = `Resolutions of ${suffixEn}`;
        }

        // Standardize Year display (remove double years if any)
        // Regex to remove duplicate years at end if my logic added it to existing
        // Actually my logic replaces the whole string so it's fine.

        // Also normalize document_type for easier badge rendering
        if (isAnnual) newType = 'rups_annual';
        if (isExtra) newType = 'rups_extraordinary';

        if (newTitleId !== doc.title_id || newType !== doc.document_type) {
            console.log(`Update: ${doc.title_id} -> ${newTitleId}`);

            const { error: upErr } = await supabase
                .from('investor_documents')
                .update({
                    title_id: newTitleId,
                    title_en: newTitleEn,
                    document_type: newType
                })
                .eq('id', doc.id);

            if (upErr) console.error('Error update:', upErr);
        }
    }
    console.log('Done.');
}

updateRupsTitles();
