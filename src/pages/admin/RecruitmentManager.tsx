import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, FileText, Users } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import CareerManager from './CareerManager';
import ApplicationsManager from './ApplicationsManager';

const RecruitmentManager: React.FC = () => {
    const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        { id: 'jobs', label: t('admin.recruitment.tab.careers'), icon: Briefcase, description: 'Manage job listings' },
        { id: 'applications', label: t('admin.recruitment.tab.applications'), icon: Users, description: 'Review applicant submissions' },
    ] as const;

    // Extract current tab from URL
    const currentPath = location.pathname.split('/admin/recruitment/')[1] || 'jobs';
    const activeTab = currentPath.split('/')[0];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="space-y-2 px-1 text-left">
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                    {t('admin.recruitment.title').split(' ')[0]} <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-8">{t('admin.recruitment.title').split(' ').slice(1).join(' ')}</span>
                </h1>
                <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                    {t('admin.recruitment.subtitle')}
                </p>
            </div>

            <div className="flex flex-wrap gap-4 p-2 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => navigate(`/admin/recruitment/${tab.id}`)}
                        className={`px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-3 ${activeTab === tab.id
                            ? 'bg-white text-blue-600 shadow-xl shadow-blue-500/10 ring-1 ring-gray-100'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                            }`}
                    >
                        <tab.icon size={18} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-gray-50/30 rounded-[3rem] border border-gray-100 p-8 min-h-[600px] animate-in fade-in duration-500">
                <Routes>
                    <Route path="jobs" element={<CareerManager />} />
                    <Route path="applications" element={<ApplicationsManager />} />

                    {/* Redirect root to jobs */}
                    <Route path="/" element={<Navigate to="jobs" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default RecruitmentManager;
