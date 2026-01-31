
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import PageSlider from '../../../components/common/PageSlider';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, TrendingUp, PieChart, FileSearch, Users, Info,
    Download, Calendar, ChevronRight, ArrowRight, Shield,
    Activity, ArrowUpRight, ArrowDownRight, BarChart3, Clock,
    Globe, Briefcase, Award, ExternalLink
} from 'lucide-react';
import { StockSymbolOverview, StockPriceTicker } from '../../../components/investor/TradingViewWidgets';

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
                    breadcrumbLabel={language === 'id' ? 'Hubungan Investor' : 'Investor Relations'}
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
                                    className={`font-black text-slate-900 mb-8 tracking-tighter ${getSlug() === 'informasi-saham' ? 'text-4xl md:text-5xl' : 'text-5xl md:text-7xl'}`}
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
                                        className="space-y-12"
                                    >
                                        {/* RENDER CONTENT BASED ON SLUG */}
                                        {getSlug() === 'ringkasan-investor' && (
                                            <div className="space-y-16">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    {highlights.map((h, i) => (
                                                        <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:wow-border-glow transition-all">
                                                            <div className="w-14 h-14 rounded-2xl bg-cyan-500 text-white flex items-center justify-center mb-8 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                                                                {getIcon(h.icon_name)}
                                                            </div>
                                                            <h3 className="text-4xl font-black text-slate-900 mb-2">{h.value}</h3>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                                                {language === 'id' ? h.label_id : h.label_en}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-green-500 font-bold text-xs">
                                                                <ArrowUpRight size={14} /> {h.growth} Growth
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="p-12 rounded-[3rem] enterprise-gradient text-white relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-12 opacity-10">
                                                        <Shield size={160} />
                                                    </div>
                                                    <h3 className="text-3xl font-black mb-6 italic">{t('about.vision.title')}</h3>
                                                    <p className="text-cyan-50/70 text-lg leading-relaxed mb-8 max-w-2xl">
                                                        {language === 'id'
                                                            ? 'Kami berkomitmen untuk memberikan nilai maksimal bagi pemegang saham melalui tata kelola yang transparan dan strategi pertumbuhan jangka panjang yang kokoh.'
                                                            : 'We are committed to delivering maximum value for shareholders through transparent governance and robust long-term growth strategies.'}
                                                    </p>
                                                    <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all">
                                                        {t('hero.cta1')}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {getSlug() === 'informasi-saham' && (
                                            <div className="space-y-12">
                                                <div className="bg-white rounded-[3rem] border border-slate-100 p-8 md:p-12 shadow-xl shadow-slate-200/50">
                                                    <div className="flex items-center justify-between mb-12">
                                                        <h3 className="text-2xl font-black tracking-tight uppercase italic text-cyan-600">Trading Info</h3>
                                                        <div className="flex gap-2">
                                                            {['1D', '1W', '1M', '1Q', '1Y'].map(t => (
                                                                <button key={t} className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${t === '1W' ? 'bg-cyan-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-cyan-500 hover:text-white'}`}>
                                                                    {t}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col lg:flex-row gap-12">
                                                        {/* Summary Table - Left Side */}
                                                        <div className="lg:w-1/3 border border-slate-100 rounded-[2rem] p-8 bg-slate-50/50">
                                                            <div className="space-y-4">
                                                                {[
                                                                    { label: 'Date', value: '30 January 2026' },
                                                                    { label: 'Time', value: '16:16:49' },
                                                                    { label: 'High', value: '595' },
                                                                    { label: 'Low', value: '565' },
                                                                    { label: 'Last', value: '570' },
                                                                    { label: 'Value', value: '143.51B' },
                                                                    { label: 'Volume', value: '248.8K' },
                                                                    { label: 'Frequency', value: '87' },
                                                                    { label: 'Market Cap', value: '1.76T' },
                                                                ].map((row, idx) => (
                                                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 border-dashed">
                                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{row.label}</span>
                                                                        <span className="text-[13px] font-black text-slate-900">{row.value}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Real TradingView Chart - Right Side */}
                                                        <div className="lg:w-2/3 h-[500px] rounded-[2rem] overflow-hidden border border-slate-100 shadow-inner bg-white">
                                                            <StockSymbolOverview symbol="PEVE" theme="light" height={500} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Key Ratios Section */}
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                                    {ratios.map((ratio, i) => (
                                                        <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group hover:wow-border-glow transition-all">
                                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-cyan-600 flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                                                {getIcon(ratio.icon_name)}
                                                            </div>
                                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{ratio.label}</div>
                                                            <div className="text-3xl font-black text-slate-900 mb-2">{ratio.value}</div>
                                                            <div className="text-[11px] font-medium text-slate-400 italic">
                                                                {language === 'id' ? ratio.description_id : ratio.description_en}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Shareholder & Dividend Section */}
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
                                                        <Clock size={16} /> {t('investor.calendar.upcoming')}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-slate-400">Filter Year:</span>
                                                        <select className="bg-transparent font-black text-[10px] uppercase tracking-widest border-none outline-none text-cyan-600">
                                                            <option>2024</option>
                                                            <option>2023</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4">
                                                    {documents
                                                        .filter(doc => {
                                                            if (getSlug() === 'laporan-keuangan') return ['financial_report', 'annual_report'].includes(doc.document_type);
                                                            if (getSlug() === 'prospektus') return doc.document_type === 'prospectus';
                                                            if (getSlug() === 'rups') return doc.document_type === 'rups_report';
                                                            if (getSlug() === 'keterbukaan-informasi') return doc.document_type === 'public_disclosure';
                                                            return true;
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
                                                                            {doc.document_type.replace('_', ' ')} • {doc.year} {doc.quarter ? `• ${doc.quarter}` : ''}
                                                                        </div>
                                                                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                                                                            {language === 'id' ? doc.title_id : doc.title_en}
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
                                                        if (getSlug() === 'keterbukaan-informasi') return doc.document_type === 'public_disclosure';
                                                        return true;
                                                    }).length === 0 && (
                                                            <div className="py-20 text-center text-slate-400 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                                                                <Info size={48} className="mx-auto mb-4 opacity-20" />
                                                                <p className="font-bold italic uppercase tracking-widest text-[10px]">{t('investor.docs.empty')}</p>
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
