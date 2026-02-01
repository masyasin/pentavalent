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
        if (section === 'contact') window.location.href = '/contact';
        else if (section === 'faq') window.location.href = '/faq';
        else if (section === 'sitemap') window.location.href = '/sitemap';
        else window.location.href = `/#${section}`;
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
                breadcrumbLabel={language === 'id' ? 'Legalitas, Kepatuhan & Pencapaian' : 'Legality, Compliance & Achievements'}
                parentLabel={language === 'id' ? 'Tentang Kami' : 'About Us'}
            />

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10 -mt-24 md:-mt-32">
                <div className="space-y-24">

                    {/* 1. Legalitas Perusahaan (Company Legality) */}
                    <section className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-10 border-b border-slate-100 pb-6">
                                {language === 'id' ? 'Legalitas Perusahaan' : 'Company Legality'}
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { title: language === 'id' ? 'Akta Pendirian & Perubahan' : 'Deed of Establishment & Amendments', status: 'Verified', code: 'AHU-Standard' },
                                    { title: language === 'id' ? 'Pengesahan Kemenkumham' : 'Ministry of Law Approval', status: 'Verified', code: 'Valid' },
                                    { title: language === 'id' ? 'NPWP Perseroan' : 'Corporate Tax ID (NPWP)', status: 'Active', code: 'Tax Compliance' },
                                    { title: language === 'id' ? 'Nomor Induk Berusaha (NIB)' : 'Business ID Number (NIB)', status: 'Registered', code: 'OSS System' },
                                    { title: language === 'id' ? 'Status Badan Hukum' : 'Legal Entity Status', status: 'PT Tbk', code: 'Public Company' },
                                    { title: language === 'id' ? 'KBLI Utama & Pendukung' : 'Standard Industrial Classification', status: 'Registered', code: 'Distribution' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">{item.title}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-md font-black uppercase tracking-widest">{item.status}</span>
                                                <span className="text-[10px] text-slate-400 font-mono">{item.code}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 2. Perizinan & Sertifikasi (Licenses & Certifications) */}
                    <section>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-10 pl-6 border-l-4 border-primary">
                            {language === 'id' ? 'Perizinan & Sertifikasi' : 'Licenses & Certifications'}
                        </h2>
                        <div className="grid lg:grid-cols-2 gap-8">
                            {certs.concat([
                                // Hardcoded backups if DB is empty or for specific critical ones not in DB
                                { name: 'Izin PBF (Pedagang Besar Farmasi)', description_id: 'Lisensi resmi distribusi farmasi skala besar.', description_en: 'Official license for large-scale pharmaceutical distribution.', issuer: 'Ministry of Health', certificate_number: 'PBF-LICENSE-001', id: 'static-1', image_url: '' },
                                { name: 'ISO 9001:2015', description_id: 'Sistem Manajemen Mutu Internasional.', description_en: 'International Quality Management System.', issuer: 'ISO Body', certificate_number: 'ISO-9001-2015', id: 'static-2', image_url: '' }
                            ].filter(c => !certs.find(existing => existing.name === c.name))).slice(0, 6).map((cert, idx) => (
                                <motion.div
                                    key={cert.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-transform group flex flex-col sm:flex-row gap-6 items-start"
                                >
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Award size={32} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-2">{cert.name}</h3>
                                        <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                                            {language === 'id' ? cert.description_id : cert.description_en}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 border border-slate-200">
                                                {cert.issuer || 'Official Body'}
                                            </span>
                                            {cert.certificate_number && (
                                                <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono text-slate-500 border border-slate-200 flex items-center gap-2">
                                                    <FileText size={12} />
                                                    {cert.certificate_number}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* 3. Compliance & 4. Policies */}
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* 3. Kepatuhan Regulasi */}
                        <section className="bg-slate-900 text-white p-10 md:p-14 rounded-[3.5rem] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10 relative z-10 flex items-center gap-3">
                                <ShieldCheck className="text-primary" />
                                {language === 'id' ? 'Kepatuhan Regulasi' : 'Regulatory Compliance'}
                            </h2>

                            <ul className="space-y-6 relative z-10">
                                {[
                                    { label: language === 'id' ? 'Peraturan OJK & BEI' : 'OJK & IDX Regulations', desc: language === 'id' ? 'Kepatuhan penuh pasar modal' : 'Full capital market compliance' },
                                    { label: language === 'id' ? 'Standar BPOM & Kemenkes' : 'BPOM & MoH Standards', desc: language === 'id' ? 'CDOB & CDAKB terverifikasi' : 'Verified GDP & GDPMDS' },
                                    { label: language === 'id' ? 'Tata Kelola (GCG)' : 'Corporate Governance', desc: language === 'id' ? 'Audit internal & eksternal rutin' : 'Regular internal & external audits' },
                                    { label: language === 'id' ? 'Kepatuhan Pajak' : 'Tax Compliance', desc: language === 'id' ? 'Laporan fiskal transparan' : 'Transparent fiscal reporting' },
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                                        <div>
                                            <h4 className="font-bold text-lg leading-tight">{item.label}</h4>
                                            <p className="text-white/60 text-sm">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* 4. Kebijakan Perusahaan */}
                        <section className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
                            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-10">
                                {language === 'id' ? 'Kebijakan Perusahaan' : 'Corporate Policies'}
                            </h2>
                            <div className="grid gap-4">
                                {[
                                    language === 'id' ? 'Kode Etik Perusahaan' : 'Code of Conduct',
                                    language === 'id' ? 'Kebijakan Anti Suap & Korupsi' : 'Anti-Bribery & Corruption',
                                    language === 'id' ? 'Sistem Pelaporan Pelanggaran' : 'Whistleblowing System',
                                    language === 'id' ? 'Manajemen Risiko' : 'Risk Management',
                                    language === 'id' ? 'Perlindungan Data Pribadi' : 'Data Privacy Protection'
                                ].map((policy, i) => (
                                    <div key={i} className="group flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-default">
                                        <span className="font-bold text-slate-700">{policy}</span>
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 border border-slate-200">
                                            <CheckCircle2 size={16} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* 5. Penghargaan & Pencapaian & 6. Transparansi */}
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Awards */}
                        <div className="lg:col-span-8 bg-gradient-to-br from-primary/5 to-cyan-500/5 p-10 rounded-[3rem] border border-primary/10">
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-8">
                                {language === 'id' ? 'Penghargaan & Pencapaian' : 'Awards & Achievements'}
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="p-2 bg-yellow-400/10 text-yellow-600 rounded-lg w-fit mb-4">
                                        <Star size={20} fill="currentColor" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Top Distributor Award</h4>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">National Level • 2024</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="p-2 bg-blue-400/10 text-blue-600 rounded-lg w-fit mb-4">
                                        <Database size={20} />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Digital Transformation</h4>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">Supply Chain • 2023</p>
                                </div>
                            </div>
                        </div>

                        {/* Transparency CTA */}
                        <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-black uppercase italic tracking-tighter mb-4 text-emerald-400">
                                    {language === 'id' ? 'Transparansi Publik' : 'Public Transparency'}
                                </h2>
                                <p className="text-white/60 text-sm mb-8">
                                    {language === 'id'
                                        ? 'Pernyataan kepatuhan penuh dan tidak adanya sengketa material yang sedang berlangsung.'
                                        : 'Statement of full compliance and absence of ongoing material litigation.'}
                                </p>
                            </div>
                            <button onClick={() => handleNavigate('investor')} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                                ESG & Reports <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default LegalityAchievements;
