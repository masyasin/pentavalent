import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronRight, HelpCircle, MessageCircle, Info, ExternalLink } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageSlider from '../../components/common/PageSlider';
import { useLocation } from 'react-router-dom';

interface FAQ {
    id: string;
    question_id: string;
    question_en: string;
    answer_id: string;
    answer_en: string;
    category: 'general' | 'business' | 'investor' | 'career' | 'other';
    sort_order: number;
}

const FAQPage: React.FC = () => {
    const { pathname } = useLocation();
    const { language } = useLanguage();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [openFaqId, setOpenFaqId] = useState<string | null>(null);

    const categories = [
        { id: 'all', label: language === 'id' ? 'Semua Topik' : 'All Topics' },
        { id: 'general', label: language === 'id' ? 'Informasi Umum' : 'General Info' },
        { id: 'business', label: language === 'id' ? 'Bisnis & Layanan' : 'Business & Services' },
        { id: 'investor', label: language === 'id' ? 'Investor' : 'Investor Relations' },
        { id: 'career', label: language === 'id' ? 'Karir' : 'Careers' },
        { id: 'other', label: language === 'id' ? 'Lainnya' : 'Others' }
    ];

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const { data, error } = await supabase
                    .from('faqs')
                    .select('*')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true });

                if (error) throw error;
                setFaqs(data || []);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
        window.scrollTo(0, 0);
    }, []);

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch =
            (language === 'id' ? faq.question_id : faq.question_en).toLowerCase().includes(searchTerm.toLowerCase()) ||
            (language === 'id' ? faq.answer_id : faq.answer_en).toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    const toggleFaq = (id: string) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    const handleNavigation = (section: string) => {
        if (section === 'faq') window.location.href = '/faq';
        else if (section === 'sitemap') window.location.href = '/sitemap';
        else if (section === 'contact') window.location.href = '/contact';
        else if (section === 'hero' || section === 'home') window.location.href = '/';
        else window.location.href = `/#${section}`;
    };

    return (
        <div className="min-h-screen bg-white">
            <Header onNavigate={handleNavigation} activeSection="faq" />

            <main>
                <PageSlider
                    pagePath={pathname}
                    breadcrumbLabel={language === 'id' ? 'Tanya Jawab' : 'F.A.Q'}
                    parentLabel={language === 'id' ? 'Dukungan' : 'Support'}
                />

                <section className="py-20 md:py-32">
                    <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
                        {/* Page Header Area */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-4 mb-6"
                                >
                                    <span className="h-px w-12 bg-cyan-500"></span>
                                    <span className="text-sm font-black tracking-widest text-cyan-600 uppercase">
                                        {language === 'id' ? 'Pusat Bantuan' : 'Help Center'}
                                    </span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter"
                                >
                                    {language === 'id' ? 'Pertanyaan Umum (FAQ)' : 'Frequently Asked Questions'}
                                </motion.h1>
                                <p className="text-lg text-slate-500 max-w-2xl font-medium">
                                    {language === 'id' 
                                        ? 'Temukan jawaban cepat untuk pertanyaan yang sering diajukan mengenai layanan dan operasional kami.' 
                                        : 'Find quick answers to frequently asked questions about our services and operations.'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                            {/* Main Content Area */}
                            <div className="lg:col-span-8">
                                {/* Search Bar */}
                                <div className="relative mb-12">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                        <Search className="h-6 w-6 text-cyan-500/30" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder={language === 'id' ? 'Cari pertanyaan...' : 'Search questions...'}
                                        className="w-full pl-16 pr-6 py-5 md:py-7 bg-white border border-slate-100 rounded-[2rem] text-lg font-bold shadow-2xl shadow-slate-200/50 focus:ring-4 focus:ring-cyan-50 focus:border-cyan-200 transition-all outline-none"
                                    />
                                </div>

                                {/* FAQ List */}
                                <div className="space-y-6">
                                    {loading ? (
                                        <div className="text-center py-20 text-slate-400 font-black uppercase tracking-widest animate-pulse">Loading...</div>
                                    ) : filteredFaqs.length === 0 ? (
                                        <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                                            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8">
                                                <HelpCircle className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 mb-2">
                                                {language === 'id' ? 'Tidak ada hasil ditemukan' : 'No results found'}
                                            </h3>
                                            <p className="text-slate-500 font-medium italic">
                                                {language === 'id' ? 'Coba kata kunci lain atau pilih kategori berbeda' : 'Try different keywords or select a different category'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-6">
                                            {filteredFaqs.map((faq) => (
                                                <motion.div
                                                    layout
                                                    key={faq.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`group bg-white border ${openFaqId === faq.id ? 'border-cyan-500/30 shadow-2xl shadow-cyan-500/10' : 'border-slate-100 shadow-xl shadow-slate-200/30'} rounded-[2rem] overflow-hidden transition-all duration-500`}
                                                >
                                                    <button
                                                        onClick={() => toggleFaq(faq.id)}
                                                        className="w-full px-8 md:px-10 py-8 flex items-center justify-between text-left gap-6 group"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className="px-3 py-0.5 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-lg border border-slate-100 group-hover:bg-cyan-50 group-hover:text-cyan-600 group-hover:border-cyan-100 transition-colors">
                                                                    {categories.find(c => c.id === faq.category)?.label || faq.category}
                                                                </span>
                                                            </div>
                                                            <h3 className={`text-lg md:text-xl font-black tracking-tight ${openFaqId === faq.id ? 'text-cyan-600' : 'text-slate-900 group-hover:text-cyan-600'} transition-colors`}>
                                                                {language === 'id' ? faq.question_id : faq.question_en}
                                                            </h3>
                                                        </div>
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${openFaqId === faq.id ? 'bg-cyan-600 text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 group-hover:rotate-12'}`}>
                                                            <ChevronDown size={24} strokeWidth={3} />
                                                        </div>
                                                    </button>
                                                    <AnimatePresence>
                                                        {openFaqId === faq.id && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                            >
                                                                <div className="px-8 md:px-10 pb-10 pt-2">
                                                                    <div className="h-px w-full bg-slate-100 mb-8"></div>
                                                                    <div
                                                                        className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium text-lg"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: language === 'id' ? faq.answer_id : faq.answer_en
                                                                        }}
                                                                    />
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar Area */}
                            <div className="lg:col-span-4">
                                <div className="sticky top-32 space-y-10">
                                    {/* Sub Navigation */}
                                    <div className="p-10 rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
                                        <h3 className="text-xl font-black mb-8">{language === 'id' ? 'Kategori' : 'Categories'}</h3>
                                        <div className="space-y-3">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => {
                                                        setActiveCategory(cat.id);
                                                        setOpenFaqId(null);
                                                    }}
                                                    className={`w-full group flex items-center justify-between p-5 rounded-2xl transition-all duration-300 relative overflow-hidden ${activeCategory === cat.id
                                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                                                        : 'hover:bg-cyan-50 text-slate-600 hover:border-cyan-100'
                                                        }`}
                                                >
                                                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-white transition-all duration-300 ${activeCategory === cat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:bg-cyan-500'}`}></div>

                                                    <span className="font-bold text-sm tracking-tight relative z-10">
                                                        {cat.label}
                                                    </span>
                                                    <ChevronRight size={16} className={`transition-transform duration-300 ${activeCategory === cat.id ? 'translate-x-0' : 'group-hover:translate-x-1 group-hover:text-cyan-600'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sidebar CTA */}
                                    <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                            <MessageCircle size={120} />
                                        </div>
                                        <h3 className="text-2xl font-black mb-6 relative z-10">
                                            {language === 'id' ? 'Butuh Bantuan Lebih?' : 'Need More Help?'}
                                        </h3>
                                        <p className="text-slate-400 mb-8 relative z-10 font-medium italic">
                                            {language === 'id'
                                                ? 'Jika Anda tidak menemukan jawaban yang dicari, tim kami siap membantu Anda secara langsung.'
                                                : 'If you can\'t find the answer you\'re looking for, our team is ready to help you directly.'}
                                        </p>
                                        <div className="space-y-4 relative z-10">
                                            <a
                                                href="/contact"
                                                className="flex items-center justify-between p-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group/mail"
                                            >
                                                <span className="font-bold text-xs tracking-widest uppercase">{language === 'id' ? 'Hubungi Kami' : 'Contact Us'}</span>
                                                <ExternalLink size={16} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer onNavigate={handleNavigation} />
        </div>
    );
};

export default FAQPage;
