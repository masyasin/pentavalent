import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Search, Filter, Calendar, ArrowRight, ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';

interface NewsItem {
    id: string;
    title_id: string;
    title_en: string;
    slug: string;
    excerpt_id: string;
    excerpt_en: string;
    featured_image: string;
    category: string;
    published_at: string;
}

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface BannerItem {
    id: string;
    title_id: string;
    title_en: string;
    subtitle_id: string;
    subtitle_en: string;
    image_url: string;
}

const NewsPage: React.FC = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    // Parse query params
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');

    const [news, setNews] = useState<NewsItem[]>([]);
    const [banners, setBanners] = useState<BannerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', () => setCurrentSlide(emblaApi.selectedScrollSnap()));
    }, [emblaApi]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchNews();
        fetchBanners();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        if (cat) {
            setSelectedCategory(cat);
        }
    }, [location.search]);

    const fetchBanners = async () => {
        try {
            const { data, error } = await supabase
                .from('news_banners')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (error) {
                console.warn('news_banners table not found or empty, using fallbacks');
                setBanners([
                    {
                        id: '1',
                        title_id: 'Inovasi Distribusi Kesehatan Melalui Teknologi AI',
                        title_en: 'Healthcare Distribution Innovation Through AI Technology',
                        subtitle_id: 'Meningkatkan efisiensi rantai pasok farmasi di seluruh penjuru Nusantara.',
                        subtitle_en: 'Enhancing pharmaceutical supply chain efficiency across the archipelago.',
                        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070'
                    },
                    {
                        id: '2',
                        title_id: 'Ekspansi Jaringan Nasional: 34 Cabang Utama',
                        title_en: 'National Network Expansion: 34 Main Branches',
                        subtitle_id: 'Memastikan ketersediaan produk kesehatan menjangkau setiap provinsi.',
                        subtitle_en: 'Ensuring health product availability reaches every province.',
                        image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070'
                    }
                ]);
            } else {
                setBanners(data || []);
            }
        } catch (e) {
            console.error('Error fetching banners:', e);
        }
    };

    const fetchNews = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('is_published', true)
                .order('published_at', { ascending: false });

            if (error) throw error;
            setNews(data || []);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'all', label: language === 'id' ? 'Semua Berita' : 'All Updates' },
        { id: 'news', label: 'News' },
        { id: 'press_release', label: 'Press Release' },
        { id: 'corporate_news', label: 'Corporate News' },
    ];

    const [selectedYear, setSelectedYear] = useState('All Years');

    // Extract unique years from news
    const years = [...new Set(news.map(item => new Date(item.published_at).getFullYear()))].sort((a, b) => b - a);

    const filteredNews = news.filter(item => {
        const matchesSearch = (language === 'id' ? item.title_id : item.title_en)
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

        const itemYear = new Date(item.published_at).getFullYear().toString();
        const matchesYear = selectedYear === 'All Years' || itemYear === selectedYear;

        return matchesSearch && matchesCategory && matchesYear;
    });

    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
    const paginatedNews = filteredNews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const categoryColors: { [key: string]: string } = {
        'press_release': 'bg-red-500/10 text-red-600 border-red-200',
        'corporate_news': 'bg-blue-600/10 text-blue-600 border-blue-200',
        'news': 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
        'default': 'bg-slate-100 text-slate-500 border-slate-200',
    };

    const handleNavigate = (section: string) => {
        navigate(`/#${section}`);
    };

    return (
        <div className="min-h-screen bg-white">
            <Header activeSection="news" onNavigate={handleNavigate} />

            {/* Premium Banner Slider */}
            <section className="relative h-[70dvh] w-full overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0 embla h-full" ref={emblaRef}>
                    <div className="flex h-full">
                        {banners.map((banner, idx) => (
                            <div key={banner.id} className="flex-[0_0_100%] h-full relative group">
                                <img
                                    src={banner.image_url}
                                    alt={banner.title_en}
                                    className="w-full h-full object-cover opacity-60 transition-all duration-[10000ms] ease-linear overflow-hidden"
                                    style={{ transform: currentSlide === idx ? 'scale(1.15)' : 'scale(1)' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950 z-10"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/60 z-10"></div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6">
                                    <div className={`max-w-6xl mx-auto text-center space-y-6 transition-all duration-1000 transform ${currentSlide === idx ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-full mb-2 mx-auto">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                            </span>
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400">
                                                {idx + 1}/{banners.length} CORPORATE INTELLIGENCE
                                            </span>
                                        </div>

                                        <div className="relative">
                                            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter leading-[1.1] max-w-4xl mx-auto text-white italic px-4 drop-shadow-2xl">
                                                {language === 'id' ? banner.title_id : banner.title_en}
                                            </h1>
                                            <div className="w-16 h-1 bg-primary mx-auto mt-8 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)]"></div>
                                        </div>

                                        <p className="text-base md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-medium italic">
                                            {language === 'id' ? banner.subtitle_id : banner.subtitle_en}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slider Navigation Dots */}
                <div className="absolute bottom-8 left-0 right-0 z-30 pointer-events-none">
                    <div className="max-w-7xl mx-auto px-6 flex justify-center items-center gap-4 pointer-events-auto">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => emblaApi?.scrollTo(idx)}
                                className={`transition-all duration-500 rounded-full ${currentSlide === idx ? 'w-10 h-2 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                                aria-label={`Go to banner ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop-only Side Navigation */}
                <div className="hidden md:flex absolute inset-y-0 left-8 items-center z-30">
                    <button onClick={() => emblaApi?.scrollPrev()} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all group touch-active">
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>
                <div className="hidden md:flex absolute inset-y-0 right-8 items-center z-30">
                    <button onClick={() => emblaApi?.scrollNext()} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all group touch-active">
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-20">
                {/* Modern Search & Filter Interface */}
                <div className="max-w-4xl mx-auto mb-20 space-y-10">
                    {/* High-Impact Search Bar - Centered */}
                    <div className="relative group/search max-w-2xl mx-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] blur opacity-20 group-focus-within/search:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-white border border-slate-100 rounded-[2.2rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] flex items-center p-2 group-focus-within/search:border-blue-500/30 transition-all">
                            <div className="pl-8 pr-4">
                                <Search className="w-6 h-6 text-slate-400 group-focus-within/search:text-blue-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder={language === 'id' ? 'Cari berita, pengumuman, atau laporan...' : 'Search news, announcements, or reports...'}
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full py-4 md:py-6 pr-8 bg-transparent text-lg font-bold text-slate-900 placeholder:text-slate-300 outline-none"
                            />
                        </div>
                    </div>

                    {/* Category Filter Pills - High-end arrangement */}
                    <div className="flex flex-wrap items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setCurrentPage(1);
                                }}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative flex items-center gap-2 group ${selectedCategory === cat.id
                                    ? 'bg-blue-600 text-white shadow-[0_15px_30px_rgba(37,99,235,0.25)] scale-105'
                                    : 'bg-slate-50 text-slate-400 hover:bg-white hover:text-blue-600 border border-slate-100/50 hover:border-blue-200 hover:shadow-lg'
                                    }`}
                            >
                                {selectedCategory === cat.id && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                )}
                                <span className="relative z-10">{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Horizontal Year Filter - Like Screenshot */}
                    <div className="space-y-6 pt-10 border-t border-slate-100/50">
                        {/* Title if Category Selected */}
                        {selectedCategory !== 'all' && (
                            <h2 className="text-2xl font-bold text-blue-900 border-b-2 border-blue-900 inline-block pb-2 mb-4">
                                {categories.find(c => c.id === selectedCategory)?.label}
                            </h2>
                        )}

                        {/* Horizontal Years List */}
                        <div className="relative">
                            <div className="flex flex-wrap items-center gap-8 md:gap-12 overflow-x-auto pb-4">
                                <button
                                    onClick={() => setSelectedYear('All Years')}
                                    className={`text-lg transition-colors whitespace-nowrap font-medium ${selectedYear === 'All Years' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-blue-600'
                                        }`}
                                >
                                    {language === 'id' ? 'Semua' : 'All'}
                                </button>
                                {years.map(year => (
                                    <button
                                        key={year}
                                        onClick={() => setSelectedYear(year.toString())}
                                        className={`text-lg transition-colors whitespace-nowrap font-medium ${selectedYear === year.toString() ? 'text-blue-600 font-bold' : 'text-blue-900/60 hover:text-blue-600'
                                            }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                            {/* Gradient Line matching Header */}
                            <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-full opacity-80"></div>
                        </div>

                    </div>
                </div>

                {/* News List */}
                {
                    loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-slate-50 rounded-[3rem] h-[500px] animate-pulse"></div>
                            ))
                            }
                        </div >
                    ) : paginatedNews.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
                                {paginatedNews.map((item, index) => (
                                    <article
                                        key={item.id}
                                        onClick={() => navigate(`/news/${item.slug}`)}
                                        className="group relative bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(6,182,212,0.12)] hover:-translate-y-4 transition-all duration-700 cursor-pointer"
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-20"></div>

                                        <div className="relative aspect-[16/11] overflow-hidden">
                                            <img
                                                src={item.featured_image || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop'}
                                                alt={language === 'id' ? item.title_id : item.title_en}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute top-6 left-6 z-10">
                                                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-white/20 shadow-lg ${categoryColors[item.category] || categoryColors.default}`}>
                                                    {item.category.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        </div>

                                        <div className="p-10 flex flex-col h-full relative">
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">
                                                <div className="w-8 h-px bg-slate-200 group-hover:w-12 group-hover:bg-blue-600 transition-all duration-500"></div>
                                                {formatDate(item.published_at)}
                                            </div>

                                            <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-500 leading-tight mb-4 line-clamp-2 min-h-[3rem]">
                                                {language === 'id' ? item.title_id : item.title_en}
                                            </h3>

                                            <div
                                                className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2 mb-10 opacity-70 group-hover:opacity-100 transition-opacity"
                                                dangerouslySetInnerHTML={{ __html: (language === 'id' ? item.excerpt_id : item.excerpt_en) || '' }}
                                            />

                                            <div className="pt-8 border-t border-slate-50 flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-2 group/link">
                                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{t('news.readmore')}</span>
                                                    <div className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                                    </div>
                                                </div>

                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-6">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-20">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 text-slate-600 hover:bg-white hover:border-blue-600 hover:text-blue-600 transition-all disabled:opacity-30"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${currentPage === i + 1
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 text-slate-600 hover:bg-white hover:border-blue-600 hover:text-blue-600 transition-all disabled:opacity-30"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                            <Newspaper className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-slate-900 mb-2">
                                {language === 'id' ? 'Tidak ada berita ditemukan' : 'No news found'}
                            </h3>
                            <p className="text-slate-500">
                                {language === 'id' ? 'Coba gunakan kata kunci atau kategori yang berbeda.' : 'Try using different keywords or categories.'}
                            </p>
                        </div>
                    )
                }
            </main >

            <Footer onNavigate={handleNavigate} />
        </div >
    );
};

export default NewsPage;
