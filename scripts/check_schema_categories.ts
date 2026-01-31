import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    const { data, error } = await supabase.from('business_images').select('*').limit(1);
    console.log('Business Images Sample:', data);

    // Check if target_market_categories table exists or similar
    const { data: tables, error: tableError } = await supabase.from('target_market_categories').select('*').limit(1).catch(() => ({ data: null, error: 'Not found' }));
    console.log('Target Market Categories exists?', !!tables);
}

checkSchema();
