-- Drop existing table if exists
DROP TABLE IF EXISTS legal_documents CASCADE;

-- Create legal_documents table for Privacy Policy and Code of Conduct
CREATE TABLE legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('privacy_policy', 'code_of_conduct')),
    title_id TEXT,
    title_en TEXT,
    content_id TEXT,
    content_en TEXT,
    effective_date DATE,
    version TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create unique constraint to ensure only one active document per type
CREATE UNIQUE INDEX IF NOT EXISTS idx_legal_documents_type_active 
ON legal_documents (type) 
WHERE is_active = true;

-- Enable RLS
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;

-- Public can read active documents
DROP POLICY IF EXISTS "Enable select for all" ON legal_documents;
CREATE POLICY "Enable select for all" 
ON legal_documents 
FOR SELECT 
USING (true);

-- Admin can do everything (simplified for now)
DROP POLICY IF EXISTS "Enable all for all" ON legal_documents;
CREATE POLICY "Enable all for all" 
ON legal_documents 
FOR ALL 
USING (true);

-- Insert initial data with comprehensive content
INSERT INTO legal_documents (id, type, title_id, title_en, content_id, content_en, effective_date, version, is_active)
VALUES 
    (DEFAULT, 'privacy_policy', 'Kebijakan Privasi', 'Privacy Policy', 
     '<h2>1. Informasi yang Kami Kumpulkan</h2>
<p>PT. Penta Valent Tbk mengumpulkan berbagai jenis informasi untuk memberikan dan meningkatkan layanan kami kepada Anda:</p>
<ul>
<li><strong>Informasi Pribadi:</strong> Nama, alamat email, nomor telepon, dan informasi kontak lainnya yang Anda berikan saat mendaftar atau menghubungi kami.</li>
<li><strong>Informasi Penggunaan:</strong> Data tentang bagaimana Anda menggunakan website kami, termasuk alamat IP, jenis browser, halaman yang dikunjungi, dan waktu akses.</li>
<li><strong>Cookies:</strong> Kami menggunakan cookies untuk meningkatkan pengalaman pengguna dan menganalisis traffic website.</li>
</ul>

<h2>2. Penggunaan Informasi</h2>
<p>Informasi yang kami kumpulkan digunakan untuk:</p>
<ul>
<li>Menyediakan, mengoperasikan, dan memelihara layanan kami</li>
<li>Meningkatkan, personalisasi, dan memperluas layanan kami</li>
<li>Memahami dan menganalisis cara Anda menggunakan layanan kami</li>
<li>Mengembangkan produk, layanan, fitur, dan fungsi baru</li>
<li>Berkomunikasi dengan Anda untuk layanan pelanggan, pembaruan, dan informasi pemasaran</li>
<li>Mengirimkan email kepada Anda</li>
<li>Menemukan dan mencegah penipuan</li>
</ul>

<h2>3. Keamanan Data</h2>
<p>Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Namun, tidak ada metode transmisi melalui internet atau metode penyimpanan elektronik yang 100% aman.</p>

<h2>4. Berbagi Informasi</h2>
<p>Kami tidak menjual, memperdagangkan, atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami dapat membagikan informasi dengan:</p>
<ul>
<li>Penyedia layanan pihak ketiga yang membantu kami mengoperasikan website</li>
<li>Otoritas hukum jika diwajibkan oleh hukum</li>
<li>Partner bisnis dengan persetujuan Anda</li>
</ul>

<h2>5. Hak Anda</h2>
<p>Anda memiliki hak untuk:</p>
<ul>
<li>Mengakses informasi pribadi yang kami miliki tentang Anda</li>
<li>Meminta koreksi informasi yang tidak akurat</li>
<li>Meminta penghapusan informasi pribadi Anda</li>
<li>Menolak pemrosesan informasi pribadi Anda</li>
<li>Meminta pembatasan pemrosesan informasi pribadi Anda</li>
</ul>

<h2>6. Perubahan Kebijakan</h2>
<p>Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan dengan memposting Kebijakan Privasi baru di halaman ini dan memperbarui tanggal "Berlaku Efektif".</p>

<h2>7. Hubungi Kami</h2>
<p>Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:</p>
<p><strong>Email:</strong> privacy@pentavalent.com<br>
<strong>Telepon:</strong> +62 21 1234 5678<br>
<strong>Alamat:</strong> Jl. Sudirman No. 123, Jakarta 12345, Indonesia</p>', 
     
     '<h2>1. Information We Collect</h2>
<p>PT. Penta Valent Tbk collects various types of information to provide and improve our services to you:</p>
<ul>
<li><strong>Personal Information:</strong> Name, email address, phone number, and other contact information you provide when registering or contacting us.</li>
<li><strong>Usage Information:</strong> Data about how you use our website, including IP address, browser type, pages visited, and access times.</li>
<li><strong>Cookies:</strong> We use cookies to enhance user experience and analyze website traffic.</li>
</ul>

<h2>2. Use of Information</h2>
<p>The information we collect is used to:</p>
<ul>
<li>Provide, operate, and maintain our services</li>
<li>Improve, personalize, and expand our services</li>
<li>Understand and analyze how you use our services</li>
<li>Develop new products, services, features, and functionality</li>
<li>Communicate with you for customer service, updates, and marketing information</li>
<li>Send you emails</li>
<li>Find and prevent fraud</li>
</ul>

<h2>3. Data Security</h2>
<p>We implement appropriate security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure.</p>

<h2>4. Information Sharing</h2>
<p>We do not sell, trade, or rent your personal information to third parties. We may share information with:</p>
<ul>
<li>Third-party service providers who help us operate our website</li>
<li>Legal authorities if required by law</li>
<li>Business partners with your consent</li>
</ul>

<h2>5. Your Rights</h2>
<p>You have the right to:</p>
<ul>
<li>Access personal information we hold about you</li>
<li>Request correction of inaccurate information</li>
<li>Request deletion of your personal information</li>
<li>Object to processing of your personal information</li>
<li>Request restriction of processing your personal information</li>
</ul>

<h2>6. Policy Changes</h2>
<p>We may update this Privacy Policy from time to time. We will notify you of changes by posting the new Privacy Policy on this page and updating the "Effective Date".</p>

<h2>7. Contact Us</h2>
<p>If you have questions about this Privacy Policy, please contact us at:</p>
<p><strong>Email:</strong> privacy@pentavalent.com<br>
<strong>Phone:</strong> +62 21 1234 5678<br>
<strong>Address:</strong> Jl. Sudirman No. 123, Jakarta 12345, Indonesia</p>', 
     
     CURRENT_DATE, '1.0', true),
     
    (DEFAULT, 'code_of_conduct', 'Kode Etik Perusahaan', 'Code of Conduct', 
     '<h2>1. Pendahuluan</h2>
<p>Kode Etik ini menetapkan standar perilaku yang diharapkan dari semua karyawan, direktur, dan pihak yang terkait dengan PT. Penta Valent Tbk. Kami berkomitmen untuk menjalankan bisnis dengan integritas, transparansi, dan tanggung jawab.</p>

<h2>2. Prinsip Dasar</h2>
<h3>2.1 Integritas dan Kejujuran</h3>
<p>Semua karyawan harus bertindak dengan integritas dan kejujuran dalam semua aspek pekerjaan mereka. Kami tidak mentolerir penipuan, korupsi, atau perilaku tidak etis lainnya.</p>

<h3>2.2 Kepatuhan Hukum</h3>
<p>Kami berkomitmen untuk mematuhi semua hukum dan peraturan yang berlaku di wilayah operasi kami. Karyawan harus memahami dan mematuhi semua peraturan yang relevan dengan pekerjaan mereka.</p>

<h3>2.3 Konflik Kepentingan</h3>
<p>Karyawan harus menghindari situasi di mana kepentingan pribadi mereka dapat bertentangan dengan kepentingan perusahaan. Setiap potensi konflik kepentingan harus segera dilaporkan kepada manajemen.</p>

<h2>3. Lingkungan Kerja</h2>
<h3>3.1 Kesetaraan dan Keberagaman</h3>
<p>Kami menghargai keberagaman dan berkomitmen untuk menciptakan lingkungan kerja yang inklusif. Diskriminasi berdasarkan ras, jenis kelamin, agama, usia, atau karakteristik lainnya tidak akan ditolerir.</p>

<h3>3.2 Pelecehan dan Intimidasi</h3>
<p>Semua bentuk pelecehan, intimidasi, atau perilaku yang menciptakan lingkungan kerja yang tidak nyaman dilarang keras.</p>

<h3>3.3 Kesehatan dan Keselamatan</h3>
<p>Kami berkomitmen untuk menyediakan lingkungan kerja yang aman dan sehat. Semua karyawan harus mematuhi prosedur keselamatan dan melaporkan kondisi yang tidak aman.</p>

<h2>4. Hubungan dengan Pemangku Kepentingan</h2>
<h3>4.1 Pelanggan</h3>
<p>Kami berkomitmen untuk memberikan produk dan layanan berkualitas tinggi kepada pelanggan kami dengan integritas dan profesionalisme.</p>

<h3>4.2 Pemasok dan Mitra Bisnis</h3>
<p>Kami menjalin hubungan yang adil dan etis dengan pemasok dan mitra bisnis kami, berdasarkan saling menghormati dan kepercayaan.</p>

<h3>4.3 Komunitas dan Lingkungan</h3>
<p>Kami berkomitmen untuk menjadi warga korporat yang bertanggung jawab, berkontribusi positif kepada komunitas, dan melindungi lingkungan.</p>

<h2>5. Kerahasiaan dan Informasi</h2>
<p>Karyawan harus menjaga kerahasiaan informasi perusahaan dan pelanggan. Pengungkapan informasi rahasia tanpa otorisasi adalah pelanggaran serius terhadap Kode Etik ini.</p>

<h2>6. Pelaporan Pelanggaran</h2>
<p>Karyawan didorong untuk melaporkan setiap pelanggaran terhadap Kode Etik ini. Perusahaan menyediakan mekanisme pelaporan yang aman dan rahasia, dan melindungi pelapor dari pembalasan.</p>

<h2>7. Konsekuensi</h2>
<p>Pelanggaran terhadap Kode Etik ini dapat mengakibatkan tindakan disipliner, termasuk pemutusan hubungan kerja, sesuai dengan kebijakan perusahaan dan hukum yang berlaku.</p>

<h2>8. Komitmen Berkelanjutan</h2>
<p>Kode Etik ini adalah dokumen hidup yang akan ditinjau dan diperbarui secara berkala untuk memastikan relevansi dan efektivitasnya.</p>', 
     
     '<h2>1. Introduction</h2>
<p>This Code of Conduct establishes the standards of behavior expected from all employees, directors, and parties associated with PT. Penta Valent Tbk. We are committed to conducting business with integrity, transparency, and responsibility.</p>

<h2>2. Fundamental Principles</h2>
<h3>2.1 Integrity and Honesty</h3>
<p>All employees must act with integrity and honesty in all aspects of their work. We do not tolerate fraud, corruption, or other unethical behavior.</p>

<h3>2.2 Legal Compliance</h3>
<p>We are committed to complying with all applicable laws and regulations in our areas of operation. Employees must understand and comply with all regulations relevant to their work.</p>

<h3>2.3 Conflict of Interest</h3>
<p>Employees must avoid situations where their personal interests may conflict with the company''s interests. Any potential conflicts of interest must be immediately reported to management.</p>

<h2>3. Work Environment</h2>
<h3>3.1 Equality and Diversity</h3>
<p>We value diversity and are committed to creating an inclusive work environment. Discrimination based on race, gender, religion, age, or other characteristics will not be tolerated.</p>

<h3>3.2 Harassment and Intimidation</h3>
<p>All forms of harassment, intimidation, or behavior that creates an uncomfortable work environment are strictly prohibited.</p>

<h3>3.3 Health and Safety</h3>
<p>We are committed to providing a safe and healthy work environment. All employees must comply with safety procedures and report unsafe conditions.</p>

<h2>4. Stakeholder Relations</h2>
<h3>4.1 Customers</h3>
<p>We are committed to providing high-quality products and services to our customers with integrity and professionalism.</p>

<h3>4.2 Suppliers and Business Partners</h3>
<p>We establish fair and ethical relationships with our suppliers and business partners, based on mutual respect and trust.</p>

<h3>4.3 Community and Environment</h3>
<p>We are committed to being responsible corporate citizens, contributing positively to the community, and protecting the environment.</p>

<h2>5. Confidentiality and Information</h2>
<p>Employees must maintain the confidentiality of company and customer information. Unauthorized disclosure of confidential information is a serious violation of this Code of Conduct.</p>

<h2>6. Reporting Violations</h2>
<p>Employees are encouraged to report any violations of this Code of Conduct. The company provides a safe and confidential reporting mechanism and protects whistleblowers from retaliation.</p>

<h2>7. Consequences</h2>
<p>Violations of this Code of Conduct may result in disciplinary action, including termination of employment, in accordance with company policy and applicable law.</p>

<h2>8. Ongoing Commitment</h2>
<p>This Code of Conduct is a living document that will be reviewed and updated periodically to ensure its relevance and effectiveness.</p>', 
     
     CURRENT_DATE, '1.0', true)
ON CONFLICT DO NOTHING;

-- Verify
SELECT id, type, title_en, version, is_active, created_at 
FROM legal_documents 
ORDER BY type;
