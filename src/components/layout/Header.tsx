import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, X } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, activeSection }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: t('nav.about') },
    { id: 'business', label: t('nav.business') },
    { id: 'partners', label: t('nav.partners') },
    { id: 'network', label: t('nav.network') },
    { id: 'investor', label: t('nav.investor') },
    { id: 'career', label: t('nav.career') },
    { id: 'news', label: t('nav.news') },
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
          ? 'glass-panel py-3 enterprise-shadow'
          : 'bg-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between relative z-10">
            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer group"
              onClick={() => {
                onNavigate('hero');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className={`transition-all duration-500 flex-shrink-0 ${!isScrolled ? 'bg-white px-5 py-3 rounded-[1.25rem] shadow-2xl shadow-white/20 border border-white/50 relative overflow-hidden' : 'py-1'}`}>
                {!isScrolled && <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/10 to-white opacity-100"></div>}
                <img
                  src="/logo-penta-valent.png"
                  alt="Penta Valent - Healthcare & Beyond"
                  className={`${isScrolled ? 'h-10' : 'h-12'} w-auto transition-all duration-700 scale-100 group-hover:scale-105 relative z-10`}
                />
              </div>
            </div>

            {/* Navigation Menu - Shifted Right */}
            <nav className="hidden xl:flex items-center gap-0.5 ml-auto mr-12 min-w-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-xl text-[15px] font-bold tracking-tight transition-all duration-300 relative group overflow-hidden whitespace-nowrap ${activeSection === item.id
                    ? (isScrolled ? 'text-primary bg-primary/5' : 'text-white bg-white/10')
                    : (isScrolled ? 'text-gray-600 hover:text-primary hover:bg-primary/5' : 'text-white/80 hover:text-white hover:bg-white/10')
                    }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${activeSection === item.id && isScrolled ? 'translate-x-0' : '-translate-x-full'} group-hover:translate-x-0`}></span>
                </button>
              ))}
            </nav>

            {/* Right side: Actions */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className={`hidden md:flex items-center rounded-xl p-1 border transition-all duration-300 ${isScrolled ? 'border-gray-200 bg-gray-50/50' : 'border-white/20 bg-white/10'}`}>
                {['id', 'en'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang as 'id' | 'en')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 ${language === lang
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : (isScrolled ? 'text-gray-500 hover:text-primary' : 'text-white/60 hover:text-white')
                      }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2.5 rounded-xl border transition-all duration-300 ${isScrolled ? 'border-gray-200 bg-gray-50 text-gray-400 hover:text-primary hover:border-primary/30' : 'border-white/20 bg-white/10 text-white/60 hover:text-white hover:border-white/40'}`}
                aria-label="Search"
              >
                <Search size={18} strokeWidth={2.5} />
              </button>

              <button
                className={`xl:hidden p-3 rounded-xl transition-all duration-300 ${isScrolled ? 'text-primary bg-gray-50 hover:bg-gray-100' : 'text-white bg-white/10 hover:bg-white/20'}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMobileMenuOpen ? "M6 18L18 6" : "M4 6h16M4 12h16m-7 6h7"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-[3px] bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-150 ease-out z-20"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[110] transition-all duration-500 ${isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-4xl transition-transform duration-500 ease-out transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-8 flex items-center justify-between border-b border-gray-100">
              <img src="/logo-penta-valent.png" alt="Penta Valent - Healthcare & Beyond" className="h-9 w-auto" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-8">
              <nav className="space-y-2 px-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-5 py-4 rounded-2xl text-lg font-bold transition-all ${activeSection === item.id ? 'bg-primary/5 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-8 border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-4">
                {['id', 'en'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang as 'id' | 'en')}
                    className={`flex-1 py-4 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all ${language === lang ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white text-gray-600 border border-gray-100'}`}
                  >
                    {lang === 'id' ? 'Bahasa Indonesia' : 'English Global'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Search Overlay */}
      <div className={`fixed inset-0 z-[200] transition-all duration-500 ${isSearchOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-2xl" onClick={() => setIsSearchOpen(false)}></div>

        <div className={`absolute inset-x-0 top-0 bg-white shadow-2xl transition-all duration-500 ease-out transform ${isSearchOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
            <div className="w-full flex justify-end mb-8 md:mb-12">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            <div className="w-full relative group">
              <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-gray-400">
                <Search size={32} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                autoFocus={isSearchOpen}
                placeholder="Pencarian Semua Konten..."
                className="w-full pl-24 pr-12 py-8 md:py-10 bg-gray-50 border-2 border-gray-100 rounded-[2rem] text-2xl md:text-4xl font-black text-gray-900 placeholder:text-gray-300 focus:ring-0 focus:border-primary/20 transition-all outline-none italic tracking-tighter"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Logic for search execution
                    console.log('Searching for:', searchQuery);
                    // maybe navigate to search results
                    setIsSearchOpen(false);
                  }
                }}
              />
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2 py-2">Suggested:</span>
              <button onClick={() => setSearchQuery('Bisnis')} className="px-5 py-2 bg-gray-50 hover:bg-primary/10 hover:text-primary text-gray-600 rounded-full text-xs font-bold transition-all border border-gray-100">Bisnis</button>
              <button onClick={() => setSearchQuery('Karir')} className="px-5 py-2 bg-gray-50 hover:bg-primary/10 hover:text-primary text-gray-600 rounded-full text-xs font-bold transition-all border border-gray-100">Karir</button>
              <button onClick={() => setSearchQuery('Layanan')} className="px-5 py-2 bg-gray-50 hover:bg-primary/10 hover:text-primary text-gray-600 rounded-full text-xs font-bold transition-all border border-gray-100">Layanan</button>
              <button onClick={() => setSearchQuery('Investor')} className="px-5 py-2 bg-gray-50 hover:bg-primary/10 hover:text-primary text-gray-600 rounded-full text-xs font-bold transition-all border border-gray-100">Investor</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
