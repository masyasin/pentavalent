
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

const slideSets = {
    '/investor/ringkasan-investor': [
        // Slide 1 already exists (usually)
        {
            title_id: 'Pertumbuhan Berkelanjutan',
            title_en: 'Sustainable Growth',
            subtitle_id: 'Komitmen jangka panjang untuk nilai pemegang saham.',
            subtitle_en: 'Long-term commitment to shareholder value.',
            image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000'
        },
        {
            title_id: 'Inovasi Distribusi',
            title_en: 'Distribution Innovation',
            subtitle_id: 'Memperluas jangkauan layanan kesehatan nasional.',
            subtitle_en: 'Expanding national healthcare service reach.',
            image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000'
        }
    ],
    '/investor/informasi-saham': [
        {
            title_id: 'Analisa Pasar',
            title_en: 'Market Analysis',
            subtitle_id: 'Data real-time untuk keputusan investasi tepat.',
            subtitle_en: 'Real-time data for accurate investment decisions.',
            image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=2000'
        },
        {
            title_id: 'Transparansi Korporasi',
            title_en: 'Corporate Transparency',
            subtitle_id: 'Keterbukaan informasi untuk kepercayaan investor.',
            subtitle_en: 'Information disclosure for investor trust.',
            image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000'
        }
    ],
    '/investor/laporan-keuangan': [
        {
            title_id: 'Akuntabilitas Publik',
            title_en: 'Public Accountability',
            subtitle_id: 'Audit independen untuk validitas data yang terpercaya.',
            subtitle_en: 'Independent audit for trusted data validity.',
            image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000'
        },
        {
            title_id: 'Kinerja Fiskal',
            title_en: 'Fiscal Performance',
            subtitle_id: 'Pencapaian target tahunan yang solid dan terukur.',
            subtitle_en: 'Solid and measurable annual target achievements.',
            image_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=2000'
        }
    ],
    '/investor/prospektus': [
        {
            title_id: 'Penawaran Umum',
            title_en: 'Public Offering',
            subtitle_id: 'Peluang investasi strategis bersama Penta Valent.',
            subtitle_en: 'Strategic investment opportunities with Penta Valent.',
            image_url: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=2000'
        },
        {
            title_id: 'Profil Emiten',
            title_en: 'Issuer Profile',
            subtitle_id: 'Sejarah, visi, dan prospek masa depan perusahaan.',
            subtitle_en: 'History, vision, and future prospects of the company.',
            image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2000'
        }
    ],
    '/investor/rups': [
        {
            title_id: 'Keputusan Strategis',
            title_en: 'Strategic Decisions',
            subtitle_id: 'Menentukan arah masa depan perusahaan bersama pemegang saham.',
            subtitle_en: 'Determining the company future direction with shareholders.',
            image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000'
        },
        {
            title_id: 'Partisipasi Anda',
            title_en: 'Your Participation',
            subtitle_id: 'Hak suara Anda dalam tata kelola perusahaan yang baik.',
            subtitle_en: 'Your voting rights in good corporate governance.',
            image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000'
        }
    ],
    '/investor/keterbukaan-informasi': [
        {
            title_id: 'Pengumuman Terkini',
            title_en: 'Latest Announcements',
            subtitle_id: 'Update aksi korporasi dan regulasi pasar modal.',
            subtitle_en: 'Updates on corporate actions and capital market regulations.',
            image_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=2000'
        },
        {
            title_id: 'Tata Kelola',
            title_en: 'Governance',
            subtitle_id: 'Penerapan GCG yang konsisten dan transparan.',
            subtitle_en: 'Consistent and transparent GCG implementation.',
            image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2000'
        }
    ]
};

async function seedMoreSlides() {
    console.log('Starting supplemental seed...');

    for (const [pagePath, extraSlides] of Object.entries(slideSets)) {
        // Check current count
        const { data: existing } = await supabase
            .from('hero_slides')
            .select('id')
            .eq('cta_secondary_link', pagePath);

        const currentCount = existing ? existing.length : 0;
        console.log(`${pagePath}: Current count ${currentCount}`);

        if (currentCount < 3) {
            // Need to add more
            const needed = 3 - currentCount;
            // Take the first 'needed' amount from extraSlides logic
            // (Assuming we added 1 in previous step, so we add all 2 from extraSlides usually)

            // To be safe, we just loop through extraSlides and add them if count is still low
            // But simplified: just insert the defined extras.

            for (const slide of extraSlides) {
                const { error } = await supabase.from('hero_slides').insert({
                    title_id: slide.title_id,
                    title_en: slide.title_en,
                    subtitle_id: slide.subtitle_id,
                    subtitle_en: slide.subtitle_en,
                    image_url: slide.image_url,
                    cta_secondary_link: pagePath, // Map to page path
                    is_active: true,
                    sort_order: 20 + Math.floor(Math.random() * 10), // Randomize order slightly
                    cta_primary_text_id: 'Lihat Detail',
                    cta_primary_text_en: 'View Details',
                    cta_primary_link: pagePath
                });

                if (error) console.error(`Error inserting extra for ${pagePath}:`, error);
                else console.log(`Added extra slide for ${pagePath}`);
            }
        } else {
            console.log(`${pagePath} already has 3 or more slides.`);
        }
    }
}

seedMoreSlides();
