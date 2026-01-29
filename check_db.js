import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sonqawatrvahcomthxfn.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjAxOWFjNDk0LWNiYTYtNDNkNy05M2U2LWYwNGNmYzQyOWM0MCJ9.eyJwcm9qZWN0SWQiOiJzb25xYXdhdHJ2YWhjb210aHhmbiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5NjA1MDI4LCJleHAiOjIwODQ5NjUwMjgsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.kr_i_V7Bhn49deuhh6YIaXUS6S7nRr1WB1ZEGxBH0cE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    console.log('Checking database table data...');

    const tables = ['branches', 'partners', 'news', 'careers', 'certifications', 'investor_documents'];

    for (const table of tables) {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);

        if (error) {
            console.log(`❌ Table "${table}" error:`, error.message);
        } else {
            console.log(`✅ Table "${table}" status:`, data.length > 0 ? `Has ${data.length} row(s)` : 'Empty');
        }
    }
}

checkDatabase();
