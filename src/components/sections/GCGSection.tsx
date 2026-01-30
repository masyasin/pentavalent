import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface GCGPrinciple {
    id: string;
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    icon_name: string;
    sort_order: number;
}

interface BoardMember {
    id: string;
    name: string;
    position_id: string;
    position_en: string;
    bio_id: string;
    bio_en: string;
    image_url: string;
    commissioner_type?: string;
}

interface GCGCommittee {
    id: string;
    name_id: string;
    name_en: string;
    description_id: string;
    description_en: string;
    chairman_name: string;
    members: string[];
}

interface GCGPolicy {
    id: string;
    title_id: string;
    title_en: string;
    category: string;
    description_id: string;
    description_en: string;
    document_url: string;
}

const GCGSection: React.FC = () => {
    const { t, language } = useLanguage();
    const [principles, setPrinciples] = useState<GCGPrinciple[]>([]);
    const [commissioners, setCommissioners] = useState<BoardMember[]>([]);
    const [directors, setDirectors] = useState<BoardMember[]>([]);
    const [committees, setCommittees] = useState<GCGCommittee[]>([]);
    const [policies, setPolicies] = useState<GCGPolicy[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('principles');

    useEffect(() => {
        fetchGCGData();
    }, []);

    const fetchGCGData = async () => {
        try {
            const [principlesData, commissionersData, directorsData, committeesData, policiesData] = await Promise.all([
                supabase.from('gcg_principles').select('*').eq('is_active', true).order('sort_order'),
                supabase.from('board_of_commissioners').select('*').eq('is_active', true).order('sort_order'),
                supabase.from('board_of_directors').select('*').eq('is_active', true).order('sort_order'),
                supabase.from('gcg_committees').select('*').eq('is_active', true).order('sort_order'),
                supabase.from('gcg_policies').select('*').eq('is_active', true)
            ]);

            setPrinciples(principlesData.data || []);
            setCommissioners(commissionersData.data || []);
            setDirectors(directorsData.data || []);
            setCommittees(committeesData.data || []);
            setPolicies(policiesData.data || []);
        } catch (error) {
            console.error('Error fetching GCG data:', error);
        } finally {
            setLoading(false);
        }
    };

    const iconMap: { [key: string]: JSX.Element } = {
        'eye': (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        ),
        'clipboard-check': (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
        'shield-check': (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        'scale': (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
        ),
        'users': (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    };

    const tabs = [
        { id: 'principles', label: language === 'id' ? 'Prinsip GCG' : 'GCG Principles' },
        { id: 'board', label: language === 'id' ? 'Dewan Komisaris & Direksi' : 'Board Members' },
        { id: 'committees', label: language === 'id' ? 'Komite' : 'Committees' },
        { id: 'policies', label: language === 'id' ? 'Kebijakan' : 'Policies' },
    ];

    if (loading) {
        return (
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
            </section>
        );
    }

    return (
        <section id="gcg" className="py-20 md:py-32 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>

            <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
                {/* Header */}
                <div className="text-center mb-24">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-white shadow-xl shadow-blue-500/10 rounded-[1.5rem] flex items-center justify-center border border-slate-100 group hover:scale-110 transition-transform duration-500">
                            <svg className="w-8 h-8 text-blue-500 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                        <div className="w-16 h-16 bg-white shadow-xl shadow-cyan-500/10 rounded-[1.5rem] flex items-center justify-center border border-slate-100 group hover:scale-110 transition-transform duration-500">
                            <svg className="w-8 h-8 text-cyan-500 group-hover:-rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>

                    <span className="inline-block px-5 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-8 border border-blue-100">
                        {language === 'id' ? 'TATA KELOLA PERUSAHAAN' : 'CORPORATE GOVERNANCE'}
                    </span>

                    <h2 className="text-fluid-h1 py-2 mb-10 text-slate-900 border-l-8 border-emerald-500 pl-6 md:pl-10">
                        {t('gcg.title.text')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic inline-block">{t('gcg.title.italic')}</span>
                    </h2>
                    <p className="text-fluid-body text-gray-500 max-w-3xl">
                        {t('gcg.desc')}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-20 p-2 bg-slate-50 rounded-[2.5rem] border border-slate-200/50 max-w-fit mx-auto backdrop-blur-sm shadow-inner">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 md:px-10 md:py-6 rounded-[2rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-500 relative group overflow-hidden ${activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-lg shadow-blue-500/10'
                                : 'text-slate-400 hover:text-blue-500'
                                }`}
                        >
                            <span className="relative z-10">{tab.label}</span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="mt-12">
                    {/* Principles Tab */}
                    {activeTab === 'principles' && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {principles.map((principle, idx) => (
                                <div
                                    key={principle.id}
                                    className="group relative bg-white p-10 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-700 hover:-translate-y-4 overflow-hidden"
                                    style={{ animationDelay: `${idx * 150}ms` }}
                                >
                                    {/* Animated Top Line */}
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>

                                    {/* Subtle Floating Decor */}
                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-[0.03] rounded-full blur-3xl transition-opacity duration-700"></div>

                                    <div className="relative z-10">
                                        <div className="w-20 h-20 bg-slate-50 text-cyan-500 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-700 shadow-inner group-hover:shadow-xl group-hover:shadow-cyan-500/30 group-hover:rotate-6">
                                            {iconMap[principle.icon_name] || iconMap['shield-check']}
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight group-hover:text-cyan-600 transition-colors leading-none">
                                            {language === 'id' ? principle.title_id : principle.title_en}
                                        </h3>

                                        <p className="text-slate-500 text-lg leading-relaxed font-medium group-hover:text-slate-600 transition-colors">
                                            {language === 'id' ? principle.description_id : principle.description_en}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Board Tab */}
                    {activeTab === 'board' && (
                        <div className="space-y-16">
                            {/* Board of Commissioners */}
                            <div>
                                <h3 className="text-3xl font-bold text-primary mb-8">
                                    {language === 'id' ? 'Dewan Komisaris' : 'Board of Commissioners'}
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {(commissioners || []).map((member) => (
                                        <div
                                            key={member.id}
                                            className="bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift group"
                                        >
                                            <div className="aspect-square overflow-hidden bg-gray-100">
                                                <img
                                                    src={member.image_url}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <h4 className="text-lg font-bold text-primary group-hover:text-cyan-500 inline-block transition-colors mb-2">{member.name}</h4>
                                                <p className="text-sm wow-text-primary font-semibold mb-3">
                                                    {language === 'id' ? member.position_id : member.position_en}
                                                </p>
                                                {member.commissioner_type === 'independent' && (
                                                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full mb-3">
                                                        Independent
                                                    </span>
                                                )}
                                                <p className="text-sm text-gray-600 line-clamp-3">
                                                    {language === 'id' ? member.bio_id : member.bio_en}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Board of Directors */}
                            <div>
                                <h3 className="text-3xl font-bold text-primary mb-8">
                                    {language === 'id' ? 'Dewan Direksi' : 'Board of Directors'}
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
                                    {(directors || []).map((member) => (
                                        <div
                                            key={member.id}
                                            className="bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift group"
                                        >
                                            <div className="aspect-square overflow-hidden bg-gray-100">
                                                <img
                                                    src={member.image_url}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <h4 className="text-lg font-bold text-primary group-hover:wow-text-primary inline-block transition-colors mb-2">{member.name}</h4>
                                                <p className="text-sm wow-text-primary font-semibold mb-3">
                                                    {language === 'id' ? member.position_id : member.position_en}
                                                </p>
                                                <p className="text-sm text-gray-600 line-clamp-3">
                                                    {language === 'id' ? member.bio_id : member.bio_en}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Committees Tab - Redesigned for Premium Look */}
                    {activeTab === 'committees' && (
                        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                            {(committees || []).map((committee, idx) => (
                                <div
                                    key={committee.id}
                                    className="group relative bg-white/80 backdrop-blur-sm p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-700 hover:-translate-y-2 overflow-hidden"
                                    style={{ animationDelay: `${idx * 150}ms` }}
                                >
                                    {/* Animated Top Line */}
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>

                                    <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
                                        {language === 'id' ? committee.name_id : committee.name_en}
                                    </h3>

                                    <p className="text-slate-500 mb-10 text-lg leading-relaxed font-medium group-hover:text-slate-600 transition-colors">
                                        {language === 'id' ? committee.description_id : committee.description_en}
                                    </p>

                                    <div className="grid sm:grid-cols-2 gap-10 pt-10 border-t border-slate-100">
                                        <div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] block mb-4">
                                                {language === 'id' ? 'KETUA KOMITE' : 'CHAIRMAN'}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-8 bg-blue-500 rounded-full group-hover:h-10 transition-all duration-500"></div>
                                                <p className="text-lg font-black text-blue-600 leading-tight">{committee.chairman_name}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] block mb-4">
                                                {language === 'id' ? 'ANGGOTA KOMITE' : 'MEMBERS'}
                                            </span>
                                            <ul className="space-y-3">
                                                {(committee.members || []).map((member, idx) => (
                                                    <li key={idx} className="text-sm font-bold text-slate-600 flex items-center gap-3 group/item">
                                                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full group-hover/item:scale-150 transition-transform"></span>
                                                        {member}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Decor */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Policies Tab - Redesigned for Premium Look */}
                    {activeTab === 'policies' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
                            {(policies || []).map((policy, idx) => (
                                <a
                                    key={policy.id}
                                    href={policy.document_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative bg-white p-10 md:p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-700 hover:-translate-y-3 overflow-hidden"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    {/* Animated Top Line */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>

                                    <div className="flex items-start justify-between mb-10">
                                        <div className="w-16 h-16 bg-slate-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-lg group-hover:rotate-6">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <span className="px-4 py-2 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest transition-colors duration-500 border border-slate-100 group-hover:border-blue-100">
                                            {policy.category.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-4 tracking-tight leading-tight">
                                        {language === 'id' ? policy.title_id : policy.title_en}
                                    </h3>

                                    <p className="text-slate-500 text-base leading-relaxed font-medium line-clamp-3 mb-10 opacity-80 group-hover:opacity-100 transition-opacity">
                                        {language === 'id' ? policy.description_id : policy.description_en}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                                            <span>{language === 'id' ? 'Unduh Dokumen' : 'Download Document'}</span>
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3" /></svg>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default GCGSection;
