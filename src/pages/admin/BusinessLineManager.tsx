import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import FileUpload from '../../components/admin/FileUpload';
import { translateText } from '../../lib/translation';
import {
    Plus, Edit2, Trash2, Box, Image as ImageIcon,
    X, Save, Layers, ArrowRight, Sparkles, RefreshCw, Maximize2, Minimize2
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
            const translated = await translateText(sourceText);
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
            sort_order: 0,
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
            sort_order: item.sort_order || 0,
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight text-blue-900 uppercase">Business Divisions</h2>
                    <p className="text-gray-500 text-sm">Manage company business lines and divisions</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                    <Plus size={20} />
                    ADD DIVISION
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading units...</div>
                ) : (
                    lines.map((item) => (
                        <div key={item.id} className="bg-white rounded-[2rem] p-6 border border-gray-100 hover:border-blue-200 transition-all group shadow-sm flex items-center gap-6">
                            <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center overflow-hidden border border-gray-50 shrink-0 relative">
                                {item.images && item.images.length > 0 ? (
                                    <>
                                        <img src={item.images[0]} alt={item.title_id} className="w-full h-full object-cover" />
                                        {item.images.length > 1 && (
                                            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                +{item.images.length - 1}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Box className="text-gray-200" size={32} />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                                            {item.title_id}
                                        </h3>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{item.title_en}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="p-3 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-xl transition-all">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id, item.title_id)} className="p-3 text-gray-400 hover:text-red-600 bg-gray-50 rounded-xl transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-4">
                                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                        Order: {item.sort_order}
                                    </span>
                                    <div className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-4 transition-all duration-300">
                    <div className={`bg-white shadow-2xl transition-all duration-500 ease-in-out flex flex-col ${isMaximized
                        ? 'w-full h-full rounded-0'
                        : 'max-w-6xl w-full max-h-[92vh] rounded-[3rem]'
                        }`}>
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                                    <Layers size={28} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">
                                        {editingLine ? 'Update Division' : 'New Division'}
                                    </h3>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none">Business Architecture Unit</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsMaximized(!isMaximized)}
                                    className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-gray-400 hover:text-blue-600"
                                    title={isMaximized ? "Exit Fullscreen" : "Fullscreen"}
                                >
                                    {isMaximized ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-gray-400 hover:text-red-500"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Title (Indonesian)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_id}
                                        onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-gray-900 text-lg"
                                        placeholder="e.g. Distribusi Farmasi"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Title (English)</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(formData.title_id, 'title_en')}
                                            disabled={!!translating}
                                            className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                        >
                                            {translating === 'title_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Auto</span>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_en}
                                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-gray-900 text-lg"
                                        placeholder="e.g. Pharma Distribution"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">URL Slug</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium text-blue-600"
                                        placeholder="pharma-distribution"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Sort Order</label>
                                    <input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold"
                                    />
                                </div>
                            </div>

                            {/* Image Gallery Section */}
                            <div className="space-y-4 pt-4">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Division Gallery</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {formData.images.map((url, index) => (
                                        <div key={index} className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group">
                                            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            {index === 0 && (
                                                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg">
                                                    Hero
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div className="relative aspect-square">
                                        <FileUpload
                                            onUploadComplete={handleAddImage}
                                            label="Add Image"
                                            bucket="images"
                                            type="image"
                                            currentUrl="" // Always reset to allow new uploads
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium italic">
                                    * The first image will be used as the main/thumbnail image. Upload multiple images to create a carousel.
                                </p>
                            </div>

                            {/* Description Sections */}
                            <div className="space-y-8 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Layers className="text-blue-600" size={24} />
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">Detailed Description</h4>
                                </div>
                                <div className={`grid gap-12 ${isMaximized ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.15em] flex items-center gap-2">
                                            <span className="w-6 h-1 bg-blue-500 rounded-full"></span>
                                            INDONESIAN DESCRIPTION
                                        </label>
                                        <RichTextEditor
                                            content={formData.description_id}
                                            onChange={(val) => setFormData({ ...formData, description_id: val })}
                                            placeholder="Jelaskan lini bisnis ini secara mendalam..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-gray-700">
                                            <label className="text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2">
                                                <span className="w-6 h-1 bg-emerald-500 rounded-full"></span>
                                                ENGLISH DESCRIPTION
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoTranslate(formData.description_id, 'description_en')}
                                                disabled={!!translating}
                                                className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                            >
                                                {translating === 'description_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Auto Translate</span>
                                            </button>
                                        </div>
                                        <RichTextEditor
                                            content={formData.description_en}
                                            onChange={(val) => setFormData({ ...formData, description_en: val })}
                                            placeholder="Explain this business line in depth..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                                <input
                                    type="checkbox"
                                    id="line_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-6 h-6 text-blue-600 rounded-xl border-blue-200"
                                />
                                <label htmlFor="line_active" className="text-lg font-black text-blue-900 uppercase tracking-tight">
                                    Status: Active & Visible
                                </label>
                            </div>

                            <div className="flex gap-6 pt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-10 py-5 border-2 border-gray-100 text-gray-400 font-black rounded-3xl hover:bg-gray-50 hover:text-gray-600 hover:border-gray-200 transition-all uppercase tracking-widest"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-10 py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                                >
                                    <Save size={24} />
                                    Confirm Changes
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
