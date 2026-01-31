
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreEnterpriseStrategy() {
    console.log('🔄 Restoring Enterprise Strategy content...');

    const { data: bLine } = await supabase
        .from('business_lines')
        .select('id')
        .eq('slug', 'strategi-bisnis')
        .single();

    if (!bLine) return;

    const bLineId = bLine.id;

    // Delete current image-based content
    await supabase.from('business_advantages').delete().eq('business_line_id', bLineId);

    // RESTORE Enterprise Strategic Pillars
    const advantages = [
        {
            business_line_id: bLineId,
            title_id: 'EKSPANSI JARINGAN NASIONAL',
            title_en: 'NATIONAL NETWORK EXPANSION',
            description_id: 'Mengakselerasi penetrasi pasar melalui penguatan infrastruktur distribusi terintegrasi di seluruh wilayah strategis Indonesia.',
            description_en: 'Accelerating market penetration through the strengthening of integrated distribution infrastructure across strategic regions in Indonesia.',
            icon_name: 'Globe',
            sort_order: 1
        },
        {
            business_line_id: bLineId,
            title_id: 'TRANSFORMASI DIGITAL SALES',
            title_en: 'DIGITAL SALES TRANSFORMATION',
            description_id: 'Mengintegrasikan ekosistem otomasi cerdas pada armada penjualan untuk mengoptimalkan efektivitas operasional dan analisis data real-time.',
            description_en: 'Integrating a smart automation ecosystem into the sales fleet to optimize operational effectiveness and real-time data analytics.',
            icon_name: 'Zap',
            sort_order: 2
        },
        {
            business_line_id: bLineId,
            title_id: 'DIVERSIFIKASI PORTOFOLIO',
            title_en: 'PORTFOLIO DIVERSIFICATION',
            description_id: 'Melakukan restrukturisasi dan penguatan Divisi Konsumer guna menciptakan pertumbuhan nilai jangka panjang yang berkelanjutan.',
            description_en: 'Restructuring and strengthening the Consumer Division to create sustainable long-term value growth.',
            icon_name: 'Briefcase',
            sort_order: 3
        },
        {
            business_line_id: bLineId,
            title_id: 'OPERATIONAL EXCELLENCE',
            title_en: 'OPERATIONAL EXCELLENCE',
            description_id: 'Mengimplementasikan sistem manajemen logistik mutakhir berbasis standar ISO untuk memastikan keunggulan operasional di setiap lini.',
            description_en: 'Implementing cutting-edge logistics management systems based on ISO standards to ensure operational excellence across all lines.',
            icon_name: 'ShieldCheck',
            sort_order: 4
        },
        {
            business_line_id: bLineId,
            title_id: 'AKSELERASI KEMITRAAN GLOBAL',
            title_en: 'GLOBAL PARTNERSHIP ACCELERATION',
            description_id: 'Proaktif dalam membangun sinergi strategis dengan prinsipal multinasional terkemuka untuk memperkuat posisi pasar dalam sektor kesehatan.',
            description_en: 'Proactive in building strategic synergies with leading multinational principals to strengthen market position in the health sector.',
            icon_name: 'Handshake',
            sort_order: 5
        }
    ];

    await supabase.from('business_advantages').insert(advantages);
    console.log('✅ Enterprise Strategy restored successfully!');
}

restoreEnterpriseStrategy();
