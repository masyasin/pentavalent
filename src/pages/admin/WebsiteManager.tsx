import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import SiteSettingsManager from './SiteSettingsManager';
import MenuManager from './MenuManager';
import HeroSliderManager from './HeroSliderManager';
import PageBannersManager from './PageBannersManager';
import ChannelsManager from './ChannelsManager';
import SeoManager from './SeoManager';
import UserManager from './UserManager';
import { Settings, Menu, Image, Layout, Share2, Search, Users } from 'lucide-react';

const WebsiteManager: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        { id: 'settings', label: 'Site Setting', icon: Settings, description: 'Global identity & contact info' },
        { id: 'menus', label: 'Menu Manager', icon: Menu, description: 'Navigation structure' },
        { id: 'sliders', label: 'Banner Slider', icon: Image, description: 'Homepage hero sliders' },
        { id: 'banners', label: 'Page Banners', icon: Layout, description: 'Internal page headers' },

        { id: 'channels', label: 'Channel Setting', icon: Share2, description: 'Distribution channels' },
        { id: 'seo', label: 'SEO Settings', icon: Search, description: 'Search Engine Optimization' },
        { id: 'users', label: 'User Management', icon: Users, description: 'Manage admin users' },
    ] as const;

    // Extract current tab from URL
    // URL structure: /admin/website/:tab
    const currentPath = location.pathname.split('/admin/website/')[1] || 'settings';
    const activeTab = currentPath.split('/')[0];

    return (
        <div className="space-y-8 pb-20">
            <div className="space-y-2 px-1 text-left">
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                    Website <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">Settings</span>
                </h1>
                <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Manage your website content and configuration</p>
            </div>

            <div className="bg-white p-3 rounded-[3rem] border border-gray-100 shadow-sm flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => navigate(`/admin/website/${tab.id}`)}
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
                    <Route path="settings" element={<SiteSettingsManager />} />
                    <Route path="menus" element={<MenuManager />} />
                    <Route path="sliders" element={<HeroSliderManager />} />
                    <Route path="banners" element={<PageBannersManager />} />
                    <Route path="channels" element={<ChannelsManager />} />
                    <Route path="seo" element={<SeoManager />} />
                    <Route path="users" element={<UserManager />} />

                    {/* Redirect root to settings */}
                    <Route path="/" element={<Navigate to="settings" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default WebsiteManager;
