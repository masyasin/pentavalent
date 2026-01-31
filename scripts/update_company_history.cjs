
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCompanyInfo() {
    console.log('🔄 Updating Company Info in Database...');

    const descriptionId = `
    <p>Perseroan didirikan pada bulan September 1968 di Jakarta, Indonesia dengan nama CV Penta Valent. Selanjutnya, pada tahun 1972, Perseroan melakukan perubahan badan hukum menjadi Perseroan Terbatas.</p>
    <p>PT Penta Valent Tbk adalah perusahaan distributor produk farmasi, medis, dan kesehatan terkemuka di Indonesia. Sejak didirikan, kami telah membangun reputasi atas keandalan, jangkauan luas, dan komitmen terhadap kualitas dalam melayani rantai pasok kesehatan nasional.</p>
    `;

    const descriptionEn = `
    <p>The Company was established in September 1968 in Jakarta, Indonesia under the name CV Penta Valent. Subsequently, in 1972, the Company changed its legal status to a Limited Liability Company.</p>
    <p>PT Penta Valent Tbk is a leading distributor of pharmaceutical, medical, and healthcare products in Indonesia. Since inception, we have built a reputation for reliability, extensive reach, and commitment to quality in serving the national healthcare supply chain.</p>
    `;

    // Check if row exists, if not insert, if yes update.
    // Assuming there is only 1 row for company_info usually.
    const { data: existing } = await supabase.from('company_info').select('*').limit(1);

    if (existing && existing.length > 0) {
        const { error } = await supabase
            .from('company_info')
            .update({
                description_id: descriptionId,
                description_en: descriptionEn
            })
            .eq('id', existing[0].id);

        if (error) console.error('❌ Error updating:', error);
        else console.log('✅ Company Info updated successfully!');
    } else {
        // Insert new
        const { error } = await supabase
            .from('company_info')
            .insert({
                description_id: descriptionId,
                description_en: descriptionEn,
                // Add dummy/default values for other required fields if any (based on schema)
                // For now assuming these might be the only ones or others are nullable/defaulted
                // But better to be safe, let's just log warning if no row found.
            });
        if (error) console.error('❌ Error inserting:', error);
        else console.log('✅ Company Info inserted successfully!');
    }
}

updateCompanyInfo();
