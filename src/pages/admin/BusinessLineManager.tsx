import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import FileUpload from '../../components/admin/FileUpload';
import { translateText } from '../../lib/translation';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Plus, Edit2, Trash2, Box, Image as ImageIcon,
    X, Save, Layers, ArrowRight, Sparkles, RefreshCw, Maximize2, Minimize2, ChevronRight, ChevronLeft, Search
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';
interface BusinessLine {
    id: string;
    slug: string;
    title_id: string;
    title_en: string;
    subtitle_id: string;
    subtitle_en: string;
    description_id: string;
    description_en: string;
    color_accent: string;
    icon_name: string;
    features: string[];
    images: string[];
    image_url: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

const iconMap: Record<string, React.ReactNode> = {
    pill: (
        <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.642.316a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 00-.547 1.022l-.477 2.387a2 2 0 002.137 2.137l2.387-.477a2 2 0 001.022-.547l1.168-1.168a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-2.137-2.137l-2.387.477z" />
        </svg>
    ),
    microscope: (
        <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
    ),
    'shopping-bag': (
        <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    ),
    truck: (
        <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
        </svg>
    ),
    activity: (
        <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    )
};

const BusinessLineManager: React.FC = () => {
    const { t, language } = useLanguage();
    const [lines, setLines] = useState<BusinessLine[]>([]);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [editingLine, setEditingLine] = useState<BusinessLine | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });
    const [formData, setFormData] = useState({
        slug: '',
        title_id: '',
        title_en: '',
        subtitle_id: '',
        subtitle_en: '',
        color_accent: 'from-blue-600 to-blue-800',
        icon_name: 'pill',
        description_id: '',
        description_en: '',
        images: [] as string[],
        sort_order: 0,
        is_active: true,
        features: [] as string[],
    });

    // Pagination & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        fetchLines();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: string) => {
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

    const fetchLines = async () => {
        try {
            const { data, error } = await supabase
                .from('business_lines')
                .select(`
                    *,
                    business_features (
                        feature_id,
                        feature_en,
                        sort_order
                    )
                `)
                .order('sort_order', { ascending: true });

            if (error) throw error;

            // Map data to ensure images array is populated and features are extracted
            const formattedData = (data || []).map(item => ({
                ...item,
                images: item.images || (item.image_url ? [item.image_url] : []),
                features: item.business_features
                    ? item.business_features.sort((a: any, b: any) => a.sort_order - b.sort_order).map((f: any) => f.feature_id)
                    : []
            }));

            setLines(formattedData);
        } catch (error) {
            console.error('Error fetching business lines:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFeaturesChange = (value: string) => {
        const features = value.split('\n').filter(f => f.trim() !== '');
        setFormData(prev => ({ ...prev, features }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const slug = formData.slug || formData.title_en.toLowerCase().replace(/\s+/g, '-');
            const primaryImage = formData.images.length > 0 ? formData.images[0] : null;

            const payload = {
                slug,
                title_id: formData.title_id,
                title_en: formData.title_en,
                subtitle_id: formData.subtitle_id,
                subtitle_en: formData.subtitle_en,
                description_id: formData.description_id,
                description_en: formData.description_en,
                color_accent: formData.color_accent,
                icon_name: formData.icon_name,
                images: formData.images,
                image_url: primaryImage,
                sort_order: formData.sort_order,
                is_active: formData.is_active,
            };

            let businessId = editingLine?.id;

            if (editingLine) {
                const { error } = await supabase
                    .from('business_lines')
                    .update(payload)
                    .eq('id', editingLine.id);
                if (error) throw error;
                toast.success('Business line updated successfully');
            } else {
                const { data, error } = await supabase
                    .from('business_lines')
                    .insert(payload)
                    .select()
                    .single();
                if (error) throw error;
                businessId = data.id;
                toast.success('Business line created successfully');
            }

            // Sync features
            if (businessId) {
                // Delete existing features
                await supabase.from('business_features').delete().eq('business_line_id', businessId);

                // Insert new ones
                if (formData.features.length > 0) {
                    const featuresPayload = formData.features.map((f, idx) => ({
                        business_line_id: businessId,
                        feature_id: f,
                        feature_en: f, // For now keeping same or use translation logic
                        sort_order: idx + 1
                    }));
                    await supabase.from('business_features').insert(featuresPayload);
                }
            }

            setShowModal(false);
            resetForm();
            fetchLines();
        } catch (error: any) {
            console.error('Error saving business line:', error);
            toast.error(error.message || 'Error saving business line');
        }
    };

    const resetForm = () => {
        setEditingLine(null);
        setFormData({
            slug: '',
            title_id: '',
            title_en: '',
            subtitle_id: '',
            subtitle_en: '',
            color_accent: 'from-blue-600 to-blue-800',
            icon_name: 'pill',
            description_id: '',
            description_en: '',
            images: [],
            sort_order: 1,
            is_active: true,
            features: [],
        });
    };

    const handleEdit = (item: BusinessLine) => {
        setEditingLine(item);
        setFormData({
            slug: item.slug,
            title_id: item.title_id,
            title_en: item.title_en,
            subtitle_id: item.subtitle_id || '',
            subtitle_en: item.subtitle_en || '',
            color_accent: item.color_accent || 'from-blue-600 to-blue-800',
            icon_name: item.icon_name || 'pill',
            description_id: item.description_id || '',
            description_en: item.description_en || '',
            images: item.images && item.images.length > 0
                ? item.images
                : (item.image_url ? [item.image_url] : []),
            sort_order: item.sort_order || 1,
            is_active: item.is_active,
            features: item.features || [],
        });
        setShowModal(true);
    };

    const handleDelete = (id: string, name: string) => {
        setDeleteDialog({ isOpen: true, id, name });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id) return;
        try {
            setLoading(true);
            const { error } = await supabase.from('business_lines').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            toast.success('Business line deleted successfully');
            fetchLines();
        } catch (error: any) {
            console.error('Error deleting business line:', error);
            toast.error(error.message || 'Error deleting business line');
        } finally {
            setLoading(false);
        }
    };

    const handleAddImage = (url: string) => {
        if (!url) return;
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, url]
        }));
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        Business <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">Divisions</span>
                    </h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                        Manage company business lines and global strategic divisions
                    </p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black flex items-center gap-3 hover:bg-blue-600 transition-all shadow-2xl shadow-slate-100 uppercase tracking-widest text-xs"
                >
                    <Plus size={18} />
                    Add Division
                </button>
            </div>

            {/* Search Check */}
            <div className="relative max-w-xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                    type="text"
                    placeholder="Search divisions by title or slug..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-8 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm italic"
                />
            </div>

            <div className="grid grid-cols-1 gap-8">
                {(() => {
                    const filteredLines = lines.filter(item => {
                        return item.title_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.slug.toLowerCase().includes(searchTerm.toLowerCase());
                    });

                    const totalPages = Math.ceil(filteredLines.length / itemsPerPage);
                    const paginatedLines = filteredLines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                    if (loading) {
                        return <div className="py-24 text-center text-gray-300 font-black uppercase tracking-widest animate-pulse">Synchronizing Global Units...</div>;
                    }

                    if (filteredLines.length === 0) {
                        return (
                            <div className="bg-white rounded-[3.5rem] border-4 border-dashed border-gray-100 p-24 text-center space-y-6">
                                <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200">
                                    <Layers size={64} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900 uppercase italic">Architecture Empty</h3>
                                    <p className="text-gray-400 font-medium">No business divisions found matching your search.</p>
                                </div>
                                {lines.length === 0 && (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="text-blue-600 font-black flex items-center gap-2 mx-auto hover:scale-105 transition-all uppercase tracking-widest text-xs"
                                    >
                                        Deploy New Strategy <Plus size={16} />
                                    </button>
                                )}
                            </div>
                        );
                    }

                    return (
                        <>
                            {paginatedLines.map((item) => (
                                <div key={item.id} className="bg-white rounded-[3rem] p-8 border border-gray-50 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group flex flex-col md:flex-row items-center gap-10 text-left relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -z-10 transition-all group-hover:scale-110 duration-700"></div>

                                    <div className="w-48 h-48 bg-slate-900 rounded-[2.5rem] flex items-center justify-center overflow-hidden border-8 border-white shadow-2xl shrink-0 group-hover:rotate-3 transition-transform duration-500">
                                        {item.images && item.images.length > 0 ? (
                                            <div className="relative w-full h-full">
                                                <img src={item.images[0]} alt={item.title_id} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                {item.images.length > 1 && (
                                                    <div className="absolute bottom-3 right-3 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg border border-white/20">
                                                        +{item.images.length - 1} GALLERY
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Box className="text-slate-800" size={64} />
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color_accent} flex items-center justify-center text-white shadow-lg`}>
                                                        {iconMap[item.icon_name] || iconMap['pill']}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors">
                                                            {language === 'id' ? item.title_id : item.title_en}
                                                        </h3>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{language === 'id' ? item.subtitle_id : item.subtitle_en}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50/50 px-3 py-1 rounded-lg uppercase tracking-widest italic">
                                                        Sequence Protocol #{item.sort_order}
                                                    </span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                        /{item.slug}
                                                    </span>
                                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${item.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                                        }`}>
                                                        <div className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                                        <span className="text-[9px] font-black uppercase tracking-widest">{item.is_active ? 'ACTIVE' : 'DEACTIVATED'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => handleEdit(item)} className="p-4 text-gray-400 hover:text-blue-600 bg-white shadow-sm border border-gray-50 hover:border-blue-100 rounded-2xl transition-all">
                                                    <Edit2 size={20} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id, item.title_id)} className="p-4 text-gray-400 hover:text-rose-500 bg-white shadow-sm border border-gray-50 hover:border-rose-100 rounded-2xl transition-all">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-gray-500 text-sm font-medium leading-relaxed italic line-clamp-2 group-hover:line-clamp-none transition-all cursor-pointer bg-gray-50/50 p-6 rounded-[2rem] border border-transparent group-hover:border-blue-50">
                                            {/* Just a preview of the content - strip HTML if necessary or use a snippet */}
                                            <div dangerouslySetInnerHTML={{ __html: language === 'id' ? item.description_id : item.description_en }} className="line-clamp-2" />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between p-4 px-8 bg-white rounded-[2rem] border border-gray-100">
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                        Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredLines.length)} of {filteredLines.length}
                                    </div>
                                    <div className="flex bg-gray-50 rounded-xl p-1 gap-1">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 hover:bg-white rounded-lg disabled:opacity-30 transition-all shadow-sm"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <div className="flex items-center px-4 font-black text-xs text-gray-900">
                                            {currentPage} / {totalPages}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 hover:bg-white rounded-lg disabled:opacity-30 transition-all shadow-sm"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    );
                })()}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[200] flex items-center justify-center p-0 md:p-8 transition-all duration-500">
                    <div className={`bg-white shadow-2xl transition-all duration-500 flex flex-col animate-in zoom-in-95 ${isMaximized
                        ? 'w-full h-full rounded-0'
                        : 'max-w-6xl w-full max-h-[95vh] rounded-[4rem]'
                        }`}>
                        <div className="p-12 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div className="flex items-center gap-8 text-left">
                                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                                    <Layers size={40} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                                        {editingLine ? 'Configure Unit' : 'Deploy Division'}
                                    </h3>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Business Architecture Control Terminal</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsMaximized(!isMaximized)}
                                    className="p-4 hover:bg-white hover:shadow-xl rounded-[1.5rem] transition-all text-gray-400 hover:text-blue-600"
                                    title={isMaximized ? "Exit Fullscreen" : "Fullscreen"}
                                >
                                    {isMaximized ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-4 hover:bg-white hover:shadow-xl rounded-[1.5rem] transition-all text-gray-400 hover:text-rose-500"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] px-4 italic leading-none flex items-center gap-2">
                                        <span className="w-6 h-1 bg-blue-600 rounded-full"></span> Division Title (ID)
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_id}
                                        onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                                        className="w-full px-10 py-8 bg-gray-900 text-white border-none rounded-[3rem] focus:ring-8 focus:ring-blue-500/20 transition-all font-black text-3xl italic tracking-tight"
                                        placeholder="e.g. Logistik Medis"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-4">
                                        <label className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] italic leading-none flex items-center gap-2">
                                            <span className="w-6 h-1 bg-emerald-500 rounded-full"></span> Division Title (EN)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(formData.title_id, 'title_en')}
                                            disabled={!!translating}
                                            className="text-blue-600 hover:text-black transition-colors flex items-center gap-2 group"
                                        >
                                            {translating === 'title_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">Global Sync</span>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_en}
                                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        className="w-full px-10 py-8 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[3rem] transition-all font-black text-3xl italic tracking-tight"
                                        placeholder="e.g. Medical Logistics"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 italic leading-none">Global Slug / ID</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2.5rem] transition-all font-bold text-blue-600"
                                        placeholder="medical-logistics"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 italic leading-none">Sequence Order</label>
                                    <input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                        className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2.5rem] transition-all font-black"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 italic leading-none">Status</label>
                                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-[2.5rem] border-2 border-transparent focus-within:border-blue-500 transition-all">
                                        <label className="relative inline-flex items-center cursor-pointer px-2">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            />
                                            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                        <span className="text-xs font-black uppercase tracking-widest text-gray-900">{formData.is_active ? 'LIVE & GLOBAL' : 'DRAFT SEQUENCE'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] px-4 italic leading-none flex items-center gap-2">
                                        <span className="w-6 h-1 bg-blue-600 rounded-full"></span> Subtitle (ID)
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subtitle_id}
                                        onChange={(e) => setFormData({ ...formData, subtitle_id: e.target.value })}
                                        className="w-full px-8 py-6 bg-gray-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-lg italic"
                                        placeholder="Contoh: OBAT RESEP & NON-RESEP"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-4">
                                        <label className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] italic leading-none flex items-center gap-2">
                                            <span className="w-6 h-1 bg-emerald-500 rounded-full"></span> Subtitle (EN)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(formData.subtitle_id, 'subtitle_en')}
                                            disabled={!!translating}
                                            className="text-blue-600 hover:text-black transition-colors flex items-center gap-2 group"
                                        >
                                            {translating === 'subtitle_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">Global Sync</span>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subtitle_en}
                                        onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
                                        className="w-full px-8 py-6 bg-gray-50 border-none rounded-[2rem] focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-lg italic"
                                        placeholder="Example: PRESCRIPTION & NON-PRESCRIPTION"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 italic leading-none">Color Theme (Accent)</label>
                                    <select
                                        value={formData.color_accent}
                                        onChange={(e) => setFormData({ ...formData, color_accent: e.target.value })}
                                        className="w-full px-8 py-6 bg-gray-50 border-none rounded-[2.5rem] focus:ring-4 focus:ring-blue-500/10 font-bold"
                                    >
                                        <option value="from-blue-600 to-blue-800">Blue Gradient (Pharma)</option>
                                        <option value="from-cyan-500 to-cyan-700">Cyan Gradient (Medical)</option>
                                        <option value="from-emerald-500 to-emerald-700">Emerald Gradient (Consumer)</option>
                                        <option value="from-rose-500 to-rose-700">Rose Gradient</option>
                                        <option value="from-amber-500 to-amber-700">Amber Gradient</option>
                                        <option value="from-slate-400 to-slate-600">Slate Gradient (Generic)</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 italic leading-none">Icon Type</label>
                                    <select
                                        value={formData.icon_name}
                                        onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                                        className="w-full px-8 py-6 bg-gray-50 border-none rounded-[2.5rem] focus:ring-4 focus:ring-blue-500/10 font-bold"
                                    >
                                        <option value="pill">Pill / Health</option>
                                        <option value="microscope">Microscope / Lab</option>
                                        <option value="shopping-bag">Shopping Bag / FMCG</option>
                                        <option value="truck">Truck / Logistics</option>
                                        <option value="activity">Activity / General</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic flex items-center gap-2">
                                        <span className="w-6 h-1 bg-gray-400 rounded-full"></span> Divisional Features (Capabilities)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))}
                                        className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform bg-blue-50 px-4 py-2 rounded-xl"
                                    >
                                        <Plus size={14} /> Add Capability
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formData.features.map((feature, idx) => (
                                        <div key={idx} className="group/feature relative bg-gray-50 p-6 rounded-[2rem] border-2 border-transparent focus-within:border-blue-500/20 transition-all flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600 text-xs font-black shrink-0">
                                                {idx + 1}
                                            </div>
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => {
                                                    const newFeatures = [...formData.features];
                                                    newFeatures[idx] = e.target.value;
                                                    setFormData(prev => ({ ...prev, features: newFeatures }));
                                                }}
                                                className="flex-1 bg-transparent border-none outline-none font-bold text-gray-700 placeholder:text-gray-300"
                                                placeholder="Enter capability..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newFeatures = formData.features.filter((_, i) => i !== idx);
                                                    setFormData(prev => ({ ...prev, features: newFeatures }));
                                                }}
                                                className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 opacity-0 group-hover/feature:opacity-100 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.features.length === 0 && (
                                        <div className="md:col-span-2 py-12 text-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No capabilities defined for this sequence</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Image Gallery Section */}
                            <div className="space-y-8 pt-8 border-t border-gray-50">
                                <div className="flex items-center gap-3">
                                    <ImageIcon className="text-blue-600" size={24} />
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">Division Visualization Assets</h4>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {formData.images.map((url, index) => (
                                        <div key={index} className="relative aspect-square bg-slate-900 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl group/img">
                                            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="w-10 h-10 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow-lg flex items-center justify-center transform hover:scale-110"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                            {index === 0 && (
                                                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-2xl border border-white/20 italic">
                                                    Primary Core
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div className="relative aspect-square">
                                        <FileUpload
                                            onUploadComplete={handleAddImage}
                                            label="Add Visual Asset"
                                            bucket="images"
                                            type="image"
                                            currentUrl=""
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic px-4">
                                    Sequence Information: The 'Primary Core' asset will serve as the global identity thumbnail.
                                </p>
                            </div>

                            {/* Description Sections */}
                            <div className="space-y-10 pt-10 border-t border-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">Strategic Analysis & Summary</h4>
                                </div>
                                <div className={`grid gap-12 ${isMaximized ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic flex items-center gap-3">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                            INDONESIAN NARRATIVE
                                        </label>
                                        <div className="rounded-[3rem] overflow-hidden border-4 border-transparent focus-within:border-blue-500/10 transition-all shadow-2xl">
                                            <RichTextEditor
                                                content={formData.description_id}
                                                onChange={(val) => setFormData({ ...formData, description_id: val })}
                                                placeholder="Jelaskan lini bisnis ini secara mendalam..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-6">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic flex items-center gap-3">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                                ENGLISH NARRATIVE
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoTranslate(formData.description_id, 'description_en')}
                                                disabled={!!translating}
                                                className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 group shadow-sm"
                                            >
                                                {translating === 'description_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Auto Sequence</span>
                                            </button>
                                        </div>
                                        <div className="rounded-[3rem] overflow-hidden border-4 border-transparent focus-within:border-emerald-500/10 transition-all shadow-2xl">
                                            <RichTextEditor
                                                content={formData.description_en}
                                                onChange={(val) => setFormData({ ...formData, description_en: val })}
                                                placeholder="Explain this business line for global analysis..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 pt-12 border-t border-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-12 py-8 bg-gray-100 text-gray-500 font-black rounded-[2.5rem] hover:bg-black hover:text-white transition-all uppercase tracking-widest text-[11px]"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-[4rem] py-8 bg-blue-600 text-white font-black rounded-[2.5rem] hover:bg-black transition-all shadow-[0_20px_50px_-12px_rgba(37,99,235,0.3)] flex items-center justify-center gap-6 uppercase tracking-[0.3em] text-[11px]"
                                >
                                    <Save size={24} />
                                    Confirm Configuration
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                onConfirm={confirmDelete}
                itemName={deleteDialog.name}
                isLoading={loading}
            />
        </div>
    );
};

export default BusinessLineManager;
