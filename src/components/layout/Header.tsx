import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, ChevronDown, Building2, Target, Users, Globe, ShieldCheck, ArrowRight, Server, TrendingUp, Activity, FileText, FileSearch, Info, Layout, Newspaper, Briefcase } from 'lucide-react';
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
  const [searchIndex, setSearchIndex] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Header Menus
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

      // Fetch all searchable content
      const [newsRes, businessRes, investorRes, managementRes, careerRes, certRes, eventRes, highlightRes] = await Promise.all([
        supabase.from('news').select('id, title_id, title_en, slug, category').eq('is_published', true),
        supabase.from('business_lines').select('id, title_id, title_en, slug'),
        supabase.from('investor_documents').select('id, title_id, title_en, document_type, year, file_url').eq('is_published', true),
        supabase.from('management').select('id, name, position_id, position_en').eq('is_active', true),
        supabase.from('careers').select('id, title, department, location').eq('is_active', true),
        supabase.from('certifications').select('id, name').eq('is_active', true),
        supabase.from('investor_calendar').select('id, title_id, title_en, event_date').eq('is_active', true),
        supabase.from('investor_highlights').select('id, label_id, label_en').eq('is_active', true)
      ]);

      const index: any[] = [];

      // Add Menus
      if (menuData) {
        menuData.forEach(m => {
          index.push({
            type: language === 'id' ? 'Menu' : 'Navigation',
            label: language === 'id' ? m.label_id : m.label_en,
            id: m.path,
            icon: 'M4 6h16M4 12h16M4 18h16',
            path: m.path
          });
        });
      }

      // Add News
      if (newsRes.data) {
        newsRes.data.forEach(n => {
          index.push({
            type: language === 'id' ? 'Berita' : 'News',
            label: language === 'id' ? n.title_id : n.title_en,
            id: n.id,
            icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM7 8h4m-4 4h8m-8 4h8',
            path: `/news/${n.slug}`
          });
        });
      }

      // Add Business
      if (businessRes.data) {
        businessRes.data.forEach(b => {
          index.push({
            type: language === 'id' ? 'Bisnis' : 'Business',
            label: language === 'id' ? b.title_id : b.title_en,
            id: b.id,
            icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            path: b.slug.startsWith('/') ? b.slug : `/business/${b.slug}`
          });
        });
      }

      // Add Investor Documents
      if (investorRes.data) {
        investorRes.data.forEach(d => {
          index.push({
            type: language === 'id' ? 'Laporan' : 'Report',
            label: `${language === 'id' ? d.title_id : d.title_en} (${d.year})`,
            id: d.id,
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            path: d.file_url,
            isExternal: d.file_url.startsWith('http') || d.file_url === '#'
          });
        });
      }

      // Add Management
      if (managementRes.data) {
        managementRes.data.forEach(m => {
          index.push({
            type: language === 'id' ? 'Manajemen' : 'Management',
            label: m.name,
            id: m.id,
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
            path: '/about/management'
          });
        });
      }

      // Add Careers
      if (careerRes.data) {
        careerRes.data.forEach(c => {
          index.push({
            type: language === 'id' ? 'Karir' : 'Career',
            label: `${c.title} - ${c.location}`,
            id: c.id,
            icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            path: '/careers'
          });
        });
      }

      // Add Certifications
      if (certRes.data) {
        certRes.data.forEach(c => {
          index.push({
            type: language === 'id' ? 'Sertifikasi' : 'Certification',
            label: c.name,
            id: c.id,
            icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            path: '/about/legality-achievements'
          });
        });
      }

      // Add Events
      if (eventRes.data) {
        eventRes.data.forEach(e => {
          index.push({
            type: language === 'id' ? 'Agenda' : 'Event',
            label: language === 'id' ? e.title_id : e.title_en,
            id: e.id,
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            path: '/investor/rups'
          });
        });
      }

      // Add Investor Highlights
      if (highlightRes.data) {
        highlightRes.data.forEach(h => {
          index.push({
            type: language === 'id' ? 'Indikator' : 'Highlight',
            label: language === 'id' ? h.label_id : h.label_en,
            id: h.id,
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            path: '/investor/ringkasan-investor'
          });
        });
      }

      setSearchIndex(index);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Filtered Results based on searchIndex
  const filteredResults = searchQuery
    ? searchIndex.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase()))
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
    setIsSearchOpen(false);
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
        <div className="w-full px-5 sm:px-6 lg:px-8 mx-auto">
          <div className="flex items-center justify-between relative z-10 h-14 sm:h-16 lg:h-20 gap-2">
            {/* Logo Column */}
            <div className="flex-1 flex items-center justify-start min-w-0">
              <div
                className="cursor-pointer group flex-shrink-0"
                onClick={() => {
                  onNavigate('hero');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="flex items-center justify-start py-1">
                    <img
                    src={settings?.logo_url || "/logo-icon.png"}
                    alt="Penta Valent"
                    width="200"
                    height="64"
                    className={`${isScrolled ? 'h-9 sm:h-10 lg:h-14' : 'h-11 sm:h-12 lg:h-16'} w-auto transition-all duration-700 scale-100 group-hover:scale-105 relative z-10`}
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
                      className={`px-3 lg:px-4 py-2.5 rounded-full text-[12px] lg:text-[13px] font-black uppercase tracking-[0.16em] transition-all duration-500 relative flex items-center gap-2 group/btn ${isActive || (hasChildren && activeDropdown === menu.id)
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
                                  <div className="w-11 h-11 rounded-xl bg-white text-slate-400 flex items-center justify-center transition-all group-hover/item:bg-primary group-hover/item:text-white shadow-sm border border-slate-100 flex-shrink-0">
                                    {icons[child.path] || <ArrowRight size={20} />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[13px] font-black text-slate-800 uppercase tracking-tight group-hover/item:text-primary transition-colors flex items-center justify-between mb-0.5">
                                      <span className="pr-2 leading-tight">{language === 'id' ? child.label_id : child.label_en}</span>
                                    </div>
                                    <p className="text-[11.5px] font-medium text-slate-500 leading-tight line-clamp-2">
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

            {/* Actions Column - Symmetric with logo side */}
            <div className="flex-1 flex items-center justify-end xl:justify-center gap-2 xl:gap-3 min-w-0">
              {/* Bilingual Switch - Desktop */}
              <div 
                className={`hidden lg:flex items-center rounded-full p-1 border transition-all duration-500 flex-shrink-0 relative cursor-pointer ${
                  isScrolled ? 'border-slate-200 bg-slate-100/80' : 'border-white/20 bg-white/10'
                }`}
                onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              >
                <div className="flex items-center relative z-10">
                  <div className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${language === 'id' ? 'text-white' : (isScrolled ? 'text-slate-400' : 'text-white/40')}`}>ID</div>
                  <div className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${language === 'en' ? 'text-white' : (isScrolled ? 'text-slate-400' : 'text-white/40')}`}>EN</div>
                </div>
                
                {/* Switch Slider */}
                <motion.div 
                  className="absolute top-1 bottom-1 rounded-full bg-slate-900 shadow-lg z-0"
                  initial={false}
                  animate={{ 
                    left: language === 'id' ? '4px' : '38px',
                    right: language === 'id' ? '38px' : '4px'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`flex p-2 rounded-full border transition-all duration-500 ${isScrolled ? 'border-slate-200 bg-slate-50 text-slate-400 hover:text-primary' : 'border-white/20 bg-white/10 text-white/70 hover:text-white hover:border-white/40'}`}
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={2.5} />
                </button>

                <button
                  className={`xl:hidden p-2 rounded-full transition-all duration-500 touch-active ${isScrolled ? 'text-primary bg-slate-50' : 'text-white bg-white/10'}`}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle Menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
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

      {/* Mobile Menu Overlay - Ultra Modern Glass Style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[110] overflow-hidden">
            {/* Backdrop with deeper blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white/95 backdrop-blur-3xl flex flex-col"
            >
              {/* Header inside menu - Minimalist */}
              <div className="pt-10 pb-6 px-8 flex items-center justify-between">
                <img src="/logo-icon.png" alt="Penta Valent" className="h-8 w-auto grayscale opacity-80" />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              {/* Menu Content - Airy & Elegant */}
              <div className="flex-1 overflow-y-auto py-4 px-8 custom-scrollbar">
                <nav className="space-y-1">
                  {parentMenus.map((menu, idx) => {
                    const children = getChildMenus(menu.id);
                    const hasChildren = children.length > 0;
                    const menuLabel = language === 'id' ? menu.label_id : menu.label_en;
                    const isOpen = activeDropdown === menu.id;
                    const menuPath = menu.path.startsWith('#') ? menu.path.substring(1) : menu.path;
                    const isActive = activeSection === menuPath || (activeSection === 'beranda' && (menuPath === '' || menuPath === 'home' || menuPath === 'hero'));

                    return (
                      <motion.div 
                        key={menu.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + (idx * 0.04) }}
                        className="py-1"
                      >
                        <button
                          onClick={() => hasChildren ? setActiveDropdown(isOpen ? null : menu.id) : handleLinkClick(menu.path)}
                          className={`w-full text-left py-4 transition-all flex items-center justify-between group`}
                        >
                          <div className="flex items-center gap-5">
                            <div className={`transition-colors duration-500 ${isActive ? 'text-primary' : 'text-slate-300 group-hover:text-slate-600'}`}>
                              {menu.label_en.toLowerCase().includes('home') ? <Layout size={22} strokeWidth={1.5} /> : 
                               menu.label_en.toLowerCase().includes('about') ? <Building2 size={22} strokeWidth={1.5} /> :
                               menu.label_en.toLowerCase().includes('business') ? <Target size={22} strokeWidth={1.5} /> :
                               menu.label_en.toLowerCase().includes('investor') ? <TrendingUp size={22} strokeWidth={1.5} /> :
                               menu.label_en.toLowerCase().includes('news') ? <Newspaper size={22} strokeWidth={1.5} /> :
                               menu.label_en.toLowerCase().includes('career') ? <Briefcase size={22} strokeWidth={1.5} /> :
                               <ArrowRight size={22} strokeWidth={1.5} />}
                            </div>
                            <span className={`text-lg tracking-tight transition-all duration-500 ${isActive ? 'font-black text-slate-900 scale-105' : 'font-medium text-slate-500 group-hover:text-slate-800'}`}>
                              {menuLabel}
                            </span>
                          </div>
                          
                          {hasChildren ? (
                            <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-primary' : 'text-slate-300'}`}>
                              <ChevronDown size={20} strokeWidth={1.5} />
                            </div>
                          ) : (
                            <ArrowRight size={18} strokeWidth={1.5} className={`transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100 text-primary' : '-translate-x-2 opacity-0 text-slate-300'}`} />
                          )}
                        </button>

                        {/* Minimalist Submenu */}
                        <AnimatePresence>
                          {hasChildren && isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden ml-11 space-y-1"
                            >
                              {children.map((child, cIdx) => (
                                <motion.button
                                  key={child.id}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: cIdx * 0.03 }}
                                  onClick={() => handleLinkClick(child.path)}
                                  className="w-full text-left py-3 text-[15px] font-medium text-slate-400 hover:text-primary transition-colors flex items-center justify-between"
                                >
                                  <span>{language === 'id' ? child.label_id : child.label_en}</span>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Minimalist Language Switcher */}
              <div className="p-10">
                <div 
                  className="relative bg-slate-50 rounded-full p-1 flex items-center cursor-pointer border border-slate-100 w-32 mx-auto h-11"
                  onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                >
                  <motion.div 
                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white shadow-sm border border-slate-100 rounded-full z-0"
                    initial={false}
                    animate={{ x: language === 'id' ? 0 : '100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  />
                  
                  <div className="flex-1 text-center relative z-10">
                    <span className={`text-[10px] font-black tracking-widest transition-colors duration-500 ${language === 'id' ? 'text-slate-900' : 'text-slate-400'}`}>ID</span>
                  </div>
                  <div className="flex-1 text-center relative z-10">
                    <span className={`text-[10px] font-black tracking-widest transition-colors duration-500 ${language === 'en' ? 'text-slate-900' : 'text-slate-400'}`}>EN</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Search Modal Spotlight */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4"
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
              onClick={() => setIsSearchOpen(false)}
            ></motion.div>

            {/* Modal Container */}
            <motion.div 
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col max-h-[75vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input Area */}
              <div className="relative border-b border-slate-100 p-6 sm:p-8 flex items-center gap-4 bg-white z-20">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary flex-shrink-0">
                  <Search size={24} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'id' ? "Cari berita, laporan, bisnis..." : "Search news, reports, business..."}
                  className="w-full text-lg sm:text-xl font-bold bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-300 h-full"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Results or Suggestions Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/30 custom-scrollbar">
                {searchQuery ? (
                  filteredResults.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-4 py-2">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          {language === 'id' ? 'Hasil Pencarian' : 'Search Results'}
                        </h5>
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {filteredResults.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {filteredResults.map(item => (
                          <button 
                            key={item.id} 
                            onClick={() => { 
                              if (item.isExternal) {
                                window.open(item.path, '_blank');
                              } else {
                                handleLinkClick(item.path); 
                              }
                              setIsSearchOpen(false); 
                            }} 
                            className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all text-left group"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-primary transition-colors truncate">
                                {item.label}
                              </h4>
                              <p className="text-[10px] sm:text-[11px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                                {item.type}
                              </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all flex-shrink-0">
                              <ArrowRight size={14} strokeWidth={3} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                      <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Search size={40} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2 italic">
                        {language === 'id' ? 'Tidak Ditemukan' : 'No Results Found'}
                      </h3>
                      <p className="text-slate-400 text-sm font-medium">
                        {language === 'id' ? `Tidak ada hasil untuk "${searchQuery}"` : `No matches for "${searchQuery}"`}
                      </p>
                    </div>
                  )
                ) : (
                  <div className="space-y-8 py-4">
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">
                        {language === 'id' ? 'Tautan Cepat' : 'Quick Access'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
                        {menus
                          .filter(m => !m.parent_id && m.location !== 'footer')
                          .slice(0, 4)
                          .map(item => (
                            <button
                              key={item.id}
                              onClick={() => { handleLinkClick(item.path); setIsSearchOpen(false); }}
                              className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all text-left group"
                            >
                              <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <ArrowRight size={16} strokeWidth={3} />
                              </div>
                              <span className="text-xs font-black uppercase tracking-widest text-slate-700 group-hover:text-primary transition-colors">
                                {language === 'id' ? item.label_id : item.label_en}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Popular Categories */}
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">
                        {language === 'id' ? 'Kategori Populer' : 'Popular Categories'}
                      </h5>
                      <div className="flex flex-wrap gap-2 px-2">
                        {['News', 'Business', 'Report', 'Investor'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSearchQuery(cat)}
                            className="px-5 py-2.5 rounded-full bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-primary hover:text-primary transition-all shadow-sm"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer Hint */}
              <div className="p-4 bg-white border-t border-slate-50 text-center">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                  {language === 'id' ? 'Tekan ESC untuk menutup' : 'Press ESC to close'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
