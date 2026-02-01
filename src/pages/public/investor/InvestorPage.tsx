
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import PageSlider from '../../../components/common/PageSlider';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Download, FileText, Calendar, ArrowUpRight, TrendingUp, PieChart, Activity, Users, BarChart3, Clock, Briefcase, ExternalLink, Shield, Info, MapPin, Heart, Package, Award, Building2 } from 'lucide-react';
import { StockSymbolOverview, StockPriceTicker, TechnicalAnalysis, StockFinancials, FundamentalData, CompanyProfileWidget, SymbolInfo } from '../../../components/investor/TradingViewWidgets';

interface InvestorDoc {
    id: string;
    title_id: string;
    title_en: string;
    document_type: string;
    year: number;
    quarter: string;
    file_url: string;
    published_at: string;
}

interface Highlight {
    label_id: string;
    label_en: string;
    value: string;
    growth: string;
    icon_name: string;
}

interface CalendarEvent {
    title_id: string;
    title_en: string;
    event_date: string;
    event_type: string;
}

interface InvestorRatio {
    label: string;
    value: string;
    description_id: string;
    description_en: string;
    icon_name: string;
}

interface Shareholder {
    name: string;
    percentage: number;
    color_start: string;
    color_end: string;
}

interface DividendHistory {
    year: number;
    amount: string;
}

const InvestorPage: React.FC = () => {
    const { pathname } = useLocation();
    const { language, t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [documents, setDocuments] = useState<InvestorDoc[]>([]);
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [calendar, setCalendar] = useState<CalendarEvent[]>([]);

    // New States
    const [ratios, setRatios] = useState<InvestorRatio[]>([]);
    const [shareholders, setShareholders] = useState<Shareholder[]>([]);
    const [dividends, setDividends] = useState<DividendHistory[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>('All Years');
    const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

    const [pageContent, setPageContent] = useState<any>(null);

    const getSlug = () => pathname.split('/').pop() || '';

    useEffect(() => {
        const slug = getSlug();
        setPageContent({
            slug,
            title_id: getTitle(slug, 'id'),
            title_en: getTitle(slug, 'en'),
        });
        fetchData(slug);
        window.scrollTo(0, 0);
    }, [pathname]);

    const fetchData = async (slug: string) => {
        setLoading(true);
        try {
            // Fetch Documents
            const { data: docData } = await supabase
                .from('investor_documents')
                .select('*')
                .eq('is_published', true)
                .order('year', { ascending: false });

            if (docData) setDocuments(docData);

            if (slug === 'informasi-saham') {
                // Fetch Ratios
                const { data: rData } = await supabase.from('investor_ratios').select('*').order('sort_order');
                if (rData && rData.length > 0) setRatios(rData);
                else {
                    // Fallback/Initial Render if DB empty
                    setRatios([
                        { label: 'P/E Ratio', value: '12.4x', description_en: 'Price to Earnings', description_id: 'Rasio Harga/Laba', icon_name: 'Activity' },
                        { label: 'EPS', value: '45.8', description_en: 'Earnings Per Share', description_id: 'Laba per Saham', icon_name: 'TrendingUp' },
                        { label: 'PBV', value: '1.8x', description_en: 'Price to Book Value', description_id: 'Harga ke Nilai Buku', icon_name: 'FileText' },
                        { label: 'ROE', value: '15.2%', description_en: 'Return on Equity', description_id: 'Pengembalian Ekuitas', icon_name: 'PieChart' },
                    ]);
                }

                // Fetch Shareholders
                const { data: sData } = await supabase.from('investor_shareholders').select('*').order('sort_order');
                if (sData && sData.length > 0) setShareholders(sData);
                else {
                    setShareholders([
                        { name: 'PT Penta Valent Group', percentage: 65.20, color_start: 'from-blue-600', color_end: 'to-cyan-500' },
                        { name: 'Public / Masyarakat', percentage: 34.80, color_start: 'from-cyan-400', color_end: 'to-emerald-400' }
                    ]);
                }

                // Fetch Dividends
                const { data: dData } = await supabase.from('investor_dividend_history').select('*').order('year', { ascending: true });
                if (dData && dData.length > 0) setDividends(dData);
                else {
                    setDividends([
                        { year: 2023, amount: '15 IDR/Share' },
                        { year: 2024, amount: '18 IDR/Share' }
                    ]);
                }
            }

            // Fetch Highlights if needed
            if (slug === 'ringkasan-investor') {
                const { data: hData } = await supabase
                    .from('investor_highlights')
                    .select('*')
                    .order('sort_order', { ascending: true });
                if (hData) setHighlights(hData);
                else {
                    // Fallback
                    setHighlights([
                        { label_id: 'Pertumbuhan Pendapatan', label_en: 'Revenue Growth', value: '18.4%', growth: '+2.1%', icon_name: 'TrendingUp' },
                        { label_id: 'Hasil Dividen', label_en: 'Dividend Yield', value: '4.2%', growth: '+0.5%', icon_name: 'PieChart' },
                        { label_id: 'Laba Bersih', label_en: 'Net Profit', value: '350M', growth: '+12%', icon_name: 'Activity' }
                    ]);
                }
            }

            // Fetch Calendar if needed
            if (slug === 'rups' || slug === 'ringkasan-investor') {
                const { data: cData } = await supabase
                    .from('investor_calendar')
                    .select('*')
                    .order('event_date', { ascending: true });
                if (cData) setCalendar(cData);
                else {
                    setCalendar([
                        { title_id: 'RUPS Tahunan 2024', title_en: 'Annual AGM 2024', event_date: '2025-04-22', event_type: 'Corporate' },
                        { title_id: 'Rilis Q1 2025', title_en: 'Q1 2025 Release', event_date: '2025-05-15', event_type: 'Earnings' }
                    ]);
                }
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTitle = (slug: string, lang: 'id' | 'en') => {
        const titles: any = {
            'ringkasan-investor': { id: 'Ringkasan Investor', en: 'Investor Highlight' },
            'informasi-saham': { id: 'Informasi Saham', en: 'Stock Information' },
            'laporan-keuangan': { id: 'Laporan Keuangan', en: 'Financial Reports' },
            'prospektus': { id: 'Prospektus', en: 'Prospectus' },
            'rups': { id: 'RUPS', en: 'General Meetings' },
            'keterbukaan-informasi': { id: 'Keterbukaan Informasi', en: 'Information Disclosure' },
        };
        return titles[slug]?.[lang] || 'Investor Relations';
    };

    const getIcon = (name: string) => {
        const props = { size: 24 };
        switch (name.toLowerCase()) {
            case 'trendingup': return <TrendingUp {...props} />;
            case 'piechart': return <PieChart {...props} />;
            case 'activity': return <Activity {...props} />;
            case 'users': return <Users {...props} />;
            case 'calendar': return <Calendar {...props} />;
            case 'award': return <Award {...props} />;
            default: return <BarChart3 {...props} />;
        }
    };

    const handleNavigate = (section: string) => {
        window.location.href = `/#${section}`;
    };

    return (
        <div className="min-h-screen bg-white">
            <Header activeSection="investor" onNavigate={handleNavigate} />

            <main>
                <PageSlider
                    pagePath={pathname}
                    breadcrumbLabel={language === 'id' ? pageContent?.title_id : pageContent?.title_en}
                    parentLabel={language === 'id' ? 'Hubungan Investor' : 'Investor Relations'}
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
                                        {language === 'id' ? 'Hubungan Investor' : 'Investor Relations'}
                                    </span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter"
                                >
                                    {language === 'id' ? pageContent?.title_id : pageContent?.title_en}
                                </motion.h1>
                            </div>

                            {/* Sticky Dashboard Style Stats (Optional for some pages) */}
                            {getSlug() === 'informasi-saham' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-panel p-4 rounded-[1.5rem] enterprise-shadow border-white/60 flex items-center gap-4 bg-slate-50/50 min-w-[300px]"
                                >
                                    <div className="w-full">
                                        <StockPriceTicker symbol="PEVE" theme="light" />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                            {/* Main Content Area */}
                            <div className={getSlug() === 'informasi-saham' ? "lg:col-span-12" : "lg:col-span-8"}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={getSlug()}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-24"
                                    >
                                        {/* RENDER CONTENT BASED ON SLUG */}
                                        {getSlug() === 'ringkasan-investor' && (
                                            <div className="space-y-24">
                                                {/* 1. Profile & Stats: Premium Modern Layout */}
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                                                    <div className="lg:col-span-7 space-y-8">
                                                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-cyan-50 rounded-full border border-cyan-100 mb-2">
                                                            <span className="relative flex h-2 w-2">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                                            </span>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600">
                                                                {language === 'id' ? 'Profil Sekilas' : 'Company at a Glance'}
                                                            </span>
                                                        </div>
                                                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                                            {language === 'id' ? 'Mitra Distribusi Kesehatan' : 'Healthcare Distribution'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 italic">{language === 'id' ? 'Terpercaya' : 'Partner'}</span>
                                                        </h2>
                                                        <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-2xl">
                                                            {language === 'id'
                                                                ? 'Perseroan didirikan pada bulan September 1968 di Jakarta, Indonesia dengan nama CV Penta Valent. Selanjutnya, pada tahun 1972, Perseroan melakukan perubahan badan hukum menjadi Perseroan Terbatas.'
                                                                : 'The Company was established in September 1968 in Jakarta, Indonesia under the name CV Penta Valent. Subsequently, in 1972, the Company changed its legal status to a Limited Liability Company.'}
                                                        </p>
                                                    </div>
                                                    <div className="lg:col-span-5 relative">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[3rem] blur-2xl opacity-20 transform rotate-3"></div>
                                                        <div className="relative bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-[3rem] -mr-8 -mt-8"></div>
                                                            <div className="relative z-10">
                                                                <div className="flex items-baseline gap-2 mb-2">
                                                                    <span className="text-7xl font-black text-slate-900 tracking-tighter">34</span>
                                                                    <span className="text-4xl font-black text-cyan-500">+</span>
                                                                </div>
                                                                <div className="text-2xl font-bold text-slate-400 tracking-tight leading-none mb-8">
                                                                    {language === 'id' ? 'Tahun Pengalaman' : 'Years of Experience'}
                                                                </div>
                                                                <div className="space-y-4">
                                                                    {[
                                                                        { label: 'Provinces', val: '34' },
                                                                        { label: 'Branches', val: '20+' },
                                                                        { label: 'Customers', val: '12k+' }
                                                                    ].map(s => (
                                                                        <div key={s.label} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0 border-dashed">
                                                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{s.label}</span>
                                                                            <span className="font-black text-slate-900">{s.val}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 2. Business Scope Cards */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-12">
                                                        <h3 className="text-2xl font-black text-slate-900">{language === 'id' ? 'Pilar Bisnis Utama' : 'Core Business Pillars'}</h3>
                                                        <div className="h-px flex-1 bg-slate-100 ml-8 hidden md:block"></div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        {[
                                                            {
                                                                title_id: 'Farmasi', title_en: 'Pharmaceuticals',
                                                                icon: <Activity size={32} />, color: 'from-blue-500 to-cyan-400',
                                                                desc_id: 'Solusi rantai pasok lengkap untuk obat-obatan esensial.',
                                                                desc_en: 'End-to-end supply chain solutions for essential medicines.'
                                                            },
                                                            {
                                                                title_id: 'Alat Kesehatan', title_en: 'Medical Devices',
                                                                icon: <Heart size={32} />, color: 'from-cyan-400 to-emerald-400',
                                                                desc_id: 'Teknologi diagnostik & klinis mutakhir.',
                                                                desc_en: 'Cutting-edge diagnostic & clinical technologies.'
                                                            },
                                                            {
                                                                title_id: 'Consumer Health', title_en: 'Consumer & Beauty',
                                                                icon: <Package size={32} />, color: 'from-emerald-400 to-teal-500',
                                                                desc_id: 'Produk gaya hidup sehat & perawatan diri premium.',
                                                                desc_en: 'Premium healthy lifestyle & personal care products.'
                                                            }
                                                        ].map((scope, i) => (
                                                            <div key={i} className="group relative p-8 rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2">
                                                                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${scope.color} opacity-0 group-hover:opacity-5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity duration-500`}></div>

                                                                <div className="relative z-10">
                                                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${scope.color} text-white flex items-center justify-center mb-8 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                                                        {scope.icon}
                                                                    </div>
                                                                    <h4 className="text-xl font-black text-slate-900 mb-3">{language === 'id' ? scope.title_id : scope.title_en}</h4>
                                                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                                                        {language === 'id' ? scope.desc_id : scope.desc_en}
                                                                    </p>
                                                                </div>

                                                                <div className="absolute bottom-8 right-8 text-slate-200 group-hover:text-cyan-500 transition-colors transform group-hover:translate-x-1">
                                                                    <ArrowUpRight size={24} />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* 3. Competitive Advantages - Mosaic Grid */}
                                                <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                                                    {/* Dark tech background */}
                                                    <div className="absolute inset-0 bg-[#0B1120]"></div>
                                                    <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-900/20 to-transparent opacity-50"></div>

                                                    <div className="relative z-10">
                                                        <div className="text-center max-w-2xl mx-auto mb-16">
                                                            <h3 className="text-3xl font-black mb-4">{language === 'id' ? 'Mengapa Penta Valent?' : 'Why Penta Valent?'}</h3>
                                                            <p className="text-slate-400 text-lg">
                                                                {language === 'id'
                                                                    ? 'Keunggulan strategis yang membedakan kami di pasar yang kompetitif.'
                                                                    : 'Strategic advantages that set us apart in a competitive market.'}
                                                            </p>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                            {[
                                                                {
                                                                    label_id: 'Jaringan Luas', label_en: 'Vast Network',
                                                                    icon: <MapPin size={24} />,
                                                                    desc_id: 'Menjangkau pelosok negeri.', desc_en: 'Reaching remote areas.'
                                                                },
                                                                {
                                                                    label_id: 'Teknologi Cerdas', label_en: 'Smart Tech',
                                                                    icon: <Activity size={24} />,
                                                                    desc_id: 'Logistik berbasis data.', desc_en: 'Data-driven logistics.'
                                                                },
                                                                {
                                                                    label_id: 'Kepatuhan Total', label_en: 'Full Compliance',
                                                                    icon: <Shield size={24} />,
                                                                    desc_id: 'Standar CDOB ketat.', desc_en: 'Strict CDOB standards.'
                                                                },
                                                                {
                                                                    label_id: 'Mitra Global', label_en: 'Global Partners',
                                                                    icon: <Users size={24} />,
                                                                    desc_id: 'Prinsipal kelas dunia.', desc_en: 'World-class principals.'
                                                                }
                                                            ].map((adv, i) => (
                                                                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all group">
                                                                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-6 group-hover:text-white group-hover:bg-cyan-500 transition-colors">
                                                                        {adv.icon}
                                                                    </div>
                                                                    <h5 className="text-lg font-bold mb-2">{language === 'id' ? adv.label_id : adv.label_en}</h5>
                                                                    <p className="text-sm text-slate-500 font-medium group-hover:text-slate-300 transition-colors">{language === 'id' ? adv.desc_id : adv.desc_en}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 4. Highlight Stats */}
                                                <div>
                                                    <div className="flex items-center gap-4 mb-8">
                                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{language === 'id' ? 'Sorotan Kinerja' : 'Performance Highlights'}</h3>
                                                        <div className="h-px flex-1 bg-slate-200"></div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                        {highlights.map((h, i) => (
                                                            <div key={i} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-transparent transition-all duration-300">
                                                                <div className="flex items-start justify-between mb-8">
                                                                    <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-sm group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                                                        {getIcon(h.icon_name)}
                                                                    </div>
                                                                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                                                                        <TrendingUp size={10} /> {h.growth}
                                                                    </div>
                                                                </div>
                                                                <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-cyan-600 transition-colors">{h.value}</h3>
                                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                                    {language === 'id' ? h.label_id : h.label_en}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {getSlug() === 'informasi-saham' && (
                                            <div className="space-y-12">
                                                {/* 1. Main Market Chart & Live Ticker */}
                                                <div className="bg-white rounded-[3rem] border border-slate-100 p-8 md:p-12 shadow-xl shadow-slate-200/50">
                                                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                                                        <div>
                                                            <h3 className="text-2xl font-black tracking-tight uppercase italic text-cyan-600 mb-2">Market Performance</h3>
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Real-time Trading Overview (IDX:PEVE)</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <div className="px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase bg-cyan-600 text-white shadow-lg shadow-cyan-500/20">
                                                                Live Chart
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                                        {/* Main Chart */}
                                                        <div className="lg:col-span-8 h-[550px] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner bg-white">
                                                            <StockSymbolOverview symbol="PEVE" theme="light" height={550} />
                                                        </div>

                                                        {/* Technical Analysis Side Gauge */}
                                                        <div className="lg:col-span-4 flex flex-col gap-6">
                                                            <div className="h-[430px] rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-50/50 p-6 flex flex-col">
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <Activity size={16} className="text-cyan-600" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Technical Gauge</span>
                                                                </div>
                                                                <div className="flex-1 min-h-0">
                                                                    <TechnicalAnalysis symbol="PEVE" theme="light" />
                                                                </div>
                                                            </div>

                                                            <div className="p-8 rounded-[2rem] bg-slate-900 text-white flex flex-col justify-center">
                                                                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Current Price</div>
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-4xl font-black tracking-tighter">PEVE</span>
                                                                </div>
                                                                <div className="mt-4 w-full scale-110 origin-left">
                                                                    <StockPriceTicker symbol="PEVE" theme="dark" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-start gap-3 opacity-70">
                                                        <Info size={16} className="text-cyan-600 shrink-0 mt-0.5" />
                                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.05em] leading-relaxed">
                                                            {language === 'id'
                                                                ? 'Disclaimer: Data bersifat informatif dan bukan merupakan rekomendasi atau ajakan untuk membeli/menjual instrumen keuangan apapun.'
                                                                : 'Disclaimer: Data is for informational purposes only and does not constitute a recommendation or solicitation to buy or sell any financial instruments.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* 2. Financial Performance & Key Ratios */}
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                                    {/* Live Financial Widget */}
                                                    <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/30">
                                                        <div className="flex items-center gap-3 mb-10">
                                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                                <TrendingUp size={20} />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-black text-slate-900">{language === 'id' ? 'Kinerja Finansial' : 'Financial Performance'}</h3>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Income Statement & Balance Sheet Snapshot</p>
                                                            </div>
                                                        </div>
                                                        <div className="h-[500px] w-full bg-slate-50/30 rounded-[2rem] overflow-hidden border border-slate-50">
                                                            <StockFinancials symbol="PEVE" theme="light" />
                                                        </div>
                                                    </div>

                                                    {/* Key Ratios Column */}
                                                    <div className="lg:col-span-4 space-y-6">
                                                        {ratios.map((ratio, i) => (
                                                            <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-lg shadow-slate-200/20 group hover:border-cyan-500/30 transition-all flex items-center justify-between">
                                                                <div>
                                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{ratio.label}</div>
                                                                    <div className="text-3xl font-black text-slate-900">{ratio.value}</div>
                                                                    <div className="text-[10px] font-medium text-slate-400 italic">
                                                                        {language === 'id' ? ratio.description_id : ratio.description_en}
                                                                    </div>
                                                                </div>
                                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-cyan-500 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all transform group-hover:rotate-6">
                                                                    {getIcon(ratio.icon_name)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* 3. Key Statistics & Market Overview (Reliable Data) */}
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                                    <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/30">
                                                        <div className="flex items-center gap-3 mb-8">
                                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                                <BarChart3 size={20} />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-black text-slate-900">{language === 'id' ? 'Statistik Kunci & Ringkasan Pasar' : 'Key Statistics & Market Overview'}</h3>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Valuation & Price Summary</p>
                                                            </div>
                                                        </div>

                                                        {/* Symbol Info is much more reliable for IDX stocks */}
                                                        <div className="bg-slate-50/50 rounded-[2rem] p-4 border border-slate-50 mb-8">
                                                            <SymbolInfo symbol="PEVE" theme="light" />
                                                        </div>

                                                        {/* Direct Database Stats Grid */}
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            {ratios.map((ratio, i) => (
                                                                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{ratio.label}</div>
                                                                    <div className="text-xl font-black text-slate-900">{ratio.value}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Side Gauge - Mini Technical Analysis */}
                                                    <div className="lg:col-span-4 space-y-6">
                                                        <div className="p-10 bg-slate-900 rounded-[3rem] text-white h-full flex flex-col justify-between overflow-hidden relative group">
                                                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl transition-all group-hover:bg-cyan-500/20"></div>
                                                            <div className="relative z-10">
                                                                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-4">Investment Rating</div>
                                                                <h4 className="text-2xl font-black mb-6">Technical Signal</h4>
                                                                <div className="h-[280px] w-full">
                                                                    <TechnicalAnalysis symbol="PEVE" theme="dark" />
                                                                </div>
                                                            </div>
                                                            <div className="relative z-10 pt-6 border-t border-white/10 mt-auto">
                                                                <p className="text-[9px] font-medium text-white/40 italic leading-relaxed">
                                                                    * {language === 'id' ? 'Sinyal teknikal berdasarkan indikator rata-rata pergerakan real-time.' : 'Technical signal based on real-time moving average indicators.'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 4. Financial Statements & Data Analysis */}
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                                    {/* Company Profile (Issuer Info) */}
                                                    <div className="lg:col-span-5 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/30">
                                                        <div className="flex items-center gap-3 mb-8">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                                                                <Building2 size={20} />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-black text-slate-900">{language === 'id' ? 'Profil Emiten' : 'Issuer Profile'}</h3>
                                                            </div>
                                                        </div>
                                                        <div className="h-[430px] w-full bg-slate-50/10 rounded-[2rem] overflow-hidden border border-slate-50">
                                                            <CompanyProfileWidget symbol="PEVE" theme="light" />
                                                        </div>
                                                    </div>

                                                    {/* Financial Statement Widget */}
                                                    <div className="lg:col-span-7 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/30">
                                                        <div className="flex items-center gap-3 mb-8">
                                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                                <TrendingUp size={20} />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-black text-slate-900">{language === 'id' ? 'Laporan Keuangan' : 'Financial Statement'}</h3>
                                                            </div>
                                                        </div>
                                                        <div className="h-[430px] w-full bg-slate-50/10 rounded-[2rem] overflow-hidden border border-slate-50">
                                                            <StockFinancials symbol="PEVE" theme="light" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Shareholder & Dividend Section (Redesigned) */}
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                    {/* Shareholder Structure */}
                                                    <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50">
                                                        <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                                                            <Users className="text-cyan-500" /> {language === 'id' ? 'Struktur Pemegang Saham' : 'Shareholder Structure'}
                                                        </h3>
                                                        <div className="space-y-6">
                                                            {shareholders.map((holder, i) => (
                                                                <div key={holder.name} className="space-y-2">
                                                                    <div className="flex justify-between items-end">
                                                                        <span className="font-bold text-slate-700">{holder.name}</span>
                                                                        <span className="font-black text-slate-900">{holder.percentage}%</span>
                                                                    </div>
                                                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            whileInView={{ width: `${holder.percentage}%` }}
                                                                            viewport={{ once: true }}
                                                                            transition={{ duration: 1, delay: i * 0.2 }}
                                                                            className={`h-full bg-gradient-to-r ${holder.color_start} ${holder.color_end} rounded-full`}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <p className="mt-8 text-[11px] text-slate-400 italic">
                                                            * {language === 'id' ? 'Berdasarkan data terakhir per 31 Desember 2024' : 'Based on latest data as of 31 December 2024'}
                                                        </p>
                                                    </div>

                                                    {/* Dividend History (Visual Metaphor) */}
                                                    <div className="p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                                                            <Award size={180} />
                                                        </div>
                                                        <h3 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10">
                                                            <TrendingUp className="text-cyan-400" /> {language === 'id' ? 'Hasil Dividen' : 'Dividend Yield'}
                                                        </h3>
                                                        <div className="relative z-10">
                                                            <div className="text-6xl font-black text-cyan-400 mb-4">4.2%</div>
                                                            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                                                                {language === 'id'
                                                                    ? 'Kami secara konsisten membagikan dividen sebagai bentuk apresiasi atas kepercayaan pemegang saham kami selama 3 tahun terakhir.'
                                                                    : 'We consistently distribute dividends as a gesture of appreciation for our shareholders\' trust over the past 3 years.'}
                                                            </p>
                                                            <div className="flex items-center gap-4">
                                                                {dividends.map((div, i) => (
                                                                    <div key={i} className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-xs font-bold">
                                                                        {div.year}: {div.amount}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* DOCUMENT LIST RENDERING FOR OTHER SLUGS */}
                                        {(['laporan-keuangan', 'prospektus', 'rups', 'keterbukaan-informasi'].includes(getSlug())) && (
                                            <div className="space-y-8">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                                        {getSlug() === 'rups' ? <Clock size={16} /> : <FileText size={16} />}
                                                        {getSlug() === 'rups'
                                                            ? (language === 'id' ? 'Riwayat & Jadwal' : 'History & Schedule')
                                                            : (language === 'id' ? 'Arsip Dokumen' : 'Document Archive')
                                                        }
                                                    </h3>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
                                                            <span className="text-sm font-bold text-slate-500">Filter Year:</span>
                                                            <select
                                                                value={selectedYear}
                                                                onChange={(e) => setSelectedYear(e.target.value)}
                                                                className="bg-transparent font-bold text-base text-slate-800 border-none outline-none cursor-pointer hover:text-cyan-600 transition-colors pr-8"
                                                            >
                                                                <option value="All Years">All Years</option>
                                                                {[...new Set(documents.map(d => d.year))].sort((a, b) => b - a).map(year => (
                                                                    <option key={year} value={year}>{year}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        {['laporan-keuangan', 'keterbukaan-informasi', 'prospektus', 'rups'].includes(getSlug()) && (
                                                            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
                                                                <span className="text-sm font-bold text-slate-500">Filter Type:</span>
                                                                <select
                                                                    value={selectedCategory}
                                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                                    className="bg-transparent font-bold text-base text-slate-800 border-none outline-none cursor-pointer hover:text-cyan-600 transition-colors pr-8"
                                                                >
                                                                    <option value="All Categories">All Categories</option>

                                                                    {getSlug() === 'laporan-keuangan' && (
                                                                        <>
                                                                            <option value="financial_report">Financial Statements</option>
                                                                            <option value="annual_report">Annual Report</option>
                                                                            <option value="sustainability_report">Sustainability Report</option>
                                                                            <option value="audit_report">Audit Report</option>
                                                                        </>
                                                                    )}

                                                                    {getSlug() === 'keterbukaan-informasi' && (
                                                                        <>
                                                                            <option value="ojk_disclosure">OJK Disclosure</option>
                                                                            <option value="corporate_action">Corporate Action</option>
                                                                            <option value="bei_announcement">IDX Announcement</option>
                                                                            <option value="management_change">Management Changes</option>
                                                                        </>
                                                                    )}

                                                                    {getSlug() === 'prospektus' && (
                                                                        <>
                                                                            <option value="initial_prospectus">Initial Prospectus</option>
                                                                            <option value="final_prospectus">Final Prospectus</option>
                                                                            <option value="ojk_effective">OJK Statement</option>
                                                                        </>
                                                                    )}

                                                                    {getSlug() === 'rups' && (
                                                                        <>
                                                                            <option value="rups_annual">Annual GMS</option>
                                                                            <option value="rups_extraordinary">Extraordinary GMS</option>
                                                                            <option value="rups_materials">Materials & Minutes</option>
                                                                        </>
                                                                    )}
                                                                </select>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4">
                                                    {documents
                                                        .filter(doc => {
                                                            const matchesSlug = (() => {
                                                                if (getSlug() === 'laporan-keuangan') return ['financial_report', 'annual_report', 'sustainability_report', 'audit_report'].includes(doc.document_type);
                                                                if (getSlug() === 'prospektus') return ['prospectus', 'initial_prospectus', 'final_prospektus', 'ojk_effective'].includes(doc.document_type);
                                                                if (getSlug() === 'rups') return ['rups_report', 'rups_annual', 'rups_extraordinary', 'rups_materials'].includes(doc.document_type);
                                                                if (getSlug() === 'keterbukaan-informasi') return ['ojk_disclosure', 'public_disclosure', 'corporate_action', 'bei_announcement', 'management_change'].includes(doc.document_type);
                                                                return true;
                                                            })();

                                                            const matchesYear = selectedYear === 'All Years' || doc.year.toString() === selectedYear;

                                                            const matchesCategory = selectedCategory === 'All Categories' || doc.document_type === selectedCategory;

                                                            return matchesSlug && matchesYear && matchesCategory;
                                                        })
                                                        .sort((a, b) => {
                                                            // Custom Sorting for Prospectus Page
                                                            if (getSlug() === 'prospektus') {
                                                                const priority: Record<string, number> = {
                                                                    'final_prospectus': 4,
                                                                    'ojk_effective': 3,
                                                                    'prospectus': 2,
                                                                    'initial_prospectus': 1
                                                                };
                                                                const typeA = priority[a.document_type] || 0;
                                                                const typeB = priority[b.document_type] || 0;

                                                                // Primary sort: Priority Descending
                                                                if (typeA !== typeB) return typeB - typeA;

                                                                // Secondary sort: Year Descending
                                                                return b.year - a.year;
                                                            }
                                                            // Default for others: Just Year Descending (DB already does this mostly, but safe to enforce)
                                                            return b.year - a.year;
                                                        })
                                                        .map((doc) => (
                                                            <div key={doc.id} className="group p-8 bg-white border border-slate-100 rounded-[2rem] hover:shadow-2xl hover:shadow-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
                                                                <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                                <div className="flex items-center gap-6">
                                                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-sm">
                                                                        <FileText size={28} />
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mb-1">
                                                                            {doc.document_type.replace(/_/g, ' ')} • {doc.year} {doc.quarter ? `• ${doc.quarter}` : ''}
                                                                        </div>
                                                                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors flex items-center gap-2 flex-wrap">
                                                                            {language === 'id' ? doc.title_id : doc.title_en}

                                                                            {getSlug() === 'laporan-keuangan' && (
                                                                                <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${(doc.document_type === 'annual_report' || doc.document_type === 'audit_report')
                                                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                                                    : 'bg-amber-50 text-amber-600 border-amber-200'
                                                                                    }`}>
                                                                                    {(doc.document_type === 'annual_report' || doc.document_type === 'audit_report')
                                                                                        ? 'Audited'
                                                                                        : 'Unaudited'}
                                                                                </span>
                                                                            )}

                                                                            {getSlug() === 'rups' && (
                                                                                <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${doc.document_type === 'rups_annual'
                                                                                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                                                                                    : 'bg-orange-50 text-orange-600 border-orange-200'
                                                                                    }`}>
                                                                                    {doc.document_type === 'rups_annual' ? 'RUPST' : 'RUPS-LB'}
                                                                                </span>
                                                                            )}

                                                                            {getSlug() === 'keterbukaan-informasi' && (
                                                                                <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${
                                                                                    // Badge Colors Logic
                                                                                    doc.document_type === 'ojk_disclosure' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                                                                        doc.document_type === 'corporate_action' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                                                            doc.document_type === 'management_change' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                                                                                                'bg-slate-50 text-slate-600 border-slate-200' // bei_announcement
                                                                                    }`}>
                                                                                    {(() => {
                                                                                        switch (doc.document_type) {
                                                                                            case 'ojk_disclosure': return 'Keterbukaan Informasi OJK';
                                                                                            case 'corporate_action': return 'Aksi Korporasi';
                                                                                            case 'management_change': return 'Perubahan Manajemen';
                                                                                            default: return 'Pengumuman Bursa';
                                                                                        }
                                                                                    })()}
                                                                                </span>
                                                                            )}
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                                <a
                                                                    href={doc.file_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-lg"
                                                                >
                                                                    <Download size={16} /> {t('investor.docs.download')}
                                                                </a>
                                                            </div>
                                                        ))}

                                                    {documents.filter(doc => {
                                                        if (getSlug() === 'laporan-keuangan') return ['financial_report', 'annual_report'].includes(doc.document_type);
                                                        if (getSlug() === 'prospektus') return doc.document_type === 'prospectus';
                                                        if (getSlug() === 'rups') return doc.document_type === 'rups_report';
                                                        if (getSlug() === 'keterbukaan-informasi') return ['ojk_disclosure', 'public_disclosure', 'corporate_action', 'bei_announcement', 'management_change'].includes(doc.document_type);
                                                        return true;
                                                    }).length === 0 && (
                                                            <div className="py-20 text-center text-slate-400 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                                                                <Info size={48} className="mx-auto mb-4 opacity-20" />
                                                                <p className="font-bold italic uppercase tracking-widest text-[10px]">{t('investor.docs.empty')}</p>
                                                            </div>
                                                        )}

                                                    {/* Compliance Disclaimer (Mandatory) */}
                                                    {getSlug() === 'laporan-keuangan' && (
                                                        <div className="mt-8 pt-8 border-t border-slate-100 flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                                            <Shield size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                                            <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                                                                {language === 'id'
                                                                    ? "Seluruh laporan disusun sesuai dengan Standar Akuntansi Keuangan (SAK) yang berlaku di Indonesia dan telah diaudit oleh Kantor Akuntan Publik terdaftar (jika berlaku)."
                                                                    : "All reports are prepared in accordance with the Financial Accounting Standards (SAK) applicable in Indonesia and have been audited by a registered Public Accounting Firm (if applicable)."}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {getSlug() === 'rups' && (
                                                        <div className="mt-8 pt-8 border-t border-slate-100 flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                                            <Briefcase size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                                            <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                                                                {language === 'id'
                                                                    ? "Seluruh dokumen Rapat Umum Pemegang Saham ini disampaikan sebagai bentuk keterbukaan informasi Perseroan sesuai dengan ketentuan Otoritas Jasa Keuangan dan Bursa Efek Indonesia."
                                                                    : "All General Meeting of Shareholders documents are submitted as a form of Company information disclosure in accordance with the provisions of the Financial Services Authority and the Indonesia Stock Exchange."}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {getSlug() === 'prospektus' && (
                                                        <div className="mt-8 pt-8 border-t border-slate-100 flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                                            <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                                            <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                                                                {language === 'id'
                                                                    ? "Dokumen prospektus ini diterbitkan sebagai bagian dari proses Penawaran Umum dan telah dinyatakan efektif oleh Otoritas Jasa Keuangan (OJK). Informasi yang tercantum di dalamnya bersifat historis dan sesuai dengan ketentuan peraturan perundang-undangan yang berlaku pada saat penerbitan."
                                                                    : "This prospectus document is published as part of the Public Offering process and has been declared effective by the Financial Services Authority (OJK). The information contained therein is historical and in accordance with the provisions of laws and regulations applicable at the time of issuance."}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {getSlug() === 'keterbukaan-informasi' && (
                                                        <div className="mt-8 pt-8 border-t border-slate-100 flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                                            <Shield size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                                            <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                                                                {language === 'id'
                                                                    ? "Keterbukaan Informasi ini disampaikan sesuai dengan ketentuan Peraturan Otoritas Jasa Keuangan dan Bursa Efek Indonesia untuk memastikan terpenuhinya prinsip transparansi kepada publik."
                                                                    : "This Information Disclosure is submitted in accordance with the provisions of the Financial Services Authority and Indonesia Stock Exchange regulations to ensure the fulfillment of transparency principles to the public."}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Sidebar Area */}
                            {getSlug() !== 'informasi-saham' && (
                                <div className="lg:col-span-4">
                                    <div className="sticky top-32 space-y-10">
                                        {/* Sub Navigation */}
                                        <div className="p-10 rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
                                            <h3 className="text-xl font-black mb-8">{t('investor.nav.title')}</h3>
                                            <div className="space-y-4">
                                                {[
                                                    'ringkasan-investor', 'informasi-saham', 'laporan-keuangan',
                                                    'prospektus', 'rups', 'keterbukaan-informasi'
                                                ].map((s) => (
                                                    <a
                                                        key={s}
                                                        href={`/investor/${s}`}
                                                        className={`flex items-center justify-between p-5 rounded-2xl transition-all ${getSlug() === s ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'hover:bg-slate-50 text-slate-600'}`}
                                                    >
                                                        <span className="font-bold text-sm tracking-tight">{getTitle(s, language)}</span>
                                                        <ChevronRight size={16} />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Calendar Sidebar (Only show on relevant pages) */}
                                        {(getSlug() === 'rups' || getSlug() === 'ringkasan-investor') && (
                                            <div className="p-10 rounded-[2.5rem] border border-slate-100 bg-slate-50/50">
                                                <div className="flex items-center justify-between mb-8">
                                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">{t('investor.calendar.upcoming')}</h3>
                                                    <Calendar size={20} className="text-cyan-500" />
                                                </div>
                                                <div className="space-y-8">
                                                    {calendar.map((event, i) => (
                                                        <div key={i} className="flex gap-4">
                                                            <div className="w-12 text-center">
                                                                <div className="text-lg font-black text-slate-900 leading-none">{new Date(event.event_date).getDate()}</div>
                                                                <div className="text-[10px] font-black text-cyan-600 uppercase">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{event.event_type}</div>
                                                                <div className="text-[13px] font-bold text-slate-800 leading-tight">{language === 'id' ? event.title_id : event.title_en}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Sidebar CTA */}
                                        <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                                <Briefcase size={120} />
                                            </div>
                                            <h3 className="text-2xl font-black mb-6 relative z-10">{t('investor.contact.title')}</h3>
                                            <p className="text-slate-300 mb-8 relative z-10 font-medium italic text-sm">
                                                {t('investor.contact.desc')}
                                            </p>
                                            <div className="space-y-4 relative z-10">
                                                <a href="mailto:ir@pentavalent.co.id" className="flex items-center justify-between p-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group/mail">
                                                    <span className="font-bold text-xs tracking-widest uppercase">{t('investor.contact.button')}</span>
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default InvestorPage;
