import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, X, File, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
    onUploadComplete: (url: string) => void;
    label?: string;
    bucket?: 'images' | 'documents' | 'videos';
    accept?: string;
    currentUrl?: string;
    type?: 'image' | 'video' | 'file';
}

const FileUpload: React.FC<FileUploadProps> = ({
    onUploadComplete,
    label = "Upload File",
    bucket = "images",
    accept = "image/*",
    currentUrl = "",
    type = "image"
}) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string>(currentUrl);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setError(null);
            setSuccess(false);

            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = fileName;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            setPreview(publicUrl);
            onUploadComplete(publicUrl);
            setSuccess(true);

            // Auto-hide success after 3s
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = () => {
        setPreview('');
        onUploadComplete('');
        setError(null);
        setSuccess(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 block">
                {label}
            </label>

            <div className={`relative group transition-all duration-300 ${preview ? 'h-48' : 'h-32'
                }`}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    accept={accept}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                />

                <div className={`w-full h-full border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all ${uploading ? 'bg-gray-50 border-blue-200' :
                    preview ? 'bg-gray-50 border-green-200' :
                        error ? 'bg-red-50 border-red-200' :
                            'bg-white border-gray-100 group-hover:border-blue-400 group-hover:bg-blue-50/30'
                    }`}>
                    {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 size={32} className="text-blue-600 animate-spin" />
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest animate-pulse">Uploading...</p>
                        </div>
                    ) : preview ? (
                        <div className="relative w-full h-full p-4 overflow-hidden rounded-[1.8rem]">
                            {type === 'image' ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-xl shadow-lg border border-white" />
                            ) : type === 'video' ? (
                                <video src={preview} className="w-full h-full object-contain rounded-xl shadow-lg border border-white" controls />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                                        <File size={32} />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-500 truncate max-w-[200px]">{preview.split('/').pop()}</p>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile();
                                }}
                                className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black transition-all z-20"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-blue-500 group-hover:bg-white group-hover:shadow-xl transition-all">
                                {type === 'image' ? <ImageIcon size={24} /> : type === 'video' ? <Loader2 size={24} /> : <Upload size={24} />}
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                    Click or Drag to Upload
                                </p>
                                <p className="text-[9px] text-gray-400 mt-1 uppercase font-medium">
                                    {type === 'image' ? 'JPG, PNG, WebP up to 5MB' :
                                        type === 'video' ? 'MP4, WebM up to 100MB' :
                                            'PDF, DOCX up to 10MB'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Overlays */}
                {success && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-bottom-2">
                        <CheckCircle2 size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Upload Success</span>
                    </div>
                )}
                {error && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-bottom-2">
                        <AlertCircle size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
