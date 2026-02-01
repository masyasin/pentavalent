import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import RichTextEditor from '../../components/admin/RichTextEditor';
import FileUpload from '../../components/admin/FileUpload';
import { useLanguage } from '../../contexts/LanguageContext';
import { Save, RefreshCw, CheckCircle2, AlertCircle, Type, Image as ImageIcon, Briefcase, Eye, Target, Sparkles, Network, Building2, User as UserIcon, Plus } from 'lucide-react';
import OrganizationManager from '../../components/admin/OrganizationManager';
import StructureManager from '../../components/admin/StructureManager';

interface CompanyInfo {
    id: string;
    tagline_id: string;
    tagline_en: string;
    title_text_id: string;
    title_text_en: string;
    title_italic_id: string;
    title_italic_en: string;
    description_id: string;
    description_en: string;
    stats_years_value: string;
    stats_years_label_id: string;
    stats_years_label_en: string;
    stats_public_value: string;
    stats_public_label_id: string;
    stats_public_label_en: string;
    image_url: string;
    vision_text_id: string;
    vision_text_en: string;
    mission_text_id: string;
    mission_text_en: string;
}

const GeneralInfoManager: React.FC = () => {
    const { t } = useLanguage();
    const [info, setInfo] = useState<CompanyInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [translating, setTranslating] = useState<string | null>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'management' | 'structure'>('profile');
    const [companyStats, setCompanyStats] = useState<any[]>([]);
    const [loadingStats, setLoadingStats] = useState(false);

    useEffect(() => {
        fetchInfo();
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoadingStats(true);
            const { data, error } = await supabase
                .from('site_settings')
                .select('company_stats')
                .single();
            if (data?.company_stats) {
                setCompanyStats(data.company_stats as any[]);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    const saveStats = async (newStats: any[]) => {
        try {
            setSaving(true);
            const { data: settings } = await supabase
                .from('site_settings')
                .select('id')
                .single();

            if (settings) {
                const { error } = await supabase
                    .from('site_settings')
                    .update({ company_stats: newStats })
                    .eq('id', settings.id);
                if (error) throw error;
                setCompanyStats(newStats);
                toast.success('Company statistics updated successfully');
            }
        } catch (error: any) {
            console.error('Error saving stats:', error);
            toast.error(error.message || 'Error updating statistics');
        } finally {
            setSaving(false);
        }
    };

    const handleAutoTranslate = async (sourceText: string, targetField: keyof CompanyInfo) => {
        if (!sourceText || !info) return;

        try {
            setTranslating(targetField);
            const translated = await translateText(sourceText, 'id', 'en');
            setInfo({ ...info, [targetField]: translated });
        } catch (error) {
            console.error('Translation failed:', error);
        } finally {
            setTranslating(null);
        }
    };

    const fetchInfo = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('company_info')
                .select('*')
                .single();

            if (data) {
                setInfo(data);
            }
        } catch (error) {
            console.error('Error fetching company info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!info) return;

        setSaving(true);
        setStatus(null);

        try {
            const { error } = await supabase
                .from('company_info')
                .update({
                    ...info,
                    updated_at: new Date().toISOString()
                })
                .eq('id', info.id);

            if (error) throw error;
            toast.success('Corporate profile updated successfully!');
        } catch (error: any) {
            console.error('Error saving info:', error);
            toast.error(error.message || 'Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-24">
                <RefreshCw className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="text-left">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic underline decoration-blue-500 decoration-8 underline-offset-8">{t('admin.company.general.title')}</h2>
                    <p className="text-gray-500 mt-2">{t('admin.company.general.subtitle')}</p>
                </div>
                {activeTab === 'profile' && (
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-8 py-4 bg-blue-600 text-white rounded-3xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-blue-100 disabled:opacity-50 uppercase tracking-widest text-sm"
                    >
                        {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        {t('admin.company.general.apply')}
                    </button>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex p-1 bg-white rounded-2xl border border-gray-100 w-fit">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                    <Building2 size={16} />
                    {t('admin.company.general.tab.profile')}
                </button>
                <button
                    onClick={() => setActiveTab('management')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'management' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                    <UserIcon size={16} />
                    {t('admin.company.general.tab.member')}
                </button>
                <button
                    onClick={() => setActiveTab('structure')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'structure' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                    <Network size={16} />
                    {t('admin.company.general.tab.visual')}
                </button>
            </div>

            {status && (
                <div className={`p-6 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-green-50 text-green-700 border-2 border-green-100' : 'bg-red-50 text-red-700 border-2 border-red-100'
                    }`}>
                    {status.type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                    <span className="font-extrabold text-lg italic uppercase tracking-tight">{status.message}</span>
                </div>
            )}

            {activeTab === 'profile' ? (
                <form onSubmit={handleSubmit} className="space-y-10 selection:bg-blue-100 text-left">
                    {/* Hero Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 space-y-8">
                            <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <Type size={24} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Main Narrative</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Tagline (ID)</label>
                                    <input
                                        type="text"
                                        value={info?.tagline_id}
                                        onChange={(e) => setInfo({ ...info!, tagline_id: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl transition-all font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Tagline (EN)</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(info?.tagline_id || '', 'tagline_en')}
                                            disabled={!!translating}
                                            className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                        >
                                            {translating === 'tagline_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[8px] font-black uppercase tracking-widest">Auto Translate</span>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={info?.tagline_en}
                                        onChange={(e) => setInfo({ ...info!, tagline_en: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] px-2 italic">Title Prefix (ID)</label>
                                        <input
                                            type="text"
                                            value={info?.title_text_id}
                                            onChange={(e) => setInfo({ ...info!, title_text_id: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl transition-all font-black text-lg italic"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] px-2 italic">Title Italic (ID)</label>
                                        <input
                                            type="text"
                                            value={info?.title_italic_id}
                                            onChange={(e) => setInfo({ ...info!, title_italic_id: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl transition-all font-black text-lg italic"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-2">
                                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] italic">Title Prefix (EN)</label>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoTranslate(info?.title_text_id || '', 'title_text_en')}
                                                disabled={!!translating}
                                                className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                            >
                                                {translating === 'title_text_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                <span className="text-[8px] font-black uppercase tracking-widest">Auto Translate</span>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={info?.title_text_en}
                                            onChange={(e) => setInfo({ ...info!, title_text_en: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl transition-all font-black text-lg italic"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-2">
                                            <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] italic">Title Italic (EN)</label>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoTranslate(info?.title_italic_id || '', 'title_italic_en')}
                                                disabled={!!translating}
                                                className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                            >
                                                {translating === 'title_italic_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                <span className="text-[8px] font-black uppercase tracking-widest">Auto Translate</span>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={info?.title_italic_en}
                                            onChange={(e) => setInfo({ ...info!, title_italic_en: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl transition-all font-black text-lg italic"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Description (ID)</label>
                                    <div className="rounded-[2rem] overflow-hidden border-2 border-transparent focus-within:border-blue-500 transition-all">
                                        <RichTextEditor
                                            content={info?.description_id || ''}
                                            onChange={(content) => setInfo({ ...info!, description_id: content })}
                                            placeholder="Deskripsi perusahaan dalam Bahasa Indonesia..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Description (EN)</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(info?.description_id || '', 'description_en')}
                                            disabled={!!translating}
                                            className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                        >
                                            {translating === 'description_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[8px] font-black uppercase tracking-widest">Auto Translate</span>
                                        </button>
                                    </div>
                                    <div className="rounded-[2rem] overflow-hidden border-2 border-transparent focus-within:border-blue-500 transition-all">
                                        <RichTextEditor
                                            content={info?.description_en || ''}
                                            onChange={(content) => setInfo({ ...info!, description_en: content })}
                                            placeholder="Company description in English..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Featured Image */}
                            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 space-y-6">
                                <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                                    <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                        <ImageIcon size={20} />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight italic">Corporate Visual</h3>
                                </div>
                                <FileUpload
                                    onUploadComplete={(url) => setInfo({ ...info!, image_url: url })}
                                    currentUrl={info?.image_url || ''}
                                    label="Corporate Visual (Grand Office Building)"
                                    bucket="images"
                                    type="image"
                                />
                            </div>

                            {/* Statistics */}
                            <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl space-y-8">
                                <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                                    <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-400">
                                        <Briefcase size={20} />
                                    </div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight italic">Key Statistics</h3>
                                </div>

                                <div className="space-y-6">
                                    {companyStats.map((stat, index) => (
                                        <div key={index} className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/30 space-y-4 group">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <select
                                                        value={stat.icon}
                                                        onChange={(e) => {
                                                            const newStats = [...companyStats];
                                                            newStats[index] = { ...newStats[index], icon: e.target.value };
                                                            saveStats(newStats);
                                                        }}
                                                        className="bg-slate-800 text-blue-400 text-xs font-black p-2 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="Clock">Clock</option>
                                                        <option value="Building2">Building</option>
                                                        <option value="Users">Users</option>
                                                        <option value="TrendingUp">Trend</option>
                                                        <option value="Award">Award</option>
                                                        <option value="Globe">Globe</option>
                                                        <option value="Shield">Shield</option>
                                                        <option value="MapPin">MapPin</option>
                                                    </select>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newStats = companyStats.filter((_, i) => i !== index);
                                                        saveStats(newStats);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                                >
                                                    <AlertCircle size={16} />
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    value={stat.value}
                                                    onChange={(e) => {
                                                        const newStats = [...companyStats];
                                                        newStats[index] = { ...newStats[index], value: e.target.value };
                                                        setCompanyStats(newStats);
                                                    }}
                                                    onBlur={() => saveStats(companyStats)}
                                                    className="w-full px-4 py-3 bg-slate-800 border-none rounded-xl text-white font-black text-2xl italic tracking-tight"
                                                    placeholder="Value (e.g. 55+)"
                                                />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        value={stat.label_id}
                                                        onChange={(e) => {
                                                            const newStats = [...companyStats];
                                                            newStats[index] = { ...newStats[index], label_id: e.target.value };
                                                            setCompanyStats(newStats);
                                                        }}
                                                        onBlur={() => saveStats(companyStats)}
                                                        className="px-3 py-2 bg-slate-800/80 border-none rounded-lg text-slate-300 text-[10px] font-black uppercase tracking-tighter"
                                                        placeholder="Label (ID)"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={stat.label_en}
                                                        onChange={(e) => {
                                                            const newStats = [...companyStats];
                                                            newStats[index] = { ...newStats[index], label_en: e.target.value };
                                                            setCompanyStats(newStats);
                                                        }}
                                                        onBlur={() => saveStats(companyStats)}
                                                        className="px-3 py-2 bg-slate-800/80 border-none rounded-lg text-slate-500 text-[10px] font-black uppercase tracking-tighter"
                                                        placeholder="Label (EN)"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newStats = [...companyStats, { value: '0', label_id: 'Label', label_en: 'Label', icon: 'Clock' }];
                                            saveStats(newStats);
                                        }}
                                        className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 font-black uppercase tracking-widest text-[10px] hover:border-blue-500 hover:text-blue-400 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={14} /> Add New Stat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vision & Mission */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Vision Container */}
                        <div className="bg-white rounded-[4rem] p-12 shadow-xl border border-cyan-50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50/50 rounded-bl-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>

                            <div className="flex items-center gap-6 mb-12 relative z-10">
                                <div className="w-16 h-16 bg-cyan-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-cyan-200 group-hover:rotate-12 transition-transform">
                                    <Eye size={28} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900 italic tracking-tighter">Corporate Vision</h4>
                                    <p className="text-cyan-500 text-[10px] font-black uppercase tracking-widest mt-1">Strategic North Star</p>
                                </div>
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Vision Statement (ID)</label>
                                    <textarea
                                        value={info?.vision_text_id}
                                        onChange={(e) => setInfo({ ...info!, vision_text_id: e.target.value })}
                                        rows={4}
                                        className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-cyan-500 focus:bg-white rounded-[2.5rem] transition-all font-black text-xl italic text-slate-700 leading-snug shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Vision Statement (EN)</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(info?.vision_text_id || '', 'vision_text_en')}
                                            disabled={!!translating}
                                            className="text-cyan-500 hover:text-cyan-700 transition-colors flex items-center gap-1 group"
                                        >
                                            {translating === 'vision_text_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[8px] font-black uppercase tracking-widest">Auto Translate</span>
                                        </button>
                                    </div>
                                    <textarea
                                        value={info?.vision_text_en}
                                        onChange={(e) => setInfo({ ...info!, vision_text_en: e.target.value })}
                                        rows={4}
                                        className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-cyan-500 focus:bg-white rounded-[2.5rem] transition-all font-black text-xl italic text-slate-400 focus:text-slate-700 leading-snug shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mission Container */}
                        <div className="bg-white rounded-[4rem] p-12 shadow-xl border border-blue-50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>

                            <div className="flex items-center gap-6 mb-12 relative z-10">
                                <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:-rotate-12 transition-transform">
                                    <Target size={28} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900 italic tracking-tighter">Corporate Mission</h4>
                                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-1">Tactical Commitment</p>
                                </div>
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Mission Statement (ID)</label>
                                    <textarea
                                        value={info?.mission_text_id}
                                        onChange={(e) => setInfo({ ...info!, mission_text_id: e.target.value })}
                                        rows={4}
                                        className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2.5rem] transition-all font-black text-xl italic text-slate-700 leading-snug shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Mission Statement (EN)</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(info?.mission_text_id || '', 'mission_text_en')}
                                            disabled={!!translating}
                                            className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                        >
                                            {translating === 'mission_text_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[8px] font-black uppercase tracking-widest">Auto Translate</span>
                                        </button>
                                    </div>
                                    <textarea
                                        value={info?.mission_text_en}
                                        onChange={(e) => setInfo({ ...info!, mission_text_en: e.target.value })}
                                        rows={4}
                                        className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2.5rem] transition-all font-black text-xl italic text-slate-400 focus:text-slate-700 leading-snug shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            ) : activeTab === 'management' ? (
                <OrganizationManager />
            ) : (
                <StructureManager />
            )}
        </div>
    );
};

export default GeneralInfoManager;
