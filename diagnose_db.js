import { createClient } from '@supabase/supabase-js';

const config = [
    {
        name: 'Current supabase.ts',
        url: 'https://bkjfepimzoubwthqldiq.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw'
    },
    {
        name: 'Old DatabasePad',
        url: 'https://sonqawatrvahcomthxfn.databasepad.com',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjAxOWFjNDk0LWNiYTYtNDNkNy05M2U2LWYwNGNmYzQyOWM0MCJ9.eyJwcm9qZWN0SWQiOiJzb25xYXdhdHJ2YWhjb210aHhmbiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5NjA1MDI4LCJleHAiOjIwODQ5NjUwMjgsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.kr_i_V7Bhn49deuhh6YIaXUS6S7nRr1WB1ZEGxBH0cE'
    }
];

async function diagnose() {
    for (const c of config) {
        console.log(`\n=== Testing ${c.name} (${c.url}) ===`);
        const supabase = createClient(c.url, c.key);

        try {
            const { data, error, count } = await supabase.from('branches').select('*', { count: 'exact' });
            if (error) {
                console.log(`❌ branches: ${error.message} (${error.code})`);
            } else {
                console.log(`✅ branches: ${data.length} rows found (Exact count: ${count})`);
                if (data.length > 0) {
                    console.log('Sample data name:', data[0].name);
                }
            }
        } catch (e) {
            console.log(`🚫 Exception: ${e.message}`);
        }
    }
}

diagnose();
