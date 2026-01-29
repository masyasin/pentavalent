import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import PageBanner from '../components/common/PageBanner';
import { Shield, Calendar, Hash, FileText } from 'lucide-react';

interface LegalDocument {
    id: string;
    type: string;
    title_id: string;
    title_en: string;
    content_id: string;
    content_en: string;
    effective_date: string;
    version: string;
}

const PrivacyPolicyPage: React.FC = () => {
    const { language } = useLanguage();
    const [document, setDocument] = useState<LegalDocument | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocument();
    }, []);

    const fetchDocument = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('legal_documents')
                .select('*')
                .eq('type', 'privacy_policy')
                .eq('is_active', true)
                .single();

            if (error) throw error;
            setDocument(data);
        } catch (error) {
            console.error('Error fetching privacy policy:', error);
        } finally {
            setLoading(false);
        }
    };

    const title = document ? (language === 'id' ? document.title_id : document.title_en) : 'Privacy Policy';
    const content = document ? (language === 'id' ? document.content_id : document.content_en) : '';

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageBanner
                title={title}
                breadcrumb={{
                    label: title
                }}
                backgroundImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&h=400&fit=crop"
            />

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Document Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                                <Shield size={32} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900">{title}</h1>
                                <p className="text-gray-500 font-medium mt-1">
                                    {language === 'id' ? 'Perlindungan Data dan Privasi Anda' : 'Your Data Protection and Privacy'}
                                </p>
                            </div>
                        </div>

                        {document && (
                            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm">
                                    <Hash size={16} className="text-gray-400" />
                                    <span className="text-gray-600 font-medium">
                                        {language === 'id' ? 'Versi' : 'Version'}: {document.version}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span className="text-gray-600 font-medium">
                                        {language === 'id' ? 'Berlaku sejak' : 'Effective from'}: {new Date(document.effective_date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                        <div
                            className="prose prose-lg max-w-none
                                prose-headings:font-black prose-headings:text-gray-900
                                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-200
                                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                                prose-p:text-gray-600 prose-p:leading-relaxed
                                prose-ul:text-gray-600 prose-ul:my-4
                                prose-li:my-2
                                prose-strong:text-gray-900 prose-strong:font-bold"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>

                    {/* Footer Note */}
                    <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <FileText size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-black text-gray-900 mb-2">
                                    {language === 'id' ? 'Pertanyaan?' : 'Questions?'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {language === 'id'
                                        ? 'Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di '
                                        : 'If you have any questions about this Privacy Policy, please contact us at '}
                                    <a href="mailto:privacy@pentavalent.com" className="text-blue-600 font-bold hover:underline">
                                        privacy@pentavalent.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
