import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import {
    Search, Edit2, Globe, Save, X,
    Settings, Layout, Share2, Tag,
    CheckCircle2, AlertCircle, RefreshCw, Sparkles
} from 'lucide-react';

interface SeoSetting {
    id: string;
    page_slug: string;
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    keywords_id: string;
    keywords_en: string;
    og_image: string;
    updated_at: string;
}

const PAGE_LIST = [
    { slug: 'home', label: 'Home Page' },
    { slug: 'about', label: 'About Us' },
    { slug: 'products', label: 'Products & Services' },
    { slug: 'news', label: 'News & Insights' },
    { slug: 'careers', label: 'Careers' },
    { slug: 'investor', label: 'Investor Relations' },
    { slug: 'contact', label: 'Contact Us' },
];

const SeoManager: React.FC = () => {
    const [seoList, setSeoList] = useState<SeoSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSeo, setEditingSeo] = useState<SeoSetting | null>(null);
    const [translating, setTranslating] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<SeoSetting>>({
        page_slug: 'home',
        title_id: '',
        title_en: '',
        description_id: '',
        description_en: '',
        keywords_id: '',
        keywords_en: '',
        og_image: '',
    });

    useEffect(() => {
        fetchSeo();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: keyof SeoSetting) => {
        if (!sourceText) return;

        try {
            setTranslating(targetField);
            const translated = await translateText(sourceText, 'id', 'en');
            setFormData(prev => ({ ...prev, [targetField]: translated }));
        } catch (error) {
            console.error('Translation failed:', error);
        } finally {
            setTranslating(null);
        }
    };

    const fetchSeo = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('seo_settings')
                .select('*')
                .order('page_slug', { ascending: true });

            if (error) throw error;
            setSeoList(data || []);
        } catch (error) {
            console.error('Error fetching SEO:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('seo_settings')
                .upsert({
                    ...formData,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            setShowModal(false);
            fetchSeo();
        } catch (error) {
            console.error('Error saving SEO:', error);
        }
    };

    const handleEdit = (item: SeoSetting) => {
        setEditingSeo(item);
        setFormData(item);
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic underline decoration-blue-500 decoration-8 underline-offset-4">Search Engine Optimization</h2>
                    <p className="text-gray-500 mt-2 font-medium">Maximize visibility and click-through rates across search engines</p>
                </div>
                <button
                    onClick={() => {
                        setEditingSeo(null);
                        setFormData({
                            page_slug: 'home',
                            title_id: '',
                            title_en: '',
                            description_id: '',
                            description_en: '',
                            keywords_id: '',
                            keywords_en: '',
                            og_image: '',
                        });
                        setShowModal(true);
                    }}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-blue-100 active:scale-95 uppercase tracking-widest text-sm"
                >
                    <Settings size={18} />
                    Configure Page SEO
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Scanning Metadata...</div>
                ) : PAGE_LIST.map((page) => {
                    const config = seoList.find(s => s.page_slug === page.slug);
                    return (
                        <div key={page.slug} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:border-blue-500 transition-all group relative overflow-hidden">
                            {config && (
                                <div className="absolute top-0 right-0 p-4">
                                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-200"></div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Layout size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 uppercase tracking-tight">{page.label}</h3>
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">{page.slug}.html</p>
                                </div>
                            </div>

                            {config ? (
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Meta Title</p>
                                        <p className="text-sm font-bold text-gray-700 line-clamp-1 italic">"{config.title_en}"</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Description</p>
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{config.description_en}</p>
                                    </div>
                                    <button
                                        onClick={() => handleEdit(config)}
                                        className="w-full mt-4 py-3 bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Edit2 size={12} /> Edit Configuration
                                    </button>
                                </div>
                            ) : (
                                <div className="py-6 text-center space-y-4">
                                    <p className="text-xs font-bold text-gray-300 uppercase italic">No Configuration Found</p>
                                    <button
                                        onClick={() => {
                                            setEditingSeo(null);
                                            setFormData({ ...formData, page_slug: page.slug });
                                            setShowModal(true);
                                        }}
                                        className="px-6 py-2 border-2 border-dashed border-gray-100 text-blue-400 hover:border-blue-400 hover:text-blue-500 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        Initialize SEO
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                                    <Share2 size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">SEO Configuration</h3>
                                    <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mt-1">Configuring: {PAGE_LIST.find(p => p.slug === formData.page_slug)?.label}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12">
                            {/* Page Selection (if creating new) */}
                            {!editingSeo && (
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Target Page</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {PAGE_LIST.map(p => (
                                            <button
                                                key={p.slug}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, page_slug: p.slug })}
                                                className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${formData.page_slug === p.slug ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-blue-200'
                                                    }`}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Metadata Sections */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Indonesian Version */}
                                <div className="space-y-8 p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Indonesian Metadata</h4>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Meta Title (ID)</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title_id || ''}
                                                onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                                                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                                placeholder="Judul halaman..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description (ID)</label>
                                            <textarea
                                                required
                                                value={formData.description_id || ''}
                                                onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                                                rows={3}
                                                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm leading-relaxed"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Keywords (ID, comma separated)</label>
                                            <input
                                                type="text"
                                                value={formData.keywords_id || ''}
                                                onChange={(e) => setFormData({ ...formData, keywords_id: e.target.value })}
                                                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* English Version */}
                                <div className="space-y-8 p-8 bg-blue-50/30 rounded-[2.5rem] border border-blue-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">English Metadata</h4>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meta Title (EN)</label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.title_id || '', 'title_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group"
                                                >
                                                    {translating === 'title_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Auto</span>
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title_en || ''}
                                                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                                className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description (EN)</label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.description_id || '', 'description_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group"
                                                >
                                                    {translating === 'description_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Auto</span>
                                                </button>
                                            </div>
                                            <textarea
                                                required
                                                value={formData.description_en || ''}
                                                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                                rows={3}
                                                className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm leading-relaxed"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Keywords (EN)</label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.keywords_id || '', 'keywords_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group"
                                                >
                                                    {translating === 'keywords_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Auto</span>
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.keywords_en || ''}
                                                onChange={(e) => setFormData({ ...formData, keywords_en: e.target.value })}
                                                className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Share Image */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Tag className="text-blue-500" size={18} />
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight italic">Social Share (OpenGraph)</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-8 items-center">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">OG Image URL</label>
                                        <input
                                            type="url"
                                            value={formData.og_image || ''}
                                            onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="h-32 bg-gray-900 rounded-[2rem] overflow-hidden flex items-center justify-center relative border border-gray-800">
                                        {formData.og_image ? (
                                            <img src={formData.og_image} className="w-full h-full object-cover opacity-50" />
                                        ) : (
                                            <Share2 className="text-gray-700" size={40} />
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center p-6">
                                            <div className="w-full space-y-2">
                                                <div className="h-3 w-3/4 bg-white/20 rounded"></div>
                                                <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-6 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-10 py-5 border-2 border-gray-100 text-gray-400 font-black rounded-3xl hover:bg-gray-50 transition-all uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-10 py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                                >
                                    <Save size={24} />
                                    Commit SEO Updates
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeoManager;
