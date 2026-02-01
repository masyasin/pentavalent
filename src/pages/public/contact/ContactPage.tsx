import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import ContactSection from '../../../components/sections/ContactSection';

import { useLanguage } from '../../../contexts/LanguageContext';
import PageSlider from '../../../components/common/PageSlider';

const ContactPage: React.FC = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleNavigate = (section: string) => {
        if (section === 'contact') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (section === 'faq' || section === 'sitemap') {
            window.location.href = `/${section}`;
        } else {
            window.location.href = `/#${section}`;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header activeSection="contact" onNavigate={handleNavigate} />

            <PageSlider
                pagePath="/contact"
                breadcrumbLabel={language === 'id' ? 'Hubungi Kami' : 'Get In Touch'}
            />

            <main className="relative z-10 -mt-24 md:-mt-32 pb-20">
                <ContactSection isPageMode />
            </main>

            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default ContactPage;
