import React, { useState } from 'react';
import ManagementManager from './ManagementManager';
import TimelineManager from './TimelineManager';
import ValuesManager from './ValuesManager';
import { Users, History, Heart } from 'lucide-react';

const CompanyProfileManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'management' | 'timeline' | 'values'>('management');

    const tabs = [
        { id: 'management', label: 'Management', icon: Users, description: 'Board of Directors & Leadership' },
        { id: 'timeline', label: 'History', icon: History, description: 'Corporate Journey & Milestones' },
        { id: 'values', label: 'Values', icon: Heart, description: 'Core principles & Culture' },
    ] as const;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                        Company <span className="text-blue-600">Profile</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Manage the core identity of Penta Valent</p>
                </div>

                <div className="bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] transition-all font-black uppercase text-[10px] tracking-widest ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50/30 rounded-[3rem] border border-gray-100 p-8 min-h-[600px] animate-in fade-in duration-500">
                {activeTab === 'management' && <ManagementManager />}
                {activeTab === 'timeline' && <TimelineManager />}
                {activeTab === 'values' && <ValuesManager />}
            </div>
        </div>
    );
};

export default CompanyProfileManager;
