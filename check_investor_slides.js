
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInvestorSlides() {
    const { data: slides, error } = await supabase
        .from('hero_slides')
        .select('id, title_id, cta_secondary_link')
        .ilike('cta_secondary_link', '%/investor%');

    if (error) {
        console.error('Error fetching slides:', error);
        return;
    }

    console.log('Existing Investor Slides:', slides);
}

checkInvestorSlides();
