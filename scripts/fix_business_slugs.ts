import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSlugs() {
    console.log('Fixing business line slugs...');

    // Fix target-market to target-pasar
    const { error: error1 } = await supabase
        .from('business_lines')
        .update({ slug: 'target-pasar' })
        .eq('slug', 'target-market');

    if (error1) console.error('Error updating target-market:', error1);
    else console.log('Updated target-market to target-pasar');

    // Alur distribusi is already correct 'alur-distribusi'
}

fixSlugs();
