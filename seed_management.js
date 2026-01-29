import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sonqawatrvahcomthxfn.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjAxOWFjNDk0LWNiYTYtNDNkNy05M2U2LWYwNGNmYzQyOWM0MCJ9.eyJwcm9qZWN0SWQiOiJzb25xYXdhdHJ2YWhjb210aHhmbiIsInR5cCI6ImFub24iLCJpYXQiOjE3Njk2MDUwMjgsImV4cCI6MjA4NDk2NTAyOCwiaXNzIjoiZmFtb3VzLmRhdGFiYXNlcGFkIiwiYXVkIjoiZmFtb3VzLmNsaWVudHMifQ.kr_i_V7Bhn49deuhh6YIaXUS6S7nRr1WB1ZEGxBH0cE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedManagement() {
    console.log('Seeding management...');
    const { error } = await supabase.from('management').insert([
        { name: 'Budi Santoso', position_id: 'Direktur Utama', position_en: 'President Director', bio_id: 'Lebih dari 30 tahun pengalaman di industri distribusi farmasi.', bio_en: 'Over 30 years of experience in pharmaceutical distribution industry.', image_url: 'https://d64gsuwffb70l.cloudfront.net/697a07882750ca11cca5ba96_1769605162964_846014ea.jpg', sort_order: 1 },
        { name: 'Siti Rahayu', position_id: 'Direktur Keuangan', position_en: 'Finance Director', bio_id: 'Ahli keuangan dengan pengalaman di perusahaan multinasional.', bio_en: 'Finance expert with experience in multinational companies.', image_url: 'https://d64gsuwffb70l.cloudfront.net/697a07882750ca11cca5ba96_1769605191855_364fe96e.png', sort_order: 2 },
        { name: 'Ahmad Wijaya', position_id: 'Direktur Operasional', position_en: 'Operations Director', bio_id: 'Spesialis logistik dan supply chain management.', bio_en: 'Logistics and supply chain management specialist.', image_url: 'https://d64gsuwffb70l.cloudfront.net/697a07882750ca11cca5ba96_1769605172731_c2cc6aba.png', sort_order: 3 },
        { name: 'Maya Putri', position_id: 'Direktur Komersial', position_en: 'Commercial Director', bio_id: 'Pengalaman luas dalam pengembangan bisnis dan kemitraan.', bio_en: 'Extensive experience in business development and partnerships.', image_url: 'https://d64gsuwffb70l.cloudfront.net/697a07882750ca11cca5ba96_1769605192539_f9f7ef16.jpg', sort_order: 4 },
        { name: 'Hendra Kusuma', position_id: 'Direktur IT', position_en: 'IT Director', bio_id: 'Ahli transformasi digital dan sistem informasi enterprise.', bio_en: 'Digital transformation and enterprise information systems expert.', image_url: 'https://d64gsuwffb70l.cloudfront.net/697a07882750ca11cca5ba96_1769605168697_1b64f642.png', sort_order: 5 },
        { name: 'Dewi Lestari', position_id: 'Direktur SDM', position_en: 'HR Director', bio_id: 'Spesialis pengembangan organisasi dan talent management.', bio_en: 'Organization development and talent management specialist.', image_url: 'https://d64gsuwffb70l.cloudfront.net/697a07882750ca11cca5ba96_1769605194869_8d98ee9f.png', sort_order: 6 },
        { name: 'Rudi Hartono', position_id: 'Komisaris Utama', position_en: 'President Commissioner', bio_id: 'Pengusaha senior dengan pengalaman di berbagai industri.', bio_en: 'Senior entrepreneur with experience in various industries.', image_url: 'https://d64gsuwffb70l.cloudfront.net/697a07882750ca11cca5ba96_1769605172202_2825c200.png', sort_order: 7 },
        { name: 'Linda Susanto', position_id: 'Komisaris Independen', position_en: 'Independent Commissioner', bio_id: 'Profesional dengan latar belakang regulasi dan compliance.', bio_en: 'Professional with regulatory and compliance background.', image_url: 'https://d64gsuwffb70l.cloudfront.net/697a07882750ca11cca5ba96_1769605199011_3c0531d1.png', sort_order: 8 }
    ]);
    if (error) console.log('❌ management error:', error.message);
    else console.log('Management seeding complete!');
}

seedManagement();
