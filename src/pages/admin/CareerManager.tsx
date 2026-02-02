import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { translateText } from '../../lib/translation';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Plus, Search, Edit2, Trash2, MapPin, Building2,
    Calendar, Briefcase, ChevronRight, ChevronLeft, X, Save, AlertCircle, Sparkles, RefreshCw, Maximize2, Minimize2
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';
import { logUserActivity } from '../../lib/security';
import { useAuth, usePermission } from '../../contexts/AuthContext';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

interface Career {
    id: string;
    title: string;
    department: string;
    location: string;
    employment_type: string;
    description_id: string;
    description_en: string;
    requirements_id: string;
    requirements_en: string;
    deadline: string;
    is_active: boolean;
    created_at: string;
}

const CareerManager: React.FC = () => {
    const { t } = useLanguage();
    const { user, hasPermission } = useAuth();
    const canCreate = usePermission('create_content');
    const canEdit = usePermission('edit_content');
    const canDelete = usePermission('delete_content');

    const [careers, setCareers] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [editingCareer, setEditingCareer] = useState<Career | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        employment_type: 'full_time',
        description_id: '',
        description_en: '',
        requirements_id: '',
        requirements_en: '',
        deadline: '',
        is_active: true,
    });

    // Pagination & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCareers();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: string) => {
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

    const fetchCareers = async () => {
        try {
            const { data, error } = await supabase
                .from('careers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCareers(data || []);
        } catch (error) {
            console.error('Error fetching careers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCareer) {
                const { error } = await supabase
                    .from('careers')
                    .update(formData)
                    .eq('id', editingCareer.id);
                if (error) throw error;
                toast.success('Career opportunity updated successfully');
                await logUserActivity('UPDATE', 'CAREER', `Updated job: ${formData.title}`, user?.email);
            } else {
                const { error } = await supabase
                    .from('careers')
                    .insert(formData);
                if (error) throw error;
                toast.success('Career opportunity created successfully');
                await logUserActivity('CREATE', 'CAREER', `Created job: ${formData.title}`, user?.email);
            }

            setShowModal(false);
            resetForm();
            fetchCareers();
        } catch (error: any) {
            console.error('Error saving career:', error);
            toast.error(error.message || 'Error saving career');
        }
    };

    const resetForm = () => {
        setEditingCareer(null);
        setFormData({
            title: '',
            department: '',
            location: '',
            employment_type: 'full_time',
            description_id: '',
            description_en: '',
            requirements_id: '',
            requirements_en: '',
            deadline: '',
            is_active: true,
        });
    };

    const handleEdit = (item: Career) => {
        setEditingCareer(item);
        setFormData({
            title: item.title,
            department: item.department,
            location: item.location,
            employment_type: item.employment_type,
            description_id: item.description_id,
            description_en: item.description_en,
            requirements_id: item.requirements_id || '',
            requirements_en: item.requirements_en || '',
            deadline: item.deadline || '',
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
            const { error } = await supabase.from('careers').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            await logUserActivity('DELETE', 'CAREER', `Deleted job: ${deleteDialog.name}`, user?.email);
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            toast.success('Career opportunity deleted successfully');
            fetchCareers();
        } catch (error: any) {
            console.error('Error deleting career:', error);
            toast.error(error.message || 'Error deleting career');
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        try {
            const dataToExport = careers.map(item => ({
                'Job Title': item.title,
                'Department': item.department,
                'Location': item.location,
                'Type': item.employment_type.replace('_', ' ').toUpperCase(),
                'Deadline': item.deadline || 'No Deadline',
                'Status': item.is_active ? 'ACTIVE' : 'CLOSED',
                'Created At': new Date(item.created_at).toLocaleString()
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Careers');

            const filename = `CareersList_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, filename);
            toast.success('Careers list exported');
        } catch (error) {
            console.error('Error exporting careers:', error);
            toast.error('Failed to export careers');
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        {t('admin.careers.title')}
                    </h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                        {t('admin.careers.subtitle')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToExcel}
                        disabled={loading || careers.length === 0}
                        className="px-8 py-4 bg-emerald-50 text-emerald-600 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 hover:text-white transition-all border-2 border-emerald-100 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Download size={18} />
                        {t('admin.common.export') || 'Export'}
                    </button>
                    {canCreate && (
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="px-8 py-4 bg-blue-600 text-white rounded-[2rem] font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-xs"
                        >
                            <Plus size={18} />
                            {t('admin.careers.add')}
                        </button>
                    )}
                </div>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search opportunities..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-[1.5rem] transition-all font-bold text-sm"
                    />
                </div>
            </div>

            {/* Logic */}
            {
                (() => {
                    const filteredCareers = careers.filter(item =>
                        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.location.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    const totalPages = Math.ceil(filteredCareers.length / itemsPerPage);
                    const paginatedCareers = filteredCareers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                    return (
                        <>
                            <div className="grid grid-cols-1 gap-6">
                                {loading ? (
                                    <div className="p-20 text-center text-gray-300 font-black uppercase tracking-widest animate-pulse">
                                        {t('common.loading') || 'Scanning Career Network...'}
                                    </div>
                                ) : filteredCareers.length === 0 ? (
                                    <div className="bg-white rounded-[3rem] border-2 border-dashed border-gray-100 p-20 text-center space-y-6">
                                        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner text-gray-200">
                                            <Briefcase size={40} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">No Global Vacancies</h3>
                                            <p className="text-gray-400 font-medium text-sm">{searchTerm ? 'No matches found.' : 'Start building your team by posting the first job opening.'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    paginatedCareers.map((career) => (
                                        <div key={career.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 hover:border-blue-200 transition-all group shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 text-left">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-start gap-6">
                                                    <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner shrink-0">
                                                        <Briefcase size={28} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight italic leading-none">
                                                            {career.title}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-widest text-gray-400">
                                                            <div className="flex items-center gap-2">
                                                                <Building2 size={14} className="text-blue-500" />
                                                                {career.department}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin size={14} className="text-rose-500" />
                                                                {career.location}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar size={14} className="text-amber-500" />
                                                                {career.employment_type.replace('_', ' ')}
                                                            </div>
                                                            <div className={`px-3 py-1 rounded-lg text-[9px] ${career.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                                                }`}>
                                                                {career.is_active ? 'ACTIVE' : 'CLOSED'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => handleEdit(career)}
                                                            className="p-4 text-gray-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-[1.25rem] transition-all border border-transparent hover:border-gray-50"
                                                        >
                                                            <Edit2 size={20} />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleDelete(career.id, career.title)}
                                                            className="p-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-[1.25rem] transition-all"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Pagination */}
                            {
                                totalPages > 1 && (
                                    <div className="flex items-center justify-between p-4 px-8 mt-4">
                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredCareers.length)} of {filteredCareers.length}
                                        </div>
                                        <div className="flex bg-white rounded-xl p-1 gap-1 border border-gray-100 shadow-sm">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 hover:bg-gray-50 rounded-lg disabled:opacity-30 transition-all"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            <div className="flex items-center px-4 font-black text-xs text-gray-900">
                                                {currentPage} / {totalPages}
                                            </div>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="p-2 hover:bg-gray-50 rounded-lg disabled:opacity-30 transition-all"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    );
                })()
            }

            {
                showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-8 transition-all duration-300">
                        <div className={`bg-white shadow-2xl transition-all duration-500 ease-in-out flex flex-col ${isMaximized
                            ? 'w-full h-full rounded-0'
                            : 'max-w-6xl w-full max-h-[95vh] rounded-[3.5rem]'
                            }`}>
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-[3.5rem]">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">
                                            {editingCareer ? 'Update Opportunity' : 'Launch New Opening'}
                                        </h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Talent Acquisition</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsMaximized(!isMaximized)}
                                        className="p-4 hover:bg-white hover:shadow-md rounded-[1.25rem] transition-all text-gray-400 hover:text-blue-600"
                                        title={isMaximized ? "Exit Fullscreen" : "Fullscreen"}
                                    >
                                        {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-4 hover:bg-white hover:shadow-md rounded-[1.25rem] transition-all text-gray-400 hover:text-red-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar text-left">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Job Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] transition-all font-black text-xl italic"
                                            placeholder="e.g. Sales Representative"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Department</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] transition-all font-black text-xl italic"
                                            placeholder="e.g. Distribution & Logistics"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Office Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-500" size={20} />
                                            <input
                                                type="text"
                                                required
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-[2rem] transition-all font-bold text-sm"
                                                placeholder="e.g. Jakarta, ID"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Employment Model</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                                            <select
                                                value={formData.employment_type}
                                                onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                                                className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] transition-all font-black text-sm uppercase tracking-widest appearance-none"
                                            >
                                                <option value="full_time">Full Time</option>
                                                <option value="contract">Contract</option>
                                                <option value="internship">Internship</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Closing Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                            <input
                                                type="date"
                                                value={formData.deadline}
                                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                                className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-transparent focus:border-amber-500 focus:bg-white rounded-[2rem] transition-all font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-8 pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-1 h-blue-600 rounded-full"></div>
                                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em] italic">Operational Mission (Description)</h4>
                                    </div>
                                    <div className={`grid gap-8 ${isMaximized ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 italic flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                                Description (Bahasa Indonesia)
                                            </label>
                                            <div className="rounded-[2.5rem] overflow-hidden border-2 border-transparent focus-within:border-blue-500 transition-all shadow-inner">
                                                <RichTextEditor
                                                    content={formData.description_id}
                                                    onChange={(val) => setFormData({ ...formData, description_id: val })}
                                                    placeholder="Tuliskan deskripsi pekerjaan..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center px-4">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                                    Description (English)
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.description_id, 'description_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-600 hover:text-black transition-colors flex items-center gap-2 group"
                                                >
                                                    {translating === 'description_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Global Sync</span>
                                                </button>
                                            </div>
                                            <div className="rounded-[2.5rem] overflow-hidden border-2 border-transparent focus-within:border-emerald-500 transition-all shadow-inner">
                                                <RichTextEditor
                                                    content={formData.description_en}
                                                    onChange={(val) => setFormData({ ...formData, description_en: val })}
                                                    placeholder="Write global job description..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Requirements */}
                                <div className="space-y-8 pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-1 h-rose-500 rounded-full"></div>
                                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em] italic">Tactical Requirements</h4>
                                    </div>
                                    <div className={`grid gap-8 ${isMaximized ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 italic flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                                Requirements (Bahasa Indonesia)
                                            </label>
                                            <div className="rounded-[2.5rem] overflow-hidden border-2 border-transparent focus-within:border-blue-500 transition-all shadow-inner">
                                                <RichTextEditor
                                                    content={formData.requirements_id}
                                                    onChange={(val) => setFormData({ ...formData, requirements_id: val })}
                                                    placeholder="Tuliskan kriteria pelamar..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center px-4">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                                    Requirements (English)
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.requirements_id, 'requirements_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-600 hover:text-black transition-colors flex items-center gap-2 group"
                                                >
                                                    {translating === 'requirements_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Global Sync</span>
                                                </button>
                                            </div>
                                            <div className="rounded-[2.5rem] overflow-hidden border-2 border-transparent focus-within:border-emerald-500 transition-all shadow-inner">
                                                <RichTextEditor
                                                    content={formData.requirements_en}
                                                    onChange={(val) => setFormData({ ...formData, requirements_en: val })}
                                                    placeholder="Write global applicant criteria..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.is_active ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-xs font-black uppercase tracking-widest text-gray-800 italic">Publishing Status</span>
                                            <span className="block text-[10px] font-bold text-gray-400 uppercase">{formData.is_active ? 'Visible to global applicants' : 'Private internal draft'}</span>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        />
                                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-10 py-6 bg-gray-100 text-gray-500 font-black rounded-[1.5rem] hover:bg-black hover:text-white transition-all uppercase tracking-widest text-[10px]"
                                    >
                                        Discard Changes
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] px-12 py-6 bg-blue-600 text-white font-black rounded-[1.5rem] hover:bg-black transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 uppercase tracking-widest text-[10px] active:scale-95"
                                    >
                                        <Save size={20} />
                                        {editingCareer ? 'SUBMIT UPGRADED MISSION' : 'LAUNCH GLOBAL VACANCY'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                onConfirm={confirmDelete}
                itemName={deleteDialog.name}
                isLoading={loading}
            />
        </div >
    );
};

// Add missing icon
const CheckCircle2 = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
        <path d="M9 12L11 14L15 10" />
    </svg>
);

export default CareerManager;
