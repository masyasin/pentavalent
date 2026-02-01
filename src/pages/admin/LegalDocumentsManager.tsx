import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import RichTextEditor from '../../components/admin/RichTextEditor';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';
import {
    Save, Plus, Edit2, Trash2, FileText, Shield,
    CheckCircle2, AlertCircle, Sparkles, Calendar, Hash, X,
    Search, ChevronLeft, ChevronRight
} from 'lucide-react';

interface LegalDocument {
    id: string;
    type: 'privacy_policy' | 'code_of_conduct';
    title_id: string;
    title_en: string;
    content_id: string;
    content_en: string;
    effective_date: string;
    version: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const LegalDocumentsManager: React.FC = () => {
    const [documents, setDocuments] = useState<LegalDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [translating, setTranslating] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });

    const [formData, setFormData] = useState({
        type: 'privacy_policy' as 'privacy_policy' | 'code_of_conduct',
        title_id: '',
        title_en: '',
        content_id: '',
        content_en: '',
        effective_date: new Date().toISOString().split('T')[0],
        version: '1.0',
        is_active: true
    });

    // Pagination & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 2 cols x 3 rows

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('legal_documents')
                .select('*')
                .order('type', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDocuments(data || []);
        } catch (error: any) {
            console.error('Error fetching documents:', error);
            toast.error('Failed to fetch documents');
        } finally {
            setLoading(false);
        }
    };

    const handleAutoTranslate = async (field: 'title' | 'content') => {
        const sourceField = field === 'title' ? 'title_id' : 'content_id';
        const targetField = field === 'title' ? 'title_en' : 'content_en';
        const sourceText = formData[sourceField];

        if (!sourceText) return;

        try {
            setTranslating(targetField);
            const translated = await translateText(sourceText, 'id', 'en');
            setFormData({ ...formData, [targetField]: translated });
        } catch (error) {
            console.error('Translation failed:', error);
            toast.error('Translation failed');
        } finally {
            setTranslating(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title_id || !formData.content_id) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setSaving(true);

            // If setting as active, deactivate other documents of the same type
            if (formData.is_active) {
                await supabase
                    .from('legal_documents')
                    .update({ is_active: false })
                    .eq('type', formData.type)
                    .neq('id', editingDoc?.id || '');
            }

            if (editingDoc) {
                // Update existing
                const { error } = await supabase
                    .from('legal_documents')
                    .update({
                        ...formData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingDoc.id);

                if (error) throw error;
                toast.success('Document updated successfully!');
            } else {
                // Create new
                const { error } = await supabase
                    .from('legal_documents')
                    .insert([formData]);

                if (error) throw error;
                toast.success('Document created successfully!');
            }

            setShowModal(false);
            setEditingDoc(null);
            resetForm();
            fetchDocuments();
        } catch (error: any) {
            console.error('Error saving document:', error);
            toast.error(error.message || 'Failed to save document');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (doc: LegalDocument) => {
        setEditingDoc(doc);
        setFormData({
            type: doc.type,
            title_id: doc.title_id,
            title_en: doc.title_en,
            content_id: doc.content_id,
            content_en: doc.content_en,
            effective_date: doc.effective_date,
            version: doc.version,
            is_active: doc.is_active
        });
        setShowModal(true);
    };

    const handleDelete = (id: string, title: string) => {
        setDeleteDialog({ isOpen: true, id, name: title });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id) return;
        try {
            setSaving(true);
            const { error } = await supabase
                .from('legal_documents')
                .delete()
                .eq('id', deleteDialog.id);

            if (error) throw error;
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            fetchDocuments();
            toast.success('Document deleted successfully!');
        } catch (error: any) {
            console.error('Error deleting document:', error);
            toast.error(error.message || 'Failed to delete document');
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'privacy_policy',
            title_id: '',
            title_en: '',
            content_id: '',
            content_en: '',
            effective_date: new Date().toISOString().split('T')[0],
            version: '1.0',
            is_active: true
        });
    };

    const openAddModal = () => {
        setEditingDoc(null);
        resetForm();
        setShowModal(true);
    };

    const getTypeLabel = (type: string) => {
        return type === 'privacy_policy' ? 'Privacy Policy' : 'Code of Conduct';
    };

    const getTypeIcon = (type: string) => {
        return type === 'privacy_policy' ? <Shield size={20} /> : <FileText size={20} />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">LEGAL DOCUMENTS</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Manage Privacy Policy and Code of Conduct</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Document
                </button>
            </div>


            {/* Search Check */}
            <div className="relative max-w-xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                    type="text"
                    placeholder="Search documents by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-8 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm italic"
                />
            </div>

            {/* Documents Grid */}
            <div className="space-y-6">
                {(() => {
                    const filteredDocs = documents.filter(doc => {
                        return doc.title_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doc.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doc.version.toLowerCase().includes(searchTerm.toLowerCase());
                    });

                    const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
                    const paginatedDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                    if (filteredDocs.length === 0) return (
                        <div className="text-center py-12">
                            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">No legal documents found.</p>
                        </div>
                    );

                    return (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {paginatedDocs.map((doc) => (
                                    <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${doc.type === 'privacy_policy' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                                    }`}>
                                                    {getTypeIcon(doc.type)}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900">{doc.title_en}</h3>
                                                    <p className="text-xs text-gray-500 font-medium">{getTypeLabel(doc.type)}</p>
                                                </div>
                                            </div>
                                            {doc.is_active && (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black rounded-full">ACTIVE</span>
                                            )}
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Hash size={14} className="text-gray-400" />
                                                <span className="text-gray-600 font-medium">Version: {doc.version}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar size={14} className="text-gray-400" />
                                                <span className="text-gray-600 font-medium">
                                                    Effective: {new Date(doc.effective_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(doc)}
                                                className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Edit2 size={16} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doc.id, doc.title_en)}
                                                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between p-4 px-8 bg-white rounded-[2rem] border border-gray-100">
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                        Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredDocs.length)} of {filteredDocs.length}
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 z-[10000] bg-white border-b border-gray-100 px-8 py-6 rounded-t-3xl flex items-center justify-between">
                            <h2 className="text-2xl font-black text-gray-900">
                                {editingDoc ? 'Edit Document' : 'Add New Document'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Document Type */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Document Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                    required
                                >
                                    <option value="privacy_policy">Privacy Policy</option>
                                    <option value="code_of_conduct">Code of Conduct</option>
                                </select>
                            </div>

                            {/* Title ID */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Title (Indonesian) *</label>
                                <input
                                    type="text"
                                    value={formData.title_id}
                                    onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                    required
                                />
                            </div>

                            {/* Title EN */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Title (English) *</label>
                                    <button
                                        type="button"
                                        onClick={() => handleAutoTranslate('title')}
                                        disabled={translating === 'title_en'}
                                        className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-100 transition-all flex items-center gap-1 disabled:opacity-50"
                                    >
                                        {translating === 'title_en' ? (
                                            <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Sparkles size={12} />
                                        )}
                                        Auto Translate
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={formData.title_en}
                                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                    required
                                />
                            </div>

                            {/* Content ID */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Content (Indonesian) *</label>
                                <RichTextEditor
                                    content={formData.content_id}
                                    onChange={(value) => setFormData({ ...formData, content_id: value })}
                                />
                            </div>

                            {/* Content EN */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Content (English) *</label>
                                    <button
                                        type="button"
                                        onClick={() => handleAutoTranslate('content')}
                                        disabled={translating === 'content_en'}
                                        className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-100 transition-all flex items-center gap-1 disabled:opacity-50"
                                    >
                                        {translating === 'content_en' ? (
                                            <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Sparkles size={12} />
                                        )}
                                        Auto Translate
                                    </button>
                                </div>
                                <RichTextEditor
                                    content={formData.content_en}
                                    onChange={(value) => setFormData({ ...formData, content_en: value })}
                                />
                            </div>

                            {/* Version & Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Version *</label>
                                    <input
                                        type="text"
                                        value={formData.version}
                                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                        placeholder="1.0"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Effective Date *</label>
                                    <input
                                        type="date"
                                        value={formData.effective_date}
                                        onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Is Active */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <label htmlFor="is_active" className="text-sm font-bold text-gray-700">
                                    Set as Active Document (will deactivate other versions)
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingDoc(null);
                                        resetForm();
                                    }}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            {editingDoc ? 'Update' : 'Create'} Document
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Dialog */}
            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                onConfirm={confirmDelete}
                itemName={deleteDialog.name}
                isLoading={saving}
            />
        </div>
    );
};

export default LegalDocumentsManager;
