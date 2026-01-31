import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import CareerSection from '../../../components/sections/CareerSection';

import { useLanguage } from '../../../contexts/LanguageContext';
import PageSlider from '../../../components/common/PageSlider';

const CareerPage: React.FC = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleNavigate = (section: string) => {
        if (section === 'career') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate(`/#${section}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header activeSection="career" onNavigate={handleNavigate} />

            <PageSlider
                pagePath="/career"
                breadcrumbLabel={language === 'id' ? 'Karir Profesional' : 'Professional Careers'}
            />

            <main className="relative z-10 -mt-24 md:-mt-32 pb-20">
                <CareerSection isPageMode />
            </main>

            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default CareerPage;
