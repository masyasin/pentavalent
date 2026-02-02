import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { logUserActivity } from '../../lib/security';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import FileUpload from '../../components/admin/FileUpload';
import { translateText } from '../../lib/translation';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Plus, Search, Edit2, Trash2, Globe, Image as ImageIcon,
    ChevronRight, ChevronLeft, X, Save, AlertCircle, ExternalLink, Sparkles, RefreshCw, Layers
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface Partner {
    id: string;
    name: string;
    partner_type: 'principal' | 'international';
    logo_url: string;
    website: string;
    description_id: string;
    description_en: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

const PartnerManager: React.FC = () => {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'principal' | 'international'>('all');
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });
    const [formData, setFormData] = useState({
        name: '',
        partner_type: 'principal' as 'principal' | 'international',
        logo_url: '',
        website: '',
        description_id: '',
        description_en: '',
        sort_order: 0,
        is_active: true,
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // 4 columns x 2 rows optimum

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType]);

    useEffect(() => {
        fetchPartners();
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

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('partners')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setPartners(data || []);
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPartner) {
                const { error } = await supabase
                    .from('partners')
                    .update(formData)
                    .eq('id', editingPartner.id);
                if (error) throw error;
                toast.success('Partner updated successfully');
                await logUserActivity('UPDATE', 'PARTNERS', `Updated partner: ${formData.name}`, user?.email);
            } else {
                const { error } = await supabase
                    .from('partners')
                    .insert(formData);
                if (error) throw error;
                toast.success('Partner anchored successfully');
                await logUserActivity('CREATE', 'PARTNERS', `Registered new partner: ${formData.name}`, user?.email);
            }

            setShowModal(false);
            resetForm();
            fetchPartners();
        } catch (error: any) {
            console.error('Error saving partner:', error);
            toast.error(error.message || 'Error saving partner');
        }
    };

    const resetForm = () => {
        setEditingPartner(null);
        setFormData({
            name: '',
            partner_type: 'principal',
            logo_url: '',
            website: '',
            description_id: '',
            description_en: '',
            sort_order: 0,
            is_active: true,
        });
    };

    const handleEdit = (item: Partner) => {
        setEditingPartner(item);
        setFormData({
            name: item.name,
            partner_type: item.partner_type,
            logo_url: item.logo_url || '',
            website: item.website || '',
            description_id: item.description_id || '',
            description_en: item.description_en || '',
            sort_order: item.sort_order || 0,
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
            const { error } = await supabase.from('partners').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            await logUserActivity('DELETE', 'PARTNERS', `Removed partner: ${deleteDialog.name}`, user?.email);
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            toast.success('Partner deleted successfully');
            fetchPartners();
        } catch (error: any) {
            console.error('Error deleting partner:', error);
            toast.error(error.message || 'Error deleting partner');
        } finally {
            setLoading(false);
        }
    };

    const filteredPartners = partners.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || p.partner_type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20 text-left">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        Partner <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">Portfolio</span>
                    </h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                        Manage company principals and global alliance networks
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
                    Register Partner
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-stretch">
                <div className="flex-1 max-w-xl relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search partners by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium text-sm italic"
                    />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {['all', 'principal', 'international'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as any)}
                            className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${filterType === type
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200'
                                : 'bg-white text-gray-400 border border-gray-50 hover:bg-gray-50 shadow-sm'
                                }`}
                        >
                            {type === 'all' ? 'Universal' : type === 'principal' ? 'Principals' : 'International'}
                        </button>
                    ))}
                </div>
            </div>

            {(() => {
                const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
                const paginatedPartners = filteredPartners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {loading ? (
                                <div className="col-span-full py-24 text-center text-gray-300 font-black uppercase tracking-widest animate-pulse">Syncing Alliance Protocols...</div>
                            ) : filteredPartners.length === 0 ? (
                                <div className="col-span-full bg-white rounded-[3.5rem] border-4 border-dashed border-gray-100 p-24 text-center space-y-6">
                                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200">
                                        <Globe size={64} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-gray-900 uppercase italic">Alliances Empty</h3>
                                        <p className="text-gray-400 font-medium">No business partners have been synchronized with the grid.</p>
                                    </div>
                                    <button onClick={() => setShowModal(true)} className="text-blue-600 font-black flex items-center gap-2 mx-auto hover:scale-105 transition-all uppercase tracking-widest text-xs">
                                        Anchor First Alliance <Plus size={16} />
                                    </button>
                                </div>
                            ) : (
                                paginatedPartners.map((partner) => (
                                    <div key={partner.id} className="bg-white rounded-[3rem] p-8 border border-gray-50 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2 transition-all group flex flex-col h-full relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] -z-10 group-hover:scale-110 duration-500"></div>

                                        <div className="flex items-center justify-between mb-8">
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] italic border ${partner.partner_type === 'principal' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                {partner.partner_type}
                                            </span>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0 duration-500">
                                                <button onClick={() => handleEdit(partner)} className="w-10 h-10 bg-white shadow-xl text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center border border-gray-50">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(partner.id, partner.name)} className="w-10 h-10 bg-white shadow-xl text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-gray-50">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col items-center text-center space-y-6">
                                            <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl group-hover:scale-105 transition-all duration-500 p-6 relative">
                                                {partner.logo_url ? (
                                                    <img src={partner.logo_url} alt={partner.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
                                                ) : (
                                                    <ImageIcon className="text-gray-100" size={48} />
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors leading-tight">
                                                    {partner.name}
                                                </h3>
                                                {partner.website && (
                                                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-blue-400 hover:text-blue-600 uppercase tracking-widest flex items-center justify-center gap-1 transition-colors italic">
                                                        Visit Signal <ExternalLink size={10} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/50 -mx-8 -mb-8 px-8 py-4">
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Protocol #{partner.sort_order}</div>
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${partner.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${partner.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                                <span className="text-[8px] font-black uppercase tracking-widest">{partner.is_active ? 'ACTIVE' : 'OFFLINE'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between p-4 px-8 mt-4">
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredPartners.length)} of {filteredPartners.length}
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

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[200] flex items-center justify-center p-0 md:p-8 transition-all duration-500 font-medium">
                    <div className="bg-white rounded-[4rem] max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95">
                        <div className="p-12 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div className="flex items-center gap-8 text-left">
                                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                                    <Layers size={40} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                                        {editingPartner ? 'Modify Alliance' : 'Anchor Partner'}
                                    </h3>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Strategic Alliance Configuration Terminal</p>
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
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic leading-none">Partner Identity</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-10 py-8 bg-gray-900 text-white border-none rounded-[3rem] focus:ring-8 focus:ring-blue-500/20 transition-all font-black text-2xl italic tracking-tight"
                                        placeholder="e.g. Novartis Global"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic leading-none">Alliance Tier</label>
                                    <select
                                        value={formData.partner_type}
                                        onChange={(e) => setFormData({ ...formData, partner_type: e.target.value as any })}
                                        className="w-full px-10 py-8 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[3rem] transition-all font-black text-xl italic uppercase tracking-tighter appearance-none cursor-pointer"
                                    >
                                        <option value="principal">Principal Tier</option>
                                        <option value="international">International Tier</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic leading-none">Signal Assets (Logo)</label>
                                    <FileUpload
                                        onUploadComplete={(url) => setFormData({ ...formData, logo_url: url })}
                                        currentUrl={formData.logo_url}
                                        label="Anchor Digital Asset"
                                        bucket="images"
                                        type="image"
                                    />
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic leading-none">External Uplink (Website)</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                                            <input
                                                type="url"
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2.5rem] transition-all font-bold italic text-blue-600"
                                                placeholder="https://partner-portal.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic leading-none">Sort Priority</label>
                                            <input
                                                type="number"
                                                value={formData.sort_order}
                                                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                                className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2.5rem] transition-all font-black italic"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic leading-none">Live Status</label>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[2.5rem] border-2 border-transparent focus-within:border-blue-500 transition-all cursor-pointer">
                                                <label className="relative inline-flex items-center cursor-pointer px-2">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={formData.is_active}
                                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                    />
                                                    <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-900">{formData.is_active ? 'ACTIVE' : 'DRAFT'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description Sections */}
                            <div className="space-y-10 pt-10 border-t border-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic leading-none">Strategic Narrative</h4>
                                </div>
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-8 italic flex items-center gap-3">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                            INDONESIAN ANALYSIS
                                        </label>
                                        <div className="rounded-[3rem] overflow-hidden border-4 border-transparent focus-within:border-blue-500/10 transition-all shadow-2xl">
                                            <RichTextEditor
                                                content={formData.description_id}
                                                onChange={(val) => setFormData({ ...formData, description_id: val })}
                                                placeholder="Jelaskan kemitraan ini secara mendalam..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-8">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic flex items-center gap-3">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                                ENGLISH ANALYSIS
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoTranslate(formData.description_id, 'description_en')}
                                                disabled={!!translating}
                                                className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 group shadow-sm"
                                            >
                                                {translating === 'description_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Global Sync</span>
                                            </button>
                                        </div>
                                        <div className="rounded-[3rem] overflow-hidden border-4 border-transparent focus-within:border-emerald-500/10 transition-all shadow-2xl">
                                            <RichTextEditor
                                                content={formData.description_en}
                                                onChange={(val) => setFormData({ ...formData, description_en: val })}
                                                placeholder="Explain this alliance for global records..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 pt-12 border-t border-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-12 py-8 bg-gray-100 text-gray-500 font-black rounded-[2.5rem] hover:bg-black hover:text-white transition-all uppercase tracking-widest text-[11px]"
                                >
                                    Cancel Anchor
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-[4rem] py-8 bg-blue-600 text-white font-black rounded-[2.5rem] hover:bg-black transition-all shadow-[0_20px_50px_-12px_rgba(37,99,235,0.3)] flex items-center justify-center gap-6 uppercase tracking-[0.3em] text-[11px]"
                                >
                                    <Save size={24} />
                                    {editingPartner ? 'CONFIRM UPDATE' : 'ESTABLISH ALLIANCE'}
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

export default PartnerManager;
