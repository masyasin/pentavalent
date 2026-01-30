
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log('Testing insert...');
    const { data, error } = await supabase
        .from('news')
        .insert({
            title_id: 'Test Article ID',
            title_en: 'Test Article EN',
            slug: 'test-article-debug-' + Date.now(),
            excerpt_id: 'Excerpt ID',
            excerpt_en: 'Excerpt EN',
            content_id: 'Content ID',
            content_en: 'Content EN',
            category: 'general',
            is_published: true,
            published_at: new Date().toISOString()
        })
        .select();

    if (error) {
        console.error('Insert Error:', error);
    } else {
        console.log('Insert Success:', data);
    }
}

testInsert();
