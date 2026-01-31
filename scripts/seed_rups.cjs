
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyRUPS = [
    // 2024
    {
        title_id: 'Pemanggilan Rapat Umum Pemegang Saham Tahunan Tahun Buku 2023',
        title_en: 'Notice of Annual General Meeting of Shareholders FY 2023',
        document_type: 'rups_annual',
        year: 2024,
        published_at: '2024-05-10',
        file_url: '#'
    },
    {
        title_id: 'Materi Mata Acara Rapat RUPST 2024',
        title_en: 'Meeting Materials for AGMS 2024',
        document_type: 'rups_materials',
        year: 2024,
        published_at: '2024-05-15',
        file_url: '#'
    },
    {
        title_id: 'Risalah Rapat RUPST 2024',
        title_en: 'Summary of Minutes of AGMS 2024',
        document_type: 'rups_materials',
        year: 2024,
        published_at: '2024-06-15',
        file_url: '#'
    },

    // 2023 - Extraordinary
    {
        title_id: 'Pemanggilan Rapat Umum Pemegang Saham Luar Biasa',
        title_en: 'Notice of Extraordinary General Meeting of Shareholders',
        document_type: 'rups_extraordinary',
        year: 2023,
        published_at: '2023-11-01',
        file_url: '#'
    },
    {
        title_id: 'Keputusan RUPS-LB 2023',
        title_en: 'Resolutions of EGMS 2023',
        document_type: 'rups_materials',
        year: 2023,
        published_at: '2023-11-20',
        file_url: '#'
    },

    // 2023 - Annual
    {
        title_id: 'Pemanggilan RUPST Tahun Buku 2022',
        title_en: 'Notice of AGMS FY 2022',
        document_type: 'rups_annual',
        year: 2023,
        published_at: '2023-05-12',
        file_url: '#'
    }
];

async function seedRUPS() {
    console.log('🔄 Seeding RUPS (GMS) Documents...');

    const { error } = await supabase
        .from('investor_documents')
        .insert(dummyRUPS);

    if (error) {
        console.error('❌ Error seeding RUPS:', error);
    } else {
        console.log('✅ RUPS documents inserted successfully!');
    }
}

seedRUPS();
