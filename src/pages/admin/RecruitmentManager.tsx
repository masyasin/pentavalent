import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, FileText } from 'lucide-react';
import CareerManager from './CareerManager';
import ApplicationsManager from './ApplicationsManager';

const RecruitmentManager: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        { id: 'jobs', label: 'Careers', icon: Briefcase, description: 'Manage job listings' },
        { id: 'applications', label: 'Job Applications', icon: FileText, description: 'Review applicant submissions' },
    ] as const;

    // Extract current tab from URL
    const currentPath = location.pathname.split('/admin/recruitment/')[1] || 'jobs';
    const activeTab = currentPath.split('/')[0];

    return (
        <div className="space-y-8 pb-20">
            <div className="space-y-2 px-1 text-left">
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                    Recruitment <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">Hub</span>
                </h1>
                <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Manage opening positions and applications</p>
            </div>

            <div className="bg-white p-3 rounded-[3rem] border border-gray-100 shadow-sm flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => navigate(`/admin/recruitment/${tab.id}`)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] transition-all font-black uppercase text-[10px] tracking-widest ${activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200 -translate-y-1'
                            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <tab.icon size={16} />
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
