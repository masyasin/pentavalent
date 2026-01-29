import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import {
    Plus, Search, Edit2, Trash2, MapPin, Building2,
    Calendar, Briefcase, ChevronRight, X, Save, AlertCircle
} from 'lucide-react';

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
    const [showModal, setShowModal] = useState(false);
    const [editingCareer, setEditingCareer] = useState<Career | null>(null);
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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this career?')) return;
        try {
            const { error } = await supabase.from('careers').delete().eq('id', id);
            if (error) throw error;
            fetchCareers();
        } catch (error) {
            console.error('Error deleting career:', error);
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
                                        onClick={() => handleDelete(career.id)}
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
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter">
                                        {editingCareer ? 'Update Opportunity' : 'Post New Opportunity'}
                                    </h3>
                                    <p className="text-gray-500 text-sm">Fill in the details for the job vacancy</p>
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
                                <div className="space-y-6 pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">Job Description</h4>
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Description (ID)</label>
                                            <RichTextEditor
                                                content={formData.description_id}
                                                onChange={(val) => setFormData({ ...formData, description_id: val })}
                                                placeholder="Tuliskan deskripsi pekerjaan dalam Bahasa Indonesia..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Description (EN)</label>
                                            <RichTextEditor
                                                content={formData.description_en}
                                                onChange={(val) => setFormData({ ...formData, description_en: val })}
                                                placeholder="Write job description in English..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">Requirements</h4>
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Requirements (ID)</label>
                                            <RichTextEditor
                                                content={formData.requirements_id}
                                                onChange={(val) => setFormData({ ...formData, requirements_id: val })}
                                                placeholder="Tuliskan persyaratan pelamar dalam Bahasa Indonesia..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Requirements (EN)</label>
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
                                        {editingCareer ? 'Update Opportunity' : 'Publish Opportunity'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default CareerManager;
