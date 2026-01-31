import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, ChevronDown, Building2, Target, Users, Globe, ShieldCheck, ArrowRight, Server, TrendingUp, Activity, FileText, FileSearch, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface HeaderProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

interface NavMenu {
  id: string;
  label_id: string;
  label_en: string;
  path: string;
  parent_id: string | null;
  sort_order: number;
  location?: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, activeSection }) => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menus, setMenus] = useState<NavMenu[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: menuData, error: menuError } = await supabase
        .from('nav_menus')
        .select('*')
        .eq('is_active', true)
        .eq('location', 'header')
        .order('sort_order', { ascending: true });

      if (menuError) throw menuError;
      setMenus(menuData || []);

      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (!settingsError) {
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Autocomplete Data based on dynamic menus
  const searchItems = menus.map(menu => ({
    type: 'Menu',
    label: language === 'id' ? menu.label_id : menu.label_en,
    id: menu.path.replace('#', '').replace('/', ''),
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }));

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

  const parentMenus = menus.filter(m => !m.parent_id);

  const getChildMenus = (parentId: string) => menus.filter(m => m.parent_id === parentId);

  const handleLinkClick = (path: string) => {
    if (path.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/' + path);
      } else {
        onNavigate(path.substring(1));
      }
    } else if (path === '/' || path === '' || path === '/beranda') {
      if (location.pathname === '/' || location.pathname === '/beranda') {
        onNavigate('beranda');
      } else {
        navigate('/');
      }
    } else if (path.startsWith('/')) {
      navigate(path);
    } else if (path.startsWith('http')) {
      window.open(path, '_blank');
    }
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

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
                className="cursor-pointer group flex-shrink-0"
                onClick={() => {
                  onNavigate('hero');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="transition-all duration-700 flex items-center justify-center py-1">
                  <img
                    src={settings?.logo_url || "/logo-icon.png"}
                    alt="Penta Valent"
                    className={`${isScrolled ? 'h-10 lg:h-14' : 'h-12 lg:h-16'} w-auto transition-all duration-700 scale-100 group-hover:scale-110 relative z-10`}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Column - Dynamic menus from Admin */}
            <nav className="hidden xl:flex items-center justify-center gap-0.5 flex-none">
              {parentMenus.map((menu) => {
                const children = getChildMenus(menu.id);
                const hasChildren = children.length > 0;
                const menuLabel = language === 'id' ? menu.label_id : menu.label_en;
                const menuPath = menu.path.startsWith('#') ? menu.path.substring(1) : menu.path;
                const isActive = activeSection === menuPath || (activeSection === 'beranda' && (menuPath === '' || menuPath === 'home' || menuPath === 'hero'));
                const isRightAligned = menu.label_en.toLowerCase().includes('news');

                return (
                  <div
                    key={menu.id}
                    className="relative group"
                    onMouseEnter={() => hasChildren && setActiveDropdown(menu.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      onClick={() => !hasChildren && handleLinkClick(menu.path)}
                      className={`px-3 lg:px-4 py-2.5 rounded-full text-[11px] lg:text-[12px] font-black uppercase tracking-[0.16em] transition-all duration-500 relative flex items-center gap-2 group/btn ${isActive
                        ? (isScrolled ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-white bg-white/20 ring-1 ring-white/30')
                        : (isScrolled ? 'text-slate-600 hover:text-primary hover:bg-slate-100/50' : 'text-white/80 hover:text-white hover:bg-white/10')
                        }`}
                    >
                      <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-0.5">{menuLabel}</span>
                      {hasChildren && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${activeDropdown === menu.id ? 'rotate-180' : ''}`} />
                      )}

                      {/* Active Indicator Underline */}
                      {isActive && !isScrolled && (
                        <motion.div layoutId="nav-active" className="absolute -bottom-1 left-4 right-4 h-0.5 bg-primary rounded-full shadow-[0_0_10px_#22d3ee]" />
                      )}
                    </button>

                    {/* Desktop Dropdown - Upgraded to Premium Enterprise Style */}
                    <AnimatePresence>
                      {hasChildren && activeDropdown === menu.id && (

                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                          className={`absolute top-full mt-3 bg-white/95 backdrop-blur-2xl border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] rounded-[2rem] p-6 overflow-hidden z-[100] ${isRightAligned ? 'w-80 right-0 origin-top-right' : 'w-[640px] left-0 origin-top-left'}`}
                        >
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-cyan-400/5 to-transparent opacity-100 pointer-events-none"></div>
                          <div className={`grid gap-4 relative z-10 text-pretty ${isRightAligned ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {children.map(child => {
                              const icons: Record<string, any> = {
                                '/about/profile': <Building2 size={20} />,
                                '/about/vision-mission': <Target size={20} />,
                                '/about/management': <Users size={20} />,
                                '/about/network-partners': <Globe size={20} />,
                                '/about/legality-achievements': <ShieldCheck size={20} />,
                                '/business/pharmaceuticals': <Building2 size={20} />,
                                '/business/consumer-goods': <Target size={20} />,
                                '/business/strategi-usaha': <TrendingUp size={20} />,
                                '/business/distribution-flow': <Server size={20} />,
                                '/business/target-market': <Users size={20} />,
                                '/investor/ringkasan-investor': <TrendingUp size={20} />,
                                '/investor/informasi-saham': <Activity size={20} />,
                                '/investor/laporan-keuangan': <FileText size={20} />,
                                '/investor/prospektus': <FileSearch size={20} />,
                                '/investor/rups': <Users size={20} />,
                                '/investor/keterbukaan-informasi': <Info size={20} />,
                                '/news?category=news': <FileText size={20} />,
                                '/news?category=press_release': <Target size={20} />,
                                '/news?category=corporate_news': <Building2 size={20} />
                              };

                              const descriptions: Record<string, any> = {
                                '/about/profile': language === 'id' ? 'Sejarah & Profil Korporasi' : 'Corporate History & Profile',
                                '/about/vision-mission': language === 'id' ? 'Arah Strategis & Nilai Inti' : 'Strategic Direction & Core Values',
                                '/about/management': language === 'id' ? 'Dewan Direksi & Komisaris' : 'Board of Directors & Commissioners',
                                '/about/network-partners': language === 'id' ? 'Distribusi & Prinsipal Global' : 'Global Distribution & Principals',
                                '/about/legality-achievements': language === 'id' ? 'Sertifikasi, Legalitas & Kepatuhan' : 'Legality, Compliance & Achievements',
                                '/business/pharmaceuticals': language === 'id' ? 'Solusi Distribusi Farmasi' : 'Pharmaceutical Distribution Solutions',
                                '/business/consumer-goods': language === 'id' ? 'Produk Kebutuhan Sehari-hari' : 'Consumer Goods Products',
                                '/business/strategi-usaha': language === 'id' ? 'Strategi Bisnis & Usaha' : 'Business & Growth Strategy',
                                '/business/distribution-flow': language === 'id' ? 'Alur Distribusi Kami' : 'Our Distribution Flow',
                                '/business/target-market': language === 'id' ? 'Cakupan Target Pasar' : 'Market Target Coverage',
                                '/investor/ringkasan-investor': language === 'id' ? 'Ringkasan Kinerja Keuangan' : 'Financial Highlights',
                                '/investor/informasi-saham': language === 'id' ? 'Data & Grafik Saham PENT' : 'PENT Stock Data & Charts',
                                '/investor/laporan-keuangan': language === 'id' ? 'Laporan Tahunan & Kuartalan' : 'Annual & Quarterly Reports',
                                '/investor/prospektus': language === 'id' ? 'Prospektus & Dokumen IPO' : 'Prospectus & IPO Documents',
                                '/investor/rups': language === 'id' ? 'Info RUPS Terkini' : 'Latest General Meetings Info',
                                '/investor/keterbukaan-informasi': language === 'id' ? 'Berita & Fakta Material' : 'Material News & Facts',
                                '/news?category=news': language === 'id' ? 'Berita & Artikel Terbaru' : 'Latest News & Articles',
                                '/news?category=press_release': language === 'id' ? 'Siaran Pers Resmi' : 'Official Press Releases',
                                '/news?category=corporate_news': language === 'id' ? 'Kegiatan & Info Korporasi' : 'Corporate Events & Info'
                              };

                              return (
                                <button
                                  key={child.id}
                                  onClick={() => handleLinkClick(child.path)}
                                  className="w-full text-left p-3 rounded-2xl bg-white/50 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-300 flex items-start gap-3 group/item relative overflow-hidden shadow-sm hover:shadow-md h-full"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-white text-slate-400 flex items-center justify-center transition-all group-hover/item:bg-primary group-hover/item:text-white shadow-sm border border-slate-100 flex-shrink-0">
                                    {icons[child.path] || <ArrowRight size={18} />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[11px] font-black text-slate-800 uppercase tracking-tight group-hover/item:text-primary transition-colors flex items-center justify-between mb-0.5">
                                      <span className="pr-2 leading-tight">{language === 'id' ? child.label_id : child.label_en}</span>
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-500 leading-tight line-clamp-2">
                                      {descriptions[child.path] || (language === 'id' ? 'Informasi lebih lanjut' : 'Further information')}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
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
                  <Search size={22} strokeWidth={2.5} />
                </button>

                <button
                  className={`xl:hidden p-3 rounded-full transition-all duration-500 touch-active ${isScrolled ? 'text-primary bg-slate-50 hover:bg-slate-100' : 'text-white bg-white/10 hover:bg-white/20'}`}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle Menu"
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
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <img src="/logo-icon.png" alt="Penta Valent - Healthcare & Beyond" className="h-8 w-auto" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all touch-active active:scale-95">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="space-y-1.5 px-6">
                {parentMenus.map((menu) => {
                  const children = getChildMenus(menu.id);
                  const hasChildren = children.length > 0;
                  const menuLabel = language === 'id' ? menu.label_id : menu.label_en;
                  const isOpen = activeDropdown === menu.id;
                  const menuPath = menu.path.startsWith('#') ? menu.path.substring(1) : menu.path;
                  const isActive = activeSection === menuPath || (activeSection === 'beranda' && (menuPath === '' || menuPath === 'home' || menuPath === 'hero'));

                  return (
                    <div key={menu.id} className="space-y-2">
                      <button
                        onClick={() => hasChildren ? setActiveDropdown(isOpen ? null : menu.id) : handleLinkClick(menu.path)}
                        className={`w-full text-left px-6 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all flex items-center justify-between border ${isActive
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20'
                          : 'text-slate-600 bg-slate-50 border-slate-100 hover:bg-white hover:border-primary/30'}`}
                      >
                        <span>{menuLabel}</span>
                        {hasChildren ? (
                          <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-180 text-primary' : 'opacity-30'}`} />
                        ) : (
                          <ArrowRight size={16} className="opacity-20" />
                        )}
                      </button>

                      {/* Mobile Dropdown - Upgraded */}
                      <AnimatePresence>
                        {hasChildren && isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pl-4 pr-2 space-y-2"
                          >
                            {children.map(child => (
                              <button
                                key={child.id}
                                onClick={() => handleLinkClick(child.path)}
                                className="w-full text-left px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 bg-white border border-slate-50 hover:border-primary/20 hover:text-primary transition-all flex items-center justify-between group"
                              >
                                <span>{language === 'id' ? child.label_id : child.label_en}</span>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                  <ArrowRight size={12} />
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm">
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
                    {menus
                      .filter(m => !m.parent_id && m.location !== 'footer')
                      .slice(0, 4)
                      .map(item => (
                        <button
                          key={item.id}
                          onClick={() => { handleLinkClick(item.path); setIsSearchOpen(false); }}
                          className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all text-left"
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                            {language === 'id' ? item.label_id : item.label_en}
                          </span>
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
