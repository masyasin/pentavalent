import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import FileUpload from '../../components/admin/FileUpload';
import { translateText } from '../../lib/translation';
import {
    Plus, Edit2, Trash2, Award, Image as ImageIcon,
    X, Save, FileCheck, ShieldCheck, Sparkles, RefreshCw, Maximize2, Minimize2
} from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

interface Certification {
    id: string;
    name: string;
    description_id: string;
    description_en: string;
    issuer: string;
    certificate_number: string;
    image_url: string;
    is_active: boolean;
    created_at: string;
}

const CertificationManager: React.FC = () => {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [editingCert, setEditingCert] = useState<Certification | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });
    const [formData, setFormData] = useState({
        name: '',
        description_id: '',
        description_en: '',
        issuer: '',
        certificate_number: '',
        image_url: '',
        is_active: true,
    });

    useEffect(() => {
        fetchCertifications();
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

    const fetchCertifications = async () => {
        try {
            const { data, error } = await supabase
                .from('certifications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCertifications(data || []);
        } catch (error) {
            console.error('Error fetching certifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCert) {
                const { error } = await supabase
                    .from('certifications')
                    .update(formData)
                    .eq('id', editingCert.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('certifications')
                    .insert(formData);
                if (error) throw error;
            }

            setShowModal(false);
            resetForm();
            fetchCertifications();
        } catch (error) {
            console.error('Error saving certification:', error);
        }
    };

    const resetForm = () => {
        setEditingCert(null);
        setFormData({
            name: '',
            description_id: '',
            description_en: '',
            issuer: '',
            certificate_number: '',
            image_url: '',
            is_active: true,
        });
    };

    const handleEdit = (item: Certification) => {
        setEditingCert(item);
        setFormData({
            name: item.name,
            description_id: item.description_id || '',
            description_en: item.description_en || '',
            issuer: item.issuer || '',
            certificate_number: item.certificate_number || '',
            image_url: item.image_url || '',
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
            const { error } = await supabase.from('certifications').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            fetchCertifications();
        } catch (error) {
            console.error('Error deleting certification:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">QUALITY & CERTIFICATIONS</h2>
                    <p className="text-gray-500 text-sm">Manage ISO and industry certifications</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                    <Plus size={20} />
                    ADD CERTIFICATE
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-gray-400">Loading certifications...</div>
                ) : certifications.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl border-2 border-dashed border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No Certifications Found</h3>
                        <p className="text-gray-500 mb-6">Display your company's quality standards here</p>
                        <button onClick={() => setShowModal(true)} className="text-blue-600 font-bold hover:underline">
                            Add Certificate Now
                        </button>
                    </div>
                ) : (
                    certifications.map((cert) => (
                        <div key={cert.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all group shadow-sm">
                            <div className="flex gap-6">
                                <div className="w-24 h-32 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-50 group-hover:border-blue-100 transition-all">
                                    {cert.image_url ? (
                                        <img src={cert.image_url} alt={cert.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Award className="text-gray-300" size={40} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                {cert.name}
                                            </h3>
                                            <p className="text-blue-500 font-bold text-xs mt-1">{cert.issuer}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(cert)} className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(cert.id, cert.name)} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <div className="flex items-center gap-1">
                                            <FileCheck size={12} className="text-gray-300" />
                                            No: {cert.certificate_number || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className={`w-2 h-2 rounded-full ${cert.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            {cert.is_active ? 'Active' : 'Expired'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-4 transition-all duration-300">
                    <div className={`bg-white shadow-2xl transition-all duration-500 ease-in-out flex flex-col ${isMaximized
                        ? 'w-full h-full rounded-0'
                        : 'max-w-6xl w-full max-h-[92vh] rounded-[2.5rem]'
                        }`}>
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                                        {editingCert ? 'Modify Certificate' : 'Add Certificate'}
                                    </h3>
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Quality Assurance System</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsMaximized(!isMaximized)}
                                    className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-gray-400 hover:text-blue-600"
                                    title={isMaximized ? "Exit Fullscreen" : "Fullscreen"}
                                >
                                    {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-gray-400 hover:text-red-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Certificate Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                        placeholder="e.g. ISO 9001:2015 Quality Management System"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Issuer / Body</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.issuer}
                                        onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                        placeholder="e.g. SGS, TUV, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Certificate Number</label>
                                    <input
                                        type="text"
                                        value={formData.certificate_number}
                                        onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                        placeholder="e.g. ID01/123456"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 items-end">
                                <FileUpload
                                    onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                                    currentUrl={formData.image_url}
                                    label="Certificate Scan Image"
                                    bucket="images"
                                    type="image"
                                />
                                <div className="flex items-center gap-3 mb-6">
                                    <input
                                        type="checkbox"
                                        id="cert_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded-lg border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="cert_active" className="text-sm font-bold text-gray-700">
                                        Active & Valid
                                    </label>
                                </div>
                            </div>

                            {/* Description Sections */}
                            <div className="space-y-6 pt-4 border-t border-gray-100">
                                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] italic">Certificate Description</h4>
                                <div className={`grid gap-8 ${isMaximized ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                            Description (ID)
                                        </label>
                                        <RichTextEditor
                                            content={formData.description_id}
                                            onChange={(val) => setFormData({ ...formData, description_id: val })}
                                            placeholder="Tentang sertifikasi dalam Bahasa Indonesia..."
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
                                            placeholder="About certification in English..."
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
                                    {editingCert ? 'UPDATE CERTIFICATE' : 'SAVE CERTIFICATE'}
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

export default CertificationManager;
