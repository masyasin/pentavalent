import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import FileUpload from '../../components/admin/FileUpload';
import {
    Plus, Edit2, Trash2, FileText, Download,
    X, Save, Filter, FileUp, Calendar, Sparkles, RefreshCw,
    Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface InvestorDocument {
    id: string;
    title_id: string;
    title_en: string;
    document_type: string;
    year: number;
    quarter: string;
    file_url: string;
    is_published: boolean;
    published_at: string;
    created_at: string;
}

const documentTypes = [
    { id: 'annual_report', label: 'Annual Report' },
    { id: 'financial_report', label: 'Financial Report' },
    { id: 'public_disclosure', label: 'Public Disclosure' },
    { id: 'prospectus', label: 'Prospectus' },
    { id: 'rups_report', label: 'RUPS Report' },
    { id: 'gcg', label: 'GCG' },
];

const InvestorManager: React.FC = () => {
    const [documents, setDocuments] = useState<InvestorDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDoc, setEditingDoc] = useState<InvestorDocument | null>(null);
    const [translating, setTranslating] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });
    const [formData, setFormData] = useState({
        title_id: '',
        title_en: '',
        document_type: 'annual_report',
        year: new Date().getFullYear(),
        quarter: '',
        file_url: '',
        is_published: true,
    });

    // Pagination & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: keyof InvestorDocument) => {
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

    const fetchDocuments = async () => {
        try {
            const { data, error } = await supabase
                .from('investor_documents')
                .select('*')
                .order('year', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDocuments(data || []);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingDoc) {
                const { error } = await supabase
                    .from('investor_documents')
                    .update(formData)
                    .eq('id', editingDoc.id);
                if (error) throw error;
                toast.success('Document updated successfully');
            } else {
                const { error } = await supabase
                    .from('investor_documents')
                    .insert(formData);
                if (error) throw error;
                toast.success('Document uploaded successfully');
            }

            setShowModal(false);
            resetForm();
            fetchDocuments();
        } catch (error: any) {
            console.error('Error saving document:', error);
            toast.error(error.message || 'Error saving document');
        }
    };

    const resetForm = () => {
        setEditingDoc(null);
        setFormData({
            title_id: '',
            title_en: '',
            document_type: 'annual_report',
            year: new Date().getFullYear(),
            quarter: '',
            file_url: '',
            is_published: true,
        });
    };

    const handleEdit = (item: InvestorDocument) => {
        setEditingDoc(item);
        setFormData({
            title_id: item.title_id,
            title_en: item.title_en,
            document_type: item.document_type,
            year: item.year,
            quarter: item.quarter || '',
            file_url: item.file_url,
            is_published: item.is_published,
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
            const { error } = await supabase.from('investor_documents').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            toast.success('Document deleted successfully');
            fetchDocuments();
        } catch (error: any) {
            console.error('Error deleting document:', error);
            toast.error(error.message || 'Error deleting document');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">INVESTOR RELATIONS</h2>
                    <p className="text-gray-500 text-sm">Upload and manage financial reports & disclosures</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                    <Plus size={20} />
                    UPLOAD DOCUMENT
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

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Document Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Period</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Visibility</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(() => {
                                const filteredDocs = documents.filter(doc => {
                                    return doc.title_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        doc.title_en.toLowerCase().includes(searchTerm.toLowerCase());
                                });

                                const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
                                const paginatedDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                                if (loading) return (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading documents...</td>
                                    </tr>
                                );

                                if (filteredDocs.length === 0) return (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No documents found</td>
                                    </tr>
                                );

                                return (
                                    <>
                                        {paginatedDocs.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{doc.title_id}</div>
                                                            <div className="text-xs text-gray-500">{doc.title_en}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-black uppercase tracking-tight">
                                                        {doc.document_type.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                        <Calendar size={14} className="text-blue-400" />
                                                        {doc.year} {doc.quarter ? `- ${doc.quarter}` : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${doc.is_published ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${doc.is_published ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                                        {doc.is_published ? 'Published' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleEdit(doc)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all">
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button onClick={() => handleDelete(doc.id, doc.title_id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Pagination Row - Rendered as a row but styling it nicely */}
                                        {totalPages > 1 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 bg-gray-50/30">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredDocs.length)} of {filteredDocs.length}
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-4 transition-all duration-300">
                    <div className="bg-white rounded-[2rem] max-w-3xl w-full shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                                    {editingDoc ? 'Update Document' : 'Upload Document'}
                                </h3>
                                <p className="text-gray-500 text-sm">Publication details for investor relations</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Title (ID)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_id}
                                        onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Title (EN)</label>
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
                                        required
                                        value={formData.title_en}
                                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Document Type</label>
                                    <select
                                        value={formData.document_type}
                                        onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold"
                                    >
                                        {documentTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Financial Year</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Quarter (Optional)</label>
                                    <select
                                        value={formData.quarter}
                                        onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold"
                                    >
                                        <option value="">Full Year</option>
                                        <option value="Q1">Q1</option>
                                        <option value="Q2">Q2</option>
                                        <option value="Q3">Q3</option>
                                        <option value="Q4">Q4</option>
                                    </select>
                                </div>
                            </div>

                            <FileUpload
                                onUploadComplete={(url) => setFormData({ ...formData, file_url: url })}
                                currentUrl={formData.file_url}
                                label="Document File (PDF)"
                                bucket="documents"
                                type="file"
                                accept=".pdf"
                            />

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <input
                                    type="checkbox"
                                    id="doc_published"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 rounded-md border-gray-300"
                                />
                                <label htmlFor="doc_published" className="text-sm font-bold text-gray-700">
                                    Publish document immediately
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-8 py-4 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 uppercase tracking-widest"
                                >
                                    <Save size={20} />
                                    {editingDoc ? 'Update Document' : 'Publish Report'}
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

export default InvestorManager;
