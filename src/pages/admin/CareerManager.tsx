import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { translateText } from '../../lib/translation';
import {
    Plus, Search, Edit2, Trash2, MapPin, Building2,
    Calendar, Briefcase, ChevronRight, X, Save, AlertCircle, Sparkles, RefreshCw, Maximize2, Minimize2
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface Career {
    id: string;
    title: string;
    department: string;
    location: string;
    employment_type: string;
    description_id: string;
    description_en: string;
    requirements_id: string;
    requirements_en: string;
    deadline: string;
    is_active: boolean;
    created_at: string;
}

const CareerManager: React.FC = () => {
    const [careers, setCareers] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [editingCareer, setEditingCareer] = useState<Career | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        employment_type: 'full_time',
        description_id: '',
        description_en: '',
        requirements_id: '',
        requirements_en: '',
        deadline: '',
        is_active: true,
    });

    useEffect(() => {
        fetchCareers();
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

    const fetchCareers = async () => {
        try {
            const { data, error } = await supabase
                .from('careers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCareers(data || []);
        } catch (error) {
            console.error('Error fetching careers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCareer) {
                const { error } = await supabase
                    .from('careers')
                    .update(formData)
                    .eq('id', editingCareer.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('careers')
                    .insert(formData);
                if (error) throw error;
            }

            setShowModal(false);
            resetForm();
            fetchCareers();
        } catch (error) {
            console.error('Error saving career:', error);
        }
    };

    const resetForm = () => {
        setEditingCareer(null);
        setFormData({
            title: '',
            department: '',
            location: '',
            employment_type: 'full_time',
            description_id: '',
            description_en: '',
            requirements_id: '',
            requirements_en: '',
            deadline: '',
            is_active: true,
        });
    };

    const handleEdit = (item: Career) => {
        setEditingCareer(item);
        setFormData({
            title: item.title,
            department: item.department,
            location: item.location,
            employment_type: item.employment_type,
            description_id: item.description_id,
            description_en: item.description_en,
            requirements_id: item.requirements_id || '',
            requirements_en: item.requirements_en || '',
            deadline: item.deadline || '',
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
            const { error } = await supabase.from('careers').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            fetchCareers();
        } catch (error) {
            console.error('Error deleting career:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Career Management</h2>
                    <p className="text-gray-500 text-sm">Create and manage job opportunities</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                    <Plus size={20} />
                    Post New Job
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading careers...</div>
                ) : careers.length === 0 ? (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No Jobs Posted</h3>
                        <p className="text-gray-500 mb-6">Start by adding your first career opportunity</p>
                        <button onClick={() => setShowModal(true)} className="text-blue-600 font-bold hover:underline">
                            Add Career Now
                        </button>
                    </div>
                ) : (
                    careers.map((career) => (
                        <div key={career.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all group shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">
                                            {career.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Building2 size={14} className="text-blue-400" />
                                                {career.department}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} className="text-red-400" />
                                                {career.location}
                                            </div>
                                            <div className="flex items-center gap-1.5 border-l border-gray-100 pl-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${career.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {career.is_active ? 'Active' : 'Closed'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(career)}
                                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(career.id, career.title)}
                                        className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {
                showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-4 transition-all duration-300">
                        <div className={`bg-white shadow-2xl transition-all duration-500 ease-in-out flex flex-col ${isMaximized
                            ? 'w-full h-full rounded-0'
                            : 'max-w-6xl w-full max-h-[92vh] rounded-[2.5rem]'
                            }`}>
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-[2.5rem]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                                            {editingCareer ? 'Update Opportunity' : 'Post New Opportunity'}
                                        </h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Human Resource Management</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsMaximized(!isMaximized)}
                                        className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-gray-500 hover:text-blue-600"
                                        title={isMaximized ? "Exit Fullscreen" : "Fullscreen"}
                                    >
                                        {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-gray-500 hover:text-red-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Job Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                            placeholder="e.g. Sales Representative"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Department</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                            placeholder="e.g. Distribution"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Location</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                            placeholder="e.g. Jakarta, Indonesia"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Employment Type</label>
                                        <select
                                            value={formData.employment_type}
                                            onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-gray-700"
                                        >
                                            <option value="full_time">Full Time</option>
                                            <option value="contract">Contract</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Application Deadline</label>
                                        <input
                                            type="date"
                                            value={formData.deadline}
                                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Description Tabs / Sections */}
                                <div className="space-y-8 pt-6 border-t border-gray-100">
                                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] italic">Job Description</h4>
                                    <div className={`grid gap-8 ${isMaximized ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest px-1 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                                Description (ID)
                                            </label>
                                            <RichTextEditor
                                                content={formData.description_id}
                                                onChange={(val) => setFormData({ ...formData, description_id: val })}
                                                placeholder="Tuliskan deskripsi pekerjaan dalam Bahasa Indonesia..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest leading-none flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                                    Description (EN)
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.description_id, 'description_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                                >
                                                    {translating === 'description_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Auto</span>
                                                </button>
                                            </div>
                                            <RichTextEditor
                                                content={formData.description_en}
                                                onChange={(val) => setFormData({ ...formData, description_en: val })}
                                                placeholder="Write job description in English..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 pt-6 border-t border-gray-100">
                                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] italic">Requirements</h4>
                                    <div className={`grid gap-8 ${isMaximized ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest px-1 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                                Requirements (ID)
                                            </label>
                                            <RichTextEditor
                                                content={formData.requirements_id}
                                                onChange={(val) => setFormData({ ...formData, requirements_id: val })}
                                                placeholder="Tuliskan persyaratan pelamar dalam Bahasa Indonesia..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest leading-none flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                                    Requirements (EN)
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(formData.requirements_id, 'requirements_en')}
                                                    disabled={!!translating}
                                                    className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                                                >
                                                    {translating === 'requirements_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Auto</span>
                                                </button>
                                            </div>
                                            <RichTextEditor
                                                content={formData.requirements_en}
                                                onChange={(val) => setFormData({ ...formData, requirements_en: val })}
                                                placeholder="Write applicant requirements in English..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                                    <input
                                        type="checkbox"
                                        id="career_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded-lg border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="career_active" className="text-sm font-bold text-blue-900">
                                        Visible to public (Active)
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-8 py-4 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                                    >
                                        Discard Changes
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                    >
                                        <Save size={18} />
                                        {editingCareer ? 'SUBMIT UPDATES' : 'PUBLISH OPPORTUNITY'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

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

export default CareerManager;
