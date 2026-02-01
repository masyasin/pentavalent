import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageSlider from '../components/common/PageSlider';
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
    const navigate = useNavigate();
    const [document, setDocument] = useState<LegalDocument | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
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

    const handleNavigate = (section: string) => {
        if (section === 'contact' || section === 'faq' || section === 'sitemap') {
            window.location.href = `/${section}`;
        } else {
            window.location.href = `/#${section}`;
        }
    };

    const title = document ? (language === 'id' ? document.title_id : document.title_en) : (language === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy');
    const content = document ? (language === 'id' ? document.content_id : document.content_en) : '';

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium font-bold">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header activeSection="privacy" onNavigate={handleNavigate} />

            <PageSlider
                pagePath="/privacy-policy"
                breadcrumbLabel={title}
            />

            <main className="relative z-10 -mt-24 md:-mt-32 pb-20">
                <div className="container mx-auto px-6 py-20">
                    <div className="max-w-4xl mx-auto">
                        {/* Document Info Card */}
                        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 sm:p-12 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-bl-[10rem] -z-0"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Shield size={36} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
                                    <p className="text-slate-500 font-bold mt-2">
                                        {language === 'id' ? 'Perlindungan Data dan Privasi Anda' : 'Your Data Protection and Privacy'}
                                    </p>
                                </div>
                            </div>

                            {document && (
                                <div className="flex flex-wrap gap-4 pt-8 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-sm bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                        <Hash size={16} className="text-slate-400" />
                                        <span className="text-slate-600 font-bold">
                                            {language === 'id' ? 'Versi' : 'Version'}: {document.version}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                        <Calendar size={16} className="text-slate-400" />
                                        <span className="text-slate-600 font-bold">
                                            {language === 'id' ? 'Berlaku sejak' : 'Effective from'}: {new Date(document.effective_date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-16">
                            <div
                                className="prose prose-lg max-w-none
                                    prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
                                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-slate-100
                                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                                    prose-p:text-slate-600 prose-p:leading-loose prose-p:font-medium
                                    prose-ul:text-slate-600 prose-ul:my-6
                                    prose-li:my-3
                                    prose-strong:text-slate-900 prose-strong:font-black"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>

                        {/* Footer Note */}
                        <div className="mt-8 p-8 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-[2rem] shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 mb-2 text-lg">
                                        {language === 'id' ? 'Pertanyaan?' : 'Questions?'}
                                    </h3>
                                    <p className="text-sm text-slate-600 font-bold leading-relaxed">
                                        {language === 'id'
                                            ? 'Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di '
                                            : 'If you have any questions about this Privacy Policy, please contact us at '}
                                        <a href="mailto:privacy@pentavalent.com" className="text-blue-600 font-black hover:underline decoration-2 underline-offset-2">
                                            privacy@pentavalent.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default PrivacyPolicyPage;
