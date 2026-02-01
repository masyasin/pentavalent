import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Plus, Building2, MapPin, Phone, Mail, Globe,
  X, Save, Edit2, Trash2, Map,
  Search, Filter, Activity, Compass, ChevronLeft, ChevronRight,
  Users, RefreshCw
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface Branch {
  id: string;
  name: string;
  type: string;
  city: string;
  province: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  google_maps_url?: string;
  is_active: boolean;
}

const BranchManager: React.FC = () => {
  const { t, language } = useLanguage();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
    isOpen: false,
    id: null,
    name: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [distributionPoints, setDistributionPoints] = useState('0');
  const [isSavingStats, setIsSavingStats] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'branch',
    city: '',
    province: '',
    address: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    google_maps_url: '',
    is_active: true,
  });

  useEffect(() => {
    fetchBranches();
    fetchDistributionPoints();
  }, []);

  const fetchDistributionPoints = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('company_stats')
        .single();

      if (data?.company_stats) {
        const stats = data.company_stats as any[];
        const distPoint = stats.find(s => s.label_id === 'Titik Distribusi' || s.label_en === 'Distribution Points');
        if (distPoint) {
          setDistributionPoints(distPoint.value);
        }
      }
    } catch (error) {
      console.error('Error fetching distribution points:', error);
    }
  };

  const saveDistributionPoints = async () => {
    try {
      setIsSavingStats(true);
      const { data: currentSettings } = await supabase
        .from('site_settings')
        .select('id, company_stats')
        .single();

      let stats = currentSettings?.company_stats as any[] || [];
      const index = stats.findIndex(s => s.label_id === 'Titik Distribusi' || s.label_en === 'Distribution Points');

      if (index !== -1) {
        stats[index] = { ...stats[index], value: distributionPoints };
      } else {
        stats.push({ value: distributionPoints, label_id: 'Titik Distribusi', label_en: 'Distribution Points', icon: 'Users' });
      }

      await supabase
        .from('site_settings')
        .update({ company_stats: stats })
        .eq('id', currentSettings?.id);

    } catch (error) {
      console.error('Error saving distribution points:', error);
    } finally {
      setIsSavingStats(false);
    }
  };

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('province');

      if (error) throw error;
      setBranches(data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const branchData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      if (editingBranch) {
        const { error } = await supabase
          .from('branches')
          .update(branchData)
          .eq('id', editingBranch.id);

        if (error) throw error;
        toast.success('Branch updated successfully');
      } else {
        const { error } = await supabase.from('branches').insert(branchData);
        if (error) throw error;
        toast.success('Branch created successfully');
      }

      setShowModal(false);
      setEditingBranch(null);
      resetForm();
      fetchBranches();
    } catch (error: any) {
      console.error('Error saving branch:', error);
      toast.error(error.message || 'Error saving branch');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'branch',
      city: '',
      province: '',
      address: '',
      phone: '',
      email: '',
      latitude: '',
      longitude: '',
      google_maps_url: '',
      is_active: true,
    });
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      type: branch.type,
      city: branch.city,
      province: branch.province,
      address: branch.address || '',
      phone: branch.phone || '',
      email: branch.email || '',
      latitude: branch.latitude?.toString() || '',
      longitude: branch.longitude?.toString() || '',
      google_maps_url: branch.google_maps_url || '',
      is_active: branch.is_active,
    });
    setShowModal(true);
  };

  const handleMapUrlChange = (url: string) => {
    let lat = formData.latitude;
    let lng = formData.longitude;

    // Try to extract coordinates from URL
    // Format 1: .../@-6.123,106.123...
    const regex1 = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match1 = url.match(regex1);
    if (match1) {
      lat = match1[1];
      lng = match1[2];
    } else {
      // Format 2: ?q=-6.123,106.123 or &ll=-6.123,106.123
      const regex2 = /[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match2 = url.match(regex2);
      if (match2) {
        lat = match2[1];
        lng = match2[2];
      }
    }

    setFormData(prev => ({
      ...prev,
      google_maps_url: url,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleDelete = async (id: string, name: string) => {
    setDeleteDialog({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('branches').delete().eq('id', deleteDialog.id);
      if (error) throw error;
      setDeleteDialog({ isOpen: false, id: null, name: '' });
      toast.success('Branch deleted successfully');
      fetchBranches();
    } catch (error: any) {
      console.error('Error deleting branch:', error);
      toast.error(error.message || 'Error deleting branch');
    } finally {
      setLoading(false);
    }
  };

  const filteredBranches = branches.filter(b => {
    const matchesFilter = filter === 'all' || b.type === filter;
    const matchesSearch = (b.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (b.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (b.province?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const branchTypes = ['head_office', 'branch', 'depo'];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
            Branch <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">Network</span>
          </h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
            Manage global distribution nodes and logistical headquarters
          </p>
        </div>
        <button
          onClick={() => {
            setEditingBranch(null);
            resetForm();
            setShowModal(true);
          }}
          className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black flex items-center gap-3 hover:bg-blue-600 transition-all shadow-2xl shadow-slate-100 uppercase tracking-widest text-xs"
        >
          <Plus size={18} />
          Add Node
        </button>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm flex flex-col items-start gap-4 hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -z-10 group-hover:scale-110 duration-500"></div>
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
            <Globe size={24} />
          </div>
          <div className="text-left">
            <div className="text-3xl font-black text-gray-900 italic tracking-tighter">
              {branches.length}
            </div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Global Nodes</div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm flex flex-col items-start gap-4 hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/50 rounded-bl-full -z-10 group-hover:scale-110 duration-500"></div>
          <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200 group-hover:rotate-12 transition-transform">
            <Building2 size={24} />
          </div>
          <div className="text-left">
            <div className="text-3xl font-black text-gray-900 italic tracking-tighter">
              {branches.filter(b => b.type === 'head_office').length}
            </div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Headquarters</div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm flex flex-col items-start gap-4 hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-bl-full -z-10 group-hover:scale-110 duration-500"></div>
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
            <MapPin size={24} />
          </div>
          <div className="text-left">
            <div className="text-3xl font-black text-gray-900 italic tracking-tighter">
              {branches.filter(b => b.type === 'branch').length}
            </div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Active Branches</div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm flex flex-col items-start gap-4 hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-bl-full -z-10 group-hover:scale-110 duration-500"></div>
          <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200 group-hover:rotate-12 transition-transform">
            <Activity size={24} />
          </div>
          <div className="text-left">
            <div className="text-3xl font-black text-gray-900 italic tracking-tighter">
              {branches.filter(b => b.type === 'depo').length}
            </div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Regional Depots</div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 shadow-sm flex flex-col items-start gap-4 hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-bl-full -z-10 group-hover:scale-110 duration-500"></div>
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200 group-hover:rotate-12 transition-transform">
            <Users size={24} />
          </div>
          <div className="text-left w-full">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={distributionPoints}
                onChange={(e) => setDistributionPoints(e.target.value)}
                onBlur={saveDistributionPoints}
                className="text-3xl font-black text-gray-900 italic tracking-tighter bg-transparent border-none p-0 w-24 focus:ring-0"
              />
              {isSavingStats && <RefreshCw size={12} className="animate-spin text-amber-600" />}
            </div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Titik Distribusi</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-stretch">
        <div className="flex-1 max-w-xl relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search within the global grid (Name, City, Province)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium text-sm italic"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {['all', 'head_office', 'branch', 'depo'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-8 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${filter === type
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200'
                : 'bg-white text-gray-400 border border-gray-50 hover:bg-gray-50 shadow-sm'
                }`}
            >
              <div className={`w-2 h-2 rounded-full ${filter === type ? 'bg-white animate-pulse' : 'bg-gray-200'}`}></div>
              {type === 'all' ? 'Universal' : type === 'head_office' ? 'HQ Units' : type === 'branch' ? 'Branches' : 'Depots'}
            </button>
          ))}
        </div>
      </div>

      {/* Network Grid/Table */}
      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-50 overflow-hidden text-left">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Sequence</th>
                <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic text-left">Node Identity</th>
                <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic text-left">Protocol / Type</th>
                <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic text-left">Spatial Position</th>
                <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic text-left">Status</th>
                <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(() => {
                const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
                const paginatedBranches = filteredBranches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                if (loading) return (
                  <tr>
                    <td colSpan={6} className="px-10 py-32 text-center text-gray-300 font-black uppercase tracking-widest animate-pulse">Syncing Network Ledger...</td>
                  </tr>
                );

                if (filteredBranches.length === 0) return (
                  <tr>
                    <td colSpan={6} className="px-10 py-32 text-center">
                      <div className="space-y-4">
                        <Compass size={48} className="mx-auto text-gray-100" />
                        <p className="text-gray-300 font-black uppercase tracking-widest">No signals found in this sector</p>
                      </div>
                    </td>
                  </tr>
                );

                return (
                  <>
                    {paginatedBranches.map((branch, idx) => (
                      <tr key={branch.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-10 py-8 font-black text-gray-200 italic text-xl">
                          #{((currentPage - 1) * itemsPerPage + idx + 1).toString().padStart(3, '0')}
                        </td>
                        <td className="px-10 py-8">
                          <div className="space-y-1">
                            <div className="text-xl font-black text-gray-900 uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors">{branch.name}</div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                                <Phone size={10} className="text-blue-400" />
                                {branch.phone || 'SECURE LINE'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] italic border ${branch.type === 'head_office' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            branch.type === 'depo' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                              'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                            {(branch.type || '').replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-10 py-8">
                          <div className="space-y-1">
                            <div className="text-sm font-black text-gray-700 italic flex items-center gap-2 uppercase tracking-tight">
                              <MapPin size={12} className="text-rose-500" />
                              {branch.city}
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{branch.province}</div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border w-fit ${branch.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${branch.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
                            <span className="text-[9px] font-black uppercase tracking-widest">{branch.is_active ? 'PULSING' : 'SILENT'}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                            <button
                              onClick={() => handleEdit(branch)}
                              className="w-12 h-12 flex items-center justify-center bg-white shadow-xl hover:shadow-blue-200 text-gray-400 hover:text-blue-600 rounded-2xl transition-all border border-gray-50"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(branch.id, branch.name)}
                              className="w-12 h-12 flex items-center justify-center bg-white shadow-xl hover:shadow-rose-200 text-gray-400 hover:text-rose-500 rounded-2xl transition-all border border-gray-50"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Pagination Row */}
                    {totalPages > 1 && (
                      <tr>
                        <td colSpan={6} className="px-10 py-4 bg-gray-50/30">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredBranches.length)} of {filteredBranches.length}
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
                        </td>
                      </tr>
                    )}
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[200] flex items-center justify-center p-0 md:p-8 transition-all duration-500">
          <div className="bg-white rounded-[4rem] max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-10">
            <div className="p-12 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-8 text-left">
                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                  <Building2 size={40} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                    {editingBranch ? 'Recalibrate' : 'Initialize'} Node
                  </h3>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Distribution Geometry Terminal</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-16 h-16 flex items-center justify-center hover:bg-white rounded-[2rem] transition-all text-gray-400 hover:text-rose-500 hover:shadow-xl"
              >
                <X size={32} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar text-left font-medium">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic">Protocol Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-10 py-8 bg-gray-900 text-white border-none rounded-[2.5rem] focus:ring-8 focus:ring-blue-500/20 transition-all font-black text-2xl italic tracking-tight uppercase"
                    placeholder="e.g. Jakarta HQ"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic">Facility Classification</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-10 py-8 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2.5rem] transition-all font-black text-xl italic uppercase tracking-tighter appearance-none cursor-pointer"
                  >
                    {branchTypes.map((type) => (
                      <option key={type} value={type}>{type.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4 text-left">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic">Sector / City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] transition-all font-bold italic"
                    placeholder="e.g. Jakarta Selatan"
                  />
                </div>
                <div className="space-y-4 text-left">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic">Region / Province</label>
                  <input
                    type="text"
                    required
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] transition-all font-bold italic"
                    placeholder="e.g. DKI Jakarta"
                  />
                </div>
              </div>

              <div className="space-y-4 text-left">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic">Physical Landmark / Address</label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-10 py-8 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[3rem] transition-all font-medium italic shadow-inner leading-relaxed"
                  placeholder="Exact spatial coordinates/address..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4 text-left">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic">Comms / Phone</label>
                  <div className="relative group">
                    <Phone className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] transition-all font-bold"
                      placeholder="+62 21 000 0000"
                    />
                  </div>
                </div>
                <div className="space-y-4 text-left">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic">Digital Uplink / Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-rose-500" size={20} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] transition-all font-bold italic"
                      placeholder="node@pentavalent.co.id"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-8 bg-slate-900 rounded-[3rem] text-white/50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-blue-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Geographic Localization</span>
                    </div>
                    {formData.latitude && formData.longitude && (
                      <div className="text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
                        Coordinates Extracted
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] px-4 italic leading-none">Google Map Link</label>
                    <div className="relative group">
                      <Map size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" />
                      <input
                        type="text"
                        value={formData.google_maps_url}
                        onChange={(e) => handleMapUrlChange(e.target.value)}
                        className="w-full pl-14 pr-6 py-6 bg-slate-800 border-none rounded-[2rem] text-white font-bold italic text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Paste Google Maps URL here..."
                      />
                    </div>
                    <p className="text-[9px] text-gray-500 font-medium px-4">
                      Coordinates will be automatically extracted from the link to update the main network map.
                    </p>
                  </div>

                  {/* Hidden but stored coordinates for UI logic if needed, or just show them readonly */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/30">
                      <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Detected Latitude</div>
                      <div className="text-xs font-mono text-blue-400 font-bold">{formData.latitude || '0.000000'}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/30">
                      <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Detected Longitude</div>
                      <div className="text-xs font-mono text-rose-400 font-bold">{formData.longitude || '0.000000'}</div>
                    </div>
                  </div>
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
                    <div className={`w-16 h-9 rounded-full transition-all duration-300 shadow-inner ${formData.is_active ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                    <div className={`absolute left-1.5 top-1.5 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${formData.is_active ? 'translate-x-7' : 'translate-x-0'}`}></div>
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Pulsing Status</span>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">{formData.is_active ? 'ACTIVE TRANSMISSION' : 'STANDBY MODE'}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-12 py-8 bg-gray-100 text-gray-500 font-black rounded-[2.5rem] hover:bg-black hover:text-white transition-all uppercase tracking-widest text-[11px]"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="px-[4rem] py-8 bg-blue-600 text-white font-black rounded-[2.5rem] hover:bg-black transition-all shadow-[0_20px_50px_-12px_rgba(37,99,235,0.3)] flex items-center justify-center gap-6 uppercase tracking-[0.3em] text-[11px]"
                  >
                    <Save size={24} />
                    {editingBranch ? 'CONFIRM UPDATE' : 'DEPLOY NODE'}
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

export default BranchManager;
