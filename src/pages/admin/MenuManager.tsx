import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import { toast } from 'sonner';
import {
    Plus, Edit2, Trash2, ArrowUp, ArrowDown,
    Link as LinkIcon, ExternalLink, Layout,
    CheckCircle2, AlertCircle, Save, X, Settings, Sparkles, RefreshCw
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface NavMenu {
    id: string;
    label_id: string;
    label_en: string;
    path: string;
    parent_id: string | null;
    sort_order: number;
    is_active: boolean;
    location: string;
}

const MenuManager: React.FC = () => {
    const [menus, setMenus] = useState<NavMenu[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMenu, setEditingMenu] = useState<NavMenu | null>(null);
    const [translating, setTranslating] = useState<string | null>(null);
    const [locationFilter, setLocationFilter] = useState<'header' | 'footer'>('header');
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });

    const [formData, setFormData] = useState({
        label_id: '',
        label_en: '',
        path: '',
        parent_id: '',
        sort_order: 0,
        is_active: true,
        location: 'header'
    });

    useEffect(() => {
        fetchMenus();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: keyof NavMenu) => {
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

    const fetchMenus = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('nav_menus')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setMenus(data || []);
        } catch (error) {
            console.error('Error fetching menus:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const dataToSave = {
                ...formData,
                parent_id: formData.parent_id === '' ? null : formData.parent_id
            };

            if (editingMenu) {
                const { error } = await supabase
                    .from('nav_menus')
                    .update(dataToSave)
                    .eq('id', editingMenu.id);
                if (error) throw error;
                toast.success('Menu updated successfully');
            } else {
                const { error } = await supabase
                    .from('nav_menus')
                    .insert(dataToSave);
                if (error) throw error;
                toast.success('Menu created successfully');
            }

            setShowModal(false);
            resetForm();
            fetchMenus();
        } catch (error: any) {
            console.error('Error saving menu:', error);
            toast.error(error.message || 'Failed to save menu');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingMenu(null);
        setFormData({
            label_id: '',
            label_en: '',
            path: '',
            parent_id: '',
            sort_order: menus.length,
            is_active: true,
            location: locationFilter
        });
    };

    const handleEdit = (menu: NavMenu) => {
        setEditingMenu(menu);
        setFormData({
            label_id: menu.label_id,
            label_en: menu.label_en,
            path: menu.path,
            parent_id: menu.parent_id || '',
            sort_order: menu.sort_order,
            is_active: menu.is_active,
            location: menu.location
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
            const { error } = await supabase.from('nav_menus').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            toast.success('Menu deleted successfully');
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            fetchMenus();
        } catch (error: any) {
            console.error('Error deleting menu:', error);
            toast.error(error.message || 'Failed to delete menu');
        } finally {
            setLoading(false);
        }
    };

    const filteredMenus = menus.filter(m => m.location === locationFilter);
    const parentMenus = filteredMenus.filter(m => !m.parent_id);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Navigation Menu</h2>
                    <p className="text-gray-500 text-sm italic">Manage your website's header and footer links</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-1 rounded-2xl flex">
                        <button
                            onClick={() => setLocationFilter('header')}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${locationFilter === 'header' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Header
                        </button>
                        <button
                            onClick={() => setLocationFilter('footer')}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${locationFilter === 'footer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Footer
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-xs"
                    >
                        <Plus size={16} />
                        Add Link
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <div className="grid grid-cols-12 gap-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4">
                        <div className="col-span-1">Order</div>
                        <div className="col-span-4">Label (ID / EN)</div>
                        <div className="col-span-4">Path / URL</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>
                </div>

                <div className="divide-y divide-gray-50">
                    {loading ? (
                        <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading menus...</div>
                    ) : filteredMenus.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LinkIcon className="text-gray-200" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 uppercase">No Menu Items</h3>
                            <p className="text-gray-500 text-sm mt-1">Start by adding your first link to the {locationFilter}</p>
                        </div>
                    ) : (
                        parentMenus.map((menu) => (
                            <React.Fragment key={menu.id}>
                                {/* Parent item */}
                                <div className="grid grid-cols-12 gap-4 p-6 hover:bg-blue-50/30 transition-all group items-center">
                                    <div className="col-span-1">
                                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-400 text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            {menu.sort_order}
                                        </div>
                                    </div>
                                    <div className="col-span-4">
                                        <div className="font-black text-gray-900 uppercase tracking-tight">{menu.label_id}</div>
                                        <div className="text-xs text-gray-500 font-medium">{menu.label_en}</div>
                                    </div>
                                    <div className="col-span-4">
                                        <div className="flex items-center gap-2 text-sm text-blue-600 font-bold bg-blue-50 w-fit px-3 py-1 rounded-lg">
                                            <LinkIcon size={14} />
                                            {menu.path}
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${menu.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {menu.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </div>
                                    <div className="col-span-2 flex items-center justify-end gap-2 px-4">
                                        <button onClick={() => handleEdit(menu)} className="p-2 text-gray-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(menu.id, menu.label_id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-white rounded-lg transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Children items */}
                                {filteredMenus.filter(child => child.parent_id === menu.id).map(child => (
                                    <div key={child.id} className="grid grid-cols-12 gap-4 p-6 pl-14 hover:bg-gray-50/50 border-l-4 border-l-blue-100 transition-all group items-center bg-gray-50/10">
                                        <div className="col-span-1">
                                            <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center font-black text-gray-400 text-xs">
                                                {child.sort_order}
                                            </div>
                                        </div>
                                        <div className="col-span-4">
                                            <div className="font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-400" />
                                                {child.label_id}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-medium pl-4">{child.label_en}</div>
                                        </div>
                                        <div className="col-span-4">
                                            <div className="text-xs text-gray-500 font-medium bg-white border border-gray-100 w-fit px-3 py-1 rounded-lg">
                                                {child.path}
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${child.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                {child.is_active ? 'Active' : 'Hidden'}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex items-center justify-end gap-2 px-4">
                                            <button onClick={() => handleEdit(child)} className="p-2 text-gray-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(child.id, child.label_id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-white rounded-lg transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                                    {editingMenu ? 'Edit Link' : 'Add New Link'}
                                </h3>
                                <p className="text-gray-500 text-sm">Configure your navigation link</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-2xl transition-all text-gray-400 hover:text-gray-900">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Label (ID)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.label_id}
                                        onChange={(e) => setFormData({ ...formData, label_id: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                        placeholder="Beranda"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Label (EN)</label>
                                        <button
                                            type="button"
                                            onClick={() => handleAutoTranslate(formData.label_id || '', 'label_en')}
                                            disabled={!!translating}
                                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group"
                                        >
                                            {translating === 'label_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                            <span className="text-[8px] font-black uppercase tracking-widest">Auto</span>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.label_en}
                                        onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                        placeholder="Home"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Path / URL</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.path}
                                        onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                        placeholder="/"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 px-2 italic font-medium">Use '/' for internal pages or 'https://' for external links</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Parent Menu</label>
                                    <select
                                        value={formData.parent_id}
                                        onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-700"
                                    >
                                        <option value="">None (Top Level)</option>
                                        {parentMenus.filter(m => m.id !== editingMenu?.id).map(m => (
                                            <option key={m.id} value={m.id}>{m.label_en}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Sort Order</label>
                                    <input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-blue-50 rounded-2xl">
                                <span className="text-sm font-black text-blue-900 uppercase tracking-widest">Active Link</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-8 py-5 border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest text-xs">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-8 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                                    {loading ? 'Saving...' : 'Save Link'}
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

export default MenuManager;
