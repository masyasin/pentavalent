import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Plus, Edit2, Trash2, Save, X,
    Heart, Star, Shield, Zap, Target, Rocket,
    RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';

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
    const [values, setValues] = useState<CorporateValue[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingValue, setEditingValue] = useState<CorporateValue | null>(null);
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
            } else {
                const { error } = await supabase
                    .from('corporate_values')
                    .insert(formData);
                if (error) throw error;
            }

            setShowModal(false);
            resetForm();
            fetchValues();
        } catch (error) {
            console.error('Error saving value:', error);
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

    const handleDelete = async (id: string) => {
        if (!confirm('Scale back your principles? delete this value?')) return;
        try {
            const { error } = await supabase.from('corporate_values').delete().eq('id', id);
            if (error) throw error;
            fetchValues();
        } catch (error) {
            console.error('Error deleting value:', error);
        }
    };

    const getIcon = (name: string) => {
        const found = ICON_LIST.find(i => i.name === name);
        return found ? found.icon : Star;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Corporate Values</h2>
                    <p className="text-gray-500">Define the core principles that drive Penta Valent forward</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest text-sm"
                >
                    <Plus size={18} />
                    New Core Value
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Syncing Principles...</div>
                ) : values.length === 0 ? (
                    <div className="col-span-full bg-white rounded-[2rem] border-4 border-dashed border-gray-100 p-20 text-center">
                        <Target className="mx-auto text-gray-200 mb-6" size={64} />
                        <h3 className="text-2xl font-black text-gray-900 uppercase">Values Undefined</h3>
                        <p className="text-gray-500 mb-8">Set the foundation for your corporate culture</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-blue-600 font-black flex items-center gap-2 mx-auto hover:underline"
                        >
                            Set values now <Plus size={16} />
                        </button>
                    </div>
                ) : (
                    values.map((val) => {
                        const Icon = getIcon(val.icon_name);
                        return (
                            <div key={val.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-2xl transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                                    <button onClick={() => handleEdit(val)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(val.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={14} /></button>
                                </div>

                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-6">
                                    <Icon size={32} />
                                </div>

                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic mb-2 leading-none">{val.title_id}</h3>
                                <p className="text-blue-600 font-bold uppercase tracking-widest text-[8px] mb-4">{val.title_en}</p>
                                <p className="text-gray-500 text-xs italic leading-relaxed line-clamp-3">"{val.description_id}"</p>

                                {!val.is_active && (
                                    <div className="mt-4 px-2 py-0.5 bg-red-50 text-red-500 text-[8px] font-black uppercase tracking-widest rounded w-fit italic border border-red-100">Draft Status</div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col scale-in-center">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-gray-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
                                    <Zap size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Core Principle</h3>
                                    <p className="text-gray-500 mt-1">Configure a fundamental corporate value</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900"><X size={32} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-10">
                            {/* Icon Choice */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Symbolic Icon</label>
                                <div className="flex flex-wrap gap-4">
                                    {ICON_LIST.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.name}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon_name: item.name })}
                                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${formData.icon_name === item.name ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-gray-50 text-gray-300 hover:bg-white hover:border-gray-200 border border-transparent'
                                                    }`}
                                            >
                                                <Icon size={24} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Title (ID)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_id}
                                        onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-black text-lg italic"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Title (EN)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_en}
                                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-black text-lg italic"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description (ID)</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description_id}
                                        onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-xs leading-relaxed italic"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description (EN)</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description_en}
                                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-xs leading-relaxed italic"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-6 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-10 py-5 border-2 border-gray-100 text-gray-400 font-black rounded-3xl hover:bg-gray-50 transition-all uppercase tracking-widest"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-10 py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                                >
                                    <Save size={24} />
                                    {editingValue ? 'Update Principle' : 'Publish Principle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ValuesManager;
