import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import FileUpload from '../../components/admin/FileUpload';
import { translateText } from '../../lib/translation';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Plus, Edit2, Trash2, Award, Image as ImageIcon,
    X, Save, FileCheck, ShieldCheck, Sparkles, RefreshCw, Maximize2, Minimize2, ChevronRight
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
    const { t, language } = useLanguage();
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
            const translated = await translateText(sourceText, 'id', 'en');
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
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        Quality <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">& Certifications</span>
                    </h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                        Manage global ISO standards and industry leadership credentials
                    </p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black flex items-center gap-3 hover:bg-blue-600 transition-all shadow-2xl shadow-slate-100 uppercase tracking-widest text-xs"
                >
                    <Plus size={18} />
                    Add Certificate
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full py-24 text-center text-gray-300 font-black uppercase tracking-widest animate-pulse">Scanning Quality Ledger...</div>
                ) : certifications.length === 0 ? (
                    <div className="col-span-full bg-white rounded-[3.5rem] border-4 border-dashed border-gray-100 p-24 text-center space-y-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200">
                            <ShieldCheck size={64} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 uppercase italic">No Credentials Registered</h3>
                            <p className="text-gray-400 font-medium">Display your company's global quality standards here.</p>
                        </div>
                        <button onClick={() => setShowModal(true)} className="text-blue-600 font-black flex items-center gap-2 mx-auto hover:scale-105 transition-all uppercase tracking-widest text-xs">
                            Verify Global Entry <Plus size={16} />
                        </button>
                    </div>
                ) : (
                    certifications.map((cert) => (
                        <div key={cert.id} className="bg-white rounded-[3.5rem] p-8 border border-gray-50 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group flex flex-col sm:flex-row gap-10 text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] -z-10 group-hover:scale-110 duration-500"></div>

                            <div className="w-32 h-48 bg-slate-900 rounded-[2rem] flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl transform group-hover:-rotate-3 transition-transform duration-500 shrink-0">
                                {cert.image_url ? (
                                    <img src={cert.image_url} alt={cert.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                ) : (
                                    <Award className="text-slate-800" size={64} />
                                )}
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors leading-none">
                                            {cert.name}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4">
                                            <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest italic">{cert.issuer}</p>
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${cert.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                <div className={`w-2 h-2 rounded-full ${cert.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                                <span className="text-[9px] font-black uppercase tracking-widest">{cert.is_active ? 'VALID' : 'EXPIRED'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(cert)} className="w-10 h-10 text-gray-400 hover:text-blue-600 bg-white shadow-sm border border-gray-50 hover:border-blue-100 rounded-xl transition-all flex items-center justify-center">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(cert.id, cert.name)} className="w-10 h-10 text-gray-400 hover:text-rose-500 bg-white shadow-sm border border-gray-50 hover:border-rose-100 rounded-xl transition-all flex items-center justify-center">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">
                                        <FileCheck size={14} className="text-blue-400" />
                                        Registry Code: {cert.certificate_number || 'CORE-PROTOCOL-PENDING'}
                                    </div>
                                    <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-transparent group-hover:border-blue-50 transition-all">
                                        <div dangerouslySetInnerHTML={{ __html: language === 'id' ? cert.description_id : cert.description_en }} className="text-gray-500 text-[13px] font-medium leading-relaxed italic line-clamp-2 group-hover:line-clamp-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[200] flex items-center justify-center p-0 md:p-8 transition-all duration-500">
                    <div className={`bg-white shadow-2xl transition-all duration-500 flex flex-col animate-in zoom-in-95 ${isMaximized
                        ? 'w-full h-full rounded-0'
                        : 'max-w-6xl w-full max-h-[92vh] rounded-[4rem]'
                        }`}>
                        <div className="p-12 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div className="flex items-center gap-8 text-left">
                                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                                    <Award size={40} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                                        {editingCert ? 'Calibrate Badge' : 'Anchor Credential'}
                                    </h3>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Quality Standard Alignment System</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsMaximized(!isMaximized)}
                                    className="p-4 hover:bg-white hover:shadow-xl rounded-[1.5rem] transition-all text-gray-400 hover:text-blue-600"
                                    title={isMaximized ? "Exit Fullscreen" : "Fullscreen"}
                                >
                                    {isMaximized ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-4 hover:bg-white hover:shadow-xl rounded-[1.5rem] transition-all text-gray-400 hover:text-rose-500"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar text-left">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                <div className="md:col-span-8 space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic leading-none">Official Credential Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-10 py-8 bg-gray-900 text-white border-none rounded-[3rem] focus:ring-8 focus:ring-blue-500/20 transition-all font-black text-2xl italic tracking-tight"
                                            placeholder="e.g. ISO 9001:2015 Management System"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic leading-none">Authority / Issuer</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.issuer}
                                                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                                className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2.5rem] transition-all font-bold"
                                                placeholder="e.g. SGS Global / KARS"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 italic leading-none">Registry Number</label>
                                            <input
                                                type="text"
                                                value={formData.certificate_number}
                                                onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
                                                className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2.5rem] transition-all font-bold"
                                                placeholder="e.g. RG-992-PV-2024"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-4 space-y-10">
                                    <FileUpload
                                        onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                                        currentUrl={formData.image_url}
                                        label="Anchor Scanned Asset"
                                        bucket="images"
                                        type="image"
                                    />
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2.5rem] border-2 border-transparent focus-within:border-blue-500 transition-all cursor-pointer group">
                                        <div className="text-left">
                                            <span className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Live Status</span>
                                            <span className="block text-[10px] text-gray-400 font-bold uppercase">{formData.is_active ? 'Verified & Active' : 'Deprioritized / Expired'}</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            />
                                            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Description Sections */}
                            <div className="space-y-10 pt-10 border-t border-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic leading-none">Technical Narrative & Impact</h4>
                                </div>
                                <div className={`grid gap-12 ${isMaximized ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-8 italic flex items-center gap-3">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                            INDONESIAN NARRATIVE
                                        </label>
                                        <div className="rounded-[3rem] overflow-hidden border-4 border-transparent focus-within:border-blue-500/10 transition-all shadow-2xl">
                                            <RichTextEditor
                                                content={formData.description_id}
                                                onChange={(val) => setFormData({ ...formData, description_id: val })}
                                                placeholder="Jelaskan peran sertifikasi ini bagi kualitas perusahaan..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-8">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic flex items-center gap-3">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                                ENGLISH NARRATIVE
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoTranslate(formData.description_id, 'description_en')}
                                                disabled={!!translating}
                                                className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 group shadow-sm"
                                            >
                                                {translating === 'description_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Auto Sync</span>
                                            </button>
                                        </div>
                                        <div className="rounded-[3rem] overflow-hidden border-4 border-transparent focus-within:border-emerald-500/10 transition-all shadow-2xl">
                                            <RichTextEditor
                                                content={formData.description_en}
                                                onChange={(val) => setFormData({ ...formData, description_en: val })}
                                                placeholder="Detail the impact of this standard for global audience..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 pt-12 border-t border-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-12 py-8 bg-gray-100 text-gray-500 font-black rounded-[2.5rem] hover:bg-black hover:text-white transition-all uppercase tracking-widest text-[11px]"
                                >
                                    Cancel Alignment
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-[4rem] py-8 bg-blue-600 text-white font-black rounded-[2.5rem] hover:bg-black transition-all shadow-[0_20px_50px_-12px_rgba(37,99,235,0.3)] flex items-center justify-center gap-6 uppercase tracking-[0.3em] text-[11px]"
                                >
                                    <Save size={24} />
                                    {editingCert ? 'UPDATE CREDENTIAL' : 'ANCHOR POSITION'}
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
