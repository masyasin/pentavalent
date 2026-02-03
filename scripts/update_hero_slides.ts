
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTYxMjA2NiwiZXhwIjoyMDg1MTg4MDY2fQ.2ZQj1Ch6vzbNB136MKGL589NJLSnqAdUNVSbP2L66UY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateHeroSlides() {
    const { data: slides, error: fetchError } = await supabase
        .from('hero_slides')
        .select('*')
        .not('cta_secondary_link', 'ilike', '/about%')
        .not('cta_secondary_link', 'ilike', '/investor%')
        .not('cta_secondary_link', 'ilike', '/business%')
        .not('cta_secondary_link', 'ilike', '/news%')
        .not('cta_secondary_link', 'ilike', '/career%')
        .not('cta_secondary_link', 'ilike', '/contact%')
        .not('cta_secondary_link', 'ilike', '/privacy-policy%')
        .not('cta_secondary_link', 'ilike', '/code-of-conduct%')
        .order('sort_order', { ascending: true });

    if (fetchError) {
        console.error('Error fetching hero slides:', fetchError);
        return;
    }

    const updates = [
        {
            title_id: 'Solusi Distribusi Terpercaya untuk Kesehatan Indonesia',
            title_en: 'Trusted Distribution Solutions for Indonesian Healthcare',
            subtitle_id: 'Distributor Alat Kesehatan, Produk Medis, Farmasi, serta Produk Konsumen & Kesehatan dengan jaringan distribusi nasional.',
            subtitle_en: 'National distributor of medical devices, healthcare products, pharmaceuticals, and consumer health products.',
            cta_primary_text_id: 'Layanan Kami',
            cta_primary_text_en: 'Our Services',
            cta_primary_link: '#business'
        },
        {
            title_id: 'Jaringan Logistik Nasional Terluas di Seluruh Nusantara',
            title_en: 'Broadest National Logistics Network Across the Archipelago',
            subtitle_id: 'Menjangkau lebih dari 34 lokasi strategis untuk memastikan ketersediaan pasokan kesehatan bagi seluruh masyarakat Indonesia.',
            subtitle_en: 'Reaching over 34 strategic locations to ensure healthcare supply availability for all Indonesians.',
            cta_primary_text_id: 'Jangkauan Kami',
            cta_primary_text_en: 'Our Coverage',
            cta_primary_link: '#about'
        },
        {
            title_id: 'Keunggulan Operasional dengan Standar Internasional',
            title_en: 'Operational Excellence with International Standards',
            subtitle_id: 'Berkomitmen pada kualitas dan keamanan dalam setiap langkah rantai pasok farmasi dan alat kesehatan di Indonesia.',
            subtitle_en: 'Committed to quality and safety in every step of the pharmaceutical and medical device supply chain in Indonesia.',
            cta_primary_text_id: 'Keunggulan Kami',
            cta_primary_text_en: 'Our Advantages',
            cta_primary_link: '#why-penta'
        },
        {
            title_id: 'Inovasi Rantai Pasok untuk Efisiensi Distribusi',
            title_en: 'Supply Chain Innovation for Distribution Efficiency',
            subtitle_id: 'Mengintegrasikan teknologi modern untuk mempercepat distribusi produk medis ke pelosok negeri.',
            subtitle_en: 'Integrating modern technology to accelerate medical product distribution across the country.',
            cta_primary_text_id: 'Inovasi Kami',
            cta_primary_text_en: 'Our Innovations',
            cta_primary_link: '#business'
        },
        {
            title_id: 'Kemitraan Strategis untuk Masa Depan Kesehatan',
            title_en: 'Strategic Partnerships for the Future of Healthcare',
            subtitle_id: 'Membangun sinergi yang kuat bersama mitra global untuk menghadirkan solusi kesehatan terbaik.',
            subtitle_en: 'Building strong synergy with global partners to provide the best healthcare solutions.',
            cta_primary_text_id: 'Mitra Kami',
            cta_primary_text_en: 'Our Partners',
            cta_primary_link: '#about'
        }
    ];

    let imageCounter = 0;

    for (const slide of slides) {
        if (slide.video_url) {
            console.log(`Clearing titles/CTA for video slide ${slide.id}`);
            await supabase.from('hero_slides').update({
                title_id: '',
                title_en: '',
                subtitle_id: '',
                subtitle_en: '',
                cta_primary_text_id: '',
                cta_primary_text_en: '',
                cta_primary_link: '',
                cta_secondary_text_id: '',
                cta_secondary_text_en: '',
                cta_secondary_link: ''
            }).eq('id', slide.id);
        } else if (slide.image_url) {
            const updateData = updates[imageCounter % updates.length];
            console.log(`Updating image slide ${slide.id} with title: ${updateData.title_id}`);
            await supabase.from('hero_slides').update(updateData).eq('id', slide.id);
            imageCounter++;
        }
    }

    console.log('Update complete!');
}

updateHeroSlides();
