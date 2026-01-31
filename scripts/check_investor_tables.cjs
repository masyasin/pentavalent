
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllTables() {
    // Try to query common tables or information_schema if possible
    const tableNames = [
        'investor_documents',
        'investor_financials',
        'investor_stock',
        'investor_highlights',
        'investor_calendar',
        'rups_schedules',
        'site_settings',
        'hero_slides',
        'nav_menus'
    ];

    console.log('--- Checking for tables ---');
    for (const name of tableNames) {
        const { data, error } = await supabase.from(name).select('*').limit(1);
        if (error) {
            console.log(`❌ Table ${name}: ${error.code} - ${error.message}`);
        } else {
            console.log(`✅ Table ${name}: Found`);
        }
    }
}

listAllTables();
