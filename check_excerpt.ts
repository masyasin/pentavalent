
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExcerpts() {
    console.log('Checking excerpts...');
    const { data: news, error } = await supabase
        .from('news')
        .select('id, title_id, excerpt_id, excerpt_en')
        .ilike('title_id', '%Hermanto%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(JSON.stringify(news, null, 2));
}

checkExcerpts();
