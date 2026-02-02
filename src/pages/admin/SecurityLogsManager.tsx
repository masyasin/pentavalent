import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';
import { useLanguage } from '../../contexts/LanguageContext';
import { Shield, AlertTriangle, Clock, Trash2, Search, Filter, Globe, Monitor, ChevronLeft, ChevronRight, Ban, X } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

interface SecurityLog {
    id: string;
    event_type: string;
    field_name: string;
    payload: string;
    page_url: string;
    user_agent: string;
    ip_address: string;
    created_at: string;
}

const SecurityLogsManager: React.FC = () => {
    const { t, language } = useLanguage();
    const [logs, setLogs] = useState<SecurityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const { data, error } = await supabase
                .from('security_logs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLogs(data || []);
        } catch (error) {
            console.error('Error fetching logs:', error);
            toast.error('Failed to fetch security logs');
        } finally {
            setLoading(false);
        }
    };

    const clearAllLogs = async () => {
        if (!confirm(language === 'id' ? 'Hapus semua log keamanan?' : 'Clear all security logs?')) return;

        try {
            setLoading(true);
            const { error } = await supabase
                .from('security_logs')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Hack to delete all

            if (error) throw error;
            toast.success(language === 'id' ? 'Semua log berhasil dihapus' : 'All logs cleared successfully');
            setLogs([]);
            setSelectedLog(null);
        } catch (error) {
            console.error('Error clearing logs:', error);
            toast.error('Failed to clear logs');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id) return;
        try {
            const { error } = await supabase.from('security_logs').delete().eq('id', deleteDialog.id);
            if (error) throw error;

            toast.success(language === 'id' ? 'Log berhasil dihapus' : 'Log deleted');
            setSelectedLog(null);
            setDeleteDialog({ isOpen: false, id: null });
            fetchLogs();
        } catch (error) {
            console.error('Error deleting log:', error);
            toast.error('Failed to delete log');
        }
    };

    const exportToExcel = () => {
        try {
            const dataToExport = filteredLogs.map(log => ({
                'Timestamp': new Date(log.created_at).toLocaleString(),
                'Event Type': log.event_type.replace(/_/g, ' '),
                'Field Targeted': log.field_name || 'N/A',
                'Blocked Payload': log.payload,
                'Page URL': log.page_url,
                'IP Address': log.ip_address || 'N/A',
                'User Agent': log.user_agent
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Security Logs');

            const filename = `SecurityLogs_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, filename);
            toast.success('Export successful');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            toast.error('Failed to export to Excel');
        }
    };

    const filteredLogs = logs.filter(l => {
        const matchesSearch =
            l.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.payload?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.field_name?.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === 'malicious') return l.event_type === 'MALICIOUS_ATTEMPT';
        if (filter === 'spam') return l.event_type === 'SPAM_FILTERED';
        return true;
    });

    const maliciousCount = logs.filter(l => l.event_type === 'MALICIOUS_ATTEMPT').length;

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filter]);

    const getEventBadgeClass = (type: string) => {
        switch (type) {
            case 'MALICIOUS_ATTEMPT': return 'bg-red-100 text-red-700 border-red-200';
            case 'SPAM_FILTERED': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        {language === 'id' ? 'Log Keamanan' : 'Security Audit Logs'}
                    </h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                        Monitoring Real-time Upaya Peretasan & Spam
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToExcel}
                        disabled={loading || logs.length === 0}
                        className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Download size={14} />
                        {language === 'id' ? 'Ekspor Excel' : 'Export Excel'}
                    </button>
                    <button
                        onClick={clearAllLogs}
                        className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100"
                    >
                        {language === 'id' ? 'Bersihkan Semua Log' : 'Clear All Logs'}
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-12 space-y-6">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Cari payload atau pola serangan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-bold text-xs"
                            />
                        </div>

                        <div className="bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm flex gap-1 md:col-span-2">
                            {['all', 'malicious', 'spam'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === type
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                                        }`}
                                >
                                    {type === 'all' ? (language === 'id' ? 'Semua' : 'All') :
                                        type === 'malicious' ? (language === 'id' ? 'Serangan' : 'Malicious') :
                                            (language === 'id' ? 'Spam' : 'Spam')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden text-left">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-left w-64">Waktu</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-left">Tipe Event</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-left">Kolom</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-left">Konten Diblokir</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                                                Memindai Database...
                                            </td>
                                        </tr>
                                    ) : paginatedLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-20 text-center space-y-4">
                                                <Shield className="mx-auto text-green-100" size={64} />
                                                <p className="text-gray-300 font-black uppercase tracking-widest text-xs">
                                                    {language === 'id' ? 'Sistem Aman - Belum ada serangan terdeteksi' : 'System Secure - No threats detected'}
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <Clock size={14} className="text-gray-300" />
                                                        <span className="text-xs font-bold text-gray-500">
                                                            {new Date(log.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getEventBadgeClass(log.event_type)}`}>
                                                        {log.event_type.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 bg-gray-100 px-3 py-1 rounded-lg italic">
                                                        {log.field_name || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="max-w-xs xl:max-w-md truncate text-xs font-mono bg-slate-900 text-red-400 px-4 py-2 rounded-xl border border-red-900/20 shadow-inner">
                                                        {log.payload}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => setSelectedLog(log)}
                                                            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                            title="Detail"
                                                        >
                                                            <Search size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteDialog({ isOpen: true, id: log.id })}
                                                            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                            title="Hapus"
                                                        >
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

                        {totalPages > 1 && (
                            <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 hover:bg-white hover:shadow-sm rounded-xl disabled:opacity-30 transition-all text-gray-500"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    HALAMAN {currentPage} <span className="opacity-20 mx-2">/</span> {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 hover:bg-white hover:shadow-sm rounded-xl disabled:opacity-30 transition-all text-gray-500"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className={`p-8 ${getEventBadgeClass(selectedLog.event_type)} flex justify-between items-center`}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-xl">
                                    <Ban size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Intelligence Report</h3>
                                    <p className="text-[9px] font-black uppercase opacity-60 tracking-widest">{selectedLog.event_type}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 space-y-8 text-left">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Timestamp</h4>
                                    <p className="text-sm font-bold text-gray-900">{new Date(selectedLog.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Targeted Field</h4>
                                    <p className="text-sm font-bold text-red-600">{selectedLog.field_name || 'N/A'}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Origin Page</h4>
                                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <Globe size={16} className="text-blue-500" />
                                    <span className="text-xs font-bold text-gray-700 truncate">{selectedLog.page_url}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Blocked Malware Payload</h4>
                                <pre className="p-6 bg-slate-900 text-red-400 rounded-3xl font-mono text-sm overflow-x-auto border border-red-900/20 shadow-inner">
                                    {selectedLog.payload}
                                </pre>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">User Intelligence Agent</h4>
                                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <Monitor size={16} className="text-gray-400 mt-1" />
                                    <span className="text-[10px] font-medium text-gray-500 leading-relaxed uppercase">{selectedLog.user_agent}</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-10 py-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all shadow-xl"
                            >
                                Close Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                onConfirm={confirmDelete}
                itemName="Security Log"
                isLoading={loading}
            />
        </div>
    );
};

export default SecurityLogsManager;
