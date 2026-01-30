import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import FileUpload from '../../components/admin/FileUpload';
import { translateText } from '../../lib/translation';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Plus, Edit2, Trash2, Box, Image as ImageIcon,
    X, Save, Layers, ArrowRight, Sparkles, RefreshCw, Maximize2, Minimize2, ChevronRight
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface BusinessLine {
    id: string;
    slug: string;
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    images: string[];
    image_url: string; // Keep for backward compatibility/thumbnail
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

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
        description_id: '',
        description_en: '',
        images: [] as string[],
        sort_order: 0,
        is_active: true,
    });

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
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;

            // Map data to ensure images array is populated
            const formattedData = (data || []).map(item => ({
                ...item,
                images: item.images || (item.image_url ? [item.image_url] : [])
            }));

            setLines(formattedData);
        } catch (error) {
            console.error('Error fetching business lines:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const slug = formData.slug || formData.title_en.toLowerCase().replace(/\s+/g, '-');

            // Prepare payload
            // Ensure image_url is set to the first image if available, for backward compatibility
            const primaryImage = formData.images.length > 0 ? formData.images[0] : null;

            const data = {
                ...formData,
                slug,
                image_url: primaryImage
            };

            if (editingLine) {
                const { error } = await supabase
                    .from('business_lines')
                    .update(data)
                    .eq('id', editingLine.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('business_lines')
                    .insert(data);
                if (error) throw error;
            }

            setShowModal(false);
            resetForm();
            fetchLines();
        } catch (error) {
            console.error('Error saving business line:', error);
        }
    };

    const resetForm = () => {
        setEditingLine(null);
        setFormData({
            slug: '',
            title_id: '',
            title_en: '',
            description_id: '',
            description_en: '',
            images: [],
            sort_order: 1,
            is_active: true,
        });
    };

    const handleEdit = (item: BusinessLine) => {
        setEditingLine(item);
        setFormData({
            slug: item.slug,
            title_id: item.title_id,
            title_en: item.title_en,
            description_id: item.description_id || '',
            description_en: item.description_en || '',
            images: item.images && item.images.length > 0
                ? item.images
                : (item.image_url ? [item.image_url] : []),
            sort_order: item.sort_order || 1,
            is_active: item.is_active,
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
            fetchLines();
        } catch (error) {
            console.error('Error deleting business line:', error);
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

            <div className="grid grid-cols-1 gap-8">
                {loading ? (
                    <div className="py-24 text-center text-gray-300 font-black uppercase tracking-widest animate-pulse">Synchronizing Global Units...</div>
                ) : lines.length === 0 ? (
                    <div className="bg-white rounded-[3.5rem] border-4 border-dashed border-gray-100 p-24 text-center space-y-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200">
                            <Layers size={64} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 uppercase italic">Architecture Empty</h3>
                            <p className="text-gray-400 font-medium">No business divisions have been deployed to the global ledger.</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-blue-600 font-black flex items-center gap-2 mx-auto hover:scale-105 transition-all uppercase tracking-widest text-xs"
                        >
                            Deploy New Strategy <Plus size={16} />
                        </button>
                    </div>
                ) : (
                    lines.map((item) => (
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
                                        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors">
                                            {language === 'id' ? item.title_id : item.title_en}
                                        </h3>
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
                    ))
                )}
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
