import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LanguageProvider } from '../contexts/LanguageContext';
import Header from './layout/Header';
import Footer from './layout/Footer';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import BusinessSection from './sections/BusinessSection';
import NetworkSection from './sections/NetworkSection';
import CertificationSection from './sections/CertificationSection';
import PartnersSection from './sections/PartnersSection';
import InvestorSection from './sections/InvestorSection';
import NewsSection from './sections/NewsSection';
import CareerSection from './sections/CareerSection';
import ContactSection from './sections/ContactSection';
import ManagementSection from './sections/ManagementSection';
import GCGSection from './sections/GCGSection';
import CookieBanner from './ui/CookieBanner';
import WhatsAppButton from './ui/WhatsAppButton';
import ScrollToTop from './ui/ScrollToTop';
import AdminPage from '../pages/admin/AdminPage';

const MainWebsite: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('home');

  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    business: useRef<HTMLDivElement>(null),
    network: useRef<HTMLDivElement>(null),
    certification: useRef<HTMLDivElement>(null),
    partners: useRef<HTMLDivElement>(null),
    investor: useRef<HTMLDivElement>(null),
    gcg: useRef<HTMLDivElement>(null),
    news: useRef<HTMLDivElement>(null),
    career: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  const handleNavigate = (section: string) => {
    // External pages routing
    if (section === 'faq' || section === 'sitemap') {
      window.location.href = `/${section}`;
      return;
    }

    // Standard hash navigation
    const ref = sectionRefs[section as keyof typeof sectionRefs];
    if (ref?.current) {
      const headerOffset = 80;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setCurrentSection(section);
    } else {
      // If ref doesn't exist (e.g., calling from another page), go home first
      window.location.href = `/#${section}`;
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || 'home';
          setCurrentSection(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (ref.current) {
        ref.current.id = key;
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white w-full relative">
      <Header activeSection={currentSection} onNavigate={handleNavigate} />

      <main className="w-full relative">
        <div ref={sectionRefs.home}>
          <HeroSection onNavigate={handleNavigate} />
        </div>

        <div ref={sectionRefs.about}>
          <AboutSection />
          <ManagementSection />
        </div>

        <div ref={sectionRefs.business}>
          <BusinessSection />
        </div>

        <div ref={sectionRefs.network}>
          <NetworkSection />
        </div>

        <div ref={sectionRefs.certification}>
          <CertificationSection />
        </div>

        <div ref={sectionRefs.partners}>
          <PartnersSection />
        </div>

        <div ref={sectionRefs.investor}>
          <InvestorSection />
        </div>

        <div ref={sectionRefs.gcg}>
          <GCGSection />
        </div>

        <div ref={sectionRefs.news}>
          <NewsSection />
        </div>

        <div ref={sectionRefs.career}>
          <CareerSection />
        </div>

        <div ref={sectionRefs.contact}>
          <ContactSection />
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />

      <WhatsAppButton />
      <ScrollToTop />
      <CookieBanner />
    </div>
  );
};

import FAQPage from '../pages/public/FAQPage';
import SitemapPage from '../pages/public/SitemapPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import CodeOfConductPage from '../pages/CodeOfConductPage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isFAQRoute = location.pathname === '/faq';
  const isSitemapRoute = location.pathname === '/sitemap';
  const isPrivacyRoute = location.pathname === '/privacy-policy';
  const isCodeOfConductRoute = location.pathname === '/code-of-conduct';

  return (
    <LanguageProvider>
      {isAdminRoute ? (
        <AdminPage />
      ) : isFAQRoute ? (
        <FAQPage />
      ) : isSitemapRoute ? (
        <SitemapPage />
      ) : isPrivacyRoute ? (
        <PrivacyPolicyPage />
      ) : isCodeOfConductRoute ? (
        <CodeOfConductPage />
      ) : (
        <MainWebsite />
      )}
    </LanguageProvider>
  );
};

export default AppLayout;
