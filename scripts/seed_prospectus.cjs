
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyProspectus = [
    {
        title_id: 'Prospektus Awal Penawaran Umum Perdana Saham',
        title_en: 'Initial Public Offering Prospectus',
        document_type: 'initial_prospectus',
        year: 2022,
        published_at: '2022-09-15',
        file_url: '#'
    },
    {
        title_id: 'Prospektus Final Penawaran Umum Perdana Saham',
        title_en: 'Final IPO Prospectus',
        document_type: 'final_prospectus',
        year: 2022,
        published_at: '2022-10-20',
        file_url: '#'
    },
    {
        title_id: 'Pernyataan Efektif OJK',
        title_en: 'OJK Effective Statement',
        document_type: 'ojk_effective',
        year: 2022,
        published_at: '2022-10-25',
        file_url: '#'
    }
];

async function seedProspectus() {
    console.log('🔄 Seeding IPO Prospectus Documents...');

    const { error } = await supabase
        .from('investor_documents')
        .insert(dummyProspectus);

    if (error) {
        console.error('❌ Error seeding prospectus:', error);
    } else {
        console.log('✅ PROSPECTUS documents inserted successfully!');
    }
}

seedProspectus();
