import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Mail, Phone, FileText, Calendar,
    Trash2, ExternalLink, Briefcase, User,
    CheckCircle2, XCircle, Clock, Search, Filter, ChevronRight, ChevronLeft
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

interface Application {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    cover_letter: string;
    resume_url: string;
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    created_at: string;
    career_id: string;
    careers?: {
        title: string;
    };
}

const ApplicationsManager: React.FC = () => {
    const { t, language } = useLanguage();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('job_applications')
                .select(`
                    *,
                    careers (
                        title
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: Application['status']) => {
        try {
            const { error } = await supabase
                .from('job_applications')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            toast.success(`Application status updated to ${newStatus}`);
            fetchApplications();
        } catch (error: any) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status: ' + (error.message || 'System error'));
        }
    };

    const handleDelete = (id: string, name: string) => {
        setDeleteDialog({ isOpen: true, id, name });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id) return;
        try {
            setLoading(true);
            const { error } = await supabase
                .from('job_applications')
                .delete()
                .eq('id', deleteDialog.id);

            if (error) throw error;
            toast.success('Application expunged from talent pool');
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            fetchApplications();
        } catch (error: any) {
            console.error('Error deleting application:', error);
            toast.error('Failed to expunge record: ' + (error.message || 'System error'));
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        try {
            const dataToExport = filteredApplications.map(app => ({
                'Date': new Date(app.created_at).toLocaleString(),
                'Candidate Name': app.full_name,
                'Email': app.email,
                'Phone': app.phone,
                'Position': app.careers?.title || 'Unknown',
                'Status': app.status.toUpperCase(),
                'Resume URL': app.resume_url,
                'Cover Letter': app.cover_letter
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Applications');

            const filename = `TalentPool_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, filename);
            toast.success('Candidates exported to Excel');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            toast.error('Failed to export candidates');
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.careers?.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status: Application['status']) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'reviewed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getStatusIcon = (status: Application['status']) => {
        switch (status) {
            case 'pending': return <Clock size={14} />;
            case 'reviewed': return <Search size={14} />;
            case 'accepted': return <CheckCircle2 size={14} />;
            case 'rejected': return <XCircle size={14} />;
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="text-left">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        {t('admin.applications.title')}
                    </h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                        {t('admin.applications.subtitle')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                        onClick={exportToExcel}
                        disabled={loading || applications.length === 0}
                        className="px-8 py-4 bg-emerald-50 text-emerald-600 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 hover:text-white transition-all border-2 border-emerald-100 flex items-center gap-2 disabled:opacity-50 h-[62px]"
                    >
                        <Download size={18} />
                        {language === 'id' ? 'Ekspor Kandidat' : 'Export Candidates'}
                    </button>
                    <div className="relative group w-full sm:w-72">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Find Candidate..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white border-2 border-gray-50 rounded-[2rem] focus:border-blue-500 transition-all font-bold placeholder:text-gray-300 shadow-sm"
                        />
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-16 pr-12 py-5 bg-white border-2 border-gray-50 rounded-[2rem] focus:border-blue-500 transition-all font-black uppercase text-[10px] tracking-widest appearance-none shadow-sm cursor-pointer h-[62px]"
                        >
                            <option value="all">Global Status</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Under Review</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {(() => {
                const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
                const paginatedApplications = filteredApplications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                return (
                    <>
                        {loading ? (
                            <div className="p-24 text-center text-gray-300 font-black uppercase tracking-widest animate-pulse">
                                Scanning Talent Pool...
                            </div>
                        ) : filteredApplications.length === 0 ? (
                            <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-100 space-y-6">
                                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-200">
                                    <User size={40} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">No Global Match</h3>
                                    <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto">
                                        Global talent acquisition systems show no records matching your current sequence.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8">
                                {paginatedApplications.map((app) => (
                                    <div key={app.id} className="bg-white rounded-[3rem] p-10 border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all group overflow-hidden relative text-left">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/30 rounded-bl-full -z-10 transition-transform group-hover:scale-150 duration-700"></div>

                                        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                                            <div className="flex-1 space-y-10">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-20 h-20 bg-blue-600 rounded-[1.75rem] flex items-center justify-center text-white font-black text-4xl italic shadow-2xl shadow-blue-100 ring-8 ring-blue-50 transition-transform group-hover:scale-110">
                                                            {app.full_name.charAt(0)}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors leading-none">
                                                                {app.full_name}
                                                            </h3>
                                                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-xl italic">
                                                                    <Briefcase size={14} />
                                                                    {app.careers?.title || 'Unknown Position'}
                                                                </span>
                                                                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)} flex items-center gap-2`}>
                                                                    {getStatusIcon(app.status)}
                                                                    {app.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(app.id, app.full_name)}
                                                        className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-[1.25rem] transition-all"
                                                        title="Expunge Record"
                                                    >
                                                        <Trash2 size={24} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                                    <div className="flex items-center gap-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50 group/item hover:bg-white hover:border-blue-100 transition-all">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover/item:text-blue-500 transition-colors shadow-sm">
                                                            <Mail size={20} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Direct Contact</p>
                                                            <p className="font-bold text-gray-900 truncate text-sm">{app.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50 group/item hover:bg-white hover:border-blue-100 transition-all">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover/item:text-rose-500 transition-colors shadow-sm">
                                                            <Phone size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Access Protocol</p>
                                                            <p className="font-bold text-gray-900 text-sm">{app.phone}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50 group/item hover:bg-white hover:border-blue-100 transition-all">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover/item:text-amber-500 transition-colors shadow-sm">
                                                            <Calendar size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Transmission Date</p>
                                                            <p className="font-bold text-gray-900 text-sm">{new Date(app.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {app.cover_letter && (
                                                    <div className="p-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden group/letter text-left">
                                                        <div className="absolute top-0 right-0 p-6 opacity-10">
                                                            <FileText size={48} className="text-white" />
                                                        </div>
                                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 italic">
                                                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                                                            Mission Statement / Cover Letter
                                                        </p>
                                                        <p className="text-blue-100/80 text-sm leading-relaxed font-medium line-clamp-2 hover:line-clamp-none transition-all cursor-pointer">
                                                            {app.cover_letter}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="lg:w-80 space-y-8">
                                                <div className="space-y-4">
                                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 italic">TALENT FILES</label>
                                                    {app.resume_url ? (
                                                        <a
                                                            href={app.resume_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-6 bg-white border-2 border-slate-100 hover:border-blue-600 rounded-[1.75rem] text-blue-600 font-black transition-all shadow-sm group/btn uppercase tracking-widest text-[11px]"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all">
                                                                    <FileText size={20} />
                                                                </div>
                                                                View Resume
                                                            </div>
                                                            <ChevronRight size={18} className="translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
                                                        </a>
                                                    ) : (
                                                        <div className="p-8 bg-gray-50 rounded-[1.75rem] text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] border-2 border-dashed border-gray-100 text-center">
                                                            NO VISUAL RESUME
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 italic">DECISION CONSOLE</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {[
                                                            { id: 'reviewed', label: 'Reviewing', color: 'blue' },
                                                            { id: 'accepted', label: 'Accept', color: 'emerald' },
                                                            { id: 'rejected', label: 'Reject', color: 'rose' },
                                                            { id: 'pending', label: 'Waitlist', color: 'amber' }
                                                        ].map((btn) => (
                                                            <button
                                                                key={btn.id}
                                                                onClick={() => handleUpdateStatus(app.id, btn.id as any)}
                                                                className={`py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all border-2 ${app.status === btn.id
                                                                    ? `bg-slate-900 border-slate-900 text-white shadow-xl`
                                                                    : `bg-white text-gray-400 border-gray-50 hover:border-${btn.color}-500 hover:text-${btn.color}-600`
                                                                    }`}
                                                            >
                                                                {btn.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between p-4 px-8 mt-4">
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of {filteredApplications.length}
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
                        )}
                    </>
                );
            })()
            }

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

export default ApplicationsManager;
