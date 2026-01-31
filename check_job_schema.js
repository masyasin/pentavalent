
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkJobAppSchema() {
    const { data, error } = await supabase.from('job_applications').select('*').limit(1);
    if (error) {
        console.error(error);
    } else {
        console.log('Job App columns:', data && data.length > 0 ? Object.keys(data[0]) : 'No data');

        // Also check storage buckets
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        if (bucketError) console.error(bucketError);
        else console.log('Buckets:', buckets.map(b => b.name));
    }
}

checkJobAppSchema();
