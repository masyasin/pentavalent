import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import {
    Plus, Edit2, Trash2, Calendar,
    X, Save, Sparkles, RefreshCw,
    Search, ChevronLeft, ChevronRight, Clock,
    AlertCircle
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';
import { useLanguage } from '../../contexts/LanguageContext';

interface CalendarEvent {
    id: string;
    title_id: string;
    title_en: string;
    event_date: string;
    event_type: string;
    is_active: boolean;
    created_at: string;
}

const eventTypes = [
    { id: 'Earnings', label: 'Earnings Release' },
    { id: 'Corporate', label: 'Corporate Action' },
    { id: 'Meeting', label: 'Meeting / RUPS' },
    { id: 'Disclosure', label: 'Public Disclosure' },
    { id: 'Other', label: 'Other Event' },
];

const CalendarManager: React.FC = () => {
    const { language } = useLanguage();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [translating, setTranslating] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });

    const [formData, setFormData] = useState({
        title_id: '',
        title_en: '',
        event_date: new Date().toISOString().split('T')[0],
        event_type: 'Earnings',
        is_active: true,
    });

    // Pagination & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: 'title_en') => {
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

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('investor_calendar')
                .select('*')
                .order('event_date', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                const { error } = await supabase
                    .from('investor_calendar')
                    .update(formData)
                    .eq('id', editingEvent.id);
                if (error) throw error;
                toast.success('Calendar event updated');
            } else {
                const { error } = await supabase
                    .from('investor_calendar')
                    .insert(formData);
                if (error) throw error;
                toast.success('Event published to calendar');
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
            title_id: '',
            title_en: '',
            event_date: new Date().toISOString().split('T')[0],
            event_type: 'Earnings',
            is_active: true,
        });
    };

    const handleEdit = (item: CalendarEvent) => {
        setEditingEvent(item);
        setFormData({
            title_id: item.title_id,
            title_en: item.title_en,
            event_date: item.event_date,
            event_type: item.event_type,
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
            const { error } = await supabase.from('investor_calendar').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            toast.success('Event removed from calendar');
            fetchEvents();
        } catch (error: any) {
            console.error('Error deleting event:', error);
            toast.error(error.message || 'Error deleting event');
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event =>
        event.title_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.title_en.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="text-left">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        INVESTOR <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4 tracking-tighter">CALENDAR</span>
                    </h2>
                    <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] mt-2">Manage upcoming corporate events & disclosures</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-8 py-4 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] tracking-widest flex items-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95 uppercase"
                >
                    <Plus size={18} />
                    Add Event
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-8 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm italic"
                />
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Event Title</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Type</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs italic">Loading calendar data...</td>
                                </tr>
                            ) : paginatedEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs italic">No events found</td>
                                </tr>
                            ) : (
                                paginatedEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-blue-50/20 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="text-center w-16 bg-slate-50 rounded-2xl py-2 border border-slate-100">
                                                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">
                                                    {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
                                                </div>
                                                <div className="text-xl font-black text-slate-900 leading-none">
                                                    {new Date(event.event_date).getDate()}
                                                </div>
                                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                    {new Date(event.event_date).getFullYear()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-gray-900 line-clamp-1">{event.title_id}</div>
                                            <div className="text-xs text-gray-400 font-medium italic">{event.title_en}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                {event.event_type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] ${event.is_active ? 'text-green-600' : 'text-red-400'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${event.is_active ? 'bg-green-600 animate-pulse' : 'bg-red-400'}`}></div>
                                                {event.is_active ? 'Visible' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => handleEdit(event)} className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(event.id, event.title_id)} className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-8 py-6 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length}
                        </p>
                        <div className="flex bg-white rounded-2xl p-1 gap-1 border border-gray-100 shadow-sm">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 hover:bg-gray-50 rounded-xl disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <div className="flex items-center px-6 font-black text-[10px] text-gray-900 uppercase tracking-widest">
                                {currentPage} / {totalPages}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 hover:bg-gray-50 rounded-xl disabled:opacity-30 transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] max-w-2xl w-full shadow-4xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                        <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                                    {editingEvent ? 'Edit Event' : 'New Calendar Entry'}
                                </h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Configure investor milestone details</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-2xl transition-all text-gray-400 hover:text-gray-900"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Event Title (ID)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_id}
                                        onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-sm"
                                        placeholder="Contoh: Rapat Umum Pemegang Saham"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Title (EN)</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(formData.title_id, 'title_en')}
                                            disabled={!!translating}
                                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 group"
                                        >
                                            {translating === 'title_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[9px] font-black uppercase tracking-widest">Auto Translate</span>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_en}
                                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-sm italic"
                                        placeholder="Example: Annual General Meeting"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Event Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                                        <input
                                            type="date"
                                            required
                                            value={formData.event_date}
                                            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                            className="w-full pl-16 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-black text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Event Category</label>
                                    <select
                                        value={formData.event_type}
                                        onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-black text-sm uppercase appearance-none"
                                    >
                                        {eventTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        id="event_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-6 h-6 text-blue-600 rounded-lg border-gray-300 focus:ring-blue-500 transition-all cursor-pointer"
                                    />
                                </div>
                                <label htmlFor="event_active" className="text-sm font-black text-slate-700 uppercase tracking-tight cursor-pointer">
                                    Show this event on the public website calendar
                                </label>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-8 py-5 border border-gray-200 text-gray-600 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-8 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-black transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-3"
                                >
                                    <Save size={18} />
                                    {editingEvent ? 'Save Changes' : 'Publish Event'}
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

export default CalendarManager;
