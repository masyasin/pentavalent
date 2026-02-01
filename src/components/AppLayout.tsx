import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import BusinessSection from './sections/BusinessSection';
import NetworkSection from './sections/NetworkSection';
import CertificationSection from './sections/CertificationSection';
import InvestorSection from './sections/InvestorSection';
import NewsSection from './sections/NewsSection';
import SnapshotSection from './sections/SnapshotSection';
import AdminPage from '../pages/admin/AdminPage';

const MainWebsite: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('beranda');
  const isScrolling = useRef(false);

  const sectionRefs = {
    beranda: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    business: useRef<HTMLDivElement>(null),
    network: useRef<HTMLDivElement>(null),
    certification: useRef<HTMLDivElement>(null),
    partners: useRef<HTMLDivElement>(null),
    investor: useRef<HTMLDivElement>(null),
    news: useRef<HTMLDivElement>(null),
    career: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  const handleNavigate = (section: string) => {
    // External pages routing or absolute paths
    if (section === 'faq' || section === 'sitemap' || section === 'contact' || section.startsWith('/')) {
      window.location.href = section.startsWith('/') ? section : `/${section}`;
      return;
    }

    // Lock observer
    isScrolling.current = true;

    // Standard hash navigation
    const targetSection = (!section || section === 'hero' || section === 'home' || section === 'beranda') ? 'beranda' : section;

    if (targetSection === 'beranda') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setCurrentSection('beranda');
      // Update URL without hash for home
      window.history.pushState(null, '', '/');

      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
      return;
    }

    const ref = sectionRefs[targetSection as keyof typeof sectionRefs];
    if (ref?.current) {
      const headerOffset = 80;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setCurrentSection(targetSection);
    } else {
      // If ref doesn't exist (e.g., calling from another page), go home first
      window.location.href = `/#${targetSection}`;
    }

    // Unlock observer after scroll animation
    setTimeout(() => {
      isScrolling.current = false;
    }, 1000);
  };

  useEffect(() => {
    // Scroll to hash on mount
    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      setTimeout(() => {
        handleNavigate(hash);
      }, 500);
    }

    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isScrolling.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || 'beranda';
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

  const footerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;

      const rect = footerRef.current.getBoundingClientRect();
      const isFooterVisible = rect.top <= window.innerHeight + 100; // Buffer
      const isNotAtTop = window.scrollY > 500;

      setShowScrollTop(isFooterVisible && isNotAtTop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white w-full relative">
      <Header activeSection={currentSection} onNavigate={handleNavigate} />

      <main className="w-full relative">
        {/* Global Luxury Decorative Elements */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-blob transition-all duration-1000"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[150px] animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-radial from-slate-50/50 to-transparent opacity-30"></div>
        </div>

        <div ref={sectionRefs.beranda} className="relative z-10">
          <HeroSection onNavigate={handleNavigate} />
        </div>

        <SnapshotSection />

        <div ref={sectionRefs.business}>
          <BusinessSection />
        </div>

        <div ref={sectionRefs.network}>
          <NetworkSection />
        </div>

        <div ref={sectionRefs.certification}>
          <CertificationSection />
        </div>

        <div ref={sectionRefs.about}>
          <AboutSection />
        </div>

        <div ref={sectionRefs.investor}>
          <InvestorSection />
        </div>

        <div ref={sectionRefs.news}>
          <NewsSection />
        </div>
      </main>

      <div ref={footerRef}>
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Scroll To Top Button - Only appears when footer is visible */}
      <button
        onClick={() => handleNavigate('beranda')}
        className={`fixed bottom-8 right-8 z-50 p-4 bg-gray-900 text-white rounded-full shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
          }`}
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} />
      </button>
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
    <>
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
    </>
  );
};

export default AppLayout;
