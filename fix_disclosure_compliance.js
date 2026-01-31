
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDisclosureCompliance() {
    console.log('Starting Compliance Clean-up...');

    // 1. DELETE "Marketing" Press Releases
    const { data: deleted, error: delError } = await supabase
        .from('investor_documents')
        .delete()
        .ilike('title_id', '%penghargaan%') // Matches "Penta Valent Raih Penghargaan..."
        .eq('document_type', 'press_release')
        .select();

    if (delError) console.error('Delete error:', delError);
    else console.log('Deleted Marketing docs:', deleted);

    // 2. Re - Categorize existing docs
    // "Perubahan Susunan Direksi" -> management_change
    await supabase.from('investor_documents')
        .update({ document_type: 'management_change' })
        .ilike('title_id', '%Direksi%');

    // "Rencana Pemecahan Saham" -> corporate_action
    await supabase.from('investor_documents')
        .update({ document_type: 'corporate_action' })
        .ilike('title_id', '%Pemecahan Saham%');

    // "Pengumuman RUPS" -> bei_announcement
    await supabase.from('investor_documents')
        .update({ document_type: 'bei_announcement' })
        .ilike('title_id', '%Pengumuman%');

    // "Keterbukaan Informasi..." -> ojk_disclosure
    // Usually these start with "Keterbukaan Informasi" and aren't simple announcements
    await supabase.from('investor_documents')
        .update({ document_type: 'ojk_disclosure' })
        .ilike('title_id', 'Keterbukaan Informasi%');

    console.log('Categorization complete.');
}

fixDisclosureCompliance();
