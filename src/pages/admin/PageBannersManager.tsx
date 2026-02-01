import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import FileUpload from '../../components/admin/FileUpload';
import MultiFileUpload from '../../components/admin/MultiFileUpload';
import SearchableSelect from '../../components/admin/SearchableSelect';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Plus, Edit2, Trash2, Image as ImageIcon,
    Save, X, CheckCircle2, AlertCircle,
    Layout, Type, Sparkles, RefreshCw,
    Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface PageBanner {
    id: string;
    page_path: string;
    title_id: string;
    title_en: string;
    subtitle_id: string;
    subtitle_en: string;
    image_url: string;
    sort_order: number;
    is_active: boolean;
}

interface NavMenu {
    id: string;
    label_id: string;
    label_en: string;
    path: string;
    parent_id: string | null;
}

const PageBannersManager: React.FC = () => {
    const { language } = useLanguage();
    const [banners, setBanners] = useState<PageBanner[]>([]);
    const [menus, setMenus] = useState<NavMenu[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<PageBanner | null>(null);
    const [translating, setTranslating] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });

    const [formData, setFormData] = useState<Partial<PageBanner>>({
        page_path: '',
        title_id: '',
        title_en: '',
        subtitle_id: '',
        subtitle_en: '',
        image_url: '',
        sort_order: 0,
        is_active: true,
    });

    // New state for batch upload
    const [batchImages, setBatchImages] = useState<string[]>([]);

    // Pagination & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bannersRes, menusRes] = await Promise.all([
                supabase.from('page_banners').select('*').order('page_path', { ascending: true }).order('sort_order', { ascending: true }),
                supabase.from('nav_menus').select('*').eq('is_active', true).order('sort_order', { ascending: true })
            ]);

            if (bannersRes.error) throw bannersRes.error;
            if (menusRes.error) throw menusRes.error;

            setBanners(bannersRes.data || []);
            setMenus(menusRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAutoTranslate = async (sourceText: string, targetField: keyof PageBanner) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBanner) {
                const { error } = await supabase
                    .from('page_banners')
                    .update(formData)
                    .eq('id', editingBanner.id);
                if (error) throw error;
            } else {
                // Create new banner(s)
                if (batchImages.length > 0) {
                    // Batch insert
                    const bannersToInsert = batchImages.map((url, index) => ({
                        ...formData,
                        image_url: url,
                        // If user provided a sort_order, start from there, else 0
                        sort_order: (formData.sort_order || 0) + index
                    }));

                    const { error } = await supabase
                        .from('page_banners')
                        .insert(bannersToInsert);
                    if (error) throw error;
                } else {
                    // Fallback for single insert
                    const { error } = await supabase
                        .from('page_banners')
                        .insert(formData);
                    if (error) throw error;
                }
            }

            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error saving banner:', error);
        }
    };

    const resetForm = () => {
        setEditingBanner(null);
        setBatchImages([]);
        setFormData({
            page_path: '',
            title_id: '',
            title_en: '',
            subtitle_id: '',
            subtitle_en: '',
            image_url: '',
            sort_order: 0,
            is_active: true,
        });
    };

    const handleEdit = (banner: PageBanner) => {
        setEditingBanner(banner);
        setBatchImages([]); // clear batch
        setFormData(banner);
        setShowModal(true);
    };

    const handleDelete = (id: string, name: string) => {
        setDeleteDialog({ isOpen: true, id, name });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id) return;
        try {
            setLoading(true);
            const { error } = await supabase.from('page_banners').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            fetchData();
        } catch (error) {
            console.error('Error deleting banner:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPageName = (path: string) => {
        const menu = menus.find(m => m.path === path || m.path === `/${path}`);
        if (menu) return `[${menu.label_id}] (${path})`;
        return path;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Page Banners</h2>
                    <p className="text-gray-500">Manage banner images for specific sub-pages</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-[0.15em] text-sm"
                >
                    <Plus size={18} />
                    Create New Banner
                </button>
            </div>

            {/* Search Check */}
            <div className="relative max-w-xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                    type="text"
                    placeholder="Search banners by title or page path..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-8 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm italic"
                />
            </div>

            <div className="grid grid-cols-1 gap-6">
                {(() => {
                    const filteredBanners = banners.filter(b => {
                        return b.title_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            b.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            b.page_path.toLowerCase().includes(searchTerm.toLowerCase());
                    });

                    const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
                    const paginatedBanners = filteredBanners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                    if (loading) return <div className="p-20 text-center text-gray-400">Loading banners...</div>;

                    if (filteredBanners.length === 0) return (
                        <div className="bg-white rounded-[2rem] border-4 border-dashed border-gray-100 p-20 text-center">
                            <ImageIcon className="mx-auto text-gray-200 mb-6" size={64} />
                            <h3 className="text-2xl font-black text-gray-900 uppercase">No Banners Found</h3>
                            <p className="text-gray-500 mb-8">Add banners for your sub-pages here</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="text-blue-600 font-black flex items-center gap-2 mx-auto hover:underline"
                            >
                                Add first banner <Plus size={16} />
                            </button>
                        </div>
                    );

                    return (
                        <>
                            {paginatedBanners.map((banner) => (
                                <div key={banner.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:border-blue-200 transition-all group">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Visual Preview */}
                                        <div className="w-full md:w-64 h-40 bg-gray-100 rounded-3xl overflow-hidden relative border border-gray-50">
                                            <img src={banner.image_url} alt={banner.title_id} className="w-full h-full object-cover" />
                                            <div className="absolute top-2 left-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black tracking-widest uppercase">
                                                Order: {banner.sort_order}
                                            </div>
                                            <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-[10px] font-bold text-white tracking-widest uppercase truncate max-w-[90%]">
                                                {getPageName(banner.page_path)}
                                            </div>
                                        </div>

                                        {/* Content Info */}
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="mb-2 inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                                        Target Page: {getPageName(banner.page_path)}
                                                    </div>
                                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors italic">
                                                        {banner.title_id}
                                                    </h3>
                                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">{banner.title_en}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(banner)}
                                                        className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                                                    >
                                                        <Edit2 size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(banner.id, banner.title_id)}
                                                        className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="text-gray-500 text-sm line-clamp-2 pr-10 italic">"{banner.subtitle_id}"</p>

                                            <div className="pt-4 flex items-center gap-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${banner.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                        Status: {banner.is_active ? 'Active Display' : 'Hidden'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between p-4 px-8 bg-white rounded-[2rem] border border-gray-100">
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                        Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredBanners.length)} of {filteredBanners.length}
                                    </div>
                                    <div className="flex bg-gray-50 rounded-xl p-1 gap-1">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 hover:bg-white rounded-lg disabled:opacity-30 transition-all shadow-sm"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <div className="flex items-center px-4 font-black text-xs text-gray-900">
                                            {currentPage} / {totalPages}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 hover:bg-white rounded-lg disabled:opacity-30 transition-all shadow-sm"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    );
                })()}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-4 transition-all duration-300">
                    <div className="bg-white rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col scale-in-center">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">
                                    {editingBanner ? 'Modify Page Banner' : 'Create New Banner'}
                                </h3>
                                <p className="text-gray-500 font-medium">Define imagery for specific internal pages</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12">
                            {/* Target Page */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                        <Layout size={18} />
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">Target Page</h4>
                                </div>
                                <div className="relative z-50">
                                    <SearchableSelect
                                        label="Select existing page"
                                        placeholder="Search by page name or path..."
                                        value={formData.page_path || ''}
                                        onChange={(value) => setFormData({ ...formData, page_path: value })}
                                        options={Array.from(
                                            new Map(
                                                menus.map(menu => {
                                                    const val = menu.path.replace('#', '');
                                                    return [val, {
                                                        value: val,
                                                        label: language === 'id' ? menu.label_id : menu.label_en,
                                                        description: menu.path
                                                    }];
                                                })
                                            ).values()
                                        )}
                                    />
                                    <p className="mt-2 text-xs text-gray-400 px-2">Select the page where this banner should appear. Automatically syncs with site menu structure.</p>
                                </div>
                            </div>

                            {/* Media Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                        <ImageIcon size={18} />
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">Media Assets {editingBanner ? '(Single Mode)' : '(Batch Mode)'}</h4>
                                </div>

                                {editingBanner ? (
                                    <div className="grid grid-cols-1 gap-8">
                                        <FileUpload
                                            onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                                            currentUrl={formData.image_url}
                                            label="Banner Image"
                                            bucket="images"
                                            type="image"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <MultiFileUpload
                                            onUploadComplete={(urls) => {
                                                setBatchImages(prev => [...prev, ...urls]);
                                                if (urls.length > 0 && !formData.image_url) {
                                                    setFormData({ ...formData, image_url: urls[0] });
                                                }
                                            }}
                                            label="Upload Banner Images"
                                            bucket="images"
                                        />

                                        {/* Preview Grid for Batch */}
                                        {batchImages.length > 0 && (
                                            <div className="grid grid-cols-4 gap-4 mt-4">
                                                {batchImages.map((url, idx) => (
                                                    <div key={idx} className="relative group aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                                        <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setBatchImages(prev => prev.filter((_, i) => i !== idx))}
                                                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                        <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/50 text-white text-[9px] rounded-md font-bold">
                                                            #{idx + 1}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {batchImages.length > 0 && (
                                            <p className="text-xs text-blue-600 font-bold bg-blue-50 p-2 rounded-lg inline-block">
                                                {batchImages.length} images will be created as separate banners with the details below.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Messaging Section */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                        <Type size={18} />
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">Messaging</h4>
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Headline (ID)</label>
                                            <input
                                                type="text"
                                                value={formData.title_id}
                                                onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-black text-xl italic"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description (ID)</label>
                                            <textarea
                                                value={formData.subtitle_id}
                                                onChange={(e) => setFormData({ ...formData, subtitle_id: e.target.value })}
                                                rows={2}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-medium italic"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Headline (EN)</label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.title_id || '', 'title_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group"
                                                >
                                                    {translating === 'title_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Auto</span>
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.title_en}
                                                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-black text-xl italic"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description (EN)</label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.subtitle_id || '', 'subtitle_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group"
                                                >
                                                    {translating === 'subtitle_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Auto</span>
                                                </button>
                                            </div>
                                            <textarea
                                                value={formData.subtitle_en}
                                                onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
                                                rows={2}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-medium italic"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-10 pt-6">
                                <div className="flex items-center gap-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort Order</label>
                                    <input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                        className="w-20 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-black text-center"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="slide_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-6 h-6 text-blue-600 rounded-xl border-gray-300"
                                    />
                                    <label htmlFor="slide_active" className="text-sm font-black text-gray-700 uppercase tracking-tight">Active?</label>
                                </div>
                            </div>

                            <div className="flex gap-6 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-10 py-5 border-2 border-gray-100 text-gray-400 font-black rounded-[2rem] hover:bg-gray-50 transition-all uppercase tracking-widest"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-10 py-5 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                                >
                                    <Save size={24} />
                                    {editingBanner ? 'Update Banner' : `Publish ${batchImages.length > 1 ? batchImages.length + ' Banners' : 'Banner'}`}
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

export default PageBannersManager;
