
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyReports = [
    // --- LAPORAN KEUANGAN ---
    {
        title_id: 'Laporan Keuangan Q1 2024',
        title_en: 'financial_report Q1 2024',
        document_type: 'financial_report',
        year: 2024,
        quarter: 'Q1',
        published_at: '2024-04-15',
        file_url: '#',
        is_active: true
    },
    {
        title_id: 'Laporan Audit 2024 (Interim)',
        title_en: 'Audit Report 2024 (Interim)',
        document_type: 'audit_report',
        year: 2024,
        published_at: '2024-06-20',
        file_url: '#',
        is_active: true
    },
    {
        title_id: 'Laporan Tahunan 2023',
        title_en: 'Annual Report 2023',
        document_type: 'annual_report',
        year: 2023,
        published_at: '2024-03-30',
        file_url: '#',
        is_active: true
    },
    {
        title_id: 'Laporan Keberlanjutan 2023',
        title_en: 'Sustainability Report 2023',
        document_type: 'sustainability_report',
        year: 2023,
        published_at: '2024-04-10',
        file_url: '#',
        is_active: true
    },

    // --- KETERBUKAAN INFORMASI ---
    // Types: 'corporate_action', 'bei_announcement', 'press_release' (mapping to public_disclosure in logical group, but specific types in DB)

    // NOTE: In the frontend, 'public_disclosure' is the document_type filter for the page.
    // However, to support sub-filters (Aksi Korporasi, dll), we need to store them as specific types 
    // OR have a 'category' column.
    // Based on previous code, we only filter by `document_type`.
    // So for Keterbukaan Informasi page, we normally filter `doc.document_type === 'public_disclosure'`.
    // IF we want sub-filters, we must change the frontend logic to accept multiple types OR add a subtype.

    // STRATEGY: Use specific types in DB, and update Frontend to INCLUDE these types when on 'keterbukaan-informasi' page.

    {
        title_id: 'Rencana Pemecahan Saham (Stock Split)',
        title_en: 'Plan for Stock Split',
        document_type: 'corporate_action',
        year: 2024,
        published_at: '2024-05-15',
        file_url: '#',
        is_active: true
    },
    {
        title_id: 'Pengumuman RUPS Luar Biasa',
        title_en: 'Announcement of Extraordinary GMS',
        document_type: 'bei_announcement',
        year: 2024,
        published_at: '2024-01-10',
        file_url: '#',
        is_active: true
    },
    {
        title_id: 'Penta Valent Raih Penghargaan Distributor Terbaik',
        title_en: 'Penta Valent Wins Best Distributor Award',
        document_type: 'press_release',
        year: 2024,
        published_at: '2024-08-20',
        file_url: '#',
        is_active: true
    },
    {
        title_id: 'Perubahan Susunan Direksi',
        title_en: 'Change in Board of Directors',
        document_type: 'corporate_action',
        year: 2023,
        published_at: '2023-11-05',
        file_url: '#',
        is_active: true
    }
];

async function seedReports() {
    console.log('🔄 Seeding Dummy Reports (Financial & Disclosure)...');

    // Clean up existing to avoid dupes/mess if re-running
    // (Optional, or just insert)

    const { error } = await supabase
        .from('investor_documents')
        .insert(dummyReports);

    if (error) {
        console.error('❌ Error seeding reports:', error);
    } else {
        console.log('✅ Dummy reports inserted successfully!');
    }
}

seedReports();
