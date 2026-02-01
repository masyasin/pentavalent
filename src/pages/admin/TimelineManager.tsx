import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Plus, Edit2, Trash2, Save, X,
    History, Calendar, MoveUp, MoveDown,
    RefreshCw, CheckCircle2, AlertCircle, Sparkles, ChevronRight
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface TimelineEvent {
    id: string;
    year: string;
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    sort_order: number;
    is_active: boolean;
}

const TimelineManager: React.FC = () => {
    const { t, language } = useLanguage();
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });
    const [formData, setFormData] = useState<Partial<TimelineEvent>>({
        year: '',
        title_id: '',
        title_en: '',
        description_id: '',
        description_en: '',
        sort_order: 0,
        is_active: true,
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: keyof TimelineEvent) => {
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

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('company_timeline')
                .select('*')
                .order('year', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching timeline:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                const { error } = await supabase
                    .from('company_timeline')
                    .update(formData)
                    .eq('id', editingEvent.id);
                if (error) throw error;
                toast.success('Historical record updated');
            } else {
                const { error } = await supabase
                    .from('company_timeline')
                    .insert(formData);
                if (error) throw error;
                toast.success('Milestone archived successfully');
            }

            setShowModal(false);
            resetForm();
            fetchEvents();
        } catch (error: any) {
            console.error('Error saving event:', error);
            toast.error(error.message || 'Error saving event');
        }
    };

    const resetForm = () => {
        setEditingEvent(null);
        setFormData({
            year: '',
            title_id: '',
            title_en: '',
            description_id: '',
            description_en: '',
            sort_order: events.length,
            is_active: true,
        });
    };

    const handleEdit = (event: TimelineEvent) => {
        setEditingEvent(event);
        setFormData(event);
        setShowModal(true);
    };

    const handleDelete = (id: string, name: string) => {
        setDeleteDialog({ isOpen: true, id, name });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id) return;
        try {
            setLoading(true);
            const { error } = await supabase.from('company_timeline').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            toast.success('Record purged from history');
            fetchEvents();
        } catch (error: any) {
            console.error('Error deleting event:', error);
            toast.error(error.message || 'Error deleting event');
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
                        Corporate <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">Journey</span>
                    </h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                        Document key milestones and historical progression
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
                    Record Milestone
                </button>
            </div>

            <div className="relative">
                {/* Visual Timeline Line */}
                <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-gray-100 to-transparent hidden md:block"></div>

                <div className="space-y-12 relative">
                    {loading ? (
                        <div className="py-24 text-center text-gray-300 font-black uppercase tracking-widest animate-pulse">Scanning Archive...</div>
                    ) : events.length === 0 ? (
                        <div className="bg-white rounded-[3.5rem] border-4 border-dashed border-gray-100 p-24 text-center space-y-6 ml-0 md:ml-24">
                            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200">
                                <History size={64} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-gray-900 uppercase italic">Archive Empty</h3>
                                <p className="text-gray-400 font-medium">No historical data recorded in the global ledger.</p>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="text-blue-600 font-black flex items-center gap-2 mx-auto hover:scale-105 transition-all uppercase tracking-widest text-xs"
                            >
                                Initiate History <Plus size={16} />
                            </button>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="relative flex flex-col md:flex-row gap-12 items-start group">
                                {/* Timeline Dot */}
                                <div className="absolute left-12 -translate-x-1/2 w-12 h-12 rounded-2xl bg-white border-4 border-gray-100 z-10 hidden md:flex items-center justify-center group-hover:border-blue-600 group-hover:shadow-2xl group-hover:shadow-blue-200 transition-all duration-500 group-hover:rotate-45">
                                    <div className="w-3 h-3 rounded-full bg-gray-200 group-hover:bg-blue-500 transition-colors"></div>
                                </div>

                                <div className="ml-0 md:ml-32 flex-1 bg-white rounded-[3.5rem] p-10 border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2 transition-all duration-500 relative text-left">
                                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-8 pb-8 border-b border-gray-50 border-dashed">
                                        <div className="flex items-center gap-8">
                                            <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center font-black text-3xl italic tracking-tighter shadow-2xl shadow-slate-200 shrink-0 group-hover:bg-blue-600 group-hover:shadow-blue-200 transition-all duration-500">
                                                {event.year}
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none group-hover:text-blue-600 transition-colors">
                                                    {language === 'id' ? event.title_id : event.title_en}
                                                </h3>
                                                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">
                                                    Sequence: {event.year} • Status: {event.is_active ? 'Public' : 'Encrypted'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="w-12 h-12 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-white hover:shadow-xl rounded-2xl transition-all flex items-center justify-center border border-transparent hover:border-blue-100"
                                            >
                                                <Edit2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id, `${event.year} - ${event.title_id}`)}
                                                className="w-12 h-12 bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all flex items-center justify-center"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-50 group/desc transition-all hover:bg-white hover:border-blue-100">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 italic flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Original Narrative (ID)
                                            </p>
                                            <p className="text-gray-600 text-sm italic font-medium leading-relaxed">"{event.description_id}"</p>
                                        </div>
                                        <div className="p-8 bg-emerald-50/20 rounded-[2.5rem] border border-emerald-50/50 group/desc transition-all hover:bg-white hover:border-emerald-100">
                                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 italic flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Translated Legacy (EN)
                                            </p>
                                            <p className="text-gray-600 text-sm italic font-medium leading-relaxed">"{event.description_en}"</p>
                                        </div>
                                    </div>

                                    {!event.is_active && (
                                        <div className="absolute top-10 right-32 px-4 py-1.5 bg-rose-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg italic">INTERNAL DRAFT</div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[200] flex items-center justify-center p-0 md:p-8 transition-all duration-500">
                    <div className="bg-white rounded-[4rem] max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 duration-500">
                        <div className="p-12 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div className="flex items-center gap-8 text-left">
                                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                                    <History size={40} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Record Legacy</h3>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Archival Sequence Input System</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-16 h-16 flex items-center justify-center hover:bg-white rounded-[2rem] transition-all text-gray-400 hover:text-rose-500 hover:shadow-xl"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar text-left">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                <div className="md:col-span-3 space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Sequence Year</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 transition-transform group-focus-within:scale-110" size={24} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            className="w-full pl-16 pr-8 py-8 bg-slate-900 text-white border-none rounded-[2.5rem] focus:ring-8 focus:ring-blue-500/20 transition-all font-black text-3xl italic tracking-tight"
                                            placeholder="2024"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-9 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] px-2 italic">Event Title (ID)</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title_id}
                                                onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                                                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[1.5rem] transition-all font-bold text-sm"
                                                placeholder="e.g. Ekspansi Pasar Global"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center px-2">
                                                <label className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">Event Title (EN)</label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.title_id || '', 'title_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-600 hover:text-black transition-colors flex items-center gap-2 group"
                                                >
                                                    {translating === 'title_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Auto Sync</span>
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title_en}
                                                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[1.5rem] transition-all font-bold text-sm"
                                                placeholder="e.g. Global Market Expansion"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-gray-50">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 italic flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Historical Record (ID)
                                    </label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.description_id}
                                        onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                                        className="w-full px-10 py-8 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[3rem] transition-all font-medium text-base leading-relaxed italic shadow-inner"
                                        placeholder="Berikan detail peristiwa bersejarah ini..."
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-4">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic flex items-center gap-2">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Historical Record (EN)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(formData.description_id || '', 'description_en')}
                                            disabled={!!translating}
                                            className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 group shadow-sm"
                                        >
                                            {translating === 'description_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">Global Sync</span>
                                        </button>
                                    </div>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.description_en}
                                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                        className="w-full px-10 py-8 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[3rem] transition-all font-medium text-base leading-relaxed italic shadow-inner"
                                        placeholder="Detail this historical event for global records..."
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
                                        <div className={`w-16 h-9 rounded-full transition-all duration-300 ${formData.is_active ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                        <div className={`absolute left-1.5 top-1.5 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${formData.is_active ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Archival Status</span>
                                        <span className="block text-[10px] text-gray-400 font-bold uppercase">{formData.is_active ? 'Public Corporate Timeline' : 'Locked Internal Archive'}</span>
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
                                        {editingEvent ? 'UPDATE LEGACY' : 'ARCHIVE MILESTONE'}
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

export default TimelineManager;
