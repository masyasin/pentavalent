import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import {
    Plus, Edit2, Trash2, Save, X,
    History, Calendar, MoveUp, MoveDown,
    RefreshCw, CheckCircle2, AlertCircle, Sparkles
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
            setTranslating(targetField);
            const translated = await translateText(sourceText);
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
            } else {
                const { error } = await supabase
                    .from('company_timeline')
                    .insert(formData);
                if (error) throw error;
            }

            setShowModal(false);
            resetForm();
            fetchEvents();
        } catch (error) {
            console.error('Error saving event:', error);
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
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic underline decoration-blue-500 decoration-8 underline-offset-8">Corporate Journey</h2>
                    <p className="text-gray-500 mt-2">Document key milestones and historical progression</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-8 py-4 bg-blue-600 text-white rounded-3xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-sm"
                >
                    <Plus size={18} />
                    Record Milestone
                </button>
            </div>

            <div className="relative">
                {/* Visual Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-100 hidden md:block"></div>

                <div className="space-y-8 relative">
                    {loading ? (
                        <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Scanning Archive...</div>
                    ) : events.length === 0 ? (
                        <div className="bg-white rounded-[2rem] border-4 border-dashed border-gray-100 p-20 text-center ml-0 md:ml-16">
                            <History className="mx-auto text-gray-200 mb-6" size={64} />
                            <h3 className="text-2xl font-black text-gray-900 uppercase">Archive Empty</h3>
                            <p className="text-gray-500 mb-8">No historical data recorded yet</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="text-blue-600 font-black flex items-center gap-2 mx-auto hover:underline"
                            >
                                Add first milestone now <Plus size={16} />
                            </button>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="relative flex flex-col md:flex-row gap-8 items-start group">
                                {/* Timeline Dot */}
                                <div className="absolute left-8 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-gray-100 z-10 hidden md:flex items-center justify-center group-hover:border-blue-500 transition-all">
                                    <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-blue-500"></div>
                                </div>

                                <div className="ml-0 md:ml-20 flex-1 bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all relative">
                                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-6">
                                        <div className="flex items-center gap-6">
                                            <div className="px-6 py-2 bg-gray-900 text-white rounded-2xl font-black text-xl italic tracking-tighter">
                                                {event.year}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">{event.title_id}</h3>
                                                <p className="text-blue-500 font-bold uppercase tracking-widest text-[10px] mt-1">{event.title_en}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                                            >
                                                <Edit2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id, `${event.year} - ${event.title_id}`)}
                                                className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-50">
                                            <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-3 italic">Indonesian Summary</p>
                                            <p className="text-gray-600 text-sm italic leading-relaxed">"{event.description_id}"</p>
                                        </div>
                                        <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-50">
                                            <p className="text-xs font-black text-blue-300 uppercase tracking-widest mb-3 italic">English Summary</p>
                                            <p className="text-gray-600 text-sm italic leading-relaxed">"{event.description_en}"</p>
                                        </div>
                                    </div>

                                    {!event.is_active && (
                                        <div className="absolute top-4 right-20 px-3 py-1 bg-red-50 text-red-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-red-100">Draft</div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                                    <History size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Milestone Entry</h3>
                                    <p className="text-gray-500 mt-1">Record a new moment in Penta Valent history</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="md:col-span-1 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Event Year</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-black text-xl italic"
                                            placeholder="2024"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-3 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Event Title (ID)</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title_id}
                                                onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Event Title (EN)</label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.title_id || '', 'title_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                                >
                                                    {translating === 'title_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Auto</span>
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title_en}
                                                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Narrative (ID)</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description_id}
                                        onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm leading-relaxed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Narrative (EN)</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(formData.description_id || '', 'description_en')}
                                            disabled={!!translating}
                                            className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                        >
                                            {translating === 'description_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Auto</span>
                                        </button>
                                    </div>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description_en}
                                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm leading-relaxed"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="event_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-6 h-6 text-blue-600 rounded-xl border-gray-300"
                                    />
                                    <label htmlFor="event_active" className="text-sm font-black text-gray-700 uppercase tracking-tight italic">Show on Corporate Timeline</label>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-10 py-5 border-2 border-gray-100 text-gray-400 font-black rounded-3xl hover:bg-gray-50 transition-all uppercase tracking-widest"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-10 py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                                >
                                    <Save size={24} />
                                    {editingEvent ? 'Archive Changes' : 'Publish Milestone'}
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

export default TimelineManager;
