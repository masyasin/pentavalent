import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import FileUpload from '../../components/admin/FileUpload';
import {
    Plus, Edit2, Trash2, Save, X,
    User as UserIcon, Camera, MoveUp, MoveDown,
    RefreshCw, CheckCircle2, AlertCircle, Sparkles
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

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: keyof ManagementMember) => {
        if (!sourceText) return;
        try {
            setTranslating(targetField);
            const translated = await translateText(sourceText);
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Board of Directors</h2>
                    <p className="text-gray-500">Manage company leadership and management team profiles</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest text-sm"
                >
                    <Plus size={18} />
                    Add Leadership
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-[0.2em] animate-pulse">
                        Fetching Leadership Team...
                    </div>
                ) : members.length === 0 ? (
                    <div className="col-span-full bg-white rounded-[2.5rem] border-4 border-dashed border-gray-100 p-20 text-center">
                        <UserIcon className="mx-auto text-gray-200 mb-6" size={64} />
                        <h3 className="text-2xl font-black text-gray-900 uppercase">No Profiles Found</h3>
                        <p className="text-gray-500 mb-8">Start building your company structure</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-blue-600 font-black flex items-center gap-2 mx-auto hover:underline uppercase tracking-tighter"
                        >
                            Add first member now <Plus size={16} />
                        </button>
                    </div>
                ) : (
                    members.map((member, index) => (
                        <div key={member.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all p-6 group">
                            <div className="relative mb-6">
                                <div className="w-full aspect-square bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-50">
                                    {member.image_url ? (
                                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                                            <UserIcon size={80} />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="p-3 bg-white text-blue-600 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id, member.name)}
                                        className="p-3 bg-white text-red-600 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                {member.is_active ? (
                                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-green-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">Active</div>
                                ) : (
                                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">Hidden</div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter leading-none italic">{member.name}</h3>
                                <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">{member.position_en}</p>
                                <div className="pt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <button
                                            disabled={index === 0}
                                            onClick={() => updateSortOrder(member.id, member.sort_order - 1)}
                                            className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-20"
                                        >
                                            <MoveUp size={16} />
                                        </button>
                                        <button
                                            disabled={index === members.length - 1}
                                            onClick={() => updateSortOrder(member.id, member.sort_order + 1)}
                                            className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-20"
                                        >
                                            <MoveDown size={16} />
                                        </button>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-200 uppercase tracking-[0.2em]">Rank: {index + 1}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col scale-in-center">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">
                                    {editingMember ? 'Edit Leadership Profile' : 'Add New Leadership'}
                                </h3>
                                <p className="text-gray-500 font-medium mt-1">Configure profile details for the management team</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-10">
                            {/* Identity Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="md:col-span-1">
                                    <FileUpload
                                        onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                                        currentUrl={formData.image_url || ''}
                                        label="Profile Image"
                                        bucket="images"
                                        type="image"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-black text-xl italic"
                                            placeholder="e.g. John Doe, M.B.A"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Position (ID)</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.position_id}
                                                onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                                                className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                                                placeholder="Direktur Utama"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Position (EN)</label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.position_id || '', 'position_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                                >
                                                    {translating === 'position_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Auto</span>
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={formData.position_en}
                                                onChange={(e) => setFormData({ ...formData, position_en: e.target.value })}
                                                className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                                                placeholder="President Director"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Biography (ID)</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.bio_id}
                                        onChange={(e) => setFormData({ ...formData, bio_id: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-2 focus:ring-blue-500 font-medium text-sm leading-relaxed italic"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Biography (EN)</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(formData.bio_id || '', 'bio_en')}
                                            disabled={!!translating}
                                            className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                        >
                                            {translating === 'bio_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Auto</span>
                                        </button>
                                    </div>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.bio_en}
                                        onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-2 focus:ring-blue-500 font-medium text-sm leading-relaxed italic"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="member_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-6 h-6 text-blue-600 rounded-xl border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="member_active" className="text-sm font-black text-gray-700 uppercase tracking-tight">Show on Profile Page</label>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-10 py-5 border-2 border-gray-100 text-gray-400 font-black rounded-[2rem] hover:bg-gray-50 transition-all uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-10 py-5 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                                >
                                    <Save size={24} />
                                    {editingMember ? 'Update Profile' : 'Publish Member'}
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

export default ManagementManager;
