import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedComplete() {
    console.log('🚀 Starting Complete Seeding v10 - All 10 Points...\n');

    const clearTable = async (table) => {
        console.log(`Clearing ${table}...`);
        await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    };

    const insertData = async (table, data) => {
        console.log(`Seeding ${table}...`);
        const { error } = await supabase.from(table).insert(data);
        if (error) {
            console.error(`❌ Error seeding ${table}:`, error.message);
            return false;
        }
        console.log(`✅ ${table} seeded (${data.length} rows).`);
        return true;
    };

    console.log('--- Phase 1: Cleaning ---');
    const tables = ['corporate_values', 'company_timeline', 'management', 'business_images', 'business_features', 'business_stats', 'business_lines', 'partners', 'careers', 'investor_documents', 'news'];
    for (const table of tables) await clearTable(table);

    console.log('\n--- Phase 2: Seeding All Data ---\n');

    // 1. The Pentavalent Philosophy (Corporate Values)
    console.log('📌 Point 1: The Pentavalent Philosophy');
    await insertData('corporate_values', [
        { title_id: 'Integritas', title_en: 'Integrity', description_id: 'Berkomitmen pada kejujuran dan transparansi dalam setiap aspek bisnis.', description_en: 'Committed to honesty and transparency in every aspect of business.', icon_name: 'shield', sort_order: 1, is_active: true },
        { title_id: 'Inovasi', title_en: 'Innovation', description_id: 'Terus berinovasi untuk memberikan solusi distribusi terbaik.', description_en: 'Continuously innovating to provide the best distribution solutions.', icon_name: 'zap', sort_order: 2, is_active: true },
        { title_id: 'Kolaborasi', title_en: 'Collaboration', description_id: 'Membangun kemitraan yang kuat dengan semua stakeholder.', description_en: 'Building strong partnerships with all stakeholders.', icon_name: 'users', sort_order: 3, is_active: true },
        { title_id: 'Keunggulan', title_en: 'Excellence', description_id: 'Mengutamakan kualitas dan standar tertinggi dalam layanan.', description_en: 'Prioritizing quality and the highest standards in service.', icon_name: 'award', sort_order: 4, is_active: true }
    ]);

    // 2. Decades of Excellence (Company Timeline)
    console.log('📌 Point 2: Decades of Excellence');
    await insertData('company_timeline', [
        { year: '1968', title_id: 'Pendirian Perusahaan', title_en: 'Company Establishment', description_id: 'PT Penta Valent didirikan sebagai distributor farmasi lokal di Jakarta.', description_en: 'PT Penta Valent was established as a local pharmaceutical distributor in Jakarta.', sort_order: 1, is_active: true },
        { year: '1985', title_id: 'Ekspansi Nasional', title_en: 'National Expansion', description_id: 'Membuka cabang di Surabaya, Medan, dan Makassar untuk jangkauan nasional.', description_en: 'Opened branches in Surabaya, Medan, and Makassar for national reach.', sort_order: 2, is_active: true },
        { year: '2000', title_id: 'Sertifikasi CDOB', title_en: 'CDOB Certification', description_id: 'Memperoleh sertifikasi CDOB sebagai standar distribusi farmasi.', description_en: 'Obtained CDOB certification as pharmaceutical distribution standard.', sort_order: 3, is_active: true },
        { year: '2015', title_id: 'Transformasi Digital', title_en: 'Digital Transformation', description_id: 'Implementasi sistem ERP dan warehouse management berbasis AI.', description_en: 'Implementation of AI-based ERP and warehouse management systems.', sort_order: 4, is_active: true },
        { year: '2023', title_id: 'IPO di Bursa Efek Indonesia', title_en: 'IPO on Indonesia Stock Exchange', description_id: 'Resmi melantai di BEI dengan kode saham PENT.', description_en: 'Officially listed on IDX with stock code PENT.', sort_order: 5, is_active: true }
    ]);

    // 3. Visionary Governance (Management - 8 people)
    console.log('📌 Point 3: Visionary Governance');
    await insertData('management', [
        { name: 'Afriandi Suherman', position_id: 'Direktur Utama', position_en: 'President Director', bio_id: 'Memimpin visi strategis perusahaan dengan pengalaman 25+ tahun di industri farmasi.', bio_en: 'Leading the strategic vision with 25+ years of experience in the pharmaceutical industry.', image_url: '/mgmt-director.png', sort_order: 1, is_active: true },
        { name: 'Sartono', position_id: 'Direktur Operasional', position_en: 'Operations Director', bio_id: 'Mengoptimalkan efisiensi rantai pasok nasional dengan teknologi terkini.', bio_en: 'Optimizing national supply chain efficiency with cutting-edge technology.', image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', sort_order: 2, is_active: true },
        { name: 'Linawati', position_id: 'Direktur Keuangan', position_en: 'Finance Director', bio_id: 'Mengelola strategi finansial perusahaan publik dengan transparansi penuh.', bio_en: 'Managing public company financial strategy with full transparency.', image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', sort_order: 3, is_active: true },
        { name: 'Herman Kusuma', position_id: 'Komisaris Utama', position_en: 'President Commissioner', bio_id: 'Mengawasi tata kelola perusahaan dan kepatuhan regulasi.', bio_en: 'Overseeing corporate governance and regulatory compliance.', image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400', sort_order: 4, is_active: true },
        { name: 'Dewi Lestari', position_id: 'Direktur Komersial', position_en: 'Commercial Director', bio_id: 'Mengatur strategi pemasaran dan kemitraan global.', bio_en: 'Managing marketing strategy and global partnerships.', image_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400', sort_order: 5, is_active: true },
        { name: 'Ahmad Fauzi', position_id: 'Direktur Teknologi', position_en: 'Technology Director', bio_id: 'Memimpin inovasi sistem distribusi digital dan otomasi.', bio_en: 'Leading digital distribution system innovation and automation.', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', sort_order: 6, is_active: true },
        { name: 'Sarah Johnson', position_id: 'Komisaris Independen', position_en: 'Independent Commissioner', bio_id: 'Pakar hukum dan tata kelola internasional dengan pengalaman global.', bio_en: 'International law and governance expert with global experience.', image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', sort_order: 7, is_active: true },
        { name: 'Bambang Wijaya', position_id: 'Direktur Logistik', position_en: 'Logistics Director', bio_id: 'Mengoptimasi jaringan distribusi nasional dengan 38 titik strategis.', bio_en: 'Optimizing national distribution network with 38 strategic points.', image_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=400', sort_order: 8, is_active: true }
    ]);

    // 4, 5, 6. Business Lines with 5 Images Each (Alkes, Farmasi, Konsumen)
    console.log('📌 Points 4-6: Business Lines with Detailed Images');

    const { data: bLines } = await supabase.from('business_lines').insert([
        {
            slug: 'distribusi-alkes',
            title_id: 'Distribusi Alat Kesehatan',
            title_en: 'Medical Equipment Distribution',
            description_id: 'Menyediakan alat kesehatan berkualitas tinggi untuk rumah sakit, klinik, dan laboratorium di seluruh Indonesia dengan standar internasional.',
            description_en: 'Providing high-quality medical equipment for hospitals, clinics, and laboratories across Indonesia with international standards.',
            image_url: '/hero-automation.jpg',
            sort_order: 1,
            is_active: true
        },
        {
            slug: 'distribusi-farmasi',
            title_id: 'Distribusi Farmasi',
            title_en: 'Pharmaceutical Distribution',
            description_id: 'Mendistribusikan obat-obatan resep dan OTC dengan sistem cold chain management untuk menjaga kualitas produk farmasi.',
            description_en: 'Distributing prescription and OTC medicines with cold chain management systems to maintain pharmaceutical product quality.',
            image_url: '/hero-lab.jpg',
            sort_order: 2,
            is_active: true
        },
        {
            slug: 'produk-konsumen',
            title_id: 'Produk Konsumen & Kecantikan',
            title_en: 'Consumer & Beauty Products',
            description_id: 'Menyalurkan produk kesehatan konsumen, suplemen, dan produk kecantikan premium ke seluruh retail modern dan tradisional.',
            description_en: 'Distributing consumer health products, supplements, and premium beauty products to all modern and traditional retail.',
            image_url: '/hero-automation.jpg',
            sort_order: 3,
            is_active: true
        }
    ]).select();

    if (bLines) {
        for (const bLine of bLines) {
            // Features for each business line
            await insertData('business_features', [
                { business_line_id: bLine.id, feature_id: 'Sertifikasi CDOB Nasional', feature_en: 'National CDOB Certification', sort_order: 1 },
                { business_line_id: bLine.id, feature_id: 'Sistem ERP Terintegrasi', feature_en: 'Integrated ERP System', sort_order: 2 },
                { business_line_id: bLine.id, feature_id: 'Cold Chain Management', feature_en: 'Cold Chain Management', sort_order: 3 },
                { business_line_id: bLine.id, feature_id: 'Real-time Tracking', feature_en: 'Real-time Tracking', sort_order: 4 }
            ]);

            // Stats for each business line
            await insertData('business_stats', [
                { business_line_id: bLine.id, label_id: 'Produk Aktif', label_en: 'Active Products', value_id: '5000+', value_en: '5000+', sort_order: 1 },
                { business_line_id: bLine.id, label_id: 'Outlet Terlayani', label_en: 'Outlets Served', value_id: '12000+', value_en: '12000+', sort_order: 2 },
                { business_line_id: bLine.id, label_id: 'Prinsipal Partner', label_en: 'Principal Partners', value_id: '150+', value_en: '150+', sort_order: 3 }
            ]);

            // 5 Images for each business line
            const images = bLine.slug === 'distribusi-alkes' ? [
                '/hero-automation.jpg',
                'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1587370560213-bbdb3a970183?auto=format&fit=crop&q=80&w=1200'
            ] : bLine.slug === 'distribusi-farmasi' ? [
                '/hero-lab.jpg',
                'https://images.unsplash.com/photo-1587854680352-936b22b91030?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=1200'
            ] : [
                '/hero-automation.jpg',
                'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1583944601138-0c3098f62f02?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1610492421943-2440013f9f76?auto=format&fit=crop&q=80&w=1200'
            ];

            await insertData('business_images', images.map((url, i) => ({
                business_line_id: bLine.id,
                image_url: url,
                sort_order: i + 1
            })));
        }
    }

    // 7. Global Network, Local Authority (Partners)
    console.log('📌 Point 7: Global Network, Local Authority');
    await insertData('partners', [
        { name: 'Pfizer Indonesia', partner_type: 'international', description_id: 'Perusahaan farmasi global terkemuka yang mengembangkan obat-obatan inovatif untuk berbagai penyakit.', description_en: 'Leading global pharmaceutical company developing innovative medicines for various diseases.', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400', website: 'https://www.pfizer.com', sort_order: 1, is_active: true },
        { name: 'Johnson & Johnson', partner_type: 'international', description_id: 'Konglomerat multinasional yang bergerak di bidang farmasi, alat kesehatan, dan produk konsumen.', description_en: 'Multinational conglomerate in pharmaceuticals, medical devices, and consumer products.', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400', website: 'https://www.jnj.com', sort_order: 2, is_active: true },
        { name: 'Siemens Healthineers', partner_type: 'international', description_id: 'Penyedia teknologi medis terdepan untuk diagnostik dan terapi.', description_en: 'Leading medical technology provider for diagnostics and therapy.', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400', website: 'https://www.siemens-healthineers.com', sort_order: 3, is_active: true },
        { name: 'PT Kalbe Farma Tbk', partner_type: 'principal', description_id: 'Perusahaan farmasi terbesar di Indonesia dengan portofolio produk yang lengkap.', description_en: 'Indonesia\'s largest pharmaceutical company with comprehensive product portfolio.', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400', website: 'https://www.kalbe.co.id', sort_order: 4, is_active: true },
        { name: 'PT Kimia Farma Tbk', partner_type: 'principal', description_id: 'BUMN farmasi terpercaya dengan jaringan apotek terluas di Indonesia.', description_en: 'Trusted state-owned pharmaceutical company with Indonesia\'s widest pharmacy network.', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400', website: 'https://www.kimiafarma.co.id', sort_order: 5, is_active: true },
        { name: 'PT Sanbe Farma', partner_type: 'principal', description_id: 'Produsen farmasi nasional berkualitas dengan standar internasional.', description_en: 'Quality national pharmaceutical manufacturer with international standards.', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400', website: 'https://www.sanbe.co.id', sort_order: 6, is_active: true },
        { name: 'Novartis Indonesia', partner_type: 'international', description_id: 'Perusahaan farmasi global yang fokus pada inovasi kesehatan.', description_en: 'Global pharmaceutical company focused on healthcare innovation.', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400', website: 'https://www.novartis.com', sort_order: 7, is_active: true },
        { name: 'Roche Indonesia', partner_type: 'international', description_id: 'Pemimpin global dalam diagnostik dan farmasi.', description_en: 'Global leader in diagnostics and pharmaceuticals.', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400', website: 'https://www.roche.com', sort_order: 8, is_active: true },
        { name: 'PT Dexa Medica', partner_type: 'principal', description_id: 'Perusahaan farmasi nasional dengan produk berkualitas tinggi.', description_en: 'National pharmaceutical company with high-quality products.', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400', website: 'https://www.dexa-medica.com', sort_order: 9, is_active: true },
        { name: 'PT Tempo Scan Pacific Tbk', partner_type: 'principal', description_id: 'Produsen farmasi dan consumer health terkemuka di Indonesia.', description_en: 'Leading pharmaceutical and consumer health manufacturer in Indonesia.', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400', website: 'https://www.tempo.co.id', sort_order: 10, is_active: true },
        { name: 'AstraZeneca Indonesia', partner_type: 'international', description_id: 'Perusahaan biofarmasi global dengan fokus pada inovasi.', description_en: 'Global biopharmaceutical company focused on innovation.', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400', website: 'https://www.astrazeneca.com', sort_order: 11, is_active: true },
        { name: 'Merck Indonesia', partner_type: 'international', description_id: 'Perusahaan sains dan teknologi terkemuka di bidang kesehatan.', description_en: 'Leading science and technology company in healthcare.', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=400', website: 'https://www.merck.com', sort_order: 12, is_active: true }
    ]);

    // 8. News with Custom Images (8 Articles)
    console.log('📌 Point 8: News Articles with Custom Images');
    await insertData('news', [
        { title_id: 'PENT Sukses IPO di Bursa Efek Indonesia', title_en: 'PENT Successfully IPO on Indonesia Stock Exchange', slug: 'pent-ipo-success', excerpt_id: 'PT Penta Valent Tbk resmi melantai di BEI dengan kode saham PENT.', excerpt_en: 'PT Penta Valent Tbk officially listed on IDX with stock code PENT.', content_id: 'Detail lengkap...', content_en: 'Full details...', featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', category: 'corporate', is_published: true, published_at: new Date().toISOString() },
        { title_id: 'Ekspansi Jaringan ke Kalimantan Timur', title_en: 'Network Expansion to East Kalimantan', slug: 'expansion-kaltim', excerpt_id: 'Pembukaan depo baru di Samarinda untuk jangkauan lebih luas.', excerpt_en: 'Opening new depo in Samarinda for wider reach.', content_id: 'Detail lengkap...', content_en: 'Full details...', featured_image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800', category: 'expansion', is_published: true, published_at: new Date().toISOString() },
        { title_id: 'Implementasi AI dalam Warehouse Management', title_en: 'AI Implementation in Warehouse Management', slug: 'ai-warehouse', excerpt_id: 'Otomatisasi gudang dengan kecerdasan buatan untuk efisiensi maksimal.', excerpt_en: 'Warehouse automation with AI for maximum efficiency.', content_id: 'Detail lengkap...', content_en: 'Full details...', featured_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', category: 'technology', is_published: true, published_at: new Date().toISOString() },
        { title_id: 'Sertifikasi Cold Chain Management ISO', title_en: 'ISO Cold Chain Management Certification', slug: 'iso-cold-chain', excerpt_id: 'Memperoleh sertifikasi internasional untuk standar distribusi farmasi.', excerpt_en: 'Obtained international certification for pharmaceutical distribution standards.', content_id: 'Detail lengkap...', content_en: 'Full details...', featured_image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800', category: 'certification', is_published: true, published_at: new Date().toISOString() },
        { title_id: 'Penghargaan Best Distributor 2025', title_en: 'Best Distributor Award 2025', slug: 'award-2025', excerpt_id: 'Meraih penghargaan distributor farmasi terbaik tingkat nasional.', excerpt_en: 'Awarded best pharmaceutical distributor at national level.', content_id: 'Detail lengkap...', content_en: 'Full details...', featured_image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800', category: 'award', is_published: true, published_at: new Date().toISOString() },
        { title_id: 'Kemitraan Strategis dengan Pfizer', title_en: 'Strategic Partnership with Pfizer', slug: 'partnership-pfizer', excerpt_id: 'Menjalin kerjasama distribusi eksklusif dengan Pfizer Indonesia.', excerpt_en: 'Establishing exclusive distribution partnership with Pfizer Indonesia.', content_id: 'Detail lengkap...', content_en: 'Full details...', featured_image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800', category: 'partnership', is_published: true, published_at: new Date().toISOString() },
        { title_id: 'Komitmen ESG dan Keberlanjutan', title_en: 'ESG and Sustainability Commitment', slug: 'esg-commitment', excerpt_id: 'Implementasi program keberlanjutan lingkungan dan sosial.', excerpt_en: 'Implementation of environmental and social sustainability programs.', content_id: 'Detail lengkap...', content_en: 'Full details...', featured_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800', category: 'sustainability', is_published: true, published_at: new Date().toISOString() },
        { title_id: 'Dividen Interim 2025 untuk Pemegang Saham', title_en: 'Interim Dividend 2025 for Shareholders', slug: 'dividend-2025', excerpt_id: 'Pembagian dividen interim sebagai apresiasi kepada investor.', excerpt_en: 'Interim dividend distribution as appreciation to investors.', content_id: 'Detail lengkap...', content_en: 'Full details...', featured_image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800', category: 'investor', is_published: true, published_at: new Date().toISOString() }
    ]);

    // 9. Open Positions (Careers)
    console.log('📌 Point 9: Open Positions');
    await insertData('careers', [
        { title: 'Regional Sales Manager', department: 'Commercial', location: 'Jakarta', employment_type: 'full_time', description_id: 'Memimpin tim penjualan regional untuk mencapai target distribusi farmasi di wilayah Jakarta dan sekitarnya.', description_en: 'Leading regional sales team to achieve pharmaceutical distribution targets in Jakarta and surrounding areas.', requirements_id: '- Minimal S1 di bidang terkait\n- Pengalaman 5+ tahun di industri farmasi\n- Kemampuan leadership yang kuat', requirements_en: '- Minimum Bachelor degree in related field\n- 5+ years experience in pharmaceutical industry\n- Strong leadership skills', is_active: true },
        { title: 'Warehouse Supervisor', department: 'Operations', location: 'Surabaya', employment_type: 'full_time', description_id: 'Mengawasi operasional gudang dan memastikan standar CDOB terpenuhi dengan baik.', description_en: 'Supervising warehouse operations and ensuring CDOB standards are well maintained.', requirements_id: '- Minimal D3 Logistik/Farmasi\n- Pengalaman 3+ tahun di warehouse farmasi\n- Memahami regulasi CDOB', requirements_en: '- Minimum Diploma in Logistics/Pharmacy\n- 3+ years experience in pharmaceutical warehouse\n- Understanding of CDOB regulations', is_active: true },
        { title: 'IT System Analyst', department: 'Technology', location: 'Jakarta', employment_type: 'full_time', description_id: 'Menganalisis dan mengembangkan sistem ERP untuk mendukung operasional distribusi.', description_en: 'Analyzing and developing ERP systems to support distribution operations.', requirements_id: '- S1 Teknik Informatika/Sistem Informasi\n- Pengalaman dengan SAP/Oracle ERP\n- Kemampuan problem solving yang baik', requirements_en: '- Bachelor in Computer Science/Information Systems\n- Experience with SAP/Oracle ERP\n- Good problem solving skills', is_active: true },
        { title: 'Quality Assurance Specialist', department: 'Quality', location: 'Medan', employment_type: 'full_time', description_id: 'Memastikan kualitas produk farmasi sesuai standar regulasi nasional dan internasional.', description_en: 'Ensuring pharmaceutical product quality meets national and international regulatory standards.', requirements_id: '- S1 Farmasi/Kimia\n- Memiliki sertifikat Apoteker (lebih disukai)\n- Detail oriented dan teliti', requirements_en: '- Bachelor in Pharmacy/Chemistry\n- Pharmacist certificate (preferred)\n- Detail oriented and meticulous', is_active: true },
        { title: 'Finance Analyst', department: 'Finance', location: 'Jakarta', employment_type: 'full_time', description_id: 'Melakukan analisis keuangan dan mendukung pelaporan keuangan perusahaan publik.', description_en: 'Conducting financial analysis and supporting public company financial reporting.', requirements_id: '- S1 Akuntansi/Keuangan\n- Pengalaman 2+ tahun di perusahaan publik\n- Menguasai Excel dan sistem akuntansi', requirements_en: '- Bachelor in Accounting/Finance\n- 2+ years experience in public company\n- Proficient in Excel and accounting systems', is_active: true }
    ]);

    // 10. Good Corporate Governance (Investor Documents)
    console.log('📌 Point 10: Good Corporate Governance');
    await insertData('investor_documents', [
        { title_id: 'Laporan Tahunan 2024', title_en: 'Annual Report 2024', document_type: 'annual_report', year: 2024, file_url: 'https://example.com/annual-report-2024.pdf', is_published: true, published_at: new Date().toISOString() },
        { title_id: 'Laporan Keuangan Q4 2024', title_en: 'Financial Report Q4 2024', document_type: 'quarterly_report', year: 2024, quarter: 'Q4', file_url: 'https://example.com/q4-2024.pdf', is_published: true, published_at: new Date().toISOString() },
        { title_id: 'Pedoman GCG 2025', title_en: 'GCG Guidelines 2025', document_type: 'gcg', year: 2025, file_url: 'https://example.com/gcg-2025.pdf', is_published: true, published_at: new Date().toISOString() },
        { title_id: 'Prospektus IPO PENT', title_en: 'PENT IPO Prospectus', document_type: 'prospectus', year: 2023, file_url: 'https://example.com/prospectus-pent.pdf', is_published: true, published_at: new Date().toISOString() },
        { title_id: 'Kode Etik Perusahaan', title_en: 'Corporate Code of Conduct', document_type: 'gcg', year: 2025, file_url: 'https://example.com/code-of-conduct.pdf', is_published: true, published_at: new Date().toISOString() }
    ]);

    console.log('\n✅ Complete Seeding v10 Finished Successfully!');
    console.log('📊 Summary:');
    console.log('   - Corporate Values: 4 items');
    console.log('   - Company Timeline: 5 milestones');
    console.log('   - Management: 8 people');
    console.log('   - Business Lines: 3 lines with 5 images each');
    console.log('   - Partners: 12 partners (7 international, 5 national)');
    console.log('   - News: 8 articles');
    console.log('   - Careers: 5 positions');
    console.log('   - Investor Documents: 5 documents');
}

seedComplete();
