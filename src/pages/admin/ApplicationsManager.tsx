import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Mail, Phone, FileText, Calendar,
    Trash2, ExternalLink, Briefcase, User,
    CheckCircle2, XCircle, Clock, Search
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

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
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });

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
            fetchApplications();
        } catch (error) {
            console.error('Error updating status:', error);
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
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            fetchApplications();
        } catch (error) {
            console.error('Error deleting application:', error);
        } finally {
            setLoading(false);
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
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Job Applications</h2>
                    <p className="text-gray-500">Review and manage candidates for open positions</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search applicants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium w-64 shadow-sm"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-700 shadow-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="p-20 text-center text-gray-400">Loading applications...</div>
            ) : filteredApplications.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="text-gray-200" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        We couldn't find any applications matching your current filters.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredApplications.map((app) => (
                        <div key={app.id} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group">
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-blue-50">
                                                {app.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                                    {app.full_name}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="flex items-center gap-1.5 text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter italic">
                                                        <Briefcase size={14} />
                                                        {app.careers?.title || 'Unknown Position'}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)} flex items-center gap-1.5`}>
                                                        {getStatusIcon(app.status)}
                                                        {app.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDelete(app.id, app.full_name)}
                                                className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete record"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="flex items-center gap-3 text-gray-600 overflow-hidden">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                                                <Mail size={18} className="text-gray-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                                <p className="font-bold truncate">{app.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                                                <Phone size={18} className="text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                                                <p className="font-bold">{app.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                                                <Calendar size={18} className="text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied Date</p>
                                                <p className="font-bold">{new Date(app.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {app.cover_letter && (
                                        <div className="p-6 bg-gray-50 rounded-2xl">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <FileText size={12} />
                                                Cover Letter
                                            </p>
                                            <p className="text-gray-600 text-sm leading-relaxed italic line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                                                "{app.cover_letter}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="lg:w-72 flex flex-col gap-4">
                                    <div className="flex-1 flex flex-col gap-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Candidate Files</label>
                                        {app.resume_url ? (
                                            <a
                                                href={app.resume_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 bg-white border-2 border-blue-100 hover:border-blue-600 rounded-2xl text-blue-600 font-bold transition-all group/btn"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText size={20} />
                                                    View Resume
                                                </div>
                                                <ExternalLink size={16} className="opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                            </a>
                                        ) : (
                                            <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 text-sm font-medium border border-dashed border-gray-200 text-center">
                                                No Resume Uploaded
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Update Status</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => handleUpdateStatus(app.id, 'reviewed')}
                                                className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-tight transition-all border ${app.status === 'reviewed' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:text-blue-600'}`}
                                            >
                                                Reviewing
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(app.id, 'accepted')}
                                                className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-tight transition-all border ${app.status === 'accepted' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-400 border-gray-100 hover:border-green-200 hover:text-green-600'}`}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                                className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-tight transition-all border ${app.status === 'rejected' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-400 border-gray-100 hover:border-red-200 hover:text-red-600'}`}
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(app.id, 'pending')}
                                                className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-tight transition-all border ${app.status === 'pending' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-400 border-gray-100 hover:border-yellow-200 hover:text-yellow-600'}`}
                                            >
                                                Waitlist
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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

export default ApplicationsManager;
