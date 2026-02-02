import React, { useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, ArrowRight, Building2, Target, Users, Globe, ShieldCheck, TrendingUp, Activity, FileText, FileSearch, Info, Mail, MapPin, ChevronRight, Layout, Newspaper, Briefcase, HelpCircle, Shield, FileCheck } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const SitemapPage: React.FC = () => {
    const { language, t } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sitemapData = [
        {
            title: language === 'id' ? 'Utama' : 'Main',
            icon: <Layout className="text-blue-500" size={24} />,
            links: [
                { label: language === 'id' ? 'Beranda' : 'Home', path: '/' },
                { label: language === 'id' ? 'Tentang Kami' : 'About Us', path: '/about/profile' },
                { label: language === 'id' ? 'Lini Bisnis' : 'Business Lines', path: '/business/pharmaceuticals' },
                { label: language === 'id' ? 'Investor' : 'Investor Relations', path: '/investor/ringkasan-investor' },
                { label: language === 'id' ? 'Berita' : 'News', path: '/news' },
                { label: language === 'id' ? 'Karir' : 'Careers', path: '/career' },
                { label: language === 'id' ? 'Hubungi Kami' : 'Contact Us', path: '/contact' },
            ]
        },
        {
            title: language === 'id' ? 'Tentang Kami' : 'About Us',
            icon: <Building2 className="text-cyan-500" size={24} />,
            links: [
                { label: language === 'id' ? 'Profil Perusahaan' : 'Company Profile', path: '/about/profile' },
                { label: language === 'id' ? 'Visi & Misi' : 'Vision & Mission', path: '/about/vision-mission' },
                { label: language === 'id' ? 'Manajemen' : 'Management', path: '/about/management' },
                { label: language === 'id' ? 'Jaringan & Mitra' : 'Network & Partners', path: '/about/network-partners' },
                { label: language === 'id' ? 'Sertifikasi & Prestasi' : 'Certifications & Achievements', path: '/about/legality-achievements' },
            ]
        },
        {
            title: language === 'id' ? 'Lini Bisnis' : 'Business Lines',
            icon: <Target className="text-emerald-500" size={24} />,
            links: [
                { label: language === 'id' ? 'Farmasi' : 'Pharmaceuticals', path: '/business/pharmaceuticals' },
                { label: language === 'id' ? 'Barang Konsumsi' : 'Consumer Goods', path: '/business/consumer-goods' },
                { label: language === 'id' ? 'Alat Kesehatan' : 'Medical Equipment', path: '/business/medical-equipment' },
                { label: language === 'id' ? 'Strategi Bisnis' : 'Business Strategy', path: '/business/strategi-usaha' },
                { label: language === 'id' ? 'Alur Distribusi' : 'Distribution Flow', path: '/business/distribution-flow' },
                { label: language === 'id' ? 'Target Pasar' : 'Target Market', path: '/business/target-market' },
            ]
        },
        {
            title: language === 'id' ? 'Hubungan Investor' : 'Investor Relations',
            icon: <TrendingUp className="text-purple-500" size={24} />,
            links: [
                { label: language === 'id' ? 'Ringkasan Keuangan' : 'Financial Highlights', path: '/investor/ringkasan-investor' },
                { label: language === 'id' ? 'Informasi Saham' : 'Stock Information', path: '/investor/informasi-saham' },
                { label: language === 'id' ? 'Laporan Tahunan' : 'Annual Reports', path: '/investor/laporan-keuangan' },
                { label: language === 'id' ? 'Prospektus' : 'Prospectus', path: '/investor/prospektus' },
                { label: language === 'id' ? 'Info RUPS' : 'General Meetings', path: '/investor/rups' },
                { label: language === 'id' ? 'Keterbukaan Informasi' : 'Information Disclosure', path: '/investor/keterbukaan-informasi' },
            ]
        },
        {
            title: language === 'id' ? 'Pusat Informasi' : 'Information Center',
            icon: <Newspaper className="text-orange-500" size={24} />,
            links: [
                { label: language === 'id' ? 'Semua Berita' : 'All News', path: '/news' },
                { label: language === 'id' ? 'Siaran Pers' : 'Press Release', path: '/news?category=press_release' },
                { label: language === 'id' ? 'Berita Korporasi' : 'Corporate News', path: '/news?category=corporate_news' },
                { label: language === 'id' ? 'Lowongan Kerja' : 'Job Vacancies', path: '/career' },
                { label: language === 'id' ? 'FAQ' : 'Frequently Asked Questions', path: '/faq' },
            ]
        },
        {
            title: language === 'id' ? 'Legalitas' : 'Legality',
            icon: <ShieldCheck className="text-slate-500" size={24} />,
            links: [
                { label: language === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy', path: '/privacy-policy' },
                { label: language === 'id' ? 'Pedoman Perilaku' : 'Code of Conduct', path: '/code-of-conduct' },
                { label: language === 'id' ? 'Syarat & Ketentuan' : 'Terms & Conditions', path: '#' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Header onNavigate={() => {}} activeSection="sitemap" />
            
            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-16 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-4"
                        >
                            <Map size={14} />
                            {language === 'id' ? 'Peta Situs' : 'Sitemap'}
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic mb-6"
                        >
                            {language === 'id' ? 'Navigasi Seluruh Website' : 'Full Website Navigation'}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 max-w-2xl mx-auto font-medium"
                        >
                            {language === 'id' 
                                ? 'Temukan semua informasi yang Anda butuhkan dengan mudah melalui struktur peta situs kami yang komprehensif.' 
                                : 'Easily find all the information you need through our comprehensive sitemap structure.'}
                        </motion.p>
                    </div>

                    {/* Sitemap Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sitemapData.map((section, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * idx }}
                                className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:wow-button-gradient group-hover:text-white transition-all shadow-sm">
                                        {section.icon}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">
                                        {section.title}
                                    </h3>
                                </div>

                                <ul className="space-y-4">
                                    {section.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <button
                                                onClick={() => link.path !== '#' && navigate(link.path)}
                                                className="flex items-center gap-3 text-slate-500 hover:text-blue-600 font-bold text-sm tracking-wide transition-colors group/link"
                                            >
                                                <ChevronRight size={16} className="text-slate-300 group-hover/link:text-blue-500 transition-colors" />
                                                <span>{link.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-20 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 text-center md:text-left">
                            <h4 className="text-2xl font-black tracking-tighter italic mb-2">
                                {language === 'id' ? 'Butuh bantuan lebih lanjut?' : 'Need further assistance?'}
                            </h4>
                            <p className="text-slate-400 font-medium">
                                {language === 'id' 
                                    ? 'Tim dukungan kami siap membantu Anda menemukan informasi yang tepat.' 
                                    : 'Our support team is ready to help you find the right information.'}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/contact')}
                            className="relative z-10 px-8 py-4 bg-white text-slate-950 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-2xl active:scale-95"
                        >
                            {language === 'id' ? 'Hubungi Kami' : 'Contact Us'}
                        </button>
                    </motion.div>
                </div>
            </main>

            <Footer onNavigate={() => {}} />
        </div>
    );
};

export default SitemapPage;