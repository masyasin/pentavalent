import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import FileUpload from '../../components/admin/FileUpload';
import { translateText } from '../../lib/translation';
import {
    Plus, Search, Edit2, Trash2, Globe, Image as ImageIcon,
    ChevronRight, X, Save, AlertCircle, ExternalLink, Sparkles, RefreshCw
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
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
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

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: string) => {
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

    const fetchPartners = async () => {
        try {
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
            } else {
                const { error } = await supabase
                    .from('partners')
                    .insert(formData);
                if (error) throw error;
            }

            setShowModal(false);
            resetForm();
            fetchPartners();
        } catch (error) {
            console.error('Error saving partner:', error);
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
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            fetchPartners();
        } catch (error) {
            console.error('Error deleting partner:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">PARTNER MANAGEMENT</h2>
                    <p className="text-gray-500 text-sm">Manage company partners and principals</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                    <Plus size={20} />
                    ADD PARTNER
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-gray-400">Loading partners...</div>
                ) : partners.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl border-2 border-dashed border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Globe className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No Partners Found</h3>
                        <p className="text-gray-500 mb-6">Start by adding your first business partner</p>
                        <button onClick={() => setShowModal(true)} className="text-blue-600 font-bold hover:underline">
                            Add Partner Now
                        </button>
                    </div>
                ) : (
                    partners.map((partner) => (
                        <div key={partner.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all group shadow-sm flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${partner.partner_type === 'principal' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {partner.partner_type}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => handleEdit(partner)} className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(partner.id, partner.name)} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 text-center">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-50 group-hover:border-blue-100 transition-all p-4">
                                    {partner.logo_url ? (
                                        <img src={partner.logo_url} alt={partner.name} className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <ImageIcon className="text-gray-300" size={32} />
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    {partner.name}
                                </h3>
                                {partner.website && (
                                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center justify-center gap-1">
                                        Visit Website <ExternalLink size={10} />
                                    </a>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <span>Order: {partner.sort_order}</span>
                                <span className={partner.is_active ? 'text-green-500' : 'text-red-500'}>
                                    {partner.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-4 transition-all duration-300">
                    <div className="bg-white rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                                    {editingPartner ? 'Modify Partner' : 'Register Partner'}
                                </h3>
                                <p className="text-gray-500 text-sm">Configure partner profile and visibility</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Partner Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                        placeholder="e.g. HealthCorp India"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Partner Type</label>
                                    <select
                                        value={formData.partner_type}
                                        onChange={(e) => setFormData({ ...formData, partner_type: e.target.value as any })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-gray-700"
                                    >
                                        <option value="principal">Principal</option>
                                        <option value="international">International</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <FileUpload
                                    onUploadComplete={(url) => setFormData({ ...formData, logo_url: url })}
                                    currentUrl={formData.logo_url}
                                    label="Partner Logo"
                                    bucket="images"
                                    type="image"
                                />
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Website URL</label>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                        placeholder="https://partner-website.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Sort Order</label>
                                    <input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                    />
                                </div>
                                <div className="flex items-center gap-3 mt-8">
                                    <input
                                        type="checkbox"
                                        id="partner_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded-lg border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="partner_active" className="text-sm font-bold text-gray-700">
                                        Active & Visible
                                    </label>
                                </div>
                            </div>

                            {/* Description Sections */}
                            <div className="space-y-6 pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">Partner Description</h4>
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Description (ID)</label>
                                        <RichTextEditor
                                            content={formData.description_id}
                                            onChange={(val) => setFormData({ ...formData, description_id: val })}
                                            placeholder="Tentang partner dalam Bahasa Indonesia..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Description (EN)</label>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoTranslate(formData.description_id, 'description_en')}
                                                disabled={!!translating}
                                                className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                            >
                                                {translating === 'description_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Auto Translate</span>
                                            </button>
                                        </div>
                                        <RichTextEditor
                                            content={formData.description_en}
                                            onChange={(val) => setFormData({ ...formData, description_en: val })}
                                            placeholder="About partner in English..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 pb-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-8 py-4 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
                                >
                                    <Save size={20} />
                                    {editingPartner ? 'UPDATE PARTNER' : 'SAVE PARTNER'}
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
