import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, X, File, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface MultiFileUploadProps {
    onUploadComplete: (urls: string[]) => void;
    label?: string;
    bucket?: 'images' | 'documents' | 'videos';
    accept?: string;
    folders?: string;
}

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
    onUploadComplete,
    label = "Upload Files",
    bucket = "images",
    accept = "image/*",
    folders = ""
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploading(true);
            setError(null);
            setSuccess(false);

            const newUrls: string[] = [];
            const uploadPromises = Array.from(files).map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                const filePath = folders ? `${folders}/${fileName}` : fileName;

                const { error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(filePath);

                return publicUrl;
            });

            const results = await Promise.all(uploadPromises);
            setUploadedUrls(prev => [...prev, ...results]);
            onUploadComplete(results); // Pass ONLY the new ones, or all? Usually callback expects recent batch. 
            // Better to pass all accumulated or let parent handle state.
            // Let's pass the new ones and parent can concatenate if it wants, 
            // OR we just return the newly uploaded ones.
            // Wait, standard practice: if we maintain state here, we might want to return ALL currently valid URLs.
            // But if this is "add to list", returning new items is flexible.
            // Let's return the new items. The parent (form) likely has an array of creating-banners.

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload files');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeFile = (indexToRemove: number) => {
        // This component is mostly for UPLOADING. 
        // Managing the list of "to be created banners" should be in the parent.
        // But for visual feedback, we show what was just uploaded.
        // If we remove here, we should notify parent? 
        // Actually, simpler: Use this component JUST to upload and return URLs.
        // The parent displays the list of "Pending Banners". 
        // So this component's preview is transient or minimal.
        setUploadedUrls(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 block">
                {label} (Multiple)
            </label>

            <div className="relative group transition-all duration-300 h-32">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    accept={accept}
                    multiple
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                />

                <div className={`w-full h-full border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all ${uploading ? 'bg-gray-50 border-blue-200' :
                        error ? 'bg-red-50 border-red-200' :
                            'bg-white border-gray-100 group-hover:border-blue-400 group-hover:bg-blue-50/30'
                    }`}>
                    {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 size={32} className="text-blue-600 animate-spin" />
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest animate-pulse">Uploading Batch...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-blue-500 group-hover:bg-white group-hover:shadow-xl transition-all">
                                <Upload size={24} />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                    Click or Drag to Upload Multiple Files
                                </p>
                                <p className="text-[9px] text-gray-400 mt-1 uppercase font-medium">
                                    JPG, PNG, WebP
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Overlays */}
                {success && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-bottom-2 z-20">
                        <CheckCircle2 size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Batch Upload Success</span>
                    </div>
                )}
                {error && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-bottom-2 z-20">
                        <AlertCircle size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{error}</span>
                    </div>
                )}
            </div>

            {/* Transient Preview of JUST uploaded files in this session - optional, 
                but better if Parent handles display of "items to be saved" */}
        </div>
    );
};

export default MultiFileUpload;
