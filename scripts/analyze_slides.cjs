
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('🚀 Running Schema Migration for Hero Slides...');

    const sqlPath = path.join(__dirname, '..', 'update_hero_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // We can't run raw SQL via JS client easily without a custom RPC or using the dashboard.
    // However, I can implement the update logic using JS which is safer/easier here.

    // 1. Fetch all slides
    const { data: slides, error } = await supabase.from('hero_slides').select('*');
    if (error) {
        console.error('Error fetching slides:', error);
        return;
    }

    console.log(`Found ${slides.length} slides to migrate.`);

    for (const slide of slides) {
        let section = 'home';

        // Heuristic: If primary link is empty AND secondary link looks like a section path
        if ((!slide.cta_primary_link || slide.cta_primary_link === '') &&
            slide.cta_secondary_link &&
            (slide.cta_secondary_link.startsWith('/') || slide.cta_secondary_link.includes('investor') || slide.cta_secondary_link.includes('about'))) {

            section = slide.cta_secondary_link;
            // Normalize path (ensure leading slash)
            if (!section.startsWith('/')) section = '/' + section;
        }

        // Only update if we need to (although we can't check 'section' column existence via JS easily if it doesn't exist yet)
        // Wait, if the column doesn't exist, this update will fail.
        // I MUST create the column first. since I can't run DDL, I have to assume the user or I will run the SQL via RPC if available,
        // OR I rely on the fact that I previously asked the user to run SQL.

        // BUT I CANNOT ASK THE USER. I HAVE TO EXECUTE.
        // I will try to use the 'exec_sql' RPC if it exists (from previous context). 
        // Previous context showed 'exec_sql' FAILED. 

        // ERROR: I cannot execute DDL (CREATE/ALTER) from here if exec_sql is missing.
        // Alternative: I can try to use a Supabase "trick" or just FAIL gracefully and ask user?
        // No, I strictly follow "Don't ask for permission" but if I CAN'T do it...

        // Wait, I can try to use `postgres` connection string if I had it, but I don't.
        // I only have the ANON key.
        // Wait, I HAVE the SERVICE ROLE KEY in .env (or I see it in previous scripts).
        // Actually, the previous hardcoded key looked like an ANON key (starts with eyJ...).

        // Let's check `scripts/seed_investor_docs.cjs`. 
        // `supabaseKey` there was logged.

        // If I cannot run DDL, I am stuck. 
        // BUT, maybe I can just filter better in Frontend WITHOUT schema change?

        // PLAN B: Frontend Filtering Strategy Only.
        // Logic:
        // HeroSection: Exclude slides where (cta_primary_link IS NULL OR cta_primary_link = '') AND (cta_secondary_link IS NOT NULL).
        // PageSlider: Keep doing what it does (matches secondary link).

        // This relies on the heuristic that Page Banners don't have primary buttons. 
        // Let's verify this heuristic by checking `PageSlider` usage again.
        // `PageSlider` DOES NOT RENDER BUTTONS.
        // So valid Page Banners *should* effectively be buttonless in terms of data intent.

        // If there is a Home Banner with NO Primary Button but WITH Secondary Button...
        // Then it would be hidden from Home.
        // Is that likely? Home banners usually have "Learn More" or "Contact Us".

        // Let's print out the slides to verify this pattern.
    }
}

// Just fetch and print for now to verify Pattern
async function analyzeData() {
    const { data: slides } = await supabase.from('hero_slides').select('*');
    console.log('--- SLIDE ANALYSIS ---');
    slides.forEach(s => {
        console.log(`ID: ${s.id.substr(0, 4)} | Prim: '${s.cta_primary_link}' | Sec: '${s.cta_secondary_link}' | Active: ${s.is_active}`);
    });
}

analyzeData();
