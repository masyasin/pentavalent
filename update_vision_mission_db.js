
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateVisionMission() {
    console.log('Updating Vision & Mission...');

    const { data: info, error: fetchError } = await supabase
        .from('company_info')
        .select('*')
        .single();

    if (fetchError) {
        console.error('Fetch error:', fetchError);
        return;
    }

    // Refine Vision: "one of the companies..."
    const newVisionId = "Menjadi salah satu perusahaan distribusi produk kesehatan dan konsumsi dengan jaringan nasional yang unggul di Indonesia.";
    // English equivalent
    // "To be one of the leading healthcare and consumer product distribution companies with a superior national network in Indonesia."

    // Refine Mission: Add compliance focus
    // Original might be generic. We append/update.
    const newMissionId = `
    <p>Memberikan solusi rantai pasok terintegrasi yang andal dan efisien.</p>
    <p>Menciptakan nilai tambah bagi prinsipal, pelanggan, dan pemangku kepentingan melalui layanan prima.</p>
    <p>Memperluas jangkauan distribusi untuk memastikan ketersediaan produk kesehatan di seluruh Indonesia dengan mengedepankan kepatuhan terhadap regulasi serta praktik usaha yang berkelanjutan.</p>
  `;

    // Update in DB
    const { error: updateError } = await supabase
        .from('company_info')
        .update({
            vision_text_id: newVisionId,
            // vision_text_en: ... // Keep existing or update similarly if needed. Assuming existing is close or I should update it too.
            // Let's safe update English too just in case.
            vision_text_en: "To be one of the leading distribution companies for healthcare and consumer products with a superior national network in Indonesia.",
            mission_text_id: newMissionId,
            // Refined English Mission
            mission_text_en: `
        <p>Providing reliable and efficient integrated supply chain solutions.</p>
        <p>Creating added value for principals, customers, and stakeholders through excellent service.</p>
        <p>Expanding distribution reach to ensure healthcare product availability across Indonesia while prioritizing regulatory compliance and sustainable business practices.</p>
      `
        })
        .eq('id', info.id);

    if (updateError) console.error('Update error:', updateError);
    else console.log('Successfully updated Vision and Mission texts.');

    // Update Values titles if needed in DB?
    // The code now displays title_id and title_en.
    // The arrays in `VisionMission.tsx` are hardcoded in the render loop:
    // lines 199-236: { id: '1', title_id: 'Customer Fokus', title_en: 'Customer Focus', ... }
    // Oh, wait! The file `VisionMission.tsx` has *hardcoded* values for the grid in the code I viewed earlier?
    // Let me check the file content again.
    // Lines 29: `const [values, setValues] = useState<CorporateValue[]>([]);`
    // Lines 36-57: Fetches from `corporate_values` table.
    // BUT Lines 199-236 inside the return statement has a `.map` on a HARDCODED array!
    // It completely ignores the `values` state fetched from DB!
    // I must fix that to use the `values` state from DB if I want the DB updates to propagate, OR I update the hardcoded list in the file.
    // Given specifically "Values Perusahaan... Campuran Bahasa... Sebaiknya Bahasa Indonesia jadi utama", and the code has hardcoded mixed English/Indonesian titles.
    // I should update the HARDCODED array in the file to be correct, OR switch to using the DB data.
    // Switching to DB data is cleaner, but might break images if DB doesn't have the right image paths.
    // Let's stick to updating the hardcoded array to match the request for now to be safe and fast, as I can see the exact strings there.
}

updateVisionMission();
