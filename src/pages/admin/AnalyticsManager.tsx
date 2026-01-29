import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Users, Globe, Monitor, MapPin,
    RefreshCw, Smartphone,
    Navigation, Activity, History, Trash2,
    Download, ChevronLeft, ChevronRight,
    Calendar, Filter
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';
import * as XLSX from 'xlsx';

interface VisitorLog {
    id: string;
    ip_address: string;
    browser: string;
    os: string;
    city: string;
    region: string;
    country: string;
    country_code: string;
    page_url: string;
    is_mobile: boolean;
    created_at: string;
    user_agent: string;
}

const AnalyticsManager: React.FC = () => {
    const [logs, setLogs] = useState<VisitorLog[]>([]);
    const [allLogs, setAllLogs] = useState<VisitorLog[]>([]); // For stats calculation
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        countries: 0,
        mobile_pct: 0
    });
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });

    useEffect(() => {
        fetchLogs();
    }, [currentPage, pageSize, selectedMonth, selectedYear]);

    const fetchLogs = async () => {
        try {
            setLoading(true);

            // Build query with filters
            let query = supabase
                .from('visitor_logs')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false });

            // Apply date filters
            if (selectedYear) {
                const yearStart = `${selectedYear}-01-01`;
                const yearEnd = `${selectedYear}-12-31`;
                query = query.gte('created_at', yearStart).lte('created_at', yearEnd);
            }

            if (selectedMonth && selectedYear) {
                const monthStart = `${selectedYear}-${selectedMonth.padStart(2, '0')}-01`;
                const lastDay = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
                const monthEnd = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${lastDay}`;
                query = query.gte('created_at', monthStart).lte('created_at', monthEnd);
            }

            // Get total count and paginated data
            const { data, error, count } = await query
                .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

            if (error) throw error;
            setLogs(data || []);
            setTotalCount(count || 0);

            // Fetch all logs for stats (limited to recent 1000 for performance)
            const { data: allData } = await supabase
                .from('visitor_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1000);

            setAllLogs(allData || []);

            // Calculate stats from all data
            if (allData && allData.length > 0) {
                const todayCount = allData.filter(log => {
                    const d = new Date(log.created_at);
                    const now = new Date();
                    return d.getDate() === now.getDate() &&
                        d.getMonth() === now.getMonth() &&
                        d.getFullYear() === now.getFullYear();
                }).length;

                const uniqueCountries = new Set(allData.map(l => l.country)).size;
                const mobileCount = allData.filter(l => l.is_mobile).length;

                setStats({
                    total: count || 0,
                    today: todayCount,
                    countries: uniqueCountries,
                    mobile_pct: Math.round((mobileCount / allData.length) * 100)
                });
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearLogs = () => {
        setDeleteDialog({ isOpen: true, id: 'all', name: 'All Visitor Analytics History' });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id) return;
        try {
            setLoading(true);

            // 1. Truncate visitor_logs table (bypasses RLS)
            const { error: truncateError } = await supabase.rpc('truncate_visitor_logs');

            if (truncateError) {
                console.error('RPC Error:', truncateError);
                throw truncateError;
            }

            // 2. Reset visitor_count in site_settings to 0
            // Update all rows (there should only be 1 row in site_settings)
            const { data: updateData, error: resetError } = await supabase
                .from('site_settings')
                .update({ visitor_count: 0 })
                .select();

            if (resetError) {
                console.error('Reset Counter Error:', resetError);
                console.error('Error details:', JSON.stringify(resetError, null, 2));
            } else {
                console.log('Counter reset successful:', updateData);
            }

            setDeleteDialog({ isOpen: false, id: null, name: '' });
            setCurrentPage(1);
            setLogs([]);
            setAllLogs([]);
            setTotalCount(0);
            setStats({
                total: 0,
                today: 0,
                countries: 0,
                mobile_pct: 0
            });

            // Refresh data
            await fetchLogs();

            // Show success message
            alert('History cleared successfully! Please refresh the public page to see the updated counter.');
        } catch (err: any) {
            console.error('Error clearing logs:', err);
            alert(`Failed to clear history: ${err.message || 'Unknown error'}. Please check console for details.`);
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = async () => {
        try {
            setLoading(true);

            // Fetch all logs for export (with current filters)
            let query = supabase
                .from('visitor_logs')
                .select('*')
                .order('created_at', { ascending: false });

            if (selectedYear) {
                const yearStart = `${selectedYear}-01-01`;
                const yearEnd = `${selectedYear}-12-31`;
                query = query.gte('created_at', yearStart).lte('created_at', yearEnd);
            }

            if (selectedMonth && selectedYear) {
                const monthStart = `${selectedYear}-${selectedMonth.padStart(2, '0')}-01`;
                const lastDay = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
                const monthEnd = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${lastDay}`;
                query = query.gte('created_at', monthStart).lte('created_at', monthEnd);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Prepare data for Excel
            const excelData = (data || []).map(log => ({
                'Timestamp': new Date(log.created_at).toLocaleString(),
                'Country': log.country || 'Unknown',
                'City': log.city || 'Unknown',
                'IP Address': log.ip_address,
                'Browser': log.browser,
                'OS': log.os,
                'Device Type': log.is_mobile ? 'Mobile' : 'Desktop',
                'Page URL': log.page_url,
                'User Agent': log.user_agent
            }));

            // Create workbook and worksheet
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Visitor Analytics');

            // Auto-size columns
            const maxWidth = 50;
            const colWidths = Object.keys(excelData[0] || {}).map(key => ({
                wch: Math.min(
                    Math.max(
                        key.length,
                        ...excelData.map(row => String(row[key as keyof typeof row] || '').length)
                    ),
                    maxWidth
                )
            }));
            ws['!cols'] = colWidths;

            // Generate filename with date
            const filename = `visitor-analytics-${selectedYear || 'all'}-${selectedMonth || 'all'}-${new Date().toISOString().split('T')[0]}.xlsx`;

            // Download
            XLSX.writeFile(wb, filename);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    // Generate year options (last 5 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // Month options
    const monthOptions = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Visitor Analytics</h2>
                    <p className="text-gray-500 font-medium">Real-time traffic intelligence and visitor demographics</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToExcel}
                        disabled={loading || logs.length === 0}
                        className="px-6 py-4 bg-green-50 text-green-600 border border-green-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={16} />
                        Export Excel
                    </button>
                    <button
                        onClick={fetchLogs}
                        className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={clearLogs}
                        className="px-6 py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <Trash2 size={16} />
                        Clear History
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <Filter className="text-blue-600" size={20} />
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Filter Analytics</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Year</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => {
                                setSelectedYear(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-900"
                        >
                            <option value="">All Years</option>
                            {yearOptions.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Month</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => {
                                setSelectedMonth(e.target.value);
                                setCurrentPage(1);
                            }}
                            disabled={!selectedYear}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">All Months</option>
                            {monthOptions.map(month => (
                                <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Page Size</label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(parseInt(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-900"
                        >
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Actions</label>
                        <button
                            onClick={() => {
                                setSelectedYear('');
                                setSelectedMonth('');
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-3 bg-gray-100 text-gray-600 border border-gray-200 rounded-xl font-bold hover:bg-gray-200 transition-all"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Records', value: stats.total.toLocaleString(), icon: Activity, color: 'blue' },
                    { label: 'Today Visits', value: stats.today, icon: Navigation, color: 'green' },
                    { label: 'Geo Reach', value: stats.countries + ' Countries', icon: Globe, color: 'purple' },
                    { label: 'Mobile Traffic', value: stats.mobile_pct + '%', icon: Smartphone, color: 'orange' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h4 className="text-2xl font-black text-gray-900 tracking-tighter">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <History className="text-gray-400" size={20} />
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Traffic Stream</h3>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black">
                            {totalCount.toLocaleString()} records
                        </span>
                    </div>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Live Monitoring
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Geolocation</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">IP Address</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Device / Browser</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Page Route</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && logs.length === 0 ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6 h-16 bg-gray-50/30"></td>
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Navigation size={48} className="text-gray-200" />
                                            <p className="text-gray-400 font-bold">No visitor data captured yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-gray-900">{new Date(log.created_at).toLocaleTimeString()}</p>
                                            <p className="text-[10px] font-medium text-gray-400">{new Date(log.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all italic font-black text-[10px]">
                                                    {log.country_code || '??'}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-gray-900">{log.city || 'Unknown City'}</p>
                                                    <p className="text-[10px] font-medium text-gray-400">{log.country || 'Unknown Location'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                                {log.ip_address}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                {log.is_mobile ? <Smartphone size={14} className="text-orange-500" /> : <Monitor size={14} className="text-blue-500" />}
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900">{log.browser}</p>
                                                    <p className="text-[10px] font-medium text-gray-400">{log.os}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-medium text-gray-600 max-w-[250px] truncate block">
                                                {log.page_url || '/'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
                        <div className="text-sm text-gray-500 font-medium">
                            Showing <span className="font-black text-gray-900">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
                            <span className="font-black text-gray-900">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
                            <span className="font-black text-gray-900">{totalCount.toLocaleString()}</span> records
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

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

export default AnalyticsManager;
