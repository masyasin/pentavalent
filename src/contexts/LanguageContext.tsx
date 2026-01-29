import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'id' | 'en';

interface Translations {
  [key: string]: {
    id: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  // Navigation
  'nav.home': { id: 'Beranda', en: 'Home' },
  'nav.about': { id: 'Tentang Kami', en: 'About Us' },
  'nav.business': { id: 'Lini Bisnis', en: 'Business Lines' },
  'nav.partners': { id: 'Mitra', en: 'Partners' },
  'nav.certification': { id: 'Sertifikasi', en: 'Certification' },
  'nav.network': { id: 'Jaringan', en: 'Network' },
  'nav.investor': { id: 'Hubungan Investor', en: 'Investor Relations' },
  'nav.news': { id: 'Berita & Media', en: 'News & Media' },
  'nav.career': { id: 'Karir', en: 'Career' },
  'nav.contact': { id: 'Kontak', en: 'Contact' },

  // Hero Section
  'hero.tagline': { id: 'Keunggulan Distribusi Kesehatan Sejak 1968', en: 'Healthcare Distribution Excellence Since 1968' },
  'hero.subtitle': { id: 'Distributor farmasi, alat kesehatan, dan produk consumer health terkemuka di Indonesia dengan jaringan nasional 34 cabang', en: 'Leading pharmaceutical, medical devices, and consumer health distributor in Indonesia with 34 branches nationwide' },
  'hero.cta1': { id: 'Jelajahi Layanan', en: 'Explore Services' },
  'hero.cta2': { id: 'Hubungi Kami', en: 'Contact Us' },

  // Stats
  'stats.years': { id: 'Tahun Pengalaman', en: 'Years of Experience' },
  'stats.branches': { id: 'Cabang Nasional', en: 'National Branches' },
  'stats.partners': { id: 'Mitra Principal', en: 'Principal Partners' },
  'stats.provinces': { id: 'Provinsi Terjangkau', en: 'Provinces Covered' },

  // About
  'about.tagline': { id: 'Profil Perusahaan', en: 'Corporate Profile' },
  'about.title.text': { id: 'Warisan Kepercayaan,', en: 'Legacy of Trust,' },
  'about.title.italic': { id: 'Masa Depan Kesehatan', en: 'Future of Healthcare' },
  'about.description': { id: 'Didirikan pada tahun 1968, PT Penta Valent Tbk telah berkembang menjadi kekuatan distribusi kesehatan nasional yang utama. Kami menjembatani kesenjangan antara produsen global dan masyarakat Indonesia dengan integritas dan keunggulan.', en: 'Founded in 1968, PT Penta Valent Tbk has evolved into a premier national healthcare distribution powerhouse. We bridge the gap between global manufacturers and the Indonesian people with integrity and excellence.' },
  'about.years.impact': { id: 'Tahun Berdampak', en: 'Years of Impact' },
  'about.public.listed': { id: 'Perusahaan Publik', en: 'Publicly Listed' },
  'about.vision.title': { id: 'Visi Kami', en: 'Our Vision' },
  'about.vision.text': { id: 'Menjadi perusahaan distribusi kesehatan terkemuka di Indonesia yang memberikan nilai tambah bagi seluruh pemangku kepentingan.', en: 'To become the leading healthcare distribution company in Indonesia that provides added value for all stakeholders.' },
  'about.mission.title': { id: 'Misi Kami', en: 'Our Mission' },
  'about.mission.text': { id: 'Menyediakan layanan distribusi yang handal, efisien, dan berkualitas tinggi untuk produk farmasi, alat kesehatan, dan consumer health di seluruh Indonesia.', en: 'To provide reliable, efficient, and high-quality distribution services for pharmaceutical, medical devices, and consumer health products throughout Indonesia.' },
  'about.values.tagline': { id: 'Prinsip Dasar', en: 'Foundational Principles' },
  'about.values.title': { id: 'Filosofi Penta Valent', en: 'The Penta Valent Philosophy' },
  'about.timeline.tagline': { id: 'Evolusi Strategis', en: 'Strategic Evolution' },
  'about.timeline.title': { id: 'Dekade Keunggulan', en: 'Decades of Excellence' },

  // Business Lines
  'business.tagline': { id: 'Ekosistem Strategis Kami', en: 'Our Strategic Ecosystem' },
  'business.title.text': { id: 'Mendorong Keunggulan', en: 'Driving Healthcare' },
  'business.title.italic': { id: 'Kesehatan Nasional', en: 'Excellence Nationwide' },
  'business.description': { id: 'Penta Valent menyediakan solusi rantai pasok end-to-end yang terintegrasi, didukung oleh teknologi logistik canggih dan keahlian pasar yang mendalam.', en: 'Penta Valent provides an integrated end-to-end supply chain solution, powered by advanced logistics technology and deep market expertise.' },
  'business.division': { id: 'Divisi Nasional', en: 'National Division' },
  'business.integrity': { id: 'Integritas dalam', en: 'Integrity in' },
  'business.transaction': { id: 'Setiap Transaksi', en: 'Every Transaction' },
  'business.feature.certified': { id: 'Pengiriman Tersertifikasi', en: 'Certified Delivery' },
  'business.advantage.cert.title': { id: 'Sertifikasi', en: 'Certification' },
  'business.advantage.cert.desc': { id: 'Mematuhi standar distribusi global termasuk CDOB & CDAKB.', en: 'Complying with global distribution standards including CDOB & CDAKB.' },
  'business.advantage.innovation.title': { id: 'Inovasi', en: 'Innovation' },
  'business.advantage.innovation.desc': { id: 'Memanfaatkan logistik berbasis AI untuk manajemen inventaris real-time.', en: 'Leveraging AI-driven logistics for real-time inventory management.' },
  'business.advantage.coverage.title': { id: 'Cakupan', en: 'Coverage' },
  'business.advantage.coverage.desc': { id: 'Infrastruktur masif yang membentang di 34 provinsi dengan pengiriman last-mile yang efisien.', en: 'Massive infrastructure spanning 34 provinces with efficient last-mile delivery.' },

  // Partners
  'partners.tagline': { id: 'Aliansi Strategis Kami', en: 'Our Strategic Alliance' },
  'partners.title.text': { id: 'Jaringan Global,', en: 'Global Network,' },
  'partners.title.italic': { id: 'Otoritas Lokal', en: 'Local Authority' },
  'partners.description': { id: 'Kami berkolaborasi dengan produsen kesehatan kelas dunia dan prinsipal lokal untuk menghadirkan produk berkualitas premium di seluruh pasar Indonesia.', en: 'We collaborate with world-class healthcare manufacturers and local principals to deliver premium quality products across the Indonesian market.' },
  'partners.filter.all': { id: 'Semua Mitra', en: 'All Partners' },
  'partners.filter.national': { id: 'Prinsipal Nasional', en: 'National Principals' },
  'partners.filter.global': { id: 'Produsen Global', en: 'Global Manufacturers' },
  'partners.stats.national': { id: 'Prinsipal Nasional', en: 'National Principals' },
  'partners.stats.international': { id: 'Mitra Internasional', en: 'International Partners' },
  'partners.stats.skus': { id: 'SKU Produk Dikelola', en: 'Product SKUs Managed' },
  'partners.cta.tagline': { id: 'Bangun Masa Depan Bersama Kami', en: 'Build the Future with Us' },
  'partners.cta.title.text': { id: 'Tingkatkan Distribusi Anda', en: 'Elevate Your Distribution' },
  'partners.cta.title.accent': { id: 'Jangkauan Nasional', en: 'Reach Nationwide' },
  'partners.cta.description': { id: 'Terhubung dengan infrastruktur distribusi kesehatan terbesar di Indonesia. Tim kami siap mengembangkan bisnis Anda di seluruh nusantara.', en: 'Connect with the largest healthcare distribution infrastructure in Indonesia. Our team is ready to scale your business across the archipelago.' },
  'partners.cta.button': { id: 'Menjadi Mitra', en: 'Become a Partner' },

  // Network
  'network.tagline': { id: 'Jejak Nasional', en: 'National Footprint' },
  'network.title.text': { id: 'Cakupan Total', en: 'Total Archipelago' },
  'network.title.italic': { id: 'Nusantara', en: 'Coverage' },
  'network.description': { id: 'Jaringan distribusi kami yang luas memastikan produk kesehatan berkualitas tinggi menjangkau setiap sudut Indonesia dengan efisiensi dan integritas.', en: 'Our expansive distribution network ensures that high-quality healthcare products reach every corner of Indonesia with efficiency and integrity.' },
  'network.stats.main': { id: 'Cabang Utama', en: 'Main Branches' },
  'network.stats.depots': { id: 'Depo Distribusi', en: 'Distribution Depots' },
  'network.stats.provinces': { id: 'Provinsi', en: 'Provinces' },
  'network.intel.title': { id: 'Kecerdasan', en: 'Network' },
  'network.intel.italic': { id: 'Jaringan', en: 'Intelligence' },
  'network.intel.live': { id: 'Operasi Regional Langsung', en: 'Live Regional Operations' },
  'network.legend.hq': { id: 'Kantor Pusat', en: 'Headquarters' },
  'network.legend.branch': { id: 'Cabang Regional', en: 'Regional Branch' },
  'network.legend.depot': { id: 'Depo Logistik', en: 'Logistic Depot' },
  'network.explore.title': { id: 'Jelajahi Jaringan Kami', en: 'Explore Our Network' },
  'network.explore.tagline': { id: 'Direktori Regional', en: 'Regional Directory' },
  'network.filter.all': { id: 'Semua Provinsi', en: 'All Provinces' },
  'network.locations': { id: 'Lokasi', en: 'Locations' },
  'network.view': { id: 'Lihat', en: 'View' },

  // Investor
  'investor.tagline': { id: 'Hubungan Investor', en: 'Investor Relations' },
  'investor.title.text': { id: 'Transparansi &', en: 'Transparency &' },
  'investor.title.italic': { id: 'Pertumbuhan Berkelanjutan', en: 'Sustainable Growth' },
  'investor.description': { id: 'Sebagai perusahaan terbuka, kami berkomitmen untuk menjaga standar tata kelola perusahaan tertinggi dan memberikan nilai jangka panjang kepada pemegang saham kami.', en: 'As a publicly listed company, we are committed to maintaining the highest standards of corporate governance and delivering long-term value to our shareholders.' },
  'investor.ticker.label': { id: 'Simbol Saham BEI', en: 'IDX Stock Symbol' },
  'investor.stats.revenue': { id: 'Pertumbuhan Pendapatan', en: 'Revenue Growth' },
  'investor.stats.mcap': { id: 'Kapitalisasi Pasar', en: 'Market Capitalization' },
  'investor.stats.dividen': { id: 'Yield Dividen', en: 'Dividen Yield' },
  'investor.stats.growth': { id: 'Pertumbuhan 2025', en: 'Growth 2025' },
  'investor.reports.title': { id: 'Laporan Keuangan', en: 'Financial Reports' },
  'investor.reports.desc': { id: 'Akses laporan tahunan terbaru, pengajuan kuartalan, dan presentasi investor kami.', en: 'Access our latest annual reports, quarterly filings, and investor presentations.' },
  'investor.calendar.title': { id: 'Kalender Investor', en: 'Investor Calendar' },
  'investor.calendar.upcoming': { id: 'Acara Mendatang', en: 'Upcoming Event' },
  'investor.disclosure.share': { id: 'Bagikan Pengungkapan', en: 'Share Disclosure' },

  // News
  'news.tagline': { id: 'Pers & Wawasan', en: 'Press & Insights' },
  'news.title.text': { id: 'Kecerdasan', en: 'Corporate' },
  'news.title.italic': { id: 'Korporat', en: 'Intelligence' },
  'news.description': { id: 'Tetap terupdate dengan ekspansi operasional terbaru kami, tonggak keuangan, dan kemitraan strategis saat kami memimpin sektor distribusi kesehatan.', en: 'Stay updated with our latest operational expansions, financial milestones, and strategic partnerships as we lead the healthcare distribution sector.' },
  'news.archive': { id: 'Penemuan Arsip', en: 'Archive Discovery' },
  'news.discovery': { id: 'Arsip Penemuan', en: 'Discovery Archive' },
  'news.readmore': { id: 'Baca Selengkapnya', en: 'Read Disclosure' },
  'news.source': { id: 'Sumber Internal', en: 'Source Internal' },
  'news.comm': { id: 'Komunikasi Korporat', en: 'Corporate Communications' },
  'news.share': { id: 'Bagikan Pengungkapan', en: 'Share Disclosure' },
  'news.cat.award': { id: 'Penghargaan', en: 'Award' },
  'news.cat.expansion': { id: 'Ekspansi', en: 'Expansion' },
  'news.cat.investor': { id: 'Investor', en: 'Investor' },
  'news.cat.partnership': { id: 'Kemitraan', en: 'Partnership' },

  // Career
  'career.title': { id: 'Karir di PEVE', en: 'Career at PEVE' },
  'career.subtitle': { id: 'Bergabunglah dengan tim kami dan kembangkan karir Anda', en: 'Join our team and develop your career' },
  'career.apply': { id: 'Lamar Sekarang', en: 'Apply Now' },
  'career.cta': { id: 'Lihat Lowongan', en: 'Explore Openings' },
  'career.hiring': { id: 'Kami Merekrut Sekarang', en: 'We Are Hiring Now' },
  'career.opportunity': { id: 'Peluang Masa Depan', en: 'Future Opportunities' },
  'career.excellence': { id: 'Mengejar Keunggulan', en: 'Pursuing Excellence' },
  'career.filter.all': { id: 'Semua Bidang', en: 'All Fields' },
  'career.filter.operation': { id: 'Operasi', en: 'Operation' },
  'career.filter.commercial': { id: 'Komersial', en: 'Commercial' },
  'career.filter.support': { id: 'Pendukung', en: 'Support' },

  // Contact
  'contact.tagline': { id: 'Tetap Terhubung', en: 'Stay Connected' },
  'contact.title.text': { id: 'Kemitraan Mulai', en: 'Partnership Starts' },
  'contact.title.italic': { id: 'Di Sini', en: 'Right Here' },
  'contact.description': { id: 'Hubungi tim eksekutif kami untuk mendiskusikan peluang distribusi nasional atau pertanyaan korporat lainnya.', en: 'Contact our executive team to discuss national distribution opportunities or other corporate inquiries.' },
  'contact.info.title': { id: 'Saluran Direksi', en: 'Direct Channels' },
  'contact.info.desc': { id: 'Tim kami menanggapi setiap pertanyaan korporat dalam waktu 24 jam kerja.', en: 'Our team responds to every corporate inquiry within 24 business hours.' },
  'contact.phone.label': { id: 'Hubungi Kami', en: 'Call Us' },
  'contact.email.label': { id: 'Email Kami', en: 'Email Us' },
  'contact.address.label': { id: 'Kantor Pusat', en: 'Headquarters' },
  'contact.social.label': { id: 'Ikuti Kami', en: 'Follow Us' },
  'contact.form.title': { id: 'Pesan Instan', en: 'Instant Messaging' },
  'contact.form.button': { id: 'Kirim Pesan Korporat', en: 'Send Corporate Message' },
  'contact.hours.label': { id: 'Jam Operasional', en: 'Operating Hours' },
  'contact.hours.value': { id: 'Senin - Jumat: 08:30 - 17:00 WIB', en: 'Mon - Fri: 08:30 - 17:00 WIB' },

  // Footer
  'footer.about': { id: 'Tentang PEVE', en: 'About PEVE' },
  'footer.description': { id: 'Didirikan pada tahun 1968, PT Penta Valent Tbk adalah distributor farmasi, alat kesehatan, dan produk konsumen terpercaya di Indonesia.', en: 'Founded in 1968, PT Penta Valent Tbk is a trusted distributor of pharmaceuticals, medical devices, and consumer products in Indonesia.' },
  'footer.quicklinks': { id: 'Tautan Cepat', en: 'Quick Links' },
  'footer.services': { id: 'Layanan', en: 'Services' },
  'footer.contact': { id: 'Kontak', en: 'Contact' },
  'footer.copyright': { id: 'Hak Cipta', en: 'Copyright' },
  'footer.privacy': { id: 'Kebijakan Privasi', en: 'Privacy Policy' },
  'footer.terms': { id: 'Syarat & Ketentuan', en: 'Terms & Conditions' },
  'footer.rights': { id: 'Seluruh hak cipta dilindungi.', en: 'All rights reserved.' },
  'footer.column.contact': { id: 'Hubungi Kami', en: 'Contact Us' },
  'footer.column.corporate': { id: 'Korporat', en: 'Corporate' },
  'footer.column.stakeholders': { id: 'Pemangku Kepentingan', en: 'Stakeholders' },
  'footer.contact.hq': { id: 'Markas Besar Jakarta', en: 'Jakarta HQ' },
  'footer.contact.digital': { id: 'Surat Digital', en: 'Digital Mail' },
  'footer.contact.ho': { id: 'Kantor Pusat', en: 'Head Office' },
  'footer.contact.hours': { id: 'Jam Operasional', en: 'Business Hours' },
  'footer.contact.days': { id: 'Senin - Jumat: 08:00 - 17:00', en: 'Mon - Fri: 08:00 - 17:00' },
  'footer.code_conduct': { id: 'Kode Etik', en: 'Code of Conduct' },

  // Cookie
  'cookie.message': { id: 'Website ini menggunakan cookies untuk memastikan Anda mendapatkan pengalaman terbaik di website kami.', en: 'This website uses cookies to ensure you get the best experience on our website.' },
  'cookie.accept': { id: 'Terima', en: 'Accept' },
  'cookie.manage': { id: 'Kelola Preferensi', en: 'Manage Preferences' },
  'cookie.policy': { id: 'Kebijakan Cookie', en: 'Cookie Policy' },

  // Admin & Login
  'login.title': { id: 'Panel Admin', en: 'Admin Panel' },
  'login.subtitle': { id: 'Masuk untuk mengelola website Anda', en: 'Sign in to manage your website' },
  'login.email': { id: 'Alamat Email', en: 'Email Address' },
  'login.password': { id: 'Kata Sandi', en: 'Password' },
  'login.remember': { id: 'Ingat saya', en: 'Remember me' },
  'login.forgot': { id: 'Lupa kata sandi?', en: 'Forgot password?' },
  'login.button': { id: 'Masuk Ke Panel', en: 'Sign In to Panel' },
  'login.signing': { id: 'Sedang Masuk...', en: 'Signing in...' },
  'login.back': { id: 'Kembali ke Website', en: 'Back to Website' },
  'login.footer': { id: 'Hak Cipta © 2025 PT Penta Valent Tbk.', en: 'Copyright © 2025 PT Penta Valent Tbk.' },
  'login.credentials.title': { id: 'Kredensial Demo:', en: 'Demo Credentials:' },
  'admin.dashboard': { id: 'Dasbor', en: 'Dashboard' },
  'admin.news': { id: 'Kelola Berita', en: 'News Manager' },
  'admin.branches': { id: 'Cabang & Jaringan', en: 'Branches & Network' },
  'admin.messages': { id: 'Pesan Masuk', en: 'Incoming Messages' },
  'admin.logout': { id: 'Keluar', en: 'Logout' },
  'admin.profile': { id: 'Profil', en: 'Profile' },
  'admin.settings': { id: 'Pengaturan', en: 'Settings' },

  // Public Page Updates (Step 1837)
  'mgmt.title': { id: 'Kepemimpinan Eksekutif', en: 'Executive Leadership' },
  'mgmt.visionary': { id: 'Visioner', en: 'Visionary' },
  'mgmt.governance': { id: 'Tata Kelola', en: 'Governance' },
  'mgmt.desc': { id: 'Keunggulan strategis dan operasional kami dipandu oleh tim veteran industri yang beragam, berdedikasi pada pertumbuhan berkelanjutan dan inovasi kesehatan.', en: 'Our strategic and operational excellence is guided by a diverse team of industry veterans dedicated to sustainable growth and healthcare innovation.' },

  'stats.market_reach': { id: 'Jangkauan Pasar', en: 'Market Reach' },

  'network.header.title': { id: 'Jaringan Distribusi Nasional', en: 'National Distribution Network' },
  'network.header.subtitle': { id: 'Jaringan Penta Valent', en: 'Penta Valent Network' },
  'network.header.desc': { id: 'Menjangkau seluruh pelosok Indonesia dengan infrastruktur logistik modern dan terintegrasi untuk memastikan ketersediaan produk kesehatan yang merata & tepat waktu.', en: 'Reaching every corner of Indonesia with modern and integrated logistics infrastructure to ensure equitable & timely availability of healthcare products.' },

  'map.header': { id: 'Lokasi Kami', en: 'Our Locations' },
  'map.subHeader': { id: 'Temukan cabang dan depo terdekat di kota Anda', en: 'Find the nearest branch and depot in your city' },

  'qa.title': { id: 'Jaminan Kualitas', en: 'Quality Assurance' },
  'qa.subtitle': { id: 'Standar Tak Terkompromi', en: 'Uncompromising Standards' },
  'qa.desc': { id: 'Penta Valent mematuhi kerangka regulasi global dan nasional tertinggi untuk memastikan keamanan dan efikasi setiap produk dalam rantai pasok kami.', en: 'Penta Valent adheres to the highest global and national regulatory frameworks to ensure every product\'s safety and efficacy within our supply chain.' },
  'qa.cdob.title': { id: 'Bersertifikat CDOB (GDP)', en: 'CDOB Certified (GDP)' },
  'qa.cdob.desc': { id: 'Sertifikasi nasional untuk standar distribusi farmasi.', en: 'National certification for pharmaceutical distribution standards.' },
  'qa.iso.title': { id: 'Kepatuhan ISO 9001:2015', en: 'ISO 9001:2015 Compliant' },
  'qa.iso.desc': { id: 'Sertifikasi manajemen mutu internasional.', en: 'International quality management certification.' },

  'gcg.title': { id: 'Tata Kelola Perusahaan yang Baik', en: 'Good Corporate Governance' },

  'career.future.title': { id: 'Future Talent Pipeline', en: 'Future Talent Pipeline' },
  'career.future.desc': { id: 'Bangun Masa Depan Kesehatan Bersama Kami', en: 'Build the Future of Healthcare With Us' },

  'contact.cta.title': { id: 'Hubungkan Visi Anda', en: 'Connect Your Vision' },
  'contact.cta.subtitle': { id: 'Saluran Intelijen Langsung', en: 'Direct Intelligence Channel' },
  'contact.fast_response': { id: 'Jalur Respon Cepat', en: 'Fast Response Line' },

};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('peve-language');
    return (saved as Language) || 'id';
  });

  useEffect(() => {
    localStorage.setItem('peve-language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
