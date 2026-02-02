import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Newspaper, Mail, HelpCircle } from 'lucide-react';
import NewsManager from './NewsManager';
import NewsletterManager from './NewsletterManager';
import FAQManager from './FAQManager';
import { useAuth } from '../../contexts/AuthContext';

const WebsiteContentManager: React.FC = () => {
    const { canAccessModule } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const allTabs = [
        { id: 'news', label: 'News & Media', icon: Newspaper, description: 'Manage articles and press releases' },
        { id: 'newsletter', label: 'Newsletter', icon: Mail, description: 'Manage subscribers and campaigns' },
        { id: 'faqs', label: 'FAQ', icon: HelpCircle, description: 'Frequently Asked Questions' },
    ] as const;

    const tabs = allTabs.filter(tab => {
        // Example: Only show news if user has access to content module
        // You can add more specific module checks here if needed
        return true; 
    });

    // Extract current tab from URL
    const currentPath = location.pathname.split('/admin/content/')[1] || 'news';
    const activeTab = currentPath.split('/')[0];

    return (
        <div className="space-y-8 pb-20">
            <div className="space-y-2 px-1 text-left">
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                    Website <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">Content</span>
                </h1>
                <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Manage dynamic site content</p>
            </div>

            <div className="bg-white p-3 rounded-[3rem] border border-gray-100 shadow-sm flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => navigate(`/admin/content/${tab.id}`)}
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
                    <Route path="news" element={<NewsManager />} />
                    <Route path="newsletter" element={<NewsletterManager />} />
                    <Route path="faqs" element={<FAQManager />} />

                    {/* Redirect root to news */}
                    <Route path="/" element={<Navigate to="news" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default WebsiteContentManager;
