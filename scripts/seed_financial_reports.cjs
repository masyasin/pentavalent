
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyReports = [
    // 2024 Reports
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

    // 2023 Reports
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
    {
        title_id: 'Laporan Keuangan FY 2023',
        title_en: 'Financial Statements FY 2023',
        document_type: 'financial_report',
        year: 2023,
        published_at: '2024-02-28',
        file_url: '#',
        is_active: true
    },
    {
        title_id: 'Laporan Audit 2023',
        title_en: 'Audit Report 2023',
        document_type: 'audit_report',
        year: 2023,
        published_at: '2024-02-25',
        file_url: '#',
        is_active: true
    },

    // 2022 Reports
    {
        title_id: 'Laporan Tahunan 2022',
        title_en: 'Annual Report 2022',
        document_type: 'annual_report',
        year: 2022,
        published_at: '2023-03-30',
        file_url: '#',
        is_active: true
    },
    {
        title_id: 'Laporan Keberlanjutan 2022',
        title_en: 'Sustainability Report 2022',
        document_type: 'sustainability_report',
        year: 2022,
        published_at: '2023-04-10',
        file_url: '#',
        is_active: true
    }
];

async function seedReports() {
    console.log('🔄 Seeding Dummy Financial Reports...');

    // First, verify these document_types support the filter logic we just built
    // document_type: 'financial_report' | 'annual_report' | 'sustainability_report' | 'audit_report'

    const { error } = await supabase
        .from('investor_documents')
        .insert(dummyReports);

    if (error) {
        console.error('❌ Error seeding reports:', error);
    } else {
        console.log('✅ Dummy reports inserted successfully!');
        console.log('📊 Check the filters now:');
        console.log('- Financial Statements');
        console.log('- Annual Report');
        console.log('- Sustainability Report');
        console.log('- Audit Report');
    }
}

seedReports();
