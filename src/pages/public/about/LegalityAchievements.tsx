import React, { useState, useEffect } from 'react';
import PageSlider from '../../../components/common/PageSlider';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, FileText, CheckCircle2, ArrowRight, Star, Database } from 'lucide-react';

interface Certification {
    id: string;
    name: string;
    description_id: string;
    description_en: string;
    issuer: string;
    certificate_number: string;
    image_url: string;
}

const LegalityAchievements: React.FC = () => {
    const { language, t } = useLanguage();
    const [certs, setCerts] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);

    const handleNavigate = (section: string) => {
        window.location.href = `/#${section}`;
    };

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const { data } = await supabase
                    .from('certifications')
                    .select('*')
                    .eq('is_active', true);

                setCerts(data || []);
            } catch (error) {
                console.error('Error fetching certifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCerts();
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
                pagePath="/about/legality-achievements"
                breadcrumbLabel={language === 'id' ? 'Legalitas' : 'Legality'}
            />

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10 -mt-24 md:-mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-12 space-y-24">
                        {/* Section 1: Standards */}
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-10"
                            >
                                <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">
                                    <ShieldCheck size={14} />
                                    Operational Integrity
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-[1.1]">
                                    Uncompromising <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400 text-6xl md:text-7xl">Compliance</span>
                                </h2>
                                <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-xl">
                                    Our commitment to quality goes beyond certifications. It is embedded in every cold-chain protocol and warehouse workflow we execute.
                                </p>
                                <div className="space-y-6">
                                    {[
                                        { title_id: 'Sertifikasi CDOB', title_en: 'CDOB Standards', desc: 'Sesuai standar distribusi obat BPOM resmi.' },
                                        { title_id: 'Sertifikasi CDAKB', title_en: 'CDAKB Compliance', desc: 'Standar distribusi alat kesehatan nasional.' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-6 p-6 bg-white rounded-[2.5rem] border border-slate-100 hover:enterprise-shadow transition-all group">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 uppercase tracking-tight mb-2 italic">
                                                    {language === 'id' ? item.title_id : item.title_en}
                                                </h4>
                                                <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-4xl group"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=1000"
                                    alt="Legality"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[8000ms]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-12 left-12 right-12 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl">
                                    <div className="flex items-center gap-4 text-white">
                                        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                                            <Star size={24} />
                                        </div>
                                        <div>
                                            <div className="text-xl font-black italic tracking-tighter uppercase leading-none mb-1">Elite Standard</div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Verified Capability</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Wall of Honor: Certifications */}
                        <div className="space-y-16">
                            <div className="text-center space-y-6">
                                <div className="flex items-center justify-center gap-4 text-slate-300">
                                    <div className="h-px w-20 bg-slate-100"></div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.4em]">Credential Vault</h3>
                                    <div className="h-px w-20 bg-slate-100"></div>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
                                    Official <span className="text-primary italic">Accreditations</span>
                                </h2>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                {certs.map((cert, index) => (
                                    <motion.div
                                        key={cert.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group p-10 bg-white border border-slate-100 rounded-[3.5rem] enterprise-shadow hover:-translate-y-3 transition-all duration-700 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/5 transition-colors"></div>

                                        <div className="relative z-10">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-primary mb-10 transition-all group-hover:bg-primary group-hover:text-white group-hover:scale-110 shadow-sm border border-slate-50">
                                                <Award size={40} strokeWidth={1.5} />
                                            </div>

                                            <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6 italic leading-tight group-hover:text-primary transition-colors">
                                                {cert.name}
                                            </h4>

                                            <p className="text-sm text-slate-500 leading-relaxed font-medium mb-10 min-h-[60px]">
                                                {language === 'id' ? cert.description_id : cert.description_en}
                                            </p>

                                            <div className="space-y-4 pt-8 border-t border-slate-50">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Issuing Authority</span>
                                                    <span className="text-xs font-bold text-slate-800 italic">{cert.issuer}</span>
                                                </div>
                                                {cert.certificate_number && (
                                                    <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                                        <FileText size={16} className="text-primary" />
                                                        <span className="text-xs font-black text-slate-600 tracking-widest font-mono">{cert.certificate_number}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom CTA Card */}
                        <div className="bg-slate-900 p-12 md:p-20 rounded-[4rem] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-1000"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4"></div>

                            <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-10">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] flex items-center justify-center text-emerald-400 shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all">
                                    <Database size={36} />
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-tight">
                                    Access Our <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">Public Disclosures</span>
                                </h2>
                                <p className="text-white/60 text-lg font-medium leading-relaxed">
                                    As a public entity, we maintain a central repository for all regulatory filings and corporate achievements.
                                </p>
                                <button onClick={() => handleNavigate('investor')} className="px-12 py-6 wow-button-gradient text-white font-black uppercase text-xs tracking-[0.4em] rounded-full shadow-2xl hover:shadow-primary/50 transition-all flex items-center gap-4 group/btn active:scale-95">
                                    Investor Center
                                    <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default LegalityAchievements;
