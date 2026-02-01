import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Plus, Edit2, Trash2, Save, X,
    Globe, Settings, Scale, TrendingUp, Zap, Sparkles, RefreshCw
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface Advantage {
    id: string;
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    icon: string;
    sort_order: number;
    is_active: boolean;
}

const EMOJI_OPTIONS = ['🌐', '⚙️', '⚖️', '📈', '🚀', '💎', '🛡️', '⚡', '🏆', '🤝', '🏗️', '🔬', '🌍', '📱', '🦾'];

const AdvantagesManager: React.FC = () => {
    const { t, language } = useLanguage();
    const [advantages, setAdvantages] = useState<Advantage[]>([]);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingAdvantage, setEditingAdvantage] = useState<Advantage | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });
    const [formData, setFormData] = useState<Partial<Advantage>>({
        title_id: '',
        title_en: '',
        description_id: '',
        description_en: '',
        icon: '🌐',
        sort_order: 0,
        is_active: true,
    });

    useEffect(() => {
        fetchAdvantages();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: keyof Advantage) => {
        if (!sourceText) return;
        try {
            setTranslating(targetField as string);
            const translated = await translateText(sourceText, 'id', 'en');
            setFormData(prev => ({ ...prev, [targetField]: translated }));
        } catch (error) {
            console.error('Translation failed:', error);
            toast.error('Translation failed');
        } finally {
            setTranslating(null);
        }
    };

    const fetchAdvantages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('advantages')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setAdvantages(data || []);
        } catch (error) {
            console.error('Error fetching advantages:', error);
            toast.error('Failed to sync advantages');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAdvantage) {
                const { error } = await supabase
                    .from('advantages')
                    .update(formData)
                    .eq('id', editingAdvantage.id);
                if (error) throw error;
                toast.success('Competitive advantage updated successfully');
            } else {
                const { error } = await supabase
                    .from('advantages')
                    .insert(formData);
                if (error) throw error;
                toast.success('New competitive advantage anchored');
            }

            setShowModal(false);
            resetForm();
            fetchAdvantages();
        } catch (error: any) {
            console.error('Error saving advantage:', error);
            toast.error(error.message || 'Transmission error. Please try again.');
        }
    };

    const resetForm = () => {
        setEditingAdvantage(null);
        setFormData({
            title_id: '',
            title_en: '',
            description_id: '',
            description_en: '',
            icon: '🌐',
            sort_order: advantages.length,
            is_active: true,
        });
    };

    const handleEdit = (adv: Advantage) => {
        setEditingAdvantage(adv);
        setFormData(adv);
        setShowModal(true);
    };

    const handleDelete = (id: string, name: string) => {
        setDeleteDialog({ isOpen: true, id, name });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id) return;
        try {
            setLoading(true);
            const { error } = await supabase.from('advantages').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            toast.success('Advantage purged from records');
            fetchAdvantages();
        } catch (error: any) {
            console.error('Error deleting advantage:', error);
            toast.error(error.message || 'Failed to remove advantage');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        Competitive <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">Advantages</span>
                    </h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                        Manage your company's core differentiators and strengths
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
                    New Advantage
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full py-24 text-center text-gray-300 font-black uppercase tracking-widest animate-pulse">Syncing Advantages...</div>
                ) : advantages.length === 0 ? (
                    <div className="col-span-full bg-white rounded-[3.5rem] border-4 border-dashed border-gray-100 p-24 text-center space-y-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200">
                            <TrendingUp size={64} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase italic">No Advantages Defined</h3>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-blue-600 font-black flex items-center gap-2 mx-auto hover:scale-105 transition-all uppercase tracking-widest text-xs"
                        >
                            Add First Advantage <Plus size={16} />
                        </button>
                    </div>
                ) : (
                    advantages.map((adv) => (
                        <div key={adv.id} className="bg-white rounded-[3rem] p-8 border border-gray-50 shadow-sm hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group relative flex flex-col items-start text-left">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0 duration-500 flex gap-2">
                                <button onClick={() => handleEdit(adv)} className="w-10 h-10 bg-white shadow-xl text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center border border-gray-50"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(adv.id, adv.title_id)} className="w-10 h-10 bg-white shadow-xl text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-gray-50"><Trash2 size={16} /></button>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-blue-600 transition-all duration-500 shadow-inner shrink-0 leading-none">
                                    {adv.icon}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none group-hover:text-blue-600 transition-colors">
                                        {language === 'id' ? adv.title_id : adv.title_en}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                        {language === 'id' ? adv.description_id : adv.description_en}
                                    </p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <p className="text-gray-300 font-bold uppercase tracking-[0.2em] text-[9px] italic">Order Index #{adv.sort_order}</p>
                                        {!adv.is_active && (
                                            <span className="px-3 py-1 bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full">Inactive</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3.5rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                        <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-6 text-left">
                                <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
                                    <Zap size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Advantage Details</h3>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mt-1">Configure Competitive Differentiator</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-2xl transition-all text-gray-400 hover:text-rose-500"><X size={28} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-10 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 italic">Select Visual Symbol</label>
                                    <div className="grid grid-cols-5 gap-3 p-4 bg-gray-50 rounded-[2rem]">
                                        {EMOJI_OPTIONS.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon: emoji })}
                                                className={`w-full aspect-square flex items-center justify-center text-2xl rounded-xl transition-all ${formData.icon === emoji ? 'bg-blue-600 scale-110 shadow-lg' : 'hover:bg-white'}`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 px-2">
                                        <label className="text-[9px] text-gray-400 uppercase font-black">Manual Input:</label>
                                        <input
                                            type="text"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            className="w-12 h-10 text-center bg-white border border-gray-100 rounded-lg text-xl"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 italic">Sort Order</label>
                                    <input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                        className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-[2rem] transition-all font-black text-2xl italic"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2 italic">Title (ID)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_id}
                                        onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                                        className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-[1.75rem] transition-all font-black"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Title (EN)</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(formData.title_id || '', 'title_en')}
                                            disabled={!!translating}
                                            className="text-blue-600 hover:text-black transition-colors flex items-center gap-1 group"
                                        >
                                            {translating === 'title_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[8px] font-black uppercase tracking-widest">Translate</span>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_en}
                                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-[1.75rem] transition-all font-black"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 italic">Description (ID)</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description_id}
                                        onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                                        className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-[2rem] transition-all font-medium text-sm leading-relaxed"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Description (EN)</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(formData.description_id || '', 'description_en')}
                                            disabled={!!translating}
                                            className="text-blue-600 hover:text-black transition-colors flex items-center gap-1 group"
                                        >
                                            {translating === 'description_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[8px] font-black uppercase tracking-widest">Translate</span>
                                        </button>
                                    </div>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description_en}
                                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                        className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-[2rem] transition-all font-medium text-sm leading-relaxed"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-8">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        />
                                        <div className={`w-14 h-8 rounded-full transition-all duration-300 ${formData.is_active ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                        <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Active Advantage</span>
                                </label>

                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-10 py-5 bg-gray-50 text-gray-400 font-black rounded-2xl hover:bg-black hover:text-white transition-all uppercase tracking-widest text-[10px]">Discard</button>
                                    <button type="submit" className="px-14 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-black transition-all shadow-2xl shadow-blue-100 flex items-center gap-3 uppercase tracking-widest text-[10px]">
                                        <Save size={18} />
                                        Save Advantage
                                    </button>
                                </div>
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

export default AdvantagesManager;
