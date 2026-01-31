
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateRSM() {
    const id = '05d67c13-c77b-4976-b14a-7c6438bc09cb';

    const description_id = `Memimpin dan mengelola strategi penjualan regional untuk mencapai target distribusi farmasi secara berkelanjutan di wilayah Jakarta dan sekitarnya, serta memastikan implementasi kebijakan perusahaan berjalan efektif di seluruh jaringan distribusi.

**Tanggung Jawab Utama:**
- Memimpin dan mengembangkan tim penjualan regional untuk mencapai target penjualan dan distribusi.
- Menyusun strategi penjualan berdasarkan analisis pasar dan performa wilayah.
- Mengelola hubungan dengan principal, key account, dan mitra strategis.
- Memastikan kepatuhan terhadap regulasi industri farmasi dan kebijakan perusahaan.
- Melakukan monitoring, evaluasi, dan pelaporan kinerja penjualan secara berkala.`;

    const description_en = `Lead and manage regional sales strategies to achieve sustainable pharmaceutical distribution targets in Jakarta and surrounding areas, ensuring effective implementation of company policies throughout the distribution network.

**Key Responsibilities:**
- Lead and develop the regional sales team to achieve sales and distribution targets.
- Develop sales strategies based on market analysis and regional performance.
- Manage relationships with principals, key accounts, and strategic partners.
- Ensure compliance with pharmaceutical industry regulations and corporate policies.
- Conduct periodic monitoring, evaluation, and reporting of sales performance.`;

    const requirements_id = `- Minimal S1 di bidang Manajemen, Farmasi, atau bidang terkait.
- Pengalaman minimal 5 tahun di industri farmasi atau distribusi, dengan pengalaman memimpin tim.
- Memiliki kemampuan leadership, komunikasi, dan negosiasi yang kuat.
- Terbiasa bekerja dengan target dan analisis kinerja penjualan.
- Memahami dinamika pasar farmasi dan regulasi terkait.

**Nilai Plus:**
- Pengalaman bekerja di perusahaan Tbk atau lingkungan korporasi berskala nasional menjadi nilai tambah.`;

    const requirements_en = `- Minimum Bachelor's Degree (S1) in Management, Pharmacy, or related field.
- Minimum 5 years of experience in the pharmaceutical or distribution industry, with team leadership experience.
- Strong leadership, communication, and negotiation skills.
- Accustomed to working with targets and sales performance analysis.
- Understanding of pharmaceutical market dynamics and related regulations.

**Preferred Qualifications:**
- Experience working in a public company (Tbk) or national-scale corporate environment is a plus.`;

    const { error } = await supabase
        .from('careers')
        .update({
            description_id,
            description_en,
            requirements_id,
            requirements_en
        })
        .eq('id', id);

    if (error) console.error('Error updating RSM:', error);
    else console.log('Successfully updated Regional Sales Manager content.');
}

updateRSM();
