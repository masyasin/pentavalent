import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import FileUpload from '../../components/admin/FileUpload';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Plus, Edit2, Trash2, Save, X, Search, ChevronLeft,
    User as UserIcon, Camera, MoveUp, MoveDown,
    RefreshCw, CheckCircle2, AlertCircle, Sparkles, UserCircle
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface ManagementMember {
    id: string;
    name: string;
    position_id: string;
    position_en: string;
    bio_id: string;
    bio_en: string;
    image_url: string | null;
    sort_order: number;
    is_active: boolean;
}

const ManagementManager: React.FC = () => {
    const { t, language } = useLanguage();
    const [members, setMembers] = useState<ManagementMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState<ManagementMember | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });
    const [formData, setFormData] = useState<Partial<ManagementMember>>({
        name: '',
        position_id: '',
        position_en: '',
        bio_id: '',
        bio_en: '',
        image_url: '',
        sort_order: 0,
        is_active: true,
    });

    // Pagination & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // Display 3x3 grid

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: keyof ManagementMember) => {
        if (!sourceText) return;
        try {
            setTranslating(targetField as string);
            const translated = await translateText(sourceText, 'id', 'en');
            setFormData(prev => ({ ...prev, [targetField]: translated }));
        } catch (error) {
            console.error('Translation failed:', error);
        } finally {
            setTranslating(null);
        }
    };

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('management')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setMembers(data || []);
        } catch (error) {
            console.error('Error fetching management:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingMember) {
                const { error } = await supabase
                    .from('management')
                    .update(formData)
                    .eq('id', editingMember.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('management')
                    .insert({ ...formData, sort_order: members.length });
                if (error) throw error;
            }

            setShowModal(false);
            resetForm();
            fetchMembers();
        } catch (error) {
            console.error('Error saving member:', error);
        }
    };

    const resetForm = () => {
        setEditingMember(null);
        setFormData({
            name: '',
            position_id: '',
            position_en: '',
            bio_id: '',
            bio_en: '',
            image_url: '',
            sort_order: members.length,
            is_active: true,
        });
    };

    const handleEdit = (member: ManagementMember) => {
        setEditingMember(member);
        setFormData(member);
        setShowModal(true);
    };

    const handleDelete = (id: string, name: string) => {
        setDeleteDialog({ isOpen: true, id, name });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id) return;
        try {
            setLoading(true);
            const { error } = await supabase.from('management').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            fetchMembers();
        } catch (error) {
            console.error('Error deleting member:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSortOrder = async (id: string, newOrder: number) => {
        try {
            const { error } = await supabase
                .from('management')
                .update({ sort_order: newOrder })
                .eq('id', id);
            if (error) throw error;
            fetchMembers();
        } catch (error) {
            console.error('Error updating sort order:', error);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        Board <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">Leadership</span>
                    </h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                        Manage company leadership and management team profiles
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
                    Add Leadership
                </button>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search leadership..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-[1.5rem] transition-all font-bold text-sm"
                    />
                </div>
            </div>

            {(() => {
                const filteredMembers = members.filter(item =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.position_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.position_en.toLowerCase().includes(searchTerm.toLowerCase())
                );

                const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
                const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {loading ? (
                                <div className="col-span-full py-24 text-center text-gray-300 font-black uppercase tracking-[0.3em] animate-pulse">
                                    Synchronizing Management Hierarchy...
                                </div>
                            ) : filteredMembers.length === 0 ? (
                                <div className="col-span-full bg-white rounded-[3rem] border-4 border-dashed border-gray-100 p-24 text-center space-y-6">
                                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200 shadow-inner">
                                        <UserIcon size={64} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-gray-900 uppercase italic">No Hierarchy Defined</h3>
                                        <p className="text-gray-400 font-medium">{searchTerm ? 'No matches found.' : 'Start building your global corporate leadership structure.'}</p>
                                    </div>
                                    {!searchTerm && (
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="text-blue-600 font-black flex items-center gap-3 mx-auto hover:scale-105 transition-all uppercase tracking-widest text-xs"
                                        >
                                            Deploy First Mission <ChevronRight size={16} />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                paginatedMembers.map((member, index) => (
                                    <div key={member.id} className="bg-white rounded-[3.5rem] overflow-hidden border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-3 transition-all p-8 group relative text-left">
                                        <div className="relative mb-8">
                                            <div className="w-full aspect-square bg-slate-900 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl relative group/img">
                                                {member.image_url ? (
                                                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-800">
                                                        <UserIcon size={120} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"></div>
                                            </div>

                                            <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-10 group-hover:translate-x-0 duration-500">
                                                <button
                                                    onClick={() => handleEdit(member)}
                                                    className="w-12 h-12 bg-white text-blue-600 rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center border border-gray-50"
                                                >
                                                    <Edit2 size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(member.id, member.name)}
                                                    className="w-12 h-12 bg-white text-rose-500 rounded-2xl shadow-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-gray-50"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className={`absolute bottom-6 left-6 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md border border-white/20 ${member.is_active ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                                                }`}>
                                                {member.is_active ? 'LIVE' : 'HIDDEN'}
                                            </div>
                                        </div>

                                        <div className="space-y-3 px-2">
                                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none italic group-hover:text-blue-600 transition-colors">{member.name}</h3>
                                            <p className="text-blue-600 font-bold uppercase tracking-widest text-[11px] bg-blue-50/50 inline-block px-3 py-1 rounded-lg">
                                                {language === 'id' ? member.position_id : member.position_en}
                                            </p>

                                            <div className="pt-6 flex items-center justify-between border-t border-gray-50 mt-6">
                                                <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1">
                                                    <button
                                                        disabled={index === 0}
                                                        onClick={() => updateSortOrder(member.id, member.sort_order - 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-xl transition-all disabled:opacity-0"
                                                    >
                                                        <MoveUp size={16} />
                                                    </button>
                                                    <button
                                                        disabled={index === members.length - 1}
                                                        onClick={() => updateSortOrder(member.id, member.sort_order + 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-xl transition-all disabled:opacity-0"
                                                    >
                                                        <MoveDown size={16} />
                                                    </button>
                                                </div>
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] italic">Rank #{index + 1}</span>
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
                                    Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length}
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
                <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[200] flex items-center justify-center p-0 md:p-8 transition-all duration-500">
                    <div className="bg-white rounded-[4rem] max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500">
                        <div className="p-12 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div className="text-left">
                                <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                                    {editingMember ? 'Upgrade Profile' : 'Add New Leadership'}
                                </h3>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Global Leadership Console v2.0</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-16 h-16 flex items-center justify-center hover:bg-white rounded-[2rem] transition-all text-gray-400 hover:text-rose-500 hover:shadow-xl hover:shadow-rose-100"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar text-left">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-4">
                                    <FileUpload
                                        onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                                        currentUrl={formData.image_url || ''}
                                        label="Visual Identity"
                                        bucket="images"
                                        type="image"
                                    />
                                    <p className="mt-4 text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center px-4 leading-relaxed italic">Transparent PNG or High Corporate Portrait Recommended</p>
                                </div>

                                <div className="lg:col-span-8 space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] px-2 italic flex items-center gap-2">
                                            <UserCircle size={14} /> Full Name & Title
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-10 py-8 bg-gray-900 text-white border-none rounded-[2.5rem] focus:ring-8 focus:ring-blue-500/20 transition-all font-black text-3xl italic tracking-tight shadow-2xl"
                                            placeholder="e.g. Dr. Jane Smith, M.Sc"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Position (ID)</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.position_id}
                                                onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                                                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all font-bold text-sm"
                                                placeholder="Direktur Operasional"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center px-2">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Position (EN)</label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.position_id || '', 'position_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-600 hover:text-black transition-colors flex items-center gap-2 group"
                                                >
                                                    {translating === 'position_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Auto</span>
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={formData.position_en}
                                                onChange={(e) => setFormData({ ...formData, position_en: e.target.value })}
                                                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl transition-all font-bold text-sm"
                                                placeholder="Operations Director"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-gray-50">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 italic flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Biography (ID)
                                    </label>
                                    <textarea
                                        required
                                        rows={8}
                                        value={formData.bio_id}
                                        onChange={(e) => setFormData({ ...formData, bio_id: e.target.value })}
                                        className="w-full px-8 py-8 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[3rem] transition-all font-medium text-base leading-relaxed italic shadow-inner"
                                        placeholder="Tuliskan latar belakang dan pengalaman..."
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-4">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic flex items-center gap-2">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Biography (EN)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(formData.bio_id || '', 'bio_en')}
                                            disabled={!!translating}
                                            className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 group"
                                        >
                                            {translating === 'bio_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">Global Sync</span>
                                        </button>
                                    </div>
                                    <textarea
                                        required
                                        rows={8}
                                        value={formData.bio_en}
                                        onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
                                        className="w-full px-8 py-8 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[3rem] transition-all font-medium text-base leading-relaxed italic shadow-inner"
                                        placeholder="Write global background and experience..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-12 border-t border-gray-50">
                                <div className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        />
                                        <div className={`w-14 h-8 rounded-full transition-all duration-300 ${formData.is_active ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                                        <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-[11px] font-black text-gray-900 uppercase tracking-widest">Visibility Protocol</span>
                                        <span className="block text-[10px] text-gray-400 font-bold uppercase">{formData.is_active ? 'Public on Corporate Portal' : 'Restricted Internal View'}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-12 py-6 bg-gray-100 text-gray-500 font-black rounded-[2rem] hover:bg-black hover:text-white transition-all uppercase tracking-widest text-[10px]"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-16 py-6 bg-blue-600 text-white font-black rounded-[2rem] hover:bg-black transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[10px]"
                                    >
                                        <Save size={20} />
                                        {editingMember ? 'UPGRADE CORE' : 'PUBLISH PROFILE'}
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

// Add missing icon
const ChevronRight = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

export default ManagementManager;
