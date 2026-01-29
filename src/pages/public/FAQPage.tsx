import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, ChevronRight, HelpCircle, MessageCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageBanner from '../../components/common/PageBanner';

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
    const { t, language } = useLanguage();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [openFaqId, setOpenFaqId] = useState<string | null>(null);

    const categories = [
        { id: 'all', label: language === 'id' ? 'Semua Topik' : 'All Topics' },
        { id: 'general', label: language === 'id' ? 'Umum' : 'General' },
        { id: 'business', label: language === 'id' ? 'Bisnis & Layanan' : 'Business & Services' },
        { id: 'investor', label: language === 'id' ? 'Investor' : 'Investor Relations' },
        { id: 'career', label: language === 'id' ? 'Karir' : 'Careers' }
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
        else if (section === 'hero' || section === 'home') window.location.href = '/';
        else window.location.href = `/#${section}`;
    };

    return (
        <div className="min-h-screen bg-white">
            <Header onNavigate={handleNavigation} activeSection="faq" />

            <PageBanner
                title={language === 'id' ? 'Pertanyaan Umum' : 'Frequently Asked Questions'}
                subtitle={language === 'id' ? 'Temukan jawaban untuk pertanyaan yang sering diajukan' : 'Find answers to common questions about our services'}
                backgroundImage="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"
                breadcrumb={{
                    label: language === 'id' ? 'FAQ' : 'FAQ',
                    link: '/faq'
                }}
            />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Search Bar */}
                <div className="relative mb-12">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-gray-300" />
                    </div>
                    <input
                        type="text"
                        placeholder={language === 'id' ? 'Cari pertanyaan...' : 'Search questions...'}
                        className="w-full pl-16 pr-6 py-6 bg-white border-2 border-gray-100 rounded-3xl text-lg font-bold shadow-xl shadow-gray-100/50 focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 mb-12 justify-center">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${activeCategory === cat.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-20 text-gray-400">Loading...</div>
                    ) : filteredFaqs.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HelpCircle className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">
                                {language === 'id' ? 'Tidak ada hasil ditemukan' : 'No results found'}
                            </h3>
                            <p className="text-gray-500">
                                {language === 'id' ? 'Coba kata kunci lain atau pilih kategori berbeda' : 'Try different keywords or select a different category'}
                            </p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredFaqs.map((faq) => (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openFaqId === faq.id ? 'border-blue-200 shadow-xl shadow-blue-50 ring-4 ring-blue-50' : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full px-8 py-6 flex items-center justify-between gap-6 text-left"
                                    >
                                        <h3 className={`text-lg font-bold transition-colors ${openFaqId === faq.id ? 'text-blue-700' : 'text-gray-900'
                                            }`}>
                                            {language === 'id' ? faq.question_id : faq.question_en}
                                        </h3>
                                        <div className={`p-2 rounded-full transition-all duration-300 flex-shrink-0 ${openFaqId === faq.id ? 'bg-blue-100 text-blue-600 rotate-180' : 'bg-gray-50 text-gray-400'
                                            }`}>
                                            <ChevronDown size={20} strokeWidth={3} />
                                        </div>
                                    </button>
                                    <motion.div
                                        initial={false}
                                        animate={{ height: openFaqId === faq.id ? 'auto' : 0, opacity: openFaqId === faq.id ? 1 : 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-8 pb-8 pt-2">
                                            <div
                                                className="prose prose-blue max-w-none text-gray-600 leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html: language === 'id' ? faq.answer_id : faq.answer_en
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Contact CTA */}
                <div className="mt-20 bg-blue-600 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                            <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-black mb-4 tracking-tight">
                            {language === 'id' ? 'Masih punya pertanyaan?' : 'Still have questions?'}
                        </h3>
                        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                            {language === 'id'
                                ? 'Tim support kami siap membantu Anda. Hubungi kami untuk informasi lebih lanjut.'
                                : 'Our support team is here to help. Contact us for more information.'}
                        </p>
                        <a
                            href="mailto:info@pentavalent.co.id"
                            className="px-10 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 hover:scale-105 transition-all shadow-xl shadow-blue-900/20"
                        >
                            {language === 'id' ? 'Hubungi Kami' : 'Contact Us'}
                        </a>
                    </div>
                </div>
            </main>

            <Footer onNavigate={handleNavigation} />
        </div>
    );
};

export default FAQPage;
