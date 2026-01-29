import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import FileUpload from '../../components/admin/FileUpload';
import {
    Plus, Edit2, Trash2, Image as ImageIcon, Video,
    Save, X, MoveUp, MoveDown, CheckCircle2, AlertCircle,
    Link as LinkIcon, Type, Sparkles, RefreshCw
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface HeroSlide {
    id: string;
    title_id: string;
    title_en: string;
    subtitle_id: string;
    subtitle_en: string;
    image_url: string;
    video_url: string | null;
    cta_primary_text_id: string | null;
    cta_primary_text_en: string | null;
    cta_primary_link: string;
    cta_secondary_text_id: string | null;
    cta_secondary_text_en: string | null;
    cta_secondary_link: string;
    sort_order: number;
    is_active: boolean;
}

const HeroSliderManager: React.FC = () => {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [translating, setTranslating] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });
    const [formData, setFormData] = useState<Partial<HeroSlide>>({
        title_id: '',
        title_en: '',
        subtitle_id: '',
        subtitle_en: '',
        image_url: '',
        video_url: '',
        cta_primary_text_id: '',
        cta_primary_text_en: '',
        cta_primary_link: '#services',
        cta_secondary_text_id: '',
        cta_secondary_text_en: '',
        cta_secondary_link: '#contact',
        sort_order: 0,
        is_active: true,
    });

    useEffect(() => {
        fetchSlides();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: keyof HeroSlide) => {
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

    const fetchSlides = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('hero_slides')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setSlides(data || []);
        } catch (error) {
            console.error('Error fetching slides:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSlide) {
                const { error } = await supabase
                    .from('hero_slides')
                    .update(formData)
                    .eq('id', editingSlide.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('hero_slides')
                    .insert(formData);
                if (error) throw error;
            }

            setShowModal(false);
            resetForm();
            fetchSlides();
        } catch (error) {
            console.error('Error saving slide:', error);
        }
    };

    const resetForm = () => {
        setEditingSlide(null);
        setFormData({
            title_id: '',
            title_en: '',
            subtitle_id: '',
            subtitle_en: '',
            image_url: '',
            video_url: '',
            cta_primary_text_id: '',
            cta_primary_text_en: '',
            cta_primary_link: '#services',
            cta_secondary_text_id: '',
            cta_secondary_text_en: '',
            cta_secondary_link: '#contact',
            sort_order: slides.length,
            is_active: true,
        });
    };

    const handleEdit = (slide: HeroSlide) => {
        setEditingSlide(slide);
        setFormData(slide);
        setShowModal(true);
    };

    const handleDelete = (id: string, name: string) => {
        setDeleteDialog({ isOpen: true, id, name });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id) return;
        try {
            setLoading(true);
            const { error } = await supabase.from('hero_slides').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            fetchSlides();
        } catch (error) {
            console.error('Error deleting slide:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Hero Visuals</h2>
                    <p className="text-gray-500">Manage banner images and high-impact background videos</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-[0.15em] text-sm"
                >
                    <Plus size={18} />
                    Create New Slide
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="p-20 text-center text-gray-400">Loading visual assets...</div>
                ) : slides.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border-4 border-dashed border-gray-100 p-20 text-center">
                        <ImageIcon className="mx-auto text-gray-200 mb-6" size={64} />
                        <h3 className="text-2xl font-black text-gray-900 uppercase">No Slides Found</h3>
                        <p className="text-gray-500 mb-8">Your homepage hero section is currently empty</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-blue-600 font-black flex items-center gap-2 mx-auto hover:underline"
                        >
                            Add first slide now <Plus size={16} />
                        </button>
                    </div>
                ) : (
                    slides.map((slide) => (
                        <div key={slide.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:border-blue-200 transition-all group">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Visual Preview */}
                                <div className="w-full md:w-64 h-40 bg-gray-100 rounded-3xl overflow-hidden relative border border-gray-50">
                                    {slide.video_url ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                            <Video className="text-white opacity-50" size={32} />
                                            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-blue-600 text-[8px] font-black text-white rounded uppercase tracking-widest">Video BG</span>
                                        </div>
                                    ) : (
                                        <img src={slide.image_url} alt={slide.title_id} className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute top-2 left-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black tracking-widest uppercase">
                                        Order: {slide.sort_order}
                                    </div>
                                </div>

                                {/* Content Info */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors italic">
                                                {slide.title_id}
                                            </h3>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">{slide.title_en}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(slide)}
                                                className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                                            >
                                                <Edit2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(slide.id, slide.title_id)}
                                                className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-sm line-clamp-2 pr-10 italic">"{slide.subtitle_id}"</p>

                                    <div className="pt-4 flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${slide.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                Status: {slide.is_active ? 'Active Display' : 'Hidden'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <LinkIcon size={12} className="text-blue-400" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                CTA: {slide.cta_primary_link}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-4 transition-all duration-300">
                    <div className="bg-white rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col scale-in-center">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">
                                    {editingSlide ? 'Modify Visual Asset' : 'Create New Visual'}
                                </h3>
                                <p className="text-gray-500 font-medium">Define high-impact messaging and imagery for the hero section</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12">
                            {/* Media Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                        <ImageIcon size={18} />
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">Media Assets</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <FileUpload
                                        onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                                        currentUrl={formData.image_url}
                                        label="Background Image"
                                        bucket="images"
                                        type="image"
                                    />
                                    <FileUpload
                                        onUploadComplete={(url) => setFormData({ ...formData, video_url: url })}
                                        currentUrl={formData.video_url || ''}
                                        label="Background Video (Optional)"
                                        bucket="videos"
                                        type="video"
                                        accept="video/*"
                                    />
                                </div>
                            </div>

                            {/* Messaging Section */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                        <Type size={18} />
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">Main Messaging</h4>
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Headline (ID)</label>
                                            <input
                                                type="text"
                                                value={formData.title_id}
                                                onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-black text-xl italic"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Sub-headline (ID)</label>
                                            <textarea
                                                value={formData.subtitle_id}
                                                onChange={(e) => setFormData({ ...formData, subtitle_id: e.target.value })}
                                                rows={2}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-medium italic"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Headline (EN)</label>
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
                                                value={formData.title_en}
                                                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-black text-xl italic"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sub-headline (EN)</label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.subtitle_id || '', 'subtitle_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group"
                                                >
                                                    {translating === 'subtitle_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Auto</span>
                                                </button>
                                            </div>
                                            <textarea
                                                value={formData.subtitle_en}
                                                onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
                                                rows={2}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-medium italic"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Section */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                        <LinkIcon size={18} />
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">Call to Action (CTA)</h4>
                                </div>

                                <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 space-y-4">
                                        <h5 className="font-black text-blue-900 uppercase text-xs tracking-widest">Primary Button</h5>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                placeholder="Label (ID)"
                                                value={formData.cta_primary_text_id || ''}
                                                onChange={(e) => setFormData({ ...formData, cta_primary_text_id: e.target.value })}
                                                className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl font-bold"
                                            />
                                            <div className="relative">
                                                <input
                                                    placeholder="Label (EN)"
                                                    value={formData.cta_primary_text_en || ''}
                                                    onChange={(e) => setFormData({ ...formData, cta_primary_text_en: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl font-bold pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.cta_primary_text_id || '', 'cta_primary_text_en')}
                                                    disabled={!!translating}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors"
                                                    title="Auto Translate"
                                                >
                                                    {translating === 'cta_primary_text_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                                </button>
                                            </div>
                                        </div>
                                        <input
                                            placeholder="Link (URL or #anchor)"
                                            value={formData.cta_primary_link || ''}
                                            onChange={(e) => setFormData({ ...formData, cta_primary_link: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl font-medium"
                                        />
                                    </div>

                                    <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-200 space-y-4 text-gray-600">
                                        <h5 className="font-black uppercase text-xs tracking-widest">Secondary Button</h5>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                placeholder="Label (ID)"
                                                value={formData.cta_secondary_text_id || ''}
                                                onChange={(e) => setFormData({ ...formData, cta_secondary_text_id: e.target.value })}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold"
                                            />
                                            <div className="relative">
                                                <input
                                                    placeholder="Label (EN)"
                                                    value={formData.cta_secondary_text_en || ''}
                                                    onChange={(e) => setFormData({ ...formData, cta_secondary_text_en: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.cta_secondary_text_id || '', 'cta_secondary_text_en')}
                                                    disabled={!!translating}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Auto Translate"
                                                >
                                                    {translating === 'cta_secondary_text_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                                </button>
                                            </div>
                                        </div>
                                        <input
                                            placeholder="Link (URL or #anchor)"
                                            value={formData.cta_secondary_link || ''}
                                            onChange={(e) => setFormData({ ...formData, cta_secondary_link: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-10 pt-6">
                                <div className="flex items-center gap-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort Order</label>
                                    <input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                        className="w-20 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-black text-center"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="slide_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-6 h-6 text-blue-600 rounded-xl border-gray-300"
                                    />
                                    <label htmlFor="slide_active" className="text-sm font-black text-gray-700 uppercase tracking-tight">Visible on Frontend</label>
                                </div>
                            </div>

                            <div className="flex gap-6 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-10 py-5 border-2 border-gray-100 text-gray-400 font-black rounded-[2rem] hover:bg-gray-50 transition-all uppercase tracking-widest"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-10 py-5 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                                >
                                    <Save size={24} />
                                    {editingSlide ? 'Update Visual' : 'Publish Visual'}
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

export default HeroSliderManager;
