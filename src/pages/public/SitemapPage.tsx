import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageBanner from '../../components/common/PageBanner';

const SitemapPage: React.FC = () => {
    const { t, language } = useLanguage();

    const sections = [
        {
            title: language === 'id' ? 'Perusahaan' : 'Company',
            links: [
                { label: language === 'id' ? 'Tentang Kami' : 'About Us', href: '/#about' },
                { label: language === 'id' ? 'Sejarah' : 'History', href: '/#about' },
                { label: language === 'id' ? 'Visi & Misi' : 'Vision & Mission', href: '/#about' },
                { label: language === 'id' ? 'Manajemen' : 'Management', href: '/#about' },
                { label: language === 'id' ? 'Sertifikasi' : 'Certifications', href: '/#certification' },
            ]
        },
        {
            title: language === 'id' ? 'Bisnis & Layanan' : 'Business & Services',
            links: [
                { label: 'Pharmaceutical', href: '/#business' },
                { label: 'Medical Devices', href: '/#business' },
                { label: 'Consumer Health', href: '/#business' },
            ]
        },
        {
            title: language === 'id' ? 'Relasi' : 'Relations',
            links: [
                { label: language === 'id' ? 'Jaringan Cabang' : 'Branch Network', href: '/#network' },
                { label: language === 'id' ? 'Mitra Kami' : 'Our Partners', href: '/#partners' },
                { label: language === 'id' ? 'Investor Relations' : 'Investor Relations', href: '/#investor' },
            ]
        },
        {
            title: language === 'id' ? 'Informasi' : 'Information',
            links: [
                { label: language === 'id' ? 'Berita & Media' : 'News & Media', href: '/#news' },
                { label: language === 'id' ? 'Karir' : 'Careers', href: '/#career' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Sitemap', href: '/sitemap' },
            ]
        },
        {
            title: language === 'id' ? 'Legal & Kepatuhan' : 'Legal & Compliance',
            links: [
                { label: language === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy', href: '#' },
                { label: language === 'id' ? 'Syarat Penggunaan' : 'Terms of Use', href: '#' },
                { label: language === 'id' ? 'Kode Etik' : 'Code of Ethics', href: '#' },
                { label: language === 'id' ? 'Whistleblowing System' : 'Whistleblowing System', href: '#' },
            ]
        }
    ];

    const handleNavigation = (section: string) => {
        if (section === 'faq') window.location.href = '/faq';
        else if (section === 'sitemap') window.location.href = '/sitemap';
        else if (section === 'contact') window.location.href = '/contact';
        else if (section === 'hero' || section === 'home') window.location.href = '/';
        else window.location.href = `/#${section}`;
    };

    return (
        <div className="min-h-screen bg-white">
            <Header onNavigate={handleNavigation} activeSection="sitemap" />

            <PageBanner
                title="Sitemap"
                subtitle={language === 'id' ? 'Struktur website kami untuk memudahkan navigasi Anda' : 'Our website structure to help you navigate easily'}
                backgroundImage="https://images.unsplash.com/photo-1518481852452-9415b262eba4?auto=format&fit=crop&q=80"
                breadcrumb={{
                    label: 'Sitemap',
                    link: '/sitemap'
                }}
            />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {sections.map((section, index) => (
                        <div key={index} className="space-y-6">
                            <h3 className="text-2xl font-black text-gray-900 border-b-4 border-gray-100 pb-4 inline-block pr-12">
                                {section.title}
                            </h3>
                            <ul className="space-y-4">
                                {section.links.map((link, idx) => (
                                    <li key={idx}>
                                        <a
                                            href={link.href}
                                            className="group flex items-center gap-3 text-gray-600 hover:text-blue-600 font-medium transition-all"
                                        >
                                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-blue-600 group-hover:scale-150 transition-all"></span>
                                            <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </main>

            <Footer onNavigate={handleNavigation} />
        </div>
    );
};

export default SitemapPage;
