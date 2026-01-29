import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkjfepimzoubwthqldiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedGCG() {
    console.log('🏛️ Seeding Good Corporate Governance Data...\n');

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

    const clearTable = async (table) => {
        console.log(`Clearing ${table}...`);
        await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    };

    // Clear existing data
    console.log('--- Clearing GCG Tables ---');
    const tables = ['gcg_principles', 'board_of_commissioners', 'board_of_directors', 'gcg_committees', 'gcg_policies'];
    for (const table of tables) {
        await clearTable(table);
    }

    console.log('\n--- Seeding GCG Data ---\n');

    // 1. GCG Principles
    console.log('📌 1. GCG Principles');
    await insertData('gcg_principles', [
        {
            title_id: 'Transparansi',
            title_en: 'Transparency',
            description_id: 'Keterbukaan dalam mengemukakan informasi yang material dan relevan serta keterbukaan dalam melaksanakan proses pengambilan keputusan.',
            description_en: 'Openness in disclosing material and relevant information and openness in implementing the decision-making process.',
            icon_name: 'eye',
            sort_order: 1,
            is_active: true
        },
        {
            title_id: 'Akuntabilitas',
            title_en: 'Accountability',
            description_id: 'Kejelasan fungsi, pelaksanaan dan pertanggungjawaban organ perusahaan sehingga pengelolaan perusahaan terlaksana secara efektif.',
            description_en: 'Clarity of function, implementation and accountability of company organs so that company management is carried out effectively.',
            icon_name: 'clipboard-check',
            sort_order: 2,
            is_active: true
        },
        {
            title_id: 'Responsibilitas',
            title_en: 'Responsibility',
            description_id: 'Kesesuaian pengelolaan perusahaan terhadap peraturan perundang-undangan dan prinsip korporasi yang sehat.',
            description_en: 'Compliance of company management with laws and regulations and sound corporate principles.',
            icon_name: 'shield-check',
            sort_order: 3,
            is_active: true
        },
        {
            title_id: 'Independensi',
            title_en: 'Independence',
            description_id: 'Pengelolaan perusahaan secara profesional tanpa benturan kepentingan dan pengaruh/tekanan dari pihak manapun.',
            description_en: 'Professional company management without conflicts of interest and influence/pressure from any party.',
            icon_name: 'scale',
            sort_order: 4,
            is_active: true
        },
        {
            title_id: 'Kewajaran',
            title_en: 'Fairness',
            description_id: 'Keadilan dan kesetaraan dalam memenuhi hak-hak stakeholder yang timbul berdasarkan perjanjian dan peraturan perundang-undangan.',
            description_en: 'Justice and equality in fulfilling stakeholder rights arising from agreements and laws and regulations.',
            icon_name: 'users',
            sort_order: 5,
            is_active: true
        }
    ]);

    // 2. Board of Commissioners
    console.log('📌 2. Board of Commissioners');
    await insertData('board_of_commissioners', [
        {
            name: 'Dr. Herman Kusuma',
            position_id: 'Komisaris Utama',
            position_en: 'President Commissioner',
            commissioner_type: 'independent',
            bio_id: 'Pakar tata kelola perusahaan dengan pengalaman 30+ tahun di industri farmasi dan kesehatan. Memiliki track record dalam mengawasi perusahaan publik.',
            bio_en: 'Corporate governance expert with 30+ years of experience in pharmaceutical and healthcare industry. Has track record in supervising public companies.',
            image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
            sort_order: 1,
            is_active: true
        },
        {
            name: 'Sarah Johnson, MBA',
            position_id: 'Komisaris Independen',
            position_en: 'Independent Commissioner',
            commissioner_type: 'independent',
            bio_id: 'Ahli hukum korporasi internasional dengan spesialisasi dalam compliance dan regulatory affairs di sektor farmasi.',
            bio_en: 'International corporate law expert specializing in compliance and regulatory affairs in pharmaceutical sector.',
            image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
            sort_order: 2,
            is_active: true
        },
        {
            name: 'Prof. Dr. Bambang Sutrisno',
            position_id: 'Komisaris Independen',
            position_en: 'Independent Commissioner',
            commissioner_type: 'independent',
            bio_id: 'Akademisi dan praktisi di bidang manajemen risiko dan audit internal dengan pengalaman di berbagai perusahaan publik.',
            bio_en: 'Academic and practitioner in risk management and internal audit with experience in various public companies.',
            image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
            sort_order: 3,
            is_active: true
        },
        {
            name: 'Ir. Suharto Wijaya',
            position_id: 'Komisaris',
            position_en: 'Commissioner',
            commissioner_type: 'non_independent',
            bio_id: 'Berpengalaman dalam pengembangan bisnis dan strategi perusahaan di industri distribusi farmasi selama 25 tahun.',
            bio_en: 'Experienced in business development and corporate strategy in pharmaceutical distribution industry for 25 years.',
            image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
            sort_order: 4,
            is_active: true
        }
    ]);

    // 3. Board of Directors
    console.log('📌 3. Board of Directors');
    await insertData('board_of_directors', [
        {
            name: 'Afriandi Suherman',
            position_id: 'Direktur Utama',
            position_en: 'President Director',
            bio_id: 'Memimpin visi strategis perusahaan dengan pengalaman 25+ tahun di industri farmasi. Fokus pada transformasi digital dan ekspansi nasional.',
            bio_en: 'Leading strategic vision with 25+ years of experience in pharmaceutical industry. Focus on digital transformation and national expansion.',
            image_url: '/mgmt-director.png',
            sort_order: 1,
            is_active: true
        },
        {
            name: 'Linawati, CPA',
            position_id: 'Direktur Keuangan',
            position_en: 'Finance Director',
            bio_id: 'Mengelola strategi finansial perusahaan publik dengan transparansi penuh. Berpengalaman dalam IPO dan investor relations.',
            bio_en: 'Managing public company financial strategy with full transparency. Experienced in IPO and investor relations.',
            image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
            sort_order: 2,
            is_active: true
        },
        {
            name: 'Sartono',
            position_id: 'Direktur Operasional',
            position_en: 'Operations Director',
            bio_id: 'Mengoptimalkan efisiensi rantai pasok nasional dengan teknologi terkini dan sistem manajemen gudang berbasis AI.',
            bio_en: 'Optimizing national supply chain efficiency with cutting-edge technology and AI-based warehouse management systems.',
            image_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=400',
            sort_order: 3,
            is_active: true
        },
        {
            name: 'Dewi Lestari, MBA',
            position_id: 'Direktur Komersial',
            position_en: 'Commercial Director',
            bio_id: 'Mengatur strategi pemasaran dan kemitraan global. Bertanggung jawab atas pengembangan bisnis dan hubungan dengan principal.',
            bio_en: 'Managing marketing strategy and global partnerships. Responsible for business development and principal relationships.',
            image_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
            sort_order: 4,
            is_active: true
        },
        {
            name: 'Ahmad Fauzi, M.Sc',
            position_id: 'Direktur Teknologi',
            position_en: 'Technology Director',
            bio_id: 'Memimpin inovasi sistem distribusi digital dan otomasi. Implementasi ERP, WMS, dan sistem tracking real-time.',
            bio_en: 'Leading digital distribution system innovation and automation. Implementation of ERP, WMS, and real-time tracking systems.',
            image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
            sort_order: 5,
            is_active: true
        }
    ]);

    // 4. GCG Committees
    console.log('📌 4. GCG Committees');
    await insertData('gcg_committees', [
        {
            name_id: 'Komite Audit',
            name_en: 'Audit Committee',
            description_id: 'Membantu Dewan Komisaris dalam mengawasi proses pelaporan keuangan, sistem pengendalian internal, proses audit, dan kepatuhan terhadap peraturan.',
            description_en: 'Assists the Board of Commissioners in overseeing financial reporting process, internal control systems, audit process, and regulatory compliance.',
            chairman_name: 'Prof. Dr. Bambang Sutrisno',
            members: ['Prof. Dr. Bambang Sutrisno', 'Sarah Johnson, MBA', 'Ir. Suharto Wijaya'],
            sort_order: 1,
            is_active: true
        },
        {
            name_id: 'Komite Nominasi dan Remunerasi',
            name_en: 'Nomination and Remuneration Committee',
            description_id: 'Memberikan rekomendasi kepada Dewan Komisaris mengenai komposisi, kebijakan remunerasi, dan evaluasi kinerja Direksi.',
            description_en: 'Provides recommendations to the Board of Commissioners regarding composition, remuneration policy, and performance evaluation of Directors.',
            chairman_name: 'Dr. Herman Kusuma',
            members: ['Dr. Herman Kusuma', 'Sarah Johnson, MBA', 'Prof. Dr. Bambang Sutrisno'],
            sort_order: 2,
            is_active: true
        },
        {
            name_id: 'Komite Manajemen Risiko',
            name_en: 'Risk Management Committee',
            description_id: 'Mengidentifikasi, mengevaluasi, dan memantau implementasi manajemen risiko perusahaan secara menyeluruh.',
            description_en: 'Identifies, evaluates, and monitors comprehensive implementation of company risk management.',
            chairman_name: 'Sarah Johnson, MBA',
            members: ['Sarah Johnson, MBA', 'Prof. Dr. Bambang Sutrisno', 'Ir. Suharto Wijaya'],
            sort_order: 3,
            is_active: true
        },
        {
            name_id: 'Komite Tata Kelola Perusahaan',
            name_en: 'Corporate Governance Committee',
            description_id: 'Memastikan implementasi prinsip-prinsip GCG dan memberikan rekomendasi perbaikan tata kelola perusahaan.',
            description_en: 'Ensures implementation of GCG principles and provides recommendations for corporate governance improvement.',
            chairman_name: 'Dr. Herman Kusuma',
            members: ['Dr. Herman Kusuma', 'Sarah Johnson, MBA', 'Ir. Suharto Wijaya'],
            sort_order: 4,
            is_active: true
        }
    ]);

    // 5. GCG Policies
    console.log('📌 5. GCG Policies');
    await insertData('gcg_policies', [
        {
            title_id: 'Kode Etik Perusahaan',
            title_en: 'Corporate Code of Conduct',
            category: 'ethics',
            description_id: 'Pedoman perilaku dan etika bisnis yang harus dipatuhi oleh seluruh jajaran perusahaan dalam menjalankan aktivitas bisnis.',
            description_en: 'Guidelines for business conduct and ethics that must be followed by all company personnel in conducting business activities.',
            document_url: 'https://example.com/code-of-conduct.pdf',
            effective_date: '2025-01-01',
            is_active: true
        },
        {
            title_id: 'Kebijakan Anti Korupsi',
            title_en: 'Anti-Corruption Policy',
            category: 'compliance',
            description_id: 'Komitmen perusahaan untuk mencegah dan memberantas segala bentuk korupsi, suap, dan gratifikasi.',
            description_en: 'Company commitment to prevent and eradicate all forms of corruption, bribery, and gratuities.',
            document_url: 'https://example.com/anti-corruption.pdf',
            effective_date: '2025-01-01',
            is_active: true
        },
        {
            title_id: 'Kebijakan Whistleblowing System',
            title_en: 'Whistleblowing System Policy',
            category: 'compliance',
            description_id: 'Sistem pelaporan pelanggaran yang melindungi pelapor dan memastikan tindak lanjut yang tepat.',
            description_en: 'Violation reporting system that protects whistleblowers and ensures proper follow-up.',
            document_url: 'https://example.com/whistleblowing.pdf',
            effective_date: '2025-01-01',
            is_active: true
        },
        {
            title_id: 'Kebijakan Manajemen Risiko',
            title_en: 'Risk Management Policy',
            category: 'risk_management',
            description_id: 'Framework pengelolaan risiko perusahaan secara komprehensif dan terintegrasi.',
            description_en: 'Comprehensive and integrated corporate risk management framework.',
            document_url: 'https://example.com/risk-management.pdf',
            effective_date: '2025-01-01',
            is_active: true
        },
        {
            title_id: 'Kebijakan Transaksi Benturan Kepentingan',
            title_en: 'Conflict of Interest Transaction Policy',
            category: 'ethics',
            description_id: 'Pedoman untuk mengidentifikasi dan mengelola transaksi yang mengandung benturan kepentingan.',
            description_en: 'Guidelines for identifying and managing transactions containing conflicts of interest.',
            document_url: 'https://example.com/conflict-of-interest.pdf',
            effective_date: '2025-01-01',
            is_active: true
        },
        {
            title_id: 'Kebijakan Gratifikasi',
            title_en: 'Gratuity Policy',
            category: 'compliance',
            description_id: 'Aturan mengenai penerimaan dan pemberian hadiah, entertainment, dan fasilitas dalam konteks bisnis.',
            description_en: 'Rules regarding acceptance and giving of gifts, entertainment, and facilities in business context.',
            document_url: 'https://example.com/gratuity.pdf',
            effective_date: '2025-01-01',
            is_active: true
        },
        {
            title_id: 'Kebijakan Kerahasiaan Informasi',
            title_en: 'Information Confidentiality Policy',
            category: 'compliance',
            description_id: 'Perlindungan terhadap informasi rahasia perusahaan dan data pribadi stakeholder.',
            description_en: 'Protection of company confidential information and stakeholder personal data.',
            document_url: 'https://example.com/confidentiality.pdf',
            effective_date: '2025-01-01',
            is_active: true
        },
        {
            title_id: 'Pedoman Tata Kelola Perusahaan',
            title_en: 'Corporate Governance Guidelines',
            category: 'governance',
            description_id: 'Pedoman komprehensif mengenai struktur, tugas, dan tanggung jawab organ perusahaan.',
            description_en: 'Comprehensive guidelines on structure, duties, and responsibilities of company organs.',
            document_url: 'https://example.com/gcg-guidelines.pdf',
            effective_date: '2025-01-01',
            is_active: true
        }
    ]);

    console.log('\n✅ GCG Data Seeding Completed Successfully!');
    console.log('\n📊 Summary:');
    console.log('   - GCG Principles: 5 principles');
    console.log('   - Board of Commissioners: 4 members (3 independent)');
    console.log('   - Board of Directors: 5 members');
    console.log('   - GCG Committees: 4 committees');
    console.log('   - GCG Policies: 8 policies');
}

seedGCG();
