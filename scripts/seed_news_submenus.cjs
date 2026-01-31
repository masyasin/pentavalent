
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedNewsSubmenus() {
    console.log('🔄 Seeding News Submenus...');

    // 1. Get News Parent
    const { data: parents, error: parentError } = await supabase
        .from('nav_menus')
        .select('*')
        .or('label_en.eq.News,label_id.eq.Berita')
        .is('parent_id', null);

    if (parentError || !parents || parents.length === 0) {
        console.error('❌ News parent menu not found!');
        return;
    }

    const newsParent = parents[0];
    console.log('Found Parent:', newsParent.label_en, `(${newsParent.id})`);

    // 2. Define Submenus
    const submenus = [
        {
            label_id: 'Berita Terkini',
            label_en: 'Latest News',
            path: '/news?category=news',
            parent_id: newsParent.id,
            sort_order: 1,
            is_active: true,
            location: 'header'
        },
        {
            label_id: 'Siaran Pers',
            label_en: 'Press Release',
            path: '/news?category=press_release',
            parent_id: newsParent.id,
            sort_order: 2,
            is_active: true,
            location: 'header'
        },
        {
            label_id: 'Berita Korporasi',
            label_en: 'Corporate News',
            path: '/news?category=corporate_news',
            parent_id: newsParent.id,
            sort_order: 3,
            is_active: true,
            location: 'header'
        }
    ];

    // 3. Insert/Update Submenus
    for (const menu of submenus) {
        const { data: existing } = await supabase
            .from('nav_menus')
            .select('id')
            .eq('path', menu.path)
            .eq('parent_id', menu.parent_id)
            .single();

        if (existing) {
            console.log(`Updating ${menu.label_en}...`);
            await supabase.from('nav_menus').update(menu).eq('id', existing.id);
        } else {
            console.log(`Inserting ${menu.label_en}...`);
            await supabase.from('nav_menus').insert(menu);
        }
    }

    console.log('✅ News submenus seeding completed!');
}

seedNewsSubmenus();
