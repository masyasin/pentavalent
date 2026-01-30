const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkColumns() {
    const { data, error } = await supabase.from('branches').select('*').limit(1);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Columns in branches:', Object.keys(data[0] || {}));
    }
}

checkColumns();
