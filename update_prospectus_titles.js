
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProspectusTitles() {
    console.log('Updating Prospectus titles...');

    // 1. Fetch all prospectus documents
    const { data: docs, error } = await supabase
        .from('investor_documents')
        .select('*')
        .in('document_type', ['prospectus', 'initial_prospectus', 'final_prospectus', 'ojk_effective']);

    if (error) {
        console.error('Error fetching docs:', error);
        return;
    }

    // 2. Define standard mapping based on type or existing content
    // We will try to map existing loosely named docs to the formal ones
    for (const doc of docs) {
        let newTitleId = doc.title_id;
        let newTitleEn = doc.title_en;
        let newType = doc.document_type; // we might also standardize types if needed

        // Logic to standardize
        const lowerTitle = doc.title_id.toLowerCase();

        if (lowerTitle.includes('final') || doc.document_type === 'final_prospectus') {
            newTitleId = `Prospektus Final Penawaran Umum Perdana Saham (${doc.year})`;
            newTitleEn = `Final Prospectus for Initial Public Offering (${doc.year})`;
            newType = 'final_prospectus';
        } else if (lowerTitle.includes('awal') || lowerTitle.includes('initial') || doc.document_type === 'initial_prospectus') {
            newTitleId = `Prospektus Awal Penawaran Umum Perdana Saham (${doc.year})`;
            newTitleEn = `Preliminary Prospectus for Initial Public Offering (${doc.year})`;
            newType = 'initial_prospectus';
        } else if (lowerTitle.includes('ojk') || lowerTitle.includes('efektif') || doc.document_type === 'ojk_effective') {
            newTitleId = `Pernyataan Efektif OJK (${doc.year})`;
            newTitleEn = `OJK Effective Statement (${doc.year})`;
            newType = 'ojk_effective';
        } else if (lowerTitle.includes('ipo') || doc.document_type === 'prospectus') {
            // General IPO Prospectus
            newTitleId = `Prospektus Penawaran Umum Perdana Saham (${doc.year})`;
            newTitleEn = `Prospectus for Initial Public Offering (${doc.year})`;
            newType = 'prospectus';
        }

        // Update if changed
        if (newTitleId !== doc.title_id || newType !== doc.document_type) {
            console.log(`Updating ${doc.title_id} -> ${newTitleId}`);
            const { error: updateError } = await supabase
                .from('investor_documents')
                .update({
                    title_id: newTitleId,
                    title_en: newTitleEn,
                    document_type: newType
                })
                .eq('id', doc.id);

            if (updateError) console.error(`Failed to update ${doc.id}:`, updateError);
        }
    }
    console.log('Done updating titles.');
}

updateProspectusTitles();
