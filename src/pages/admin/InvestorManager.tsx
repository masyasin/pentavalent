import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import FileUpload from '../../components/admin/FileUpload';
import {
    Plus, Edit2, Trash2, FileText, X, Save,
    Calendar, Sparkles, RefreshCw, Search,
    ChevronLeft, ChevronRight, TrendingUp, PieChart, Users,
    LayoutGrid, Activity, Briefcase, Eye
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';
import { motion } from 'framer-motion';
import { useAuth, usePermission } from '../../contexts/AuthContext';

// --- Interfaces ---

interface InvestorDocument {
    id: string;
    title_id: string;
    title_en: string;
    document_type: string;
    year: number;
    quarter: string;
    file_url: string;
    is_published: boolean;
    created_at: string;
}

interface Highlight {
    id: string;
    label_id: string;
    label_en: string;
    value: string;
    growth: string;
    icon_name: string;
    sort_order: number;
}

interface Ratio {
    id: string;
    label: string;
    value: string;
    description_id: string;
    description_en: string;
    icon_name: string;
    sort_order: number;
}

interface Shareholder {
    id: string;
    name: string;
    percentage: number;
    color_start: string;
    color_end: string;
    sort_order: number;
}

interface Dividend {
    id: string;
    year: number;
    amount: string;
    sort_order: number;
}

interface CalendarEvent {
    id: string;
    title_id: string;
    title_en: string;
    event_date: string;
    event_type: string;
    is_active: boolean;
    created_at: string;
}

// --- Constants ---

const DOCUMENT_TYPES = [
    { id: 'annual_report', label: 'Annual Report' },
    { id: 'financial_report', label: 'Financial Report' },
    { id: 'public_disclosure', label: 'Public Disclosure' },
    { id: 'prospectus', label: 'Prospectus' },
    { id: 'rups_report', label: 'RUPS Report' },
    { id: 'gcg', label: 'GCG' },
    // Specific types used in frontend mapping
    { id: 'sustainability_report', label: 'Sustainability Report' },
    { id: 'audit_report', label: 'Audit Report' },
    { id: 'ojk_disclosure', label: 'OJK Disclosure' },
    { id: 'corporate_action', label: 'Corporate Action' },
    { id: 'management_change', label: 'Management Changes' },
];

const EVENT_TYPES = [
    { id: 'Earnings', label: 'Earnings Release' },
    { id: 'Corporate', label: 'Corporate Action' },
    { id: 'Meeting', label: 'Meeting / RUPS' },
    { id: 'Disclosure', label: 'Public Disclosure' },
    { id: 'Other', label: 'Other Event' },
];

const ICON_OPTIONS = [
    'Activity', 'TrendingUp', 'PieChart', 'Users', 'Calendar', 'Award', 'FileText', 'BarChart3', 'Briefcase', 'DollarSign'
];

type TabType = 'documents' | 'highlights' | 'ratios' | 'shareholders' | 'dividends' | 'calendar';

const InvestorManager: React.FC = () => {
    const { user } = useAuth();
    const canCreate = usePermission('create', 'investor');
    const canEdit = usePermission('edit', 'investor');
    const canDelete = usePermission('delete', 'investor');

    const [activeTab, setActiveTab] = useState<TabType>('documents');
    const [loading, setLoading] = useState(false);

    // --- Data States ---
    const [documents, setDocuments] = useState<InvestorDocument[]>([]);
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [ratios, setRatios] = useState<Ratio[]>([]);
    const [shareholders, setShareholders] = useState<Shareholder[]>([]);
    const [dividends, setDividends] = useState<Dividend[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

    // --- Modal & Form States ---
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string; table: string }>({
        isOpen: false, id: null, name: '', table: ''
    });
    const [translating, setTranslating] = useState<string | null>(null);

    // --- Search & Pagination (Documents Only) ---
    const [searchTerm, setSearchTerm] = useState('');
    const [docPage, setDocPage] = useState(1);
    const docItemsPerPage = 6;

    // --- Generic Form Data ---
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'documents':
                    const { data: docs } = await supabase.from('investor_documents').select('*').order('year', { ascending: false }).order('created_at', { ascending: false });
                    setDocuments(docs || []);
                    break;
                case 'highlights':
                    const { data: highs } = await supabase.from('investor_highlights').select('*').order('sort_order');
                    setHighlights(highs || []);
                    break;
                case 'ratios':
                    const { data: rats } = await supabase.from('investor_ratios').select('*').order('sort_order');
                    setRatios(rats || []);
                    break;
                case 'shareholders':
                    const { data: shares } = await supabase.from('investor_shareholders').select('*').order('percentage', { ascending: false });
                    setShareholders(shares || []);
                    break;
                case 'dividends':
                    const { data: divs } = await supabase.from('investor_dividend_history').select('*').order('year', { ascending: false });
                    setDividends(divs || []);
                    break;
                case 'calendar':
                    const { data: evts } = await supabase.from('investor_calendar').select('*').order('event_date', { ascending: false });
                    setCalendarEvents(evts || []);
                    break;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            // Don't toast on initial empty state if tables don't exist yet, just log
        } finally {
            setLoading(false);
        }
    };

    const handleAutoTranslate = async (sourceText: string, targetField: string) => {
        if (!sourceText) return;
        try {
            setTranslating(targetField);
            const translated = await translateText(sourceText, 'id', 'en');
            setFormData((prev: any) => ({ ...prev, [targetField]: translated }));
        } catch (error) {
            console.error('Translation failed:', error);
        } finally {
            setTranslating(null);
        }
    };

    const openModal = (item?: any) => {
        setEditingId(item?.id || null);

        if (item) {
            setFormData({ ...item });
        } else {
            // Default initial states based on tab
            switch (activeTab) {
                case 'documents':
                    setFormData({
                        title_id: '', title_en: '', document_type: 'annual_report',
                        year: new Date().getFullYear(), quarter: '', file_url: '', is_published: true
                    });
                    break;
                case 'highlights':
                    setFormData({
                        label_id: '', label_en: '', value: '', growth: '', icon_name: 'Activity', sort_order: 0
                    });
                    break;
                case 'ratios':
                    setFormData({
                        label: '', value: '', description_id: '', description_en: '', icon_name: 'Activity', sort_order: 0
                    });
                    break;
                case 'shareholders':
                    setFormData({
                        name: '', percentage: 0, color_start: 'from-blue-600', color_end: 'to-cyan-500', sort_order: 0
                    });
                    break;
                case 'dividends':
                    setFormData({
                        year: new Date().getFullYear(), amount: '', sort_order: 0
                    });
                    break;
                case 'calendar':
                    setFormData({
                        title_id: '', title_en: '', event_date: new Date().toISOString().split('T')[0], event_type: 'Earnings', is_active: true
                    });
                    break;
            }
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let table = '';
            switch (activeTab) {
                case 'documents': table = 'investor_documents'; break;
                case 'highlights': table = 'investor_highlights'; break;
                case 'ratios': table = 'investor_ratios'; break;
                case 'shareholders': table = 'investor_shareholders'; break;
                case 'dividends': table = 'investor_dividend_history'; break;
                case 'calendar': table = 'investor_calendar'; break;
            }

            if (editingId) {
                const { error } = await supabase.from(table).update(formData).eq('id', editingId);
                if (error) throw error;
                toast.success('Item updated successfully');
            } else {
                const { error } = await supabase.from(table).insert(formData);
                if (error) throw error;
                toast.success('New item added');
            }
            setShowModal(false);
            fetchData();
        } catch (error: any) {
            console.error('Submit error:', error);
            toast.error(error.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id || !deleteDialog.table) return;
        try {
            const { error } = await supabase.from(deleteDialog.table).delete().eq('id', deleteDialog.id);
            if (error) throw error;
            toast.success('Item deleted');
            setDeleteDialog({ isOpen: false, id: null, name: '', table: '' });
            fetchData();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete item');
        }
    };

    const renderTabs = () => (
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-1 rounded-2xl border border-gray-100 w-fit">
            {[
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'highlights', label: 'Highlights', icon: TrendingUp },
                { id: 'ratios', label: 'Fin. Ratios', icon: Activity },
                { id: 'shareholders', label: 'Shareholders', icon: Users },
                { id: 'dividends', label: 'Dividends', icon: PieChart },
                { id: 'calendar', label: 'Calendar', icon: Calendar },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                >
                    <tab.icon size={16} />
                    {tab.label}
                </button>
            ))}
        </div>
    );

    // --- Render Helpers ---

    const renderDocumentsTable = () => {
        const filteredDocs = documents.filter(doc =>
            doc.title_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.title_en.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const totalPages = Math.ceil(filteredDocs.length / docItemsPerPage);
        const paginatedDocs = filteredDocs.slice((docPage - 1) * docItemsPerPage, docPage * docItemsPerPage);

        return (
            <div className="space-y-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium"
                    />
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Title</th>
                                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Type</th>
                                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Period</th>
                                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedDocs.map(doc => (
                                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-700">{doc.title_id}</div>
                                        <div className="text-xs text-slate-400 italic">{doc.title_en}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-tight">
                                            {doc.document_type.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-600">
                                        {doc.year} {doc.quarter && `- ${doc.quarter}`}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {canEdit && (
                                                <button onClick={() => openModal(doc)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit Document">
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                            {!canEdit && (
                                                <button onClick={() => openModal(doc)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Details">
                                                    <Eye size={16} />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button onClick={() => setDeleteDialog({ isOpen: true, id: doc.id, name: doc.title_id, table: 'investor_documents' })} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Document">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                            <button disabled={docPage === 1} onClick={() => setDocPage(p => p - 1)} className="p-2 disabled:opacity-30"><ChevronLeft size={16} /></button>
                            <span className="text-xs font-bold text-slate-500">Page {docPage} of {totalPages}</span>
                            <button disabled={docPage === totalPages} onClick={() => setDocPage(p => p + 1)} className="p-2 disabled:opacity-30"><ChevronRight size={16} /></button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderDataList = () => {
        let items: any[] = [];
        let table = '';

        if (activeTab === 'highlights') { items = highlights; table = 'investor_highlights'; }
        else if (activeTab === 'ratios') { items = ratios; table = 'investor_ratios'; }
        else if (activeTab === 'shareholders') { items = shareholders; table = 'investor_shareholders'; }
        else if (activeTab === 'dividends') { items = dividends; table = 'investor_dividend_history'; }
        else if (activeTab === 'calendar') { items = calendarEvents; table = 'investor_calendar'; }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={item.id}
                        className="bg-white border border-gray-100 p-6 rounded-[2rem] hover:shadow-xl hover:border-blue-100 transition-all group relative"
                    >
                        {activeTab === 'highlights' && (
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <TrendingUp size={20} />
                                    </div>
                                    <span className="text-2xl font-black text-slate-900">{item.value}</span>
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">{item.label_id}</h4>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">{item.label_en}</p>
                                <div className="mt-4 inline-block px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                                    {item.growth} Growth
                                </div>
                            </>
                        )}
                        {activeTab === 'ratios' && (
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{item.label}</h4>
                                    <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center">
                                        <Activity size={16} />
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-slate-900 mb-2">{item.value}</div>
                                <p className="text-xs text-slate-500 font-medium">{item.description_id}</p>
                            </>
                        )}
                        {activeTab === 'shareholders' && (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color_start} ${item.color_end} opacity-90`}></div>
                                    <span className="text-2xl font-black text-slate-900">{item.percentage}%</span>
                                </div>
                                <h4 className="font-bold text-slate-800 text-lg leading-tight">{item.name}</h4>
                            </>
                        )}
                        {activeTab === 'dividends' && (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-sm">
                                    {item.year}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Dividend</div>
                                    <div className="text-xl font-black text-slate-900">{item.amount}</div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'calendar' && (
                            <div className="flex gap-4 items-start">
                                <div className={`flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 ${item.is_active ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{new Date(item.event_date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-2xl font-black leading-none">{new Date(item.event_date).getDate()}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500">{item.event_type}</span>
                                        {!item.is_active && <span className="text-[9px] font-bold text-red-400 italic">Hidden</span>}
                                    </div>
                                    <h4 className="font-bold text-slate-900 leading-tight mb-1">{item.title_id}</h4>
                                    <p className="text-xs text-slate-400 font-medium italic">{item.title_en}</p>
                                </div>
                            </div>
                        )}

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                            {canEdit && (
                                <button onClick={() => openModal(item)} className="p-2 bg-white text-blue-600 rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50" title="Edit Item">
                                    <Edit2 size={16} />
                                </button>
                            )}
                            {!canEdit && (
                                <button onClick={() => openModal(item)} className="p-2 bg-white text-blue-600 rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50" title="View Details">
                                    <Eye size={16} />
                                </button>
                            )}
                            {canDelete && (
                                <button onClick={() => setDeleteDialog({ isOpen: true, id: item.id, name: 'Items', table })} className="p-2 bg-white text-red-600 rounded-lg shadow-sm border border-gray-100 hover:bg-red-50" title="Delete Item">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}

                {/* Add New Card */}
                {canCreate && (
                    <button
                        onClick={() => openModal()}
                        className="min-h-[200px] border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/10 transition-all group"
                    >
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus size={24} />
                        </div>
                        <span className="font-bold text-sm uppercase tracking-wide">Add New Item</span>
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic underline decoration-blue-500 decoration-8 underline-offset-8">Investor Relations</h2>
                    <p className="text-gray-500 mt-2 font-medium">Manage Documents, Ratios, and Shareholder Data</p>
                </div>
                {activeTab === 'documents' && canCreate && (
                    <button
                        onClick={() => openModal()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 uppercase tracking-wide text-xs"
                    >
                        <Plus size={16} /> Upload Document
                    </button>
                )}
            </div>

            {renderTabs()}

            {activeTab === 'documents' ? renderDocumentsTable() : renderDataList()}

            {/* --- Modals --- */}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">
                                {editingId ? 'Edit Item' : 'Create New Item'}
                            </h3>
                            <button onClick={() => setShowModal(false)}><X size={24} className="text-slate-400 hover:text-slate-900" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Read Only Warning */}
                            {!canEdit && editingId && (
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                        <Eye size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-blue-900 uppercase tracking-tight text-xs">Read-Only Mode</p>
                                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Viewing details only. Changes disabled.</p>
                                    </div>
                                </div>
                            )}

                            {/* --- Fields for Documents --- */}
                            {activeTab === 'documents' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title (ID)</label>
                                            <input type="text" value={formData.title_id} onChange={e => setFormData({ ...formData, title_id: e.target.value })} className="input-field w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500" required />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title (EN)</label>
                                                <button type="button" onClick={() => handleAutoTranslate(formData.title_id, 'title_en')} className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1 hover:text-blue-700"><Sparkles size={10} /> Auto</button>
                                            </div>
                                            <input type="text" value={formData.title_en} onChange={e => setFormData({ ...formData, title_en: e.target.value })} className="input-field w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</label>
                                            <select value={formData.document_type} onChange={e => setFormData({ ...formData, document_type: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none font-bold text-sm">
                                                {DOCUMENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Year</label>
                                            <input type="number" value={formData.year} onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })} className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none font-bold" />
                                        </div>
                                    </div>
                                    <FileUpload
                                        label="PDF Document"
                                        bucket="documents"
                                        accept=".pdf"
                                        currentUrl={formData.file_url}
                                        onUploadComplete={(url) => setFormData({ ...formData, file_url: url })}
                                        type="file"
                                    />
                                </>
                            )}

                            {/* --- Fields for Highlights --- */}
                            {activeTab === 'highlights' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Label (ID)</label>
                                            <input type="text" value={formData.label_id} onChange={e => setFormData({ ...formData, label_id: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Label (EN)</label>
                                                <button type="button" onClick={() => handleAutoTranslate(formData.label_id, 'label_en')} className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1 hover:text-blue-700"><Sparkles size={10} /> Auto</button></div>
                                            <input type="text" value={formData.label_en} onChange={e => setFormData({ ...formData, label_en: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Value</label>
                                            <input type="text" placeholder="e.g. 18.4%" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-black text-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Growth</label>
                                            <input type="text" placeholder="e.g. +2.1%" value={formData.growth} onChange={e => setFormData({ ...formData, growth: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold text-green-600" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Icon</label>
                                        <select value={formData.icon_name} onChange={e => setFormData({ ...formData, icon_name: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold">
                                            {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* --- Fields for Ratios --- */}
                            {activeTab === 'ratios' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Label (e.g. P/E Ratio)</label>
                                        <input type="text" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Value (e.g. 12.4x)</label>
                                        <input type="text" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-black text-xl" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Desc (ID)</label>
                                            <input type="text" value={formData.description_id} onChange={e => setFormData({ ...formData, description_id: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Desc (EN)</label>
                                                <button type="button" onClick={() => handleAutoTranslate(formData.description_id, 'description_en')} className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1 hover:text-blue-700"><Sparkles size={10} /> Auto</button></div>
                                            <input type="text" value={formData.description_en} onChange={e => setFormData({ ...formData, description_en: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* --- Fields for Shareholders --- */}
                            {activeTab === 'shareholders' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shareholder Name</label>
                                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Percentage (%)</label>
                                        <input type="number" step="0.01" value={formData.percentage} onChange={e => setFormData({ ...formData, percentage: parseFloat(e.target.value) })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-black text-xl" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Color Start (Tailwind)</label>
                                            <input type="text" placeholder="from-blue-600" value={formData.color_start} onChange={e => setFormData({ ...formData, color_start: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none text-xs font-mono" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Color End (Tailwind)</label>
                                            <input type="text" placeholder="to-cyan-500" value={formData.color_end} onChange={e => setFormData({ ...formData, color_end: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none text-xs font-mono" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* --- Fields for Dividends --- */}
                            {activeTab === 'dividends' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Year</label>
                                        <input type="number" value={formData.year} onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-black text-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount (e.g. 15 IDR/Share)</label>
                                        <input type="text" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold" />
                                    </div>
                                </>
                            )}

                            {/* --- Fields for Calendar --- */}
                            {activeTab === 'calendar' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Event Title (ID)</label>
                                            <input type="text" value={formData.title_id} onChange={e => setFormData({ ...formData, title_id: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold" required />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Event Title (EN)</label>
                                                <button type="button" onClick={() => handleAutoTranslate(formData.title_id, 'title_en')} className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1 hover:text-blue-700"><Sparkles size={10} /> Auto</button></div>
                                            <input type="text" value={formData.title_en} onChange={e => setFormData({ ...formData, title_en: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</label>
                                            <input type="date" value={formData.event_date} onChange={e => setFormData({ ...formData, event_date: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Event Type</label>
                                            <select value={formData.event_type} onChange={e => setFormData({ ...formData, event_type: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold">
                                                {EVENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5" />
                                        <label htmlFor="is_active" className="text-sm font-bold text-slate-600">Publish to Calendar</label>
                                    </div>
                                </>
                            )}

                            {(canEdit || (!editingId && canCreate)) && (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <RefreshCw className="animate-spin" /> : <Save size={20} />}
                                    {editingId ? 'Save Changes' : 'Create New Item'}
                                </button>
                            )}

                            {!canEdit && editingId && (
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                >
                                    Close Preview
                                </button>
                            )}

                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                onConfirm={confirmDelete}
                itemName={deleteDialog.name}
            />
        </div>
    );
};

export default InvestorManager;
