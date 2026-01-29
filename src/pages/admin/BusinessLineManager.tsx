import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { translateText } from '../../lib/translation';
import {
    Plus, Edit2, Trash2, Box, Image as ImageIcon,
    X, Save, Layers, ArrowRight, Sparkles, RefreshCw
} from 'lucide-react';

interface BusinessLine {
    id: string;
    slug: string;
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    image_url: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

const BusinessLineManager: React.FC = () => {
    const [lines, setLines] = useState<BusinessLine[]>([]);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingLine, setEditingLine] = useState<BusinessLine | null>(null);
    const [formData, setFormData] = useState({
        slug: '',
        title_id: '',
        title_en: '',
        description_id: '',
        description_en: '',
        image_url: '',
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
            setLines(data || []);
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
            const data = { ...formData, slug };

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
            image_url: '',
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
            image_url: item.image_url || '',
            sort_order: item.sort_order || 0,
            is_active: item.is_active,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const { error } = await supabase.from('business_lines').delete().eq('id', id);
            if (error) throw error;
            fetchLines();
        } catch (error) {
            console.error('Error deleting business line:', error);
        }
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
                            <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center overflow-hidden border border-gray-50 shrink-0">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.title_id} className="w-full h-full object-cover" />
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
                                        <button onClick={() => handleDelete(item.id)} className="p-3 text-gray-400 hover:text-red-600 bg-gray-50 rounded-xl transition-all">
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
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                                    {editingLine ? 'Edit Division' : 'New Division'}
                                </h3>
                                <p className="text-gray-500">Configure business line identity and details</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900"
                            >
                                <X size={28} />
                            </button>
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

                            <div className="grid grid-cols-3 gap-8">
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
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
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

                            {/* Description Sections */}
                            <div className="space-y-8 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Layers className="text-blue-600" size={24} />
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Detailed Description</h4>
                                </div>
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-2">
                                            <span className="w-8 h-px bg-gray-200"></span>
                                            INDONESIAN DESCRIPTION
                                        </label>
                                        <RichTextEditor
                                            content={formData.description_id}
                                            onChange={(val) => setFormData({ ...formData, description_id: val })}
                                            placeholder="Jelaskan lini bisnis ini secara mendalam..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-2">
                                                <span className="w-8 h-px bg-gray-200"></span>
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
        </div>
    );
};

export default BusinessLineManager;
