import React, { useState, useEffect } from 'react';
import PageSlider from '../../../components/common/PageSlider';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { motion } from 'framer-motion';
import { Building2, History, Award, Users, ArrowRight, Target, ShieldCheck, Mail } from 'lucide-react';

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

const CompanyProfile: React.FC = () => {
    const { language, t } = useLanguage();
    const [info, setInfo] = useState<CompanyInfo | null>(null);
    const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
    const [commissioners, setCommissioners] = useState<ManagementMember[]>([]);
    const [directors, setDirectors] = useState<ManagementMember[]>([]);
    const [loading, setLoading] = useState(true);

    // Force update to clear stale cache
    const handleNavigate = (section: string) => {
        window.location.href = `/#${section}`;
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

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10 -mt-24 md:-mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-16">
                        <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative z-10"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
                                    <Building2 size={12} className="text-primary" />
                                    Corporate Identification
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black mb-10 text-slate-900 tracking-tighter leading-tight italic">
                                    {language === 'id' ? info?.title_text_id : info?.title_text_en} <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">
                                        {language === 'id' ? info?.title_italic_id : info?.title_italic_en}
                                    </span>
                                </h2>

                                {/* Legal Descriptor */}
                                <p className="text-sm font-bold text-slate-500 mt-[-1.5rem] mb-10 uppercase tracking-widest leading-relaxed opacity-80">
                                    {language === 'id' ? 'Profil Korporasi PT Penta Valent Tbk' : 'Corporate Profile of PT Penta Valent Tbk'}
                                </p>

                                <div
                                    className="prose prose-lg max-w-none prose-p:text-slate-600 prose-p:leading-relaxed mb-12 prose-headings:font-black prose-headings:text-slate-900 prose-strong:text-slate-800 prose-strong:font-bold prose-ul:list-disc prose-ol:list-decimal"
                                    dangerouslySetInnerHTML={{ __html: (language === 'id' ? info?.description_id : info?.description_en) || '' }}
                                />


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
                                <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
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
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Stats Card */}
                        <div className="bg-slate-900 p-10 rounded-[3rem] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10 space-y-10">
                                <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.3em]">Corporate Pulse</h3>

                                <div className="space-y-12">
                                    <div className="relative">
                                        <div className="text-6xl font-black text-primary tracking-tighter italic mb-2">
                                            {info?.stats_years_value}
                                        </div>
                                        <p className="text-xs font-black text-white/60 uppercase tracking-widest leading-loose">
                                            {language === 'id' ? info?.stats_years_label_id : info?.stats_years_label_en}
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <div className="text-6xl font-black text-cyan-400 tracking-tighter italic mb-2">
                                            {info?.stats_public_value}
                                        </div>
                                        <p className="text-xs font-black text-white/60 uppercase tracking-widest leading-loose">
                                            {language === 'id' ? info?.stats_public_label_id : info?.stats_public_label_en}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/10">
                                    <button onClick={() => handleNavigate('contact')} className="w-full py-5 wow-button-gradient text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 group/btn">
                                        Get in Touch
                                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* News Subscription Style Card */}
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mb-8 border border-slate-100">
                                <Mail size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic mb-4 leading-tight">
                                {language === 'id' ? 'Kredibilitas' : 'Corporate'} <br />
                                <span className="text-primary">{language === 'id' ? 'Korporasi' : 'Credibility'}</span>
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8">
                                PT Penta Valent Tbk has been a trusted leader in medical and pharmaceutical distribution for over 50 years.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-150 transition-transform"></div>
                                    <span className="text-[10px] font-black uppercase text-slate-700">ISO Certified</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:scale-150 transition-transform"></div>
                                    <span className="text-[10px] font-black uppercase text-slate-700">Nationwide Network</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default CompanyProfile;
