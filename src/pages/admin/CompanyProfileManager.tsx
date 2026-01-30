import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ManagementManager from './ManagementManager';
import TimelineManager from './TimelineManager';
import ValuesManager from './ValuesManager';
import GeneralInfoManager from './GeneralInfoManager';
import BusinessLineManager from './BusinessLineManager';
import CertificationManager from './CertificationManager';
import BranchManager from './BranchManager';
import PartnerManager from './PartnerManager';
import StructureManager from '../../components/admin/StructureManager';
import { Users, History, Heart, Info, Layers, Award, MapPin, Handshake, Network } from 'lucide-react';

const CompanyProfileManager: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        { id: 'general', label: 'General Info', icon: Info, description: 'Core narrative & vision' },
        { id: 'structure', label: 'Structure', icon: Network, description: 'Visual Org Chart' },
        { id: 'management', label: 'Management', icon: Users, description: 'Board of Directors & Leadership' },
        { id: 'timeline', label: 'History', icon: History, description: 'Corporate Journey & Milestones' },
        { id: 'values', label: 'Values', icon: Heart, description: 'Core principles & Culture' },
        { id: 'services', label: 'Business Lines', icon: Layers, description: 'Products & Service categories' },
        { id: 'certifications', label: 'Quality', icon: Award, description: 'Certifications & Standards' },
        { id: 'partners', label: 'Partners', icon: Handshake, description: 'Strategic Alliances' },
        { id: 'branches', label: 'Branches', icon: MapPin, description: 'Office Locations' },
    ] as const;

    // Extract current tab from URL
    // URL structure: /admin/company/:tab
    const currentPath = location.pathname.split('/admin/company/')[1] || 'general';
    // Handle nested paths if any (e.g. general/something), though we just use top level here
    const activeTab = currentPath.split('/')[0];

    return (
        <div className="space-y-8 pb-20">
            <div className="space-y-2 px-1">
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                    Company <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">Profile</span>
                </h1>
                <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Manage the core identity of Penta Valent</p>
            </div>

            <div className="bg-white p-3 rounded-[3rem] border border-gray-100 shadow-sm flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => navigate(tab.id)}
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
                    <Route path="general" element={<GeneralInfoManager />} />
                    <Route path="structure" element={<StructureManager />} />
                    <Route path="management" element={<ManagementManager />} />
                    <Route path="timeline" element={<TimelineManager />} />
                    <Route path="values" element={<ValuesManager />} />
                    <Route path="services" element={<BusinessLineManager />} />
                    <Route path="certifications" element={<CertificationManager />} />
                    <Route path="partners" element={<PartnerManager />} />
                    <Route path="branches" element={<BranchManager />} />

                    {/* Redirect root to general */}
                    <Route path="/" element={<Navigate to="general" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default CompanyProfileManager;
