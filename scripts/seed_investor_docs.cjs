
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedInvestorDocuments() {
    console.log('🚀 Seeding Investor Documents...');

    const documents = [
        {
            title_id: 'Laporan Keuangan Tahunan 2024 (Audited)',
            title_en: 'Annual Financial Report 2024 (Audited)',
            document_type: 'financial_report',
            year: 2024,
            quarter: 'FY',
            file_url: 'https://bkjfepimzoubwthqldiq.supabase.co/storage/v1/object/public/documents/annual_report_2024.pdf',
            is_published: true
        },
        {
            title_id: 'Laporan Keuangan Q3 2024',
            title_en: 'Quarterly Financial Report Q3 2024',
            document_type: 'financial_report',
            year: 2024,
            quarter: 'Q3',
            file_url: 'https://bkjfepimzoubwthqldiq.supabase.co/storage/v1/object/public/documents/q3_report_2024.pdf',
            is_published: true
        },
        {
            title_id: 'Prospektus Penawaran Umum Perdana Saham',
            title_en: 'Initial Public Offering Prospectus',
            document_type: 'prospectus',
            year: 2023,
            quarter: 'IPO',
            file_url: 'https://bkjfepimzoubwthqldiq.supabase.co/storage/v1/object/public/documents/prospectus.pdf',
            is_published: true
        },
        {
            title_id: 'Keterbukaan Informasi - Perolehan Kontrak Distribusi Nasional',
            title_en: 'Public Disclosure - Acquisition of National Distribution Contract',
            document_type: 'public_disclosure',
            year: 2024,
            quarter: null,
            file_url: 'https://bkjfepimzoubwthqldiq.supabase.co/storage/v1/object/public/documents/disclosure_2024_01.pdf',
            is_published: true
        },
        {
            title_id: 'Risalah Rapat Umum Pemegang Saham Tahunan 2024',
            title_en: 'Minutes of Annual General Meeting of Shareholders 2024',
            document_type: 'rups_report',
            year: 2024,
            quarter: 'AGMS',
            file_url: 'https://bkjfepimzoubwthqldiq.supabase.co/storage/v1/object/public/documents/rups_2024.pdf',
            is_published: true
        },
        {
            title_id: 'Tata Kelola Perusahaan Baik (GCG) 2024',
            title_en: 'Good Corporate Governance (GCG) 2024',
            document_type: 'gcg',
            year: 2024,
            quarter: null,
            file_url: 'https://bkjfepimzoubwthqldiq.supabase.co/storage/v1/object/public/documents/gcg_2024.pdf',
            is_published: true
        }
    ];

    const { data, error } = await supabase.from('investor_documents').insert(documents).select();

    if (error) {
        console.error('❌ Error seeding documents:', error);
    } else {
        console.log('✅ Successfully seeded investor documents:', data.length);
    }
}

seedInvestorDocuments();
