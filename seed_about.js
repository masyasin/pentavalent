import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sonqawatrvahcomthxfn.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjAxOWFjNDk0LWNiYTYtNDNkNy05M2U2LWYwNGNmYzQyOWM0MCJ9.eyJwcm9qZWN0SWQiOiJzb25xYXdhdHJ2YWhjb210aHhmbiIsInR5cCI6ImFub24iLCJpYXQiOjE3Njk2MDUwMjgsImV4cCI6MjA4NDk2NTAyOCwiaXNzIjoiZmFtb3VzLmRhdGFiYXNlcGFkIiwiYXVkIjoiZmFtb3VzLmNsaWVudHMifQ.kr_i_V7Bhn49deuhh6YIaXUS6S7nRr1WB1ZEGxBH0cE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAbout() {
    console.log('Starting About Seeding...');

    // 1. Company Timeline
    console.log('Seeding company_timeline...');
    const { error: timelineErr } = await supabase.from('company_timeline').insert([
        { year: '1968', title_id: 'Pendirian Perusahaan', title_en: 'Company Establishment', description_id: 'PT. Penta Valent didirikan di Jakarta', description_en: 'PT. Penta Valent was established in Jakarta', sort_order: 1 },
        { year: '1985', title_id: 'Ekspansi Nasional', title_en: 'National Expansion', description_id: 'Membuka cabang di 10 kota besar Indonesia', description_en: 'Opened branches in 10 major cities in Indonesia', sort_order: 2 },
        { year: '2000', title_id: 'Sertifikasi CDOB', title_en: 'CDOB Certification', description_id: 'Memperoleh sertifikasi Cara Distribusi Obat yang Baik', description_en: 'Obtained Good Distribution Practice certification', sort_order: 3 },
        { year: '2010', title_id: 'Cold Chain System', title_en: 'Cold Chain System', description_id: 'Implementasi sistem rantai dingin untuk produk sensitif', description_en: 'Implementation of cold chain system for sensitive products', sort_order: 4 },
        { year: '2020', title_id: '34 Cabang Nasional', title_en: '34 National Branches', description_id: 'Jaringan distribusi mencakup seluruh Indonesia', description_en: 'Distribution network covers all of Indonesia', sort_order: 5 },
        { year: '2023', title_id: 'IPO di BEI', title_en: 'IPO at IDX', description_id: 'Tercatat sebagai perusahaan publik di Bursa Efek Indonesia', description_en: 'Listed as a public company on the Indonesia Stock Exchange', sort_order: 6 }
    ]);
    if (timelineErr) console.log('❌ company_timeline error:', timelineErr.message);

    // 2. Corporate Values
    console.log('Seeding corporate_values...');
    const { error: valuesErr } = await supabase.from('corporate_values').insert([
        { title_id: 'Integritas', title_en: 'Integrity', description_id: 'Menjunjung tinggi kejujuran dan etika dalam setiap aspek bisnis', description_en: 'Upholding honesty and ethics in every aspect of business', icon_name: 'shield', sort_order: 1 },
        { title_id: 'Inovasi', title_en: 'Innovation', description_id: 'Terus berinovasi untuk memberikan layanan terbaik', description_en: 'Continuously innovating to provide the best service', icon_name: 'zap', sort_order: 2 },
        { title_id: 'Kolaborasi', title_en: 'Collaboration', description_id: 'Membangun kemitraan yang saling menguntungkan', description_en: 'Building mutually beneficial partnerships', icon_name: 'users', sort_order: 3 },
        { title_id: 'Kualitas', title_en: 'Quality', description_id: 'Berkomitmen pada standar kualitas tertinggi', description_en: 'Committed to the highest quality standards', icon_name: 'award', sort_order: 4 }
    ]);
    if (valuesErr) console.log('❌ corporate_values error:', valuesErr.message);

    console.log('About Seeding complete!');
}

seedAbout();
