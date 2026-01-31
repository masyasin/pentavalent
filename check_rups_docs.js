
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRupsDocs() {
    const { data: docs, error } = await supabase
        .from('investor_documents')
        .select('id, title_id, title_en, document_type, year')
        .in('document_type', ['rups_report', 'rups_annual', 'rups_extraordinary', 'rups_materials']);

    if (error) {
        console.error(error);
        return;
    }
    console.log('Current RUPS Docs:', JSON.stringify(docs, null, 2));
}

checkRupsDocs();
