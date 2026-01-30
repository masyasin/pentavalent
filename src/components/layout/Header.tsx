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

  // Autocomplete Data
  const searchItems = [
    { type: 'Section', label: t('nav.about'), id: 'about', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { type: 'Section', label: t('nav.business'), id: 'business', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { type: 'Section', label: t('nav.network'), id: 'network', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { type: 'Section', label: t('nav.career'), id: 'career', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { type: 'Section', label: t('nav.contact'), id: 'contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { type: 'Info', label: t('nav.investor'), id: 'investor', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { type: 'Info', label: t('nav.news'), id: 'news', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  ];

  const filteredResults = searchQuery
    ? searchItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

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
    { id: 'network', label: t('nav.network') },
    { id: 'certification', label: t('nav.certification') },
    { id: 'investor', label: t('nav.investor') },
    { id: 'news', label: t('nav.news') },
    { id: 'career', label: t('nav.career') }, // Fixed: uses translation key
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled
          ? 'glass-panel py-3 enterprise-shadow'
          : 'bg-transparent py-4'
          }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="flex items-center justify-between relative z-10 h-full gap-2 xl:gap-4">
            {/* Logo Column - Flexible but compact */}
            <div className="flex-1 flex items-center justify-start min-w-0">
              <div
                className="cursor-pointer group flex-shrink-0 ml-12"
                onClick={() => {
                  onNavigate('hero');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="transition-all duration-700 flex items-center justify-center py-1">
                  <img
                    src="/logo-icon.png"
                    alt="Penta Valent"
                    className={`${isScrolled ? 'h-12 lg:h-14' : 'h-14 lg:h-16'} w-auto transition-all duration-700 scale-100 group-hover:scale-110 relative z-10`}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Column - Optimized for density */}
            <nav className="hidden xl:flex items-center justify-center gap-0.5 flex-none">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 lg:px-5 py-2 rounded-full text-[11px] lg:text-[13px] font-black uppercase tracking-wider transition-all duration-300 relative group whitespace-nowrap ${activeSection === item.id
                    ? (isScrolled ? 'bg-gradient-to-r from-[#0052D4] to-[#4364F7] text-white shadow-lg shadow-blue-500/30' : 'text-white bg-white/10 ring-1 ring-white/20')
                    : (isScrolled ? 'text-slate-600 hover:text-primary hover:bg-slate-50' : 'text-white/80 hover:text-white hover:bg-white/5')
                    }`}
                >
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Actions Column - Compact right side */}
            <div className="flex-1 flex items-center justify-end gap-2 xl:gap-3 min-w-0">
              <div className={`hidden lg:flex items-center rounded-full p-1 border transition-all duration-500 flex-shrink-0 ${isScrolled ? 'border-slate-200 bg-slate-50/50' : 'border-white/20 bg-white/10'}`}>
                {['id', 'en'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang as 'id' | 'en')}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${language === lang
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                      : (isScrolled ? 'text-slate-500 hover:text-primary' : 'text-white/60 hover:text-white')
                      }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`p-2.5 rounded-full border transition-all duration-500 ${isScrolled ? 'border-slate-200 bg-slate-50 text-slate-400 hover:text-primary' : 'border-white/20 bg-white/10 text-white/70 hover:text-white hover:border-white/40'}`}
                  aria-label="Search"
                >
                  <Search size={18} strokeWidth={2.5} />
                </button>

                <button
                  className={`xl:hidden p-3 rounded-full transition-all duration-500 ${isScrolled ? 'text-primary bg-slate-50 hover:bg-slate-100' : 'text-white bg-white/10 hover:bg-white/20'}`}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M8 18h12"} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-150 ease-out z-20"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </header >

      {/* Mobile Menu Overlay */}
      < div className={`fixed inset-0 z-[110] transition-all duration-500 ${isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`
      }>
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-4xl transition-transform duration-500 ease-out transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-8 flex items-center justify-between border-b border-gray-100">
              <img src="/logo-icon.png" alt="Penta Valent - Healthcare & Beyond" className="h-10 w-auto" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
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
                    className={`w-full text-left px-5 py-4 rounded-2xl text-lg font-bold transition-all ${activeSection === item.id ? 'bg-cyan-50 text-cyan-600' : 'text-gray-600 hover:bg-gray-50 hover:text-cyan-600'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-8 border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3">
                {['id', 'en'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang as 'id' | 'en')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${language === lang ? 'wow-button-gradient text-white shadow-lg shadow-cyan-500/20 scale-[1.02]' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}
                  >
                    {lang === 'id' ? 'Indonesia' : 'English'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* Search Modal Spotlight */}
      < div className={`fixed inset-0 z-[200] transition-all duration-300 ${isSearchOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        {/* Backdrop */}
        < div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsSearchOpen(false)}></div >

        {/* Modal */}
        < div className={`absolute top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300 ${isSearchOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'}`}>
          {/* Search Input Area */}
          < div className="relative border-b border-slate-100 p-6 flex items-center gap-4" >
            <Search className="flex-shrink-0 text-slate-400" size={24} />
            <input
              type="text"
              autoFocus={isSearchOpen}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'id' ? "Cari halaman, layanan, atau informasi..." : "Search for pages, services, or information..."}
              className="w-full text-xl font-bold bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-300 h-full"
            />
            <button onClick={() => setIsSearchOpen(false)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors">
              <X size={18} />
            </button>
          </div >

          {/* Results or Suggestions */}
          < div className="max-h-[60vh] overflow-y-auto p-4 bg-slate-50/50" >
            {
              searchQuery ? (
                filteredResults.length > 0 ? (
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2">Results</h5>
                    {filteredResults.map(item => (
                      <button key={item.id} onClick={() => { onNavigate(item.id); setIsSearchOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-500/10 transition-all text-left group">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:wow-button-gradient group-hover:text-white transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:wow-icon-gradient inline-block transition-colors">{item.label}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{item.type}</p>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No results found for "{searchQuery}"</p>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Suggested</h5>
                  {/* Static quick links */}
                  <div className="grid grid-cols-2 gap-3 px-2">
                    {[
                      { label: t('nav.business'), id: 'business', color: 'text-blue-500' },
                      { label: t('nav.network'), id: 'network', color: 'text-cyan-500' },
                      { label: t('nav.career'), id: 'career', color: 'text-purple-500' },
                      { label: t('nav.investor'), id: 'investor', color: 'text-orange-500' },
                    ].map(item => (
                      <button key={item.id} onClick={() => { onNavigate(item.id); setIsSearchOpen(false); }} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all text-left">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div >
        </div >
      </div >
    </>
  );
};

export default Header;
