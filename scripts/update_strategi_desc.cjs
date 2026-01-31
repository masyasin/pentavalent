
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateStrategiDescription() {
    console.log('🚀 Updating Strategi Bisnis Description...');

    const description_id = `PT Penta Valent Tbk (PEVE) menargetkan pertumbuhan penjualan 17% dan kenaikan laba 40% pada tahun 2025, didukung strategi inovasi produk dan pondasi bisnis yang kuat.\n\nPEVE menunjukkan kinerja positif dengan tren pertumbuhan penjualan dan laba bersih yang stabil, meskipun kondisi ekonomi belum sepenuhnya kondusif.\n\nFaktor kunci pertumbuhan PEVE meliputi kebutuhan esensial produk healthcare, portofolio kuat, pengembangan merek sendiri, dan peningkatan efisiensi rantai pasok.`;

    const description_en = `PT Penta Valent Tbk (PEVE) targets 17% sales growth and 40% profit increase in 2025, supported by product innovation strategies and a strong business foundation.\n\nPEVE shows positive performance with stable sales and net profit growth trends, even though economic conditions are not yet fully conducive.\n\nKey growth factors for PEVE include the essential need for healthcare products, a strong portfolio, private label development, and improved supply chain efficiency.`;

    const { error } = await supabase
        .from('business_lines')
        .update({
            description_id: description_id,
            description_en: description_en
        })
        .eq('slug', 'strategi-bisnis');

    if (error) {
        console.error('Error updating description:', error.message);
    } else {
        console.log('✅ Description updated successfully!');
    }
}

updateStrategiDescription();
