import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import FileUpload from './FileUpload';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { Plus, Edit2, Trash2, X, Save, RefreshCw, Sparkles, User, GripVertical, Search } from 'lucide-react';

interface ManagementMember {
    id: string;
    name: string;
    position_id: string;
    position_en: string;
    bio_id: string;
    bio_en: string;
    image_url: string;
    sort_order: number;
    is_active: boolean;
}

const OrganizationManager: React.FC = () => {
    const [members, setMembers] = useState<ManagementMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<ManagementMember>>({});
    const [saving, setSaving] = useState(false);
    const [translating, setTranslating] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchMembers();
    }, []);

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
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAutoTranslate = async (text: string, field: 'position_en' | 'bio_en') => {
        if (!text) return;
        setTranslating(field);
        try {
            const translated = await translateText(text, 'id', 'en');
            setFormData(prev => ({ ...prev, [field]: translated }));
        } catch (error) {
            console.error('Translation error:', error);
        } finally {
            setTranslating(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const dataToSave = {
                name: formData.name,
                position_id: formData.position_id,
                position_en: formData.position_en,
                bio_id: formData.bio_id,
                bio_en: formData.bio_en,
                image_url: formData.image_url,
                sort_order: formData.sort_order || members.length + 1,
                is_active: formData.is_active !== undefined ? formData.is_active : true
            };

            if (formData.id) {
                const { error } = await supabase
                    .from('management')
                    .update(dataToSave)
                    .eq('id', formData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('management')
                    .insert(dataToSave);
                if (error) throw error;
            }

            setIsModalOpen(false);
            setFormData({});
            fetchMembers();
        } catch (error) {
            console.error('Error saving member:', error);
            alert('Failed to save member');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const { error } = await supabase
                .from('management')
                .delete()
                .eq('id', deleteId);
            if (error) throw error;
            fetchMembers();
            setDeleteId(null);
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Failed to delete member');
        }
    };

    const openEdit = (member: ManagementMember) => {
        setFormData(member);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-900 uppercase italic">Organizational Structure</h3>
                <button
                    onClick={() => { setFormData({ sort_order: members.length + 1, is_active: true }); setIsModalOpen(true); }}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                    <div key={member.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all relative">
                        <div className="aspect-[4/5] bg-slate-100 relative">
                            {member.image_url ? (
                                <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <User size={64} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => openEdit(member)}
                                        className="flex-1 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-cyan-400 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(member.id)}
                                        className="p-2 bg-white text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="text-lg font-black text-slate-900 leading-tight mb-1">{member.name}</h4>
                            <p className="text-cyan-600 text-[10px] font-black uppercase tracking-widest mb-4">{member.position_id}</p>
                            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                                <span>Order: {member.sort_order}</span>
                                <span className={member.is_active ? "text-green-500" : "text-gray-300"}>
                                    {member.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-900 uppercase italic">
                                {formData.id ? 'Edit Member' : 'Add New Member'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex gap-6">
                                <div className="w-1/3 space-y-4">
                                    <div className="bg-slate-50 rounded-2xl p-4 border-2 border-dashed border-slate-200 text-center">
                                        <div className="aspect-[3/4] rounded-xl bg-white overflow-hidden mb-4 relative">
                                            {formData.image_url ? (
                                                <img src={formData.image_url} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={48} /></div>
                                            )}
                                        </div>
                                        <FileUpload
                                            onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                                            currentUrl={formData.image_url || ''}
                                            label="Upload Photo"
                                            bucket="images"
                                            type="image"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Sort Order</label>
                                        <input
                                            type="number"
                                            value={formData.sort_order || 0}
                                            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold"
                                        />
                                    </div>
                                    <label className="flex items-center gap-3 px-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-5 h-5 rounded text-cyan-500 focus:ring-cyan-500"
                                        />
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Active Status</span>
                                    </label>
                                </div>

                                <div className="w-2/3 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-cyan-500/20"
                                            placeholder="e.g. Dr. John Doe"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Position (ID)</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.position_id || ''}
                                                onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Position (EN)</label>
                                                <button type="button" onClick={() => handleAutoTranslate(formData.position_id || '', 'position_en')} disabled={translating === 'position_en'} className="text-cyan-500"><Sparkles size={10} /></button>
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                value={formData.position_en || ''}
                                                onChange={(e) => setFormData({ ...formData, position_en: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Biography (ID)</label>
                                        <textarea
                                            rows={3}
                                            value={formData.bio_id || ''}
                                            onChange={(e) => setFormData({ ...formData, bio_id: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-medium text-sm focus:ring-2 focus:ring-cyan-500/20 resize-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biography (EN)</label>
                                            <button type="button" onClick={() => handleAutoTranslate(formData.bio_id || '', 'bio_en')} disabled={translating === 'bio_en'} className="text-cyan-500"><Sparkles size={10} /></button>
                                        </div>
                                        <textarea
                                            rows={3}
                                            value={formData.bio_en || ''}
                                            onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-medium text-sm focus:ring-2 focus:ring-cyan-500/20 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button disabled={saving} type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-500 transition-all flex items-center justify-center gap-2">
                                {saving ? <RefreshCw className="animate-spin" /> : <Save />}
                                {formData.id ? 'Save Changes' : 'Create Member'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Member"
                message="Are you sure you want to remove this member from the organization structure? This action cannot be undone."
            />
        </div>
    );
};

export default OrganizationManager;
