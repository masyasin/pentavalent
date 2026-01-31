import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSocialLinks() {
    console.log('Seeding social_links...');

    const socialLinks = [
        { platform: 'LinkedIn', url: '#' },
        { platform: 'Instagram', url: '#' },
        { platform: 'Twitter', url: '#' },
        { platform: 'YouTube', url: '#' }
    ];

    // Assuming we update the first record found or ID 1
    const { data } = await supabase.from('site_settings').select('id').limit(1).single();

    if (data) {
        const { error } = await supabase
            .from('site_settings')
            .update({ social_links: socialLinks })
            .eq('id', data.id);

        if (error) console.error('Error updating:', error);
        else console.log('Updated social_links successfully.');
    } else {
        console.error('No site_settings found to update.');
    }
}

seedSocialLinks();
