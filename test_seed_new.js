import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding branches to supabase.co...');
    const { error } = await supabase.from('branches').insert([
        { name: 'Penta Valent Jakarta (HQ)', type: 'branch', city: 'Jakarta', province: 'DKI Jakarta', latitude: -6.1751, longitude: 106.8650, is_active: true }
    ]);
    if (error) console.error('Error:', error.message, error.code);
    else console.log('✅ Success!');
}

seed();
