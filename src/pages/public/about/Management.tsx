import React, { useState, useEffect } from 'react';
import PageSlider from '../../../components/common/PageSlider';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, X, Briefcase, Award, Linkedin, Mail, ArrowRight, Target } from 'lucide-react';

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

const Management: React.FC = () => {
    const { language, t } = useLanguage();
    const [members, setMembers] = useState<ManagementMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<ManagementMember | null>(null);

    const handleNavigate = (section: string) => {
        window.location.href = `/#${section}`;
    };

    const [commissioners, setCommissioners] = useState<ManagementMember[]>([]);
    const [directors, setDirectors] = useState<ManagementMember[]>([]);

    useEffect(() => {
        const fetchManagement = async () => {
            try {
                const { data } = await supabase
                    .from('management')
                    .select('*')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true });

                setMembers(data || []);

                const comms = data?.filter(m =>
                    m.position_en.toLowerCase().includes('commissioner') ||
                    m.position_id.toLowerCase().includes('komisaris')
                ) || [];
                setCommissioners(comms);

                const dirs = data?.filter(m =>
                    m.position_en.toLowerCase().includes('director') ||
                    m.position_id.toLowerCase().includes('direktur')
                ) || [];
                setDirectors(dirs);
            } catch (error) {
                console.error('Error fetching management:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchManagement();
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
                pagePath="/about/management"
                breadcrumbLabel={language === 'id' ? 'Manajemen' : 'Management'}
            />

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10 -mt-24 md:-mt-32">
                <div className="space-y-16">

                    {/* Board of Commissioners Section */}
                    <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="text-center mb-16 relative z-10 overflow-visible">
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">
                                <Users size={14} className="text-primary" />
                                Board Leadership
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase mb-4">
                                {language === 'id' ? 'Dewan' : 'Board of'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">{language === 'id' ? 'Komisaris' : 'Commissioners'}</span>
                            </h2>
                            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                                {language === 'id'
                                    ? 'Tim pengawas yang memastikan tata kelola perusahaan yang baik'
                                    : 'Supervisory team ensuring good corporate governance'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                            {commissioners.map((member, idx) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => setSelectedMember(member)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                                            <img
                                                src={member.image_url || '/images/placeholder-avatar.png'}
                                                alt={member.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        <div className="p-6 relative z-10">
                                            <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">
                                                {member.name}
                                            </h3>
                                            <p className="text-sm font-bold text-primary uppercase tracking-wide">
                                                {language === 'id' ? member.position_id : member.position_en}
                                            </p>
                                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-semibold group-hover:text-primary transition-colors">
                                                <ArrowRight size={14} />
                                                {language === 'id' ? 'Lihat Profil' : 'View Profile'}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Board of Directors Section */}
                    <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>

                        <div className="text-center mb-16 relative z-10 overflow-visible">
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">
                                <Briefcase size={14} className="text-cyan-600" />
                                Executive Leadership
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase mb-4">
                                {language === 'id' ? 'Dewan' : 'Board of'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{language === 'id' ? 'Direksi' : 'Directors'}</span>
                            </h2>
                            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                                {language === 'id'
                                    ? 'Tim eksekutif yang memimpin operasional perusahaan'
                                    : 'Executive team leading company operations'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                            {directors.map((member, idx) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => setSelectedMember(member)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                                            <img
                                                src={member.image_url || '/images/placeholder-avatar.png'}
                                                alt={member.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        <div className="p-6 relative z-10">
                                            <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                                                {member.name}
                                            </h3>
                                            <p className="text-sm font-bold text-cyan-600 uppercase tracking-wide">
                                                {language === 'id' ? member.position_id : member.position_en}
                                            </p>
                                            <span className="font-bold">{language === 'id' ? 'Lihat Profil' : 'View Profile'}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>


                    {/* Advisory Content Style (Like News Detail Sidebar) */}
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="bg-slate-900 p-10 md:p-14 rounded-[3.5rem] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <Briefcase className="text-primary mb-8 animate-pulse" size={48} />
                                <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-6">Strategic Governance</h3>
                                <p className="text-white/60 leading-relaxed mb-10 max-w-sm">
                                    Operating as a public company since 2022, we maintain rigorous transparency and compliance in every strategic decision.
                                </p>
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                                    <div className="w-10 h-0.5 bg-primary/30"></div>
                                    Public Oversight
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group">
                            <Award className="text-cyan-500 mb-8 group-hover:rotate-12 transition-transform" size={48} />
                            <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-6 text-slate-900 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Global Expertise</h3>
                            <p className="text-slate-500 leading-relaxed mb-10 max-w-sm font-medium">
                                Our executive team brings decades of combined experience from both local distribution and international healthcare landscapes.
                            </p>
                            <button onClick={() => handleNavigate('investor')} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-colors group/btn">
                                Investor Relations
                                <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </main >

            {/* Profile Modal - Upgraded to Premium Bio Style */}
            <AnimatePresence>
                {
                    selectedMember && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedMember(null)}
                                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="relative w-full max-w-5xl bg-white rounded-[4rem] overflow-hidden shadow-4xl flex flex-col md:flex-row border border-white/20"
                            >
                                <button
                                    onClick={() => setSelectedMember(null)}
                                    className="absolute top-8 right-8 z-30 w-14 h-14 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-primary transition-all shadow-xl shadow-slate-950/20"
                                >
                                    <X size={28} />
                                </button>

                                <div className="w-full md:w-5/12 aspect-[4/5] md:aspect-auto bg-slate-950 relative">
                                    <img
                                        src={selectedMember.image_url}
                                        alt={selectedMember.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                                    <div className="absolute bottom-10 left-10 hidden md:block">
                                        <div className="w-12 h-1 bg-primary rounded-full mb-4 shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Official Narrative</p>
                                    </div>
                                </div>

                                <div className="p-10 md:p-20 flex-1 overflow-y-auto max-h-[60vh] md:max-h-none bg-white relative">
                                    <div className="mb-12 relative">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">Executive Leadership Profile</span>
                                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic mb-4 leading-none">
                                            {selectedMember.name}
                                        </h3>
                                        <div className="inline-block px-5 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                                {language === 'id' ? selectedMember.position_id : selectedMember.position_en}
                                            </p>
                                        </div>
                                        <div className="absolute -right-10 -top-10 opacity-[0.03] select-none pointer-events-none">
                                            <User size={260} strokeWidth={4} />
                                        </div>
                                    </div>

                                    <div className="prose prose-slate max-w-none">
                                        <div className="relative">
                                            <div className="absolute -left-8 top-1 bottom-1 w-1 bg-primary/20 rounded-full"></div>
                                            <p className="text-slate-600 leading-loose text-lg whitespace-pre-wrap font-medium">
                                                {language === 'id' ? selectedMember.bio_id : selectedMember.bio_en}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-16 pt-10 border-t border-slate-100 flex flex-wrap gap-8 items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                                                <Linkedin size={24} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-slate-400">Professional Network</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
                                                <Mail size={24} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-slate-400">Official Channel</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence >

            <Footer onNavigate={handleNavigate} />
        </div >
    );
};

export default Management;
