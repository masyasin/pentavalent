import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import {
    Plus, Edit2, Trash2, X, Save,
    Search, HelpCircle, AlertCircle, RefreshCw,
    MessageCircle, CheckCircle2, ChevronDown, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';
import RichTextEditor from '../../components/admin/RichTextEditor';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface FAQ {
    id: string;
    question_id: string;
    question_en: string;
    answer_id: string;
    answer_en: string;
    category: 'general' | 'business' | 'investor' | 'career' | 'other';
    sort_order: number;
    is_active: boolean;
}

const FAQManager: React.FC = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });

    const [formData, setFormData] = useState<Partial<FAQ>>({
        question_id: '',
        question_en: '',
        answer_id: '',
        answer_en: '',
        category: 'general',
        sort_order: 0,
        is_active: true
    });

    const categories = [
        { id: 'general', label: 'General Information' },
        { id: 'business', label: 'Business & Services' },
        { id: 'investor', label: 'Investor Relations' },
        { id: 'career', label: 'Careers' },
        { id: 'other', label: 'Other/Misc' }
    ];

    useEffect(() => {
        fetchFaqs();
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

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setFaqs(data || []);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingFaq) {
                const { error } = await supabase
                    .from('faqs')
                    .update(formData)
                    .eq('id', editingFaq.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('faqs')
                    .insert([formData]);
                if (error) throw error;
            }

            setShowModal(false);
            resetForm();
            fetchFaqs();
        } catch (error) {
            console.error('Error saving FAQ:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string, name: string) => {
        setDeleteDialog({ isOpen: true, id, name });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id) return;
        try {
            setLoading(true);
            const { error } = await supabase.from('faqs').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            fetchFaqs();
        } catch (error) {
            console.error('Error deleting FAQ:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingFaq(null);
        setFormData({
            question_id: '',
            question_en: '',
            answer_id: '',
            answer_en: '',
            category: 'general',
            sort_order: 0,
            is_active: true
        });
    };

    const handleEdit = (faq: FAQ) => {
        setEditingFaq(faq);
        setFormData(faq);
        setShowModal(true);
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">FAQ Manager</h2>
                    <p className="text-gray-500 mt-1">Manage frequently asked questions and answers</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl uppercase tracking-widest text-sm"
                >
                    <Plus size={18} />
                    Add New FAQ
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {(() => {
                    const filteredFaqs = faqs.filter(faq =>
                        faq.question_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        faq.question_en.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
                    const paginatedFaqs = filteredFaqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                    if (loading) {
                        return <div className="p-12 text-center text-gray-400">Loading FAQs...</div>;
                    }

                    if (filteredFaqs.length === 0) {
                        return (
                            <div className="bg-white rounded-[2rem] border border-gray-100 p-12 text-center">
                                <MessageCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900">No FAQs found</h3>
                                <p className="text-gray-500">Start by adding common questions to help your users</p>
                            </div>
                        );
                    }

                    return (
                        <>
                            {paginatedFaqs.map((faq) => (
                                <div key={faq.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-blue-200 transition-all group">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
                                                    {faq.category}
                                                </span>
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${faq.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {faq.is_active ? 'Active' : 'Draft'}
                                                </span>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        <img src="https://flagcdn.com/id.svg" className="w-4 h-3 object-cover rounded shadow-sm" alt="ID" />
                                                        Bahasa Indonesia
                                                    </div>
                                                    <h4 className="text-lg font-bold text-gray-900">{faq.question_id}</h4>
                                                    <div className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: faq.answer_id }} />
                                                </div>
                                                <div className="space-y-2 border-l border-gray-100 pl-6 hidden md:block">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        <img src="https://flagcdn.com/gb.svg" className="w-4 h-3 object-cover rounded shadow-sm" alt="EN" />
                                                        English
                                                    </div>
                                                    <h4 className="text-lg font-bold text-gray-900">{faq.question_en}</h4>
                                                    <div className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: faq.answer_en }} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => handleEdit(faq)}
                                                className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(faq.id, faq.question_id)}
                                                className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-blue-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination Controls */}
                            {filteredFaqs.length > 0 && (
                                <div className="flex flex-col md:flex-row items-center justify-between p-4 px-8 bg-white rounded-[2rem] border border-gray-100 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredFaqs.length)} of {filteredFaqs.length}
                                        </div>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="bg-gray-50 border-none rounded-lg text-xs font-bold text-gray-600 focus:ring-0 cursor-pointer py-1 pl-2 pr-8"
                                        >
                                            <option value={6}>6 per page</option>
                                            <option value={12}>12 per page</option>
                                            <option value={24}>24 per page</option>
                                            <option value={48}>48 per page</option>
                                        </select>
                                    </div>

                                    {totalPages > 1 && (
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
                                    )}
                                </div>
                            )}
                        </>
                    );
                })()}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-4 transition-all duration-300">
                    <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col scale-in-center">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic">
                                    {editingFaq ? 'Edit Question' : 'Add Question'}
                                </h3>
                                <p className="text-gray-500 mt-1">Create a comprehensive FAQ entry</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900"><X size={32} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Category</label>
                                    <div className="relative">
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold appearance-none"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                    </div>
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

                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Indonesian Content */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                        <img src="https://flagcdn.com/id.svg" className="w-6 h-4 object-cover rounded" alt="Data Bahasa" />
                                        <span className="font-bold text-gray-900">Bahasa Indonesia</span>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Pertanyaan</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.question_id}
                                            onChange={(e) => setFormData({ ...formData, question_id: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                            placeholder="Tulis pertanyaan..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Jawaban</label>
                                        <RichTextEditor
                                            content={formData.answer_id || ''}
                                            onChange={(html) => setFormData({ ...formData, answer_id: html })}
                                            placeholder="Tulis jawaban lengkap..."
                                        />
                                    </div>
                                </div>

                                {/* English Content */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                        <img src="https://flagcdn.com/gb.svg" className="w-6 h-4 object-cover rounded" alt="English Data" />
                                        <span className="font-bold text-gray-900">English Global</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Question</label>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoTranslate(formData.question_id || '', 'question_en')}
                                                disabled={!!translating}
                                                className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                            >
                                                {translating === 'question_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                <span className="text-[8px] font-black uppercase tracking-widest leading-none">Auto</span>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.question_en}
                                            onChange={(e) => setFormData({ ...formData, question_en: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                            placeholder="Type question here..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Answer</label>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoTranslate(formData.answer_id || '', 'answer_en')}
                                                disabled={!!translating}
                                                className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                            >
                                                {translating === 'answer_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                <span className="text-[8px] font-black uppercase tracking-widest leading-none">Auto Translate</span>
                                            </button>
                                        </div>
                                        <RichTextEditor
                                            content={formData.answer_en || ''}
                                            onChange={(html) => setFormData({ ...formData, answer_en: html })}
                                            placeholder="Provide detailed answer..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer" onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}>
                                <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.is_active ? 'left-7' : 'left-1'}`} />
                                </div>
                                <span className="font-bold text-gray-700 select-none">Publish Immediately</span>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-8 py-5 border-2 border-gray-100 text-gray-400 font-black rounded-3xl hover:bg-gray-50 transition-all uppercase tracking-widest"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] px-8 py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                                >
                                    {loading ? <RefreshCw className="animate-spin" size={24} /> : <Save size={24} />}
                                    {editingFaq ? 'Save Changes' : 'Publish FAQ'}
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

export default FAQManager;
