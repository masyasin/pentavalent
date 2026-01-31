
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedStrategiBisnis() {
    console.log('🚀 Seeding Strategi Bisnis Content...');

    // 1. Ensure business_lines record exists for slug: strategi-bisnis
    let { data: bLine, error: bError } = await supabase
        .from('business_lines')
        .select('id')
        .eq('slug', 'strategi-bisnis')
        .single();

    if (bError && bError.code === 'PGRST116') {
        console.log('Creating business_line: strategi-bisnis');
        const { data: newData, error: insertError } = await supabase
            .from('business_lines')
            .insert({
                slug: 'strategi-bisnis',
                title_id: 'Strategi Usaha',
                title_en: 'Business Strategy',
                description_id: 'PT Penta Valent berkomitmen untuk terus tumbuh dan berkembang melalui berbagai inisiatif strategis yang terintegrasi, mulai dari perluasan jaringan hingga transformasi digital operasional.',
                description_en: 'PT Penta Valent is committed to continuous growth and development through various integrated strategic initiatives, ranging from network expansion to operational digital transformation.',
                image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
                sort_order: 4,
                is_active: true
            })
            .select()
            .single();

        if (insertError) {
            console.error('Error creating business line:', insertError.message);
            return;
        }
        bLine = newData;
    } else if (bError) {
        console.error('Error fetching business line:', bError.message);
        return;
    }

    const bLineId = bLine.id;
    console.log(`Found Business Line ID: ${bLineId}`);

    // 2. Clear existing advantages for this line
    console.log('Clearing existing advantages...');
    await supabase.from('business_advantages').delete().eq('business_line_id', bLineId);

    // 3. Insert fresh content from the image
    const advantages = [
        {
            business_line_id: bLineId,
            title_id: 'MEMPERLUAS JARINGAN DISTRIBUSI',
            title_en: 'EXPANDING DISTRIBUTION NETWORK',
            description_id: 'Menambah cabang dan kantor penjualan (Depo dan Sales Office)',
            description_en: 'Adding branches and sales offices (Depot and Sales Office)',
            icon_name: 'trending',
            sort_order: 1
        },
        {
            business_line_id: bLineId,
            title_id: 'MENERAPKAN OTOMASI PROSES KERJA SALESMAN',
            title_en: 'IMPLEMENTING SALESMAN AUTOMATION',
            description_id: 'Memaksimalkan produktivitas tenaga penjual dengan Otomasi Proses Kerja Salesman yang kedepannya akan menggunakan aplikasi yang terotomatisasi.',
            description_en: 'Maximizing sales force productivity with Salesman Work Process Automation which in the future will use automated applications.',
            icon_name: 'server',
            sort_order: 2
        },
        {
            business_line_id: bLineId,
            title_id: 'MEMBANGUN DIVISI KONSUMER',
            title_en: 'BUILDING CONSUMER DIVISION',
            description_id: 'Mengembangkan divisi konsumer dengan memperluas jaringan dan meningkatkan efektivitas operasional.',
            description_en: 'Developing the consumer division by expanding the network and improving operational effectiveness.',
            icon_name: 'users',
            sort_order: 3
        },
        {
            business_line_id: bLineId,
            title_id: 'MENINGKATKAN KUALITAS OPERASIONAL (OPERATION EXCELLENT)',
            title_en: 'IMPROVING OPERATIONAL QUALITY',
            description_id: 'Meningkatkan kualitas operasional (Operation Excellent) sebagai nilai tambah dalam membangun loyalitas Prinsipal dan Pelanggan.',
            description_en: 'Improving operational quality (Operation Excellence) as an added value in building Principal and Customer loyalty.',
            icon_name: 'award',
            sort_order: 4
        },
        {
            business_line_id: bLineId,
            title_id: 'MENAMBAH PRINSIPAL BARU',
            title_en: 'ADDING NEW PRINCIPALS',
            description_id: 'Menambah Prinsipal baru untuk meningkatkan penjualan dan skala ekonomi Perusahaan.',
            description_en: 'Adding new Principals to increase sales and company economies of scale.',
            icon_name: 'handshake',
            sort_order: 5
        }
    ];

    console.log('Inserting new advantages...');
    const { error: insError } = await supabase.from('business_advantages').insert(advantages);

    if (insError) {
        console.error('Error inserting advantages:', insError.message);
    } else {
        console.log('✅ Advantages seeded successfully!');
    }

    // 4. Add items for Operational Excellence Gallery (Slider)
    console.log('Clearing and adding gallery images...');
    await supabase.from('business_images').delete().eq('business_line_id', bLineId);

    const galleryImages = [
        {
            business_line_id: bLineId,
            image_url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=2000',
            sort_order: 1
        },
        {
            business_line_id: bLineId,
            image_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000',
            sort_order: 2
        },
        {
            business_line_id: bLineId,
            image_url: 'https://images.unsplash.com/photo-1454165833762-01024098e067?auto=format&fit=crop&q=80&w=2000',
            sort_order: 3
        },
        {
            business_line_id: bLineId,
            image_url: 'https://images.unsplash.com/photo-1507679799987-c7377eb56496?auto=format&fit=crop&q=80&w=2000',
            sort_order: 4
        }
    ];

    const { error: imgError } = await supabase.from('business_images').insert(galleryImages);
    if (imgError) {
        console.error('Error inserting gallery images:', imgError.message);
    } else {
        console.log('✅ Gallery images seeded successfully!');
    }
}

seedStrategiBisnis();
