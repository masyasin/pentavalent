import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPartners() {
    console.log('🔍 Checking Partners Data...\n');

    const { data, error, count } = await supabase
        .from('partners')
        .select('*', { count: 'exact' })
        .order('sort_order');

    if (error) {
        console.error('❌ Error:', error.message);
        return;
    }

    console.log(`✅ Total Partners: ${count}\n`);

    // Group by type
    const international = data.filter(p => p.partner_type === 'international');
    const principal = data.filter(p => p.partner_type === 'principal');

    console.log('📊 Partner Breakdown:');
    console.log(`   - International: ${international.length}`);
    console.log(`   - National Principals: ${principal.length}\n`);

    console.log('🌍 International Partners:');
    international.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name}`);
    });

    console.log('\n🇮🇩 National Principals:');
    principal.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name}`);
    });

    console.log('\n📋 Full Partner List:');
    console.table(data.map(p => ({
        Name: p.name,
        Type: p.partner_type,
        Website: p.website,
        Active: p.is_active ? '✓' : '✗'
    })));
}

checkPartners();
