import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sonqawatrvahcomthxfn.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjAxOWFjNDk0LWNiYTYtNDNkNy05M2U2LWYwNGNmYzQyOWM0MCJ9.eyJwcm9qZWN0SWQiOiJzb25xYXdhdHJ2YWhjb210aHhmbiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5NjA1MDI4LCJleHAiOjIwODQ5NjUwMjgsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.kr_i_V7Bhn49deuhh6YIaXUS6S7nRr1WB1ZEGxBH0cE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    const tables = [
        'hero_slides',
        'company_timeline',
        'corporate_values',
        'management',
        'business_lines',
        'branches',
        'partners',
        'news',
        'certifications'
    ];

    console.log('--- Checking Tables ---');
    for (const table of tables) {
        try {
            const { data, error } = await supabase.from(table).select('*').limit(1);
            if (error) {
                if (error.code === '42P01') {
                    console.log(`❌ ${table.padEnd(20)}: MISSING (Table does not exist)`);
                } else {
                    console.log(`⚠️ ${table.padEnd(20)}: ERROR (${error.code}) - ${error.message}`);
                }
            } else {
                console.log(`✅ ${table.padEnd(20)}: EXISTS (${data.length} row sample)`);
            }
        } catch (e) {
            console.log(`🚫 ${table.padEnd(20)}: EXCEPTION - ${e.message}`);
        }
    }
}

checkTables();
