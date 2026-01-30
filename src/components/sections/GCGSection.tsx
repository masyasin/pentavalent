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
                <div className="text-center mb-20">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary/5 text-primary rounded-3xl flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="w-16 h-16 bg-accent/5 text-accent rounded-3xl flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-4xl sm:text-6xl font-black mb-10 tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Good Corporate Governance
                    </h2>
                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
                        {language === 'id'
                            ? 'Kami mematuhi standar tertinggi transparansi dan etika institusional.'
                            : 'We strictly adhere to the highest standards of transparency and institutional ethics.'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-20 p-2 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 max-w-fit mx-auto backdrop-blur-sm shadow-inner">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 md:px-10 md:py-5 rounded-[2rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative group overflow-hidden ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-2xl shadow-primary/20 scale-105'
                                : 'text-gray-400 hover:text-primary hover:bg-white border border-transparent hover:border-gray-100'
                                }`}
                        >
                            <span className="relative z-10">{tab.label}</span>
                            {activeTab === tab.id && (
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="mt-12">
                    {/* Principles Tab */}
                    {activeTab === 'principles' && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {principles.map((principle) => (
                                <div
                                    key={principle.id}
                                    className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:from-primary group-hover:to-accent group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
                                        {iconMap[principle.icon_name] || iconMap['shield-check']}
                                    </div>
                                    <h3 className="text-2xl font-black text-primary mb-4 tracking-tight">
                                        {language === 'id' ? principle.title_id : principle.title_en}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed font-medium">
                                        {language === 'id' ? principle.description_id : principle.description_en}
                                    </p>
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
                                                <h4 className="text-lg font-bold text-primary mb-2">{member.name}</h4>
                                                <p className="text-sm text-accent font-semibold mb-3">
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
                                                <h4 className="text-lg font-bold text-primary mb-2">{member.name}</h4>
                                                <p className="text-sm text-accent font-semibold mb-3">
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

                    {/* Committees Tab */}
                    {activeTab === 'committees' && (
                        <div className="grid md:grid-cols-2 gap-8">
                            {(committees || []).map((committee) => (
                                <div
                                    key={committee.id}
                                    className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-lg hover:shadow-2xl transition-all"
                                >
                                    <h3 className="text-2xl font-bold text-primary mb-4">
                                        {language === 'id' ? committee.name_id : committee.name_en}
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {language === 'id' ? committee.description_id : committee.description_en}
                                    </p>
                                    <div className="border-t border-gray-100 pt-6">
                                        <div className="mb-4">
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                                {language === 'id' ? 'Ketua' : 'Chairman'}
                                            </span>
                                            <p className="text-lg font-bold text-primary mt-1">{committee.chairman_name}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                                {language === 'id' ? 'Anggota' : 'Members'}
                                            </span>
                                            <ul className="mt-2 space-y-1">
                                                {(committee.members || []).map((member, idx) => (
                                                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                                                        {member}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Policies Tab */}
                    {activeTab === 'policies' && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(policies || []).map((policy) => (
                                <a
                                    key={policy.id}
                                    href={policy.document_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift group hover-move-icon"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase">
                                            {policy.category.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                                        {language === 'id' ? policy.title_id : policy.title_en}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                        {language === 'id' ? policy.description_id : policy.description_en}
                                    </p>
                                    <div className="flex items-center gap-2 text-accent font-bold text-sm">
                                        <span>{language === 'id' ? 'Unduh Dokumen' : 'Download Document'}</span>
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
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
