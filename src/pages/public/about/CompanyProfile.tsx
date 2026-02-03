import React, { useState, useEffect, useRef } from 'react';
import PageSlider from '../../../components/common/PageSlider';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { motion, animate, useInView } from 'framer-motion';
import { Building2, History, Award, Users, ArrowRight, Target, ShieldCheck, Mail, TrendingUp, CheckCircle2 } from 'lucide-react';

interface CompanyInfo {
    tagline_id: string;
    tagline_en: string;
    title_text_id: string;
    title_text_en: string;
    title_italic_id: string;
    title_italic_en: string;
    description_id: string;
    description_en: string;
    image_url: string;
    stats_years_value: string;
    stats_years_label_id: string;
    stats_years_label_en: string;
    stats_public_value: string;
    stats_public_label_id: string;
    stats_public_label_en: string;
    vision_text_id: string;
    vision_text_en: string;
    mission_text_id: string;
    mission_text_en: string;
}

interface TimelineEvent {
    id: string;
    year: string;
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    sort_order: number;
}

interface ManagementMember {
    id: string;
    name: string;
    position_id: string;
    position_en: string;
    bio_id: string;
    bio_en: string;
    image_url: string;
    sort_order: number;
}

const AnimatedNumber = ({ value }: { value: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            const numericValue = parseInt(value.replace(/\D/g, ''), 10);
            const hasPlus = value.includes('+');
            const isYear = value.length === 4 && !hasPlus;

            const controls = animate(0, numericValue, {
                duration: 2.5,
                ease: [0.16, 1, 0.3, 1],
                onUpdate: (latest) => {
                    if (ref.current) {
                        let formatted = Math.floor(latest).toString();
                        if (!isYear && numericValue >= 1000) {
                            formatted = Math.floor(latest).toLocaleString('id-ID');
                        }
                        ref.current.textContent = formatted + (hasPlus ? '+' : '');
                    }
                }
            });
            return () => controls.stop();
        }
    }, [inView, value]);

    return <span ref={ref}>0</span>;
};

const CompanyProfile: React.FC = () => {
    const { language, t } = useLanguage();
    const [info, setInfo] = useState<CompanyInfo | null>(null);
    const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
    const [commissioners, setCommissioners] = useState<ManagementMember[]>([]);
    const [directors, setDirectors] = useState<ManagementMember[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Force update to clear stale cache
    const handleNavigate = (section: string) => {
        if (section === 'contact') window.location.href = '/contact';
        else if (section === 'faq') window.location.href = '/faq';
        else if (section === 'sitemap') window.location.href = '/sitemap';
        else window.location.href = `/#${section}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: infoData } = await supabase.from('company_info').select('*').single();
                const { data: timelineData } = await supabase
                    .from('company_timeline')
                    .select('*')
                    .eq('is_active', true)
                    .order('year', { ascending: true });

                const { data: mgmtData } = await supabase
                    .from('management')
                    .select('*')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true });

                const { data: settingsData } = await supabase.from('site_settings').select('company_stats').single();
                setSettings(settingsData);

                setInfo(infoData);
                setTimeline(timelineData || []);

                if (mgmtData) {
                    setCommissioners(mgmtData.filter(m => m.position_en.toLowerCase().includes('commissioner')));
                    setDirectors(mgmtData.filter(m => m.position_en.toLowerCase().includes('director') || m.position_en.toLowerCase().includes('president')));
                }
            } catch (error) {
                console.error('Error fetching company profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header onNavigate={handleNavigate} activeSection="about" />
                <div className="h-[60vh] flex items-center justify-center">
                    <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
                <Footer onNavigate={handleNavigate} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <Header onNavigate={handleNavigate} activeSection="about" />

            <PageSlider
                pagePath="/about/profile"
                breadcrumbLabel={language === 'id' ? 'Profil Perusahaan' : 'Company Profile'}
                parentLabel={language === 'id' ? 'Tentang Kami' : 'About Us'}
            />

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 -mt-24 md:-mt-32">
                {/* Premium "Penta Valent by Number" Section - Artistic & Sweet Layout */}
                <div className="relative mb-32 group">
                    {/* Background Decorative Glows */}
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-1000"></div>
                    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-1000"></div>

                    {/* Main Card - Removed overflow-hidden to allow decor to float */}
                    <div className="bg-white/80 backdrop-blur-2xl rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-white/60 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">

                            {/* Left: Artistic Visual Composition - Expanded for Balance */}
                            <div className="lg:col-span-6 relative flex items-center justify-center p-6 md:p-8 lg:p-16 lg:min-h-[750px]">
                                <div className="relative w-full h-full max-w-lg lg:max-w-xl">
                                    {/* Main Masked Building - Dynamic from Admin */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="relative z-20 w-full aspect-[4/5] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white group/img bg-slate-200"
                                    >
                                        <img
                                            src={info?.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"}
                                            alt="Corporate Majesty"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000";
                                            }}
                                            className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover/img:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"></div>

                                        {/* Floating Glass Label */}
                                        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 p-4 md:p-6 bg-white/20 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/30">
                                            <div className="text-[10px] font-black text-cyan-100 uppercase tracking-[0.3em] mb-1">Corporate Visual</div>
                                            <div className="text-lg md:text-xl font-black text-white md:italic tracking-tighter">PT PENTA VALENT Tbk</div>
                                        </div>
                                    </motion.div>

                                    {/* Floating Decorative Glass Plates - Repositioned to avoid clipping */}
                                    <motion.div
                                        animate={{ y: [0, -20, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl rounded-[3rem] border border-white/40 shadow-xl z-30 hidden lg:flex items-center justify-center p-4 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent)]"></div>
                                        </div>
                                        <div className="text-center relative z-10">
                                            <TrendingUp size={40} className="text-primary mx-auto mb-3" />
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Consistent Growth</div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        animate={{ y: [0, -15, 0] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute bottom-20 -left-6 w-56 h-36 bg-slate-900 shadow-[0_40px_80px_rgba(0,0,0,0.4)] rounded-[2.5rem] z-30 hidden lg:flex items-center justify-between px-10 border border-white/10"
                                    >
                                        <div className="text-left py-2">
                                            <div className="text-3xl md:text-5xl font-black text-primary md:italic leading-none">PEVE</div>
                                            <div className="text-[10px] md:text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-3 md:italic">IDX STOCK CODE</div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right: Sweeter Stats & Detail Section - Perfectly Centered */}
                            <div className="lg:col-span-6 flex flex-col justify-center p-8 md:p-12 lg:p-24 text-left">
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="inline-flex items-center gap-4 mb-8">
                                        <div className="w-16 h-1 bg-gradient-to-r from-primary to-cyan-500 rounded-full"></div>
                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Corporate Numbers</span>
                                    </div>

                                    <h2 className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-slate-900 tracking-tighter mb-12 leading-[0.9]">
                                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-cyan-500 md:italic">Excellence</span> <br />
                                        <span className="text-slate-300">Defined by Data</span>
                                    </h2>

                                    {/* Pure & Absolute Stats Grid - No Overlap Version */}
                                    <div className="relative mb-12 md:mb-20 bg-transparent py-4 text-left">
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:gap-x-16 md:gap-y-20 lg:gap-x-24 lg:gap-y-36">
                                            {[
                                                { value: '2023', label_id: 'Melantai di Bursa', label_en: 'Publicly Listed' },
                                                { value: '34', label_id: 'Cabang Nasional', label_en: 'National Branches' },
                                                { value: '21.000+', label_id: 'Outlet Farmasi', label_en: 'Pharma Outlets' },
                                                { value: '14.000+', label_id: 'Outlet Konsumsi', label_en: 'Consumer Outlets' }
                                            ].map((stat: any, idx: number) => (
                                                <div key={idx} className="text-left group relative">
                                                    {/* Soft Glow Background */}
                                                    <div className="absolute -inset-x-4 -inset-y-6 md:-inset-x-8 md:-inset-y-10 bg-blue-50/0 group-hover:bg-blue-50/40 rounded-[2.5rem] transition-all duration-700 -z-10 blur-2xl"></div>

                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                                                        className="relative z-10"
                                                    >
                                                        <div className="text-2xl md:text-4xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tighter leading-none md:italic mb-3 md:mb-5 group-hover:text-primary transition-all duration-500 transform group-hover:translate-x-2">
                                                            <AnimatedNumber value={stat.value} />
                                                        </div>
                                                        <div className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.4em] leading-tight opacity-80 group-hover:opacity-100 group-hover:text-slate-600 transition-all">
                                                            {language === 'id' ? stat.label_id : stat.label_en}
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* IPO Accent Box - Perfectly Compact & Aligned */}
                                    <div className="relative group/ipo overflow-hidden p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] bg-slate-50/50 border border-slate-100/50 transition-all duration-500 hover:shadow-2xl hover:bg-white hover:scale-[1.02] max-w-2xl">
                                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-start gap-6 md:gap-12">
                                            <div className="flex items-center gap-4 md:gap-8">
                                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-xl border border-slate-50 group-hover/ipo:rotate-12 transition-transform duration-500">
                                                    <TrendingUp size={28} className="text-primary md:w-9 md:h-9" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.5em] mb-1 md:mb-2 leading-none">Market Status</div>
                                                    <h3 className="text-lg lg:text-3xl font-black text-slate-900 md:italic tracking-tighter leading-tight">
                                                        {language === 'id' ? 'Saham Terdaftar (IPO) 2023' : 'Publicly Listed (IPO) 2023'}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="px-6 md:px-10 py-3 md:py-4 bg-slate-900 rounded-xl md:rounded-[1.5rem] text-[9px] md:text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] md:tracking-[0.5em] shadow-2xl">
                                                IDX: PEVE
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Corporate Narrative Section - Sweet & Elegant Refinement */}
                <div className="mb-32 text-left relative group">
                    {/* Decorative Background Glows */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_70%)] pointer-events-none"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white/80 backdrop-blur-xl p-12 lg:p-24 rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden"
                    >
                        {/* Artistic Corner Element */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-primary/5 to-cyan-500/5 rounded-full blur-3xl"></div>
                        <div className="absolute top-12 right-12 opacity-10">
                            <Building2 size={120} className="text-primary -rotate-12" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                            {/* Title Column */}
                            <div className="md:w-1/4 shrink-0">
                                <div className="inline-flex items-center gap-3 mb-6">
                                    <div className="w-8 h-px bg-primary/30"></div>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Heritage</span>
                                </div>
                                <h3 className="text-2xl md:text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter italic leading-none">
                                    Profil <br />
                                    <span className="text-primary not-italic">Korporasi</span>
                                </h3>
                                <div className="mt-8 h-1.5 w-16 bg-gradient-to-r from-primary to-cyan-400 rounded-full shadow-[0_3px_10px_rgba(59,130,246,0.3)]"></div>
                            </div>

                            {/* Content Column with Proportional Drop-Cap */}
                            <div className="md:w-3/4">
                                <div
                                    className="prose prose-xl max-w-none 
                                    prose-p:text-slate-500 prose-p:leading-relaxed prose-p:tracking-tight 
                                    prose-strong:text-slate-900 prose-strong:font-black
                                    first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none"
                                    dangerouslySetInnerHTML={{ __html: language === 'id' ? info?.description_id || '' : info?.description_en || '' }}
                                />

                                <div className="mt-12 flex items-center gap-6">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-cyan-500/20"></div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 italic">Dikelola oleh tenaga ahli profesional & berpengalaman</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Our Journey Timeline - Premium Design */}
                <div className="relative">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary/10 to-cyan-500/10 rounded-full text-xs font-black uppercase tracking-widest text-primary mb-6 border border-primary/20">
                            <History size={14} />
                            Timeline
                        </div>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-4">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-500 to-blue-600 italic">Journey</span>
                        </h3>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            {language === 'id' ? 'Perjalanan kami menuju kesuksesan' : 'Our path to excellence and innovation'}
                        </p>
                    </motion.div>

                    {/* Timeline Container */}
                    <div className="relative">
                        {/* Vertical Line with Gradient */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-primary/20 via-cyan-500/20 to-transparent hidden md:block"></div>

                        {/* Timeline Events */}
                        <div className="space-y-12">
                            {timeline.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ delay: index * 0.15, duration: 0.6 }}
                                    className={`relative grid md:grid-cols-2 gap-8 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Year Badge - Center */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
                                        <div className="relative group">
                                            {/* Pulse Animation */}
                                            <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
                                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-2xl shadow-primary/50 border-4 border-white">
                                                <span className="text-white font-black text-sm">{event.year}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className={`${index % 2 === 0 ? 'md:col-start-1 md:text-right' : 'md:col-start-2'}`}>
                                        <div className="group relative">
                                            {/* Mobile Year Badge */}
                                            <div className="md:hidden mb-4">
                                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-cyan-600 rounded-2xl shadow-lg shadow-primary/30">
                                                    <History size={18} className="text-white" />
                                                    <span className="text-white font-black text-lg">{event.year}</span>
                                                </div>
                                            </div>

                                            {/* Card */}
                                            <div className="relative bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                                {/* Decorative Corner */}
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-50"></div>

                                                <div className="relative z-10">
                                                    {/* Title */}
                                                    <h4 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                                                        {language === 'id' ? event.title_id : event.title_en}
                                                    </h4>

                                                    {/* Description */}
                                                    <p className="text-slate-600 leading-relaxed text-base">
                                                        {language === 'id' ? event.description_id : event.description_en}
                                                    </p>

                                                    {/* Decorative Line */}
                                                    <div className={`mt-6 h-1 w-20 bg-gradient-to-r from-primary to-cyan-500 rounded-full ${index % 2 === 0 ? 'md:ml-auto' : ''}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Empty space for alternating layout */}
                                    <div className={`hidden md:block ${index % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1'}`}></div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Bottom Fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </main>

            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default CompanyProfile;
