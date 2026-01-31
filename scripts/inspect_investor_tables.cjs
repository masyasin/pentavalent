
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectInvestorTables() {
    const { data: tables, error } = await supabase.rpc('get_tables'); // This might not work if no rpc

    // Let's try to query some likely table names
    const tableNames = ['investor_categories', 'investor_documents', 'nav_menus', 'pages'];

    for (const name of tableNames) {
        const { data, error } = await supabase.from(name).select('*').limit(1);
        if (error) {
            console.log(`❌ Table ${name} does not exist or error:`, error.message);
        } else {
            console.log(`✅ Table ${name} exists!`);
        }
    }
}

inspectInvestorTables();
