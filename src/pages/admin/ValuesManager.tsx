import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Plus, Edit2, Trash2, Save, X,
    Heart, Star, Shield, Zap, Target, Rocket,
    RefreshCw, CheckCircle2, AlertCircle, Sparkles, ChevronRight
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface CorporateValue {
    id: string;
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    icon_name: string;
    sort_order: number;
    is_active: boolean;
}

const ICON_LIST = [
    { name: 'Heart', icon: Heart },
    { name: 'Star', icon: Star },
    { name: 'Shield', icon: Shield },
    { name: 'Zap', icon: Zap },
    { name: 'Target', icon: Target },
    { name: 'Rocket', icon: Rocket },
];

const ValuesManager: React.FC = () => {
    const { t, language } = useLanguage();
    const [values, setValues] = useState<CorporateValue[]>([]);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingValue, setEditingValue] = useState<CorporateValue | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });
    const [formData, setFormData] = useState<Partial<CorporateValue>>({
        title_id: '',
        title_en: '',
        description_id: '',
        description_en: '',
        icon_name: 'Star',
        sort_order: 0,
        is_active: true,
    });

    useEffect(() => {
        fetchValues();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: keyof CorporateValue) => {
        if (!sourceText) return;
        try {
            setTranslating(targetField as string);
            const translated = await translateText(sourceText, 'id', 'en');
            setFormData(prev => ({ ...prev, [targetField]: translated }));
        } catch (error) {
            console.error('Translation failed:', error);
        } finally {
            setTranslating(null);
        }
    };

    const fetchValues = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('corporate_values')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setValues(data || []);
        } catch (error) {
            console.error('Error fetching values:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingValue) {
                const { error } = await supabase
                    .from('corporate_values')
                    .update(formData)
                    .eq('id', editingValue.id);
                if (error) throw error;
                toast.success('Core principle updated');
            } else {
                const { error } = await supabase
                    .from('corporate_values')
                    .insert(formData);
                if (error) throw error;
                toast.success('Core principle established');
            }

            setShowModal(false);
            resetForm();
            fetchValues();
        } catch (error: any) {
            console.error('Error saving value:', error);
            toast.error(error.message || 'Error saving principle');
        }
    };

    const resetForm = () => {
        setEditingValue(null);
        setFormData({
            title_id: '',
            title_en: '',
            description_id: '',
            description_en: '',
            icon_name: 'Star',
            sort_order: values.length,
            is_active: true,
        });
    };

    const handleEdit = (val: CorporateValue) => {
        setEditingValue(val);
        setFormData(val);
        setShowModal(true);
    };

    const handleDelete = (id: string, name: string) => {
        setDeleteDialog({ isOpen: true, id, name });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id) return;
        try {
            setLoading(true);
            const { error } = await supabase.from('corporate_values').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            toast.success('Principle removed from DNA');
            fetchValues();
        } catch (error: any) {
            console.error('Error deleting value:', error);
            toast.error(error.message || 'Error deleting principle');
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (name: string) => {
        const found = ICON_LIST.find(i => i.name === name);
        return found ? found.icon : Star;
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        Corporate <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">Values</span>
                    </h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                        Define the core principles that drive Penta Valent forward
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
                    New Core Value
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {loading ? (
                    <div className="col-span-full py-24 text-center text-gray-300 font-black uppercase tracking-widest animate-pulse">Syncing Principles...</div>
                ) : values.length === 0 ? (
                    <div className="col-span-full bg-white rounded-[3.5rem] border-4 border-dashed border-gray-100 p-24 text-center space-y-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200">
                            <Target size={64} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 uppercase italic">Values Undefined</h3>
                            <p className="text-gray-400 font-medium">Set the foundation for your corporate culture.</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-blue-600 font-black flex items-center gap-2 mx-auto hover:scale-105 transition-all uppercase tracking-widest text-xs"
                        >
                            Calibrate Culture <Plus size={16} />
                        </button>
                    </div>
                ) : (
                    values.map((val) => {
                        const Icon = getIcon(val.icon_name);
                        return (
                            <div key={val.id} className="bg-white rounded-[3rem] p-10 border border-gray-50 shadow-sm hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col items-start text-left">
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0 duration-500 flex gap-2">
                                    <button onClick={() => handleEdit(val)} className="w-10 h-10 bg-white shadow-xl text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center border border-gray-50"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(val.id, val.title_id)} className="w-10 h-10 bg-white shadow-xl text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-gray-50"><Trash2 size={16} /></button>
                                </div>

                                <div className="w-20 h-20 bg-gray-50 rounded-[1.75rem] flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 mb-8 shadow-inner">
                                    <Icon size={40} />
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic mb-2 leading-none group-hover:text-blue-600 transition-colors">
                                    {language === 'id' ? val.title_id : val.title_en}
                                </h3>
                                <p className="text-gray-300 font-bold uppercase tracking-[0.2em] text-[10px] mb-6 italic">Sequence Protocol #{val.sort_order + 1}</p>

                                <div className="flex-1">
                                    <p className="text-gray-500 text-sm italic font-medium leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                                        "{language === 'id' ? val.description_id : val.description_en}"
                                    </p>
                                </div>

                                {!val.is_active && (
                                    <div className="mt-6 px-4 py-2 bg-rose-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg italic">DRAFT SEQUENCE</div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[200] flex items-center justify-center p-0 md:p-8 transition-all duration-500">
                    <div className="bg-white rounded-[4rem] max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500">
                        <div className="p-12 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div className="flex items-center gap-8 text-left">
                                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                                    <Zap size={40} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Core Principle</h3>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Corporate DNA Configuration System</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-16 h-16 flex items-center justify-center hover:bg-white rounded-[2rem] transition-all text-gray-400 hover:text-rose-500 hover:shadow-xl"><X size={32} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar text-left">
                            <div className="space-y-6">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Symbolic Visualization</label>
                                <div className="flex flex-wrap gap-5">
                                    {ICON_LIST.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.name}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon_name: item.name })}
                                                className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center transition-all duration-500 ${formData.icon_name === item.name
                                                    ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200 rotate-12 scale-110'
                                                    : 'bg-gray-50 text-gray-300 hover:bg-white hover:border-blue-100 border-2 border-transparent'
                                                    }`}
                                            >
                                                <Icon size={32} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] px-2 italic">Corporate Title (ID)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_id}
                                        onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                                        className="w-full px-10 py-8 bg-gray-900 text-white border-none rounded-[2.5rem] focus:ring-8 focus:ring-blue-500/20 transition-all font-black text-2xl italic tracking-tight"
                                        placeholder="e.g. Integritas"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">Corporate Title (EN)</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(formData.title_id || '', 'title_en')}
                                            disabled={!!translating}
                                            className="text-blue-600 hover:text-black transition-colors flex items-center gap-2 group"
                                        >
                                            {translating === 'title_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Sync</span>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_en}
                                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        className="w-full px-10 py-8 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2.5rem] transition-all font-black text-2xl italic tracking-tight"
                                        placeholder="e.g. Integrity"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-gray-50">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Narrative (ID)
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description_id}
                                        onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                                        className="w-full px-10 py-8 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[3rem] transition-all font-medium text-base leading-relaxed italic shadow-inner"
                                        placeholder="Deskripsikan nilai ini..."
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-6">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic flex items-center gap-2">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Narrative (EN)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(formData.description_id || '', 'description_en')}
                                            disabled={!!translating}
                                            className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 group shadow-sm"
                                        >
                                            {translating === 'description_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">Auto Sync</span>
                                        </button>
                                    </div>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description_en}
                                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                        className="w-full px-10 py-8 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[3rem] transition-all font-medium text-base leading-relaxed italic shadow-inner"
                                        placeholder="Describe this value for global audience..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-12 border-t border-gray-50">
                                <div className="flex items-center gap-6 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        />
                                        <div className={`w-16 h-9 rounded-full transition-all duration-300 shadow-inner ${formData.is_active ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                        <div className={`absolute left-1.5 top-1.5 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${formData.is_active ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Transmission Protocol</span>
                                        <span className="block text-[10px] text-gray-400 font-bold uppercase">{formData.is_active ? 'Active Core Value' : 'Deactivated / Draft'}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-12 py-6 bg-gray-100 text-gray-500 font-black rounded-[2rem] hover:bg-black hover:text-white transition-all uppercase tracking-widest text-[11px]"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-16 py-6 bg-blue-600 text-white font-black rounded-[2rem] hover:bg-black transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[11px]"
                                    >
                                        <Save size={20} />
                                        {editingValue ? 'UPDATE CORE' : 'ESTABLISH VALUE'}
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

export default ValuesManager;
