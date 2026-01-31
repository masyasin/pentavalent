import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const SnapshotSection: React.FC = () => {
    const { t, language } = useLanguage();

    const stats = [
        {
            value: '55+',
            label_id: 'Tahun Pengalaman',
            label_en: 'Years of Experience',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            value: '34',
            label_id: 'Cabang & Depo',
            label_en: 'Branches & Depots',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-5 10h1m4 0h1m-5-4h1m4 0h1" />
                </svg>
            )
        },
        {
            value: '14K+',
            label_id: 'Titik Distribusi',
            label_en: 'Distribution Points',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            value: '2023',
            label_id: 'Melantai di Bursa',
            label_en: 'Publicly Listed',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        }
    ];

    return (
        <section className="relative z-30 -mt-10 md:-mt-20 px-6">
            <div className="max-w-[1700px] mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white/90 backdrop-blur-2xl p-8 md:p-12 rounded-2xl md:rounded-[3rem] shadow-2xl border border-white/50 group hover:-translate-y-2 transition-all duration-500"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-accent group-hover:text-white transition-all duration-500 mb-6 shadow-inner">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2 tracking-tighter">
                                    {stat.value}
                                </div>
                                <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                                    {language === 'id' ? stat.label_id : stat.label_en}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SnapshotSection;
