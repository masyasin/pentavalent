import React, { useState, useEffect } from 'react';
import PageSlider from '../../../components/common/PageSlider';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { motion } from 'framer-motion';
import { Target, Compass, Sparkles, ShieldCheck, HeartPulse, GraduationCap, Zap, ArrowRight, Heart, Star, Shield, Rocket, Users } from 'lucide-react';

interface CompanyInfo {
    vision_text_id: string;
    vision_text_en: string;
    mission_text_id: string;
    mission_text_en: string;
}

interface CorporateValue {
    id: string;
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    icon_name: string;
}

const VisionMission: React.FC = () => {
    const { language, t } = useLanguage();
    const [info, setInfo] = useState<CompanyInfo | null>(null);
    const [values, setValues] = useState<CorporateValue[]>([]);
    const [loading, setLoading] = useState(true);

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
                const { data: valuesData } = await supabase
                    .from('corporate_values')
                    .select('*')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true });

                setInfo(infoData);
                setValues(valuesData || []);
            } catch (error) {
                console.error('Error fetching vision mission:', error);
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
                pagePath="/about/vision-mission"
                breadcrumbLabel={language === 'id' ? 'Visi & Misi' : 'Vision & Mission'}
                parentLabel={language === 'id' ? 'Tentang Kami' : 'About Us'}
            />

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10 -mt-24 md:-mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Vision Section */}
                    <div className="lg:col-span-8 space-y-12">
                        <section className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors"></div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative z-10"
                            >
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-10 shadow-xl shadow-primary/10">
                                    <Target size={32} />
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black mb-8 text-slate-900 tracking-tight uppercase italic pr-2">
                                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">Vision</span>
                                </h2>

                                <p className="text-xl md:text-2xl font-black text-slate-700 leading-snug italic tracking-tight">
                                    "{language === 'id' ? info?.vision_text_id : info?.vision_text_en}"
                                </p>

                                <div className="w-12 h-1.5 bg-primary mt-12 mb-8 rounded-full"></div>

                                <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
                                    We strive to anticipate challenges and innovate our logistics solutions to serve the Indonesian healthcare industry with unparalleled reliability.
                                </p>
                            </motion.div>
                        </section>

                        <section className="bg-slate-900 p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-slate-900/40 text-white relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-cyan-500/20 transition-colors"></div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative z-10"
                            >
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-10 shadow-2xl">
                                    <Compass size={32} />
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black mb-8 text-white tracking-tighter uppercase italic">
                                    Our <span className="text-cyan-400">Mission</span>
                                </h2>

                                <div
                                    className="prose prose-invert prose-lg max-w-none text-white/80 leading-loose prose-p:mb-6"
                                    dangerouslySetInnerHTML={{ __html: (language === 'id' ? info?.mission_text_id : info?.mission_text_en) || '' }}
                                />
                            </motion.div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                            <div className="absolute -right-4 -top-8 text-[120px] font-black text-slate-50 select-none pointer-events-none italic">"</div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Integrity First</h3>
                            <p className="text-lg font-bold text-slate-800 italic leading-relaxed mb-8 relative z-10">
                                "Our values are not just words; they are the foundation of everything we build for the community."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-0.5 w-12 bg-primary"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Governance Policy</span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-primary to-blue-700 p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/30 group">
                            <Sparkles className="text-white/40 mb-10 group-hover:scale-125 transition-transform duration-700" size={48} />
                            <h3 className="text-2xl font-black tracking-tighter italic mb-6 leading-tight">
                                Striving for <br /> Future Excellence
                            </h3>
                            <p className="text-white/70 text-sm leading-relaxed mb-10">
                                We continuousle update our standards to match global health logistics benchmarks.
                            </p>
                            <button onClick={() => handleNavigate('certification')} className="w-full py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-3">
                                View Our Standards
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </aside>
                </div>

                {/* Corporate Values Section (CINTA) - Premium Design - FULL WIDTH */}
                <div className="relative py-16 mt-16">
                    {/* Background Decorations */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 rounded-[4rem] overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-cyan-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10 px-10 md:px-20">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-xl rounded-full text-xs font-black uppercase tracking-widest text-primary mb-6 border border-primary/20 shadow-lg shadow-primary/10">
                                <Sparkles size={14} />
                                Core Values
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 px-4">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-purple-600">NILAI PERUSAHAAN</span>
                            </h2>
                            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed px-4">
                                {language === 'id'
                                    ? 'Fondasi budaya kerja yang menuntun setiap langkah kami menuju keunggulan.'
                                    : 'The cultural foundation guiding our every step towards excellence.'}
                            </p>
                        </motion.div>

                        {/* Values Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    id: '1',
                                    title_id: 'Fokus Pelanggan',
                                    title_en: 'Customer Focus',
                                    image: '/images/values/customer-focus.png',
                                    gradient: 'from-cyan-500 to-blue-600',
                                    bg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
                                    border: 'border-cyan-100'
                                },
                                {
                                    id: '2',
                                    title_id: 'Integritas',
                                    title_en: 'Integrity',
                                    image: '/images/values/integrity.png',
                                    gradient: 'from-blue-500 to-indigo-600',
                                    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
                                    border: 'border-blue-100'
                                },
                                {
                                    id: '3',
                                    title_id: 'Kerjasama Tim',
                                    title_en: 'Teamwork',
                                    image: '/images/values/teamwork.png',
                                    gradient: 'from-cyan-500 to-teal-600',
                                    bg: 'bg-gradient-to-br from-cyan-50 to-teal-50',
                                    border: 'border-cyan-100'
                                },
                                {
                                    id: '4',
                                    title_id: 'Ketangkasan',
                                    title_en: 'Agility',
                                    image: '/images/values/agility.png',
                                    gradient: 'from-blue-600 to-purple-600',
                                    bg: 'bg-gradient-to-br from-blue-50 to-purple-50',
                                    border: 'border-blue-100'
                                }
                            ].map((val, idx) => {
                                return (
                                    <motion.div
                                        key={val.id}
                                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: idx * 0.15, duration: 0.5 }}
                                        className="group relative"
                                    >
                                        {/* Card */}
                                        <div className={`relative rounded-2xl bg-white border ${val.border} shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}>
                                            {/* Gradient Overlay on Hover */}
                                            <div className={`absolute inset-0 ${val.bg} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                                            {/* Image Container */}
                                            <div className="relative aspect-square overflow-hidden">
                                                <img
                                                    src={val.image}
                                                    alt={val.title_id}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Text Label Overlay (Added for clarity & bilingual support) */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pt-12">
                                                <h3 className="text-white text-xl font-black italic tracking-tight">{val.title_id}</h3>
                                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{val.title_en}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default VisionMission;
